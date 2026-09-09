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
          <Link
            href="/feed"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Feed (Sparks)</span>
          </Link>
          <Link
            href="/packs"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Layers className="w-4 h-4 text-secondary-foreground" />
            <span>Company Packs</span>
          </Link>
          <Link
            href="/coach"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mic className="w-4 h-4 text-chart-1" />
            <span>Voice Coach</span>
          </Link>
          <Link
            href="/roadmap"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Map className="w-4 h-4 text-chart-4" />
            <span>Roadmap</span>
          </Link>
          <Link
            href="/league"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trophy className="w-4 h-4 text-chart-5" />
            <span>Interview League</span>
          </Link>
          <Link
            href="/resume-analyzer"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Resume ATS</span>
          </Link>
          <Link
            href="/recruiter/apply"
            className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>Recruiters</span>
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/login"
            className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Recruiter Login
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span>Sign In with OTP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
