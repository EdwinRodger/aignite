'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Flame, Zap, Award, Globe, MapPin, Flag, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  LeaderboardEntry,
  REGIONAL_LEADERBOARD_ROSTER,
  NATIONAL_LEADERBOARD_ROSTER,
  INTERNATIONAL_LEADERBOARD_ROSTER,
} from '@/lib/league-data';
import { getMultiScopeLeaderboard } from '@/app/actions/league';

export function MultiScopeLeaderboard() {
  const [metric, setMetric] = useState<'streak' | 'score'>('streak');
  const [scope, setScope] = useState<'regional' | 'national' | 'international'>('national');
  const [searchQuery, setSearchQuery] = useState('');
  const [rosters, setRosters] = useState<{
    regional: LeaderboardEntry[];
    national: LeaderboardEntry[];
    international: LeaderboardEntry[];
  }>({
    regional: REGIONAL_LEADERBOARD_ROSTER,
    national: NATIONAL_LEADERBOARD_ROSTER,
    international: INTERNATIONAL_LEADERBOARD_ROSTER,
  });

  useEffect(() => {
    let isMounted = true;
    getMultiScopeLeaderboard()
      .then((data) => {
        if (isMounted && data) {
          setRosters(data);
        }
      })
      .catch((err) => {
        console.warn('MultiScopeLeaderboard: Failed to fetch live rankings, using seed data:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentRoster = useMemo(() => {
    const raw =
      scope === 'regional'
        ? rosters.regional
        : scope === 'national'
        ? rosters.national
        : rosters.international;

    // Filter by search query
    const filtered = searchQuery.trim()
      ? raw.filter(
          (entry) =>
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.institutionOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.topBadge.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : raw;

    // Sort based on selected metric
    return [...filtered].sort((a, b) =>
      metric === 'streak' ? b.streakDays - a.streakDays : b.scoreXp - a.scoreXp
    );
  }, [scope, metric, rosters, searchQuery]);

  return (
    <Card className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 shadow-sm border-border">
      {/* Header & Metric Switcher */}
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5 p-0 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
              Competitive AI Leaderboard
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Ranked by daily spoken interview consistency and verified technical capstones.
          </CardDescription>
        </div>

        {/* Metric Selector Tabs */}
        <div
          role="tablist"
          aria-label="Leaderboard ranking metric"
          className="grid grid-cols-2 sm:flex items-center p-1 rounded-xl bg-muted border border-border w-full md:w-auto"
        >
          <Button
            type="button"
            role="tab"
            id="tab-metric-streak"
            variant={metric === 'streak' ? 'default' : 'ghost'}
            size="sm"
            aria-selected={metric === 'streak'}
            aria-controls="leaderboard-roster-panel"
            onClick={() => setMetric('streak')}
            className="min-h-[40px] px-3.5 text-sm font-bold gap-1.5 justify-center"
          >
            <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
            <span>By Streak (Habit)</span>
          </Button>
          <Button
            type="button"
            role="tab"
            id="tab-metric-score"
            variant={metric === 'score' ? 'default' : 'ghost'}
            size="sm"
            aria-selected={metric === 'score'}
            aria-controls="leaderboard-roster-panel"
            onClick={() => setMetric('score')}
            className="min-h-[40px] px-3.5 text-sm font-bold gap-1.5 justify-center"
          >
            <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>By Score (XP)</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* Scope Selector & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Scope Pills */}
          <div
            role="tablist"
            aria-label="Leaderboard geographic scope"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm"
          >
            <Button
              type="button"
              role="tab"
              id="tab-scope-national"
              variant={scope === 'national' ? 'default' : 'outline'}
              size="sm"
              aria-selected={scope === 'national'}
              aria-controls="leaderboard-roster-panel"
              onClick={() => setScope('national')}
              className="min-h-[38px] px-3 sm:px-3.5 rounded-xl font-bold gap-1.5 text-sm flex-1 sm:flex-none justify-center"
            >
              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>National (All-India)</span>
            </Button>

            <Button
              type="button"
              role="tab"
              id="tab-scope-regional"
              variant={scope === 'regional' ? 'default' : 'outline'}
              size="sm"
              aria-selected={scope === 'regional'}
              aria-controls="leaderboard-roster-panel"
              onClick={() => setScope('regional')}
              className="min-h-[38px] px-3 sm:px-3.5 rounded-xl font-bold gap-1.5 text-sm flex-1 sm:flex-none justify-center"
            >
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Regional (State / College)</span>
            </Button>

            <Button
              type="button"
              role="tab"
              id="tab-scope-international"
              variant={scope === 'international' ? 'default' : 'outline'}
              size="sm"
              aria-selected={scope === 'international'}
              aria-controls="leaderboard-roster-panel"
              onClick={() => setScope('international')}
              className="min-h-[38px] px-3 sm:px-3.5 rounded-xl font-bold gap-1.5 text-sm flex-1 sm:flex-none justify-center"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>International (Global)</span>
            </Button>
          </div>

          {/* Search Filter */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search student or campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm rounded-xl bg-background border-border"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div
          id="leaderboard-roster-panel"
          role="tabpanel"
          aria-labelledby={metric === 'streak' ? 'tab-metric-streak' : 'tab-metric-score'}
          className="rounded-2xl border border-border/70 overflow-hidden bg-card"
        >
          {currentRoster.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                🏆
              </div>
              <h4 className="text-base font-bold text-foreground">
                {searchQuery ? 'No Candidates Match Your Search' : 'No Ranked Engineers in this Division Yet'}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {searchQuery
                  ? 'Try searching with a different candidate name, college, or specialization keyword.'
                  : `Be the first to complete a daily AI defense challenge to claim rank #1 on the ${scope} leaderboard!`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse" aria-label="Competitive AI Leaderboard Roster">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-sm font-mono text-muted-foreground uppercase">
                    <th scope="col" className="py-3 px-3 sm:px-4 w-14 sm:w-16">Rank</th>
                    <th scope="col" className="py-3 px-3 sm:px-4">Student Engineer</th>
                    <th scope="col" className="py-3 px-3 sm:px-4 hidden sm:table-cell">Region / Campus</th>
                    <th scope="col" className="py-3 px-3 sm:px-4 hidden md:table-cell">Verified Skill</th>
                    <th scope="col" className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      {metric === 'streak' ? 'Daily Streak' : 'Total Points'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {currentRoster.map((entry, idx) => (
                    <tr
                      key={`${entry.username}-${idx}`}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-primary/10 hover:bg-primary/15 font-semibold'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-3 sm:px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                              idx === 0
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black'
                                : idx === 1
                                ? 'bg-slate-500/20 text-slate-700 dark:text-slate-200 font-bold'
                                : idx === 2
                                ? 'bg-amber-700/20 text-amber-800 dark:text-amber-400 font-bold'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          {entry.rankChange > 0 && (
                            <span
                              aria-label={`Rank increased by ${entry.rankChange}`}
                              className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold hidden xs:inline-flex items-center"
                            >
                              <ArrowUp className="w-3 h-3 inline" />
                              <span>{entry.rankChange}</span>
                            </span>
                          )}
                          {entry.rankChange < 0 && (
                            <span
                              aria-label={`Rank decreased by ${Math.abs(entry.rankChange)}`}
                              className="text-sm font-mono text-destructive font-bold hidden xs:inline-flex items-center"
                            >
                              <ArrowDown className="w-3 h-3 inline" />
                              <span>{Math.abs(entry.rankChange)}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Name & Avatar */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${entry.avatarBg}`}
                          >
                            {entry.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-foreground flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold truncate max-w-[140px] sm:max-w-[200px]">
                                {entry.name}
                              </span>
                              {entry.isCurrentUser && (
                                <Badge variant="default" className="text-sm font-mono px-1.5 py-0 font-bold uppercase">
                                  YOU
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground font-mono truncate">
                              <span>@{entry.username}</span>
                              <span className="sm:hidden text-muted-foreground/60">- {entry.institutionOrCountry}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Institution / Region (Visible sm and above) */}
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-muted-foreground text-sm hidden sm:table-cell">
                        <span className="truncate block max-w-[220px]">{entry.institutionOrCountry}</span>
                      </td>

                      {/* Top Badge (Visible md and above) */}
                      <td className="py-3.5 px-3 sm:px-4 hidden md:table-cell">
                        <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-0.5 text-sm font-mono text-foreground bg-muted/40">
                          <Award className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate max-w-[160px]">{entry.topBadge}</span>
                        </Badge>
                      </td>

                      {/* Metric Value */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold whitespace-nowrap">
                        {metric === 'streak' ? (
                          <span className="text-orange-500 inline-flex items-center justify-end gap-1">
                            <Flame className="w-4 h-4" />
                            <span>{entry.streakDays}d</span>
                          </span>
                        ) : (
                          <span className="text-primary inline-flex items-center justify-end gap-1">
                            <Zap className="w-4 h-4" />
                            <span>{entry.scoreXp} XP</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

