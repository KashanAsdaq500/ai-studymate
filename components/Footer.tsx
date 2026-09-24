"use client";

import React from "react";
import { BookOpen, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand & Slogan */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">AI StudyMate</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Learn. Ask. Understand.</p>
            </div>
          </div>

          {/* Academic Verification Notice */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500 border border-slate-200/60 max-w-xl text-center sm:text-left">
            <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>AI-generated answers should be verified with your course material and instructor.</span>
          </div>

          {/* Slogan & Copyright */}
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AI StudyMate. Grounded RAG Assistant.
          </p>
        </div>
      </div>
    </footer>
  );
}
