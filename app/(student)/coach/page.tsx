'use client';

import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from '@/components/coach/VoiceRecorder';
import { ReportCardModal } from '@/components/coach/ReportCardModal';
import { DAILY_COACH_QUESTIONS, CoachQuestion, CoachEvaluationReport } from '@/lib/coach-data';
import {
  getCoachQuestionsAction,
  getCoachStreakAction,
  evaluateCoachAnswerAction,
} from '@/app/actions/coach';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Mic,
  Flame,
  Zap,
  Brain,
  HelpCircle,
  Calendar,
  Clock,
  Info,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function CoachPage() {
  const [questions, setQuestions] = useState<CoachQuestion[]>(DAILY_COACH_QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState<CoachQuestion>(DAILY_COACH_QUESTIONS[0]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<CoachEvaluationReport | null>(null);
  const [streakDays, setStreakDays] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isScoringGuideOpen, setIsScoringGuideOpen] = useState(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync questions and flame streak directly from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseData() {
      try {
        const [streakData, questionsData] = await Promise.all([
          getCoachStreakAction(),
          getCoachQuestionsAction(),
        ]);

        if (isMounted) {
          if (streakData) {
            setStreakDays(streakData.currentStreak);
          }
          if (questionsData && questionsData.length > 0) {
            setQuestions(questionsData);
            setSelectedQuestion(questionsData[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load coach data from Supabase:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitAnswer = async (transcript: string, durationSeconds: number) => {
    setIsEvaluating(true);
    setErrorMessage(null);

    const result = await evaluateCoachAnswerAction(selectedQuestion.id, transcript, durationSeconds);
    setIsEvaluating(false);

    if (result.success && result.report) {
      setEvaluationReport(result.report);

      // Directly update streak from Supabase result
      if (result.updatedStreak !== undefined) {
        setStreakDays(result.updatedStreak);
      } else {
        const updated = await getCoachStreakAction();
        setStreakDays(updated.currentStreak);
      }
    } else {
      setErrorMessage(result.error || 'Evaluation failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-sm font-bold bg-primary/10 text-primary border-primary/20"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Daily AI Voice Coach</span>
            </Badge>

            <span className="text-sm text-muted-foreground font-mono">
              Oral Defense &amp; Speech Metrics
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Audio-Based AI Mock Interview
          </h1>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Practice answering real AI systems interview questions out loud. Receive real-time speech cadence, filler detection, and 5-axis automated scoring to maintain your daily streak.
          </p>

          {/* Action Modals Triggered Under Description */}
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            {/* 1. AI Oral Scoring Dimensions Modal Button */}
            <Dialog open={isScoringGuideOpen} onOpenChange={setIsScoringGuideOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm font-semibold gap-1.5 rounded-lg border-border/80 text-foreground hover:bg-muted"
                >
                  <Info className="w-4 h-4 text-primary" />
                  <span>AI Oral Scoring Dimensions</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>AI Oral Scoring Dimensions</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Every verbal answer is analyzed across 5 core dimensions to provide actionable feedback:
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div className="font-bold text-foreground flex items-center justify-between mb-1">
                      <span>1. Knowledge Depth</span>
                      <Badge variant="secondary" className="font-mono text-sm">35% Weight</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Accuracy of domain mechanisms, mathematical formulations, and engineering tradeoffs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div className="font-bold text-foreground flex items-center justify-between mb-1">
                      <span>2. Industry Readiness</span>
                      <Badge variant="secondary" className="font-mono text-sm">20% Weight</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Awareness of real-world production constraints, scalability limits, and deployment reality.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div className="font-bold text-foreground flex items-center justify-between mb-1">
                      <span>3. Communication &amp; Structure</span>
                      <Badge variant="secondary" className="font-mono text-sm">15% Weight</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Concise, organized delivery using standard patterns (STAR, definition first, then tradeoffs).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div className="font-bold text-foreground flex items-center justify-between mb-1">
                      <span>4. Cadence &amp; Confidence</span>
                      <Badge variant="secondary" className="font-mono text-sm">15% Weight</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Speech rate in the optimal 110-160 WPM window with minimal conversational filler words.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div className="font-bold text-foreground flex items-center justify-between mb-1">
                      <span>5. Concrete Examples</span>
                      <Badge variant="secondary" className="font-mono text-sm">15% Weight</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use of real metric examples, framework libraries, and operational failure modes.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* 2. Question Bank Modal Button (Moved from sidebar) */}
            <Dialog open={isQuestionBankOpen} onOpenChange={setIsQuestionBankOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm font-semibold gap-1.5 rounded-lg border-border/80 text-foreground hover:bg-muted"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Browse Question Bank ({questions.length})</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Voice Interview Question Bank</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Select a question to practice out loud. Questions are curated for beginner to moderate interview readiness:
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2.5 pt-2">
                  {questions.map((q) => {
                    const isSelected = selectedQuestion.id === q.id;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuestion(q);
                          setEvaluationReport(null);
                          setErrorMessage(null);
                          setIsQuestionBankOpen(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30 bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <Badge variant="secondary" className="text-sm font-mono uppercase">
                            {q.topic}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-sm font-mono font-semibold ${
                              q.difficulty === 'Beginner'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {q.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm font-bold leading-snug text-foreground">
                          {q.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {q.questionText}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Delivery Tips Section Inside Modal */}
                <div className="mt-4 p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Quick Delivery Tips:</span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• State the primary definition or metric tradeoff in your first sentence.</li>
                    <li>• Keep a steady speaking cadence between 110 and 160 words per minute.</li>
                    <li>• Replace conversational filler sounds with brief 1-second strategic pauses.</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Daily Flame Streak Badge - Synced directly with Supabase */}
        <Card className="p-3.5 flex items-center gap-3 shrink-0 shadow-sm border-border">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground font-mono">
              {isLoading ? '...' : `${streakDays} Day Flame Streak`}
            </div>
            <div className="text-sm text-primary font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>+25 XP per spoken answer</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Single-Column Practice Layout (No distracting sidebar) */}
      <div className="space-y-6">
        {/* Active Question Card */}
        <Card className="p-6 sm:p-8 shadow-sm space-y-5 border-border">
          {/* Question Meta Badges */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-sm font-bold font-mono">
                {selectedQuestion.topic}
              </Badge>
              <Badge
                variant="outline"
                className="text-sm font-mono bg-primary/10 text-primary border-primary/20 font-semibold"
              >
                {selectedQuestion.track}
              </Badge>
              <Badge
                variant="outline"
                className={`text-sm font-mono font-semibold ${
                  selectedQuestion.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
              >
                {selectedQuestion.difficulty} Level
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-mono text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Target: {selectedQuestion.estimatedSpeakingTime}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsQuestionBankOpen(true)}
                className="h-7 text-sm font-medium gap-1 text-primary hover:text-primary/80 p-0"
              >
                <span>Change Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
            {selectedQuestion.questionText}
          </h2>

          {/* Context Hint Callout */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-3 text-sm">
            <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">Interview Prompt Hint:</span>
              <span className="text-muted-foreground leading-relaxed font-sans">
                {selectedQuestion.contextHint}
              </span>
            </div>
          </div>

          {/* Expected Key Concepts */}
          <div className="space-y-2 pt-1">
            <span className="text-sm uppercase font-mono tracking-wider text-muted-foreground block font-semibold">
              Key Concepts Expected in Answer:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedQuestion.canonicalKeyPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Error Feedback if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {/* Live Audio Recorder Workspace */}
        <VoiceRecorder
          onSubmitAnswer={handleSubmitAnswer}
          isEvaluating={isEvaluating}
        />
      </div>

      {/* AI Report Card Modal on Evaluation Completion */}
      {evaluationReport && (
        <ReportCardModal
          report={evaluationReport}
          onClose={() => setEvaluationReport(null)}
          onContinue={() => setEvaluationReport(null)}
        />
      )}
    </div>
  );
}
