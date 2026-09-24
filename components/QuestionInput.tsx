"use client";

import React, { useRef } from "react";
import { Sparkles, X } from "lucide-react";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function QuestionInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Ask a question about your study material...",
}: QuestionInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 hover:border-slate-300">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
        />

        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Clear text"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="hidden sm:inline">Ask StudyMate</span>
          <span className="sm:hidden">Ask</span>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-400">
        <span>Grounded in your uploaded document chunks</span>
        <span className="hidden sm:inline">Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[10px] text-slate-600">Enter ↵</kbd> to ask</span>
      </div>
    </div>
  );
}
