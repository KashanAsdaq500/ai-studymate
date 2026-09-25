"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export const EXAMPLE_QUESTIONS = [
  {
    text: "What is machine learning?",
    dotColor: "bg-blue-500",
    borderClass: "border-blue-200/90 hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-800",
  },
  {
    text: "Explain supervised learning",
    dotColor: "bg-teal-500",
    borderClass: "border-teal-200/90 hover:border-teal-400 hover:bg-teal-50/70 hover:text-teal-800",
  },
  {
    text: "What are the types of ML?",
    dotColor: "bg-purple-500",
    borderClass: "border-purple-200/90 hover:border-purple-400 hover:bg-purple-50/70 hover:text-purple-800",
  },
  {
    text: "Explain this like I'm a beginner",
    dotColor: "bg-amber-500",
    borderClass: "border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/70 hover:text-amber-900",
  },
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

      <div className="flex flex-wrap gap-2.5">
        {EXAMPLE_QUESTIONS.map((item) => (
          <button
            key={item.text}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.text)}
            className={`group inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:-translate-y-0.5 hover:shadow-xs ${item.borderClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor} transition-transform group-hover:scale-125`} />
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
