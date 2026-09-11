'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Code2,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { ChallengeModule } from '@/lib/challenges/modules-data';

interface ModuleGuideContentProps {
  module: ChallengeModule;
  activeChallengeId: string;
  onSelectChallenge: (challengeId: string) => void;
}

export function ModuleGuideContent({
  module,
  activeChallengeId,
  onSelectChallenge,
}: ModuleGuideContentProps) {
  return (
    <div className="space-y-6">
      {/* Module Overview Card */}
      <Card className="p-6 border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground font-sans">
              Curriculum Guide - {module.shortTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              Master the foundational concepts alongside hands-on interactive challenges.
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed">
          {module.overview}
        </p>

        {/* Key Topics Badges */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-sm font-semibold text-muted-foreground block">
            Core Learning Objectives
          </span>
          <div className="flex flex-wrap gap-2">
            {module.keyTopics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-sm font-medium py-1 px-2.5 bg-muted/60 text-foreground border-border"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-6">
        {module.guideSections.map((sec, idx) => (
          <Card
            key={sec.id}
            id={sec.id}
            className="p-6 border-border bg-card shadow-xs space-y-4 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground font-sans">
                  {sec.title}
                </h3>
              </div>
              <Badge variant="outline" className="text-sm font-medium w-fit">
                {sec.badge}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {sec.summary}
            </p>

            {/* Key Takeaways */}
            <div className="space-y-2 rounded-xl bg-muted/30 p-4 border border-border/50">
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Key Architectural Rules
              </span>
              <ul className="space-y-2">
                {sec.keyPoints.map((point, pIdx) => (
                  <li key={pIdx} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Code Snippet */}
            {sec.codeSnippet && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span>Reference Snippet ({sec.codeSnippet.language})</span>
                </div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-sm text-slate-200 overflow-x-auto">
                  <pre className="text-sm leading-relaxed whitespace-pre font-mono">
                    {sec.codeSnippet.code}
                  </pre>
                </div>
              </div>
            )}

            {/* Pitfall Warning */}
            {sec.pitfallWarning && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-sm text-foreground flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{sec.pitfallWarning}</span>
              </div>
            )}

            {/* Target Challenge Jump Link */}
            {sec.targetChallengeId && (
              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <span className="text-sm text-muted-foreground">
                  Associated Challenge:
                </span>
                <Button
                  variant={activeChallengeId === sec.targetChallengeId ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelectChallenge(sec.targetChallengeId!)}
                  className="font-bold text-sm gap-1.5"
                >
                  <span>{sec.targetChallengeName || 'Launch Challenge'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
