'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Timer,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  RAG_BEGINNER_QUIZ_QUESTIONS,
  TOTAL_QUIZ_TIME_SECONDS,
  TimedQuizQuestion,
} from '@/lib/challenges/rag-quiz-data';

export function MicroQuizChallenge({ onComplete }: { onComplete?: () => void }) {
  const questions: TimedQuizQuestion[] = RAG_BEGINNER_QUIZ_QUESTIONS;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState<'submitted' | 'timeout'>('submitted');
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_QUIZ_TIME_SECONDS);
  const [xpEarned, setXpEarned] = useState(false);
  const [xpEarnedAmount, setXpEarnedAmount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Overall 60-second countdown timer for all questions
  useEffect(() => {
    if (quizCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinishQuiz('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizCompleted]);

  const handleFinishQuiz = (reason: 'submitted' | 'timeout' = 'submitted') => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCompletionReason(reason);
    setQuizCompleted(true);

    const calculatedScore = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;

    // 5 XP per correct answer: 0 correct = 0 XP, 3 correct = 15 XP, 5 correct = 25 XP
    const pointsAwarded = calculatedScore * 5;
    setXpEarnedAmount(pointsAwarded);

    if (pointsAwarded > 0 && !xpEarned) {
      setXpEarned(true);
      if (typeof window !== 'undefined') {
        const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
        localStorage.setItem('aignite_student_points', (currentPoints + pointsAwarded).toString());
      }
      onComplete?.();
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (quizCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentIdx].id]: optionIdx,
    }));
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setCompletionReason('submitted');
    setTimeLeft(TOTAL_QUIZ_TIME_SECONDS);
    setXpEarnedAmount(0);
  };

  const currentQ = questions[currentIdx];
  const currentSelectedOption = selectedAnswers[currentQ.id];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLastQuestion = currentIdx === questions.length - 1;

  // Calculate score at the end
  const score = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
  const timeProgressPercent = Math.max(0, (timeLeft / TOTAL_QUIZ_TIME_SECONDS) * 100);
  const isTimeCritical = timeLeft <= 10 && !quizCompleted;

  return (
    <Card className="p-6 sm:p-8 border-border bg-card shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground font-sans">
                Timed RAG Micro-Quiz
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Test your foundational RAG knowledge by answering 5 rapid-fire questions within a 60-second time limit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!quizCompleted && (
            <Badge variant="secondary" className="text-sm font-semibold py-1 px-3">
              {answeredCount} of {questions.length} Answered
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm text-muted-foreground"
            title="Restart Challenge"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Active 60-Second Challenge Timer Bar */}
          <div className="space-y-2 p-3.5 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer
                  className={`w-4 h-4 ${
                    isTimeCritical ? 'text-destructive animate-pulse' : 'text-primary'
                  }`}
                />
                <span className="text-sm font-bold text-foreground font-mono">
                  Challenge Timer ({questions.length} Questions):
                </span>
              </div>
              <span
                className={`text-base font-bold font-mono ${
                  isTimeCritical
                    ? 'text-destructive animate-pulse'
                    : timeLeft <= 20
                    ? 'text-amber-500'
                    : 'text-primary'
                }`}
              >
                {timeLeft}s / {TOTAL_QUIZ_TIME_SECONDS}s Remaining
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  isTimeCritical
                    ? 'bg-destructive'
                    : timeLeft <= 20
                    ? 'bg-amber-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${timeProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Stepper Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = selectedAnswers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : isAnswered
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Question Title & Topic */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm border-border">
                {currentQ.topic}
              </Badge>
              <Badge variant="secondary" className="text-sm bg-muted/60 text-muted-foreground">
                Question {currentIdx + 1} of {questions.length}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground font-sans leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid (Answers noted without revealing correctness until end) */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentSelectedOption === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl border text-sm flex items-start gap-3 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <span
                      className={`font-medium block leading-relaxed ${
                        isSelected ? 'text-foreground font-semibold' : 'text-foreground/90'
                      }`}
                    >
                      {opt}
                    </span>
                    {isSelected && (
                      <span className="text-sm font-semibold text-primary flex items-center gap-1 pt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        Selected Answer (Recorded)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="font-bold text-sm px-5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleFinishQuiz('submitted')}
                  className="font-bold text-sm px-6 bg-primary text-primary-foreground shadow-xs"
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  <span>Submit Quiz & View Results</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Final Results Screen (Shown only when timer expires or questions completed) */
        <div className="space-y-8 py-4">
          <div className="p-6 rounded-2xl bg-muted/20 border border-border text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground font-sans">
                {completionReason === 'timeout'
                  ? 'Time Limit Reached!'
                  : 'Quiz Submitted Successfully!'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {completionReason === 'timeout'
                  ? `The 60-second limit expired. Review your answers and architectural explanations below.`
                  : `You completed all questions in ${TOTAL_QUIZ_TIME_SECONDS - timeLeft} seconds.`}
              </p>
            </div>

            {/* Score Summary Banner */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="p-3.5 px-6 rounded-xl bg-card border border-border shadow-xs">
                <span className="text-sm text-muted-foreground block font-mono">Final Score</span>
                <span className="text-2xl font-bold text-foreground font-mono">
                  {score} / {questions.length} Correct ({Math.round((score / questions.length) * 100)}%)
                </span>
              </div>
              <div
                className={`p-3.5 px-6 rounded-xl border shadow-xs ${
                  xpEarnedAmount > 0
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-muted/40 border-border'
                }`}
              >
                <span
                  className={`text-sm block font-mono ${
                    xpEarnedAmount > 0
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-muted-foreground'
                  }`}
                >
                  Verified Reward
                </span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    xpEarnedAmount > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {xpEarnedAmount > 0 ? `+${xpEarnedAmount} Student XP` : '0 Student XP'}
                </span>
              </div>
            </div>

            {score === 0 ? (
              <p className="text-sm text-destructive font-medium">
                No XP awarded because all answers were incorrect. Retake the quiz to earn up to +25 XP.
              </p>
            ) : score < questions.length ? (
              <p className="text-sm text-muted-foreground font-medium">
                Earned +{xpEarnedAmount} XP (5 XP per correct answer). Retake to score higher and earn up to +25 XP!
              </p>
            ) : (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Perfect score! Maximum +25 Student XP awarded.
              </p>
            )}

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="font-semibold text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz (60s Timer)
              </Button>
            </div>
          </div>

          {/* Full Question-by-Question Results Review */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Question Review & Architectural Explanations</span>
              </h4>
              <span className="text-sm text-muted-foreground">
                Detailed Answer Breakdown
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userSelectedIdx = selectedAnswers[q.id];
                const isAnswered = userSelectedIdx !== undefined;
                const isCorrect = isAnswered && userSelectedIdx === q.correctIndex;

                return (
                  <Card
                    key={q.id}
                    className={`p-5 space-y-4 border ${
                      isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-muted text-foreground flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-foreground">
                          {q.topic}
                        </span>
                      </div>
                      <Badge
                        variant={isCorrect ? 'default' : 'secondary'}
                        className={`text-sm font-semibold ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isAnswered
                            ? 'bg-destructive/15 text-destructive border border-destructive/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isCorrect
                          ? '✓ Correct'
                          : isAnswered
                          ? '✗ Incorrect'
                          : '⏱ Not Answered'}
                      </Badge>
                    </div>

                    <p className="text-base font-semibold text-foreground">
                      {q.question}
                    </p>

                    {/* Options Review */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisUserChoice = userSelectedIdx === optIdx;
                        const isThisCorrect = optIdx === q.correctIndex;

                        let optionStyle = 'border-border/60 bg-muted/20 text-muted-foreground';

                        if (isThisCorrect) {
                          optionStyle =
                            'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold';
                        } else if (isThisUserChoice && !isThisCorrect) {
                          optionStyle =
                            'border-destructive bg-destructive/10 text-destructive font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-sm flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-sm">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5 text-sm font-semibold">
                              {isThisCorrect && (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Correct Option
                                </span>
                              )}
                              {isThisUserChoice && !isThisCorrect && (
                                <span className="text-destructive flex items-center gap-1">
                                  <XCircle className="w-4 h-4" />
                                  Your Choice
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Architectural Explanation */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-sm space-y-1">
                      <span className="font-bold text-foreground block">
                        Architectural Concept:
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
