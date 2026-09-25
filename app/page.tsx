"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import WelcomeHero from "@/components/WelcomeHero";
import StudyChat from "@/components/StudyChat";
import DocumentPanel from "@/components/DocumentPanel";
import { DocumentInfo } from "@/components/DocumentCard";
import HistoryPanel, { HistoryItem } from "@/components/HistoryPanel";
import SettingsModal from "@/components/SettingsModal";
import Footer from "@/components/Footer";

// Fallback initial documents until loaded from Supabase
const INITIAL_DOCUMENTS: DocumentInfo[] = [
  {
    id: "doc-1",
    name: "Machine Learning Notes",
    fileName: "Machine Learning.docx",
    status: "Ready for AI",
    indexedChunks: 3,
    size: "245 KB",
    uploadDate: "Today",
    format: "DOCX",
  },
];

// Initial mock history matching the prompt specifications
const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    question: "What is machine learning?",
    answer:
      "Machine learning is a branch of artificial intelligence focused on building applications that learn from data and improve their accuracy over time without being explicitly programmed. Common paradigms include supervised learning, unsupervised learning, and reinforcement learning.",
    sources: [
      {
        chunk_index: 0,
        similarity: 0.88,
        text: "Machine learning focuses on algorithmic systems that parse data, learn from that data, and apply what they have learned to make informed decisions.",
        document_name: "Machine Learning.docx",
      },
    ],
    timestamp: "10:30 AM",
    documentName: "Machine Learning Notes",
  },
  {
    id: "hist-2",
    question: "Explain supervised learning",
    answer:
      "Supervised learning is an approach where an algorithm learns from labeled training data. The model is presented with inputs paired with correct outputs, enabling it to map inputs to predictions and generalize to new, unseen examples.",
    sources: [
      {
        chunk_index: 1,
        similarity: 0.84,
        text: "In supervised learning, the system is provided with inputs and corresponding outputs, and learns the underlying mapping function.",
        document_name: "Machine Learning.docx",
      },
    ],
    timestamp: "Yesterday",
    documentName: "Machine Learning Notes",
  },
  {
    id: "hist-3",
    question: "What is overfitting?",
    answer:
      "Overfitting occurs when a machine learning model learns the training data too closely, including noise and outliers, causing it to perform poorly on new, unseen test data. Regularization techniques and cross-validation help prevent overfitting.",
    sources: [
      {
        chunk_index: 2,
        similarity: 0.81,
        text: "Overfitting happens when a statistical model describes random error or noise instead of the underlying relationship.",
        document_name: "Machine Learning.docx",
      },
    ],
    timestamp: "2 days ago",
    documentName: "Machine Learning Notes",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "documents" | "history">("chat");
  const [documents, setDocuments] = useState<DocumentInfo[]>(INITIAL_DOCUMENTS);
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDocForChat, setActiveDocForChat] = useState("Machine Learning Notes");
  const [prefilledQuery, setPrefilledQuery] = useState("");

  const fetchRealDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.documents) && data.documents.length > 0) {
        setDocuments(data.documents);
        setActiveDocForChat((prev) => {
          // If previous active doc is still in list, keep it; else set to first doc
          const exists = data.documents.some((d: DocumentInfo) => d.name === prev);
          return exists ? prev : data.documents[0].name;
        });
      }
    } catch (e) {
      console.error("Failed to load real documents from API:", e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRealDocuments();
  }, [fetchRealDocuments]);

  const handleAddHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveTab("chat");
    setPrefilledQuery(item.question);
  };

  const handleUploadDocument = (newDoc: DocumentInfo) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    setActiveDocForChat(newDoc.name);
  };

  const handleSelectDocumentForChat = (docName: string) => {
    setActiveDocForChat(docName);
    setActiveTab("chat");
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] bg-mesh-study">
      {/* 1. Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCount={documents.length}
        historyCount={history.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === "chat" && (
          <div className="space-y-6">
            {/* 2. Hero / Welcome Area */}
            <WelcomeHero />

            {/* 3. Main Study Chat Area */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <StudyChat
                onAddHistory={handleAddHistory}
                activeDocName={activeDocForChat}
                initialQuery={prefilledQuery}
              />
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
            <DocumentPanel
              documents={documents}
              activeDocName={activeDocForChat}
              onUploadSuccess={handleUploadDocument}
              onSelectDocumentForChat={handleSelectDocumentForChat}
              onRefreshDocuments={fetchRealDocuments}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
            <HistoryPanel
              history={history}
              onSelectHistory={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}