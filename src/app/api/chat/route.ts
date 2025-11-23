import { google } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";
import { queryResumeScreening } from "@/lib/rag/rag-service";
import { db } from "@/lib/db";
import { chatMessage, screeningSession } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  console.log("[Chat] POST /api/chat - Processing chat message");

  // Read sessionId from query parameters
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');

  console.log("[Chat] Session ID from query:", sessionId);

  // Get user session for authentication
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;

  if (!userId) {
    console.log("[Chat] No user ID found in session");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse request body
  const body = await req.json();
  const { messages }: { messages: UIMessage[] } = body;

  const lastMessage = messages[messages.length - 1];

  // Extract text content from message parts
  const queryContent =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lastMessage as any).parts?.[0]?.text || (lastMessage as any).content || "";

  // Fetch session data from database if sessionId is provided
  let resumeId: string | undefined;
  let jobDescriptionId: string | undefined;
  let resumeFileName: string | undefined;
  let jobDescriptionFileName: string | undefined;

  if (sessionId) {
    console.log("[Chat] Fetching session data from database");
    try {
      const [sessionData] = await db
        .select()
        .from(screeningSession)
        .where(
          and(
            eq(screeningSession.id, sessionId),
            eq(screeningSession.userId, userId)
          )
        );

      if (sessionData) {
        resumeId = sessionData.resumeId;
        jobDescriptionId = sessionData.jobDescriptionId;

        // Fetch document details to get filenames
        const { document } = await import("@/lib/schema");
        const [resumeDoc] = await db
          .select({ fileName: document.fileName })
          .from(document)
          .where(eq(document.id, sessionData.resumeId));

        const [jdDoc] = await db
          .select({ fileName: document.fileName })
          .from(document)
          .where(eq(document.id, sessionData.jobDescriptionId));

        resumeFileName = resumeDoc?.fileName;
        jobDescriptionFileName = jdDoc?.fileName;

        console.log("[Chat] ✅ Session data retrieved:", {
          sessionId,
          resumeId,
          jobDescriptionId,
          resumeFileName,
          jobDescriptionFileName,
        });
      } else {
        console.log("[Chat] ⚠️  Session not found or unauthorized");
      }
    } catch (error) {
      console.error("[Chat] ❌ Error fetching session data:", error);
    }
  }

  console.log("[Chat] Request context:", {
    sessionId,
    resumeId,
    jobDescriptionId,
    hasQuery: !!queryContent,
    messageCount: messages.length
  });
  if (sessionId && lastMessage?.role === "user" && queryContent && userId) {
    console.log("[Chat] Storing user message for session:", sessionId);
    try {
      // Verify session belongs to user
      const [sessionData] = await db
        .select()
        .from(screeningSession)
        .where(
          and(
            eq(screeningSession.id, sessionId),
            eq(screeningSession.userId, userId)
          )
        );

      if (sessionData) {
        // Store user message
        await db.insert(chatMessage).values({
          screeningSessionId: sessionId,
          role: "user",
          content: queryContent,
          status: "sent",
        });

        // Update session activity
        await db
          .update(screeningSession)
          .set({
            lastActivityAt: new Date(),
            messageCount: sessionData.messageCount + 1,
            updatedAt: new Date(),
          })
          .where(eq(screeningSession.id, sessionId));

        console.log("[Chat] ✅ User message stored, message count:", sessionData.messageCount + 1);
      } else {
        console.log("[Chat] ⚠️  Session not found or unauthorized");
      }
    } catch (error) {
      console.error("[Chat] ❌ Error storing user message:", error);
    }
  }

  // If resumeId and jobDescriptionId are provided, use RAG
  if (resumeId && jobDescriptionId && queryContent) {
    console.log("[Chat] Using RAG mode - retrieving context");
    console.log("[Chat] Query:", queryContent.substring(0, 100) + "...");

    // Use RAG to get relevant context
    const ragResult = await queryResumeScreening(
      queryContent,
      resumeId,
      jobDescriptionId,
      { topK: 3, threshold: 0.3 }
    );

    console.log("[Chat] RAG context retrieved:", {
      relevantChunks: ragResult.relevantChunks,
      contextLength: ragResult.context.length
    });

    // Build messages for AI with RAG context
    // Convert messages to simple format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const simpleMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content || '',
    }));

    // Replace last message with RAG-enhanced version
    simpleMessages[simpleMessages.length - 1] = {
      role: 'user',
      content: ragResult.formattedPrompt.userMessage,
    };

    // Enhanced system prompt with document context
    const enhancedSystemPrompt = `${ragResult.formattedPrompt.systemPrompt}

**Document Context:**
- Resume: ${resumeFileName || 'Unknown resume'}
- Job Description: ${jobDescriptionFileName || 'Unknown job description'}

Use the provided context from these documents to answer questions accurately. If the context doesn't contain enough information to answer the question, acknowledge this and provide what you can based on the available information.`;

    console.log("[Chat] Generating AI response with RAG context");

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: enhancedSystemPrompt,
      messages: simpleMessages,
      onFinish: async ({ text }) => {
        console.log("[Chat] AI response completed, storing assistant message");
        // Store assistant response after streaming completes
        if (sessionId && userId) {
          try {
            const [sessionData] = await db
              .select()
              .from(screeningSession)
              .where(
                and(
                  eq(screeningSession.id, sessionId),
                  eq(screeningSession.userId, userId)
                )
              );

            if (sessionData) {
              await db.insert(chatMessage).values({
                screeningSessionId: sessionId,
                role: "assistant",
                content: text,
                status: "sent",
              });

              await db
                .update(screeningSession)
                .set({
                  lastActivityAt: new Date(),
                  messageCount: sessionData.messageCount + 1,
                  updatedAt: new Date(),
                })
                .where(eq(screeningSession.id, sessionId));

              console.log("[Chat] ✅ Assistant message stored, message count:", sessionData.messageCount + 1);
            }
          } catch (error) {
            console.error("[Chat] ❌ Error storing assistant message:", error);
          }
        }
      },
    });

    return (
      result as unknown as { toUIMessageStreamResponse: () => Response }
    ).toUIMessageStreamResponse();
  }

  console.log("[Chat] Using non-RAG mode - direct AI response");

  // Convert messages to simple format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const simpleMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content || '',
  }));

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: simpleMessages,
    onFinish: async ({ text }) => {
      console.log("[Chat] AI response completed, storing assistant message");
      // Store assistant response after streaming completes
      if (sessionId && userId) {
        try {
          const [sessionData] = await db
            .select()
            .from(screeningSession)
            .where(
              and(
                eq(screeningSession.id, sessionId),
                eq(screeningSession.userId, userId)
              )
            );

          if (sessionData) {
            await db.insert(chatMessage).values({
              screeningSessionId: sessionId,
              role: "assistant",
              content: text,
              status: "sent",
            });

            await db
              .update(screeningSession)
              .set({
                lastActivityAt: new Date(),
                messageCount: sessionData.messageCount + 1,
                updatedAt: new Date(),
              })
              .where(eq(screeningSession.id, sessionId));

            console.log("[Chat] ✅ Assistant message stored, message count:", sessionData.messageCount + 1);
          }
        } catch (error) {
          console.error("[Chat] ❌ Error storing assistant message:", error);
        }
      }
    },
  });

  return (
    result as unknown as { toUIMessageStreamResponse: () => Response }
  ).toUIMessageStreamResponse();
}
