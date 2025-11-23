import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { screeningSession, document } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET /api/sessions/[id] - Get session details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("[Sessions] GET /api/sessions/:id - Fetching session:", id);

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log("[Sessions] Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = id;

    console.log("[Sessions] Request:", { userId, sessionId });

    // Get session with document details
    const [sessionData] = await db
      .select({
        session: screeningSession,
        resume: document,
        jobDescription: document,
      })
      .from(screeningSession)
      .leftJoin(document, eq(screeningSession.resumeId, document.id))
      .where(
        and(
          eq(screeningSession.id, sessionId),
          eq(screeningSession.userId, userId)
        )
      );

    if (!sessionData || !sessionData.resume) {
      console.log("[Sessions] Session not found");
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get job description separately since we can't join same table twice easily
    const [jobDesc] = await db
      .select()
      .from(document)
      .where(eq(document.id, sessionData.session.jobDescriptionId));

    if (!jobDesc) {
      console.log("[Sessions] Job description not found");
      return NextResponse.json(
        { error: "Job description not found" },
        { status: 404 }
      );
    }

    console.log("[Sessions] ✅ Session fetched:", { title: sessionData.session.title });

    return NextResponse.json({
      session: sessionData.session,
      resume: {
        id: sessionData.resume.id,
        fileName: sessionData.resume.fileName,
        fileType: sessionData.resume.fileType,
      },
      jobDescription: {
        id: jobDesc.id,
        fileName: jobDesc.fileName,
        fileType: jobDesc.fileType,
      },
    });
  } catch (error) {
    console.error("[Sessions] ❌ Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[id] - Update session metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("[Sessions] PATCH /api/sessions/:id - Updating session:", id);

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log("[Sessions] Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = id;
    const body = await request.json();

    const { title, isPinned, isArchived } = body;

    console.log("[Sessions] Update request:", { userId, sessionId, updates: body });

    // Verify session belongs to user
    const [existingSession] = await db
      .select()
      .from(screeningSession)
      .where(
        and(
          eq(screeningSession.id, sessionId),
          eq(screeningSession.userId, userId)
        )
      );

    if (!existingSession) {
      console.log("[Sessions] Session not found");
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update session
    const updates: Record<string, string | boolean | Date> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title;
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (isArchived !== undefined) updates.isArchived = isArchived;

    const [updatedSession] = await db
      .update(screeningSession)
      .set(updates)
      .where(eq(screeningSession.id, sessionId))
      .returning();

    console.log("[Sessions] ✅ Session updated:", { title: updatedSession.title });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("[Sessions] ❌ Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Soft delete (archive) a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const permanent = searchParams.get("permanent") === "true";
  console.log("[Sessions] DELETE /api/sessions/:id - Deleting session:", { id, permanent });

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log("[Sessions] Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = id;

    console.log("[Sessions] Delete request:", { userId, sessionId, permanent });

    // Verify session belongs to user
    const [existingSession] = await db
      .select()
      .from(screeningSession)
      .where(
        and(
          eq(screeningSession.id, sessionId),
          eq(screeningSession.userId, userId)
        )
      );

    if (!existingSession) {
      console.log("[Sessions] Session not found");
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (permanent) {
      // Hard delete
      await db
        .delete(screeningSession)
        .where(eq(screeningSession.id, sessionId));

      console.log("[Sessions] ✅ Session permanently deleted");
      return NextResponse.json({ message: "Session permanently deleted" });
    } else {
      // Soft delete (archive)
      const [archivedSession] = await db
        .update(screeningSession)
        .set({
          isArchived: true,
          updatedAt: new Date(),
        })
        .where(eq(screeningSession.id, sessionId))
        .returning();

      // Generate undo token (simple timestamp-based token for demo)
      const undoToken = Buffer.from(`${sessionId}:${Date.now()}`).toString(
        "base64"
      );

      console.log("[Sessions] ✅ Session archived");
      return NextResponse.json({
        message: "Session archived",
        session: archivedSession,
        undoToken,
      });
    }
  } catch (error) {
    console.error("[Sessions] ❌ Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
