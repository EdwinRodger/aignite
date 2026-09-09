'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import {
  Trophy,
  Mic,
  ArrowRight,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const user = {
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    college: 'IIT Bombay',
    streakDays: 7,
    totalXp: 1240,
    leagueTier: 'Silver AI Engineer',
    leagueRank: 4,
    atsScore: 89,
    earnedBadges: ['RAG Master', 'Vector Wizard', '7-Day Flame Streak'],
  };

  const enrolledPacks = [
    {
      title: 'NVIDIA AI Pack: CUDA & TensorRT',
      company: 'NVIDIA',
      icon: '🟢',
      progress: 83,
      completedModules: 5,
      totalModules: 6,
      slug: 'nvidia-ai-pack',
      badge: 'TensorRT Specialist',
    },
    {
      title: 'OpenAI Pack: Function Calling & Agents',
      company: 'OpenAI',
      icon: '⚪',
      progress: 100,
      completedModules: 4,
      totalModules: 4,
      slug: 'openai-pack',
      badge: 'Agent Architect',
    },
    {
      title: 'Google AI Pack: Gemma & Transformers',
      company: 'Google',
      icon: '🔴',
      progress: 60,
      completedModules: 3,
      totalModules: 5,
      slug: 'google-ai-pack',
      badge: 'Gemma Specialist',
    },
    {
      title: 'Meta AI Pack: LLaMA & PyTorch FSDP',
      company: 'Meta',
      icon: '🔵',
      progress: 40,
      completedModules: 2,
      totalModules: 5,
      slug: 'meta-ai-pack',
      badge: 'FSDP Specialist',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-card via-card to-muted border border-border p-6 sm:p-8 shadow-xl shadow-black/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-foreground font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                AS
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                    Welcome back, {user.name}!
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {user.college} • @{user.username} • Next milestone: Gold AI Engineer
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                  🔥
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{user.streakDays}-Day Streak</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Keep it burning!</div>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{user.totalXp} Total XP</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Top 8% this week</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Command Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Primary Daily Action Items */}
          <div className="lg:col-span-8 space-y-8">
            {/* Today's Question of the Day (POTD) Widget */}
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-lg shadow-black/5 space-y-4 relative overflow-hidden group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 border border-chart-1/20 text-chart-1 text-xs font-bold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Daily Morning Voice Habit (POTD)</span>
                </div>
                <span className="text-xs font-mono text-primary font-bold">+25 XP Today</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground font-sans">
                  Explain Group Relative Policy Optimization (GRPO) vs PPO
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Focus on why GRPO eliminates the critic/value network, cutting memory consumption during reasoning model reinforcement learning.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Expected Duration: ~45–60 seconds</span>
                </div>

                <Link
                  href="/coach"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary/20 hover:opacity-90 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-primary-foreground" />
                  <span>Record Spoken Defense</span>
                </Link>
              </div>
            </div>

            {/* Enrolled Company Packs Progress */}
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground font-sans">
                    Company Engineering Packs
                  </h3>
                </div>
                <Link
                  href="/packs"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {enrolledPacks.map((pack) => (
                  <div
                    key={pack.slug}
                    className="p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{pack.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {pack.title}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {pack.completedModules} of {pack.totalModules} modules mastered ({pack.progress}%)
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden max-w-md">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pack.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/packs/${pack.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>{pack.progress === 100 ? 'Review Pack' : 'Continue Module'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): League Status & ATS Resume Widget */}
          <div className="lg:col-span-4 space-y-8">
            {/* League Standing Widget */}
            <div className="rounded-3xl bg-card border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-chart-5" />
                  <h3 className="text-sm font-bold text-foreground font-sans">Interview League</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
                  Promotion Zone
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/60 border border-border text-center space-y-2">
                <div className="text-3xl">🥈</div>
                <h4 className="text-sm font-bold text-foreground">{user.leagueTier}</h4>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Rank #{user.leagueRank} in 30-Peer Bracket
                </p>
                <div className="text-[11px] text-muted-foreground">
                  Top 6 advance to <strong className="text-foreground">Gold AI Engineer</strong> this Sunday at midnight UTC.
                </div>
              </div>

              <Link
                href="/league"
                className="w-full py-2.5 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Cohort Bracket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Resume ATS Quick Score Widget */}
            <div className="rounded-3xl bg-gradient-to-tr from-card via-card to-primary/10 border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground font-sans">ATS Resume Score</h3>
                </div>
                <span className="text-xs font-bold font-mono text-primary">{user.atsScore} / 100</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Your resume is matched for <strong>Generative AI & LLM Roles</strong>. Closing your quantization gap will boost score to 96%.
              </p>

              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${user.atsScore}%` }}
                />
              </div>

              <Link
                href="/resume-analyzer"
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
              >
                <span>Launch ATS Gap Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Verified Proof Badges Widget */}
            <div className="rounded-3xl bg-card border border-border p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground font-sans">Verified Badges</h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Recruiter Visible</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {user.earnedBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 rounded-xl bg-muted border border-border text-[11px] font-medium text-foreground flex items-center gap-1"
                  >
                    <span>🎖️</span>
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              <Link
                href="/league"
                className="text-[11px] font-semibold text-primary hover:underline block pt-1"
              >
                View all achievement badges &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
