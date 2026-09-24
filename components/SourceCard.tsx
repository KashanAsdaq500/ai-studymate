"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

export interface SourceItem {
  chunk_index: number;
  similarity: number;
  text: string;
  document_name?: string;
}

interface SourceCardProps {
  source: SourceItem;
  defaultDocumentName?: string;
}

export default function SourceCard({
  source,
  defaultDocumentName = "Machine Learning.docx",
}: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const documentName = source.document_name || defaultDocumentName;
  const similarityPercent = Math.round((source.similarity || 0) * 100);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(source.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Text preview length
  const previewLimit = 160;
  const isLong = source.text.length > previewLimit;
  const displayText = isExpanded || !isLong
    ? source.text
    : `${source.text.slice(0, previewLimit)}...`;

  return (
    <div
      onClick={() => isLong && setIsExpanded(!isExpanded)}
      className={`group rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 transition-all ${
        isLong ? "cursor-pointer hover:border-blue-200 hover:shadow-xs" : ""
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                {documentName}
              </span>
              <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                Chunk {source.chunk_index}
              </span>
            </div>
          </div>
        </div>

        {/* Relevance Badge & Actions */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20"
            title={`Similarity score: ${source.similarity}`}
          >
            {similarityPercent > 0 ? `${similarityPercent}% relevance` : "Relevant source"}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy source text"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-teal-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          {isLong && (
            <button
              type="button"
              className="text-slate-400 group-hover:text-slate-600 transition-colors"
              aria-label={isExpanded ? "Collapse source text" : "Expand source text"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Snippet text */}
      <div className="mt-2.5 rounded-lg bg-slate-50/80 p-2.5 text-xs text-slate-600 font-mono leading-relaxed border border-slate-100">
        <p className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-normal">
          {displayText}
        </p>

        {isLong && (
          <div className="mt-1.5 flex justify-end">
            <span className="text-[11px] font-semibold text-blue-600 hover:underline">
              {isExpanded ? "Show less context" : "Show full extracted chunk"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
