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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground p-0 h-auto"
        >
          <Link href="/packs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Company Packs</span>
          </Link>
        </Button>

        {/* Live League Points Badge */}
        <Badge variant="outline" className="gap-1.5 text-sm font-mono font-bold text-primary px-3 py-1 bg-primary/10 border-primary/20">
          <Zap className="w-3.5 h-3.5" />
          <span>+{earnedPoints} XP Claimed in Pack</span>
        </Badge>
      </div>

      {/* Hero Pack Overview Card */}
      <Card className="rounded-xl border-border p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none" role="img" aria-label={pack.companyName}>
              {pack.badgeIcon}
            </span>
            <div>
              <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {pack.companyName} Curricula
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {pack.title}
              </h1>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {pack.description}
          </p>

          {/* Module Progress Checkpoint */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Activities Progress:</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={completedActivities.includes('bubble') ? 'default' : 'outline'}
                className="gap-1 px-2.5 py-0.5 font-mono text-sm"
              >
                {completedActivities.includes('bubble') && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>1. Bubble Game</span>
              </Badge>

              <Badge
                variant={completedActivities.includes('debugger') ? 'default' : 'outline'}
                className="gap-1 px-2.5 py-0.5 font-mono text-sm"
              >
                {completedActivities.includes('debugger') && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>2. Error Hunter</span>
              </Badge>

              <Badge
                variant={completedActivities.includes('simulator') ? 'default' : 'outline'}
                className="gap-1 px-2.5 py-0.5 font-mono text-sm"
              >
                {completedActivities.includes('simulator') && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>3. Decision Simulator</span>
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto no-scrollbar">
        <Button
          type="button"
          variant={activeTab === 'bubble' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('bubble')}
          className="gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
        >
          <Cpu className="w-4 h-4" />
          <span>1. Pipeline Bubble Game</span>
          {completedActivities.includes('bubble') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </Button>

        <Button
          type="button"
          variant={activeTab === 'debugger' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('debugger')}
          className="gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
        >
          <Bug className="w-4 h-4" />
          <span>2. Error Hunter (Debugger)</span>
          {completedActivities.includes('debugger') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </Button>

        <Button
          type="button"
          variant={activeTab === 'simulator' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('simulator')}
          className="gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
        >
          <Brain className="w-4 h-4" />
          <span>3. AI Decision Simulator</span>
          {completedActivities.includes('simulator') && <CheckCircle2 className="w-3.5 h-3.5" />}
        </Button>
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
      <Card className="p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chart-1/10 border border-chart-1/20 flex items-center justify-center text-chart-1 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Ready for the {pack.companyName} Capstone Interview?
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete all 3 activities to unlock the 3-question AI Voice Mock Interview for your report card.
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="link"
          className="gap-1.5 text-sm font-semibold text-primary p-0 h-auto shrink-0"
        >
          <Link href="/feed">
            <span>Daily Sparks Practice</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
