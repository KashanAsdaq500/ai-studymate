"use client";

import React, { useRef } from "react";
import { Sparkles, X, CornerDownLeft } from "lucide-react";

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
      {/* Outer Glow Wrapper */}
      <div className="relative flex items-center rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15">
        <div className="pl-3 pr-1 text-slate-400">
          <Sparkles className="h-4 w-4 text-indigo-500/70" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-2.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
        />

        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Clear text"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Sparkles className="h-4 w-4 text-amber-300 transition-transform group-hover:rotate-12" />
          <span className="hidden sm:inline">Ask StudyMate</span>
          <span className="sm:hidden">Ask</span>
        </button>
      </div>

      {/* Helpful Hint Bar */}
      <div className="mt-2.5 flex items-center justify-between px-1.5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          <span>Grounded strictly in your uploaded document chunks</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1">
          <span>Press</span>
          <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 shadow-2xs">
            Enter <CornerDownLeft className="h-2.5 w-2.5" />
          </kbd>
        </span>
      </div>
    </div>
  );
}
