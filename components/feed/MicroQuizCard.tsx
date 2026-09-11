'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Brain, Zap, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { triggerHaptic } from '@/lib/mobileBridge';

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

  const handleSelect = async (index: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);

    if (options[index].isCorrect) {
      triggerHaptic('success');
      setPointsEarned(true);
      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 65,
            spread: 55,
            origin: { y: 0.7 },
            colors: ['#F3582A', '#10B981', '#F59E0B'],
          });
        }
      } catch {
        // Fallback
      }
    } else {
      triggerHaptic('error');
    }
  };

  const resetQuiz = () => {
    setSelectedIdx(null);
    setPointsEarned(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl bg-card text-card-foreground border border-border p-5 shadow-sm">
      <CardContent className="p-0 space-y-4">
        {/* Card Header & Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-sm font-bold bg-primary/10 text-primary border-primary/20">
              <Brain className="w-3.5 h-3.5" />
              <span>LLM Post-Training</span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">Today&apos;s Spark</span>
          </div>
          <Badge
            variant="outline"
            className={`gap-1 text-sm font-semibold transition-all ${
              pointsEarned 
                ? 'bg-primary/20 text-primary border-primary/40 scale-105' 
                : 'text-primary bg-primary/10 border-primary/20'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{pointsEarned ? 'Claimed +5 pts!' : '+5 pts'}</span>
          </Badge>
        </div>

        {/* Breakthrough Title & Visual Breakdown */}
        <div>
          <h3 className="text-base font-bold text-foreground tracking-tight mb-2">
            DeepSeek-R1: Pure RL Reasoning Emergence via GRPO
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DeepSeek-R1 proves mathematical and code reasoning can spontaneously emerge without human warm-up data.
            By ditching standard PPO for Group Relative Policy Optimization (GRPO), it removes the memory-heavy value network.
          </p>
        </div>

        {/* Mini Architecture Diagram Representation */}
        <div className="p-3 rounded-2xl bg-muted/60 border border-border font-mono text-sm">
          <div className="text-muted-foreground text-sm uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Architecture Trade-Off</span>
            <span className="text-primary font-bold">VRAM Savings: ~60%</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold py-1.5 px-2.5 rounded-xl bg-card border border-border">
            <span className="text-destructive line-through">PPO: Policy + Value Model</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-primary">GRPO: Policy + Group Norm</span>
          </div>
        </div>

        {/* The 5-Second Interactive Micro-Quiz */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground flex items-center gap-1.5" id="quiz-question-title">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>5-Second Check: Why does GRPO save ~60% VRAM?</span>
            </span>
            {selectedIdx !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetQuiz}
                aria-label="Retry this quiz question"
                className="gap-1 text-muted-foreground hover:text-foreground text-sm h-8 px-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            )}
          </div>

          <div
            role="radiogroup"
            aria-labelledby="quiz-question-title"
            className="space-y-1.5 pt-1"
          >
            {options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const hasAnswered = selectedIdx !== null;

              let buttonStyle = 'bg-muted/60 hover:bg-muted border-border text-foreground hover:border-primary/40';

              if (hasAnswered) {
                if (option.isCorrect) {
                  buttonStyle = 'bg-primary/10 border-primary text-foreground shadow-xs font-semibold';
                } else if (isSelected && !option.isCorrect) {
                  buttonStyle = 'bg-destructive/20 border-destructive text-foreground';
                } else {
                  buttonStyle = 'opacity-40 bg-muted/30 border-border text-muted-foreground';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${buttonStyle}`}
                >
                  <span className="font-medium pr-2">{option.text}</span>
                  {hasAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                  )}
                  {hasAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-4 h-4 text-destructive shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Takeaway Drawer */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {selectedIdx !== null && (
            <div className="p-3.5 rounded-2xl bg-muted/70 border border-border text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              {options[selectedIdx].isCorrect ? (
                <div>
                  <div className="font-bold text-primary flex items-center gap-1.5 mb-1">
                    <span>🔥 Correct! +5 League Points Awarded</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    By comparing outputs against the group average, GRPO bypasses training a separate value critic network, liberating gigabytes of GPU memory.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-destructive flex items-center gap-1.5 mb-1">
                    <span>Insight for Revision</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The key breakthrough is Option B: GRPO computes relative rewards within sampled generations, completely removing the second critic model.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
