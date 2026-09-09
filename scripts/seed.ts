/**
 * Supabase Seeding Runner Script
 * Usage: npx tsx scripts/seed.ts
 *
 * Populates Supabase database with all baseline profiles, stats, report cards,
 * company packs, feed sparks, and daily coach questions.
 * Reference: docs/DATABASE_SEEDING_AND_PRODUCTION_MIGRATION.md
 */

import { db } from '../lib/db';
import {
  profiles,
  studentStats,
  aiReportCards,
  coursePacks,
  feedPosts,
  feedPostQuizzes,
  dailyCoachQuestions,
  jobPostings,
} from '../lib/db/schema';
import {
  SEED_COURSE_PACKS,
  SEED_CANDIDATE_TALENT,
  SEED_FEED_POSTS,
  SEED_DAILY_COACH_QUESTIONS,
  SEED_JOB_POSTINGS,
} from './seed-data';

// Deterministic UUID generator for stable seeding
function createSeedUuid(prefix: string, id: number | string): string {
  const hex = Buffer.from(prefix + id).toString('hex').padEnd(32, '0').slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    '4' + hex.slice(13, 16),
    'a' + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join('-');
}

export async function seedDatabase() {
  if (!db) {
    console.error('DATABASE_URL is not set. Please provide your Supabase database connection string in .env.local.');
    process.exit(1);
  }

  console.log('--- Starting AIgnite Supabase Seed ---');

  try {
    // 1. Seed Course Packs
    console.log('Seeding Course Packs...');
    for (const pack of SEED_COURSE_PACKS) {
      await db.insert(coursePacks).values({
        slug: pack.slug,
        title: pack.title,
        companyName: pack.companyName,
        description: pack.description,
        badgeName: pack.badgeName,
        badgeIcon: pack.badgeIcon,
        topicsCount: pack.modulesCount,
      }).onConflictDoNothing();
    }
    console.log('Course Packs seeded.');

    // 2. Seed Candidate Profiles, Student Stats & Report Cards
    console.log('Seeding Candidate Profiles & Report Cards...');
    for (let i = 0; i < SEED_CANDIDATE_TALENT.length; i++) {
      const c = SEED_CANDIDATE_TALENT[i];
      const studentId = createSeedUuid('student_', i + 1);

      // Profile
      await db.insert(profiles).values({
        id: studentId,
        role: 'student',
        fullName: c.fullName,
        username: c.fullName.toLowerCase().replace(/\s+/g, '_'),
        headline: c.headline,
        collegeOrCompany: c.collegeOrCompany,
        region: c.region,
        isVerified: true,
        verificationStatus: 'approved',
        githubUrl: c.githubUrl,
        linkedinUrl: c.linkedinUrl,
      }).onConflictDoNothing();

      // Student Stats
      await db.insert(studentStats).values({
        studentId: studentId,
        totalPoints: c.leaguePoints,
        currentStreak: c.streakDays,
        highestStreak: c.streakDays + 4,
        currentLeagueTier: c.leagueTier,
        leaguePointsThisWeek: c.leaguePoints,
        overallRanking: c.weeklyRank,
      }).onConflictDoNothing();

      // AI Report Card
      await db.insert(aiReportCards).values({
        studentId: studentId,
        knowledgeScore: c.reportCard.knowledgeScore.toFixed(1),
        confidenceScore: c.reportCard.confidenceScore.toFixed(1),
        communicationScore: c.reportCard.communicationScore.toFixed(1),
        examplesScore: c.reportCard.examplesScore.toFixed(1),
        industryLevelScore: c.reportCard.industryLevelScore.toFixed(1),
        totalInterviewsCompleted: c.reportCard.speechMetrics.totalInterviews,
        strengths: c.reportCard.strengths,
        areasForImprovement: c.reportCard.improvementAreas,
        aiSummaryFeedback: c.reportCard.recentModelAnswerExcerpt,
      }).onConflictDoNothing();
    }
    console.log('Candidate Profiles & Report Cards seeded.');

    // 3. Seed Feed Posts & Quizzes
    console.log('Seeding AI Sparks Feed & Micro-Quizzes...');
    for (let i = 0; i < SEED_FEED_POSTS.length; i++) {
      const p = SEED_FEED_POSTS[i];
      const postId = createSeedUuid('feed_', i + 1);

      await db.insert(feedPosts).values({
        id: postId,
        title: p.title,
        summary: p.summary,
        keyTakeaway: p.keyTakeaway,
        sourceName: p.sourceName,
        sourceUrl: p.sourceUrl,
        mediaUrl: '/feed/' + p.id + '.png',
        category: p.category,
        likesCount: p.likesCount,
      }).onConflictDoNothing();

      if (p.quiz) {
        await db.insert(feedPostQuizzes).values({
          id: createSeedUuid('quiz_', i + 1),
          postId: postId,
          questionText: p.quiz.questionText,
          options: p.quiz.options,
          correctOptionIndex: p.quiz.correctOptionIndex,
          explanation: p.quiz.explanation,
          pointsAwarded: p.quiz.pointsAwarded,
        }).onConflictDoNothing();
      }
    }
    console.log('AI Sparks Feed & Quizzes seeded.');

    // 4. Seed Daily Coach Questions
    console.log('Seeding Daily Coach Questions (POTD)...');
    for (let i = 0; i < SEED_DAILY_COACH_QUESTIONS.length; i++) {
      const q = SEED_DAILY_COACH_QUESTIONS[i];
      await db.insert(dailyCoachQuestions).values({
        id: createSeedUuid('coach_', i + 1),
        forDate: q.forDate,
        topic: q.topic,
        questionText: q.questionText,
        sampleKeyPoints: q.canonicalKeyPoints,
        difficulty: q.difficulty,
      }).onConflictDoNothing();
    }
    console.log('Daily Coach Questions seeded.');

    // 5. Seed Job Postings
    console.log('Seeding Job Postings...');
    const recruiterId = createSeedUuid('recruiter_', 1);
    // Create seed recruiter first
    await db.insert(profiles).values({
      id: recruiterId,
      role: 'recruiter',
      fullName: 'Priya Venkatesh',
      username: 'priya_deepmind',
      collegeOrCompany: 'Google DeepMind',
      recruiterDesignation: 'Talent Acquisition Lead (GenAI & Systems)',
      isVerified: true,
      verificationStatus: 'approved',
      workEmail: 'priya@google.com',
    }).onConflictDoNothing();

    for (let i = 0; i < SEED_JOB_POSTINGS.length; i++) {
      const j = SEED_JOB_POSTINGS[i];
      await db.insert(jobPostings).values({
        id: createSeedUuid('job_', i + 1),
        recruiterId: recruiterId,
        companyName: j.companyName,
        companyLogoUrl: j.companyLogo,
        title: j.title,
        roleCategory: j.roleCategory,
        description: j.description,
        minimumLeagueTier: j.minLeagueTier,
        requiredBadges: j.requiredBadges,
        minReportCardScore: j.minReportScore.toFixed(1),
        salaryRange: j.salaryRange,
        location: j.location,
        isActive: true,
      }).onConflictDoNothing();
    }
    console.log('Job Postings seeded.');

    console.log('--- Supabase Seed Complete! ---');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Auto-run if executed via CLI
if (require.main === module || process.argv[1]?.includes('seed.ts')) {
  seedDatabase().then(() => process.exit(0));
}
