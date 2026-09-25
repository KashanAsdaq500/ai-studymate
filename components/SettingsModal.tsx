"use client";

import React, { useState } from "react";
import { X, Sliders, ShieldCheck } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [academicLevel, setAcademicLevel] = useState("Undergraduate");
  const [detailLevel, setDetailLevel] = useState("Balanced");
  const [showChunkScores, setShowChunkScores] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200/90">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xs">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Study Preferences
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Explanation Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Explanation Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Concise", "Balanced", "In-depth"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDetailLevel(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all ${
                    detailLevel === item
                      ? "border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Academic Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["High School", "Undergraduate", "Research"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAcademicLevel(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all ${
                    academicLevel === item
                      ? "border-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Retrieval Options */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Show Relevance Match Scores</p>
                <p className="text-[11px] text-slate-500">Display percentage similarity on retrieved chunks</p>
              </div>
              <input
                type="checkbox"
                checked={showChunkScores}
                onChange={(e) => setShowChunkScores(e.target.checked)}
                className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-teal-50/40 p-3.5 text-xs text-slate-700 border border-indigo-100/70 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Document-Grounded Assurance</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                StudyMate will always answer strictly from your uploaded notes without extrapolating ungrounded assumptions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
