import { db } from './db';
import {
  aiReportCards,
  dailyCoachSubmissions,
  dailyPotdSubmissions,
  feedUserInteractions,
  resumeEvaluations,
  studentStats,
  profiles,
} from './db/schema';
import { desc, eq } from 'drizzle-orm';

export interface UserReportCardData {
  studentId: string;
  overallScore: number;
  knowledgeScore: number;
  confidenceScore: number;
  communicationScore: number;
  examplesScore: number;
  industryLevelScore: number;
  wordsPerMinute: number;
  fillerCount: number;
  paceRating: 'Natural & Confident' | 'Too Slow' | 'Rushed';
  latestDefenseExcerpt: string;
  totalInterviewsCompleted: number;
  totalPotdCompleted: number;
  totalQuizzesCompleted: number;
  strengths: string[];
  areasForImprovement: string[];
  aiSummaryFeedback: string;
  updatedAt: string;
  hasActivity: boolean;
}

/**
 * Calculates a live multi-axis AI report card aggregated across:
 * 1. Spoken AI Voice Coach interview submissions
 * 2. Problem of the Day (POTD) code/scenario solutions
 * 3. Daily Feed micro-quiz interactions
 * 4. ATS Resume evaluations
 * 5. Daily streak defense records
 *
 * Persists the resulting telemetry to Supabase PostgreSQL in the ai_report_cards table.
 */
export async function calculateAndSyncUserReportCard(
  studentId: string
): Promise<UserReportCardData | null> {
  if (!db || !studentId) {
    return null;
  }

  try {
    // 1. Fetch Student Profile
    const profileRows = await db
      .select({ id: profiles.id, fullName: profiles.fullName })
      .from(profiles)
      .where(eq(profiles.id, studentId))
      .limit(1);

    if (profileRows.length === 0) {
      return null;
    }

    // 2. Fetch Voice Coach Submissions
    const coachSubs = await db
      .select()
      .from(dailyCoachSubmissions)
      .where(eq(dailyCoachSubmissions.studentId, studentId))
      .orderBy(desc(dailyCoachSubmissions.createdAt));

    // 3. Fetch POTD Submissions
    const potdSubs = await db
      .select()
      .from(dailyPotdSubmissions)
      .where(eq(dailyPotdSubmissions.studentId, studentId))
      .orderBy(desc(dailyPotdSubmissions.createdAt));

    // 4. Fetch Feed Quiz Interactions
    const feedInteractions = await db
      .select()
      .from(feedUserInteractions)
      .where(eq(feedUserInteractions.userId, studentId));

    // 5. Fetch Latest Resume Evaluation
    const resumeRows = await db
      .select()
      .from(resumeEvaluations)
      .where(eq(resumeEvaluations.userId, studentId))
      .orderBy(desc(resumeEvaluations.createdAt))
      .limit(1);

    // 6. Fetch Student Stats
    const statRows = await db
      .select()
      .from(studentStats)
      .where(eq(studentStats.studentId, studentId))
      .limit(1);

    const stats = statRows[0] || null;
    const currentStreak = stats ? stats.currentStreak : 0;

    const totalInterviews = coachSubs.length;
    const totalPotd = potdSubs.length;
    const passedPotd = potdSubs.filter((p) => p.isCorrect || p.status === 'passed').length;
    const totalQuizzes = feedInteractions.filter((f) => f.quizId).length;
    const correctQuizzes = feedInteractions.filter((f) => f.isQuizCorrect).length;
    const totalPoints = stats?.totalPoints ?? 0;

    const hasActivity =
      totalInterviews > 0 ||
      totalPotd > 0 ||
      totalQuizzes > 0 ||
      resumeRows.length > 0 ||
      totalPoints > 0 ||
      currentStreak > 0;

    // If user has zero submissions of any kind, return default baseline
    if (!hasActivity) {
      const emptyReport: UserReportCardData = {
        studentId,
        overallScore: 0.0,
        knowledgeScore: 0.0,
        confidenceScore: 0.0,
        communicationScore: 0.0,
        examplesScore: 0.0,
        industryLevelScore: 0.0,
        wordsPerMinute: 0,
        fillerCount: 0,
        paceRating: 'Natural & Confident',
        latestDefenseExcerpt: '',
        totalInterviewsCompleted: 0,
        totalPotdCompleted: 0,
        totalQuizzesCompleted: 0,
        strengths: ['Account created and ready for daily practice challenges'],
        areasForImprovement: ['Complete a Problem of the Day, oral defense, or spark quiz to establish your baseline competency'],
        aiSummaryFeedback: 'Pending initial coding challenge, oral defense, or interactive quiz submission.',
        updatedAt: new Date().toISOString(),
        hasActivity: false,
      };

      await db
        .insert(aiReportCards)
        .values({
          studentId,
          overallScore: '0.0',
          knowledgeScore: '0.0',
          confidenceScore: '0.0',
          communicationScore: '0.0',
          examplesScore: '0.0',
          industryLevelScore: '0.0',
          wordsPerMinute: 0,
          fillerCount: 0,
          paceRating: 'Natural & Confident',
          latestDefenseExcerpt: '',
          totalInterviewsCompleted: 0,
          totalPotdCompleted: 0,
          totalQuizzesCompleted: 0,
          strengths: emptyReport.strengths,
          areasForImprovement: emptyReport.areasForImprovement,
          aiSummaryFeedback: emptyReport.aiSummaryFeedback,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: aiReportCards.studentId,
          set: {
            overallScore: '0.0',
            knowledgeScore: '0.0',
            confidenceScore: '0.0',
            communicationScore: '0.0',
            examplesScore: '0.0',
            industryLevelScore: '0.0',
            wordsPerMinute: 0,
            fillerCount: 0,
            updatedAt: new Date(),
          },
        });

      return emptyReport;
    }

    // -------------------------------------------------------------------------
    // Compute Multi-Axis Competency Metrics (Holistic Challenge Blend)
    // -------------------------------------------------------------------------

    // A. Knowledge Depth (0.0 - 10.0)
    // Combines: Coding challenge passes (POTD) + Feed quiz accuracy + Oral defense scores + XP points
    let knowledgeScore = 6.0;
    const knowledgeWeights: { score: number; weight: number }[] = [];

    if (totalPotd > 0) {
      const potdPassRate = passedPotd / totalPotd;
      const potdKnowledge = Math.min(9.8, 6.8 + potdPassRate * 2.0 + Math.min(1.0, passedPotd * 0.4));
      knowledgeWeights.push({ score: potdKnowledge, weight: 0.40 });
    }

    if (totalInterviews > 0) {
      let coachKnowledgeSum = 0;
      coachSubs.forEach((s) => {
        coachKnowledgeSum += Number(s.knowledgeScore) || 6.0;
      });
      const avgCoachKnowledge = coachKnowledgeSum / totalInterviews;
      knowledgeWeights.push({ score: avgCoachKnowledge, weight: 0.35 });
    }

    if (totalQuizzes > 0) {
      const quizAccuracy = correctQuizzes / totalQuizzes;
      const quizKnowledge = Math.min(9.5, 6.5 + quizAccuracy * 2.2 + Math.min(0.8, totalQuizzes * 0.2));
      knowledgeWeights.push({ score: quizKnowledge, weight: 0.25 });
    }

    if (knowledgeWeights.length > 0) {
      const totalWeight = knowledgeWeights.reduce((acc, curr) => acc + curr.weight, 0);
      knowledgeScore = knowledgeWeights.reduce((acc, curr) => acc + curr.score * curr.weight, 0) / totalWeight;
    } else if (totalPoints > 0) {
      knowledgeScore = Math.min(8.5, 6.0 + Math.min(2.5, totalPoints / 250));
    }
    // XP tier bonus (up to +0.4)
    if (totalPoints > 0) {
      knowledgeScore += Math.min(0.4, totalPoints / 1000);
    }
    knowledgeScore = Number(Math.min(9.9, Math.max(1.0, knowledgeScore)).toFixed(1));

    // B. Confidence & Pace (0.0 - 10.0)
    // Combines: Daily streak discipline + Code challenge execution reliability + Spoken cadence (if oral defense)
    let confidenceScore = 6.0;
    const confidenceWeights: { score: number; weight: number }[] = [];

    // Streak momentum
    let streakBonus = 0;
    if (currentStreak >= 14) streakBonus = 1.8;
    else if (currentStreak >= 7) streakBonus = 1.2;
    else if (currentStreak >= 3) streakBonus = 0.7;
    else if (currentStreak >= 1) streakBonus = 0.3;

    if (totalPotd > 0) {
      const passRate = passedPotd / totalPotd;
      const codingConfidence = Math.min(9.5, 6.5 + passRate * 2.0 + Math.min(0.8, passedPotd * 0.3));
      confidenceWeights.push({ score: codingConfidence, weight: 0.40 });
    }

    if (totalInterviews > 0) {
      let coachConfidenceSum = 0;
      coachSubs.forEach((s) => {
        coachConfidenceSum += Number(s.confidenceScore) || 6.5;
      });
      const avgCoachConfidence = coachConfidenceSum / totalInterviews;
      confidenceWeights.push({ score: avgCoachConfidence, weight: 0.40 });
    }

    if (totalQuizzes > 0) {
      const quizRate = correctQuizzes / totalQuizzes;
      confidenceWeights.push({ score: 6.8 + quizRate * 1.8, weight: 0.20 });
    }

    if (confidenceWeights.length > 0) {
      const totalWeight = confidenceWeights.reduce((acc, curr) => acc + curr.weight, 0);
      confidenceScore = confidenceWeights.reduce((acc, curr) => acc + curr.score * curr.weight, 0) / totalWeight;
    }
    confidenceScore += streakBonus;
    confidenceScore = Number(Math.min(9.9, Math.max(1.0, confidenceScore)).toFixed(1));

    // C. Communication (STAR structure, articulation, clarity) (0.0 - 10.0)
    // Combines: Oral defense articulation + Structured coding solutions + Resume impact articulation
    let communicationScore = 6.0;
    const commWeights: { score: number; weight: number }[] = [];

    if (totalInterviews > 0) {
      let coachCommSum = 0;
      coachSubs.forEach((s) => {
        coachCommSum += Number(s.communicationScore) || 6.5;
      });
      commWeights.push({ score: coachCommSum / totalInterviews, weight: 0.50 });
    }

    if (totalPotd > 0) {
      const structuredCodeScore = Math.min(9.5, 7.0 + Math.min(2.0, passedPotd * 0.6));
      commWeights.push({ score: structuredCodeScore, weight: 0.30 });
    }

    if (resumeRows.length > 0) {
      const resumeScore = Math.min(9.8, (resumeRows[0].overallAtsScore / 100) * 10);
      commWeights.push({ score: resumeScore, weight: 0.20 });
    }

    if (commWeights.length > 0) {
      const totalWeight = commWeights.reduce((acc, curr) => acc + curr.weight, 0);
      communicationScore = commWeights.reduce((acc, curr) => acc + curr.score * curr.weight, 0) / totalWeight;
    }
    communicationScore = Number(Math.min(9.9, Math.max(1.0, communicationScore)).toFixed(1));

    // D. Practical Examples & Systems Trade-offs (0.0 - 10.0)
    // Combines: Hands-on code implementations (POTD) + Systems keywords in speech + Quantified resume projects
    let examplesBase = 6.0;
    const exampleWeights: { score: number; weight: number }[] = [];

    if (totalPotd > 0) {
      const potdSystemsScore = Math.min(9.8, 6.8 + Math.min(2.5, passedPotd * 0.8));
      exampleWeights.push({ score: potdSystemsScore, weight: 0.45 });
    }

    if (totalInterviews > 0) {
      let metricMentions = 0;
      coachSubs.forEach((s) => {
        const text = (s.transcript || '').toLowerCase();
        if (
          text.includes('latency') ||
          text.includes('ms') ||
          text.includes('memory') ||
          text.includes('vram') ||
          text.includes('gpu') ||
          text.includes('throughput') ||
          text.includes('cache') ||
          text.includes('quantization') ||
          text.includes('tensor')
        ) {
          metricMentions += 1;
        }
      });
      const metricRatio = metricMentions / totalInterviews;
      const oralMetricsScore = Math.min(9.8, 5.5 + metricRatio * 4.0);
      exampleWeights.push({ score: oralMetricsScore, weight: 0.35 });
    }

    if (resumeRows.length > 0) {
      const resumeAts = (resumeRows[0].overallAtsScore / 100) * 10;
      exampleWeights.push({ score: resumeAts, weight: 0.20 });
    }

    if (exampleWeights.length > 0) {
      const totalWeight = exampleWeights.reduce((acc, curr) => acc + curr.weight, 0);
      examplesBase = exampleWeights.reduce((acc, curr) => acc + curr.score * curr.weight, 0) / totalWeight;
    }
    const examplesScore = Number(Math.min(9.9, Math.max(1.0, examplesBase)).toFixed(1));

    // E. Industry Readiness (Hiring Bar Alignment) (0.0 - 10.0)
    // Multi-challenge breadth + ATS resume benchmark + composite competence
    let industryReadiness =
      knowledgeScore * 0.35 +
      examplesScore * 0.25 +
      communicationScore * 0.20 +
      confidenceScore * 0.20;

    // Breadth bonus for engaging across multiple challenge modalities
    let activeModalitiesCount = 0;
    if (totalPotd > 0) activeModalitiesCount += 1;
    if (totalInterviews > 0) activeModalitiesCount += 1;
    if (totalQuizzes > 0) activeModalitiesCount += 1;
    if (resumeRows.length > 0) activeModalitiesCount += 1;
    industryReadiness += Math.min(0.8, activeModalitiesCount * 0.2);

    if (resumeRows.length > 0) {
      const atsScaled = (resumeRows[0].overallAtsScore / 100) * 10;
      industryReadiness = industryReadiness * 0.70 + atsScaled * 0.30;
    }
    const industryLevelScore = Number(Math.min(9.9, Math.max(1.0, industryReadiness)).toFixed(1));

    // Composite Index Overall Score
    const overallScore = Number(
      (
        knowledgeScore * 0.30 +
        examplesScore * 0.25 +
        industryLevelScore * 0.20 +
        confidenceScore * 0.15 +
        communicationScore * 0.10
      ).toFixed(1)
    );

    // -------------------------------------------------------------------------
    // Speech Cadence & Telemetry Synthesis
    // -------------------------------------------------------------------------
    let wordsPerMinute = 0;
    let fillerCount = 0;
    let latestDefenseExcerpt = '';

    if (totalInterviews > 0) {
      const latestSub = coachSubs[0];
      const transcript = latestSub.transcript || '';
      const words = transcript.trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      // Detect conversational filler words
      const fillerRegex = /\b(um|uh|like|basically|you know|sort of|kind of|i mean|right)\b/gi;
      const matchedFillers = transcript.match(fillerRegex) || [];
      fillerCount = matchedFillers.length;

      // Estimate WPM (assumes ~30-45s average duration if not logged)
      wordsPerMinute = Math.min(185, Math.max(90, Math.round((wordCount / 40) * 60)));

      if (transcript.length > 15) {
        latestDefenseExcerpt =
          transcript.length > 220 ? transcript.slice(0, 217) + '...' : transcript;
      }
    }

    let paceRating: 'Natural & Confident' | 'Too Slow' | 'Rushed' = 'Natural & Confident';
    if (wordsPerMinute > 0) {
      if (wordsPerMinute < 105) paceRating = 'Too Slow';
      else if (wordsPerMinute > 170) paceRating = 'Rushed';
    }

    // -------------------------------------------------------------------------
    // Synthesize Dynamic Strengths and Improvements
    // -------------------------------------------------------------------------
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (passedPotd >= 1) {
      strengths.push(`Proven algorithmic problem-solving in code (${passedPotd} POTD challenges passed)`);
    }

    if (totalQuizzes >= 1) {
      strengths.push(`Active conceptual retention on daily AI sparks and quizzes (${correctQuizzes}/${totalQuizzes} correct)`);
    }

    if (knowledgeScore >= 8.0) {
      strengths.push('Demonstrates rigorous technical grasp of foundational AI mechanisms and trade-offs');
    } else if (knowledgeScore >= 6.0) {
      strengths.push('Solid understanding of primary AI systems definitions and terminology');
    }

    if (totalInterviews > 0 && fillerCount <= 2) {
      strengths.push('Clean and disciplined verbal pacing with minimal conversational fillers');
    }

    if (currentStreak >= 3) {
      strengths.push(`Strong daily practice discipline with an active ${currentStreak}-day streak`);
    }

    if (resumeRows.length > 0 && resumeRows[0].overallAtsScore >= 75) {
      strengths.push(`High ATS resume match (${resumeRows[0].overallAtsScore}% score against frontier AI roles)`);
    }

    if (strengths.length === 0) {
      strengths.push('Active daily participant building foundational AI systems competence');
    }

    // Improvements guided by missing or lower-scoring modalities
    if (totalInterviews === 0) {
      improvements.push('Complete an oral defense on the AI Voice Coach to add spoken communication telemetry to your report card');
    } else if (fillerCount > 3) {
      improvements.push(`Reduce conversational filler pauses (detected ${fillerCount} fillers in recent answers)`);
    }

    if (totalPotd === 0) {
      improvements.push('Complete daily Problem of the Day challenges to reinforce practical code architecture intuition');
    }

    if (examplesScore < 7.0) {
      improvements.push('Incorporate explicit hardware and memory numbers (e.g. VRAM footprint, P95 latency ms)');
    }

    if (resumeRows.length === 0) {
      improvements.push('Scan your resume in the ATS Radar to benchmark your modern AI frameworks coverage');
    }

    if (improvements.length === 0) {
      improvements.push('Practice explaining distributed multi-node NCCL and speculative decoding trade-offs');
    }

    const aiSummaryFeedback =
      strengths[0] || 'Solid multi-axis demonstration of core AI systems competency.';

    // -------------------------------------------------------------------------
    // Upsert into Supabase PostgreSQL
    // -------------------------------------------------------------------------
    await db
      .insert(aiReportCards)
      .values({
        studentId,
        overallScore: overallScore.toFixed(1),
        knowledgeScore: knowledgeScore.toFixed(1),
        confidenceScore: confidenceScore.toFixed(1),
        communicationScore: communicationScore.toFixed(1),
        examplesScore: examplesScore.toFixed(1),
        industryLevelScore: industryLevelScore.toFixed(1),
        wordsPerMinute,
        fillerCount,
        paceRating,
        latestDefenseExcerpt,
        totalInterviewsCompleted: totalInterviews,
        totalPotdCompleted: totalPotd,
        totalQuizzesCompleted: totalQuizzes,
        strengths,
        areasForImprovement: improvements,
        aiSummaryFeedback,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: aiReportCards.studentId,
        set: {
          overallScore: overallScore.toFixed(1),
          knowledgeScore: knowledgeScore.toFixed(1),
          confidenceScore: confidenceScore.toFixed(1),
          communicationScore: communicationScore.toFixed(1),
          examplesScore: examplesScore.toFixed(1),
          industryLevelScore: industryLevelScore.toFixed(1),
          wordsPerMinute,
          fillerCount,
          paceRating,
          latestDefenseExcerpt,
          totalInterviewsCompleted: totalInterviews,
          totalPotdCompleted: totalPotd,
          totalQuizzesCompleted: totalQuizzes,
          strengths,
          areasForImprovement: improvements,
          aiSummaryFeedback,
          updatedAt: new Date(),
        },
      });

    return {
      studentId,
      overallScore,
      knowledgeScore,
      confidenceScore,
      communicationScore,
      examplesScore,
      industryLevelScore,
      wordsPerMinute,
      fillerCount,
      paceRating,
      latestDefenseExcerpt,
      totalInterviewsCompleted: totalInterviews,
      totalPotdCompleted: totalPotd,
      totalQuizzesCompleted: totalQuizzes,
      strengths,
      areasForImprovement: improvements,
      aiSummaryFeedback,
      updatedAt: new Date().toISOString(),
      hasActivity: true,
    };
  } catch (error) {
    console.error('Error calculating and syncing user report card:', error);
    return null;
  }
}
