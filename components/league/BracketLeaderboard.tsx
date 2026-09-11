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
  Award,
  GraduationCap,
} from 'lucide-react';
import {
  BracketMember,
  NATIONAL_LEADERBOARD_ROSTER,
  TOP_COLLEGES_ROSTER,
} from '@/lib/league-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BracketLeaderboardProps {
  members: BracketMember[];
}

export function BracketLeaderboard({ members }: BracketLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'national' | 'colleges'>('bracket');

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-border shadow-lg">
      <CardHeader className="p-4 sm:p-6 border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 text-sm font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  {activeTab === 'bracket'
                    ? 'Weekly Bracket Standings'
                    : activeTab === 'national'
                    ? 'All-India National League'
                    : 'Campus AI Leaderboard'}
                </span>
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                {activeTab === 'bracket'
                  ? '30-Candidate Cohort'
                  : activeTab === 'national'
                  ? 'National Engineering Division'
                  : 'Top Universities in India'}
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {activeTab === 'bracket'
                ? 'Live Cohort Division Standings'
                : activeTab === 'national'
                ? 'All-India Candidate Standings'
                : 'Top Engineering Institutions'}
            </CardTitle>
          </div>

          {/* View Switcher Pills */}
          <div className="grid grid-cols-3 sm:flex items-center rounded-xl bg-muted/60 p-1 border border-border text-sm w-full sm:w-auto">
            <Button
              variant={activeTab === 'bracket' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('bracket')}
              className="rounded-lg gap-1.5 font-bold h-8 text-sm px-2.5 sm:px-3 justify-center"
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Cohort ({members.length})</span>
            </Button>

            <Button
              variant={activeTab === 'national' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('national')}
              className="rounded-lg gap-1.5 font-bold h-8 text-sm px-2.5 sm:px-3 justify-center"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All-India</span>
            </Button>

            <Button
              variant={activeTab === 'colleges' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('colleges')}
              className="rounded-lg gap-1.5 font-bold h-8 text-sm px-2.5 sm:px-3 justify-center"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Top Colleges</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* ========================================================================= */}
        {/* TAB 1: 30-STUDENT COHORT BRACKET */}
        {/* ========================================================================= */}
        {activeTab === 'bracket' && (
          <div className="space-y-4">
            {/* Zone Demarcation Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-mono py-2 px-3 rounded-xl bg-muted/30 border border-border/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Promotion Zone (Ranks 1-6): Advances to Gold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 shrink-0" />
                <span className="text-muted-foreground">Safe Zone (Ranks 7-24): Retains Division</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0" />
                <span className="text-destructive font-semibold">Demotion Zone (Ranks 25-30): Relegation</span>
              </div>
            </div>

            {/* Bracket Table */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              {members.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                    🏆
                  </div>
                  <h4 className="text-base font-bold text-foreground">No Candidates in This Bracket Yet</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Complete weekly AI challenges or spoken defense rounds to enter the weekly 30-candidate bracket and compete for division promotion.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm min-w-[520px] sm:min-w-full">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/30 text-sm font-mono uppercase tracking-wider text-muted-foreground">
                        <th className="py-3 px-3 sm:px-4 w-14">Rank</th>
                        <th className="py-3 px-3 sm:px-4">Candidate</th>
                        <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Verified Badges</th>
                        <th className="py-3 px-3 sm:px-4 text-center">Streak</th>
                        <th className="py-3 px-3 sm:px-4 text-right">Weekly XP</th>
                        <th className="py-3 px-3 sm:px-4 text-center w-14">Change</th>
                        <th className="py-3 px-3 sm:px-4 text-right hidden sm:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-sm font-sans">
                      {members.map((member) => {
                        const isPromo = member.rank <= 6;
                        const isDemote = member.rank >= 25;
                        const isCurrent = member.isCurrentUser;

                        let rowClass = 'hover:bg-muted/30 transition-colors';
                        if (isCurrent) {
                          rowClass = 'bg-primary/10 border-y-2 border-primary shadow-xs font-semibold';
                        } else if (isPromo) {
                          rowClass = 'hover:bg-emerald-500/5';
                        } else if (isDemote) {
                          rowClass = 'hover:bg-destructive/5 opacity-80';
                        }

                        return (
                          <tr key={member.id} className={rowClass}>
                            {/* Rank Position */}
                            <td className="py-3.5 px-3 sm:px-4">
                              <div className="flex items-center gap-1">
                                {member.rank === 1 ? (
                                  <span className="text-base select-none">🥇</span>
                                ) : member.rank === 2 ? (
                                  <span className="text-base select-none">🥈</span>
                                ) : member.rank === 3 ? (
                                  <span className="text-base select-none">🥉</span>
                                ) : (
                                  <span
                                    className={`font-mono font-bold text-sm ${
                                      isCurrent ? 'text-primary' : isPromo ? 'text-emerald-500' : 'text-muted-foreground'
                                    }`}
                                  >
                                    #{member.rank}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Candidate Info */}
                            <td className="py-3.5 px-3 sm:px-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 ${member.avatarBg}`}
                                >
                                  {member.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={`font-bold truncate max-w-[130px] sm:max-w-[180px] ${
                                        isCurrent ? 'text-primary' : 'text-foreground'
                                      }`}
                                    >
                                      {member.name}
                                    </span>
                                    {isCurrent && (
                                      <Badge variant="default" className="text-sm font-mono px-1.5 py-0 rounded bg-primary text-primary-foreground font-bold">
                                        YOU
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground font-mono truncate">
                                    @{member.username} - {member.collegeOrCompany}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Verified Skill Badges (Desktop) */}
                            <td className="py-3.5 px-3 sm:px-4 hidden md:table-cell">
                              <div className="flex items-center gap-1 flex-wrap">
                                {member.badges.length > 0 ? (
                                  member.badges.map((b, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-sm font-mono bg-muted/40"
                                    >
                                      {b}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground italic">-</span>
                                )}
                              </div>
                            </td>

                            {/* Streak */}
                            <td className="py-3.5 px-3 sm:px-4 text-center">
                              {member.streakDays > 0 ? (
                                <span className="inline-flex items-center gap-1 font-mono font-semibold text-sm text-foreground">
                                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                                  <span>{member.streakDays}d</span>
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm font-mono">-</span>
                              )}
                            </td>

                            {/* Weekly Points */}
                            <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-sm text-foreground whitespace-nowrap">
                              {member.weeklyPoints} XP
                            </td>

                            {/* Rank Change */}
                            <td className="py-3.5 px-3 sm:px-4 text-center">
                              {member.rankChange > 0 ? (
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                                  <ArrowUp className="w-3 h-3" />
                                  <span>{member.rankChange}</span>
                                </span>
                              ) : member.rankChange < 0 ? (
                                <span className="inline-flex items-center text-destructive font-mono text-sm font-bold">
                                  <ArrowDown className="w-3 h-3" />
                                  <span>{Math.abs(member.rankChange)}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-muted-foreground font-mono text-sm">
                                  <Minus className="w-3 h-3" />
                                </span>
                              )}
                            </td>

                            {/* Promotion Status */}
                            <td className="py-3.5 px-3 sm:px-4 text-right hidden sm:table-cell whitespace-nowrap">
                              {isPromo ? (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-mono font-semibold">
                                  Promoting ↑
                                </Badge>
                              ) : isDemote ? (
                                <Badge variant="destructive" className="font-mono font-semibold">
                                  Relegation ↓
                                </Badge>
                              ) : (
                                <span className="text-sm font-mono text-muted-foreground">Safe</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALL-INDIA NATIONAL LEADERBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'national' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[500px] sm:min-w-full">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-sm font-mono uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 px-3 sm:px-4 w-14">Rank</th>
                      <th className="py-3 px-3 sm:px-4">Candidate</th>
                      <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Institution</th>
                      <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Verified Specialization</th>
                      <th className="py-3 px-3 sm:px-4 text-center">Streak</th>
                      <th className="py-3 px-3 sm:px-4 text-right">National XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm font-sans">
                    {NATIONAL_LEADERBOARD_ROSTER.map((entry, idx) => (
                      <tr
                        key={entry.username}
                        className={`hover:bg-muted/40 transition-colors ${
                          entry.isCurrentUser ? 'bg-primary/10 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 sm:px-4 font-mono font-bold">
                          {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 ${entry.avatarBg}`}>
                              {entry.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-foreground truncate max-w-[140px] sm:max-w-[200px]">
                                {entry.name}
                              </div>
                              <div className="text-sm text-muted-foreground font-mono truncate">
                                @{entry.username}
                                <span className="sm:hidden"> - {entry.institutionOrCountry}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 font-mono text-muted-foreground hidden sm:table-cell">
                          {entry.institutionOrCountry}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 hidden md:table-cell">
                          <Badge variant="outline" className="gap-1 font-mono text-sm bg-muted/40">
                            <Award className="w-3.5 h-3.5 text-primary" />
                            <span>{entry.topBadge}</span>
                          </Badge>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-center font-mono">
                          <span className="inline-flex items-center gap-1 text-orange-500 font-bold">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{entry.streakDays}d</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-primary whitespace-nowrap">
                          {entry.scoreXp} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TOP ENGINEERING COLLEGES LEADERBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'colleges' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[500px] sm:min-w-full">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-sm font-mono uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 px-3 sm:px-4 w-14">Rank</th>
                      <th className="py-3 px-3 sm:px-4">Campus / University</th>
                      <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Location</th>
                      <th className="py-3 px-3 sm:px-4 text-center">AI Candidates</th>
                      <th className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">Avg Defense Score</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Aggregate XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm font-sans">
                    {TOP_COLLEGES_ROSTER.map((college, idx) => (
                      <tr key={college.shortName} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-3 sm:px-4 font-mono font-bold">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${college.rank}`}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                                <span>{college.shortName}</span>
                                <span className="text-sm font-mono text-muted-foreground hidden lg:inline">
                                  ({college.collegeName})
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground font-mono sm:hidden">
                                {college.city}, {college.state}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 font-mono text-muted-foreground hidden sm:table-cell">
                          {college.city}, {college.state}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-bold">
                          <span className="inline-flex items-center gap-1 text-foreground">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{college.activeStudents}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-center font-mono hidden md:table-cell">
                          <Badge variant="outline" className="font-mono text-sm bg-primary/10 text-primary border-primary/20">
                            {college.avgScore} / 10
                          </Badge>
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-primary whitespace-nowrap">
                          {college.totalPoints.toLocaleString()} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

