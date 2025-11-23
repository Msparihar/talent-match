import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { screeningSession } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

// POST /api/sessions/[id]/restore - Restore recently deleted session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("[Sessions] POST /api/sessions/:id/restore - Restoring session:", id);

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
    const { undoToken } = body;

    console.log("[Sessions] Restore request:", { userId, sessionId, hasToken: !!undoToken });

    if (!undoToken) {
      console.log("[Sessions] Missing undo token");
      return NextResponse.json(
        { error: "undoToken is required" },
        { status: 400 }
      );
    }

    // Verify undo token
    try {
      const decoded = Buffer.from(undoToken, "base64").toString();
      const [tokenSessionId, timestamp] = decoded.split(":");

      if (tokenSessionId !== sessionId) {
        console.log("[Sessions] Token session ID mismatch");
        return NextResponse.json(
          { error: "Invalid undo token" },
          { status: 400 }
        );
      }

      // Check if token is still valid (5 minutes)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (now - tokenTime > fiveMinutes) {
        console.log("[Sessions] Token expired");
        return NextResponse.json(
          { error: "Undo token expired" },
          { status: 400 }
        );
      }

      console.log("[Sessions] Token validated successfully");
    } catch {
      console.log("[Sessions] Invalid token format");
      return NextResponse.json(
        { error: "Invalid undo token format" },
        { status: 400 }
      );
    }

    // Verify session belongs to user and is archived
    const [sessionData] = await db
      .select()
      .from(screeningSession)
      .where(
        and(
          eq(screeningSession.id, sessionId),
          eq(screeningSession.userId, userId),
          eq(screeningSession.isArchived, true)
        )
      );

    if (!sessionData) {
      console.log("[Sessions] Session not found or not archived");
      return NextResponse.json(
        { error: "Session not found or not archived" },
        { status: 404 }
      );
    }

    // Restore session
    const [restoredSession] = await db
      .update(screeningSession)
      .set({
        isArchived: false,
        updatedAt: new Date(),
      })
      .where(eq(screeningSession.id, sessionId))
      .returning();

    console.log("[Sessions] ✅ Session restored:", { title: restoredSession.title });

    return NextResponse.json({
      message: "Session restored",
      session: restoredSession,
    });
  } catch (error) {
    console.error("[Sessions] ❌ Error restoring session:", error);
    return NextResponse.json(
      { error: "Failed to restore session" },
      { status: 500 }
    );
  }
}
