"use client";

import React, { useState } from "react";
import { Plus, UploadCloud, FileText, CheckCircle2, X, Search, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import DocumentCard, { DocumentInfo } from "./DocumentCard";

interface DocumentPanelProps {
  documents: DocumentInfo[];
  activeDocName?: string;
  onUploadSuccess?: (newDoc: DocumentInfo) => void;
  onSelectDocumentForChat?: (docName: string) => void;
  onRefreshDocuments?: () => void;
}

export default function DocumentPanel({
  documents,
  activeDocName,
  onUploadSuccess,
  onSelectDocumentForChat,
  onRefreshDocuments,
}: DocumentPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<{
    title: string;
    chunks: number;
    characters: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccessMsg(null);
    }
  };

  const handleRealUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccessMsg(null);
    setUploadStep("Uploading file to secure storage...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadStep("Extracting text and chunking content...");

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload and index document.");
      }

      setUploadStep("Generating embeddings with Xenova/all-MiniLM-L6-v2...");

      const newDoc: DocumentInfo = {
        id: data.document_id,
        name: data.title,
        fileName: data.file_name,
        status: "Ready for AI",
        indexedChunks: data.total_chunks,
        size: `${Math.round(selectedFile.size / 1024)} KB`,
        uploadDate: "Just now",
        format: selectedFile.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
      };

      setUploadSuccessMsg({
        title: data.title,
        chunks: data.total_chunks,
        characters: data.total_characters,
      });

      if (onUploadSuccess) {
        onUploadSuccess(newDoc);
      }

      if (onRefreshDocuments) {
        onRefreshDocuments();
      }

      // Auto close after 2.5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setUploadSuccessMsg(null);
        setUploadStep("");
      }, 2500);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : "Document upload failed.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (isUploading) return;
    setIsModalOpen(false);
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccessMsg(null);
    setUploadStep("");
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Study Documents
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage course notes and files used to answer your study questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshDocuments && (
            <button
              type="button"
              onClick={onRefreshDocuments}
              title="Refresh document list"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Upload document</span>
          </button>
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-2xs max-w-md">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter documents by name..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter("")}
            className="text-slate-400 hover:text-slate-600 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isActive={activeDocName === doc.name}
              onQueryAbout={onSelectDocumentForChat}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No documents found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchFilter ? "Try a different search query" : "Upload your first study document to start asking questions"}
          </p>
        </div>
      )}

      {/* RAG Knowledge Status Box */}
      <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50/60 to-blue-50/40 p-4 sm:p-5 flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Supabase Vector Store Connected
          </h4>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            All documents are stored in the <code className="rounded bg-teal-100/60 px-1 py-0.5 font-mono text-[11px] text-teal-800">study-documents</code> bucket
            and vectorized into 384-dimensional dense embeddings.
            When you ask questions in Study Chat, similarity matching retrieves exact relevant chunks.
          </p>
        </div>
      </div>

      {/* Real Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Upload Study Material
              </h3>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <label
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isUploading
                    ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-80"
                    : "border-slate-300 bg-slate-50/60 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer"
                }`}
              >
                <UploadCloud className="h-10 w-10 text-blue-600 mb-2" />
                <span className="text-sm font-semibold text-slate-800">
                  {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Supports DOCX and PDF (up to 25MB)
                </span>
                <input
                  type="file"
                  accept=".docx,.pdf"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected File Badge */}
              {selectedFile && !uploadSuccessMsg && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">{selectedFile.name}</span>
                    <span className="text-slate-500">({Math.round(selectedFile.size / 1024)} KB)</span>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Live Upload Progress */}
              {isUploading && (
                <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                    <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    <span>{uploadStep || "Processing document..."}</span>
                  </div>
                  <div className="w-full bg-blue-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse-gentle w-4/5" />
                  </div>
                </div>
              )}

              {/* Success Feedback */}
              {uploadSuccessMsg && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900">
                      Document indexed successfully!
                    </p>
                    <p className="mt-0.5 text-emerald-700">
                      Created <strong className="font-semibold">{uploadSuccessMsg.chunks} vector chunks</strong> ({uploadSuccessMsg.characters.toLocaleString()} characters) with 384-dimensional embeddings. Ready for AI!
                    </p>
                  </div>
                </div>
              )}

              {/* Error Feedback */}
              {uploadError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 animate-fade-in">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">Upload failed</p>
                    <p className="mt-0.5 text-red-700">{uploadError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isUploading}
                onClick={handleCloseModal}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                {uploadSuccessMsg ? "Done" : "Cancel"}
              </button>
              {!uploadSuccessMsg && (
                <button
                  type="button"
                  disabled={!selectedFile || isUploading}
                  onClick={handleRealUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Indexing...</span>
                    </>
                  ) : (
                    <span>Upload & Index</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
