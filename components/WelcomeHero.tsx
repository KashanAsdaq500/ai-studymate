"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle2, Search } from "lucide-react";

export default function WelcomeHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-6 sm:pt-12 sm:pb-8">
      {/* Subtle background decoration (non-intrusive geometric accents) */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-64 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="h-48 w-80 translate-x-20 rounded-full bg-teal-100/30 blur-2xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Friendly AI + Education Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-xs backdrop-blur-xs mb-5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Sparkles className="h-3 w-3" />
          </span>
          <span>AI-Powered Study & Document Assistant</span>
          <span className="hidden sm:inline-block text-slate-300">•</span>
          <span className="hidden sm:inline-block font-medium text-slate-600">Grounded RAG System</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.15]">
          Study smarter.{" "}
          <span className="relative inline-block text-blue-600">
            Understand better.
            {/* Subtle warm accent underline */}
            <span className="absolute bottom-1 left-0 -z-10 h-2 w-full rounded-sm bg-amber-200/60" />
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
          Ask questions from your notes and documents, and get clear answers
          grounded in your study material.
        </p>

        {/* Subtle trust / feature pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-2xs">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Document Notes Grounded</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-2xs">
            <Search className="h-3.5 w-3.5 text-teal-600" />
            <span>Semantic Chunk Search</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verifiable Citations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
