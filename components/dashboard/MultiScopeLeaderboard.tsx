'use client';

import React, { useState } from 'react';
import { Trophy, Flame, Zap, Award, Globe, MapPin, Flag } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  institutionOrCountry: string;
  streakDays: number;
  scoreXp: number;
  rankChange: number;
  isCurrentUser?: boolean;
  avatarBg: string;
  topBadge: string;
}

const REGIONAL_ROSTER: LeaderboardEntry[] = [];

const NATIONAL_ROSTER: LeaderboardEntry[] = [];

const INTERNATIONAL_ROSTER: LeaderboardEntry[] = [];

export function MultiScopeLeaderboard() {
  const [metric, setMetric] = useState<'streak' | 'score'>('streak');
  const [scope, setScope] = useState<'regional' | 'national' | 'international'>('regional');

  const rawRoster =
    scope === 'regional'
      ? REGIONAL_ROSTER
      : scope === 'national'
      ? NATIONAL_ROSTER
      : INTERNATIONAL_ROSTER;

  // Sort based on selected metric
  const sortedRoster = [...rawRoster].sort((a, b) =>
    metric === 'streak' ? b.streakDays - a.streakDays : b.scoreXp - a.scoreXp
  );

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-chart-5" />
            <h3 className="text-lg font-bold text-foreground font-sans">
              Competitive AI Leaderboard
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Ranked by daily spoken interview consistency and verified technical capstones.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div role="tablist" aria-label="Leaderboard ranking metric" className="flex items-center p-1 rounded-xl bg-muted border border-border self-start sm:self-center">
          <button
            type="button"
            role="tab"
            id="tab-metric-streak"
            aria-selected={metric === 'streak'}
            aria-controls="leaderboard-roster-panel"
            onClick={() => setMetric('streak')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              metric === 'streak'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>By Streak (Habit)</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-metric-score"
            aria-selected={metric === 'score'}
            aria-controls="leaderboard-roster-panel"
            onClick={() => setMetric('score')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              metric === 'score'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>By Student Score (XP)</span>
          </button>
        </div>
      </div>

      {/* Scope Selector (Regional, National, International) */}
      <div role="tablist" aria-label="Leaderboard geographic scope" className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-sm font-mono uppercase text-muted-foreground mr-1">Scope:</span>
        <button
          type="button"
          role="tab"
          id="tab-scope-regional"
          aria-selected={scope === 'regional'}
          aria-controls="leaderboard-roster-panel"
          onClick={() => setScope('regional')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            scope === 'regional'
              ? 'bg-primary/15 border-primary text-primary shadow-2xs'
              : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Regional (State / College)</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-scope-national"
          aria-selected={scope === 'national'}
          aria-controls="leaderboard-roster-panel"
          onClick={() => setScope('national')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            scope === 'national'
              ? 'bg-primary/15 border-primary text-primary shadow-2xs'
              : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Flag className="w-3.5 h-3.5" aria-hidden="true" />
          <span>National (All-India)</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-scope-international"
          aria-selected={scope === 'international'}
          aria-controls="leaderboard-roster-panel"
          onClick={() => setScope('international')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            scope === 'international'
              ? 'bg-primary/15 border-primary text-primary shadow-2xs'
              : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          <span>International (Global)</span>
        </button>
      </div>

      {/* Leaderboard Content */}
      <div id="leaderboard-roster-panel" role="tabpanel" aria-labelledby={metric === 'streak' ? 'tab-metric-streak' : 'tab-metric-score'} className="overflow-x-auto">
        {sortedRoster.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-muted/30 border border-border/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
              🏆
            </div>
            <h4 className="text-base font-bold text-foreground">No Ranked Engineers in this Division Yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Be the first to complete a daily AI defense challenge or verify a technical capstone to claim rank #1 on the {scope} leaderboard!
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm" aria-label="Competitive AI Leaderboard Roster">
            <thead>
              <tr className="border-b border-border/80 text-sm font-mono text-muted-foreground uppercase">
                <th scope="col" className="py-2.5 px-3">Rank</th>
                <th scope="col" className="py-2.5 px-3">Student Engineer</th>
                <th scope="col" className="py-2.5 px-3">Region / Campus</th>
                <th scope="col" className="py-2.5 px-3">Verified Skill</th>
                <th scope="col" className="py-2.5 px-3 text-right">
                  {metric === 'streak' ? 'Daily Streak' : 'Total Points (XP)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-sans">
              {sortedRoster.map((entry, idx) => (
                <tr
                  key={entry.username}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-primary/10 hover:bg-primary/15 font-semibold'
                      : 'hover:bg-muted/40'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black'
                            : idx === 1
                            ? 'bg-slate-500/20 text-slate-700 dark:text-slate-200 font-bold'
                            : idx === 2
                            ? 'bg-amber-600/20 text-amber-800 dark:text-amber-400 font-bold'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      {entry.rankChange > 0 && (
                        <span aria-label={`Rank increased by ${entry.rankChange}`} className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold">↑{entry.rankChange}</span>
                      )}
                      {entry.rankChange < 0 && (
                        <span aria-label={`Rank decreased by ${Math.abs(entry.rankChange)}`} className="text-sm font-mono text-destructive font-bold">↓{Math.abs(entry.rankChange)}</span>
                      )}
                    </div>
                  </td>

                  {/* Candidate Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${entry.avatarBg}`}
                      >
                        {entry.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-foreground flex items-center gap-1.5">
                          <span>{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="text-sm font-mono px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">@{entry.username}</span>
                      </div>
                    </div>
                  </td>

                  {/* Institution */}
                  <td className="py-3 px-3 font-mono text-muted-foreground text-sm">
                    {entry.institutionOrCountry}
                  </td>

                  {/* Top Badge */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted border border-border text-sm font-mono text-foreground">
                      <Award className="w-3 h-3 text-primary" />
                      <span>{entry.topBadge}</span>
                    </span>
                  </td>

                  {/* Metric Value */}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {metric === 'streak' ? (
                      <span className="text-orange-500 flex items-center justify-end gap-1">
                        <span>🔥</span>
                        <span>{entry.streakDays} Days</span>
                      </span>
                    ) : (
                      <span className="text-primary flex items-center justify-end gap-1">
                        <span>⚡</span>
                        <span>{entry.scoreXp} XP</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
