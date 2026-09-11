'use client';

import React, { useState } from 'react';
import { InterleavedQuiz } from '@/lib/feed-social-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, XCircle, Flame, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitInterleavedQuizAction } from '@/app/actions/feed';

interface InterleavedQuizCardProps {
  quiz: InterleavedQuiz;
  onAnswerResolved?: (pointsAwarded: number) => void;
}

export function InterleavedQuizCard({ quiz, onAnswerResolved }: InterleavedQuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = async (index: number) => {
    if (isAnswered || isSubmitting) return;

    setSelectedOption(index);
    setIsSubmitting(true);

    try {
      const result = await submitInterleavedQuizAction(quiz.id, index);
      setIsAnswered(true);
      setIsCorrect(result.isCorrect);

      if (result.isCorrect) {
        // Trigger celebratory confetti burst
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.75 },
            colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899'],
          });
        } catch {
          // Confetti fallback
        }

        if (onAnswerResolved) {
          onAnswerResolved(result.pointsAwarded);
        }
      }
    } catch (err) {
      console.error('Failed to submit interleaved quiz:', err);
      // Fallback local evaluation
      const localCorrect = index === quiz.correctOptionIndex;
      setIsAnswered(true);
      setIsCorrect(localCorrect);
      if (localCorrect && onAnswerResolved) {
        onAnswerResolved(quiz.pointsAwarded);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2 border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card shadow-lg rounded-3xl p-5 sm:p-6 transition-all hover:border-primary/50">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 text-sm font-bold bg-primary/15 text-primary border-primary/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Checkpoint</span>
          </Badge>
          <Badge variant="secondary" className="text-sm font-semibold">
            {quiz.category}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-mono font-bold">
          <Flame className="w-4 h-4" />
          <span>+{quiz.pointsAwarded} XP</span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-5">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {quiz.questionText}
          </h3>
        </div>
      </div>

      {/* Interactive Options */}
      <div className="space-y-2.5 mb-4">
        {quiz.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C
          const isSelected = selectedOption === idx;
          const isTheCorrectOne = idx === quiz.correctOptionIndex;

          let buttonStyle = 'border-border/70 bg-card hover:bg-muted/50 text-foreground';

          if (isAnswered) {
            if (isTheCorrectOne) {
              buttonStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold ring-1 ring-emerald-500';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-rose-500 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500';
            } else {
              buttonStyle = 'border-border/40 opacity-50 bg-card text-muted-foreground';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered || isSubmitting}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${buttonStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center text-sm font-bold font-mono shrink-0">
                  {letter}
                </span>
                <span className="text-sm font-medium leading-relaxed">
                  {option}
                </span>
              </div>

              {isAnswered && (
                <div className="shrink-0">
                  {isTheCorrectOne ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in-50" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-500 animate-in zoom-in-50" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Explanation */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl border text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <strong className="font-bold">
              {isCorrect ? 'Awesome job! +5 League XP Earned' : 'Not quite right'}
            </strong>
          </div>
          <p className="text-muted-foreground text-sm pl-6">
            {quiz.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}
