'use client';

import React from 'react';
import { Clock, Zap, ArrowUpRight } from 'lucide-react';
import { LeagueTier, LEAGUE_TIERS } from '@/lib/league-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TierBadgeHeaderProps {
  currentTier: LeagueTier;
  userRank: number;
  timeRemaining: string;
  weeklyPoints: number;
}

export function TierBadgeHeader({
  currentTier,
  userRank,
  timeRemaining,
  weeklyPoints,
}: TierBadgeHeaderProps) {
  const isPromotionZone = userRank <= 6;

  return (
    <Card className="rounded-3xl border-border shadow-xl relative overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Decorative Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Main Division Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[1px] flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
              <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center">
                <span className="text-3xl select-none" role="img" aria-label={currentTier.name}>
                  {currentTier.badgeIcon}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Current Competitive Division
                </span>
                {isPromotionZone && (
                  <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-sm">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Promotion Zone (Rank #{userRank})</span>
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
                {currentTier.name}
              </h1>
            </div>
          </div>

          {/* Weekly Countdown & Score */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border flex flex-col">
              <span className="text-sm uppercase font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                <span>Cycle Ends</span>
              </span>
              <span className="text-sm font-bold text-foreground font-mono mt-0.5">
                {timeRemaining.split('(')[0].trim()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col">
              <span className="text-sm uppercase font-mono text-primary flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3" />
                <span>Your Weekly Score</span>
              </span>
              <span className="text-sm font-black text-primary font-mono mt-0.5">
                {weeklyPoints} XP
              </span>
            </div>
          </div>
        </div>

        {/* 5-Tier Division Pathway Visualizer */}
        <div className="space-y-2">
          <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            Ranked League Pathway:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {LEAGUE_TIERS.map((tier, idx) => {
              const isCurrent = tier.id === currentTier.id;

              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-primary/10 border-primary shadow-xs shadow-primary/10 ring-1 ring-primary/40'
                      : 'bg-muted/20 border-border opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{tier.badgeIcon}</span>
                    <span className="text-sm font-mono text-muted-foreground">Tier {idx + 1}</span>
                  </div>
                  <div className={`text-sm font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                    {tier.name.split(' ')[0]}
                  </div>
                  <span className="text-sm text-muted-foreground mt-0.5 truncate">
                    {tier.minPoints}+ XP Req
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
