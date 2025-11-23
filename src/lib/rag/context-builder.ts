import { SearchResult } from '@/lib/embeddings/vector-store';

/**
 * Format retrieved chunks into a context string for the LLM
 */
export function buildContext(chunks: SearchResult[]): string {
  if (chunks.length === 0) {
    return 'No relevant context found.';
  }

  const formattedChunks = chunks.map((chunk, index) => {
    const docType = chunk.documentType === 'resume' ? 'Resume' : 'Job Description';
    const fileName = chunk.documentFileName || 'Unknown';
    return `[${index + 1}] ${docType} (${fileName}):\n${chunk.chunkText}\n(Relevance: ${(chunk.similarity * 100).toFixed(1)}%)`;
  });

  return formattedChunks.join('\n\n---\n\n');
}

/**
 * Build context specifically for resume screening
 */
export function buildResumeScreeningContext(
  resumeChunks: SearchResult[],
  jobDescriptionChunks: SearchResult[]
): string {
  let context = '';

  if (resumeChunks.length > 0) {
    context += '## RELEVANT RESUME SECTIONS:\n\n';
    resumeChunks.forEach((chunk, index) => {
      context += `[Resume-${index + 1}] ${chunk.chunkText}\n\n`;
    });
  }

  if (jobDescriptionChunks.length > 0) {
    context += '## RELEVANT JOB DESCRIPTION SECTIONS:\n\n';
    jobDescriptionChunks.forEach((chunk, index) => {
      context += `[JD-${index + 1}] ${chunk.chunkText}\n\n`;
    });
  }

  if (resumeChunks.length === 0 && jobDescriptionChunks.length === 0) {
    context = 'No relevant context found in the documents.';
  }

  return context;
}

/**
 * Build system prompt for resume screening chat
 */
export function buildResumeScreeningSystemPrompt(): string {
  return `You are an expert resume screening assistant. Your role is to help recruiters evaluate candidates by answering questions about their resume in relation to a job description.

**Instructions:**
1. Answer questions based ONLY on the provided resume and job description context
2. Be specific and cite relevant sections when answering
3. If information is not available in the context, clearly state "This information is not mentioned in the resume/job description"
4. Be objective and professional in your assessments
5. For yes/no questions, provide a clear answer followed by supporting evidence
6. Highlight both strengths and potential concerns when relevant

**Context Format:**
You will receive relevant sections from both the resume and job description. Use these to answer the user's questions accurately.`;
}

/**
 * Format a message with RAG context for the LLM
 */
export function formatMessageWithContext(
  userMessage: string,
  context: string,
  systemPrompt?: string
): { systemPrompt: string; userMessage: string } {
  const finalSystemPrompt = systemPrompt || buildResumeScreeningSystemPrompt();

  const formattedUserMessage = `${context}

---

**User Question:** ${userMessage}

Please answer based on the context provided above.`;

  return {
    systemPrompt: finalSystemPrompt,
    userMessage: formattedUserMessage,
  };
}
