"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";

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

  const previewLimit = 160;
  const isLong = source.text.length > previewLimit;
  const displayText = isExpanded || !isLong
    ? source.text
    : `${source.text.slice(0, previewLimit)}...`;

  return (
    <div
      onClick={() => isLong && setIsExpanded(!isExpanded)}
      className={`group rounded-2xl border border-slate-200/90 bg-white p-4 transition-all duration-200 ${
        isLong
          ? "cursor-pointer hover:border-teal-300 hover:shadow-xs hover:-translate-y-0.5"
          : "hover:border-slate-300"
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 text-teal-700 shadow-2xs">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {documentName}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200/70">
                Chunk {source.chunk_index}
              </span>
            </div>
          </div>
        </div>

        {/* Relevance Badge & Actions */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 ring-1 ring-inset ring-teal-600/20 shadow-2xs"
            title={`Vector similarity score: ${source.similarity}`}
          >
            <Sparkles className="h-2.5 w-2.5 text-teal-600" />
            <span>{similarityPercent > 0 ? `${similarityPercent}% relevance` : "Relevant source"}</span>
          </span>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy source text"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
              className="text-slate-400 group-hover:text-slate-700 transition-colors"
              aria-label={isExpanded ? "Collapse source context" : "Expand source context"}
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
      <div className="mt-3 rounded-xl bg-slate-50/90 p-3 text-xs text-slate-700 font-mono leading-relaxed border border-slate-200/70">
        <p className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
          {displayText}
        </p>

        {isLong && (
          <div className="mt-2 flex justify-end">
            <span className="text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline">
              {isExpanded ? "Show less context" : "Show full extracted chunk"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
