'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AI_CAREER_ROADMAP, RoadmapStage } from '@/lib/roadmap-data';
import {
  CheckCircle2,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  Mic,
  Trophy,
  Lock,
} from 'lucide-react';

export function RoadmapNodeTree() {
  const [expandedStages, setExpandedStages] = useState<string[]>([
    'stage-4',
    'stage-5',
    'stage-6',
  ]);

  const toggleStage = (stageId: string) => {
    if (expandedStages.includes(stageId)) {
      setExpandedStages(expandedStages.filter((id) => id !== stageId));
    } else {
      setExpandedStages([...expandedStages, stageId]);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-8">
      {/* Central Guide Line */}
      <div className="absolute left-6 sm:left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-border pointer-events-none hidden sm:block" />

      {AI_CAREER_ROADMAP.map((stage: RoadmapStage) => {
        const isExpanded = expandedStages.includes(stage.id);
        const isCompleted = stage.status === 'completed';
        const isInProgress = stage.status === 'in-progress';

        return (
          <div key={stage.id} className="relative sm:pl-20 group">
            {/* Stage Milestone Indicator Icon on the line */}
            <div
              className={`hidden sm:flex absolute left-4.5 -translate-x-1/2 top-7 w-7 h-7 rounded-full items-center justify-center font-bold text-xs shadow-md border-2 z-10 transition-transform group-hover:scale-110 ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : isInProgress
                  ? 'bg-primary border-primary/80 text-primary-foreground animate-pulse'
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isInProgress ? (
                <Sparkles className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Stage Card */}
            <div
              className={`rounded-3xl bg-card border transition-all overflow-hidden shadow-lg shadow-black/5 ${
                isInProgress
                  ? 'border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/20'
                  : isCompleted
                  ? 'border-emerald-500/30'
                  : 'border-border'
              }`}
            >
              {/* Card Header Banner */}
              <div
                onClick={() => toggleStage(stage.id)}
                className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Stage 0{stage.stageNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : isInProgress
                          ? 'bg-primary/15 border-primary/30 text-primary font-bold animate-pulse'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? '✓ Completed & Verified' : isInProgress ? '● Active Focus Track' : 'Locked Track'}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>{stage.estimatedHours}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight">
                      {stage.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {stage.headline}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Badge Pill */}
                  <div className="px-3 py-1.5 rounded-xl bg-muted border border-border flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    <span>{stage.badgeAwarded.name}</span>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Topic Details */}
              {isExpanded && (
                <div className="px-6 sm:px-8 pb-7 pt-2 border-t border-border/80 bg-muted/20 space-y-6">
                  {/* Prerequisites Bar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-muted-foreground">Prerequisites:</span>
                    {stage.prerequisites.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-card border border-border text-foreground text-[11px]"
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  {/* Topics Grid */}
                  <div className="space-y-3.5">
                    {stage.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs group/topic"
                      >
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-sm font-bold text-foreground font-sans group-hover/topic:text-primary transition-colors">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {topic.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {topic.keyKeywords.map((k) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        {topic.interactiveModuleUrl && (
                          <Link
                            href={topic.interactiveModuleUrl}
                            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border border-border text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5 shrink-0"
                          >
                            {topic.interactiveType === 'Company Pack' && <Layers className="w-3.5 h-3.5" />}
                            {topic.interactiveType === 'Pipeline Game' && <Zap className="w-3.5 h-3.5" />}
                            {topic.interactiveType === 'Voice Coach' && <Mic className="w-3.5 h-3.5" />}
                            {topic.interactiveType === 'League Challenge' && <Trophy className="w-3.5 h-3.5" />}
                            <span>Practice on AIgnite</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
