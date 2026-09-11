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
    <Card className="rounded-2xl sm:rounded-3xl border-border shadow-md">
      <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Main Division Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-xs shrink-0">
              <span className="text-2xl sm:text-3xl select-none" role="img" aria-label={currentTier.name}>
                {currentTier.badgeIcon}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Current Competitive Division
                </span>
                {isPromotionZone && (
                  <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-sm font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Promotion Zone (Rank #{userRank})</span>
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight truncate">
                {currentTier.name}
              </h1>
            </div>
          </div>

          {/* Weekly Countdown & Score */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border flex flex-col justify-center">
              <span className="text-sm uppercase font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                <span>Cycle Ends</span>
              </span>
              <span className="text-sm font-bold text-foreground font-mono mt-0.5 truncate">
                {timeRemaining.split('(')[0].trim()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col justify-center">
              <span className="text-sm uppercase font-mono text-primary flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3" />
                <span>Weekly XP</span>
              </span>
              <span className="text-sm font-black text-primary font-mono mt-0.5 truncate">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {LEAGUE_TIERS.map((tier, idx) => {
              const isCurrent = tier.id === currentTier.id;
              const isLastOnMobile = idx === 4;

              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isCurrent
                      ? 'bg-primary/10 border-primary shadow-xs'
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
