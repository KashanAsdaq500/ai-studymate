"use client";

import React, { useState } from "react";
import { Sparkles, Check, Copy, CheckCircle2, User, BookOpen, ChevronRight } from "lucide-react";
import SourceCard, { SourceItem } from "./SourceCard";

interface AnswerCardProps {
  question: string;
  answer: string;
  sources: SourceItem[];
  timestamp?: string;
  onAskFollowUp?: (followUp: string) => void;
}

export default function AnswerCard({
  question,
  answer,
  sources,
  timestamp,
  onAskFollowUp,
}: AnswerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const followUpSuggestions = [
    "Explain this with a real-world example",
    "Summarize in 3 bullet points",
    "Test me with a quick practice question",
  ];

  // Helper to format AI response cleanly without huge raw blocks
  const renderFormattedAnswer = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentBullets: string[] = [];

    const flushBullets = (key: string) => {
      if (currentBullets.length > 0) {
        elements.push(
          <ul key={key} className="my-3 space-y-2 pl-2">
            {currentBullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-slate-800">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shrink-0 mt-2" />
                <span className="flex-1">{renderInlineMarkdown(bullet)}</span>
              </li>
            ))}
          </ul>
        );
        currentBullets = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 3 or 4: ### or ####
      if (trimmed.startsWith("###")) {
        flushBullets(`bullets-before-h3-${index}`);
        const headingText = trimmed.replace(/^#+\s*/, "");
        elements.push(
          <h4 key={`h3-${index}`} className="mt-4 mb-2 text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            <span>{headingText}</span>
          </h4>
        );
      }
      // Heading 2: ##
      else if (trimmed.startsWith("##")) {
        flushBullets(`bullets-before-h2-${index}`);
        const headingText = trimmed.replace(/^#+\s*/, "");
        elements.push(
          <h3 key={`h2-${index}`} className="mt-5 mb-2.5 text-lg font-bold text-slate-900 border-b border-indigo-100 pb-1.5">
            {headingText}
          </h3>
        );
      }
      // Bullet points: - or *
      else if (/^[-*•]\s+/.test(trimmed)) {
        const bulletContent = trimmed.replace(/^[-*•]\s+/, "");
        currentBullets.push(bulletContent);
      }
      // Numbered list: 1. or 2.
      else if (/^\d+\.\s+/.test(trimmed)) {
        flushBullets(`bullets-before-num-${index}`);
        elements.push(
          <div key={`num-${index}`} className="my-2 flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 font-semibold text-xs text-blue-700 shrink-0 select-none mt-0.5">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <div className="flex-1">
              {renderInlineMarkdown(trimmed.replace(/^\d+\.\s+/, ""))}
            </div>
          </div>
        );
      }
      // Empty line
      else if (!trimmed) {
        flushBullets(`bullets-before-gap-${index}`);
      }
      // Regular paragraph
      else {
        flushBullets(`bullets-before-p-${index}`);
        elements.push(
          <p key={`p-${index}`} className="my-2.5 text-sm sm:text-base leading-relaxed text-slate-800">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      }
    });

    flushBullets("bullets-end");

    return elements;
  };

  // Helper for inline bold, italic, code tags
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-700 border border-indigo-100"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full space-y-5 animate-fade-in">
      {/* 1. User Question Card */}
      <div className="flex items-start justify-end gap-2.5">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-md bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 text-white shadow-sm shadow-indigo-500/20">
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
            <User className="h-3.5 w-3.5" />
            <span>Your Question</span>
            {timestamp && <span className="text-blue-200/90 font-normal">• {timestamp}</span>}
          </div>
          <p className="text-sm sm:text-base font-medium leading-relaxed">{question}</p>
        </div>
      </div>

      {/* 2. AI Answer Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                StudyMate Answer
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/80 shadow-2xs">
                  <CheckCircle2 className="h-3 w-3 text-teal-600" />
                  Based on your study material
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal-600" />
                  <span className="text-teal-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="pt-5 text-slate-800 text-base leading-relaxed">
          {renderFormattedAnswer(answer)}
        </div>

        {/* Follow-up question chips */}
        {onAskFollowUp && (
          <div className="mt-7 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wide">Continue learning:</p>
            <div className="flex flex-wrap gap-2">
              {followUpSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskFollowUp(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all border border-indigo-200/60 shadow-2xs active:scale-[0.98]"
                >
                  <span>{item}</span>
                  <ChevronRight className="h-3 w-3 text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sources Section */}
      {sources && sources.length > 0 && (
        <div className="mt-5 pt-2">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-100 text-teal-700">
                <BookOpen className="h-3 w-3" />
              </div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-slate-700">
                Sources from your study material
              </h4>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                {sources.length} {sources.length === 1 ? "chunk" : "chunks"}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
              Exact passages retrieved for grounding
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {sources.map((src, idx) => (
              <SourceCard key={idx} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
