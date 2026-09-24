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
          <ul key={key} className="my-2.5 space-y-1.5 pl-5 list-disc text-slate-700">
            {currentBullets.map((bullet, i) => (
              <li key={i} className="text-sm leading-relaxed pl-1">
                {renderInlineMarkdown(bullet)}
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
          <h4 key={`h3-${index}`} className="mt-4 mb-2 text-base font-bold text-slate-900">
            {headingText}
          </h4>
        );
      }
      // Heading 2: ##
      else if (trimmed.startsWith("##")) {
        flushBullets(`bullets-before-h2-${index}`);
        const headingText = trimmed.replace(/^#+\s*/, "");
        elements.push(
          <h3 key={`h2-${index}`} className="mt-5 mb-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-1">
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
          <div key={`num-${index}`} className="my-1.5 flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-blue-600 shrink-0 select-none">
              {trimmed.match(/^\d+\./)?.[0]}
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
          <p key={`p-${index}`} className="my-2.5 text-sm sm:text-base leading-relaxed text-slate-700">
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
    // Replace **bold**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-blue-800 border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* 1. User Question Card */}
      <div className="flex items-start justify-end gap-2.5">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-blue-600 px-4 py-3 text-white shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium text-blue-100">
            <User className="h-3 w-3" />
            <span>Your Question</span>
            {timestamp && <span className="text-blue-200">• {timestamp}</span>}
          </div>
          <p className="text-sm sm:text-base font-medium leading-relaxed">{question}</p>
        </div>
      </div>

      {/* 2. AI Answer Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                StudyMate Answer
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  <CheckCircle2 className="h-3 w-3 text-teal-600" />
                  Based on your study material
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal-600" />
                  <span className="text-teal-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="pt-4 text-slate-800">
          {renderFormattedAnswer(answer)}
        </div>

        {/* Follow-up question chips */}
        {onAskFollowUp && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Continue learning:</p>
            <div className="flex flex-wrap gap-2">
              {followUpSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskFollowUp(item)}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors border border-blue-100"
                >
                  <span>{item}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sources Section */}
      {sources && sources.length > 0 && (
        <div className="mt-4 pt-2">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-teal-600" />
              <h4 className="text-xs font-bold tracking-wide uppercase text-slate-600">
                Sources from your study material
              </h4>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {sources.length} {sources.length === 1 ? "chunk" : "chunks"}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Exact passages retrieved for grounding
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {sources.map((src, idx) => (
              <SourceCard key={idx} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
