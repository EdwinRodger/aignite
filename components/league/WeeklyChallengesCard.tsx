'use client';

import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeeklyChallenge } from '@/lib/league-data';
import { submitLeagueChallenge } from '@/app/actions/league';

interface WeeklyChallengesCardProps {
  challenges: WeeklyChallenge[];
  onChallengeCompleted?: (points: number) => void;
}

export function WeeklyChallengesCard({
  challenges,
  onChallengeCompleted,
}: WeeklyChallengesCardProps) {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenChallenge = (id: string) => {
    if (selectedChallengeId === id) {
      setSelectedChallengeId(null);
    } else {
      setSelectedChallengeId(id);
      setAnswerText('');
      setFeedback(null);
    }
  };

  const handleSubmit = async (challengeId: string) => {
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    const result = await submitLeagueChallenge(challengeId, answerText);
    setIsSubmitting(false);

    if (result.success) {
      setCompletedIds((prev) => [...prev, challengeId]);
      setFeedback(result.feedback);

      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#F97316', '#10B981', '#3B82F6'],
          });
        }
      } catch {
        // Fallback for restricted canvas
      }

      if (onChallengeCompleted) {
        onChallengeCompleted(result.pointsAwarded);
      }
    }
  };

  return (
    <div className="w-full rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Weekly League Challenges</h3>
            <span className="text-[11px] text-muted-foreground font-mono">
              Earn +50 XP per challenge before Sunday midnight
            </span>
          </div>
        </div>

        <span className="text-sm font-mono font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
          {completedIds.length}/{challenges.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isOpen = selectedChallengeId === challenge.id;
          const isDone = completedIds.includes(challenge.id);

          return (
            <div
              key={challenge.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : isOpen
                  ? 'border-primary/50 bg-muted/30 shadow-md shadow-primary/5'
                  : 'border-border bg-card hover:border-border/80'
              }`}
            >
              {/* Challenge Header Row */}
              <button
                type="button"
                onClick={() => handleOpenChallenge(challenge.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {challenge.category}
                    </span>
                    <span className="text-[11px] font-mono text-primary font-bold">
                      +{challenge.pointsAwarded} XP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    {challenge.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expandable Submission Form */}
              {isOpen && !isDone && (
                <div className="p-4 border-t border-border/60 bg-card space-y-3 animate-in fade-in">
                  <p className="text-sm text-foreground/90 leading-relaxed font-sans">
                    {challenge.prompt}
                  </p>

                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>💡 <strong>Architectural Hint</strong>: {challenge.sampleSubmissionHint}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Outline your architectural solution, trade-offs, and failure mode mitigations..."
                      rows={3}
                      className="w-full p-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSubmit(challenge.id)}
                        disabled={!answerText.trim() || isSubmitting}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Grading...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Solution (+50 XP)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Feedback */}
              {isDone && feedback && (
                <div className="p-3 border-t border-emerald-500/20 text-sm text-emerald-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
