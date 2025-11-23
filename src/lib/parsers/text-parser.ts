export function parseText(buffer: Buffer): string {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('Error parsing text file:', error);
    throw new Error('Failed to parse text file');
  }
}

export function cleanText(text: string): string {
  // Remove excessive whitespace and normalize line breaks
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}
