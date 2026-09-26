import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

export async function POST(request: Request) {
  let uploadedStoragePath: string | null = null;
  let createdDocumentId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let supabase: any = null;

  try {
    supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    // 1. Validate Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension || (extension !== "docx" && extension !== "pdf")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file format. Please upload a .docx or .pdf file.",
        },
        { status: 400 }
      );
    }

    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 25MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 2. Extract Text
    let extractedText = "";

    if (extension === "docx") {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = result.value.trim();
      } catch (extractErr) {
        console.error("DOCX extraction error:", extractErr);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to extract text from DOCX document.",
          },
          { status: 400 }
        );
      }
    } else if (extension === "pdf") {
      let parser: {
        getText: () => Promise<{ text?: string }>;
        destroy?: () => Promise<void>;
      } | null = null;

      try {
        // pdf-parse worker must be loaded before PDFParse in Next.js/Vercel
        const { CanvasFactory } = await import("pdf-parse/worker");
        const { PDFParse } = await import("pdf-parse");

        const parserInstance = new PDFParse({
          data: fileBuffer,
          CanvasFactory,
        });

        parser = parserInstance;

        const textResult = await parserInstance.getText();
        const rawText = (textResult?.text || "").trim();

        // Remove page marker lines such as "-- 1 of 3 --"
        const meaningfulText = rawText
          .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "")
          .trim();

        if (!meaningfulText) {
          return NextResponse.json(
            {
              success: false,
              error:
                "No extractable text found in the uploaded PDF. Scanned or image-only PDFs are not supported without OCR.",
            },
            { status: 400 }
          );
        }

        extractedText = rawText;
      } catch (pdfErr) {
        console.error("PDF extraction error:", pdfErr);

        return NextResponse.json(
          {
            success: false,
            error: "Failed to extract text from PDF document.",
          },
          { status: 400 }
        );
      } finally {
        if (parser && typeof parser.destroy === "function") {
          try {
            await parser.destroy();
          } catch {
            // Ignore parser cleanup errors
          }
        }
      }
    }

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error: "No readable text found in the uploaded document.",
        },
        { status: 400 }
      );
    }

    // 3. Upload to Supabase Storage: study-documents
    const docUuid = crypto.randomUUID();
    uploadedStoragePath = `documents/${docUuid}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("study-documents")
      .upload(uploadedStoragePath, fileBuffer, {
        contentType:
          file.type ||
          (extension === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/pdf"),
        upsert: false,
      });

    if (storageError) {
      console.error("Supabase Storage error:", storageError);
      return NextResponse.json(
        {
          success: false,
          error: `Storage upload failed: ${storageError.message}`,
        },
        { status: 500 }
      );
    }

    // 4. Create row in study_documents table
    const title = fileName.replace(/\.[^/.]+$/, "");
    const { data: documentRecord, error: docInsertError } = await supabase
      .from("study_documents")
      .insert({
        title,
        file_name: fileName,
        file_url: uploadedStoragePath,
        content: extractedText,
        user_id: user.id,
      })
      .select("id, title, file_name, created_at")
      .single();

    if (docInsertError || !documentRecord) {
      console.error("Document insert error:", docInsertError);
      // Clean up storage file
      if (uploadedStoragePath) {
        await supabase.storage.from("study-documents").remove([uploadedStoragePath]);
      }
      return NextResponse.json(
        {
          success: false,
          error: docInsertError?.message || "Failed to create document record.",
        },
        { status: 500 }
      );
    }

    createdDocumentId = documentRecord.id;

    // 5. Chunk the extracted text
    const chunks = splitIntoChunks(extractedText, 1000, 150);

    if (chunks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Text could not be segmented into study chunks.",
        },
        { status: 400 }
      );
    }

    // 6. Generate embeddings using Gemini Embeddings
    const chunkRows = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];

      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunkText,
        config: {
          outputDimensionality: 768,
        },
      });

      const embedding = response.embeddings?.[0]?.values;

      if (!embedding || embedding.length !== 768) {
        throw new Error(
          `Failed to generate a valid 768-dimensional embedding for chunk ${i}.`
        );
      }

      chunkRows.push({
        document_id: createdDocumentId,
        chunk_text: chunkText,
        chunk_index: i,
        embedding,
      });
    }

    // 7. Insert all chunks into document_chunks
    const { error: chunksInsertError } = await supabase
      .from("document_chunks")
      .insert(chunkRows);

    if (chunksInsertError) {
      console.error("Chunks insertion error:", chunksInsertError);
      // Rollback document record & storage
      if (createdDocumentId) {
        await supabase.from("study_documents").delete().eq("id", createdDocumentId);
      }
      if (uploadedStoragePath) {
        await supabase.storage.from("study-documents").remove([uploadedStoragePath]);
      }
      return NextResponse.json(
        {
          success: false,
          error: chunksInsertError.message || "Failed to index document chunks.",
        },
        { status: 500 }
      );
    }

    // 8. Return success response
    return NextResponse.json({
      success: true,
      document_id: createdDocumentId,
      title: documentRecord.title,
      file_name: documentRecord.file_name,
      total_characters: extractedText.length,
      total_chunks: chunks.length,
      message: "Document uploaded and indexed successfully.",
    });
  } catch (error: unknown) {
    console.error("POST /api/upload-document error:", error);

    // Rollback if needed
    if (supabase && createdDocumentId) {
      try {
        await supabase.from("document_chunks").delete().eq("document_id", createdDocumentId);
        await supabase.from("study_documents").delete().eq("id", createdDocumentId);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    }
    if (supabase && uploadedStoragePath) {
      try {
        await supabase.storage.from("study-documents").remove([uploadedStoragePath]);
      } catch (cleanupErr) {
        console.error("Storage cleanup error:", cleanupErr);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error during document upload.",
      },
      { status: 500 }
    );
  }
}







