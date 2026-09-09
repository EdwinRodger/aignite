'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Trophy,
  Map,
  Briefcase,
  Layers,
  ArrowRight,
  Mic,
  ShieldCheck,
  KeyRound,
  LayoutDashboard,
} from 'lucide-react';
import { getAuthUserAction } from '@/app/actions/auth';

export function Navbar() {
  const [userRole, setUserRole] = useState<'student' | 'recruiter' | null>(null);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const recruiterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
      if (recruiterRef.current && !recruiterRef.current.contains(event.target as Node)) {
        setRecruiterOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFeaturesOpen(false);
        setRecruiterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getAuthUserAction();
        if (res.loggedIn && res.role) {
          setUserRole(res.role);
          return;
        }
      } catch {
        // ignore
      }

      if (typeof window !== 'undefined') {
        const recruiterSession = localStorage.getItem('aignite_recruiter_session');
        const studentStreak = localStorage.getItem('aignite_student_streak');
        const studentSession = localStorage.getItem('aignite_student_session');
        if (recruiterSession) {
          setUserRole('recruiter');
        } else if (studentStreak || studentSession) {
          setUserRole('student');
        } else {
          setUserRole(null);
        }
      }
    }
    checkAuth();
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
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
          <span className="text-xl font-black tracking-tight text-foreground font-mono">
            <span className="text-primary font-extrabold underline decoration-primary/50 decoration-2 underline-offset-4">A</span>Ignite
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          {/* Explore Features Dropdown */}
          <div ref={featuresRef} className="relative group">
            <button
              type="button"
              id="features-menu-button"
              aria-haspopup="true"
              aria-expanded={featuresOpen}
              aria-controls="features-menu"
              onClick={() => {
                setFeaturesOpen((prev) => !prev);
                setRecruiterOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setFeaturesOpen(false);
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Explore Features</span>
              <svg
                aria-hidden="true"
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  featuresOpen ? 'rotate-180' : 'group-hover:rotate-180'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Popover */}
            <div
              id="features-menu"
              role="region"
              aria-labelledby="features-menu-button"
              className={`absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-card border border-border p-2 shadow-xl shadow-black/25 transition-all duration-150 z-50 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible ${
                featuresOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
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
              {/* Leaderboards moved into Explore Features at the bottom */}
              <div className="pt-1 mt-1 border-t border-border/70">
                <Link
                  href="/league"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-chart-5/10 border border-chart-5/20 text-chart-5 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors flex items-center gap-1.5">
                      <span>Competitive Leaderboards</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-chart-5/15 text-chart-5 font-mono font-semibold">Live</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-snug">
                      Regional, National &amp; International ranks
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Consolidated Recruiter Dropdown (Apply & Login under 1 button) */}
          <div ref={recruiterRef} className="relative group">
            <button
              type="button"
              id="recruiter-menu-button"
              aria-haspopup="true"
              aria-expanded={recruiterOpen}
              aria-controls="recruiter-menu"
              onClick={() => {
                setRecruiterOpen((prev) => !prev);
                setFeaturesOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setRecruiterOpen(false);
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium text-sm cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Recruiters</span>
              <svg
                aria-hidden="true"
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  recruiterOpen ? 'rotate-180' : 'group-hover:rotate-180'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Recruiter Popover */}
            <div
              id="recruiter-menu"
              role="region"
              aria-labelledby="recruiter-menu-button"
              className={`absolute top-full left-0 mt-1.5 w-64 rounded-2xl bg-card border border-border p-2 shadow-xl shadow-black/25 transition-all duration-150 z-50 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible ${
                recruiterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                Verified Recruiter Access
              </div>

              <Link
                href="/recruiter/apply"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    Apply for Access
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Corporate domain verification
                  </div>
                </div>
              </Link>

              <Link
                href="/recruiter/login"
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound className="w-4 h-4 text-chart-2" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    Recruiter Sign In
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Search verified student talent
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Auth / Dashboard CTA */}
        <div className="flex items-center gap-3">
          {userRole === 'student' ? (
            <Link
              href="/dashboard"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : userRole === 'recruiter' ? (
            <Link
              href="/recruiter/dashboard"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Sign In with OTP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
