"use client";

import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">AI StudyMate</h1>
            <p className="text-xs text-slate-400">
              AI-Powered Study & Document Assistant
            </p>
          </div>

          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center">
        <div className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          📚 Learn smarter with your own documents
        </div>

        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your documents.
          <br />
          <span className="text-slate-400">Your AI Study Assistant.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Upload your notes, PDFs, or study material and ask questions.
          AI StudyMate finds relevant information from your documents and
          gives you grounded answers.
        </p>
      </section>

      {/* Upload Card */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="rounded-xl border-2 border-dashed border-slate-700 p-10 text-center">
            <div className="mb-4 text-5xl">📄</div>

            <h3 className="text-xl font-semibold">
              Upload your study material
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              PDF, notes, research papers and other documents
            </p>

            <label className="mt-6 inline-block cursor-pointer rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              Choose File
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />
            </label>

            {fileName && (
              <p className="mt-4 text-sm text-green-400">
                ✓ Selected: {fileName}
              </p>
            )}
          </div>

          {/* Ask AI */}
          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Ask your documents
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. What are the main points of this document?"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-slate-500"
              />

              <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          <Feature
            icon="🔍"
            title="RAG-Powered Answers"
            description="Get answers based on the content of your uploaded documents."
          />

          <Feature
            icon="📖"
            title="Source References"
            description="See where the answer came from, including relevant document pages."
          />

          <Feature
            icon="💬"
            title="Study Chat History"
            description="Keep your questions and answers organized for later revision."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        AI StudyMate • Built with Next.js, Supabase, RAG & Generative AI
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}