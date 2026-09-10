'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '@/lib/league-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgesGridProps {
  badges: AchievementBadge[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  return (
    <Card className="w-full rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-3 p-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Verified Achievement Badges</CardTitle>
            <span className="text-sm text-muted-foreground font-mono">
              Displayed on public profile & verified for recruiters
            </span>
          </div>
        </div>

        <Badge variant="outline" className="text-sm font-mono font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border-primary/20">
          {badges.filter((b) => b.isUnlocked).length}/{badges.length} Claimed
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-card border-border shadow-xs hover:border-primary/40'
                  : 'bg-muted/20 border-border opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl select-none" role="img" aria-label={badge.name}>
                    {badge.icon}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={
                        badge.recruiterValue === 'Elite'
                          ? 'default'
                          : badge.recruiterValue === 'Distinguished'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-sm font-mono font-bold px-2 py-0.5"
                    >
                      {badge.recruiterValue}
                    </Badge>

                    {badge.isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-foreground leading-snug">
                  {badge.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-sm font-mono">
                <span className="text-muted-foreground truncate max-w-[130px]">
                  {badge.isUnlocked ? `Earned ${badge.unlockedAt}` : badge.requirement}
                </span>
                <span className={badge.isUnlocked ? 'text-primary font-bold' : 'text-muted-foreground'}>
                  {badge.isUnlocked ? 'Verified' : 'Locked'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
