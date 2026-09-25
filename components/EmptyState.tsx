"use client";

import React from "react";
import { BookOpen, Sparkles, FileSearch, CheckCircle } from "lucide-react";
import ExampleQuestions from "./ExampleQuestions";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center sm:py-12 animate-fade-in">
      {/* Friendly Glowing Book + AI Visual Badge */}
      <div className="relative mb-5 flex h-18 w-18 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 border border-indigo-100/80 shadow-sm shadow-indigo-500/10">
        <BookOpen className="h-9 w-9 text-indigo-600" />
        <span className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-xs ring-4 ring-white">
          <Sparkles className="h-4 w-4 fill-current text-slate-950" />
        </span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Your AI study companion is ready.
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        Ask any question and StudyMate will search your uploaded notes and provide grounded, verified answers.
      </p>

      {/* Feature highlight cards with subtle colorful accenting */}
      <div className="mt-7 grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="group flex items-start gap-3 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-3.5 shadow-2xs hover:border-teal-200 transition-all">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 mt-0.5">
            <FileSearch className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Direct Document Retrieval</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              Searches through exact paragraphs in your notes using vector similarity.
            </p>
          </div>
        </div>

        <div className="group flex items-start gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-3.5 shadow-2xs hover:border-indigo-200 transition-all">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 mt-0.5">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Zero Hallucinations</p>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              Answers are restricted strictly to confirmed material from your uploaded files.
            </p>
          </div>
        </div>
      </div>

      {/* Example Prompts with colorful chips */}
      <div className="mt-8 w-full max-w-xl text-left border-t border-slate-100 pt-6">
        <ExampleQuestions onSelect={onSelectPrompt} />
      </div>
    </div>
  );
}
