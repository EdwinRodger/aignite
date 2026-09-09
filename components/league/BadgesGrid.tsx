'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '@/lib/league-data';

interface BadgesGridProps {
  badges: AchievementBadge[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  return (
    <div className="w-full rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Verified Achievement Badges</h3>
            <span className="text-[11px] text-muted-foreground font-mono">
              Displayed on public profile & verified for recruiters
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
          {badges.filter((b) => b.isUnlocked).length}/{badges.length} Claimed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-card border-primary/40 shadow-sm shadow-primary/5 hover:border-primary'
                : 'bg-muted/20 border-border opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl select-none" role="img" aria-label={badge.name}>
                  {badge.icon}
                </span>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      badge.recruiterValue === 'Elite'
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : badge.recruiterValue === 'Distinguished'
                        ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {badge.recruiterValue}
                  </span>

                  {badge.isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-foreground leading-snug">
                {badge.name}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground truncate max-w-[130px]">
                {badge.isUnlocked ? `Earned ${badge.unlockedAt}` : badge.requirement}
              </span>
              <span className={badge.isUnlocked ? 'text-primary font-bold' : 'text-muted-foreground'}>
                {badge.isUnlocked ? 'Verified' : 'Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
