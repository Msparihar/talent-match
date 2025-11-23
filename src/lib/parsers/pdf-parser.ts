import { PDFParse } from 'pdf-parse';

interface PDFParseResult {
  text: string;
  numpages?: number;
  info?: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function parsePDFWithMetadata(buffer: Buffer): Promise<{
  text: string;
  pages: number;
  info: Record<string, unknown>;
}> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = (await parser.getText()) as PDFParseResult;
    return {
      text: result.text,
      pages: result.numpages || 0,
      info: result.info || {},
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}
