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
  Code2,
} from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { getUserReportCardAction, UserReportCardData } from '@/app/actions/report-card';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

export default function StudentDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState({
    name: 'Student',
    username: 'learner',
    college: 'Engineering Campus',
    streakDays: 0,
    totalXp: 0,
    leagueTier: 'Bronze AI Engineer',
    leagueRank: 0,
    atsScore: 0,
    earnedBadges: [] as string[],
  });

  const [reportCard, setReportCard] = useState<UserReportCardData | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch real student profile from database / session
    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsAuthenticated(true);
          setUser({
            name: profile.fullName || 'Student',
            username: profile.username || 'learner',
            college: profile.collegeOrCompany || 'Engineering Campus',
            totalXp: profile.totalPoints ?? 0,
            streakDays: profile.currentStreak ?? 0,
            leagueTier: profile.leagueTier || 'Bronze AI Engineer',
            leagueRank: profile.leagueRank ?? 0,
            atsScore: profile.atsScore ?? 0,
            earnedBadges: [],
          });
        } else {
          // Check if local student session exists
          if (typeof window !== 'undefined') {
            const studentSession = localStorage.getItem('aignite_student_session');
            setIsAuthenticated(Boolean(studentSession));
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

    // 2. Fetch live report card directly from Supabase
    getUserReportCardAction()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.reportCard) {
          setReportCard(res.reportCard);
        }
      })
      .catch((err) => {
        console.warn('Could not load report card from Supabase:', err);
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
      {/* 2. HOW AIGNITE WORKS: DAILY PRACTICE MODULES */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground font-sans">
              How AIgnite Works - Daily Practice Modules
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete daily sparks, coding challenges, oral defenses, and architecture labs to build verified applied AI competence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily AI Spark */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Daily AI Spark</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Digest the latest production breakthroughs and research insights condensed into high-signal cards.
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

          {/* Problem of the Day */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Problem of the Day</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Solve daily hands-on technical and architecture challenges in code to reinforce core AI systems intuition.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/potd">
                <span>Solve Today&apos;s POTD</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>

          {/* Spoken Voice Coach */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <span>AI Voice Coach</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Answer AI systems questions out loud into your microphone with real-time cadence and STAR scoring.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/coach">
                <span>Practice Voice Coach</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>

          {/* Architecture Lab */}
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>Architecture Lab</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Test latency SLAs in the Sandbox, complete company interview missions, and debug production setups.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/sandbox">
                <span>Launch Lab</span>
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
                Verified AI Competency Report Card
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Recruiter-visible 5-axis competency evaluation aggregated across your coding challenges, interactive quizzes, system drills, and spoken defenses.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {reportCard && reportCard.hasActivity && (
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
          </div>
        </div>

        {reportCard && reportCard.hasActivity ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {[
                { label: 'Knowledge Depth', score: reportCard.knowledgeScore, sub: 'Algorithms & Math' },
                { label: 'Confidence & Pace', score: reportCard.confidenceScore, sub: reportCard.paceRating },
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
                {reportCard.totalInterviewsCompleted > 0 && (
                  <>
                    <Badge variant="secondary" className="text-sm font-mono">
                      Cadence: {reportCard.wordsPerMinute} WPM ({reportCard.paceRating})
                    </Badge>
                    <Badge variant="secondary" className="text-sm font-mono">
                      Speech Fillers: {reportCard.fillerCount} detected
                    </Badge>
                    <Badge variant="secondary" className="text-sm font-mono">
                      Oral Defenses: {reportCard.totalInterviewsCompleted} Completed
                    </Badge>
                  </>
                )}
                {reportCard.totalPotdCompleted > 0 && (
                  <Badge variant="secondary" className="text-sm font-mono">
                    POTD Challenges: {reportCard.totalPotdCompleted} Solved
                  </Badge>
                )}
                {reportCard.totalQuizzesCompleted > 0 && (
                  <Badge variant="secondary" className="text-sm font-mono">
                    Interactive Quizzes: {reportCard.totalQuizzesCompleted} Answered
                  </Badge>
                )}
                {user.streakDays > 0 && (
                  <Badge variant="secondary" className="text-sm font-mono">
                    Daily Streak: {user.streakDays} Days
                  </Badge>
                )}
              </div>
            </div>

            {/* Verbatim Oral Defense Excerpt */}
            {reportCard.latestDefenseExcerpt &&
              reportCard.latestDefenseExcerpt !== 'No spoken defense sessions completed yet.' &&
              reportCard.latestDefenseExcerpt !== 'No transcript recorded.' && (
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1.5">
                  <span className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                    <span>🎙️ Recent Spoken Defense Verbatim Excerpt:</span>
                  </span>
                  <p className="text-sm text-foreground/90 font-serif italic leading-relaxed">
                    &ldquo;{reportCard.latestDefenseExcerpt}&rdquo;
                  </p>
                </div>
              )}

            {/* Key Strengths & Coaching Areas */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm pt-1">
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Technical Strengths:</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                  {reportCard.strengths.map((s: string, idx: number) => (
                    <li key={idx} className="leading-snug">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <span className="font-bold text-amber-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Identified Coaching Areas:</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                  {reportCard.areasForImprovement.map((item: string, idx: number) => (
                    <li key={idx} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center rounded-xl bg-muted/30 border border-border space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
              📊
            </div>
            <h3 className="text-base font-bold text-foreground font-sans">No Interactive Challenge Records Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Complete a Problem of the Day, oral defense session, or spark quiz. Your multi-axis technical competency will automatically generate your verified report card.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="outline" className="font-bold text-sm shadow-xs gap-2">
                <Link href="/potd">
                  <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Solve Problem of the Day</span>
                </Link>
              </Button>
              <Button asChild className="font-bold text-sm shadow-xs gap-2">
                <Link href="/coach">
                  <Mic className="w-4 h-4" />
                  <span>Practice Voice Coach</span>
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
                {user.leagueRank > 0 ? `#${user.leagueRank}` : 'Unranked'}
              </span>
              {user.leagueRank > 0 && user.leagueRank <= 5 && (
                <Badge variant="outline" className="text-sm font-mono bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  Promotion Zone (Top 5)
                </Badge>
              )}
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
