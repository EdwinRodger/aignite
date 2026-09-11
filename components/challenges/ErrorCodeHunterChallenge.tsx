'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Code2,
  Check,
  Zap,
  XCircle,
} from 'lucide-react';
import { RAG_ERROR_HUNTER_MISSION } from '@/lib/challenges/rag-error-hunter-data';

export function ErrorCodeHunterChallenge({ onComplete }: { onComplete?: () => void }) {
  const mission = RAG_ERROR_HUNTER_MISSION;
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPatchApplied, setIsPatchApplied] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const handleSelectOption = (id: number) => {
    if (isPatchApplied) return;
    setSelectedDiagnosis(id);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleSubmitDiagnosis = () => {
    if (!selectedDiagnosis || isPatchApplied) return;

    const chosen = mission.diagnoses.find((d) => d.id === selectedDiagnosis);
    setIsSubmitted(true);

    if (chosen?.isCorrect) {
      setIsCorrect(true);
      setIsPatchApplied(true);
      if (!xpEarned) {
        setXpEarned(true);
        if (typeof window !== 'undefined') {
          const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
          localStorage.setItem('aignite_student_points', (currentPoints + mission.rewardXp).toString());
        }
        onComplete?.();
      }
    } else {
      setIsCorrect(false);
      setIsPatchApplied(false);
    }
  };

  const handleReset = () => {
    setSelectedDiagnosis(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsPatchApplied(false);
  };

  return (
    <Card className="p-6 sm:p-8 border-border bg-card shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground font-sans">
                RAG Error Code Hunter
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Inspect production vector retrieval code, identify silent ranking regressions, and apply the patch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm text-muted-foreground"
            title="Reset Bug Hunt"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Target Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Active Mission</span>
          <span className="text-base font-bold text-foreground font-mono">Vector Inversion</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Severity Level</span>
          <span className="text-base font-bold text-destructive font-mono">{mission.severity}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Verification Status</span>
          <span className={`text-base font-bold font-mono ${isPatchApplied ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}`}>
            {isPatchApplied ? 'Patched & Verified' : 'Bug Active in Code'}
          </span>
        </div>
      </div>

      {/* Why it matters banner */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground font-semibold">Why this matters: </strong>
        {mission.whyItMatters}
      </div>

      {/* Code Snippet Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span>Production Retrieval Code Snippet (Python)</span>
          </span>
          <span className="text-sm text-muted-foreground">
            {isPatchApplied ? 'Showing patched production code' : 'Review lines 1-12 for silent ranking defect'}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 sm:p-5 font-mono text-sm text-slate-100 space-y-1 overflow-x-auto">
          {mission.codeSnippet.unpatchedCode.map((line, idx) => {
            const lineNum = idx + 1;
            const isBugLine = lineNum === mission.codeSnippet.bugLineNumber;

            if (isBugLine && isPatchApplied) {
              return (
                <div
                  key={lineNum}
                  className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/40"
                >
                  <span className="text-emerald-400 select-none mr-3">+</span>
                  {mission.codeSnippet.patchedDiffLine}
                </div>
              );
            }

            if (isBugLine && !isPatchApplied) {
              return (
                <div
                  key={lineNum}
                  className="bg-slate-900/80 text-slate-100 px-2 py-0.5 rounded border border-slate-800"
                >
                  <span className="text-slate-600 select-none mr-3 inline-block w-4 text-right">
                    {lineNum}
                  </span>
                  {line}
                </div>
              );
            }

            return (
              <div key={lineNum} className="text-slate-300">
                <span className="text-slate-600 select-none mr-3 inline-block w-4 text-right">
                  {lineNum}
                </span>
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnosis Multi-Choice Section */}
      <div className="space-y-3">
        <span className="text-sm font-bold text-foreground block">
          Root Cause Diagnosis: Which statement accurately describes the bug?
        </span>

        <div className="space-y-2.5">
          {mission.diagnoses.map((option) => {
            const isSelected = selectedDiagnosis === option.id;

            let cardStyle = 'bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground';
            let circleStyle = 'border-muted-foreground/40 text-transparent';

            if (isSelected && !isSubmitted) {
              cardStyle = 'bg-primary/5 border-primary text-foreground shadow-xs';
              circleStyle = 'border-primary bg-primary text-primary-foreground';
            } else if (isSelected && isSubmitted) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-500/10 border-emerald-500/50 text-foreground shadow-xs';
                circleStyle = 'border-emerald-500 bg-emerald-500 text-white';
              } else {
                cardStyle = 'bg-destructive/10 border-destructive/50 text-foreground shadow-xs';
                circleStyle = 'border-destructive bg-destructive text-white';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border text-sm cursor-pointer transition-all duration-150 flex items-start gap-3 ${cardStyle}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${circleStyle}`}
                >
                  {isSelected && (isSubmitted ? (isCorrect ? <Check className="w-3.5 h-3.5" /> : <span className="font-bold">×</span>) : <Check className="w-3.5 h-3.5" />)}
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-medium text-foreground block leading-relaxed">{option.text}</span>
                  {isSelected && isSubmitted && !isCorrect && (
                    <div className="text-sm font-semibold text-destructive flex items-center gap-1 pt-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect Diagnosis. Review NumPy argsort ordering rules and select another option.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Feedback Alert if Incorrect */}
      {isSubmitted && !isCorrect && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive space-y-1 text-sm">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Diagnosis Incorrect</span>
          </div>
          <p className="leading-relaxed text-destructive/90">
            The selected root cause does not explain why the retrieval pipeline is returning wrong document chunks. Please reconsider how array indices are sorted in Python NumPy and try another diagnosis.
          </p>
        </div>
      )}

      {/* Verification & Explanation Card (Only shown upon correct submission) */}
      {isPatchApplied && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2 text-sm">
          <div className="font-bold text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Production Patch Verified</span>
          </div>
          <p className="leading-relaxed text-emerald-900/90 dark:text-emerald-200">
            {mission.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {xpEarned ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Bug Fixed & Verified (+{mission.rewardXp} XP)
            </span>
          ) : (
            `Diagnose correctly to apply the patch and earn +${mission.rewardXp} XP`
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmitDiagnosis}
          disabled={!selectedDiagnosis || isPatchApplied}
          className="w-full sm:w-auto font-bold text-sm px-6"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isPatchApplied ? 'Patch Active' : 'Submit Diagnosis & Apply Patch'}
        </Button>
      </div>
    </Card>
  );
}
