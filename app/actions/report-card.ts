'use server';

import { getAuthenticatedStudentId } from '@/lib/session-user';
import { calculateAndSyncUserReportCard, UserReportCardData } from '@/lib/report-card';
export type { UserReportCardData } from '@/lib/report-card';
import { db } from '@/lib/db';
import { aiReportCards } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Retrieves the live, verified AI Report Card for the authenticated student or specified student.
 * If the record exists in Supabase, returns it immediately, or computes an updated calculation
 * based on all historical Voice Coach sessions, POTD solutions, and ATS resume evaluations.
 */
export async function getUserReportCardAction(
  targetStudentId?: string
): Promise<{ success: boolean; reportCard: UserReportCardData | null; error?: string }> {
  try {
    const studentId = targetStudentId || (await getAuthenticatedStudentId());

    if (!studentId) {
      return { success: false, reportCard: null, error: 'Student profile not authenticated.' };
    }

    // Check if an existing report card already exists in Supabase
    if (db) {
      const existing = await db
        .select()
        .from(aiReportCards)
        .where(eq(aiReportCards.studentId, studentId))
        .limit(1);

      if (existing.length > 0) {
        const row = existing[0];
        const overall = Number(row.overallScore) || Number(row.knowledgeScore) || 0.0;
        
        // If overall score is 0 and user has completed interviews, run dynamic recalculation
        if (overall > 0 || row.totalInterviewsCompleted > 0) {
          const report: UserReportCardData = {
            studentId,
            overallScore: Number(row.overallScore) || 0.0,
            knowledgeScore: Number(row.knowledgeScore) || 0.0,
            confidenceScore: Number(row.confidenceScore) || 0.0,
            communicationScore: Number(row.communicationScore) || 0.0,
            examplesScore: Number(row.examplesScore) || 0.0,
            industryLevelScore: Number(row.industryLevelScore) || 0.0,
            wordsPerMinute: row.wordsPerMinute ?? 130,
            fillerCount: row.fillerCount ?? 0,
            paceRating: (row.paceRating as UserReportCardData['paceRating']) || 'Natural & Confident',
            latestDefenseExcerpt: row.latestDefenseExcerpt || 'No verbal transcript recorded.',
            totalInterviewsCompleted: row.totalInterviewsCompleted,
            totalPotdCompleted: row.totalPotdCompleted ?? 0,
            totalQuizzesCompleted: row.totalQuizzesCompleted ?? 0,
            strengths: Array.isArray(row.strengths) ? (row.strengths as string[]) : [],
            areasForImprovement: Array.isArray(row.areasForImprovement)
              ? (row.areasForImprovement as string[])
              : [],
            aiSummaryFeedback: row.aiSummaryFeedback || 'Verified technical competency record.',
            updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
            hasActivity: row.totalInterviewsCompleted > 0 || (row.totalPotdCompleted ?? 0) > 0,
          };

          return { success: true, reportCard: report };
        }
      }
    }

    // Otherwise, calculate dynamically from all activity
    const computed = await calculateAndSyncUserReportCard(studentId);
    return { success: true, reportCard: computed };
  } catch (err) {
    console.error('Failed to get user report card:', err);
    return { success: false, reportCard: null, error: 'Could not load report card.' };
  }
}

/**
 * Triggers an on-demand recalculation of the student's report card across all historical activities.
 */
export async function recalculateReportCardAction(): Promise<{
  success: boolean;
  reportCard: UserReportCardData | null;
}> {
  try {
    const studentId = await getAuthenticatedStudentId();
    if (!studentId) {
      return { success: false, reportCard: null };
    }

    const updated = await calculateAndSyncUserReportCard(studentId);
    return { success: true, reportCard: updated };
  } catch (err) {
    console.error('Failed to recalculate report card:', err);
    return { success: false, reportCard: null };
  }
}
