'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CompanyPack } from '@/lib/learning-data';
import { BubbleGame } from './BubbleGame';
import { ErrorHunter } from './ErrorHunter';
import { DecisionSimulator } from './DecisionSimulator';
import {
  ArrowLeft,
  Cpu,
  Bug,
  Brain,
  Zap,
  CheckCircle2,
  Trophy,
  ChevronRight,
} from 'lucide-react';

interface PackModuleClientProps {
  pack: CompanyPack;
}

export function PackModuleClient({ pack }: PackModuleClientProps) {
  const [activeTab, setActiveTab] = useState<'bubble' | 'debugger' | 'simulator'>('bubble');
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const handleActivityCompleted = (activity: string, points: number) => {
    if (!completedActivities.includes(activity)) {
      setCompletedActivities((prev) => [...prev, activity]);
      setEarnedPoints((prev) => {
        const next = prev + points;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('aignite_student_points') || '0';
          localStorage.setItem('aignite_student_points', (parseInt(stored, 10) + points).toString());
        }
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to Packs Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/packs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Company Packs</span>
        </Link>

        {/* Live League Points Badge */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
          <Zap className="w-3.5 h-3.5" />
          <span>+{earnedPoints} XP Claimed in Pack</span>
        </div>
      </div>

      {/* Hero Pack Overview Card */}
      <div className={`rounded-2xl bg-card border ${pack.borderColor} p-6 shadow-xl relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${pack.accentColor} pointer-events-none opacity-40`} />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none" role="img" aria-label={pack.companyName}>
              {pack.badgeIcon}
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {pack.companyName} Curricula
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {pack.title}
              </h1>
            </div>
          </div>

          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {pack.description}
          </p>

          {/* Module Progress Checkpoint */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">Activities Progress:</span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] border ${
                  completedActivities.includes('bubble')
                    ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {completedActivities.includes('bubble') && <CheckCircle2 className="w-3 h-3" />}
                <span>1. Bubble Game</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] border ${
                  completedActivities.includes('debugger')
                    ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {completedActivities.includes('debugger') && <CheckCircle2 className="w-3 h-3" />}
                <span>2. Error Hunter</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] border ${
                  completedActivities.includes('simulator')
                    ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {completedActivities.includes('simulator') && <CheckCircle2 className="w-3 h-3" />}
                <span>3. Decision Simulator</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('bubble')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeTab === 'bubble'
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-muted-foreground hover:text-foreground border-border'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>1. Pipeline Bubble Game</span>
          {completedActivities.includes('bubble') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debugger')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeTab === 'debugger'
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-muted-foreground hover:text-foreground border-border'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>2. Error Hunter (Debugger)</span>
          {completedActivities.includes('debugger') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeTab === 'simulator'
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-muted-foreground hover:text-foreground border-border'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>3. AI Decision Simulator</span>
          {completedActivities.includes('simulator') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Tab Panel Content */}
      <div>
        {activeTab === 'bubble' && (
          <BubbleGame
            mission={pack.bubbleMission}
            packSlug={pack.slug}
            onCompleted={(pts) => handleActivityCompleted('bubble', pts)}
          />
        )}

        {activeTab === 'debugger' && (
          <ErrorHunter
            scenario={pack.errorHunterScenario}
            packSlug={pack.slug}
            onCompleted={(pts) => handleActivityCompleted('debugger', pts)}
          />
        )}

        {activeTab === 'simulator' && (
          <DecisionSimulator
            scenario={pack.decisionScenario}
            packSlug={pack.slug}
            onCompleted={(pts) => handleActivityCompleted('simulator', pts)}
          />
        )}
      </div>

      {/* Capstone Teaser Card (Next Step: Voice Mock Interview) */}
      <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chart-1/10 border border-chart-1/20 flex items-center justify-center text-chart-1 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Ready for the {pack.companyName} Capstone Interview?
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Complete all 3 activities to unlock the 3-question AI Voice Mock Interview for your report card.
            </p>
          </div>
        </div>

        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          <span>Daily Sparks Practice</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
