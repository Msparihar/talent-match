import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { document } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const fileType = searchParams.get('fileType'); // Optional filter

    let query = db
      .select({
        id: document.id,
        fileName: document.fileName,
        fileType: document.fileType,
        mimeType: document.mimeType,
        metadata: document.metadata,
        createdAt: document.createdAt,
      })
      .from(document)
      .where(eq(document.userId, session.user.id))
      .orderBy(desc(document.createdAt));

    // Apply optional fileType filter
    if (fileType && ['resume', 'job_description'].includes(fileType)) {
      query = db
        .select({
          id: document.id,
          fileName: document.fileName,
          fileType: document.fileType,
          mimeType: document.mimeType,
          metadata: document.metadata,
          createdAt: document.createdAt,
        })
        .from(document)
        .where(
          and(
            eq(document.userId, session.user.id),
            eq(document.fileType, fileType)
          )
        )
        .orderBy(desc(document.createdAt));
    }

    const documents = await query;

    return NextResponse.json({
      success: true,
      documents,
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch documents'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Delete document (and cascade to embeddings)
    await db
      .delete(document)
      .where(
        and(
          eq(document.id, documentId),
          eq(document.userId, session.user.id)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to delete document'
      },
      { status: 500 }
    );
  }
}
