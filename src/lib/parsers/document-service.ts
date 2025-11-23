import { parsePDFWithMetadata } from './pdf-parser';
import { parseText, cleanText } from './text-parser';

export interface ParsedDocument {
  content: string;
  metadata: {
    mimeType: string;
    size: number;
    pages?: number;
    info?: Record<string, unknown>;
  };
}

export async function parseDocument(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ParsedDocument> {
  let content: string;
  const metadata: ParsedDocument['metadata'] = {
    mimeType,
    size: buffer.length,
  };

  try {
    if (mimeType === 'application/pdf') {
      const pdfData = await parsePDFWithMetadata(buffer);
      content = cleanText(pdfData.text);
      metadata.pages = pdfData.pages;
      metadata.info = pdfData.info;
    } else if (mimeType === 'text/plain' || fileName.endsWith('.txt')) {
      content = cleanText(parseText(buffer));
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Document appears to be empty');
    }

    return {
      content,
      metadata,
    };
  } catch (error) {
    console.error('Error parsing document:', error);
    throw error instanceof Error ? error : new Error('Failed to parse document');
  }
}

export function validateFileType(mimeType: string, fileName: string): boolean {
  const allowedTypes = ['application/pdf', 'text/plain'];
  const allowedExtensions = ['.pdf', '.txt'];

  return (
    allowedTypes.includes(mimeType) ||
    allowedExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
  );
}

export function validateFileSize(size: number, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}
