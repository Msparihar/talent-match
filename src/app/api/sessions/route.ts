import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { screeningSession, document } from "@/lib/schema";
import { eq, and, desc, or, ilike } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const screeningResultSchema = z.object({
  matchScore: z.number().min(0).max(100).describe('Match percentage between 0-100'),
  strengths: z.array(z.string()).describe('Key strengths of the candidate'),
  gaps: z.array(z.string()).describe('Missing skills or experience'),
  insights: z.array(z.string()).describe('Important observations about the candidate'),
  summary: z.string().describe('Brief overall assessment (2-3 sentences)'),
});

// GET /api/sessions - List user's sessions with pagination and filtering
export async function GET(request: NextRequest) {
  console.log("[Sessions] GET /api/sessions - Fetching sessions");

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log("[Sessions] Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const archived = searchParams.get("archived") === "true";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "lastActivity";

    console.log("[Sessions] Query params:", { userId, limit, offset, archived, search, sortBy });

    // Build query conditions
    let conditions = and(
      eq(screeningSession.userId, userId),
      eq(screeningSession.isArchived, archived)
    );

    // Add search filter if provided
    if (search) {
      conditions = and(
        conditions,
        or(
          ilike(screeningSession.title, `%${search}%`),
          ilike(screeningSession.candidateName, `%${search}%`),
          ilike(screeningSession.jobTitle, `%${search}%`)
        )
      );
    }

    // Query sessions
    const sessions = await db
      .select({
        id: screeningSession.id,
        title: screeningSession.title,
        candidateName: screeningSession.candidateName,
        jobTitle: screeningSession.jobTitle,
        matchScore: screeningSession.matchScore,
        messageCount: screeningSession.messageCount,
        isPinned: screeningSession.isPinned,
        isArchived: screeningSession.isArchived,
        lastActivityAt: screeningSession.lastActivityAt,
        createdAt: screeningSession.createdAt,
        resumeId: screeningSession.resumeId,
        jobDescriptionId: screeningSession.jobDescriptionId,
      })
      .from(screeningSession)
      .where(conditions)
      .orderBy(
        sortBy === "lastActivity"
          ? desc(screeningSession.lastActivityAt)
          : desc(screeningSession.createdAt)
      )
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: screeningSession.id })
      .from(screeningSession)
      .where(conditions);

    const total = totalResult.length;
    const hasMore = offset + limit < total;

    console.log("[Sessions] ✅ Fetched sessions:", { count: sessions.length, total, hasMore });

    return NextResponse.json({
      sessions,
      total,
      hasMore,
    });
  } catch (error) {
    console.error("[Sessions] ❌ Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  console.log("[Sessions] POST /api/sessions - Creating new session");

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log("[Sessions] Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { resumeId, jobDescriptionId } = body;

    console.log("[Sessions] Request:", { userId, resumeId, jobDescriptionId });

    if (!resumeId || !jobDescriptionId) {
      console.log("[Sessions] Missing required fields");
      return NextResponse.json(
        { error: "resumeId and jobDescriptionId are required" },
        { status: 400 }
      );
    }

    // Verify documents belong to user
    const [resumeDoc, jdDoc] = await Promise.all([
      db.select().from(document).where(
        and(
          eq(document.id, resumeId),
          eq(document.userId, userId)
        )
      ),
      db.select().from(document).where(
        and(
          eq(document.id, jobDescriptionId),
          eq(document.userId, userId)
        )
      ),
    ]);

    console.log("[Sessions] Documents found:", {
      resumeFound: resumeDoc.length > 0,
      jdFound: jdDoc.length > 0
    });

    if (resumeDoc.length === 0 || jdDoc.length === 0) {
      console.log("[Sessions] Documents not found or unauthorized");
      return NextResponse.json(
        { error: "Documents not found or unauthorized" },
        { status: 404 }
      );
    }

    // Extract candidate name and job title from documents
    // This is a simple extraction - in production, you'd use better NLP
    const candidateName = extractCandidateName(resumeDoc[0].content);
    const jobTitle = extractJobTitle(jdDoc[0].content);
    const title = `${candidateName} - ${jobTitle}`;

    console.log("[Sessions] Extracted info:", { candidateName, jobTitle, title });

    // Analyze resume vs job description
    console.log("[Sessions] Analyzing match score...");
    let analysis = null;

    try {
      const { object } = await generateObject({
        model: google('gemini-2.0-flash-exp'),
        schema: screeningResultSchema,
        prompt: `You are an expert resume screening assistant. Analyze the following resume against the job description and provide a comprehensive evaluation.

**Job Description:**
${jdDoc[0].content}

**Resume:**
${resumeDoc[0].content}

Analyze the match between the candidate and the job requirements. Provide:
1. A match score (0-100) based on how well the candidate fits the role
2. Key strengths that align with the job requirements
3. Gaps or missing qualifications
4. Important insights about the candidate
5. A brief overall summary

Be specific and reference actual skills, experience, and requirements from both documents.`,
      });

      analysis = object;
      console.log("[Sessions] Analysis completed:", { matchScore: analysis.matchScore });
    } catch (error) {
      console.error("[Sessions] ⚠️  Analysis failed, creating session without score:", error);
    }

    // Create session with analysis results
    const [newSession] = await db
      .insert(screeningSession)
      .values({
        userId,
        resumeId,
        jobDescriptionId,
        title,
        candidateName,
        jobTitle,
        matchScore: analysis?.matchScore ?? null,
        strengths: analysis?.strengths ?? null,
        gaps: analysis?.gaps ?? null,
        insights: analysis?.insights ?? null,
        summary: analysis?.summary ?? null,
        messageCount: 0,
        isPinned: false,
        isArchived: false,
        lastActivityAt: new Date(),
      })
      .returning();

    console.log("[Sessions] ✅ Session created:", {
      sessionId: newSession.id,
      title,
      matchScore: newSession.matchScore
    });
    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error("[Sessions] ❌ Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// Helper function to extract candidate name from resume
function extractCandidateName(content: string): string {
  // Simple extraction - looks for first line or NAME: pattern
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If first line looks like a name (2-3 words, capitalized)
    const words = firstLine.split(" ").filter((w) => w.length > 0);
    if (words.length >= 2 && words.length <= 4) {
      return words.slice(0, 3).join(" ");
    }
  }
  return "Candidate";
}

// Helper function to extract job title from job description
function extractJobTitle(content: string): string {
  // Simple extraction - looks for common patterns
  const lines = content.split("\n").filter((l) => l.trim());

  // Look for patterns like "Position:", "Job Title:", "Role:", etc.
  for (const line of lines.slice(0, 10)) {
    const lower = line.toLowerCase();
    if (
      lower.includes("position:") ||
      lower.includes("job title:") ||
      lower.includes("role:")
    ) {
      const title = line.split(":")[1]?.trim();
      if (title) return title;
    }
  }

  // Fallback to first substantial line
  const firstLine = lines.find((l) => l.length > 10 && l.length < 100);
  return firstLine?.slice(0, 50) || "Position";
}
