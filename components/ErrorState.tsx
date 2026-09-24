"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8 text-center animate-fade-in">
      <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h4 className="text-base font-semibold text-slate-900">
        Something went wrong
      </h4>

      <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
        StudyMate couldn&apos;t generate an answer right now. Please try again.
      </p>

      {message && (
        <div className="mx-auto mt-3 max-w-md rounded-lg bg-white/80 p-2.5 text-xs text-red-700 font-mono border border-red-100 overflow-x-auto text-left">
          {message}
        </div>
      )}

      <div className="mt-5">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
