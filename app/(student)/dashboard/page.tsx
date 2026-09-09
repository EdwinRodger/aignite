'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { UserBuildsSandbox } from '@/components/dashboard/UserBuildsSandbox';
import { MultiScopeLeaderboard } from '@/components/dashboard/MultiScopeLeaderboard';
import {
  Trophy,
  Mic,
  ArrowRight,
  Layers,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Bug,
  Scale,
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

  const reportCard = {
    knowledgeScore: 9.2,
    confidenceScore: 8.8,
    communicationScore: 8.9,
    examplesScore: 9.1,
    industryLevelScore: 9.0,
    overallScore: 9.0,
    speechCadence: '142 WPM (Natural & Confident)',
    fillerCount: 2,
  };

  // Learning Suite active tool tab
  const [activeModuleTool, setActiveModuleTool] = useState<
    'text' | 'bubble' | 'mcq' | 'error' | 'simulator' | 'builds'
  >('builds');

  // Interactive MCQ state
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  // Interactive Error Hunter state
  const [errorFixed, setErrorFixed] = useState(false);

  // Interactive Decision Simulator state
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* ========================================================================= */}
        {/* 1. STUDENT PROFILE & STREAK HEADER */}
        {/* ========================================================================= */}
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
                  {user.college} • @{user.username} • Next division: Gold AI Engineer
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
                  <div className="text-[10px] text-muted-foreground font-mono">Daily oral defense active</div>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{user.totalXp} Total XP</div>
                  <div className="text-[10px] text-muted-foreground font-mono">Rank #4 in cohort</div>
                </div>
              </div>

              <Link
                href="/resume-analyzer"
                className="px-4 py-2.5 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                  {user.atsScore}%
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">ATS Score</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Top 8% Fit</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. VERIFIED AI REPORT CARD & ORAL DEFENSE TELEMETRY */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground font-sans">
                  Verified AI Report Card &amp; Spoken Telemetry
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Recruiter-visible 5-axis competency evaluation aggregated across your daily oral defense sessions.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  Composite Index
                </span>
                <span className="text-2xl font-black font-mono text-primary">
                  {reportCard.overallScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 10</span>
                </span>
              </div>
              <Link
                href="/coach"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 hover:opacity-90 transition-all"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Practice POTD</span>
              </Link>
            </div>
          </div>

          {/* 5-Axis Score Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {[
              { label: 'Knowledge Depth', score: reportCard.knowledgeScore, sub: 'Algorithms & Math' },
              { label: 'Confidence & Pace', score: reportCard.confidenceScore, sub: reportCard.speechCadence },
              { label: 'Communication', score: reportCard.communicationScore, sub: 'STAR Structure' },
              { label: 'Practical Examples', score: reportCard.examplesScore, sub: 'VRAM & Latency Metrics' },
              { label: 'Industry Readiness', score: reportCard.industryLevelScore, sub: 'Senior Staff Bar' },
            ].map((axis) => (
              <div key={axis.label} className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
                  {axis.label}
                </span>
                <div className="text-xl font-black font-mono text-foreground">{axis.score.toFixed(1)}</div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(axis.score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground block truncate">
                  {axis.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Spoken Telemetry Tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground">
                Cadence: {reportCard.speechCadence}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground">
                Speech Fillers: {reportCard.fillerCount} detected (Elite Bar)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Liveness Anti-Impersonation Checked
              </span>
            </div>

            <span className="text-[11px] text-primary font-bold">
              Visible to approved Google &amp; NVIDIA recruiters
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE AI MODULE LEARNING SUITE (THE BLUEPRINT WORKBENCH) */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground font-sans">
                  The AI Learning Suite (Module System)
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Action-Over-Consumption interactive modalities: theory, sequencing mini-games, debugging, tradeoff simulations, and custom builds.
              </p>
            </div>
          </div>

          {/* Modality Selector Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-muted border border-border text-xs font-semibold">
            {[
              { id: 'builds', label: '🛠️ User Builds System', desc: 'AI System Sandbox' },
              { id: 'bubble', label: '🫧 Bubble Game', desc: 'Pipeline Sequencer' },
              { id: 'error', label: '🐞 Error Code', desc: 'Error Hunter' },
              { id: 'simulator', label: '⚖️ Decision Simulator', desc: 'Tradeoff Evaluator' },
              { id: 'mcq', label: '❓ Micro-Quiz (MCQs)', desc: '5s Knowledge Check' },
              { id: 'text', label: '📖 Text Content', desc: 'Curated Theory' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveModuleTool(
                    tab.id as 'text' | 'bubble' | 'mcq' | 'error' | 'simulator' | 'builds'
                  )
                }
                className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeModuleTool === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: USER BUILDS SYSTEM (SANDBOX) */}
          {activeModuleTool === 'builds' && <UserBuildsSandbox />}

          {/* Tab 2: PIPELINE BUBBLE GAME PREVIEW */}
          {activeModuleTool === 'bubble' && (
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🫧</span>
                    <h3 className="text-lg font-bold text-foreground">Pipeline Bubble Game — RAG Master Mission</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drag, drop, and connect the nodes in the exact sequential order to build an enterprise RAG pipeline under sub-50ms SLA.
                  </p>
                </div>
                <Link
                  href="/packs/openai-pack"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all shrink-0"
                >
                  <span>Launch Full Screen Game</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sample Bubble Pipeline Visual Representation */}
              <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
                {['Document Parser', 'Recursive Splitter', 'text-embedding-3', 'pgvector (HNSW)', 'Hybrid Retriever', 'Cohere Rerank', 'Prompt Template', 'LLM Generator'].map(
                  (node, i, arr) => (
                    <React.Fragment key={node}>
                      <div className="px-3 py-2 rounded-xl bg-card border border-primary/40 text-primary font-bold shadow-xs">
                        {node}
                      </div>
                      {i < arr.length - 1 && <span className="text-muted-foreground font-black">&rarr;</span>}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          )}

          {/* Tab 3: ERROR CODE / ERROR HUNTER */}
          {activeModuleTool === 'error' && (
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bug className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-bold text-foreground">Error Code Hunter — PyTorch Gradient Spike</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inspect the code snippet below. Identify the silent performance bug causing gradients to accumulate indefinitely across training epochs.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-mono font-bold">
                  Bug Detection: Active
                </span>
              </div>

              {/* Broken Code Editor */}
              <div className="rounded-2xl bg-black/90 border border-border p-4 font-mono text-xs text-foreground space-y-1">
                <div className="text-muted-foreground"># PyTorch Training Loop Snippet</div>
                <div className="text-purple-400">for epoch in range(num_epochs):</div>
                <div className="pl-4 text-purple-400">for batch in dataloader:</div>
                <div className="pl-8 text-foreground/80">outputs = model(batch[&apos;inputs&apos;])</div>
                <div className="pl-8 text-foreground/80">loss = criterion(outputs, batch[&apos;targets&apos;])</div>
                <div className="pl-8 text-destructive font-bold bg-destructive/15 px-2 py-0.5 rounded">
                  loss.backward()  # &lt;-- BUG: Missing optimizer.zero_grad() before backward pass!
                </div>
                <div className="pl-8 text-foreground/80">optimizer.step()</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Without <code className="text-primary font-mono">optimizer.zero_grad()</code>, gradients from previous batches accumulate in tensor buffers.
                </p>
                <button
                  type="button"
                  onClick={() => setErrorFixed(!errorFixed)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  {errorFixed ? '✓ Production Fix Applied (+20 XP)' : 'Apply Production Fix'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: AI DECISION SIMULATOR */}
          {activeModuleTool === 'simulator' && (
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-chart-4" />
                  <h3 className="text-lg font-bold text-foreground">AI Decision Simulator — Hardware SLA Dilemma</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  You have a strict sub-40ms P95 latency SLA on an NVIDIA T4 GPU (16GB VRAM) for autonomous drone image reasoning. Which model family do you deploy?
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'A', text: 'Vision Transformer (ViT-Huge/14) with 632M parameters', verdict: 'Fails SLA: ~160ms latency on T4.' },
                  { id: 'B', text: 'YOLOv11 / RT-DETR with TensorRT INT8 Quantization', verdict: '✓ Optimal: 18ms latency, 3.4GB VRAM footprint.' },
                  { id: 'C', text: 'Unquantized CLIP-ViT-L/14 with Float32 tensors', verdict: 'Fails VRAM limit: CUDA OOM under batch concurrency.' },
                  { id: 'D', text: 'Stable Diffusion Latent Encoder Backbone', verdict: 'Fails Latency: Diffusion latents introduce &gt; 400ms overhead.' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedDecision(opt.id)}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all space-y-1.5 cursor-pointer ${
                      selectedDecision === opt.id
                        ? opt.id === 'B'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                          : 'bg-destructive/10 border-destructive/30 text-foreground'
                        : 'bg-muted/40 border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-card border flex items-center justify-center font-mono">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {selectedDecision === opt.id && (
                      <p className={`text-[11px] font-mono ${opt.id === 'B' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-destructive'}`}>
                        {opt.verdict}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: MCQs & MICRO-QUIZZES */}
          {activeModuleTool === 'mcq' && (
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">5-Second Micro-Quiz</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Why does DeepSeek-R1&apos;s Group Relative Policy Optimization (GRPO) use significantly less GPU memory than standard PPO?
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  'It eliminates the Critic / Value network, avoiding an extra model copy in VRAM',
                  'It forces 2-bit quantization on all attention weights',
                  'It shrinks the context window from 32k down to 512 tokens',
                  'It offloads weights to CPU RAM using PCIe Gen3',
                ].map((option, idx) => {
                  const isCorrect = idx === 0;
                  const isSelected = selectedMcqOption === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedMcqOption(idx);
                        setMcqSubmitted(true);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        mcqSubmitted
                          ? isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                            : isSelected
                            ? 'bg-destructive/10 border-destructive/30 text-destructive'
                            : 'bg-muted/40 border-border text-muted-foreground'
                          : 'bg-muted/40 border-border hover:border-primary/40 text-foreground'
                      }`}
                    >
                      <span>{option}</span>
                      {mcqSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>

              {mcqSubmitted && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                  <strong>Key Takeaway:</strong> GRPO computes baseline advantages by sampling a group of responses to the same prompt, removing the parameter-heavy critic model completely.
                </div>
              )}
            </div>
          )}

          {/* Tab 6: TEXT CONTENT (CURATED THEORY) */}
          {activeModuleTool === 'text' && (
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Interactive Bite-Sized Reading</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  High-signal engineering breakdowns designed for rapid commute comprehension.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'FlashAttention-3 TMA Acceleration',
                    tag: 'CUDA Kernels',
                    readTime: '3 min read',
                    desc: 'Warp specialization separates producer warps doing asynchronous TMA memory transfers from consumer tensor core compute warps.',
                  },
                  {
                    title: 'vLLM PagedAttention Virtual Memory',
                    tag: 'Inference',
                    readTime: '4 min read',
                    desc: 'Solves internal memory fragmentation by partitioning the KV cache into fixed-size physical blocks instead of contiguous memory.',
                  },
                  {
                    title: 'pgvector HNSW Graph Mechanics',
                    tag: 'Vector DB',
                    readTime: '3 min read',
                    desc: 'Hierarchical Navigable Small World graphs enable sub-10ms logarithmic time vector retrieval across millions of dense vectors.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {item.tag}
                      </span>
                      <h4 className="text-xs font-bold text-foreground font-sans">{item.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block pt-2 border-t border-border/60">
                      {item.readTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. MULTI-SCOPE COMPETITIVE LEADERBOARD (REGIONAL, NATIONAL, GLOBAL) */}
        {/* ========================================================================= */}
        <section>
          <MultiScopeLeaderboard />
        </section>
      </main>

      <MobileTabBar />
    </div>
  );
}
