'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { TierBadgeHeader } from '@/components/league/TierBadgeHeader';
import { BracketLeaderboard } from '@/components/league/BracketLeaderboard';
import { WeeklyChallengesCard } from '@/components/league/WeeklyChallengesCard';
import { BadgesGrid } from '@/components/league/BadgesGrid';
import {
  LEAGUE_TIERS,
  INITIAL_BRACKET_MEMBERS,
  WEEKLY_LEAGUE_CHALLENGES,
  ACHIEVEMENT_BADGES,
  BracketMember,
} from '@/lib/league-data';

export default function LeaguePage() {
  const [tier] = useState(LEAGUE_TIERS[1]); // Silver AI Engineer
  const [members, setMembers] = useState<BracketMember[]>(INITIAL_BRACKET_MEMBERS);
  const [userPoints, setUserPoints] = useState(415);
  const [userRank, setUserRank] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aignite_student_points');
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (parsed > 415) {
            setUserPoints(parsed);
            setUserRank(4);
            setMembers((prev) =>
              prev.map((m) =>
                m.isCurrentUser
                  ? { ...m, weeklyPoints: parsed, rank: 4, rankChange: 4 }
                  : m
              )
            );
          }
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleChallengeCompleted = (points: number) => {
    setUserPoints((prev) => {
      const next = prev + points;
      if (typeof window !== 'undefined') {
        localStorage.setItem('aignite_student_points', next.toString());
      }
      return next;
    });

    // Move current user from rank 5 to rank 3
    setUserRank(3);
    setMembers((prev) => {
      return prev
        .map((m) => {
          if (m.isCurrentUser) {
            return { ...m, weeklyPoints: m.weeklyPoints + points, rank: 3, rankChange: 5 };
          }
          if (m.rank === 3) return { ...m, rank: 4 };
          if (m.rank === 4) return { ...m, rank: 5 };
          return m;
        })
        .sort((a, b) => a.rank - b.rank);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-12">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tier Division Header & Weekly Clock */}
        <TierBadgeHeader
          currentTier={tier}
          userRank={userRank}
          timeRemaining="3d 14h 22m (Ends Sunday 23:59 UTC)"
          weeklyPoints={userPoints}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Live 30-Student Cohort Leaderboard */}
          <div className="lg:col-span-8 space-y-6">
            <BracketLeaderboard members={members} />
          </div>

          {/* Right Column: Weekly Challenges & Badges */}
          <aside aria-label="League challenges and badges" className="lg:col-span-4 space-y-6">
            <WeeklyChallengesCard
              challenges={WEEKLY_LEAGUE_CHALLENGES}
              onChallengeCompleted={handleChallengeCompleted}
            />

            <BadgesGrid badges={ACHIEVEMENT_BADGES} />
          </aside>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
