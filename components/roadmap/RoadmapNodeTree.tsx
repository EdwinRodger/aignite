'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AI_CAREER_ROADMAP, RoadmapStage } from '@/lib/roadmap-data';
import {
  Check,
  Clock,
  Award,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  Mic,
  Trophy,
  Lock,
  Binary,
  Cpu,
  Flame,
  Database,
  Server,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'stage-1': Binary,
  'stage-2': Cpu,
  'stage-3': Flame,
  'stage-4': Sparkles,
  'stage-5': Database,
  'stage-6': Server,
};

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
    <div className="relative max-w-4xl mx-auto">
      {/* Central Guide Spine */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border pointer-events-none hidden sm:block" />

      <div className="space-y-6">
        {AI_CAREER_ROADMAP.map((stage: RoadmapStage) => {
          const isExpanded = expandedStages.includes(stage.id);
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in-progress';
          const StageIcon = STAGE_ICONS[stage.id] || Sparkles;

          return (
            <div key={stage.id} className="relative sm:pl-16 group">
              {/* Horizontal connector arm from spine to card */}
              <div className="hidden sm:block absolute left-6 top-9 w-10 h-px bg-border pointer-events-none" />

              {/* Stage Milestone Indicator Icon on the timeline spine */}
              <div
                className={cn(
                  'hidden sm:flex absolute left-6 -translate-x-1/2 top-5 w-8 h-8 rounded-full items-center justify-center font-bold text-sm shadow-xs z-10 transition-transform group-hover:scale-105',
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isInProgress
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                    : 'bg-card border border-border text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isInProgress ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Stage Card */}
              <Card
                className={cn(
                  'rounded-2xl border transition-all overflow-hidden shadow-xs bg-card',
                  isInProgress
                    ? 'border-primary/40 ring-1 ring-primary/15'
                    : 'border-border hover:border-border/80'
                )}
              >
                {/* Card Header Banner */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleStage(stage.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleStage(stage.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/25 transition-colors select-none"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <StageIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          Stage 0{stage.stageNumber}
                        </span>

                        <Badge
                          variant="outline"
                          className={cn(
                            'text-sm font-mono font-medium px-2 py-0.5',
                            isCompleted && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                            isInProgress && 'bg-primary/10 text-primary border-primary/20',
                            !isCompleted && !isInProgress && 'text-muted-foreground'
                          )}
                        >
                          {isCompleted ? '✓ Completed & Verified' : isInProgress ? '● Active Focus Track' : 'Locked Track'}
                        </Badge>

                        <span className="text-sm text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{stage.estimatedHours}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-foreground font-sans tracking-tight">
                        {stage.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {stage.headline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Badge Pill */}
                    <Badge variant="outline" className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold text-foreground bg-background">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      <span>{stage.badgeAwarded.name}</span>
                    </Badge>

                    <div className="p-1 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Topic Details */}
                {isExpanded && (
                  <CardContent className="px-5 sm:px-6 pb-6 pt-4 border-t border-border/70 space-y-4">
                    {/* Prerequisites Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-sm font-mono pb-3 border-b border-border/60">
                      <span className="text-muted-foreground font-medium">Prerequisites:</span>
                      {stage.prerequisites.map((req, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-sm font-normal bg-muted/30"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>

                    {/* Topics List with separator lines */}
                    <div className="divide-y divide-border/60">
                      {stage.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/topic"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <h4 className="text-base font-bold text-foreground font-sans group-hover/topic:text-primary transition-colors">
                              {topic.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {topic.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {topic.keyKeywords.map((k) => (
                                <Badge
                                  key={k}
                                  variant="secondary"
                                  className="text-sm font-mono text-muted-foreground font-normal bg-muted/60"
                                >
                                  {k}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {topic.interactiveModuleUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="gap-1.5 shrink-0 text-sm font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all self-start sm:self-center"
                            >
                              <Link href={topic.interactiveModuleUrl}>
                                {topic.interactiveType === 'Company Pack' && <Layers className="w-4 h-4" />}
                                {topic.interactiveType === 'Pipeline Game' && <Zap className="w-4 h-4" />}
                                {topic.interactiveType === 'Voice Coach' && <Mic className="w-4 h-4" />}
                                {topic.interactiveType === 'League Challenge' && <Trophy className="w-4 h-4" />}
                                <span>Practice on AIgnite</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
