import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { MobileLaunchRedirector } from '@/components/navigation/MobileLaunchRedirector';
import { MicroQuizCard } from '@/components/feed/MicroQuizCard';
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
} from 'lucide-react';
import { DAILY_COACH_QUESTIONS } from '@/lib/coach-data';
import { AI_CAREER_ROADMAP } from '@/lib/roadmap-data';
import { MultiScopeLeaderboard } from '@/components/dashboard/MultiScopeLeaderboard';

export default function HomePage() {
  const companyPacks = [
    {
      name: 'Google AI Pack',
      company: 'Google',
      icon: '🔴',
      color: 'from-blue-600/20 to-emerald-600/20',
      borderColor: 'border-blue-500/30',
      badge: 'Gemma & TPU',
      description: 'Attention mechanisms, Gemma fine-tuning, TPU parallelization, and Vertex AI pipelines.',
      modules: 5,
    },
    {
      name: 'NVIDIA AI Pack',
      company: 'NVIDIA',
      icon: '🟢',
      color: 'from-emerald-600/20 to-teal-600/20',
      borderColor: 'border-emerald-500/30',
      badge: 'CUDA & TensorRT',
      description: 'CUDA kernels, model quantization (AWQ/FP8), TensorRT acceleration, and Triton Inference Server.',
      modules: 6,
    },
    {
      name: 'OpenAI Pack',
      company: 'OpenAI',
      icon: '⚪',
      color: 'from-emerald-950/40 to-muted/80',
      borderColor: 'border-emerald-500/30',
      badge: 'Function Calling',
      description: 'Tool use, agentic JSON schema calling, embedding fine-tuning, and structured reasoning.',
      modules: 4,
    },
    {
      name: 'Microsoft AI Pack',
      company: 'Microsoft',
      icon: '🔷',
      color: 'from-cyan-600/20 to-blue-600/20',
      borderColor: 'border-cyan-500/30',
      badge: 'Semantic Kernel',
      description: 'Azure AI Studio, Semantic Kernel agents, multi-agent orchestration, and Copilot patterns.',
      modules: 5,
    },
    {
      name: 'Amazon AI Pack',
      company: 'Amazon AWS',
      icon: '🟠',
      color: 'from-amber-600/20 to-orange-600/20',
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
      badge: '100% Free • ATS Score',
      description: 'Instant 0–100 score, missing skill gap radar, and company bar alignment (Google & NVIDIA).',
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
      href: '/dashboard',
      icon: Boxes,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      cta: 'Launch AI Lab',
    },
  ];

  const todayQuestion = DAILY_COACH_QUESTIONS[0];
  const roadmapPreviewStages = AI_CAREER_ROADMAP.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/25 pb-20 md:pb-0">
      <Navbar />
      <MobileLaunchRedirector />

      <main id="main-content" className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Ambient background glows: lightweight radial gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,_oklch(0.6404_0.2153_35.9003_/_0.12)_0%,_transparent_75%)] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-[radial-gradient(ellipse_at_center,_oklch(0.9656_0.0176_39.4009_/_0.08)_0%,_transparent_70%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Vision & Pitch */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* SIH Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 border border-border text-xs font-semibold text-foreground shadow-sm">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Smart India Hackathon (SIH) 2026 Initiative</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-primary font-bold">100% Free Architecture</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                  Master Applied AI in{' '}
                  <span className="text-primary">
                    5-Minute Daily Sparks
                  </span>{' '}
                  — Not 50-Hour Videos.
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Replace mindless social doomscrolling with bite-sized AI architecture news,
                  pipeline mini-games, weekly competitive leagues, and daily voice interview coaching.
                  Specialize strictly in AI and get hired by verified recruiters.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-primary hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span>Start Learning (Email OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/resume-analyzer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-card hover:bg-muted text-foreground border border-border flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Free AI Resume ATS</span>
                  </Link>
                  <Link
                    href="/recruiter/apply"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-card hover:bg-muted text-foreground border border-border flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Recruiter Portal</span>
                  </Link>
                </div>

                {/* Feature Highlights Ticker */}
                <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-border text-left max-w-lg mx-auto lg:mx-0">
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-foreground font-mono truncate">5–10m</div>
                    <div className="text-[11px] text-muted-foreground truncate">Micro-Habit Daily</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-primary font-mono truncate">5 Tiers</div>
                    <div className="text-[11px] text-muted-foreground truncate">Interview League</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-foreground font-mono truncate">100% Free</div>
                    <div className="text-[11px] text-muted-foreground truncate">Open BaaS Stack</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Feed Card (Playable on Landing Page) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Live Interactive Feed Preview (Try It)</span>
                  </span>
                </div>
                <MicroQuizCard />
                <div className="mt-3 text-center">
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
                  >
                    <span>Explore all 8+ AI Sparks & Full Feed</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PUBLIC LEARNING & AI TOOLS SUITE (100% FREE ACCESS) */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-gradient-to-b from-card/30 via-background to-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Public Features Hub • 100% Free &amp; Open Access</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Everything You Need to Break into Applied AI Systems
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                  Publicly accessible engineering tools designed to bridge academic theory with 2026 production standards.
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground mt-4 md:mt-0">
                ⚡ No credit card required • Instant evaluation
              </span>
            </div>

            {/* 6 Public Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicFeatures.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feat.iconBg} ${feat.iconColor}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                          {feat.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {feat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <Link
                        href={feat.href}
                        className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline group/link"
                      >
                        <span>{feat.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PROBLEM OF THE DAY (POTD) SPOTLIGHT */}
        {/* ========================================================================= */}
        <section id="potd-spotlight" className="py-16 border-t border-border bg-muted/15 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span>Problem of the Day • Daily Streak Driver</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Tackle Today&apos;s High-Yield Architecture Challenge
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every morning at 06:00 IST, AIgnite drops one production interview scenario. Speak your answer into the voice coach or study key canonical trade-offs to keep your league streak burning.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/coach"
                    className="px-5 py-3 rounded-xl text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Solve in Voice Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/feed"
                    className="px-5 py-3 rounded-xl text-xs font-bold bg-card hover:bg-muted text-foreground border border-border flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Browse 5-Second Sparks</span>
                  </Link>
                </div>
              </div>

              {/* Today's Question Card */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping motion-reduce:animate-none" />
                      <span className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">
                        Today&apos;s Active Challenge
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                        {todayQuestion.track}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-semibold">
                        {todayQuestion.difficulty}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground mb-2">
                      {todayQuestion.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      &quot;{todayQuestion.questionText}&quot;
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-2">
                    <div className="text-[11px] font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Canonical Focus Points Expected by Interviewers</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {todayQuestion.canonicalKeyPoints.slice(0, 3).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>Target Time:</span>
                      <span className="text-foreground font-bold">{todayQuestion.estimatedSpeakingTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <Flame className="w-4 h-4" />
                      <span>+25 XP Streak Reward</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE PRODUCTIVE INSTAGRAM ALTERNATIVE */}
        {/* ========================================================================= */}
        <section className="py-16 border-y border-border bg-muted/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                The Productive Instagram Alternative
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Turn Downtime into High-Yield AI Mastery
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Standing in an elevator or waiting in line? Instead of opening reels, open AIgnite.
                Every card delivers one critical breakthrough paired with an instant 5-second check question.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Curated AI Breakthroughs</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No generic software tutorials. Zero noise. Strictly deep-dive breakthroughs in LLMs,
                  FlashAttention, RAG architectures, and model quantization.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">5-Second Embedded Quizzes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Passive reading fails retention. Every card tests your comprehension with single-tap check questions
                  rewarding immediate points toward your league standing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Mobile Default Landing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open the app on your phone and dive straight into the swipeable feed.
                  Configurable in preferences if you prefer the dashboard or voice coach first.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-primary hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Interactive AI Sparks Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                  Company-Specific Skill Packs
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Learn What Top AI Teams Actually Use
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  Instead of selling a single bloated 100-hour course, master modular company packs
                  engineered to match actual technical interview bars.
                </p>
              </div>
              <Link
                href="/packs"
                className="mt-4 md:mt-0 min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-primary hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl border border-transparent hover:border-primary/20"
              >
                <span>View All Packs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyPacks.map((pack) => (
                <div
                  key={pack.name}
                  className={`p-6 rounded-2xl bg-card border border-border hover:border-primary/40 relative group hover:scale-[1.02] transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{pack.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                      {pack.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{pack.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {pack.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                    <span className="text-muted-foreground">{pack.modules} Interactive Modules</span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span>Includes Capstone Mock</span>
                    </span>
                  </div>
                </div>
              ))}

              {/* RAG Master Pipeline Game Teaser */}
              <div className="p-6 rounded-2xl bg-card border border-primary/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Boxes className="w-7 h-7 text-primary" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                      Pipeline Mini-Game
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Bubble Game: RAG Master</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Build low-latency retrieval pipelines against the clock! Drag and connect Chunkers,
                    Embeddings, Vector Stores, and LLM nodes under tight latency and memory constraints.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-primary font-semibold flex items-center gap-1">
                    <span>Unlocks &quot;RAG Master&quot; Badge</span>
                  </span>
                  <Link
                    href="/packs/nvidia-ai-pack"
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-primary hover:underline rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>Play Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE AI INTERVIEW LEAGUE & REPORT CARD */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: The League System */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>The AI Interview League 🏆</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Duolingo for Technical AI Interviews
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Instead of a boring, static leaderboard, compete in weekly ranked divisions.
                  Solve 5 high-yield AI interview questions every week. Top 20% get promoted; bottom tier gets demoted.
                </p>

                {/* Division Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {leagueTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors`}
                    >
                      <span className="text-xl">{tier.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-foreground">{tier.name}</div>
                        <div className="text-[10px] text-muted-foreground">Weekly Top 20% Promotion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: The 5-Metric AI Report Card */}
              <div className="lg:col-span-6">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">AI Interview Report Card</h3>
                      <p className="text-[11px] text-muted-foreground">Automated Speech & Concept Evaluation</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-bold font-mono">
                      Overall: 8.2 / 10
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Knowledge Depth</span>
                        <span className="text-primary font-bold">8.7 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Confidence & Fluency</span>
                        <span className="text-chart-2 font-bold">6.8 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-chart-2 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Communication & Structure</span>
                        <span className="text-chart-4 font-bold">7.3 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-chart-4 rounded-full" style={{ width: '73%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Real-World Production Examples</span>
                        <span className="text-chart-3 font-bold">5.9 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-chart-3 rounded-full" style={{ width: '59%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Industry Readiness Index</span>
                        <span className="text-primary font-bold">6.2 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-primary" />
                      <span>Daily Morning Coach Habit</span>
                    </span>
                    <span className="text-primary font-bold">🔥 7-Day Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PUBLIC AI RESUME ATS ANALYZER */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-gradient-to-b from-card/40 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Public Acquisition Engine • 100% Free</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Public AI Resume ATS Analyzer &amp; Skill Gap Radar
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Is your resume ready for modern AI systems roles? Upload or paste your resume to get an instant 0–100 ATS score, benchmark against NVIDIA and Google engineering bars, identify missing technical gaps (quantization, kernels, agent loops), and get direct links to AIgnite modules that close those gaps.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <Link
                    href="/resume-analyzer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Analyze Your AI Resume Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ⚡ Instant feedback • Gemini 2.0 Flash powered
                  </span>
                </div>
              </div>

              {/* Mini Interactive Preview Card */}
              <div className="md:col-span-5">
                <div className="rounded-3xl bg-card border border-border p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                        94%
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">ATS Systems Compatibility</div>
                        <div className="text-[10px] text-muted-foreground font-mono">Top 6% Percentile</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      High Fit
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-[11px]">GenAI &amp; RAG Systems</span>
                      <span className="text-primary font-bold">92%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-[11px]">CUDA &amp; Triton Acceleration</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">88%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[11px] text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Missing: Cross-Encoder Reranking in RAG</span>
                  </div>
                </div>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-4/10 border border-chart-4/20 text-xs font-bold text-chart-4 mb-2">
                  <Map className="w-3.5 h-3.5" />
                  <span>Public Competency Tree • 6-Stage Curriculum</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  The Applied AI Systems Roadmap
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  Step-by-step career path from Mathematical Foundations to Distributed Training and Triton Kernels. Curated for 2026 AI systems hiring bars.
                </p>
              </div>
              <Link
                href="/roadmap"
                className="mt-4 md:mt-0 min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-primary hover:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl border border-transparent hover:border-primary/20"
              >
                <span>Explore Full Interactive Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmapPreviewStages.map((stage) => (
                <div
                  key={stage.id}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between group hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{stage.estimatedHours}</span>
                      <span className="flex items-center gap-1 text-emerald-500 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{stage.badgeAwarded.name}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {stage.headline}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">{stage.topics.length} In-Depth Topics</span>
                    <span className="text-primary font-bold">Stage {stage.stageNumber}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-card hover:bg-muted text-foreground border border-border transition-colors shadow-sm"
              >
                <Map className="w-4 h-4 text-chart-4" />
                <span>View All 6 Milestone Stages &amp; Recruiter Badges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RECRUITER MODE & ANTI-IMPERSONATION */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-border bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Lock className="w-3.5 h-3.5" />
              <span>Gated Recruiter Mode & Anti-Impersonation</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Direct Recruiter Pipeline Without Resume Fluff
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Recruiter accounts undergo manual verification and corporate domain validation to prevent student impersonation.
              Verified hiring managers search candidates based on proven skills: verified badges, league tiers, and real mock interview metrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/recruiter/apply"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>Apply for Recruiter Access (Company Email)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/recruiter/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-card hover:bg-muted text-foreground border border-border flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>Approved Recruiter Sign In</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MULTI-SCOPE COMPETITIVE LEADERBOARDS OVERVIEW */}
        {/* ========================================================================= */}
        <section id="leaderboards" className="py-20 border-t border-border bg-gradient-to-b from-muted/20 via-background to-card/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-5/10 border border-chart-5/20 text-xs font-bold text-chart-5 mb-2">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Multi-Scope Competitive Leaderboard • Weekly League</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Regional, National &amp; International Rankings
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  Compete with peers from your university, state, across India, and globally. Rank based on daily consistency (flame streak) or verified engineering score (XP).
                </p>
              </div>
              <Link
                href="/league"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>View Full Division Leagues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Live Interactive Multi-Scope Leaderboard */}
            <MultiScopeLeaderboard />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground font-mono">AIgnite</span>
            <span>— Smart India Hackathon (SIH) 2026</span>
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
