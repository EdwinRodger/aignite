'use server';

import { db } from '@/lib/db';
import { deepDives, deepDiveQuizzes, deepDiveUserInteractions } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getAuthenticatedStudentId } from '@/lib/session-user';
import { CURATED_DEEP_DIVES, DeepDive } from '@/lib/deep-dives-data';

// In-memory guest / offline fallback store for interactions
const guestLikes = new Set<string>();
const guestBookmarks = new Set<string>();
const guestQuizResponses = new Map<string, { selectedIndex: number; isCorrect: boolean }>();

/**
 * Fetch architecture deep-dives from Supabase PostgreSQL.
 * Seamlessly hydrates with student interaction states (liked, bookmarked, quiz solved).
 * Gracefully falls back to the curated baseline if the database table is empty or offline.
 */
export async function getDeepDivesAction(params?: {
  category?: string;
  search?: string;
  bookmarkedOnly?: boolean;
}): Promise<{
  success: boolean;
  deepDives: DeepDive[];
  error?: string;
}> {
  try {
    const studentId = await getAuthenticatedStudentId();
    let items: DeepDive[] = [];

    if (db) {
      try {
        const dbRows = await db
          .select()
          .from(deepDives)
          .orderBy(desc(deepDives.createdAt));

        if (dbRows && dbRows.length > 0) {
          // Fetch quizzes
          const allQuizzes = await db.select().from(deepDiveQuizzes);
          const quizMap = new Map(allQuizzes.map((q) => [q.deepDiveId, q]));

          // Fetch user interactions if student is authenticated
          let userInteractionsMap = new Map<string, {
            liked: boolean;
            bookmarked: boolean;
            quizCompleted: boolean;
            selectedOptionIndex: number | null;
            isQuizCorrect: boolean | null;
          }>();

          if (studentId) {
            const interactions = await db
              .select()
              .from(deepDiveUserInteractions)
              .where(eq(deepDiveUserInteractions.userId, studentId));

            userInteractionsMap = new Map(
              interactions.map((i) => [
                i.deepDiveId,
                {
                  liked: i.liked,
                  bookmarked: i.bookmarked,
                  quizCompleted: i.quizCompleted,
                  selectedOptionIndex: i.selectedOptionIndex,
                  isQuizCorrect: i.isQuizCorrect,
                },
              ])
            );
          }

          items = dbRows.map((row) => {
            const quizRow = quizMap.get(row.id);
            const userState = userInteractionsMap.get(row.id);

            const fallbackCurated = CURATED_DEEP_DIVES.find(
              (c) => c.slug === row.slug || c.id === row.id
            );

            return {
              id: row.id,
              slug: row.slug,
              title: row.title,
              summary: row.summary,
              keyTakeaway: row.keyTakeaway,
              sourceName: row.sourceName,
              sourceUrl: row.sourceUrl,
              category: row.category as DeepDive['category'],
              tagBadge: row.tagBadge,
              readTime: row.readTime,
              difficulty: row.difficulty as DeepDive['difficulty'],
              likesCount: row.likesCount,
              bookmarksCount: row.bookmarksCount,
              metrics: row.metrics || fallbackCurated?.metrics || [],
              diagramComparison: row.diagramComparison || fallbackCurated?.diagramComparison || {
                before: 'Baseline architecture',
                after: 'Optimized system',
                advantage: 'Higher throughput and lower latency',
              },
              quiz: quizRow
                ? {
                    id: quizRow.id,
                    deepDiveId: row.id,
                    questionText: quizRow.questionText,
                    options: (Array.isArray(quizRow.options)
                      ? quizRow.options
                      : JSON.parse(quizRow.options as unknown as string)) as string[],
                    correctOptionIndex: quizRow.correctOptionIndex,
                    explanation: quizRow.explanation,
                  }
                : fallbackCurated?.quiz || {
                    id: `quiz-${row.id}`,
                    deepDiveId: row.id,
                    questionText: 'Verify your understanding of this architecture breakdown.',
                    options: ['Option A', 'Option B', 'Option C'],
                    correctOptionIndex: 0,
                    explanation: 'Review the architectural trade-offs in the telemetry comparison.',
                  },
              createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recently',
              isLiked: userState?.liked || guestLikes.has(row.id),
              isBookmarked: userState?.bookmarked || guestBookmarks.has(row.id),
              isQuizCompleted: userState?.quizCompleted || guestQuizResponses.has(row.id),
              userSelectedOptionIndex: userState?.selectedOptionIndex ?? guestQuizResponses.get(row.id)?.selectedIndex,
              isUserQuizCorrect: userState?.isQuizCorrect ?? guestQuizResponses.get(row.id)?.isCorrect,
            };
          });
        }
      } catch (dbErr) {
        console.warn('Database query for deep dives failed, falling back to curated bank:', dbErr);
      }
    }

    // If database table was empty or not yet seeded, serve curated deep-dive bank
    if (items.length === 0) {
      items = CURATED_DEEP_DIVES.map((d) => ({
        ...d,
        isLiked: guestLikes.has(d.id),
        isBookmarked: guestBookmarks.has(d.id),
        isQuizCompleted: guestQuizResponses.has(d.id),
        userSelectedOptionIndex: guestQuizResponses.get(d.id)?.selectedIndex,
        isUserQuizCorrect: guestQuizResponses.get(d.id)?.isCorrect,
      }));
    }

    // Apply category filter
    if (params?.category && params.category !== 'All') {
      items = items.filter(
        (item) =>
          item.category.toLowerCase() === params.category!.toLowerCase() ||
          item.tagBadge.toLowerCase().includes(params.category!.toLowerCase())
      );
    }

    // Apply keyword search
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.keyTakeaway.toLowerCase().includes(q) ||
          item.sourceName.toLowerCase().includes(q) ||
          item.tagBadge.toLowerCase().includes(q) ||
          item.metrics.some((m) => m.label.toLowerCase().includes(q) || m.value.toLowerCase().includes(q))
      );
    }

    // Apply bookmark filter
    if (params?.bookmarkedOnly) {
      items = items.filter((item) => item.isBookmarked);
    }

    return { success: true, deepDives: items };
  } catch (error) {
    console.error('Error in getDeepDivesAction:', error);
    return { success: true, deepDives: CURATED_DEEP_DIVES };
  }
}

/**
 * Validates a deep-dive technical verification checkpoint without XP or gamification.
 * Persists the student response to Supabase.
 */
export async function submitDeepDiveQuizAction(
  deepDiveId: string,
  quizId: string,
  selectedOptionIndex: number
): Promise<{
  success: boolean;
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
}> {
  try {
    const studentId = await getAuthenticatedStudentId();

    // 1. Check in Supabase deepDiveQuizzes first if available
    let correctOptionIndex = 0;
    let explanation = '';
    let foundQuiz = false;

    if (db && quizId && quizId.length === 36) {
      try {
        const rows = await db
          .select()
          .from(deepDiveQuizzes)
          .where(eq(deepDiveQuizzes.id, quizId))
          .limit(1);

        if (rows.length > 0) {
          correctOptionIndex = rows[0].correctOptionIndex;
          explanation = rows[0].explanation;
          foundQuiz = true;
        }
      } catch {
        // Fallback to curated data
      }
    }

    // 2. Check in curated items
    if (!foundQuiz) {
      const match = CURATED_DEEP_DIVES.find(
        (d) => d.id === deepDiveId || d.quiz.id === quizId
      );
      if (match) {
        correctOptionIndex = match.quiz.correctOptionIndex;
        explanation = match.quiz.explanation;
        foundQuiz = true;
      }
    }

    if (!foundQuiz) {
      return {
        success: false,
        isCorrect: false,
        correctIndex: 0,
        explanation: 'Deep-dive checkpoint verification not found.',
      };
    }

    const isCorrect = correctOptionIndex === selectedOptionIndex;

    // 3. Persist to Supabase if authenticated
    if (db && studentId && deepDiveId && deepDiveId.length === 36) {
      try {
        const existing = await db
          .select()
          .from(deepDiveUserInteractions)
          .where(
            and(
              eq(deepDiveUserInteractions.userId, studentId),
              eq(deepDiveUserInteractions.deepDiveId, deepDiveId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(deepDiveUserInteractions)
            .set({
              quizCompleted: true,
              selectedOptionIndex,
              isQuizCorrect: isCorrect,
              interactedAt: new Date(),
            })
            .where(eq(deepDiveUserInteractions.id, existing[0].id));
        } else {
          await db.insert(deepDiveUserInteractions).values({
            userId: studentId,
            deepDiveId,
            liked: false,
            bookmarked: false,
            quizCompleted: true,
            selectedOptionIndex,
            isQuizCorrect: isCorrect,
            interactedAt: new Date(),
          });
        }
      } catch (persistErr) {
        console.warn('Failed to persist quiz interaction to Supabase:', persistErr);
      }
    } else {
      // Record guest response
      guestQuizResponses.set(deepDiveId, { selectedIndex: selectedOptionIndex, isCorrect });
    }

    return {
      success: true,
      isCorrect,
      correctIndex: correctOptionIndex,
      explanation,
    };
  } catch (error) {
    console.error('Error validating deep dive quiz:', error);
    return {
      success: false,
      isCorrect: false,
      correctIndex: 0,
      explanation: 'An unexpected error occurred while verifying your answer.',
    };
  }
}

/**
 * Toggle like for a deep dive and persist state to Supabase PostgreSQL.
 */
export async function toggleDeepDiveLikeAction(deepDiveId: string): Promise<{
  success: boolean;
  deepDiveId: string;
  isLiked: boolean;
  likesCount: number;
}> {
  try {
    const studentId = await getAuthenticatedStudentId();

    if (db && studentId && deepDiveId && deepDiveId.length === 36) {
      try {
        const existing = await db
          .select()
          .from(deepDiveUserInteractions)
          .where(
            and(
              eq(deepDiveUserInteractions.userId, studentId),
              eq(deepDiveUserInteractions.deepDiveId, deepDiveId)
            )
          )
          .limit(1);

        let newLikedState = true;

        if (existing.length > 0) {
          newLikedState = !existing[0].liked;
          await db
            .update(deepDiveUserInteractions)
            .set({
              liked: newLikedState,
              interactedAt: new Date(),
            })
            .where(eq(deepDiveUserInteractions.id, existing[0].id));
        } else {
          await db.insert(deepDiveUserInteractions).values({
            userId: studentId,
            deepDiveId,
            liked: true,
            bookmarked: false,
            quizCompleted: false,
            interactedAt: new Date(),
          });
        }

        // Update likesCount on deepDives table
        const targetDive = await db
          .select({ likesCount: deepDives.likesCount })
          .from(deepDives)
          .where(eq(deepDives.id, deepDiveId))
          .limit(1);

        let currentLikes = targetDive.length > 0 ? targetDive[0].likesCount : 0;
        const updatedLikes = Math.max(0, currentLikes + (newLikedState ? 1 : -1));

        await db
          .update(deepDives)
          .set({ likesCount: updatedLikes, updatedAt: new Date() })
          .where(eq(deepDives.id, deepDiveId));

        return {
          success: true,
          deepDiveId,
          isLiked: newLikedState,
          likesCount: updatedLikes,
        };
      } catch (err) {
        console.warn('Database like toggle failed:', err);
      }
    }

    // Guest fallback
    const isCurrentlyLiked = guestLikes.has(deepDiveId);
    const nextState = !isCurrentlyLiked;
    if (nextState) {
      guestLikes.add(deepDiveId);
    } else {
      guestLikes.delete(deepDiveId);
    }

    const baseline = CURATED_DEEP_DIVES.find((d) => d.id === deepDiveId);
    const baseCount = baseline ? baseline.likesCount : 100;
    const nextCount = baseCount + (nextState ? 1 : 0);

    return {
      success: true,
      deepDiveId,
      isLiked: nextState,
      likesCount: nextCount,
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      deepDiveId,
      isLiked: false,
      likesCount: 0,
    };
  }
}

/**
 * Toggle bookmark for a deep dive and persist state to Supabase PostgreSQL.
 */
export async function toggleDeepDiveBookmarkAction(deepDiveId: string): Promise<{
  success: boolean;
  deepDiveId: string;
  isBookmarked: boolean;
  bookmarksCount: number;
}> {
  try {
    const studentId = await getAuthenticatedStudentId();

    if (db && studentId && deepDiveId && deepDiveId.length === 36) {
      try {
        const existing = await db
          .select()
          .from(deepDiveUserInteractions)
          .where(
            and(
              eq(deepDiveUserInteractions.userId, studentId),
              eq(deepDiveUserInteractions.deepDiveId, deepDiveId)
            )
          )
          .limit(1);

        let newBookmarkState = true;

        if (existing.length > 0) {
          newBookmarkState = !existing[0].bookmarked;
          await db
            .update(deepDiveUserInteractions)
            .set({
              bookmarked: newBookmarkState,
              interactedAt: new Date(),
            })
            .where(eq(deepDiveUserInteractions.id, existing[0].id));
        } else {
          await db.insert(deepDiveUserInteractions).values({
            userId: studentId,
            deepDiveId,
            liked: false,
            bookmarked: true,
            quizCompleted: false,
            interactedAt: new Date(),
          });
        }

        // Update bookmarksCount on deepDives table
        const targetDive = await db
          .select({ bookmarksCount: deepDives.bookmarksCount })
          .from(deepDives)
          .where(eq(deepDives.id, deepDiveId))
          .limit(1);

        let currentBookmarks = targetDive.length > 0 ? targetDive[0].bookmarksCount : 0;
        const updatedBookmarks = Math.max(0, currentBookmarks + (newBookmarkState ? 1 : -1));

        await db
          .update(deepDives)
          .set({ bookmarksCount: updatedBookmarks, updatedAt: new Date() })
          .where(eq(deepDives.id, deepDiveId));

        return {
          success: true,
          deepDiveId,
          isBookmarked: newBookmarkState,
          bookmarksCount: updatedBookmarks,
        };
      } catch (err) {
        console.warn('Database bookmark toggle failed:', err);
      }
    }

    // Guest fallback
    const isCurrentlyBookmarked = guestBookmarks.has(deepDiveId);
    const nextState = !isCurrentlyBookmarked;
    if (nextState) {
      guestBookmarks.add(deepDiveId);
    } else {
      guestBookmarks.delete(deepDiveId);
    }

    const baseline = CURATED_DEEP_DIVES.find((d) => d.id === deepDiveId);
    const baseCount = baseline ? baseline.bookmarksCount : 50;
    const nextCount = baseCount + (nextState ? 1 : 0);

    return {
      success: true,
      deepDiveId,
      isBookmarked: nextState,
      bookmarksCount: nextCount,
    };
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return {
      success: false,
      deepDiveId,
      isBookmarked: false,
      bookmarksCount: 0,
    };
  }
}
