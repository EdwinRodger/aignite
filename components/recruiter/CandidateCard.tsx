'use client';

import React from 'react';
import { CandidateTalent } from '@/lib/recruiter-data';
import { Award, FileText, Send, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CandidateCardProps {
  candidate: CandidateTalent;
  onInspect: (candidate: CandidateTalent) => void;
  onInvite: (candidate: CandidateTalent) => void;
}

const TIER_META: Record<string, { label: string; icon: string; badgeClass: string }> = {
  bronze: { label: 'Bronze AI Eng', icon: '🥉', badgeClass: 'bg-amber-100/80 border-amber-300 text-amber-900' },
  silver: { label: 'Silver AI Eng', icon: '🥈', badgeClass: 'bg-slate-100 border-slate-300 text-slate-800' },
  gold: { label: 'Gold AI Eng', icon: '🥇', badgeClass: 'bg-amber-100/80 border-amber-300 text-amber-900' },
  diamond: { label: 'LLM Master', icon: '💎', badgeClass: 'bg-slate-100 border-slate-300 text-slate-800' },
  architect: { label: 'AI Architect', icon: '👑', badgeClass: 'bg-primary/10 border-primary/30 text-primary font-bold shadow-xs' },
};

export function CandidateCard({ candidate, onInspect, onInvite }: CandidateCardProps) {
  const tierMeta = TIER_META[candidate.leagueTier] || TIER_META.bronze;
  const rep = candidate.reportCard;

  return (
    <Card className="p-6 sm:p-7 shadow-sm hover:border-border/80 transition-all flex flex-col justify-between group rounded-xl">
      <CardContent className="p-0 space-y-4">
        {/* Header Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 ${candidate.avatarBg}`}
            >
              {candidate.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-foreground font-sans group-hover:text-primary transition-colors">
                  {candidate.fullName}
                </h3>
                <span title="AIgnite Verified Identity" className="text-primary inline-flex">
                  <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                </span>
              </div>
              <p className="text-sm font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span>{candidate.collegeOrCompany}</span>
                <span>-</span>
                <span>{candidate.region}</span>
              </p>
            </div>
          </div>

          {/* League Tier Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold border shrink-0 ${tierMeta.badgeClass}`}
          >
            <span>{tierMeta.icon}</span>
            <span>{tierMeta.label}</span>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm text-foreground/90 font-medium leading-relaxed line-clamp-2">
          {candidate.headline}
        </p>

        {/* Verified Badges Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Verified Skill Badges</span>
            </span>
            <span className="text-primary font-bold">{candidate.verifiedBadges.length} Earned</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.verifiedBadges.map((b) => (
              <Badge
                key={b}
                variant="outline"
                className="text-sm font-medium gap-1 rounded-xl shadow-2xs py-1"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span>{b}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* 5-Axis Score Preview Card */}
        <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-chart-5" />
              <span>AI Speech & Systems Report Card</span>
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 font-mono font-black">
                {rep.overallScore.toFixed(1)} / 10
              </Badge>
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10 font-mono font-bold">
                ATS: {candidate.resume.overallAtsScore}%
              </Badge>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { label: 'Knowledge', val: rep.knowledgeScore },
              { label: 'Confidence', val: rep.confidenceScore },
              { label: 'Communication', val: rep.communicationScore },
              { label: 'Examples', val: rep.examplesScore },
              { label: 'Industry Fit', val: rep.industryLevelScore },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <Progress value={(m.val / 10) * 100} className="h-1.5" />
                <div className="text-sm font-mono text-muted-foreground truncate" title={m.label}>
                  {m.label.slice(0, 4)}: {m.val.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Answer Excerpt Preview */}
        <div className="text-sm text-muted-foreground bg-card p-2.5 rounded-xl border border-border/60 italic line-clamp-2 font-serif">
          {rep.recentModelAnswerExcerpt}
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="p-0 pt-5 mt-4 border-t border-border flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => onInspect(candidate)}
          className="flex-1 rounded-xl text-sm font-semibold gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Inspect Dossier</span>
        </Button>
        <Button
          onClick={() => onInvite(candidate)}
          className="flex-1 rounded-xl text-sm font-bold shadow-xs gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Invite Candidate</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
