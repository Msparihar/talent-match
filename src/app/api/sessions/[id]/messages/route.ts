import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatMessage, screeningSession } from "@/lib/schema";
import { eq, and, lt, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET /api/sessions/[id]/messages - Load chat history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = (await params).id;
    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before"); // messageId for cursor-based pagination

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

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Build query
    let query = db
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.screeningSessionId, sessionId))
      .orderBy(desc(chatMessage.createdAt))
      .limit(limit + 1); // Fetch one extra to check if there are more

    // If before cursor is provided, fetch messages before that
    if (before) {
      const [beforeMessage] = await db
        .select()
        .from(chatMessage)
        .where(eq(chatMessage.id, before));

      if (beforeMessage) {
        query = db
          .select()
          .from(chatMessage)
          .where(
            and(
              eq(chatMessage.screeningSessionId, sessionId),
              lt(chatMessage.createdAt, beforeMessage.createdAt)
            )
          )
          .orderBy(desc(chatMessage.createdAt))
          .limit(limit + 1);
      }
    }

    const messages = await query;
    const hasMore = messages.length > limit;

    // Remove the extra message if we have more
    if (hasMore) {
      messages.pop();
    }

    // Reverse to get chronological order (oldest first)
    messages.reverse();

    return NextResponse.json({
      messages,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/sessions/[id]/messages - Save individual message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = (await params).id;
    const body = await request.json();

    const { role, content, tempId } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "role and content are required" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

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

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Insert message
    const [message] = await db
      .insert(chatMessage)
      .values({
        screeningSessionId: sessionId,
        role,
        content,
        status: "sent",
      })
      .returning();

    // Update session's lastActivityAt and messageCount
    await db
      .update(screeningSession)
      .set({
        lastActivityAt: new Date(),
        messageCount: sessionData.messageCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(screeningSession.id, sessionId));

    return NextResponse.json({
      message,
      tempId, // Return tempId for client to match optimistic UI
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
