"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";

export default function LoadingState() {
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(2);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Soft Animated Icon */}
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
          {phase === 1 ? (
            <Search className="h-6 w-6 text-blue-600 animate-pulse-gentle" />
          ) : (
            <Sparkles className="h-6 w-6 text-teal-600 animate-pulse-gentle" />
          )}

          {/* Orbiting dot indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
          </span>
        </div>

        {/* Phase Text */}
        <h4 className="text-base font-semibold text-slate-800 transition-all">
          {phase === 1 ? "Searching your study material..." : "Preparing your answer..."}
        </h4>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {phase === 1
            ? "Comparing your question against embedded document chunks"
            : "Synthesizing retrieved context into a grounded explanation"}
        </p>

        {/* Subtle Progress Bar */}
        <div className="mt-5 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 h-1.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-amber-400 transition-all duration-700 ease-out ${
              phase === 1 ? "w-2/5" : "w-5/6"
            }`}
          />
        </div>

        {/* Skeleton content preview */}
        <div className="mt-6 w-full max-w-md space-y-2.5 opacity-40">
          <div className="h-3 w-3/4 rounded-sm bg-slate-200" />
          <div className="h-3 w-full rounded-sm bg-slate-200" />
          <div className="h-3 w-4/5 rounded-sm bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
