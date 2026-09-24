import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { pipeline } from "@xenova/transformers";

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
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

    // 1. Convert user's question into an embedding
    const extractorModel = await getExtractor();

    const output = await extractorModel(query, {
      pooling: "mean",
      normalize: true,
    });

    const queryEmbedding = Array.from(output.data);

    // 2. Find the most relevant document chunks
    const { data: chunks, error: searchError } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 3,
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

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        success: true,
        answer: "I could not find relevant information in the uploaded study material.",
        sources: [],
      });
    }

    // 3. Prepare retrieved material for Gemini
    const context = chunks
      .map(
        (chunk: any, index: number) =>
          `Source ${index + 1} (Chunk ${chunk.chunk_index}):\n${chunk.chunk_text}`
      )
      .join("\n\n");

    // 4. Create Gemini client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 5. Ask Gemini to answer only from retrieved material
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = response.text || "No answer was generated.";

    // 6. Return answer and source chunks
    const docIds = Array.from(
      new Set(chunks.map((c: any) => c.document_id).filter(Boolean))
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

    const sources = chunks.map((chunk: any) => ({
      chunk_index: chunk.chunk_index,
      similarity: chunk.similarity,
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