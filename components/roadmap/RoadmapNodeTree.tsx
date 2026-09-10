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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      <div className="absolute left-6 sm:left-8 top-10 bottom-10 w-0.5 bg-border pointer-events-none hidden sm:block" />

      {AI_CAREER_ROADMAP.map((stage: RoadmapStage) => {
        const isExpanded = expandedStages.includes(stage.id);
        const isCompleted = stage.status === 'completed';
        const isInProgress = stage.status === 'in-progress';

        return (
          <div key={stage.id} className="relative sm:pl-20 group">
            {/* Stage Milestone Indicator Icon on the line */}
            <div
              className={`hidden sm:flex absolute left-4.5 -translate-x-1/2 top-7 w-7 h-7 rounded-full items-center justify-center font-bold text-sm shadow-xs border-2 z-10 transition-transform group-hover:scale-110 ${
                isCompleted
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : isInProgress
                  ? 'bg-primary border-primary/80 text-primary-foreground'
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isInProgress ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>

            {/* Stage Card */}
            <Card
              className={`rounded-xl border transition-all overflow-hidden shadow-xs ${
                isInProgress
                  ? 'border-primary/50'
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
                    <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Stage 0{stage.stageNumber}
                    </span>
                    <Badge
                      variant={
                        isCompleted
                          ? 'success'
                          : isInProgress
                          ? 'default'
                          : 'outline'
                      }
                      className="text-sm font-mono font-bold"
                    >
                      {isCompleted ? '✓ Completed & Verified' : isInProgress ? '● Active Focus Track' : 'Locked Track'}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{stage.estimatedHours}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight">
                      {stage.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stage.headline}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Badge Pill */}
                  <Badge variant="outline" className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    <span>{stage.badgeAwarded.name}</span>
                  </Badge>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Expanded Topic Details */}
              {isExpanded && (
                <CardContent className="px-6 sm:px-8 pb-7 pt-2 border-t border-border/80 bg-muted/20 space-y-6">
                  {/* Prerequisites Bar */}
                  <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                    <span className="text-muted-foreground">Prerequisites:</span>
                    {stage.prerequisites.map((req, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-sm font-normal"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>

                  {/* Topics Grid */}
                  <div className="space-y-3.5">
                    {stage.topics.map((topic) => (
                      <Card
                        key={topic.id}
                        className="p-4 sm:p-5 rounded-2xl border-border/80 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs group/topic"
                      >
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-sm font-bold text-foreground font-sans group-hover/topic:text-primary transition-colors">
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
                                className="text-sm font-mono text-muted-foreground font-normal"
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
                            className="gap-1.5 shrink-0 text-sm font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Link href={topic.interactiveModuleUrl}>
                              {topic.interactiveType === 'Company Pack' && <Layers className="w-4 h-4" />}
                              {topic.interactiveType === 'Pipeline Game' && <Zap className="w-4 h-4" />}
                              {topic.interactiveType === 'Voice Coach' && <Mic className="w-4 h-4" />}
                              {topic.interactiveType === 'League Challenge' && <Trophy className="w-4 h-4" />}
                              <span>Practice on AIgnite</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
