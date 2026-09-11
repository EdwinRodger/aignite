'use client';

import React from 'react';
import Link from 'next/link';
import { CandidateTalent } from '@/lib/recruiter-data';
import { FileText, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CandidateCardProps {
  candidate: CandidateTalent;
  onInvite: (candidate: CandidateTalent) => void;
  viewMode?: 'list' | 'grid';
}

const TIER_META: Record<string, { label: string; icon: string; badgeClass: string }> = {
  bronze: { label: 'Bronze AI Eng', icon: '🥉', badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold' },
  silver: { label: 'Silver AI Eng', icon: '🥈', badgeClass: 'bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300 font-semibold' },
  gold: { label: 'Gold AI Eng', icon: '🥇', badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold' },
  diamond: { label: 'LLM Master', icon: '💎', badgeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold' },
  architect: { label: 'AI Architect', icon: '👑', badgeClass: 'bg-primary/10 border-primary/30 text-primary font-bold shadow-xs' },
};

export function CandidateCard({
  candidate,
  onInvite,
  viewMode = 'list',
}: CandidateCardProps) {
  const tierMeta = TIER_META[candidate.leagueTier] || TIER_META.bronze;
  const rep = candidate.reportCard;

  const topBadges = candidate.verifiedBadges.slice(0, 3);
  const remainingBadgesCount = Math.max(0, candidate.verifiedBadges.length - 3);

  // List View (Default: spacious horizontal row on desktop, stacked cleanly on mobile)
  if (viewMode === 'list') {
    return (
      <Card className="p-5 sm:p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all rounded-2xl bg-card border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Column: Avatar + Basic Info + Headline + Badges */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar with initials */}
            <Link
              href={`/recruiter/dossier/${candidate.id}`}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs shrink-0 hover:opacity-90 transition-opacity ${candidate.avatarBg}`}
            >
              {candidate.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Link>

            <div className="space-y-2 flex-1 min-w-0">
              {/* Name, Verified check, League Tier Pill, Location */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/recruiter/dossier/${candidate.id}`}
                  className="flex items-center gap-1.5 text-left group"
                >
                  <h3 className="text-lg font-bold text-foreground font-sans group-hover:text-primary transition-colors">
                    {candidate.fullName}
                  </h3>
                  <span title="AIgnite Verified Identity" className="text-primary inline-flex">
                    <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                  </span>
                </Link>

                {/* Tier badge */}
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-semibold border ${tierMeta.badgeClass}`}
                >
                  <span>{tierMeta.icon}</span>
                  <span>{tierMeta.label}</span>
                </div>

                {/* Location & Institution */}
                <span className="text-sm font-mono text-muted-foreground flex items-center gap-1.5">
                  <span>{candidate.collegeOrCompany}</span>
                  <span>-</span>
                  <span>{candidate.region}</span>
                </span>
              </div>

              {/* Headline */}
              <p className="text-sm text-foreground/85 font-medium leading-relaxed line-clamp-1 sm:line-clamp-2">
                {candidate.headline}
              </p>

              {/* Top Badges & Streak */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {topBadges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="text-sm font-medium gap-1 rounded-xl bg-muted/40 border-border py-1"
                  >
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>{badge}</span>
                  </Badge>
                ))}
                {remainingBadgesCount > 0 && (
                  <Link
                    href={`/recruiter/dossier/${candidate.id}`}
                    className="text-sm font-mono font-medium text-primary hover:underline px-2 py-0.5 rounded-lg bg-primary/5 border border-primary/20 transition-colors"
                  >
                    +{remainingBadgesCount} more in dossier
                  </Link>
                )}

                {candidate.streakDays > 0 && (
                  <span className="text-sm font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 ml-auto sm:ml-2">
                    🔥 {candidate.streakDays}-Day Streak
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Key High-Signal Metrics + Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 shrink-0 lg:border-l lg:border-border/80 lg:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
            {/* Key Scores */}
            <div className="flex items-center gap-3">
              {/* Composite AI Defense Score */}
              <div className="text-right sm:text-left lg:text-right p-2.5 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm font-mono text-muted-foreground uppercase block">
                  AI Score
                </span>
                <span className="text-lg font-black font-mono text-foreground">
                  {rep.overallScore.toFixed(1)}{' '}
                  <span className="text-sm font-normal text-muted-foreground">/ 10</span>
                </span>
              </div>

              {/* ATS Score */}
              <div className="text-right sm:text-left lg:text-right p-2.5 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm font-mono text-muted-foreground uppercase block">
                  ATS Match
                </span>
                {candidate.resume.overallAtsScore > 0 ? (
                  <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {candidate.resume.overallAtsScore}%
                  </span>
                ) : (
                  <span className="text-sm font-medium font-mono text-muted-foreground">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                asChild
                variant="outline"
                className="flex-1 sm:flex-initial rounded-xl text-sm font-semibold gap-1.5"
              >
                <Link href={`/recruiter/dossier/${candidate.id}`}>
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect Dossier</span>
                </Link>
              </Button>
              <Button
                type="button"
                onClick={() => onInvite(candidate)}
                className="flex-1 sm:flex-initial rounded-xl text-sm font-bold shadow-xs gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invite Candidate</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View (Clean 2-column card with only essential information)
  return (
    <Card className="p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between rounded-2xl bg-card border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/recruiter/dossier/${candidate.id}`}
              className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 hover:opacity-90 transition-opacity ${candidate.avatarBg}`}
            >
              {candidate.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Link>
            <div>
              <Link
                href={`/recruiter/dossier/${candidate.id}`}
                className="flex items-center gap-1.5 text-left group"
              >
                <h3 className="text-base font-bold text-foreground font-sans group-hover:text-primary transition-colors">
                  {candidate.fullName}
                </h3>
                <span title="AIgnite Verified Identity" className="text-primary inline-flex">
                  <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                </span>
              </Link>
              <p className="text-sm font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span>{candidate.collegeOrCompany}</span>
                <span>-</span>
                <span>{candidate.region}</span>
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold border shrink-0 ${tierMeta.badgeClass}`}
          >
            <span>{tierMeta.icon}</span>
            <span>{tierMeta.label}</span>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm text-foreground/85 font-medium leading-relaxed line-clamp-2">
          {candidate.headline}
        </p>

        {/* Key High-Signal Metrics Box */}
        <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
          <div>
            <span className="text-sm font-mono text-muted-foreground uppercase block">
              Composite AI Score
            </span>
            <span className="text-base font-black font-mono text-foreground">
              {rep.overallScore.toFixed(1)}{' '}
              <span className="text-sm font-normal text-muted-foreground">/ 10</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-muted-foreground uppercase block">
              ATS Resume Match
            </span>
            {candidate.resume.overallAtsScore > 0 ? (
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                {candidate.resume.overallAtsScore}%
              </span>
            ) : (
              <span className="text-sm font-medium font-mono text-muted-foreground">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Top Badges */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1.5">
            {topBadges.map((b) => (
              <Badge
                key={b}
                variant="outline"
                className="text-sm font-medium gap-1 rounded-xl bg-muted/40 border-border py-1"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span>{b}</span>
              </Badge>
            ))}
            {remainingBadgesCount > 0 && (
              <Link
                href={`/recruiter/dossier/${candidate.id}`}
                className="text-sm font-mono font-medium text-primary hover:underline px-2 py-0.5 rounded-lg bg-primary/5 border border-primary/20 transition-colors"
              >
                +{remainingBadgesCount} more in dossier
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2.5">
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-xl text-sm font-semibold gap-1.5"
        >
          <Link href={`/recruiter/dossier/${candidate.id}`}>
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Inspect Dossier</span>
          </Link>
        </Button>
        <Button
          type="button"
          onClick={() => onInvite(candidate)}
          className="flex-1 rounded-xl text-sm font-bold shadow-xs gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Invite Candidate</span>
        </Button>
      </div>
    </Card>
  );
}
