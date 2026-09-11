import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import {
  Sparkles,
  Flame,
  Trophy,
  ArrowRight,
  Mic,
  ShieldCheck,
  Brain,
  Boxes,
  Lock,
  AlertTriangle,
  FileText,
  Map,
  Layers,
  CheckCircle2,
  Award,
  Zap,
  Code2,
} from 'lucide-react';
import { DAILY_COACH_QUESTIONS } from '@/lib/coach-data';
import { AI_CAREER_ROADMAP } from '@/lib/roadmap-data';
import { MultiScopeLeaderboard } from '@/components/dashboard/MultiScopeLeaderboard';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default async function HomePage() {

  const companyPacks = [
    {
      name: 'Google AI Pack',
      company: 'Google',
      icon: '🔴',
      borderColor: 'border-blue-500/30',
      badge: 'Gemma & TPU',
      description: 'Attention mechanisms, Gemma fine-tuning, TPU parallelization, and Vertex AI pipelines.',
      modules: 5,
    },
    {
      name: 'NVIDIA AI Pack',
      company: 'NVIDIA',
      icon: '🟢',
      borderColor: 'border-emerald-500/30',
      badge: 'CUDA & TensorRT',
      description: 'CUDA kernels, model quantization (AWQ/FP8), TensorRT acceleration, and Triton Inference Server.',
      modules: 6,
    },
    {
      name: 'OpenAI Pack',
      company: 'OpenAI',
      icon: '⚪',
      borderColor: 'border-emerald-500/30',
      badge: 'Function Calling',
      description: 'Tool use, agentic JSON schema calling, embedding fine-tuning, and structured reasoning.',
      modules: 4,
    },
    {
      name: 'Microsoft AI Pack',
      company: 'Microsoft',
      icon: '🔷',
      borderColor: 'border-cyan-500/30',
      badge: 'Semantic Kernel',
      description: 'Azure AI Studio, Semantic Kernel agents, multi-agent orchestration, and Copilot patterns.',
      modules: 5,
    },
    {
      name: 'Amazon AI Pack',
      company: 'Amazon AWS',
      icon: '🟠',
      borderColor: 'border-amber-500/30',
      badge: 'Bedrock & SageMaker',
      description: 'AWS Bedrock foundation models, SageMaker distributed training, and serverless LLM deployment.',
      modules: 5,
    },
  ];

  const leagueTiers = [
    { name: 'Bronze AI Engineer', icon: '🥉', color: 'text-amber-700 dark:text-amber-500', border: 'border-amber-700/40' },
    { name: 'Silver AI Engineer', icon: '🥈', color: 'text-slate-700 dark:text-slate-200', border: 'border-slate-500/40' },
    { name: 'Gold AI Engineer', icon: '🥇', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-400/40' },
    { name: 'LLM Master', icon: '💎', color: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-400/40' },
    { name: 'AI Architect', icon: '👑', color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-400/40' },
  ];

  const publicFeatures = [
    {
      title: 'Resume Analyser',
      badge: '100% Free - ATS Score',
      description: 'Instant 0-100 score, missing skill gap radar, and company bar alignment (Google & NVIDIA).',
      href: '/resume-analyzer',
      icon: FileText,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      cta: 'Analyze Resume',
    },
    {
      title: 'AI Mock Interview',
      badge: 'Daily Voice Coach',
      description: 'Oral technical defense simulation with live speech cadence, confidence, and system depth metrics.',
      href: '/coach',
      icon: Mic,
      iconColor: 'text-chart-1',
      iconBg: 'bg-chart-1/10 border-chart-1/20',
      cta: 'Start Oral Defense',
    },
    {
      title: 'Course Material',
      badge: 'Company Packs',
      description: 'Modular curriculum for NVIDIA CUDA/TensorRT, Google Gemma, OpenAI tool calling, and AWS Bedrock.',
      href: '/packs',
      icon: Layers,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10 border-primary/20',
      cta: 'Explore Packs',
    },
    {
      title: 'AI Career Roadmap',
      badge: 'Competency Tree',
      description: '6-stage progression from Math & PyTorch internals to Production RAG and GPU Kernel Engineering.',
      href: '/roadmap',
      icon: Map,
      iconColor: 'text-chart-4',
      iconBg: 'bg-chart-4/10 border-chart-4/20',
      cta: 'View Roadmap',
    },
    {
      title: 'Problem of the Day',
      badge: 'Daily Streak Driver',
      description: 'Daily high-yield applied AI question. Practice oral or conceptual defense to keep your flame streak alive.',
      href: '#potd-spotlight',
      icon: Flame,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-500/10 border-orange-500/20',
      cta: 'View Today’s POTD',
    },
    {
      title: 'Coding Challenges & Lab',
      badge: 'Interactive Sandbox',
      description: 'Drag-and-drop RAG pipeline sequencer, PyTorch error hunter, and inference architecture tuner.',
      href: '/challenges',
      icon: Boxes,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      cta: 'Launch RAG Challenge',
    },
  ];

  const todayQuestion = DAILY_COACH_QUESTIONS[0] || {
    id: 'q-default',
    title: 'FlashAttention-3: Asynchronous TMA Kernel Execution',
    track: 'Systems Architecture',
    difficulty: 'Senior Bar',
    questionText: 'Explain how FlashAttention-3 leverages Hopper Tensor Memory Accelerator (TMA) to decouple asynchronous memory transfers from tensor core math, and why this eliminates register file pressure.',
    canonicalKeyPoints: [
      'Warp specialization divides warps into producer and consumer roles',
      'Asynchronous DMA directly transfers global memory to shared memory',
      'Ping-pong buffering in SRAM eliminates register file bottlenecks',
    ],
    estimatedSpeakingTime: '90 - 120s',
  };

  const roadmapPreviewStages = AI_CAREER_ROADMAP.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/25 pb-20 md:pb-0">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Vision & Pitch */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* SIH Pill Badge */}
                <Badge variant="outline" className="gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-xs">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Smart India Hackathon (SIH) 2026 Initiative</span>
                </Badge>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                  Master Applied AI in{' '}
                  <span className="text-primary">
                    5-Minute Daily Sparks
                  </span>{' '}
                  - Not 50-Hour Videos.
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Replace mindless social doomscrolling with bite-sized AI architecture news,
                  pipeline mini-games, weekly competitive leagues, and daily voice interview coaching.
                  Specialize strictly in AI and get hired by verified recruiters.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Button asChild size="lg" className="w-full sm:w-auto px-6 py-6 rounded-xl font-bold text-sm gap-2 shadow-xs">
                    <Link href="/login">
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 rounded-xl font-bold text-sm gap-2">
                    <Link href="/resume-analyzer">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Free AI Resume ATS</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 rounded-xl font-bold text-sm gap-2">
                    <Link href="/recruiter/apply">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Recruiter Portal</span>
                    </Link>
                  </Button>
                </div>

                {/* Feature Highlights Ticker */}
                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-border text-left max-w-sm mx-auto lg:mx-0">
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-foreground font-mono truncate">5-10m</div>
                    <div className="text-sm text-muted-foreground truncate">Micro-Habit Daily</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-primary font-mono truncate">5 Tiers</div>
                    <div className="text-sm text-muted-foreground truncate">Interview League</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Platform Overview & Daily Habit Pillars */}
              <div className="lg:col-span-5">
                <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">The AIgnite Daily Habit</div>
                        <div className="text-sm text-muted-foreground">5-Minute Production Engineering</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-2.5 py-0.5 text-sm font-bold font-mono bg-primary/10 text-primary border-primary/20">
                      Habit Loop
                    </Badge>
                  </div>

                  {/* 3 Core Habits */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold text-foreground">Daily AI Sparks</span>
                          <span className="text-sm font-mono text-primary font-bold">5 Min</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                          Architectural breakdowns of FlashAttention-3, DeepSeek-R1, and vLLM with instant check quizzes.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-chart-1/15 border border-chart-1/25 flex items-center justify-center text-chart-1 shrink-0 mt-0.5">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold text-foreground">Voice Mock Interview</span>
                          <span className="text-sm font-mono text-chart-1 font-bold">Daily POTD</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                          Defend real engineering trade-offs out loud with instant AI cadence, fluency, and depth scoring.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold text-foreground">AI Resume ATS Radar</span>
                          <span className="text-sm font-mono text-emerald-600 font-bold">Instant</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                          Instant 0-100 score, missing skill gap identification, and alignment with Google &amp; NVIDIA hiring bars.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full font-bold text-sm shadow-xs gap-2">
                      <Link href="/login">
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PUBLIC LEARNING & AI TOOLS SUITE (100% FREE ACCESS) */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-muted/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary border-primary/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Public Features Hub - 100% Free &amp; Open Access</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Everything You Need to Break into Applied AI Systems
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Publicly accessible engineering tools designed to bridge academic theory with 2026 production standards.
                </p>
              </div>
              <span className="text-sm font-mono text-muted-foreground mt-4 md:mt-0">
                ⚡ No credit card required - Instant evaluation
              </span>
            </div>

            {/* 6 Public Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicFeatures.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <Card
                    key={feat.title}
                    className="p-6 rounded-xl border-border hover:border-border/80 transition-all flex flex-col justify-between group hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feat.iconBg} ${feat.iconColor}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="text-sm font-mono font-bold px-2 py-0.5">
                          {feat.badge}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {feat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
                      <Button asChild variant="link" className="p-0 h-auto font-bold text-sm text-primary gap-1.5 group/link">
                        <Link href={feat.href}>
                          <span>{feat.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PROBLEM OF THE DAY (POTD) SPOTLIGHT */}
        {/* ========================================================================= */}
        <section id="potd-spotlight" className="py-16 border-t border-border bg-muted/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full text-sm font-bold bg-amber-500/10 border-amber-500/20 text-amber-700">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Problem of the Day - Daily Streak Driver</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Tackle Today&apos;s High-Yield Architecture Challenge
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every morning at 06:00 IST, AIgnite drops one production interview scenario. Solve the code challenge or practice your oral defense into the voice coach to keep your streak burning.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Button asChild className="gap-2 text-sm font-bold rounded-lg shadow-xs">
                    <Link href="/potd">
                      <Code2 className="w-4 h-4" />
                      <span>Solve Problem of the Day</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 text-sm font-bold rounded-lg">
                    <Link href="/coach">
                      <Mic className="w-4 h-4 text-primary" />
                      <span>AI Voice Coach</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Today's Question Card */}
              <div className="lg:col-span-7">
                <Card className="rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping motion-reduce:animate-none" />
                      <span className="text-sm font-bold font-mono text-foreground uppercase tracking-wider">
                        Today&apos;s Active Challenge
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20 font-semibold text-sm">
                        {todayQuestion.track}
                      </Badge>
                      <Badge variant="secondary" className="px-2 py-0.5 rounded-full font-semibold text-sm">
                        {todayQuestion.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground mb-2">
                      {todayQuestion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &quot;{todayQuestion.questionText}&quot;
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-2">
                    <div className="text-sm font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Canonical Focus Points Expected by Interviewers</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {todayQuestion.canonicalKeyPoints.slice(0, 3).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-sm font-mono">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>Target Time:</span>
                      <span className="text-foreground font-bold">{todayQuestion.estimatedSpeakingTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <Flame className="w-4 h-4" />
                      <span>+25 XP Streak Reward</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DAILY AI SPARKS - 5-MINUTE MICRO-HABIT */}
        {/* ========================================================================= */}
        <section id="ai-sparks" className="py-20 border-y border-border bg-muted/20 relative scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full text-sm font-bold bg-primary/10 border-primary/20 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daily AI Sparks - 5-Minute Micro-Habit</span>
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                Turn Downtime into High-Yield AI Systems Mastery
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Replace mindless social media doomscrolling with bite-sized, verified AI engineering breakthroughs.
                Every spark delivers one bleeding-edge paper or architectural breakdown paired with a 5-second check question to reinforce active retention.
              </p>
              <div className="pt-1">
                <Badge variant="secondary" className="text-sm font-medium px-3 py-1 text-muted-foreground">
                  Interactive Sparks Feed is an Account Feature - Free for all registered students
                </Badge>
              </div>
            </div>

            {/* 4 Feature Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 rounded-2xl border-border hover:border-primary/40 transition-colors bg-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">Curated Breakthroughs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Zero generic fluff tutorials. In-depth technical breakdowns covering FlashAttention-3, DeepSeek-R1 GRPO, vLLM PagedAttention, and AWQ/FP8 quantization.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-sm font-mono text-primary font-bold">
                  Production Level
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border-border hover:border-primary/40 transition-colors bg-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">5-Second Check Quizzes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Passive reading does not stick. Every spark challenges you with single-tap check questions that award instant points toward your weekly league standing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-sm font-mono text-primary font-bold">
                  Active Recall
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border-border hover:border-primary/40 transition-colors bg-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">Gemini AI Synthesizer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Read a new arXiv paper or NVIDIA tech report? Paste any topic or URL into the sidebar synthesizer to generate custom bite-sized sparks instantly.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-sm font-mono text-primary font-bold">
                  Gemini 2.5 Powered
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border-border hover:border-primary/40 transition-colors bg-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">Daily Streak System</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Build a consistent learning habit in just 5 minutes a day. Track your flame streaks, save bookmarks, and climb the competitive division leagues.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-sm font-mono text-primary font-bold">
                  Streak Motivation
                </div>
              </Card>
            </div>

            {/* CTA Banner */}
            <div className="mt-12 p-8 rounded-3xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-lg font-bold text-foreground">
                  Ready to replace social doomscrolling with AI mastery?
                </div>
                <p className="text-sm text-muted-foreground">
                  Sign in or create a free account to unlock the full interactive AI Sparks Feed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto px-6 font-bold text-sm shadow-xs gap-2">
                  <Link href="/login">
                    <span>Sign In to Access Sparks</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold text-sm">
                  <Link href="/login">
                    <span>Create Free Account</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPANY COURSE PACKS (INSTEAD OF BLOATED COURSES) */}
        {/* ========================================================================= */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-primary mb-1 block">
                  Company-Specific Skill Packs
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Learn What Top AI Teams Actually Use
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Instead of selling a single bloated 100-hour course, master modular company packs
                  engineered to match actual technical interview bars.
                </p>
              </div>
              <Button asChild variant="ghost" className="mt-4 md:mt-0 min-h-[44px] gap-1.5 px-3.5 py-2 text-sm font-bold text-primary rounded-xl">
                <Link href="/packs">
                  <span>View All Packs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyPacks.map((pack) => (
                <Card
                  key={pack.name}
                  className="p-6 rounded-2xl border-border hover:border-primary/40 relative group hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{pack.icon}</span>
                    <Badge variant="outline" className="text-sm font-bold px-2 py-0.5">
                      {pack.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {pack.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border text-sm">
                    <span className="text-muted-foreground">{pack.modules} Interactive Modules</span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span>Includes Capstone Mock</span>
                    </span>
                  </div>
                </Card>
              ))}

              {/* RAG Master Pipeline Game Teaser */}
              <Card className="p-6 rounded-2xl border-primary/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Boxes className="w-7 h-7 text-primary" />
                    <Badge variant="default" className="text-sm font-bold px-2 py-0.5">
                      Pipeline Mini-Game
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Bubble Game: RAG Master</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Build low-latency retrieval pipelines against the clock! Drag and connect Chunkers,
                    Embeddings, Vector Stores, and LLM nodes under tight latency and memory constraints.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-primary font-semibold flex items-center gap-1">
                    <span>Unlocks &quot;RAG Master&quot; Badge</span>
                  </span>
                  <Button asChild variant="link" className="p-0 h-auto font-bold text-sm text-primary gap-1.5">
                    <Link href="/packs/nvidia-ai-pack">
                      <span>Play Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE AI INTERVIEW LEAGUE & REPORT CARD */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Column: The League System */}
              <div className="lg:col-span-6 space-y-5">
                <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-sm font-bold text-primary">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>The AI Interview League 🏆</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Duolingo for Technical AI Interviews
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Instead of a boring, static leaderboard, compete in weekly ranked divisions.
                  Solve 5 high-yield AI interview questions every week. Top 20% get promoted; bottom tier gets demoted.
                </p>

                {/* Division Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {leagueTiers.map((tier, idx) => (
                    <Card
                      key={tier.name}
                      className={`flex items-center gap-3 p-3 hover:border-primary/30 transition-colors shadow-none ${
                        idx === 4 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span className="text-xl">{tier.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-foreground">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">Weekly Top 20% Promotion</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column: The 5-Metric AI Report Card */}
              <div className="lg:col-span-6">
                <Card className="p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">AI Interview Report Card</h3>
                      <p className="text-sm text-muted-foreground">Automated Speech & Concept Evaluation</p>
                    </div>
                    <Badge variant="outline" className="px-2.5 py-1 bg-primary/15 text-primary border-primary/30 text-sm font-bold font-mono">
                      Overall: 8.2 / 10
                    </Badge>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Knowledge Depth</span>
                        <span className="text-primary font-bold">8.7 / 10</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Confidence & Fluency</span>
                        <span className="text-chart-2 font-bold">6.8 / 10</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Communication & Structure</span>
                        <span className="text-chart-4 font-bold">7.3 / 10</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Real-World Production Examples</span>
                        <span className="text-chart-3 font-bold">5.9 / 10</span>
                      </div>
                      <Progress value={59} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Industry Readiness Index</span>
                        <span className="text-primary font-bold">6.2 / 10</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-primary" />
                      <span>Daily Morning Coach Habit</span>
                    </span>
                    <span className="text-primary font-bold">🔥 7-Day Streak</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PUBLIC AI RESUME ATS ANALYZER */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4 text-center md:text-left">
                <Badge variant="outline" className="gap-2 px-3 py-1 bg-emerald-500/10 border-emerald-500/20 text-sm font-bold text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Public Acquisition Engine - 100% Free</span>
                </Badge>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Public AI Resume ATS Analyzer &amp; Skill Gap Radar
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Is your resume ready for modern AI systems roles? Upload or paste your resume to get an instant 0-100 ATS score, benchmark against NVIDIA and Google engineering bars, identify missing technical gaps (quantization, kernels, agent loops), and get direct links to AIgnite modules that close those gaps.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <Button asChild size="lg" className="w-full sm:w-auto font-bold text-sm shadow-xs gap-2">
                    <Link href="/resume-analyzer">
                      <span>Analyze Your AI Resume Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <span className="text-sm font-mono text-muted-foreground">
                    ⚡ Instant feedback - Gemini 2.5 Flash powered
                  </span>
                </div>
              </div>

              {/* Mini Interactive Preview Card */}
              <div className="md:col-span-5">
                <Card className="p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                        94%
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">ATS Systems Compatibility</div>
                        <div className="text-sm text-muted-foreground font-mono">Top 6% Percentile</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-2.5 py-0.5 bg-primary/10 text-primary font-bold text-sm">
                      High Fit
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-sm">GenAI &amp; RAG Systems</span>
                      <span className="text-primary font-bold">92%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-sm">CUDA &amp; Triton Acceleration</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">88%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Missing: Cross-Encoder Reranking in RAG</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE APPLIED AI SYSTEMS ROADMAP */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="outline" className="gap-2 px-3 py-1 bg-chart-4/10 border-chart-4/20 text-sm font-bold text-chart-4 mb-2">
                  <Map className="w-3.5 h-3.5" />
                  <span>Public Competency Tree - 6-Stage Curriculum</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  The Applied AI Systems Roadmap
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Step-by-step career path from Mathematical Foundations to Distributed Training and Triton Kernels. Curated for 2026 AI systems hiring bars.
                </p>
              </div>
              <Button asChild variant="link" className="mt-4 md:mt-0 font-bold text-sm text-primary gap-1.5 p-0 h-auto">
                <Link href="/roadmap">
                  <span>Explore Full Interactive Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmapPreviewStages.map((stage) => (
                <Card
                  key={stage.id}
                  className="p-5 hover:border-primary/40 transition-all flex flex-col justify-between group hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-mono text-muted-foreground">
                      <span>{stage.estimatedHours}</span>
                      <span className="flex items-center gap-1 text-emerald-500 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{stage.badgeAwarded.name}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {stage.headline}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-sm font-mono">
                    <span className="text-muted-foreground">{stage.topics.length} In-Depth Topics</span>
                    <span className="text-primary font-bold">Stage {stage.stageNumber}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg" className="font-bold text-sm gap-2">
                <Link href="/roadmap">
                  <Map className="w-4 h-4 text-chart-4" />
                  <span>View All 6 Milestone Stages &amp; Recruiter Badges</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RECRUITER MODE & ANTI-IMPERSONATION */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Sourcing & Security Pitch */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-sm font-bold text-primary">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Gated Recruiter Mode - Anti-Impersonation Verified</span>
                </Badge>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Direct Recruiter Pipeline Without Resume Fluff
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Recruiter accounts undergo strict corporate domain validation and manual review to eliminate student impersonation.
                  Verified hiring managers search candidates based on demonstrated engineering capability: verified module badges, weekly league rankings, and oral mock interview telemetry.
                </p>

                {/* 3 Verification Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
                  <div className="p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">Corporate Gated</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Work email validation prevents fraudulent recruiter profiles.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-foreground">Proof-of-Skill</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ranked by verified code runs, not inflated resume keywords.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-chart-5" />
                      <span className="text-sm font-bold text-foreground">League Rank</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Shortlist candidates by regional, state, or national divisions.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Button asChild size="lg" className="w-full sm:w-auto font-bold text-sm shadow-xs gap-2">
                    <Link href="/recruiter/apply">
                      <span>Apply for Recruiter Access (Company Email)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold text-sm gap-2">
                    <Link href="/recruiter/login">
                      <span>Approved Recruiter Sign In</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Recruiter Talent Card Preview */}
              <div className="lg:col-span-5">
                <Card className="p-6 shadow-xl space-y-4 bg-card">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Verified Candidate Card</div>
                        <div className="text-sm text-muted-foreground">Recruiter Search View</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-2.5 py-0.5 text-sm font-bold font-mono bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                      Verified
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">AI Systems Engineer Candidate</span>
                      <span className="text-sm font-mono text-muted-foreground">Rank #14 State</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-sm font-semibold">
                        NVIDIA CUDA Specialist
                      </Badge>
                      <Badge variant="outline" className="text-sm font-semibold border-primary/30 text-primary">
                        Gold League Tier
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground">Voice Defense Depth</span>
                      <span className="text-primary font-bold">8.7 / 10</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground">Google &amp; NVIDIA ATS Match</span>
                      <span className="text-emerald-600 font-bold">94%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground">Consistency Habit</span>
                      <span className="text-orange-500 font-bold">🔥 14-Day Streak</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-sm text-muted-foreground font-mono">
                      Corporate domain required - Student access restricted
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MULTI-SCOPE COMPETITIVE LEADERBOARDS OVERVIEW */}
        {/* ========================================================================= */}
        <section id="leaderboards" className="py-20 border-t border-border bg-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Badge variant="outline" className="gap-2 px-3 py-1 bg-muted border-border text-sm font-bold text-foreground mb-2">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  <span>Multi-Scope Competitive Leaderboard - Weekly League</span>
                </Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Regional, National &amp; International Rankings
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  Compete with peers from your university, state, across India, and globally. Rank based on daily consistency (flame streak) or verified engineering score (XP).
                </p>
              </div>
              <Button asChild size="lg" className="font-bold text-sm shadow-xs gap-2 shrink-0 w-full sm:w-auto justify-center">
                <Link href="/league">
                  <span>View Full Division Leagues</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            {/* Live Interactive Multi-Scope Leaderboard */}
            <MultiScopeLeaderboard />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-icon.png"
              alt="AIgnite Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain shrink-0"
            />
            <span className="font-bold text-foreground font-mono">AIgnite</span>
            <span>- Smart India Hackathon (SIH) 2026</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground">
            <Link href="/roadmap" className="min-h-[44px] inline-flex items-center px-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">AI Roadmap</Link>
            <Link href="/packs" className="min-h-[44px] inline-flex items-center px-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">Company Packs</Link>
            <Link href="/league" className="min-h-[44px] inline-flex items-center px-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">League</Link>
            <Link href="/recruiter/apply" className="min-h-[44px] inline-flex items-center px-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">Recruiters</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Tab Bar for mobile devices & WebView */}
      <MobileTabBar />
    </div>
  );
}
