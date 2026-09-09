'use server';

import {
  LEAGUE_TIERS,
  LeagueTier,
  INITIAL_BRACKET_MEMBERS,
  BracketMember,
  WEEKLY_LEAGUE_CHALLENGES,
  WeeklyChallenge,
  ACHIEVEMENT_BADGES,
  AchievementBadge,
} from '@/lib/league-data';

export async function getLeagueTiers(): Promise<LeagueTier[]> {
  return LEAGUE_TIERS;
}

export async function getLeagueBracket(): Promise<{
  tier: LeagueTier;
  members: BracketMember[];
  userRank: number;
  timeRemaining: string;
}> {
  return {
    tier: LEAGUE_TIERS[0], // Bronze AI Engineer
    members: INITIAL_BRACKET_MEMBERS,
    userRank: INITIAL_BRACKET_MEMBERS.length > 0 ? 5 : 0,
    timeRemaining: '3d 14h 22m (Ends Sunday 23:59 UTC)',
  };
}

export async function getWeeklyChallenges(): Promise<WeeklyChallenge[]> {
  return WEEKLY_LEAGUE_CHALLENGES;
}

export async function getAchievementBadges(): Promise<AchievementBadge[]> {
  return ACHIEVEMENT_BADGES;
}

export async function submitLeagueChallenge(
  challengeId: string,
  answerText: string
): Promise<{
  success: boolean;
  pointsAwarded: number;
  newRank: number;
  feedback: string;
}> {
  void answerText;
  const challenge = WEEKLY_LEAGUE_CHALLENGES.find((c) => c.id === challengeId);
  const points = challenge ? challenge.pointsAwarded : 50;

  return {
    success: true,
    pointsAwarded: points,
    newRank: 4, // Moves up from Rank 5 to Rank 4!
    feedback: `Technical challenge submission approved! +${points} XP awarded to your weekly bracket score. You climbed to Rank #4 in the Promotion Zone!`,
  };
}

export async function claimAchievementBadge(
  badgeId: string
): Promise<{ success: boolean; badgeId: string }> {
  return { success: true, badgeId };
}
