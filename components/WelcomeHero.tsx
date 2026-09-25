"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle2, Search, Lightbulb } from "lucide-react";

export default function WelcomeHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-4 sm:pt-14 sm:pb-6">
      {/* Dynamic ambient color glow backdrop (subtle mesh glow without harshness) */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-72 w-[34rem] -translate-x-16 -translate-y-8 rounded-full bg-gradient-to-tr from-blue-200/50 via-indigo-200/40 to-transparent blur-3xl" />
        <div className="h-64 w-[30rem] translate-x-20 translate-y-4 rounded-full bg-gradient-to-bl from-teal-200/40 via-purple-200/30 to-amber-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Friendly AI + Education Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md mb-6 hover:border-indigo-300 transition-colors">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-slate-950 shadow-2xs">
            <Sparkles className="h-3 w-3 fill-current" />
          </span>
          <span className="font-bold text-indigo-900">AI-Powered Study Workspace</span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-600">Grounded Semantic RAG</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
          Study smarter.{" "}
          <span className="relative inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
            Understand better.
            {/* Subtle soft warm glowing underline */}
            <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-sm bg-gradient-to-r from-amber-200/70 via-indigo-100/50 to-teal-200/60 blur-[1px]" />
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
          Ask questions from your course notes and documents, and get clear, comprehensive answers{" "}
          <span className="font-semibold text-slate-800">grounded strictly in your study material</span>.
        </p>

        {/* Educational Trust & Capability Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2 rounded-xl border border-blue-200/70 bg-white/90 px-3.5 py-2 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <span>Document Grounded</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-teal-200/70 bg-white/90 px-3.5 py-2 shadow-2xs hover:shadow-xs hover:border-teal-300 transition-all">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Search className="h-3.5 w-3.5" />
            </div>
            <span>Dense Vector Retrieval</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-white/90 px-3.5 py-2 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <span>Exact Source Citations</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-purple-200/70 bg-white/90 px-3.5 py-2 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Lightbulb className="h-3.5 w-3.5" />
            </div>
            <span>Conceptual Clarity</span>
          </div>
        </div>
      </div>
    </section>
  );
}
