import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import mammoth from "mammoth";

function splitIntoChunks(text: string, chunkSize = 1000, overlap = 150) {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Download DOCX from Supabase Storage
    const { data, error } = await supabase.storage
      .from("study-documents")
      .download("Machine Learning.docx");

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "File not found",
        },
        { status: 500 }
      );
    }

    // 2. Convert DOCX to text
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({
      buffer,
    });

    const text = result.value.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "No text found in DOCX",
        },
        { status: 400 }
      );
    }

    // 3. Split text into chunks
    const chunks = splitIntoChunks(text);

    // 4. Get document record
    const { data: document, error: documentError } = await supabase
      .from("study_documents")
      .select("id")
      .eq("file_name", "Machine Learning.docx")
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        {
          success: false,
          error: documentError?.message || "Document record not found",
        },
        { status: 500 }
      );
    }

    // 5. Save chunks in database
    const chunkRows = chunks.map((chunk, index) => ({
      document_id: document.id,
      chunk_text: chunk,
      chunk_index: index,
    }));

    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(chunkRows);

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "DOCX extracted and chunks saved successfully!",
      document_id: document.id,
      total_characters: text.length,
      total_chunks: chunks.length,
    });
  } catch (error) {
    console.error("DOCX processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process DOCX",
      },
      { status: 500 }
    );
  }
}