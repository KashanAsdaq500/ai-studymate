"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, FolderOpen, MessageSquare, History, Settings, X, GraduationCap, ChevronRight } from "lucide-react";

interface NavbarProps {
  activeTab: "chat" | "documents" | "history";
  setActiveTab: (tab: "chat" | "documents" | "history") => void;
  documentCount?: number;
  historyCount?: number;
  onOpenSettings: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  documentCount = 1,
  historyCount = 0,
  onOpenSettings,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: "chat" as const,
      label: "Study Chat",
      icon: MessageSquare,
      badge: null,
    },
    {
      id: "documents" as const,
      label: "My Documents",
      icon: FolderOpen,
      badge: documentCount > 0 ? documentCount : null,
    },
    {
      id: "history" as const,
      label: "History",
      icon: History,
      badge: historyCount > 0 ? historyCount : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("chat")}
            className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -m-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AI StudyMate
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  <Sparkles className="h-2.5 w-2.5 text-blue-600" />
                  Study smarter
                </span>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block">
                AI-powered Study & Document Assistant
              </p>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm shadow-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[11px] font-semibold ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Avatar & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSettings}
            title="Settings & Preferences"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Profile Placeholder */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pl-1.5 pr-2.5 shadow-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-white font-semibold text-xs shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-xs font-semibold leading-none text-slate-900">Student Account</p>
              <p className="text-[10px] leading-tight text-teal-700 font-medium">Ready to learn</p>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rotate-90" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
