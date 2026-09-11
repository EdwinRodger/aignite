'use server';

import { DAILY_POTD_CHALLENGES, PotdChallenge } from '@/lib/potd-data';
import { db } from '@/lib/db';
import { dailyPotdQuestions, dailyPotdSubmissions } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import {
  getAuthenticatedStudentId,
  getStudentStreakData,
  recordStudentActivityAndIncrementStreak,
} from '@/lib/session-user';

/**
 * Fetch today's featured Problem of the Day challenge directly from Supabase.
 * Falls back to curated beginner/moderate dataset if offline or table is empty.
 */
export async function getTodayPotdQuestionAction(): Promise<PotdChallenge> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    if (db) {
      const rows = await db
        .select()
        .from(dailyPotdQuestions)
        .where(eq(dailyPotdQuestions.forDate, today))
        .limit(1);

      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          forDate: r.forDate,
          title: r.title,
          topic: r.topic,
          track: r.track as PotdChallenge['track'],
          difficulty: r.difficulty as PotdChallenge['difficulty'],
          problemStatement: r.problemStatement,
          scenario: r.scenario || '',
          codeSnippet: r.codeSnippet || undefined,
          formula: r.formulaDisplay ? JSON.parse(r.formulaDisplay) : undefined,
          question: r.problemStatement,
          options: Array.isArray(r.options) && r.options.length > 0 ? (r.options as string[]) : DAILY_POTD_CHALLENGES[0].options,
          correctOptionIndex: r.correctOptionIndex ?? 0,
          explanation: r.explanation || DAILY_POTD_CHALLENGES[0].explanation,
          hint: r.hint || DAILY_POTD_CHALLENGES[0].hint,
          pointsReward: r.pointsReward || 25,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch POTD challenge from Supabase, falling back to local data:', err);
  }

  // Fallback to today's or default challenge
  const matched = DAILY_POTD_CHALLENGES.find((p) => p.forDate === today);
  return matched || DAILY_POTD_CHALLENGES[0];
}

// Resolve database UUID for question to prevent FK constraint violations
async function resolvePotdDbId(challenge: PotdChallenge): Promise<string | null> {
  if (challenge.id && challenge.id.length === 36) {
    return challenge.id;
  }
  if (!db) return null;
  try {
    const row = await db
      .select({ id: dailyPotdQuestions.id })
      .from(dailyPotdQuestions)
      .where(eq(dailyPotdQuestions.forDate, challenge.forDate))
      .limit(1);
    return row.length > 0 ? row[0].id : null;
  } catch {
    return null;
  }
}

export interface PotdStreakResult {
  currentStreak: number;
  highestStreak: number;
  totalPoints: number;
  completedToday: boolean;
  savedSubmission?: {
    selectedOptionIndex: number;
    isCorrect: boolean;
    pointsAwarded: number;
  };
}

/**
 * Directly queries the student's streak and completion status for POTD from Supabase.
 */
export async function getPotdStreakAction(): Promise<PotdStreakResult> {
  const streakData = await getStudentStreakData();
  let completedToday = false;
  let savedSubmission: PotdStreakResult['savedSubmission'] = undefined;

  const studentId = await getAuthenticatedStudentId();
  if (db && studentId) {
    try {
      const challenge = await getTodayPotdQuestionAction();
      const dbId = await resolvePotdDbId(challenge);

      if (dbId) {
        const existing = await db
          .select({
            id: dailyPotdSubmissions.id,
            selectedOptionIndex: dailyPotdSubmissions.selectedOptionIndex,
            isCorrect: dailyPotdSubmissions.isCorrect,
            pointsAwarded: dailyPotdSubmissions.pointsAwarded,
          })
          .from(dailyPotdSubmissions)
          .where(
            and(
              eq(dailyPotdSubmissions.studentId, studentId),
              eq(dailyPotdSubmissions.potdId, dbId)
            )
          )
          .orderBy(desc(dailyPotdSubmissions.createdAt))
          .limit(1);

        if (existing.length > 0) {
          const latest = existing[0];
          // Any submission means today's challenge is completed
          completedToday = true;
          savedSubmission = {
            selectedOptionIndex: latest.selectedOptionIndex ?? 0,
            isCorrect: latest.isCorrect ?? false,
            pointsAwarded: latest.pointsAwarded ?? 0,
          };
        }
      }
    } catch (e) {
      console.warn('Error checking POTD completion status:', e);
    }
  }

  return {
    currentStreak: streakData.currentStreak,
    highestStreak: streakData.highestStreak,
    totalPoints: streakData.totalPoints,
    completedToday,
    savedSubmission,
  };
}

export interface PotdSubmissionResult {
  success: boolean;
  isCorrect: boolean;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  explanation: string;
  pointsAwarded: number;
  updatedStreak?: number;
  error?: string;
}

/**
 * Submits and verifies a student's answer for Problem of the Day.
 * Validates option selection, strictly prevents any double submission (right or wrong), persists result in Supabase, and updates flame streak.
 */
export async function submitPotdSolutionAction(
  potdId: string,
  selectedOptionIndex: number
): Promise<PotdSubmissionResult> {
  try {
    if (selectedOptionIndex === undefined || selectedOptionIndex === null || selectedOptionIndex < 0) {
      return {
        success: false,
        isCorrect: false,
        selectedOptionIndex: -1,
        correctOptionIndex: 0,
        explanation: 'Please select an option before submitting your answer.',
        pointsAwarded: 0,
        error: 'No option selected.',
      };
    }

    const todayChallenge = await getTodayPotdQuestionAction();
    const challenge =
      (todayChallenge.id === potdId ? todayChallenge : null) ||
      DAILY_POTD_CHALLENGES.find((c) => c.id === potdId) ||
      todayChallenge;

    const studentId = await getAuthenticatedStudentId();
    const dbId = await resolvePotdDbId(challenge);

    // If user has already submitted for today's challenge (right or wrong), strictly prevent re-submitting!
    if (db && studentId && dbId) {
      const alreadySubmitted = await db
        .select({
          id: dailyPotdSubmissions.id,
          selectedOptionIndex: dailyPotdSubmissions.selectedOptionIndex,
          isCorrect: dailyPotdSubmissions.isCorrect,
          pointsAwarded: dailyPotdSubmissions.pointsAwarded,
        })
        .from(dailyPotdSubmissions)
        .where(
          and(
            eq(dailyPotdSubmissions.studentId, studentId),
            eq(dailyPotdSubmissions.potdId, dbId)
          )
        )
        .limit(1);

      if (alreadySubmitted.length > 0) {
        const streakData = await getStudentStreakData();
        const existing = alreadySubmitted[0];
        return {
          success: true,
          isCorrect: existing.isCorrect ?? false,
          selectedOptionIndex: existing.selectedOptionIndex ?? challenge.correctOptionIndex,
          correctOptionIndex: challenge.correctOptionIndex,
          explanation: challenge.explanation,
          pointsAwarded: existing.pointsAwarded ?? 0,
          updatedStreak: streakData.currentStreak,
          error: 'You have already completed today\'s Problem of the Day challenge. Only 1 submission is allowed per day.',
        };
      }
    }

    const isCorrect = selectedOptionIndex === challenge.correctOptionIndex;
    const pointsAwarded = isCorrect ? (challenge.pointsReward || 25) : 0;
    let updatedStreak: number | undefined;

    if (db && studentId && dbId) {
      try {
        // Record submission in Supabase
        await db.insert(dailyPotdSubmissions).values({
          studentId,
          potdId: dbId,
          submittedCode: `Selected Option: ${selectedOptionIndex}`,
          selectedOptionIndex,
          isCorrect,
          status: isCorrect ? 'passed' : 'failed',
          pointsAwarded,
          feedback: isCorrect ? 'Correct! ' + challenge.explanation : 'Incorrect selection.',
        });

        // Increment flame streak in Supabase on correct answer
        if (isCorrect) {
          const streakResult = await recordStudentActivityAndIncrementStreak(studentId, pointsAwarded);
          updatedStreak = streakResult.currentStreak;
        } else {
          const currentData = await getStudentStreakData();
          updatedStreak = currentData.currentStreak;
        }
      } catch (dbErr) {
        console.warn('Error recording POTD submission in Supabase:', dbErr);
      }
    }

    return {
      success: true,
      isCorrect,
      selectedOptionIndex,
      correctOptionIndex: challenge.correctOptionIndex,
      explanation: challenge.explanation,
      pointsAwarded,
      updatedStreak,
    };
  } catch (error) {
    console.error('POTD submission error:', error);
    return {
      success: false,
      isCorrect: false,
      selectedOptionIndex,
      correctOptionIndex: 0,
      explanation: 'An unexpected error occurred while verifying your answer. Please try again.',
      pointsAwarded: 0,
      error: 'Submission error.',
    };
  }
}
