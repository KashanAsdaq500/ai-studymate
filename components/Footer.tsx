"use client";

import React from "react";
import { BookOpen, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-xs py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand & Slogan */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900 leading-none">AI StudyMate</p>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.2 text-[10px] font-semibold text-blue-700">
                  <Sparkles className="h-2 w-2 text-indigo-500" />
                  RAG
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Learn. Ask. Understand.</p>
            </div>
          </div>

          {/* Academic Verification Notice */}
          <div className="flex items-center gap-2 rounded-full bg-slate-50/90 px-4 py-1.5 text-xs text-slate-600 border border-slate-200/70 max-w-xl text-center sm:text-left shadow-2xs">
            <Shield className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>AI-generated answers should be verified with your course material and instructor.</span>
          </div>

          {/* Slogan & Copyright */}
          <p className="text-xs text-slate-400 font-normal">
            © {new Date().getFullYear()} AI StudyMate. Grounded Education Assistant.
          </p>
        </div>
      </div>
    </footer>
  );
}
