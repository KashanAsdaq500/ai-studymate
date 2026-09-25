"use client";

import React, { useState } from "react";
import { History, MessageSquare, Clock, FileText, ArrowRight, Trash2, Search } from "lucide-react";
import { SourceItem } from "./SourceCard";

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  sources: SourceItem[];
  timestamp: string;
  documentName: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory?: () => void;
}

export default function HistoryPanel({
  history,
  onSelectHistory,
  onClearHistory,
}: HistoryPanelProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredHistory = history.filter((item) =>
    item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-7 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Study History
            </h2>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
              {history.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">
            Review your past questions, generated explanations, and retrieved source material.
          </p>
        </div>

        {history.length > 0 && onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter */}
      {history.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 shadow-2xs max-w-md focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/15 transition-all">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search past questions or answers..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                    {item.question}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.answer}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                      <FileText className="h-3 w-3 text-blue-500" />
                      {item.documentName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                    <span>•</span>
                    <span className="rounded-full bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                      {item.sources.length} sources grounded
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end sm:pl-4">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200/80 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all shadow-2xs">
                  <span>View Answer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-purple-50/20 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {filterQuery ? "No matching queries" : "No study history yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            {filterQuery
              ? "Try adjusting your search terms"
              : "Questions you ask in Study Chat will appear here for easy review and revision."}
          </p>
        </div>
      )}
    </div>
  );
}
