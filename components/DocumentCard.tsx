"use client";

import React from "react";
import { FileText, Layers, Calendar, HardDrive, ArrowUpRight, Check, Sparkles } from "lucide-react";

export interface DocumentInfo {
  id: string;
  name: string;
  fileName: string;
  status: "Ready for AI" | "Processing" | "Needs Embeddings";
  indexedChunks: number;
  size?: string;
  uploadDate: string;
  format: "DOCX" | "PDF" | "TXT";
}

interface DocumentCardProps {
  document: DocumentInfo;
  isActive?: boolean;
  onQueryAbout?: (docName: string) => void;
}

export default function DocumentCard({
  document,
  isActive = false,
  onQueryAbout,
}: DocumentCardProps) {
  const isPdf = document.format === "PDF";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border bg-white p-5 sm:p-6 transition-all duration-200 ${
        isActive
          ? "border-blue-500/80 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
          : "border-slate-200/90 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-105 shadow-2xs ${
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500"
                  : isPdf
                  ? "bg-gradient-to-br from-rose-50 to-red-50 text-rose-600 border-rose-200/80"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border-blue-200/80"
              }`}
            >
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {document.name}
                </h4>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 shadow-2xs">
                    <Check className="h-3 w-3 text-blue-600" />
                    Active in Chat
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {document.fileName}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {document.status}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-teal-600" />
            <span>
              <strong className="text-slate-800">{document.indexedChunks}</strong> chunks indexed
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-slate-400" />
            <span>{document.size || "Indexed"} • {document.format}</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Added {document.uploadDate}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {onQueryAbout && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Vectorized & ready</span>
          </span>
          <button
            type="button"
            onClick={() => onQueryAbout(document.name)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>{isActive ? "Ask questions" : "Set as active & ask"}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
