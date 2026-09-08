'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Brain, Zap, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export function MicroQuizCard() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(false);

  const options: QuizOption[] = [
    { text: 'A) Uses 4-bit Quantized Weights to compress KV-cache', isCorrect: false },
    { text: 'B) Eliminates the Critic/Value Model entirely via relative group scoring', isCorrect: true },
    { text: 'C) Truncates prompt context length to sub-2048 tokens', isCorrect: false },
  ];

  const handleSelect = (index: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);

    if (options[index].isCorrect) {
      setPointsEarned(true);
      try {
        confetti({
          particleCount: 65,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#6366F1', '#10B981', '#F59E0B'],
        });
      } catch {
        // Fallback for environments where canvas is restricted
      }
    }
  };

  const resetQuiz = () => {
    setSelectedIdx(null);
    setPointsEarned(false);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-gradient-to-b from-slate-900 to-[#0F172A] border border-indigo-500/30 p-5 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header & Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-3.5 h-3.5" />
            <span>LLM Post-Training</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">Today&apos;s Spark</span>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
          pointsEarned 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 scale-105' 
            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        }`}>
          <Zap className="w-3 h-3" />
          <span>{pointsEarned ? 'Claimed +5 pts!' : '+5 pts'}</span>
        </div>
      </div>

      {/* Breakthrough Title & Visual Breakdown */}
      <h3 className="text-base font-bold text-white tracking-tight mb-2">
        DeepSeek-R1: Pure RL Reasoning Emergence via GRPO
      </h3>
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        DeepSeek-R1 proves mathematical and code reasoning can spontaneously emerge without human warm-up data.
        By ditching standard PPO for Group Relative Policy Optimization (GRPO), it removes the memory-heavy value network.
      </p>

      {/* Mini Architecture Diagram Representation */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 font-mono text-[11px]">
        <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Architecture Trade-Off</span>
          <span className="text-indigo-400 font-bold">VRAM Savings: ~60%</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold py-1 px-2 rounded bg-slate-900 border border-slate-800">
          <span className="text-rose-400 line-through">PPO: Policy + Value Model</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-emerald-400">GRPO: Policy + Group Norm</span>
        </div>
      </div>

      {/* The 5-Second Interactive Micro-Quiz */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5-Second Check: Why does GRPO save ~60% VRAM?</span>
          </span>
          {selectedIdx !== null && (
            <button
              onClick={resetQuiz}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Retry</span>
            </button>
          )}
        </div>

        <div className="space-y-1.5 pt-1">
          {options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const hasAnswered = selectedIdx !== null;

            let buttonStyle = 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700';

            if (hasAnswered) {
              if (option.isCorrect) {
                buttonStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-sm shadow-emerald-500/20';
              } else if (isSelected && !option.isCorrect) {
                buttonStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200';
              } else {
                buttonStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasAnswered}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between group ${buttonStyle}`}
              >
                <span className="font-medium pr-2">{option.text}</span>
                {hasAnswered && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Takeaway Drawer */}
      {selectedIdx !== null && (
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
          {options[selectedIdx].isCorrect ? (
            <div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <span>🔥 Correct! +5 League Points Awarded</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                By comparing outputs against the group average, GRPO bypasses training a separate value critic network, liberating gigabytes of GPU memory.
              </p>
            </div>
          ) : (
            <div>
              <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                <span>Insight for Revision</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The key breakthrough is Option B: GRPO computes relative rewards within sampled generations, completely removing the second critic model.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
