"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  BookOpen,
  Sparkles,
  FolderOpen,
  MessageSquare,
  History,
  Settings,
  X,
  GraduationCap,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      id: "chat" as const,
      label: "Study Chat",
      icon: MessageSquare,
      badge: null,
      accentColor: "text-blue-600",
    },
    {
      id: "documents" as const,
      label: "My Documents",
      icon: FolderOpen,
      badge: documentCount > 0 ? documentCount : null,
      accentColor: "text-teal-600",
    },
    {
      id: "history" as const,
      label: "History",
      icon: History,
      badge: historyCount > 0 ? historyCount : null,
      accentColor: "text-purple-600",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all shadow-[0_2px_12px_-4px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("chat")}
            className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 -m-1 transition-all"
          >
            {/* Glowing Logo Icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/25 transition-all duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/35">
              <BookOpen className="h-5 w-5 drop-shadow-xs" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-2xs ring-2 ring-white">
                <Sparkles className="h-2.5 w-2.5 fill-current" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AI StudyMate
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
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
        <nav className="hidden md:flex items-center gap-1.5 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/70 shadow-2xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? item.accentColor : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200/80 text-slate-600"
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
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-2xs"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1 pl-1.5 pr-3 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-semibold text-xs shadow-2xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="hidden text-left sm:block max-w-[150px] lg:max-w-[200px]">
              <p className="text-xs font-semibold leading-none text-slate-900 truncate">
                {userEmail || "Student Account"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[10px] leading-tight text-teal-700 font-medium">
                  Authenticated
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            title="Log Out of StudyMate"
            className="flex items-center gap-1.5 h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">Log out</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:hidden shadow-2xs"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rotate-90" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden animate-fade-in">
          {userEmail && (
            <div className="mb-3 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-bold text-xs">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">
                    {userEmail}
                  </p>
                  <p className="text-[10px] text-teal-700 font-medium">Logged in</p>
                </div>
              </div>
            </div>
          )}

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
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold"
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

            {/* Mobile Sign Out Button */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
