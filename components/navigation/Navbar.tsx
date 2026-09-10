'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronDown,
} from 'lucide-react';
import { getAuthUserAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [userRole, setUserRole] = useState<'student' | 'recruiter' | null>(null);

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
        const studentSession = localStorage.getItem('aignite_student_session');
        if (recruiterSession) {
          setUserRole('recruiter');
        } else if (studentSession) {
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:text-sm focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="AIgnite Homepage"
          className="flex items-center gap-2.5 group rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <Image
              src="/logo-icon.png"
              alt="AIgnite Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground font-mono">
            <span className="text-primary font-extrabold underline decoration-primary/50 decoration-2 underline-offset-4">
              A
            </span>
            Ignite
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          {/* Explore Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl px-3.5 py-2 font-medium text-sm gap-1.5 text-muted-foreground hover:text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Explore Features</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 rounded-2xl">
              <DropdownMenuLabel className="font-mono font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5 text-sm">
                Public Learning & AI Tools
              </DropdownMenuLabel>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/resume-analyzer" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">AI Resume ATS Analyzer</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      Score resume & identify missing AI skills
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/coach" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-chart-1/10 border border-chart-1/20 text-chart-1 flex items-center justify-center shrink-0 mt-0.5">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Voice Mock Interview (POTD)</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      Daily oral defense & speech metrics
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/packs" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Course Packs & Materials</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      NVIDIA, Google, OpenAI, Meta tracks
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/roadmap" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-chart-4/10 border border-chart-4/20 text-chart-4 flex items-center justify-center shrink-0 mt-0.5">
                    <Map className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">AI Systems Roadmap</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      6-stage career pathway & curriculum
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link
                  href={userRole === 'student' ? '/feed' : '/#ai-sparks'}
                  className="flex items-start gap-3 w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">AIgnite Pulse (Sparks)</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      5-minute architectural micro-quizzes
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/league" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-chart-5/10 border border-chart-5/20 text-chart-5 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>Competitive Leaderboards</span>
                      <Badge variant="outline" className="text-chart-5 border-chart-5/30 bg-chart-5/10 font-mono">
                        Live
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      Regional, National & International ranks
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Consolidated Recruiter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl px-3.5 py-2 font-medium text-sm gap-1.5 text-muted-foreground hover:text-foreground">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>Recruiters</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 p-2 rounded-2xl">
              <DropdownMenuLabel className="font-mono font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5 text-sm">
                Verified Recruiter Access
              </DropdownMenuLabel>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/recruiter/apply" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Apply for Access</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      Corporate domain verification
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="p-2.5 rounded-xl cursor-pointer">
                <Link href="/recruiter/login" className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-4 h-4 text-chart-2" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Recruiter Sign In</div>
                    <div className="text-sm text-muted-foreground leading-snug">
                      Search verified student talent
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Auth / Dashboard CTA */}
        <div className="flex items-center gap-3">
          {userRole === 'student' ? (
            <Button asChild size="default" className="rounded-lg font-semibold text-sm shadow-xs">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          ) : userRole === 'recruiter' ? (
            <Button asChild size="default" className="rounded-lg font-semibold text-sm shadow-xs">
              <Link href="/recruiter/dashboard" className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="default" className="rounded-lg font-semibold text-sm shadow-xs">
              <Link href="/login" className="flex items-center gap-1.5">
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
