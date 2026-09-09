'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { VoiceRecorder } from '@/components/coach/VoiceRecorder';
import { ReportCardModal } from '@/components/coach/ReportCardModal';
import { DAILY_COACH_QUESTIONS, CoachQuestion, CoachEvaluationReport } from '@/lib/coach-data';
import { evaluateCoachAnswerAction } from '@/app/actions/coach';
import {
  Mic,
  Flame,
  Zap,
  Brain,
  HelpCircle,
  Calendar,
  Clock,
} from 'lucide-react';

export default function CoachPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<CoachQuestion>(DAILY_COACH_QUESTIONS[0]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<CoachEvaluationReport | null>(null);
  const [streakDays, setStreakDays] = useState(4);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitAnswer = async (transcript: string, durationSeconds: number) => {
    setIsEvaluating(true);
    setErrorMessage(null);

    const result = await evaluateCoachAnswerAction(selectedQuestion.id, transcript, durationSeconds);
    setIsEvaluating(false);

    if (result.success && result.report) {
      setEvaluationReport(result.report);

      // Increment streak in state & localStorage
      setStreakDays((prev) => {
        const next = prev + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('aignite_student_streak', next.toString());
          const currentPts = parseInt(localStorage.getItem('aignite_student_points') || '25', 10);
          localStorage.setItem('aignite_student_points', (currentPts + 25).toString());
        }
        return next;
      });
    } else {
      setErrorMessage(result.error || 'Evaluation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-12">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20">
                <Mic className="w-3.5 h-3.5" />
                <span>Daily Voice Coach</span>
              </span>
              <span className="text-sm text-muted-foreground font-mono">Morning Habit • 8:00 AM POTD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Audio-Based AI Mock Interview
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
              Maintain your daily speaking streak. Practice answering real staff-level AI systems interview questions out loud, and receive instant 5-axis automated scoring with feedback.
            </p>
          </div>

          {/* Daily Streak Maintenance Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shrink-0 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground font-mono">
                {streakDays} Day Flame Streak
              </div>
              <div className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>+25 XP per daily answer</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interview Practice Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Question of the Day Card */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Question Meta Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border">
                    {selectedQuestion.topic}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {selectedQuestion.track}
                  </span>
                  <span className="text-sm text-muted-foreground">• {selectedQuestion.difficulty}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Target: {selectedQuestion.estimatedSpeakingTime}</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
                {selectedQuestion.questionText}
              </h2>

              {/* Context Hint Callout */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-2.5 text-sm">
                <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Architectural Prompt Hint:</span>
                  <span className="text-muted-foreground leading-relaxed font-sans">{selectedQuestion.contextHint}</span>
                </div>
              </div>

              {/* Expected Key Concepts Expected */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                  Key Production Concepts Expected by Evaluator:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQuestion.canonicalKeyPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-muted/30 border border-border text-[11px] text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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

          {/* Sidebar: Question Rotation & Past Assessments */}
          <aside aria-label="Question selector" className="lg:col-span-4 space-y-5">
            {/* Daily Questions Selector */}
            <div className="rounded-2xl bg-card border border-border p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Today & Past Coach Questions</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Choose an interview challenge to practice:
              </p>

              <div className="space-y-2">
                {DAILY_COACH_QUESTIONS.map((q) => {
                  const isSelected = selectedQuestion.id === q.id;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setEvaluationReport(null);
                        setErrorMessage(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-foreground font-semibold ring-1 ring-primary/30'
                          : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-foreground border border-border">
                          {q.topic}
                        </span>
                        <span className="text-[10px] font-mono text-primary font-bold">
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                        {q.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-Axis Scoring Criteria Card */}
            <div className="rounded-2xl bg-card border border-border p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <Brain className="w-4 h-4 text-primary" />
                <span>AI Scoring Dimensions</span>
              </div>
              <ul className="space-y-2 text-[11px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary font-mono">1.</span>
                  <span><strong>Knowledge Depth (35%)</strong>: Accuracy of hardware, algorithmic mechanisms, and loss functions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary font-mono">2.</span>
                  <span><strong>Industry Readiness (20%)</strong>: Alignment with senior/staff engineer hiring bars at top labs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary font-mono">3.</span>
                  <span><strong>Communication (15%)</strong>: Concise, structured delivery without rambles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary font-mono">4.</span>
                  <span><strong>Confidence & Pace (15%)</strong>: Natural cadence (120–150 WPM) with minimal filler words.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary font-mono">5.</span>
                  <span><strong>Concrete Examples (15%)</strong>: Real metrics, GPU microarchitectures, and frameworks.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* AI Report Card Modal on Evaluation Completion */}
      {evaluationReport && (
        <ReportCardModal
          report={evaluationReport}
          onClose={() => setEvaluationReport(null)}
          onContinue={() => setEvaluationReport(null)}
        />
      )}

      <MobileTabBar />
    </div>
  );
}
