"use client";

import React from "react";
import { BookOpen, Sparkles, FileSearch, CheckCircle } from "lucide-react";
import ExampleQuestions from "./ExampleQuestions";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center sm:py-14 animate-fade-in">
      {/* Friendly Book + AI Visual Badge */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 shadow-sm">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-xs ring-2 ring-white">
          <Sparkles className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Your AI study companion is ready.
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        Ask a question and StudyMate will search your study material before answering.
      </p>

      {/* Feature highlight cards */}
      <div className="mt-6 grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <FileSearch className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-800">Direct Document Retrieval</p>
            <p className="text-[11px] text-slate-500">Retrieves exact paragraphs from your notes</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-800">Zero Hallucinations</p>
            <p className="text-[11px] text-slate-500">Only responds based on confirmed sources</p>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mt-8 w-full max-w-xl text-left">
        <ExampleQuestions onSelect={onSelectPrompt} />
      </div>
    </div>
  );
}
