import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  chunk_text: string;
  similarity?: number;
}

function extractSupplementaryTerms(query: string, topChunks: DocumentChunk[]): string[] {
  const terms = new Set<string>();

  // 1. From Query: Hyphenated words (e.g. semi-supervised)
  const hyphenated = query.match(/\b[A-Za-z0-9]+-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\b/g);
  if (hyphenated) {
    for (const t of hyphenated) terms.add(t.trim());
  }

  // 2. From Query: Quoted phrases
  const quoted = query.match(/"([^"]+)"|'([^']+)'/g);
  if (quoted) {
    for (const t of quoted) terms.add(t.replace(/["']/g, "").trim());
  }

  // 3. From Top Chunks: Parenthesized sub-concept lists e.g. (supervised, unsupervised, semisupervised, and Reinforcement Learning)
  const topText = topChunks.slice(0, 3).map((c) => c.chunk_text).join("\n");
  const parenMatches = topText.matchAll(/\(([^)(]{4,150})\)/g);
  for (const m of parenMatches) {
    const inner = m[1];
    if (inner.includes(",") || inner.includes(" and ") || inner.includes(" or ")) {
      const parts = inner.split(/,| and | or /i);
      for (const p of parts) {
        const clean = p.trim().replace(/^and\s+/i, "").replace(/^[0-9.]+\s*/, "");
        if (clean.length >= 3 && clean.length <= 40 && !/^\d+$/.test(clean)) {
          terms.add(clean);
        }
      }
    }
  }

  // 4. From Top Chunks: Bullet or numbered list headings e.g. '1. Supervised Machine Learning'
  const listMatches = topText.matchAll(/(?:^|\n)(?:[0-9]+\.|\u2022|\-)\s*([A-Z][A-Za-z\s-]{3,40})(?::|\n|\r)/g);
  for (const m of listMatches) {
    const clean = m[1].trim();
    if (clean.length >= 3 && clean.length <= 40) {
      terms.add(clean);
    }
  }

  // 5. Significant technical keywords from query (excluding conversational stop words)
  const stopWords = new Set([
    "what", "which", "where", "when", "who", "whom", "whose", "why", "how",
    "does", "have", "been", "with", "from", "this", "that", "these", "those",
    "explain", "briefly", "detail", "describe", "according", "uploaded",
    "study", "material", "types", "based", "whether", "they", "each", "four",
    "main", "trained", "human", "machine", "learning", "about", "some", "more"
  ]);
  const words = query.split(/[^A-Za-z0-9-]+/).filter((w) => w.length >= 4 && !stopWords.has(w.toLowerCase()));
  for (const w of words) terms.add(w);

  return Array.from(terms).filter((t) => t.length >= 3 && t.length <= 40).slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();    
    // 1. Convert user's question into a Gemini embedding
    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
      config: {
        outputDimensionality: 768,
      },
    });

    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding || queryEmbedding.length !== 768) {
      throw new Error("Failed to generate a valid 768-dimensional query embedding.");
    }

    // 2. Find relevant document chunks via vector similarity
    const { data: vectorChunks, error: searchError } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 8,
      }
    );

    if (searchError) {
      return NextResponse.json(
        {
          success: false,
          error: searchError.message,
        },
        { status: 500 }
      );
    }

    const initialChunks: DocumentChunk[] = vectorChunks || [];

    // 3. Supplementary keyword/term search to ensure sub-concepts are not missed
    const candidateTerms = extractSupplementaryTerms(query, initialChunks);
    const existingIds = new Set<string>(initialChunks.map((c) => c.id));
    const supplementaryChunks: DocumentChunk[] = [];

    if (candidateTerms.length > 0) {
      for (const term of candidateTerms) {
        const pattern = "%" + term.trim().replace(/[-\s]+/g, "%") + "%";
        const { data: matched } = await supabase
          .from("document_chunks")
          .select("id, document_id, chunk_index, chunk_text")
          .ilike("chunk_text", pattern)
          .limit(3);

        if (matched) {
          for (const m of matched) {
            if (!existingIds.has(m.id)) {
              existingIds.add(m.id);
              supplementaryChunks.push({
                ...m,
                similarity: 0.55,
              });
            }
          }
        }
      }
    }

    // 4. Combine and deduplicate chunks by ID and text content
    const combinedChunks = [...initialChunks, ...supplementaryChunks];
    const seenTexts = new Set<string>();
    const chunks: DocumentChunk[] = [];
    for (const c of combinedChunks) {
      const snippet = c.chunk_text.trim().slice(0, 120);
      if (!seenTexts.has(snippet)) {
        seenTexts.add(snippet);
        chunks.push(c);
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        answer: "I could not find relevant information in the uploaded study material.",
        sources: [],
      });
    }

    // 5. Prepare retrieved material for Gemini (capped to at most 14 chunks)
    const contextChunks = chunks.slice(0, 14);
    const context = contextChunks
      .map(
        (chunk, index) =>
          `Source ${index + 1} (Chunk ${chunk.chunk_index}):\n${chunk.chunk_text}`
      )
      .join("\n\n");

    // 6. Create Gemini client
// 7. Ask Gemini to answer only from retrieved material
    const prompt = `
You are AI StudyMate, an AI study assistant.

Answer the user's question using ONLY the study material provided below.

If the answer is not present in the study material, clearly say:
"I couldn't find this information in the uploaded study material."

Do not invent facts.
Keep the answer simple and useful for a student.

User question:
${query}

Study material:
${context}
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (firstErr: unknown) {
      const err = firstErr as { status?: number; message?: string };
      if (
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes("503") ||
        err?.message?.includes("429") ||
        err?.message?.includes("quota") ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.message?.includes("demand")
      ) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-flash-lite-latest",
            contents: prompt,
          });
        } catch {
          throw firstErr;
        }
      } else {
        throw firstErr;
      }
    }

    const answer = response.text || "No answer was generated.";

    // 8. Return answer and source chunks
    const docIds = Array.from(
      new Set(contextChunks.map((c) => c.document_id).filter(Boolean))
    );
    const docMap = new Map<string, string>();
    if (docIds.length > 0) {
      const { data: docs } = await supabase
        .from("study_documents")
        .select("id, title, file_name")
        .in("id", docIds);
      if (docs) {
        for (const d of docs) {
          docMap.set(d.id, d.title || d.file_name);
        }
      }
    }

    const sources = contextChunks.map((chunk) => ({
      chunk_index: chunk.chunk_index,
      similarity: chunk.similarity ?? 0.5,
      text: chunk.chunk_text,
      document_name: docMap.get(chunk.document_id) || "Study Document",
    }));

    return NextResponse.json({
      success: true,
      question: query,
      answer,
      sources,
    });
  } catch (error) {
    console.error("Ask API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}




