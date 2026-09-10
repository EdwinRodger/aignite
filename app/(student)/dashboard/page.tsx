'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Mic,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  Boxes,
  FileText,
  Flame,
  Zap,
  TrendingUp,
  CircleDot,
} from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

export default function StudentDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState({
    name: 'AI Learner',
    username: 'learner',
    college: 'Student Campus',
    streakDays: 3,
    totalXp: 415,
    leagueTier: 'Silver AI Engineer',
    leagueRank: 5,
    atsScore: 84,
    earnedBadges: [] as string[],
  });

  const [reportCard, setReportCard] = useState<{
    knowledgeScore: number;
    confidenceScore: number;
    communicationScore: number;
    examplesScore: number;
    industryLevelScore: number;
    overallScore: number;
    speechCadence: string;
    fillerCount: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch real student profile from database / session
    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsAuthenticated(true);
          setUser((prev) => ({
            ...prev,
            name: profile.fullName || prev.name,
            username: profile.username || prev.username,
            college: profile.collegeOrCompany || prev.college,
            totalXp: profile.totalPoints || prev.totalXp,
            streakDays: profile.currentStreak || prev.streakDays,
            leagueTier: profile.leagueTier || prev.leagueTier,
            leagueRank: profile.leagueRank || prev.leagueRank,
            atsScore: profile.atsScore || prev.atsScore,
          }));
        } else {
          // Check if local student session exists
          if (typeof window !== 'undefined') {
            const studentSession = localStorage.getItem('aignite_student_session');
            if (studentSession) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load student profile from database:', err);
        if (!isMounted) return;
        if (typeof window !== 'undefined') {
          const studentSession = localStorage.getItem('aignite_student_session');
          setIsAuthenticated(Boolean(studentSession));
        } else {
          setIsAuthenticated(false);
        }
      });

    // 2. Merge local storage overrides if available (deferred to avoid cascading synchronous render)
    queueMicrotask(() => {
      if (!isMounted || typeof window === 'undefined') return;
      const storedPoints = localStorage.getItem('aignite_student_points');
      const storedStreak = localStorage.getItem('aignite_student_streak');
      const storedReport = localStorage.getItem('aignite_user_report_card');
      const storedUser = localStorage.getItem('aignite_user_profile');

      if (storedUser || storedPoints || storedStreak) {
        setUser((prev) => {
          let updated = { ...prev };
          if (storedUser) {
            try {
              updated = { ...updated, ...JSON.parse(storedUser) };
            } catch {
              // fallback
            }
          }
          if (storedPoints) {
            updated.totalXp = parseInt(storedPoints, 10);
          }
          if (storedStreak) {
            updated.streakDays = parseInt(storedStreak, 10);
          }
          return updated;
        });
      }

      if (storedReport) {
        try {
          const parsed = JSON.parse(storedReport);
          setReportCard(parsed);
        } catch {
          // fallback
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-muted-foreground font-mono text-sm">
          <Sparkles className="w-4 h-4 animate-spin text-primary" />
          <span>Verifying student account...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ProtectedRouteGate title="Student Engineering Dashboard" />;
  }

  const userInitials =
    user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AL';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. STUDENT PROFILE & STREAK HEADER */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 shadow-xs bg-card border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center shadow-xs shrink-0 font-mono">
              {userInitials}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <Badge
                  variant="outline"
                  className="gap-1 px-2.5 py-0.5 bg-primary/10 border-primary/20 text-primary text-sm font-bold font-mono"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Student</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {user.college} - @{user.username} - Division: {user.leagueTier}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Card className="px-4 py-2.5 flex items-center gap-2.5 shadow-xs border-border">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{user.streakDays}-Day Streak</div>
                <div className="text-sm text-muted-foreground font-mono">Daily defense active</div>
              </div>
            </Card>

            <Card className="px-4 py-2.5 flex items-center gap-2.5 shadow-xs border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{user.totalXp} Total XP</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {user.leagueRank > 0 ? `Rank #${user.leagueRank} in cohort` : 'Division: Bronze'}
                </div>
              </div>
            </Card>

            <Card className="px-4 py-2.5 shadow-xs border-border hover:border-primary/40 transition-colors">
              <Link href="/resume-analyzer" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold font-mono text-sm">
                  {user.atsScore > 0 ? `${user.atsScore}%` : 'Scan'}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">ATS Score</div>
                  <div className="text-sm text-emerald-700 font-mono">
                    {user.atsScore > 0 ? 'Verified Match' : 'Upload Resume'}
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 2. HOW AIGNITE WORKS: 3-STEP DAILY MASTERY WORKFLOW */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground font-sans">
              How AIgnite Works - Your Daily 3-Step Routine
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow this 18-minute daily loop to build verified applied AI competence and get discovered by hiring teams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Daily AI Spark */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm font-mono">
                  1
                </div>
                <Badge variant="outline" className="text-sm font-mono bg-muted text-muted-foreground">
                  5 Mins
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Daily AI Spark</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Digest the latest production breakthroughs (FlashAttention-3, DeepSeek GRPO, vLLM) condensed into high-signal engineering cards.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/feed">
                <span>Read Today&apos;s Spark</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>

          {/* Step 2: Spoken Voice Defense */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm font-mono">
                  2
                </div>
                <Badge variant="outline" className="text-sm font-mono bg-muted text-muted-foreground">
                  3 Mins
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <span>Voice Oral Defense</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Answer today&apos;s AI Problem of the Day into your microphone. Receive real-time speech cadence, filler detection, and STAR scoring.
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="w-full font-bold text-sm">
              <Link href="/coach">
                <span>Practice POTD</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>

          {/* Step 3: Company Packs & Sandbox */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm font-mono">
                  3
                </div>
                <Badge variant="outline" className="text-sm font-mono bg-muted text-muted-foreground">
                  10 Mins
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>Interactive Architecture Lab</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Test sub-50ms latency SLAs in the Architecture Sandbox, complete company interview missions, and debug production PyTorch bugs.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/sandbox">
                <span>Launch Architecture Lab</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VERIFIED AI REPORT CARD & ORAL DEFENSE TELEMETRY */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground font-sans">
                Verified AI Report Card &amp; Spoken Telemetry
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Recruiter-visible 5-axis competency evaluation aggregated across your spoken defense sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {reportCard && (
              <div className="text-right">
                <span className="text-sm uppercase font-mono text-muted-foreground block">
                  Composite Index
                </span>
                <span className="text-2xl font-black font-mono text-primary">
                  {reportCard.overallScore.toFixed(1)}{' '}
                  <span className="text-sm font-normal text-muted-foreground">/ 10</span>
                </span>
              </div>
            )}
            <Button asChild size="sm" className="font-bold text-sm gap-1.5 shadow-xs">
              <Link href="/coach">
                <Mic className="w-3.5 h-3.5" />
                <span>Practice POTD</span>
              </Link>
            </Button>
          </div>
        </div>

        {reportCard ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {[
                { label: 'Knowledge Depth', score: reportCard.knowledgeScore, sub: 'Algorithms & Math' },
                { label: 'Confidence & Pace', score: reportCard.confidenceScore, sub: reportCard.speechCadence },
                { label: 'Communication', score: reportCard.communicationScore, sub: 'STAR Structure' },
                { label: 'Practical Examples', score: reportCard.examplesScore, sub: 'VRAM & Latency Metrics' },
                { label: 'Industry Readiness', score: reportCard.industryLevelScore, sub: 'Senior Staff Bar' },
              ].map((axis) => (
                <div key={axis.label} className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-1.5">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block truncate">
                    {axis.label}
                  </span>
                  <div className="text-xl font-black font-mono text-foreground">{axis.score.toFixed(1)}</div>
                  <Progress value={(axis.score / 10) * 100} className="h-1.5" />
                  <span className="text-sm font-mono text-muted-foreground block truncate">
                    {axis.sub}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm font-mono text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm font-mono">
                  Cadence: {reportCard.speechCadence}
                </Badge>
                <Badge variant="secondary" className="text-sm font-mono">
                  Speech Fillers: {reportCard.fillerCount} detected (Elite Bar)
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm font-bold bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                >
                  ✓ Anti-Impersonation Checked
                </Badge>
              </div>

              <span className="text-sm text-primary font-bold">
                Visible to approved enterprise recruiters
              </span>
            </div>
          </>
        ) : (
          <div className="p-8 text-center rounded-xl bg-muted/30 border border-border space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
              🎙️
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">No Spoken Defense Records Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Answer today&apos;s AI Problem of the Day on the Voice Coach. Your verbal cadence, STAR structure, and technical depth will automatically generate your verified report card.
            </p>
            <div className="pt-2">
              <Button asChild className="font-bold text-sm shadow-xs gap-2">
                <Link href="/coach">
                  <Mic className="w-4 h-4" />
                  <span>Begin Voice Defense Session</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 4. WEEKLY LEAGUE STANDING (COMPACT PREVIEW - NOT FULL TABLE) */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 space-y-5 shadow-xs border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground font-sans">
                Weekly Competitive League Standing
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              You are competing in a 30-student weekly cohort bracket. Top 5 students promote to Gold AI Engineer on Sunday.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="font-bold text-sm gap-1.5 shrink-0">
            <Link href="/league">
              <span>View Full Bracket &amp; Leaderboards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-sm font-mono text-muted-foreground">Current Division</span>
            <div className="text-base font-bold text-foreground flex items-center gap-2">
              <span>🥈</span>
              <span>{user.leagueTier}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-sm font-mono text-muted-foreground">Cohort Bracket Position</span>
            <div className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg font-black">
                #{user.leagueRank > 0 ? user.leagueRank : 5}
              </span>
              <Badge variant="outline" className="text-sm font-mono bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                Promotion Zone (Top 5)
              </Badge>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-sm font-mono text-muted-foreground">Weekly Score</span>
            <div className="text-base font-bold font-mono text-foreground">
              {user.totalXp} XP earned this week
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 5. EXPLORE THE SUITE QUICK LAUNCH TILES */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground font-sans">
          Quick Access Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/packs"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-2 block shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">Company Packs</h3>
            <p className="text-sm text-muted-foreground">
              Targeted interview blueprints for OpenAI, Anthropic, Google DeepMind, and NVIDIA.
            </p>
          </Link>

          <Link
            href="/sandbox"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-2 block shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">Architecture Lab</h3>
            <p className="text-sm text-muted-foreground">
              Interactive system builder with real-time latency, VRAM telemetry, and mini-games.
            </p>
          </Link>

          <Link
            href="/games/pipeline-bubble"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-2 block shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CircleDot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">Practice Games</h3>
            <p className="text-sm text-muted-foreground">
              Master RAG pipeline sequencing, PyTorch bug hunting, and hardware trade-offs.
            </p>
          </Link>

          <Link
            href="/resume-analyzer"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-2 block shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">Resume ATS Radar</h3>
            <p className="text-sm text-muted-foreground">
              Real-time vector ATS scoring against elite AI role descriptions and hiring rubrics.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
