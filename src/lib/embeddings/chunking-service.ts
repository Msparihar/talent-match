export interface TextChunk {
  text: string;
  index: number;
  metadata?: {
    startChar: number;
    endChar: number;
    tokenCount?: number;
  };
}

export interface ChunkingOptions {
  chunkSize?: number; // Maximum characters per chunk
  overlap?: number; // Overlap between chunks in characters
  minChunkSize?: number; // Minimum characters per chunk
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  chunkSize: 800,
  overlap: 100,
  minChunkSize: 100,
};

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Split text into sentences (basic implementation)
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence boundaries while preserving the delimiter
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Chunk text into semantic sections with overlap
 */
export function chunkText(
  text: string,
  options: ChunkingOptions = {}
): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks: TextChunk[] = [];

  // Clean and normalize text
  const cleanedText = text.trim();
  if (cleanedText.length === 0) {
    return chunks;
  }

  // If text is smaller than chunk size, return as single chunk
  if (cleanedText.length <= opts.chunkSize) {
    return [{
      text: cleanedText,
      index: 0,
      metadata: {
        startChar: 0,
        endChar: cleanedText.length,
        tokenCount: estimateTokenCount(cleanedText),
      },
    }];
  }

  // Split into sentences for better semantic boundaries
  const sentences = splitIntoSentences(cleanedText);

  let currentChunk = '';
  let chunkIndex = 0;
  let startChar = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;

    if (potentialChunk.length > opts.chunkSize && currentChunk.length >= opts.minChunkSize) {
      // Save current chunk
      chunks.push({
        text: currentChunk.trim(),
        index: chunkIndex,
        metadata: {
          startChar,
          endChar: startChar + currentChunk.length,
          tokenCount: estimateTokenCount(currentChunk),
        },
      });

      // Start new chunk with overlap
      const overlapText = currentChunk.slice(-opts.overlap);
      currentChunk = overlapText + ' ' + sentence;
      startChar += currentChunk.length - overlapText.length - sentence.length - 1;
      chunkIndex++;
    } else {
      currentChunk = potentialChunk;
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.trim().length >= opts.minChunkSize) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunkIndex,
      metadata: {
        startChar,
        endChar: startChar + currentChunk.length,
        tokenCount: estimateTokenCount(currentChunk),
      },
    });
  }

  return chunks;
}

/**
 * Chunk multiple documents and add document-specific metadata
 */
export function chunkDocuments(
  documents: Array<{ id: string; content: string; type: string }>,
  options?: ChunkingOptions
): Array<TextChunk & { documentId: string; documentType: string }> {
  const allChunks: Array<TextChunk & { documentId: string; documentType: string }> = [];

  for (const doc of documents) {
    const chunks = chunkText(doc.content, options);
    const enrichedChunks = chunks.map(chunk => ({
      ...chunk,
      documentId: doc.id,
      documentType: doc.type,
    }));
    allChunks.push(...enrichedChunks);
  }

  return allChunks;
}
