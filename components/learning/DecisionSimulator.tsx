'use client';

import React, { useState } from 'react';
import {
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Gauge,
  DollarSign,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DecisionScenario } from '@/lib/learning-data';
import { submitDecisionSimulatorChoice } from '@/app/actions/learning';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DecisionSimulatorProps {
  scenario: DecisionScenario;
  packSlug: string;
  onCompleted?: (points: number) => void;
}

export function DecisionSimulator({ scenario, packSlug, onCompleted }: DecisionSimulatorProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    verdict: 'optimal' | 'acceptable' | 'rejected';
    metrics: { latencyScore: number; costScore: number; accuracyScore: number };
    tradeoffSummary: string;
    productionReasoning: string;
    pointsAwarded: number;
  } | null>(null);

  const handleSelectChoice = async (choiceId: string) => {
    setSelectedChoiceId(choiceId);

    const res = await submitDecisionSimulatorChoice(packSlug, choiceId);
    if (res.success) {
      setResult(res);

      if (res.verdict === 'optimal') {
        try {
          const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (!prefersReducedMotion) {
            confetti({
              particleCount: 65,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#10B981', '#F97316', '#6366F1'],
            });
          }
        } catch {
          // Fallback for restricted canvas
        }

        if (onCompleted) {
          onCompleted(res.pointsAwarded);
        }
      }
    }
  };

  const handleReset = () => {
    setSelectedChoiceId(null);
    setResult(null);
  };

  return (
    <Card className="w-full rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 text-sm font-bold px-2.5 py-0.5 bg-chart-4/10 text-chart-4 border-chart-4/20">
              <Brain className="w-3.5 h-3.5" />
              <span>AI Decision Simulator</span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">- {scenario.companyContext}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {scenario.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="gap-1 text-sm font-semibold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            <span>+{scenario.pointsAwarded} XP</span>
          </Badge>
          {selectedChoiceId && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              aria-label="Try another architecture"
              className="p-1.5 rounded-lg border border-border"
              title="Reset Choice"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Hard Constraints Box */}
      <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
        <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground block">
          Hard Production Constraints & SLAs:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-mono">
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-sm text-muted-foreground block">Latency SLA</span>
            <span className="font-bold text-primary mt-0.5 block">{scenario.hardConstraints.slaLatency}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-sm text-muted-foreground block">VRAM Budget</span>
            <span className="font-bold text-foreground mt-0.5 block">{scenario.hardConstraints.vramBudget}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-sm text-muted-foreground block">Cost Ceiling</span>
            <span className="font-bold text-foreground mt-0.5 block">{scenario.hardConstraints.costLimit}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-sm text-muted-foreground block">Accuracy Target</span>
            <span className="font-bold text-secondary-foreground mt-0.5 block">{scenario.hardConstraints.accuracyTarget}</span>
          </div>
        </div>
      </div>

      {/* Architectural Tradeoff Options */}
      <div className="space-y-3">
        <span className="text-sm font-bold text-foreground block">
          Select Your Production Architecture Proposal:
        </span>

        <div className="grid grid-cols-1 gap-3">
          {scenario.options.map((option) => {
            const isSelected = selectedChoiceId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectChoice(option.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-card border-primary ring-2 ring-primary/40 shadow-lg'
                    : 'bg-card/70 border-border hover:bg-muted/40 hover:border-primary/40'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {option.title}
                  </h4>
                  {isSelected && result && (
                    <Badge
                      variant={
                        result.verdict === 'optimal'
                          ? 'success'
                          : result.verdict === 'acceptable'
                          ? 'warning'
                          : 'destructive'
                      }
                      className="text-sm font-mono font-bold uppercase px-2 py-0.5"
                    >
                      {result.verdict}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  {option.architecture}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Feedback & Radar Metrics */}
      {result && (
        <div className="p-4 sm:p-5 rounded-xl bg-muted/60 border border-border space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Multi-Axis Metrics Evaluation */}
          <div>
            <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Multi-Axis Architecture Scorecard:
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-primary" />
                    <span>Latency</span>
                  </span>
                  <span className="font-bold text-foreground">{result.metrics.latencyScore}/100</span>
                </div>
                <Progress value={result.metrics.latencyScore} className="h-2" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cost</span>
                  </span>
                  <span className="font-bold text-foreground">{result.metrics.costScore}/100</span>
                </div>
                <Progress value={result.metrics.costScore} className="h-2" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-chart-4" />
                    <span>Accuracy</span>
                  </span>
                  <span className="font-bold text-foreground">{result.metrics.accuracyScore}/100</span>
                </div>
                <Progress value={result.metrics.accuracyScore} className="h-2" />
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${
              result.verdict === 'optimal'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                : result.verdict === 'acceptable'
                ? 'bg-amber-500/10 border-amber-500/30 text-foreground'
                : 'bg-destructive/10 border-destructive/30 text-foreground'
            }`}
          >
            {result.verdict === 'optimal' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : result.verdict === 'acceptable' ? (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block mb-0.5">
                {result.verdict === 'optimal'
                  ? `Production Proposal Approved! +${result.pointsAwarded} XP`
                  : result.verdict === 'acceptable'
                  ? 'Sub-Optimal Tradeoff (+10 XP Partial Credit)'
                  : 'Architecture Proposal Rejected'}
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {result.tradeoffSummary}
              </p>
              <p className="text-foreground text-sm leading-relaxed mt-1.5 font-medium">
                💡 <span className="underline">Production Reasoning</span>: {result.productionReasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
