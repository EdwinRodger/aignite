'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ShieldCheck,
  Check,
  XCircle,
} from 'lucide-react';

interface RAGArchitectureOption {
  id: string;
  name: string;
  framework: string;
  latency: string;
  tokenCostPerQuery: string;
  status: 'optimal' | 'failed_latency' | 'failed_accuracy' | 'failed_cost';
  verdict: string;
  architecturalInsight: string;
}

const RAG_DECISION_OPTIONS: RAGArchitectureOption[] = [
  {
    id: 'A',
    name: 'Full Document Context Dump (No Vector DB)',
    framework: '1M Token Massive Context Window',
    latency: '8,400ms',
    tokenCostPerQuery: '$0.45 per query',
    status: 'failed_latency',
    verdict: 'Fails SLA: 8,400ms latency exceeds 50ms threshold by 168x and incurs massive token costs.',
    architecturalInsight:
      'Dumping entire 500-page manuals into the context window triggers severe lost-in-the-middle hallucinations and incurs unsustainable inference costs.',
  },
  {
    id: 'B',
    name: 'Hybrid Retrieval (HNSW Vector + BM25) with Cross-Encoder Rerank',
    framework: 'pgvector HNSW + Cohere Rerank',
    latency: '38ms',
    tokenCostPerQuery: '$0.002 per query',
    status: 'optimal',
    verdict: 'Optimal Solution: 38ms P95 latency easily clears the SLA with zero hallucinated part numbers.',
    architecturalInsight:
      'Combines dense semantic vector similarity with BM25 sparse keyword matching to capture both conceptual intent and exact part numbers. Reranking ensures only the top 3 chunks enter context.',
  },
  {
    id: 'C',
    name: 'Legacy SQL Full-Text Substring Search',
    framework: 'PostgreSQL ILIKE & Regex',
    latency: '45ms',
    tokenCostPerQuery: '$0.001 per query',
    status: 'failed_accuracy',
    verdict: 'Fails Accuracy: Zero recall on conceptual synonyms and natural language paraphrasing.',
    architecturalInsight:
      'Pure keyword search fails whenever user vocabulary differs from document wording (e.g. searching "battery drained" fails to match "accumulator voltage depleted").',
  },
  {
    id: 'D',
    name: 'Continuous Model Fine-Tuning on Raw Manuals',
    framework: 'LoRA SFT Adapters',
    latency: '120ms',
    tokenCostPerQuery: '$0.015 per query',
    status: 'failed_cost',
    verdict: 'Fails Grounding: Models hallucinate specific numbers and cannot provide exact source citations.',
    architecturalInsight:
      'Fine-tuning is designed to adapt style and tone, not to serve as an accurate factual storehouse for thousands of fast-changing enterprise specifications.',
  },
];

export function DecisionSimulatorChallenge({ onComplete }: { onComplete?: () => void }) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const selectedOption = RAG_DECISION_OPTIONS.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (id: string) => {
    if (isCorrect) return; // Locked once verified optimal
    setSelectedOptionId(id);
    setIsSubmitted(false);
  };

  const handleConfirmArchitecture = () => {
    if (!selectedOptionId || isCorrect) return;

    setIsSubmitted(true);
    const chosen = RAG_DECISION_OPTIONS.find((o) => o.id === selectedOptionId);

    if (chosen?.status === 'optimal') {
      setIsCorrect(true);
      if (!xpEarned) {
        setXpEarned(true);
        if (typeof window !== 'undefined') {
          const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
          localStorage.setItem('aignite_student_points', (currentPoints + 25).toString());
        }
        onComplete?.();
      }
    } else {
      setIsCorrect(false);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <Card className="p-6 sm:p-8 border-border bg-card shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground font-sans">
                RAG Architecture Decision
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Evaluate architectural tradeoffs and select the optimal retrieval engine under strict latency and cost constraints.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-sm text-muted-foreground"
          title="Reset Decision"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Scenario Brief */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-sm space-y-2">
        <span className="font-bold text-foreground block">
          Architectural Mission Scenario:
        </span>
        <p className="text-muted-foreground leading-relaxed">
          You are deploying a technical support knowledge base covering 500,000 PDF pages of complex hardware manuals. Your strict production requirements: <strong>P95 latency must be strictly under 50ms</strong>, users search using exact serial part numbers as well as conceptual symptoms, and token costs must remain sustainable. Which architecture do you select?
        </p>
      </div>

      {/* SLA Target Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Target Latency SLA</span>
          <span className="text-base font-bold text-foreground font-mono">&lt; 50ms P95</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Dataset Scale</span>
          <span className="text-base font-bold text-foreground font-mono">500k PDF Pages</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Accuracy Bar</span>
          <span className="text-base font-bold text-primary font-mono">100% Part Number Recall</span>
        </div>
      </div>

      {/* Architecture Options Selection */}
      <div className="space-y-3">
        <span className="text-sm font-bold text-foreground block">
          Select Candidate Architecture:
        </span>

        <div className="grid grid-cols-1 gap-3">
          {RAG_DECISION_OPTIONS.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            let cardStyle = 'bg-card border-border hover:border-primary/40';
            let badgeStyle = 'bg-muted text-foreground';

            if (isSelected && !isSubmitted) {
              cardStyle = 'bg-primary/5 border-primary shadow-xs';
              badgeStyle = 'bg-primary text-primary-foreground';
            } else if (isSelected && isSubmitted) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-500/10 border-emerald-500/50 shadow-xs';
                badgeStyle = 'bg-emerald-500 text-white';
              } else {
                cardStyle = 'bg-destructive/10 border-destructive/50 shadow-xs';
                badgeStyle = 'bg-destructive text-white';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 space-y-2 text-sm ${cardStyle}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-sm ${badgeStyle}`}
                    >
                      {opt.id}
                    </span>
                    <span className="font-bold text-foreground">{opt.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-mono">
                    <Badge variant="outline" className="text-sm border-border">
                      {opt.framework}
                    </Badge>
                    <span className="text-muted-foreground font-medium">
                      {opt.latency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-1 border-t border-border/40">
                  <span>Inference Cost: {opt.tokenCostPerQuery}</span>
                  {isSelected && isSubmitted && (
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-destructive'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Recommended Choice Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Fails Production SLA</span>
                        </>
                      )}
                    </span>
                  )}
                  {isSelected && !isSubmitted && (
                    <span className="text-primary font-semibold">
                      Selected Candidate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Verdict Card (Only shown after Confirm Architecture is clicked) */}
      {isSubmitted && selectedOption && (
        <div
          className={`p-5 rounded-xl border space-y-2 text-sm ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
              : 'bg-destructive/10 border-destructive/40 text-destructive'
          }`}
        >
          <div className="font-bold text-base flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            )}
            <span>{selectedOption.verdict}</span>
          </div>
          <p className="leading-relaxed text-foreground/90">
            {selectedOption.architecturalInsight}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {isCorrect && xpEarned ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Optimal Architecture Verified (+25 XP)
            </span>
          ) : (
            'Select and confirm the optimal architecture to earn +25 XP'
          )}
        </div>

        <Button
          type="button"
          disabled={!selectedOptionId || isCorrect}
          onClick={handleConfirmArchitecture}
          className="w-full sm:w-auto font-bold text-sm px-6"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isCorrect ? 'Architecture Verified' : 'Confirm Architecture'}
        </Button>
      </div>
    </Card>
  );
}
