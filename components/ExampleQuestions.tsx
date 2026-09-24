"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export const EXAMPLE_QUESTIONS = [
  "What is machine learning?",
  "Explain supervised learning",
  "What are the types of ML?",
  "Explain this like I'm a beginner",
];

export default function ExampleQuestions({ onSelect, disabled }: ExampleQuestionsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Suggested Questions
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="text-slate-400 group-hover:text-blue-500 font-normal">“</span>
            <span>{question}</span>
            <span className="text-slate-400 group-hover:text-blue-500 font-normal">”</span>
          </button>
        ))}
      </div>
    </div>
  );
}
