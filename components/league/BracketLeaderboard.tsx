'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  Building,
  Globe,
} from 'lucide-react';
import { BracketMember } from '@/lib/league-data';

interface BracketLeaderboardProps {
  members: BracketMember[];
}

export function BracketLeaderboard({ members }: BracketLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'national' | 'colleges'>('bracket');

  return (
    <div className="w-full rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header & View Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>Weekly Bracket Standings</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">30-Candidate Cohort</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Live Competitive Leaderboard
          </h2>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('bracket')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'bracket'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>My Cohort (30)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('national')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'national'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-secondary-foreground" />
            <span>All-India</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colleges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'colleges'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-chart-4" />
            <span>Top Colleges</span>
          </button>
        </div>
      </div>

      {/* Zone Demarcation Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono py-1 px-2 rounded-xl bg-muted/30 border border-border/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-500 font-semibold">Promotion Zone (Ranks 1–6): Advances to Gold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
          <span className="text-muted-foreground">Safe Zone (Ranks 7–24): Retains Division</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
          <span className="text-destructive font-semibold">Demotion Zone (Ranks 25–30): Relegation</span>
        </div>
      </div>

      {/* Bracket Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-3 w-14">Rank</th>
              <th className="py-3 px-3">Candidate</th>
              <th className="py-3 px-3 hidden md:table-cell">Verified Badges</th>
              <th className="py-3 px-3 text-center">Streak</th>
              <th className="py-3 px-3 text-right">Weekly XP</th>
              <th className="py-3 px-3 text-center w-16">Change</th>
              <th className="py-3 px-3 text-right hidden sm:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs font-sans">
            {members.map((member) => {
              const isPromo = member.rank <= 6;
              const isDemote = member.rank >= 25;
              const isCurrent = member.isCurrentUser;

              let rowClass = 'hover:bg-muted/30 transition-colors';
              if (isCurrent) {
                rowClass = 'bg-primary/10 border-y-2 border-primary shadow-xs';
              } else if (isPromo) {
                rowClass = 'hover:bg-emerald-500/5';
              } else if (isDemote) {
                rowClass = 'hover:bg-destructive/5 opacity-80';
              }

              return (
                <tr key={member.id} className={rowClass}>
                  {/* Rank Position */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      {member.rank === 1 ? (
                        <span className="text-base select-none">🥇</span>
                      ) : member.rank === 2 ? (
                        <span className="text-base select-none">🥈</span>
                      ) : member.rank === 3 ? (
                        <span className="text-base select-none">🥉</span>
                      ) : (
                        <span
                          className={`font-mono font-bold text-xs ${
                            isCurrent ? 'text-primary' : isPromo ? 'text-emerald-500' : 'text-muted-foreground'
                          }`}
                        >
                          #{member.rank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Candidate Info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full font-bold font-mono text-xs flex items-center justify-center shrink-0 ${member.avatarBg}`}
                      >
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold truncate ${
                              isCurrent ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {member.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          @{member.username} • {member.collegeOrCompany}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Verified Skill Badges */}
                  <td className="py-3.5 px-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 flex-wrap">
                      {member.badges.length > 0 ? (
                        member.badges.map((b, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                          >
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">—</span>
                      )}
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-3 text-center">
                    {member.streakDays > 0 ? (
                      <span className="inline-flex items-center gap-1 font-mono font-semibold text-xs text-foreground">
                        <Flame className="w-3.5 h-3.5 text-primary" />
                        <span>{member.streakDays}d</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs font-mono">—</span>
                    )}
                  </td>

                  {/* Weekly Points */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-xs text-foreground">
                    {member.weeklyPoints} XP
                  </td>

                  {/* Rank Change */}
                  <td className="py-3.5 px-3 text-center">
                    {member.rankChange > 0 ? (
                      <span className="inline-flex items-center text-emerald-500 font-mono text-[11px] font-bold">
                        <ArrowUp className="w-3 h-3" />
                        <span>{member.rankChange}</span>
                      </span>
                    ) : member.rankChange < 0 ? (
                      <span className="inline-flex items-center text-destructive font-mono text-[11px] font-bold">
                        <ArrowDown className="w-3 h-3" />
                        <span>{Math.abs(member.rankChange)}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-muted-foreground font-mono text-[11px]">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>

                  {/* Promotion Status */}
                  <td className="py-3.5 px-3 text-right hidden sm:table-cell">
                    {isPromo ? (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        Promoting ↑
                      </span>
                    ) : isDemote ? (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/30">
                        Relegation ↓
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Safe</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
