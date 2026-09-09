'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Gauge,
  Clock,
  MessageSquare,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Share2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoachEvaluationReport } from '@/lib/coach-data';

interface ReportCardModalProps {
  report: CoachEvaluationReport;
  onClose: () => void;
  onContinue: () => void;
}

export function ReportCardModal({ report, onClose, onContinue }: ReportCardModalProps) {
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (report.scores.compositeScore >= 7.0) {
      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F97316', '#10B981', '#3B82F6', '#EC4899'],
          });
        }
      } catch {
        // Fallback for restricted canvas
      }
    }
  }, [report.scores.compositeScore]);

  const getTierLabel = (score: number) => {
    if (score >= 8.5) return { label: 'Principal / Staff Level', color: 'text-primary bg-primary/10 border-primary/30' };
    if (score >= 7.0) return { label: 'Senior AI Engineer Level', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 5.5) return { label: 'Mid-Level AI Engineer', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Associate / Junior Candidate', color: 'text-muted-foreground bg-muted border-border' };
  };

  const tier = getTierLabel(report.scores.compositeScore);

  const handleShare = async () => {
    const text = `🔥 I just scored ${report.scores.compositeScore}/10 on AIgnite's Daily Voice Interview Coach! Testing hands-on AI systems readiness.`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report card"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Composite Score & Tier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[1px] flex items-center justify-center shadow-lg shadow-primary/20">
              <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                AIgnite Speech Assessment
              </span>
              <h2 id="report-card-title" className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                AI Interview Report Card
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-primary font-mono leading-none">
                {report.scores.compositeScore}
                <span className="text-xs text-muted-foreground font-sans font-normal"> / 10.0</span>
              </div>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${tier.color}`}>
                {tier.label}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Axis Score Breakdown Grid */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            5-Axis Performance Breakdown:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Knowledge Depth', score: report.scores.knowledgeScore, weight: '35% weight' },
              { label: 'Industry Readiness', score: report.scores.industryReadinessScore, weight: '20% weight' },
              { label: 'Communication & Structure', score: report.scores.communicationScore, weight: '15% weight' },
              { label: 'Confidence & Cadence', score: report.scores.confidenceScore, weight: '15% weight' },
              { label: 'Production Examples', score: report.scores.examplesScore, weight: '15% weight' },
            ].map((axis, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{axis.label}</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="font-bold text-foreground">{axis.score}</span>
                    <span className="text-[10px] text-muted-foreground">/10</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${axis.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speech Telemetry Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/50 border border-border font-mono text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Gauge className="w-3 h-3 text-primary" />
              <span>Speaking Pace</span>
            </span>
            <span className="font-bold text-foreground mt-0.5">
              {report.speechMetrics.wordsPerMinute} WPM
            </span>
            <span className="text-[10px] text-muted-foreground">({report.speechMetrics.paceRating})</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-secondary-foreground" />
              <span>Duration</span>
            </span>
            <span className="font-bold text-foreground mt-0.5">
              {report.durationSeconds}s
            </span>
            <span className="text-[10px] text-muted-foreground">(target 45–90s)</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-chart-4" />
              <span>Filler Words</span>
            </span>
            <span className="font-bold text-foreground mt-0.5">
              {report.speechMetrics.fillerCount} detected
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {report.speechMetrics.fillerWordsDetected.length > 0
                ? report.speechMetrics.fillerWordsDetected.join(', ')
                : 'None! Great flow'}
            </span>
          </div>
        </div>

        {/* Strengths & Improvement Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </div>
            <ul className="space-y-1 text-[11px] text-muted-foreground leading-relaxed">
              {report.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Areas for Revision</span>
            </div>
            <ul className="space-y-1 text-[11px] text-muted-foreground leading-relaxed">
              {report.areasForImprovement.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expandable Model Answer Drawer */}
        <div className="rounded-xl border border-border/80 overflow-hidden bg-muted/20">
          <button
            type="button"
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Principal Engineer Model Answer (How Google/NVIDIA Architects Frame It)</span>
            </div>
            {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showModelAnswer && (
            <div className="p-4 border-t border-border bg-card text-xs text-foreground/90 leading-relaxed font-sans animate-in fade-in">
              <p>{report.principalModelAnswer}</p>
            </div>
          )}
        </div>

        {/* Daily Streak Maintenance Callout */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Daily Habit Maintained! +25 League XP Claimed
              </span>
              <span className="text-[11px] text-muted-foreground">
                Your daily interview streak is active. Keep returning daily at 8:00 AM.
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono font-bold text-primary text-xs">
            <Zap className="w-4 h-4" />
            <span>+25 XP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-primary" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Report Copied!' : 'Share Score'}</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            Done Practicing
          </button>
        </div>
      </div>
    </div>
  );
}
