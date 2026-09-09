'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Trophy, Map, Briefcase, Layers, ArrowRight, Mic } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-background/85 backdrop-blur-md">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:text-xs focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="AIgnite Homepage"
          className="flex items-center gap-2 group rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent p-[1px] flex items-center justify-center shadow-lg shadow-primary/15 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-foreground font-mono">
                <span className="text-primary font-extrabold underline decoration-primary/50 decoration-2 underline-offset-4">A</span>Ignite
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                SIH 2026
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground tracking-wide">
              pr. <span className="text-foreground/80 font-medium">/ɪɡˈnaɪt/</span> (silent A)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          {/* Explore Features Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Explore Features</span>
              <svg
                className="w-3.5 h-3.5 text-muted-foreground group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Popover */}
            <div className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-card border border-border p-2 shadow-xl shadow-black/25 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                Public Learning &amp; AI Tools
              </div>

              <Link
                href="/resume-analyzer"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    AI Resume ATS Analyzer
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Score resume &amp; identify missing AI skills
                  </div>
                </div>
              </Link>

              <Link
                href="/coach"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-chart-1/10 border border-chart-1/20 text-chart-1 flex items-center justify-center shrink-0 mt-0.5">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    Voice Mock Interview (POTD)
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Daily oral defense &amp; speech metrics
                  </div>
                </div>
              </Link>

              <Link
                href="/packs"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    Course Packs &amp; Materials
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    NVIDIA, Google, OpenAI, Meta tracks
                  </div>
                </div>
              </Link>

              <Link
                href="/roadmap"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-chart-4/10 border border-chart-4/20 text-chart-4 flex items-center justify-center shrink-0 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    AI Systems Roadmap
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    6-stage career pathway &amp; curriculum
                  </div>
                </div>
              </Link>

              <Link
                href="/feed"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    AIgnite Pulse (Sparks)
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Instagram-style micro-quizzes
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Student Dashboard Direct Link */}
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Dashboard</span>
          </Link>

          {/* Leaderboards Direct Link */}
          <Link
            href="/league"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trophy className="w-4 h-4 text-chart-5" />
            <span>Leaderboards</span>
          </Link>

          {/* Recruiters Link */}
          <Link
            href="/recruiter/apply"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>Recruiters</span>
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/login"
            className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Recruiter Login
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Sign In with OTP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
