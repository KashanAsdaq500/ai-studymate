"use client";

import React, { useState } from "react";
import { X, Sliders } from "lucide-react";

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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Study Preferences
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Explanation Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Explanation Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Concise", "Balanced", "In-depth"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDetailLevel(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                    detailLevel === item
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
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
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Academic Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["High School", "Undergraduate", "Research"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAcademicLevel(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                    academicLevel === item
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Retrieval Options */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Show Relevance Match Scores</p>
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

          <div className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-800 border border-blue-100/60">
            <p className="font-semibold">Document-Grounded Assurance</p>
            <p className="text-[11px] text-blue-600 mt-0.5">
              StudyMate will always answer strictly from your notes without extrapolating ungrounded data.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
