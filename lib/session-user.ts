import { cookies } from 'next/headers';
import { db } from './db';
import { profiles, studentStats } from './db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from './supabase/server';

/**
 * Resolves the authenticated student profile ID from Supabase Auth or session cookie.
 */
export async function getAuthenticatedStudentId(): Promise<string | null> {
  try {
    // 1. Check Supabase server client
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && db) {
        // First check if profile already exists for this user by id or email
        const existingById = await db
          .select({ id: profiles.id })
          .from(profiles)
          .where(eq(profiles.id, user.id))
          .limit(1);

        if (existingById.length > 0) {
          return user.id;
        }

        if (user.email) {
          const existingByEmail = await db
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.email, user.email.toLowerCase()))
            .limit(1);

          if (existingByEmail.length > 0) {
            return existingByEmail[0].id;
          }
        }

        // Ensure student profile exists in profiles table
        await db
          .insert(profiles)
          .values({
            id: user.id,
            role: 'student',
            fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student Learner',
            username: user.email?.split('@')[0] || `student_${user.id.slice(0, 8)}`,
            email: user.email?.toLowerCase(),
            isVerified: true,
          })
          .onConflictDoNothing();

        return user.id;
      }
    } catch {
      // Supabase auth fallback to cookie
    }

    // 2. Check local session cookie
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('aignite_session')?.value;
      if (sessionCookie && db) {
        let session: { userId?: string; username?: string; email?: string; fullName?: string } = {};
        try {
          session = JSON.parse(sessionCookie);
        } catch {
          // parse error
        }

        if (session.userId) {
          const existing = await db
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.id, session.userId))
            .limit(1);
          if (existing.length > 0) return existing[0].id;
        }

        if (session.email) {
          const existing = await db
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.email, session.email.toLowerCase()))
            .limit(1);
          if (existing.length > 0) return existing[0].id;
        }

        const username = session.username || (session.email ? session.email.split('@')[0] : '');

        if (username) {
          const existing = await db
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.username, username))
            .limit(1);

          if (existing.length > 0) {
            return existing[0].id;
          }

          const newId = session.userId || crypto.randomUUID();
          await db
            .insert(profiles)
            .values({
              id: newId,
              role: 'student',
              fullName: session.fullName || username || 'Student Learner',
              username,
              email: session.email?.toLowerCase(),
              isVerified: true,
            })
            .onConflictDoNothing();

          return newId;
        }
      }
    } catch {
      // Cookies not available outside request scope
    }

    // 3. If no session cookie, check if any existing student profile exists in DB
    if (db) {
      const defaultProfile = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.role, 'student'))
        .limit(1);

      if (defaultProfile.length > 0) {
        return defaultProfile[0].id;
      }
    }
  } catch (err) {
    console.warn('Error resolving authenticated student ID:', err);
  }

  return null;
}

export interface StudentStreakData {
  authenticated: boolean;
  studentId?: string;
  currentStreak: number;
  highestStreak: number;
  totalPoints: number;
  lastActiveDate?: string;
}

/**
 * Directly queries the current student flame streak and points from Supabase.
 */
export async function getStudentStreakData(): Promise<StudentStreakData> {
  const studentId = await getAuthenticatedStudentId();
  if (!studentId || !db) {
    return {
      authenticated: false,
      currentStreak: 0,
      highestStreak: 0,
      totalPoints: 0,
    };
  }

  const todayDate = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  try {
    const stats = await db
      .select()
      .from(studentStats)
      .where(eq(studentStats.studentId, studentId))
      .limit(1);

    if (stats.length === 0) {
      // Initialize stats row in Supabase
      await db.insert(studentStats).values({
        studentId,
        totalPoints: 25,
        currentStreak: 1,
        highestStreak: 1,
        lastActiveDate: todayDate,
        currentLeagueTier: 'bronze',
        leaguePointsThisWeek: 25,
      });

      return {
        authenticated: true,
        studentId,
        currentStreak: 1,
        highestStreak: 1,
        totalPoints: 25,
        lastActiveDate: todayDate,
      };
    }

    const stat = stats[0];
    const lastActive = stat.lastActiveDate;
    let currentStreak = stat.currentStreak;

    // Check if streak is broken
    if (lastActive && lastActive !== todayDate && lastActive !== yesterdayDate) {
      currentStreak = 0;
      if (stat.currentStreak > 0) {
        await db
          .update(studentStats)
          .set({ currentStreak: 0, updatedAt: new Date() })
          .where(eq(studentStats.studentId, studentId));
      }
    }

    return {
      authenticated: true,
      studentId,
      currentStreak,
      highestStreak: stat.highestStreak,
      totalPoints: stat.totalPoints,
      lastActiveDate: lastActive || undefined,
    };
  } catch (err) {
    console.error('Failed to get student streak data from Supabase:', err);
    return {
      authenticated: true,
      studentId,
      currentStreak: 1,
      highestStreak: 1,
      totalPoints: 25,
    };
  }
}

/**
 * Records activity in Supabase: updates flame streak and adds points to student_stats.
 */
export async function recordStudentActivityAndIncrementStreak(
  studentId: string,
  pointsAwarded: number = 25
): Promise<{ currentStreak: number; highestStreak: number; totalPoints: number }> {
  if (!db) {
    return { currentStreak: 1, highestStreak: 1, totalPoints: 25 };
  }

  const todayDate = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  try {
    const existing = await db
      .select()
      .from(studentStats)
      .where(eq(studentStats.studentId, studentId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(studentStats).values({
        studentId,
        totalPoints: pointsAwarded,
        currentStreak: 1,
        highestStreak: 1,
        lastActiveDate: todayDate,
        currentLeagueTier: 'bronze',
        leaguePointsThisWeek: pointsAwarded,
      });

      return {
        currentStreak: 1,
        highestStreak: 1,
        totalPoints: pointsAwarded,
      };
    }

    const stat = existing[0];
    let nextStreak = stat.currentStreak;

    if (stat.lastActiveDate === todayDate) {
      // Already active today - maintain streak
      nextStreak = stat.currentStreak > 0 ? stat.currentStreak : 1;
    } else if (stat.lastActiveDate === yesterdayDate) {
      // Consecutive day - increment streak
      nextStreak = stat.currentStreak + 1;
    } else {
      // Gap in activity - restart streak at 1
      nextStreak = 1;
    }

    const nextHighest = Math.max(nextStreak, stat.highestStreak);
    const nextTotalPoints = stat.totalPoints + pointsAwarded;
    const nextLeaguePoints = stat.leaguePointsThisWeek + pointsAwarded;

    await db
      .update(studentStats)
      .set({
        currentStreak: nextStreak,
        highestStreak: nextHighest,
        totalPoints: nextTotalPoints,
        leaguePointsThisWeek: nextLeaguePoints,
        lastActiveDate: todayDate,
        updatedAt: new Date(),
      })
      .where(eq(studentStats.studentId, studentId));

    return {
      currentStreak: nextStreak,
      highestStreak: nextHighest,
      totalPoints: nextTotalPoints,
    };
  } catch (err) {
    console.error('Error updating streak in Supabase:', err);
    return { currentStreak: 1, highestStreak: 1, totalPoints: 25 };
  }
}
