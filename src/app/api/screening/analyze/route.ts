import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { document, screeningSession } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const screeningResultSchema = z.object({
  matchScore: z.number().min(0).max(100).describe('Match percentage between 0-100'),
  strengths: z.array(z.string()).describe('Key strengths of the candidate'),
  gaps: z.array(z.string()).describe('Missing skills or experience'),
  insights: z.array(z.string()).describe('Important observations about the candidate'),
  summary: z.string().describe('Brief overall assessment (2-3 sentences)'),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resumeId, jobDescriptionId } = body;

    if (!resumeId || !jobDescriptionId) {
      return NextResponse.json(
        { error: 'Both resumeId and jobDescriptionId are required' },
        { status: 400 }
      );
    }

    // Get both documents
    const [resume] = await db
      .select()
      .from(document)
      .where(
        and(
          eq(document.id, resumeId),
          eq(document.userId, session.user.id)
        )
      )
      .limit(1);

    const [jobDescription] = await db
      .select()
      .from(document)
      .where(
        and(
          eq(document.id, jobDescriptionId),
          eq(document.userId, session.user.id)
        )
      )
      .limit(1);

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume or job description not found' },
        { status: 404 }
      );
    }

    // Generate analysis using structured output
    const { object: analysis } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: screeningResultSchema,
      prompt: `You are an expert resume screening assistant. Analyze the following resume against the job description and provide a comprehensive evaluation.

**Job Description:**
${jobDescription.content}

**Resume:**
${resume.content}

Analyze the match between the candidate and the job requirements. Provide:
1. A match score (0-100) based on how well the candidate fits the role
2. Key strengths that align with the job requirements
3. Gaps or missing qualifications
4. Important insights about the candidate
5. A brief overall summary

Be specific and reference actual skills, experience, and requirements from both documents.`,
    });

    // Store screening session
    const [newSession] = await db.insert(screeningSession).values({
      userId: session.user.id,
      resumeId,
      jobDescriptionId,
      matchScore: analysis.matchScore,
      strengths: analysis.strengths,
      gaps: analysis.gaps,
      insights: analysis.insights,
      summary: analysis.summary,
    }).returning();

    return NextResponse.json({
      success: true,
      sessionId: newSession.id,
      analysis: {
        matchScore: analysis.matchScore,
        strengths: analysis.strengths,
        gaps: analysis.gaps,
        insights: analysis.insights,
        summary: analysis.summary,
      },
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to analyze resume'
      },
      { status: 500 }
    );
  }
}
