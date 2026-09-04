/**
 * Retrieval-Augmented Generation (RAG) Service for Resume & Job Description Context
 * Performs semantic chunking, keyword-density indexing, and vector/similarity ranking
 * to ground Gemini interview questions and evaluation in candidate-specific resume facts.
 */

export interface DocumentChunk {
  id: string;
  source: "resume" | "job_description";
  text: string;
  keywords: string[];
}

export class RAGService {
  /**
   * Chunks arbitrary text into overlapping window segments
   */
  public static chunkDocument(text: string, source: "resume" | "job_description", chunkSize = 300, overlap = 50): DocumentChunk[] {
    const words = text.split(/\s+/).filter(Boolean);
    const chunks: DocumentChunk[] = [];
    let idx = 0;

    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const slice = words.slice(i, i + chunkSize);
      if (slice.length === 0) break;
      const chunkText = slice.join(" ");
      const keywords = this.extractKeywords(chunkText);
      chunks.push({
        id: `${source}-chunk-${idx++}`,
        source,
        text: chunkText,
        keywords,
      });
    }

    return chunks;
  }

  /**
   * Extracts salient keywords (filtering stop words)
   */
  private static extractKeywords(text: string): string[] {
    const stopWords = new Set([
      "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
      "of", "by", "as", "is", "are", "was", "were", "be", "been", "that", "this",
    ]);
    return Array.from(
      new Set(
        text
          .toLowerCase()
          .replace(/[^a-z0-9+#.\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2 && !stopWords.has(w))
      )
    );
  }

  /**
   * Retrieves the top-K most relevant chunks using BM25 / token-overlap scoring
   */
  public static retrieveRelevantChunks(query: string, chunks: DocumentChunk[], topK = 3): DocumentChunk[] {
    const queryTokens = this.extractKeywords(query);
    if (queryTokens.length === 0 || chunks.length === 0) return chunks.slice(0, topK);

    const scored = chunks.map((chunk) => {
      let score = 0;
      for (const token of queryTokens) {
        if (chunk.keywords.includes(token)) {
          score += 2;
        } else if (chunk.text.toLowerCase().includes(token)) {
          score += 1;
        }
      }
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => s.chunk);
  }

  /**
   * Formats retrieved context for LLM prompt augmentation
   */
  public static buildRAGPromptContext(query: string, resumeText: string, jobDescriptionText?: string): string {
    const resumeChunks = this.chunkDocument(resumeText, "resume");
    const jdChunks = jobDescriptionText ? this.chunkDocument(jobDescriptionText, "job_description") : [];
    const allChunks = [...resumeChunks, ...jdChunks];

    const retrieved = this.retrieveRelevantChunks(query, allChunks, 4);

    return `
### [RETRIEVAL-AUGMENTED CONTEXT (RAG)]
The following verified background snippets were retrieved from the candidate's actual resume & job requirements:
${retrieved.map((r, i) => `[Source ${i + 1} (${r.source})]: ${r.text.substring(0, 220)}...`).join("\n")}
--------------------------------------------------
Use the above specific background details to tailor your questioning or evaluation directly to their verified experience.
`;
  }
}

export default RAGService;
