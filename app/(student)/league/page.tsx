'use client';

import React, { useState, useEffect } from 'react';
import { TierBadgeHeader } from '@/components/league/TierBadgeHeader';
import { BracketLeaderboard } from '@/components/league/BracketLeaderboard';
import { MultiScopeLeaderboard } from '@/components/dashboard/MultiScopeLeaderboard';
import { Button } from '@/components/ui/button';
import {
  LEAGUE_TIERS,
  INITIAL_BRACKET_MEMBERS,
  BracketMember,
  LeagueTier,
  getTimeRemainingUntilSunday,
} from '@/lib/league-data';
import { getLeagueBracket } from '@/app/actions/league';
import { Users, Globe } from 'lucide-react';

export default function LeaguePage() {
  const [activeView, setActiveView] = useState<'bracket' | 'global'>('bracket');
  const [tier, setTier] = useState<LeagueTier>(LEAGUE_TIERS[1]); // Default to Silver AI Engineer
  const [members, setMembers] = useState<BracketMember[]>(INITIAL_BRACKET_MEMBERS);
  const [userPoints, setUserPoints] = useState(415);
  const [userRank, setUserRank] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemainingUntilSunday().formatted);

  // Live UTC Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemainingUntilSunday().formatted);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live cohort bracket from Supabase database / session
  useEffect(() => {
    let isMounted = true;
    getLeagueBracket()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setTier(data.tier);
          setMembers(data.members);
          setUserRank(data.userRank);
          setUserPoints(data.userPoints);
          setTimeRemaining(data.timeRemaining);
        }
      })
      .catch((err) => {
        console.warn('LeaguePage: Could not load live bracket from DB, using dynamic seed data:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Tier Division Header & Weekly Clock */}
      <TierBadgeHeader
        currentTier={tier}
        userRank={userRank}
        timeRemaining={timeRemaining}
        weeklyPoints={userPoints}
      />

      {/* Leaderboard View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl bg-muted border border-border text-sm font-semibold w-full sm:w-auto">
          <Button
            type="button"
            variant={activeView === 'bracket' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('bracket')}
            className="gap-2 font-bold text-sm h-9 px-3 sm:px-4 justify-center"
          >
            <Users className="w-4 h-4" />
            <span>Active Cohort Bracket (30)</span>
          </Button>
          <Button
            type="button"
            variant={activeView === 'global' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('global')}
            className="gap-2 font-bold text-sm h-9 px-3 sm:px-4 justify-center"
          >
            <Globe className="w-4 h-4" />
            <span>Regional, National &amp; Global</span>
          </Button>
        </div>

        <span className="text-sm font-mono text-muted-foreground self-start sm:self-auto">
          {activeView === 'bracket'
            ? `Division: ${tier.name}`
            : 'Multi-Scope verified AI metrics'}
        </span>
      </div>

      {/* View 1: 30-Student Weekly Cohort Bracket */}
      {activeView === 'bracket' && (
        <div className="space-y-6">
          <BracketLeaderboard members={members} />
        </div>
      )}

      {/* View 2: Regional, National & Global Multi-Scope Leaderboard */}
      {activeView === 'global' && (
        <div className="space-y-6">
          <MultiScopeLeaderboard />
        </div>
      )}
    </div>
  );
}


