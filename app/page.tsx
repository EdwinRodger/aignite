'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
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
  Lock
} from 'lucide-react';

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
      color: 'from-purple-600/20 to-indigo-600/20',
      borderColor: 'border-purple-500/30',
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
    { name: 'Bronze AI Engineer', icon: '🥉', color: 'text-amber-600', border: 'border-amber-700/40' },
    { name: 'Silver AI Engineer', icon: '🥈', color: 'text-slate-300', border: 'border-slate-500/40' },
    { name: 'Gold AI Engineer', icon: '🥇', color: 'text-amber-400', border: 'border-amber-400/40' },
    { name: 'LLM Master', icon: '💎', color: 'text-cyan-400', border: 'border-cyan-400/40' },
    { name: 'AI Architect', icon: '👑', color: 'text-purple-400', border: 'border-purple-400/40' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-indigo-500/30 pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Vision & Pitch */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* SIH Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm shadow-indigo-900/40">
                  <Flame className="w-4 h-4 text-indigo-400" />
                  <span>Smart India Hackathon (SIH) 2026 Initiative</span>
                  <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-emerald-400">100% Free Architecture</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                  Master Applied AI in{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                    5-Minute Daily Sparks
                  </span>{' '}
                  — Not 50-Hour Videos.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Replace mindless social doomscrolling with bite-sized AI architecture news,
                  pipeline mini-games, weekly competitive leagues, and daily voice interview coaching.
                  Specialize strictly in AI and get hired by verified recruiters.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <span>Start Learning (Email OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/recruiter/apply"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Recruiter Portal</span>
                  </Link>
                </div>

                {/* Feature Highlights Ticker */}
                <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left max-w-lg mx-auto lg:mx-0">
                  <div>
                    <div className="text-lg font-black text-white font-mono">5–10m</div>
                    <div className="text-[11px] text-slate-400">Micro-Habit Daily</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-indigo-400 font-mono">5 Tiers</div>
                    <div className="text-[11px] text-slate-400">Interview League</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-emerald-400 font-mono">100% Free</div>
                    <div className="text-[11px] text-slate-400">Open BaaS Stack</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Feed Card (Playable on Landing Page) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Interactive Feed Preview (Try It)</span>
                  </span>
                </div>
                <MicroQuizCard />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE PRODUCTIVE INSTAGRAM ALTERNATIVE */}
        {/* ========================================================================= */}
        <section className="py-16 border-y border-slate-800/80 bg-slate-950/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
                The Productive Instagram Alternative
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Turn Downtime into High-Yield AI Mastery
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Standing in an elevator or waiting in line? Instead of opening reels, open AIgnite.
                Every card delivers one critical breakthrough paired with an instant 5-second check question.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Curated AI Breakthroughs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No generic software tutorials. Zero noise. Strictly deep-dive breakthroughs in LLMs,
                  FlashAttention, RAG architectures, and model quantization.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">5-Second Embedded Quizzes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Passive reading fails retention. Every card tests your comprehension with single-tap check questions
                  rewarding immediate points toward your league standing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Mobile Default Landing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open the app on your phone and dive straight into the swipeable feed.
                  Configurable in preferences if you prefer the dashboard or voice coach first.
                </p>
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
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1 block">
                  Company-Specific Skill Packs
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Learn What Top AI Teams Actually Use
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Instead of selling a single bloated 100-hour course, master modular company packs
                  engineered to match actual technical interview bars.
                </p>
              </div>
              <Link
                href="/packs"
                className="mt-4 md:mt-0 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>View All Packs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyPacks.map((pack) => (
                <div
                  key={pack.name}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${pack.color} border ${pack.borderColor} bg-slate-900/60 backdrop-blur-sm relative group hover:scale-[1.02] transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{pack.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700/60 text-slate-300">
                      {pack.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{pack.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {pack.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400">{pack.modules} Interactive Modules</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span>Includes Capstone Mock</span>
                    </span>
                  </div>
                </div>
              ))}

              {/* RAG Master Pipeline Game Teaser */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-purple-500/40 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Boxes className="w-7 h-7 text-purple-400" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pipeline Mini-Game
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Bubble Game: RAG Master</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Build low-latency retrieval pipelines against the clock! Drag and connect Chunkers,
                    Embeddings, Vector Stores, and LLM nodes under tight latency and memory constraints.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <span>Unlocks &quot;RAG Master&quot; Verified Badge</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE AI INTERVIEW LEAGUE & REPORT CARD */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-slate-800/80 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: The League System */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>The AI Interview League 🏆</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Duolingo for Technical AI Interviews
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Instead of a boring, static leaderboard, compete in weekly ranked divisions.
                  Solve 5 high-yield AI interview questions every week. Top 20% get promoted; bottom tier gets demoted.
                </p>

                {/* Division Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {leagueTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-slate-900 border ${tier.border}`}
                    >
                      <span className="text-xl">{tier.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${tier.color}`}>{tier.name}</div>
                        <div className="text-[10px] text-slate-400">Weekly Top 20% Promotion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: The 5-Metric AI Report Card */}
              <div className="lg:col-span-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white">AI Interview Report Card</h3>
                      <p className="text-[11px] text-slate-400">Automated Speech & Concept Evaluation</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      Overall: 8.2 / 10
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Knowledge Depth</span>
                        <span className="text-indigo-400 font-bold">8.7 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Confidence & Fluency</span>
                        <span className="text-amber-400 font-bold">6.8 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Communication & Structure</span>
                        <span className="text-cyan-400 font-bold">7.3 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: '73%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Real-World Production Examples</span>
                        <span className="text-rose-400 font-bold">5.9 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '59%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Industry Readiness Index</span>
                        <span className="text-emerald-400 font-bold">6.2 / 10</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>Daily Morning Coach Habit</span>
                    </span>
                    <span className="text-emerald-400 font-bold">🔥 7-Day Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RECRUITER MODE & ANTI-IMPERSONATION */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-slate-800/80 bg-gradient-to-b from-[#0B0F17] to-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Gated Recruiter Mode & Anti-Impersonation</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Direct Recruiter Pipeline Without Resume Fluff
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Recruiter accounts undergo manual verification and corporate domain validation to prevent student impersonation.
              Verified hiring managers search candidates based on proven skills: verified badges, league tiers, and real mock interview metrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/recruiter/apply"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Apply for Recruiter Access (Company Email)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/recruiter/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Approved Recruiter Sign In</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">AIgnite</span>
            <span>— Smart India Hackathon (SIH) 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/roadmap" className="hover:text-white transition-colors">AI Roadmap</Link>
            <Link href="/packs" className="hover:text-white transition-colors">Company Packs</Link>
            <Link href="/league" className="hover:text-white transition-colors">League</Link>
            <Link href="/recruiter/apply" className="hover:text-white transition-colors">Recruiters</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Tab Bar for mobile devices & WebView */}
      <MobileTabBar />
    </div>
  );
}
