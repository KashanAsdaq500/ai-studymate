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

      setUploadStep("Generating embeddings with Gemini...");

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
    <div className="w-full space-y-7 animate-fade-in">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              My Study Documents
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              {documents.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">
            Manage course notes and files used to answer your study questions with dense vector search.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefreshDocuments && (
            <button
              type="button"
              onClick={onRefreshDocuments}
              title="Refresh document list"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs hover:border-slate-300 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Upload document</span>
          </button>
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 shadow-2xs max-w-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
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
            className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50/20 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No documents found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            {searchFilter ? "Try adjusting your filter search" : "Upload your course notes to begin indexing and asking questions"}
          </p>
        </div>
      )}

      {/* RAG Knowledge Status Box */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-50/80 via-blue-50/50 to-indigo-50/40 p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xs">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Supabase Vector Store Connected
            </h4>
            <span className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
              Active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            All documents are stored in the <code className="rounded bg-teal-100/70 px-1.5 py-0.5 font-mono text-xs font-semibold text-teal-900">study-documents</code> bucket
            and vectorized into 768-dimensional embeddings via <span className="font-semibold text-indigo-900">Gemini Embeddings</span>.
            Similarity matching retrieves exact relevant passages for zero-hallucination answers.
          </p>
        </div>
      </div>

      {/* Real Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200/90">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Upload Study Material
                </h3>
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleCloseModal}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              {/* Dropzone with subtle colorful gradient */}
              <label
                className={`group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                  isUploading
                    ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-80"
                    : "border-indigo-200/90 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-teal-50/30 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-xs cursor-pointer"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xs border border-indigo-100/80 mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-7 w-7 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-900">
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
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">{selectedFile.name}</span>
                    <span className="text-slate-500">({Math.round(selectedFile.size / 1024)} KB)</span>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Live Upload Progress */}
              {isUploading && (
                <div className="mt-4 rounded-2xl bg-blue-50/90 border border-blue-200 p-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-blue-900">
                    <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    <span>{uploadStep || "Processing document..."}</span>
                  </div>
                  <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse-gentle w-4/5" />
                  </div>
                </div>
              )}

              {/* Success Feedback */}
              {uploadSuccessMsg && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 animate-fade-in shadow-2xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">
                      Document indexed successfully!
                    </p>
                    <p className="mt-1 text-emerald-800 leading-relaxed">
                      Created <strong className="font-bold text-emerald-950">{uploadSuccessMsg.chunks} vector chunks</strong> ({uploadSuccessMsg.characters.toLocaleString()} characters) with 768-dimensional Gemini embeddings. Ready for AI!
                    </p>
                  </div>
                </div>
              )}

              {/* Error Feedback */}
              {uploadError && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 animate-fade-in">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-950">Upload failed</p>
                    <p className="mt-1 text-red-800">{uploadError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isUploading}
                onClick={handleCloseModal}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                {uploadSuccessMsg ? "Done" : "Cancel"}
              </button>
              {!uploadSuccessMsg && (
                <button
                  type="button"
                  disabled={!selectedFile || isUploading}
                  onClick={handleRealUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

