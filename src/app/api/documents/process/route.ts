import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { document } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { processDocument } from '@/lib/embeddings/vector-store';

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
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document from database
    const [doc] = await db
      .select()
      .from(document)
      .where(
        and(
          eq(document.id, documentId),
          eq(document.userId, session.user.id)
        )
      )
      .limit(1);

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Process document and generate embeddings
    await processDocument(doc.id, doc.content);

    return NextResponse.json({
      success: true,
      message: 'Document processed successfully',
      documentId: doc.id,
    });

  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process document'
      },
      { status: 500 }
    );
  }
}
