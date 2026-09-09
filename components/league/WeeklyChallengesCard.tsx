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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
        // Fallback
      }

      if (onChallengeCompleted) {
        onChallengeCompleted(result.pointsAwarded);
      }
    }
  };

  return (
    <Card className="rounded-3xl border-border shadow-xl">
      <CardHeader className="p-5 sm:p-6 border-b border-border/60 pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Weekly League Challenges</h3>
            <span className="text-sm text-muted-foreground font-mono">
              Earn +50 XP per challenge before Sunday midnight
            </span>
          </div>
        </div>

        <Badge variant="outline" className="text-sm font-mono font-bold text-primary bg-primary/10 border-primary/20">
          {completedIds.length}/{challenges.length} Done
        </Badge>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-3">
        {challenges.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-muted/30 border border-border/70 space-y-2">
            <p className="text-sm font-semibold text-foreground">No Challenges Active This Week</p>
            <p className="text-sm text-muted-foreground">
              New production AI systems challenges drop every Monday at 00:00 UTC.
            </p>
          </div>
        ) : (
          challenges.map((challenge) => {
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
                  className="w-full p-4 text-left flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm font-mono font-semibold">
                        {challenge.category}
                      </Badge>
                      <span className="text-sm font-mono text-primary font-bold">
                        +{challenge.pointsAwarded} XP
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {challenge.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    {isDone ? (
                      <Badge variant="outline" className="gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </Badge>
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

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>💡 <strong>Architectural Hint</strong>: {challenge.sampleSubmissionHint}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <Textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Outline your architectural solution, trade-offs, and failure mode mitigations..."
                        rows={3}
                        className="resize-none"
                      />

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleSubmit(challenge.id)}
                          disabled={!answerText.trim() || isSubmitting}
                          className="rounded-xl text-sm font-bold shadow-xs shadow-primary/20 gap-1.5"
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
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion Feedback */}
                {isDone && feedback && (
                  <div className="p-3 border-t border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{feedback}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
