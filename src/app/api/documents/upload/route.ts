import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { document } from '@/lib/schema';
import { parseDocument, validateFileType, validateFileSize } from '@/lib/parsers/document-service';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'resume' or 'job_description'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!fileType || !['resume', 'job_description'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "resume" or "job_description"' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.type, file.name)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF and TXT files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (!validateFileSize(file.size, 10)) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse document
    const parsed = await parseDocument(buffer, file.type, file.name);

    // Store in database
    const [newDocument] = await db.insert(document).values({
      userId: session.user.id,
      fileName: file.name,
      fileType: fileType,
      mimeType: file.type,
      content: parsed.content,
      metadata: parsed.metadata,
    }).returning();

    return NextResponse.json({
      success: true,
      document: {
        id: newDocument.id,
        fileName: newDocument.fileName,
        fileType: newDocument.fileType,
        mimeType: newDocument.mimeType,
        createdAt: newDocument.createdAt,
        contentLength: parsed.content.length,
        metadata: parsed.metadata,
      },
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload document',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
