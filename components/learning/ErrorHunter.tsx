'use client';

import React, { useState } from 'react';
import {
  Bug,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ErrorHunterScenario } from '@/lib/learning-data';
import { submitErrorHunterSolution } from '@/app/actions/learning';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ErrorHunterProps {
  scenario: ErrorHunterScenario;
  packSlug: string;
  onCompleted?: (points: number) => void;
}

export function ErrorHunter({ scenario, packSlug, onCompleted }: ErrorHunterProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const handleSubmit = async (optionId: string) => {
    if (hasSubmitted) return;

    setSelectedOptionId(optionId);
    setHasSubmitted(true);

    const result = await submitErrorHunterSolution(packSlug, optionId);
    setIsCorrect(result.isCorrect);
    setExplanation(result.explanation);
    setFixedCode(result.fixedCode);

    if (result.isCorrect) {
      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.65 },
            colors: ['#10B981', '#F97316', '#3B82F6'],
          });
        }
      } catch {
        // Fallback for restricted canvas
      }

      if (onCompleted) {
        onCompleted(result.pointsAwarded);
      }
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setExplanation(null);
    setShowDiff(false);
  };

  return (
    <Card className="w-full rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 text-sm font-bold px-2.5 py-0.5 bg-destructive/10 text-destructive border-destructive/20">
              <Bug className="w-3.5 h-3.5" />
              <span>Error Hunter</span>
            </Badge>
            <Badge variant="outline" className="text-sm font-mono px-2 py-0.5">
              {scenario.framework}
            </Badge>
            <span className="text-sm text-muted-foreground">- {scenario.difficulty}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {scenario.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {scenario.contextDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="gap-1 text-sm font-semibold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            <span>+{scenario.pointsAwarded} XP</span>
          </Badge>
          {hasSubmitted && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              aria-label="Retry bug scenario"
              className="p-1.5 rounded-lg border border-border"
              title="Retry Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Code Inspection Editor Preview */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-sm overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-zinc-300 font-medium ml-2">train_loop.py</span>
          </div>
          <span className="text-zinc-500 text-sm">Inspect lines for bug</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto leading-relaxed">
          <pre className="text-sm">
            {scenario.buggyCode.split('\n').map((line, idx) => (
              <div key={idx} className="flex gap-4 hover:bg-zinc-900/60 py-0.5 px-1 rounded">
                <span className="text-zinc-600 select-none w-6 text-right font-mono text-sm">
                  {idx + 1}
                </span>
                <code
                  className={
                    line.includes('# [BUG')
                      ? 'text-amber-400 font-semibold bg-amber-500/10 px-1 rounded'
                      : 'text-zinc-200'
                  }
                >
                  {line}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Bug Diagnostic Options */}
      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground block">
          Diagnose Root Cause: What is causing the production failure?
        </span>

        <div role="radiogroup" aria-label="Bug diagnosis options" className="space-y-2">
          {scenario.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            let style = 'bg-muted/40 hover:bg-muted border-border text-foreground hover:border-primary/40';

            if (hasSubmitted) {
              if (opt.isCorrect) {
                style = 'bg-primary/20 border-primary text-foreground shadow-sm shadow-primary/20 ring-1 ring-primary/40 font-semibold';
              } else if (isSelected && !opt.isCorrect) {
                style = 'bg-destructive/20 border-destructive text-foreground';
              } else {
                style = 'opacity-40 bg-muted/30 border-border text-muted-foreground';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSubmit(opt.id)}
                disabled={hasSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${style}`}
              >
                <span className="pr-2 leading-relaxed">{opt.text}</span>
                {hasSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                )}
                {hasSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Explanation & Fix Reveal */}
      {hasSubmitted && explanation && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 rounded-xl bg-muted/70 border border-border text-sm">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  isCorrect ? 'text-primary' : 'text-destructive'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bug Identified! +{scenario.pointsAwarded} XP Earned</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect Diagnosis</span>
                  </>
                )}
              </span>

              {fixedCode && (
                <button
                  type="button"
                  onClick={() => setShowDiff(!showDiff)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showDiff ? 'Hide Fix' : 'Reveal Production Fix'}</span>
                </button>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mt-1">
              {explanation}
            </p>
          </div>

          {/* Reveal Fix Code Box */}
          {showDiff && fixedCode && (
            <div className="rounded-xl bg-zinc-950 border border-emerald-900/40 text-zinc-100 font-mono text-sm overflow-hidden shadow-xl animate-in fade-in">
              <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center justify-between text-sm text-emerald-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Corrected Code</span>
                </span>
                <span className="text-sm text-zinc-400">Fixed</span>
              </div>
              <div className="p-4 overflow-x-auto text-sm leading-relaxed">
                <pre>{fixedCode}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
