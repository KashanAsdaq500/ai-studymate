"use client";

import React, { useState } from "react";
import { MessageSquare, BookOpen, RotateCcw } from "lucide-react";
import QuestionInput from "./QuestionInput";
import ExampleQuestions from "./ExampleQuestions";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import AnswerCard from "./AnswerCard";
import { SourceItem } from "./SourceCard";
import { HistoryItem } from "./HistoryPanel";

interface StudyChatProps {
  onAddHistory: (item: HistoryItem) => void;
  activeDocName?: string;
  initialQuery?: string;
}

export default function StudyChat({
  onAddHistory,
  activeDocName = "Machine Learning Notes",
  initialQuery = "",
}: StudyChatProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active QA State
  const [currentResult, setCurrentResult] = useState<{
    question: string;
    answer: string;
    sources: SourceItem[];
    timestamp: string;
  } | null>(null);

  // Handle Asking Question
  const handleAsk = async (textToAsk?: string) => {
    const questionText = (textToAsk !== undefined ? textToAsk : query).trim();
    if (!questionText || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: questionText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to retrieve an answer from StudyMate.");
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newResult = {
        question: questionText,
        answer: data.answer || "No answer generated.",
        sources: (data.sources || []).map(
          (s: { chunk_index?: number; similarity?: number; text?: string; document_name?: string }) => ({
            chunk_index: s.chunk_index ?? 0,
            similarity: s.similarity ?? 0.85,
            text: s.text || "",
            document_name: s.document_name || activeDocName || "Study Document",
          })
        ),
        timestamp,
      };

      setCurrentResult(newResult);

      // Save into history
      onAddHistory({
        id: `qa-${Date.now()}`,
        question: questionText,
        answer: newResult.answer,
        sources: newResult.sources,
        timestamp,
        documentName: activeDocName,
      });

      // Clear input on success
      setQuery("");
    } catch (err: unknown) {
      console.error("Ask query error:", err);
      const errorMessageText =
        err instanceof Error
          ? err.message
          : "StudyMate couldn't generate an answer right now. Please try again.";
      setErrorMessage(errorMessageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setQuery(prompt);
    handleAsk(prompt);
  };

  const handleResetChat = () => {
    setCurrentResult(null);
    setErrorMessage(null);
    setQuery("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Interactive Chat Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-200">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Ask your StudyMate
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Ask anything from your uploaded study material.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active Document Indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 px-3.5 py-1.5 text-xs text-slate-700 shadow-2xs">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-bold text-slate-900">{activeDocName}</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            {currentResult && (
              <button
                type="button"
                onClick={handleResetChat}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-2xs"
                title="Start a new question"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Area */}
        <div className="py-6">
          {/* 1. Loading State */}
          {isLoading && <LoadingState />}

          {/* 2. Error State */}
          {!isLoading && errorMessage && (
            <ErrorState
              message={errorMessage}
              onRetry={() => handleAsk(currentResult?.question || query)}
            />
          )}

          {/* 3. Answer Display */}
          {!isLoading && !errorMessage && currentResult && (
            <AnswerCard
              question={currentResult.question}
              answer={currentResult.answer}
              sources={currentResult.sources}
              timestamp={currentResult.timestamp}
              onAskFollowUp={(followUp) => {
                setQuery(followUp);
                handleAsk(followUp);
              }}
            />
          )}

          {/* 4. Empty State */}
          {!isLoading && !errorMessage && !currentResult && (
            <EmptyState onSelectPrompt={handleSelectPrompt} />
          )}
        </div>

        {/* Question Input Section */}
        <div className="border-t border-slate-100 pt-5">
          <QuestionInput
            value={query}
            onChange={setQuery}
            onSubmit={() => handleAsk()}
            isLoading={isLoading}
            placeholder="Ask a question about your study material..."
          />

          {/* Example prompts if an answer is currently showing */}
          {currentResult && !isLoading && (
            <div className="mt-4 pt-2">
              <ExampleQuestions onSelect={handleSelectPrompt} disabled={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
