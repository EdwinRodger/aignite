import { db } from '../lib/db';
import { dailyCoachQuestions, dailyPotdQuestions } from '../lib/db/schema';
import { DAILY_COACH_QUESTIONS } from '../lib/coach-data';
import { DAILY_POTD_CHALLENGES } from '../lib/potd-data';

export async function seedCoachAndPotd() {
  if (!db) {
    console.error('Database connection not available.');
    process.exit(1);
  }

  console.log('Seeding Supabase daily_coach_questions (Simple & Direct Beginner)...');
  for (const q of DAILY_COACH_QUESTIONS) {
    await db
      .insert(dailyCoachQuestions)
      .values({
        forDate: q.forDate,
        title: q.title,
        topic: q.topic,
        track: q.track,
        difficulty: q.difficulty,
        questionText: q.questionText,
        contextHint: q.contextHint,
        sampleKeyPoints: q.canonicalKeyPoints,
        suggestedModelAnswer: q.suggestedModelAnswer,
        estimatedSpeakingTime: q.estimatedSpeakingTime,
      })
      .onConflictDoUpdate({
        target: dailyCoachQuestions.forDate,
        set: {
          title: q.title,
          topic: q.topic,
          track: q.track,
          difficulty: q.difficulty,
          questionText: q.questionText,
          contextHint: q.contextHint,
          sampleKeyPoints: q.canonicalKeyPoints,
          suggestedModelAnswer: q.suggestedModelAnswer,
          estimatedSpeakingTime: q.estimatedSpeakingTime,
        },
      });
  }
  console.log('daily_coach_questions seeded.');

  console.log('Seeding Supabase daily_potd_questions (Simple & Direct MCQ, Varied Options)...');
  for (const p of DAILY_POTD_CHALLENGES) {
    await db
      .insert(dailyPotdQuestions)
      .values({
        forDate: p.forDate,
        title: p.title,
        topic: p.topic,
        track: p.track,
        difficulty: p.difficulty,
        problemStatement: p.problemStatement,
        scenario: p.scenario || null,
        codeSnippet: null,
        formulaDisplay: p.formula ? JSON.stringify(p.formula) : null,
        options: p.options,
        correctOptionIndex: p.correctOptionIndex,
        explanation: p.explanation,
        hint: p.hint,
        pointsReward: p.pointsReward,
      })
      .onConflictDoUpdate({
        target: dailyPotdQuestions.forDate,
        set: {
          title: p.title,
          topic: p.topic,
          track: p.track,
          difficulty: p.difficulty,
          problemStatement: p.problemStatement,
          scenario: p.scenario || null,
          codeSnippet: null,
          formulaDisplay: p.formula ? JSON.stringify(p.formula) : null,
          options: p.options,
          correctOptionIndex: p.correctOptionIndex,
          explanation: p.explanation,
          hint: p.hint,
          pointsReward: p.pointsReward,
        },
      });
  }
  console.log('daily_potd_questions seeded with simple MCQ content.');
}

seedCoachAndPotd()
  .then(() => {
    console.log('Supabase seeding finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding coach & potd:', err);
    process.exit(1);
  });
