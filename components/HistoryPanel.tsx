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
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Study History
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review your past questions, generated answers, and retrieved source chunks.
          </p>
        </div>

        {history.length > 0 && onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-2xs max-w-md">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search past questions..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.question}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.answer}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <FileText className="h-3 w-3 text-blue-500" />
                      {item.documentName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                    <span>•</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                      {item.sources.length} sources
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <span>View Answer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <History className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {filterQuery ? "No matching queries" : "No study history yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {filterQuery
              ? "Try adjusting your search terms"
              : "Questions you ask in Study Chat will appear here for easy review."}
          </p>
        </div>
      )}
    </div>
  );
}
