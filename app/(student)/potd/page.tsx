'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DAILY_POTD_CHALLENGES, PotdChallenge } from '@/lib/potd-data';
import {
  getTodayPotdQuestionAction,
  getPotdStreakAction,
  submitPotdSolutionAction,
  PotdSubmissionResult,
} from '@/app/actions/potd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Code2,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Calculator,
} from 'lucide-react';

export default function ProblemOfTheDayPage() {
  const [challenge, setChallenge] = useState<PotdChallenge>(DAILY_POTD_CHALLENGES[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<PotdSubmissionResult | null>(null);

  const [streakDays, setStreakDays] = useState<number>(1);
  const [completedToday, setCompletedToday] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync challenge and student flame streak directly from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [streakData, todayChallenge] = await Promise.all([
          getPotdStreakAction(),
          getTodayPotdQuestionAction(),
        ]);

        if (isMounted) {
          if (todayChallenge) {
            setChallenge(todayChallenge);
          }

          if (streakData) {
            setStreakDays(streakData.currentStreak);
            setCompletedToday(streakData.completedToday);

            // Restore saved submission state so refreshing preserves completion and prevents re-attempt
            if (streakData.completedToday && streakData.savedSubmission) {
              setSelectedOption(streakData.savedSubmission.selectedOptionIndex);
              setSubmissionResult({
                success: true,
                isCorrect: streakData.savedSubmission.isCorrect,
                selectedOptionIndex: streakData.savedSubmission.selectedOptionIndex,
                correctOptionIndex: todayChallenge?.correctOptionIndex ?? 0,
                explanation: todayChallenge?.explanation ?? '',
                pointsAwarded: streakData.savedSubmission.pointsAwarded,
              });
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load POTD from Supabase:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Submit and verify chosen option (strictly 1 attempt per day)
  const handleSubmitAnswer = async () => {
    if (selectedOption === null || completedToday || submissionResult !== null) return;

    setIsSubmitting(true);

    const result = await submitPotdSolutionAction(challenge.id, selectedOption);
    setIsSubmitting(false);

    // Immediately lock the UI permanently for today
    setCompletedToday(true);
    setSubmissionResult(result);

    if (result.success && result.isCorrect) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }

      if (result.updatedStreak !== undefined) {
        setStreakDays(result.updatedStreak);
      } else {
        const streakData = await getPotdStreakAction();
        setStreakDays(streakData.currentStreak);
      }
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-sm font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Problem of the Day</span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              Daily Architecture &amp; Code Challenge
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            AI Engineering Challenge
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Solve today&apos;s high-yield technical scenario to reinforce applied AI systems intuition and maintain your daily Supabase streak.
          </p>
        </div>

        {/* Daily Flame Streak Badge - Synced directly from Supabase */}
        <Card className="p-3.5 flex items-center gap-3 shrink-0 shadow-sm border-border">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground font-mono">
              {isLoading ? '...' : `${streakDays} Day Flame Streak`}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>+{challenge.pointsReward || 25} XP per challenge</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Single-Column Problem Card */}
      <Card className="p-6 sm:p-8 shadow-sm space-y-6 border-border">
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-sm font-bold font-mono">
              {challenge.topic}
            </Badge>
            <Badge
              variant="outline"
              className="text-sm font-mono bg-primary/10 text-primary border-primary/20 font-semibold"
            >
              {challenge.track}
            </Badge>
            <Badge
              variant="outline"
              className={`text-sm font-mono font-semibold ${
                challenge.difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {challenge.difficulty} Level
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {completedToday && (
              <Badge
                variant="outline"
                className="text-sm font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved Today</span>
              </Badge>
            )}
            <span className="text-sm font-mono text-muted-foreground font-semibold">
              +{challenge.pointsReward} XP
            </span>
          </div>
        </div>

        {/* Title & Problem Statement */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {challenge.title}
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            {challenge.problemStatement}
          </p>
        </div>

        {/* Scenario Setup */}
        {challenge.scenario && (
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-sm">
            <span className="font-mono text-sm font-bold text-foreground uppercase tracking-wider block">
              Production Scenario:
            </span>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-sans">
              {challenge.scenario}
            </div>
          </div>
        )}

        {/* Mathematical Formula Display Card */}
        {challenge.formula && (
          <div className="p-4 rounded-xl bg-card border border-primary/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-primary font-mono uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>{challenge.formula.label}</span>
            </div>

            {/* Formula Equation Layout */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="text-sm sm:text-base font-mono font-bold text-foreground">
                {challenge.formula.formula}
              </div>
            </div>

            {/* Step-by-Step Mathematical Calculation Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-mono">
              <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                <span className="text-muted-foreground block font-bold">1. Numerator (Dot Product):</span>
                <span className="text-foreground">{challenge.formula.numerator}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                <span className="text-muted-foreground block font-bold">2. Denominator (Norm Product):</span>
                <span className="text-foreground">{challenge.formula.denominator}</span>
              </div>
            </div>
          </div>
        )}

        {/* Code Snippet to Inspect */}
        {challenge.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-mono text-muted-foreground">
              <span>Code Context (Python)</span>
              <span>Vector Logic</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-sm overflow-x-auto leading-relaxed border border-border">
              <code>{challenge.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Question Prompt & Interactive Options */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Challenge Question:
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {challenge.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isFinished = completedToday || submissionResult !== null;
              const isCorrectOption = idx === challenge.correctOptionIndex;

              let optionStyle = 'border-border bg-card hover:border-primary/50 hover:bg-muted/30';
              if (isSelected && !isFinished) {
                optionStyle = 'border-primary bg-primary/5 ring-1 ring-primary';
              }
              if (isFinished) {
                if (isCorrectOption) {
                  optionStyle =
                    'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/60 font-semibold';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle =
                    'border-destructive bg-destructive/10 text-destructive ring-1 ring-destructive opacity-90';
                } else {
                  optionStyle = 'border-border opacity-40 bg-card';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitting || isFinished}
                  onClick={() => !isFinished && setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5 ${
                      isFinished && isCorrectOption
                        ? 'bg-emerald-600 text-white'
                        : isFinished && isSelected && !isCorrectOption
                        ? 'bg-destructive text-destructive-foreground'
                        : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isFinished && isCorrectOption
                      ? '✓'
                      : isFinished && isSelected && !isCorrectOption
                      ? '✕'
                      : optionLetters[idx]}
                  </div>
                  <div className="text-sm font-medium leading-relaxed pt-0.5 text-foreground flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span>{opt}</span>
                      {isFinished && isCorrectOption && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-sm font-mono shrink-0"
                        >
                          Correct Answer
                        </Badge>
                      )}
                      {isFinished && isSelected && !isCorrectOption && (
                        <Badge
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/30 text-sm font-mono shrink-0"
                        >
                          Your Answer (Incorrect)
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Action Controls */}
          <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground font-mono">
              {(completedToday || submissionResult !== null)
                ? 'Challenge completed for today'
                : selectedOption === null
                ? 'Select an option to submit your answer'
                : `Selected Option ${optionLetters[selectedOption]}`}
            </span>

            {(completedToday || submissionResult !== null) ? (
              <Button
                type="button"
                disabled
                className="gap-2 text-sm font-bold px-6 shadow-xs bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-80"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed for Today</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || selectedOption === null}
                className="gap-2 text-sm font-bold px-6 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying Answer...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Completed Daily Banner */}
          {(completedToday || submissionResult !== null) && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                submissionResult?.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    submissionResult?.isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground block">
                    {submissionResult?.isCorrect
                      ? 'Daily Problem Solved! Flame Streak Maintained'
                      : 'Daily Problem Completed (Attempt Recorded)'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {submissionResult?.isCorrect
                      ? `You claimed today's +${challenge.pointsReward || 25} XP. Next problem unlocks tomorrow at 00:00 UTC.`
                      : 'Next challenge unlocks tomorrow at 00:00 UTC. Review the technical explanation below.'}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-sm font-mono shrink-0 ${
                  submissionResult?.isCorrect
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {submissionResult?.isCorrect ? `+${challenge.pointsReward || 25} XP Claimed` : '0 XP'}
              </Badge>
            </div>
          )}

          {/* Submission Result Feedback */}
          {submissionResult && (
            <div
              className={`p-5 rounded-xl border text-sm space-y-3 animate-in fade-in-50 ${
                submissionResult.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                  : 'bg-destructive/10 border-destructive/30 text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base">
                {submissionResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Correct! (+{submissionResult.pointsAwarded} XP Earned)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    <span className="text-destructive">
                      Incorrect Selection (0 XP)
                    </span>
                  </>
                )}
              </div>

              {!submissionResult.isCorrect && selectedOption !== null && (
                <p className="text-sm text-muted-foreground">
                  You selected Option {optionLetters[selectedOption]}. The correct answer is{' '}
                  <span className="font-semibold text-foreground">
                    Option {optionLetters[challenge.correctOptionIndex]}
                  </span>
                  .
                </p>
              )}

              <div className="space-y-2 pt-1 border-t border-border/60">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground font-mono">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground font-sans">
                  {challenge.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
