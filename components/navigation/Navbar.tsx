'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Trophy, Map, Briefcase, Layers, ArrowRight } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0B0F17]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white font-mono">
                <span className="text-indigo-400 font-extrabold underline decoration-indigo-500/50 decoration-2 underline-offset-4">A</span>Ignite
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SIH 2026
              </span>
            </div>
            <span className="text-[9px] text-slate-400 tracking-wide -mt-0.5">
              pr. <span className="text-slate-300 font-medium">/ɪɡˈnaɪt/</span> (silent A)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/feed"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Feed (Sparks)</span>
          </Link>
          <Link
            href="/packs"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Company Packs</span>
          </Link>
          <Link
            href="/roadmap"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span>Roadmap</span>
          </Link>
          <Link
            href="/league"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Interview League</span>
          </Link>
          <Link
            href="/recruiter/apply"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
          >
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>Recruiters</span>
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/login"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2 transition-colors"
          >
            Recruiter Login
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all active:scale-95"
          >
            <span>Sign In with OTP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
