import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
const env = fs.readFileSync(envPath, 'utf8');
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

async function main() {
  const { calculateAndSyncUserReportCard } = await import('../lib/report-card');
  const { db } = await import('../lib/db');
  const { aiReportCards } = await import('../lib/db/schema');
  const { eq } = await import('drizzle-orm');

  const vaidikId = '16edeac0-5739-4bdd-8c0d-4b8e931c5fb4';
  console.log('Calculating report card for student Vaidik...');
  const res = await calculateAndSyncUserReportCard(vaidikId);
  console.log('Calculation Result:');
  console.log(JSON.stringify(res, null, 2));

  if (db) {
    const { resumeEvaluations, studentStats } = await import('../lib/db/schema');
    const reports = await db.select().from(aiReportCards).limit(4);
    console.log('\n--- LIVE ai_report_cards in Supabase ---');
    console.table(reports.map(r => ({
      studentId: r.studentId,
      overallScore: r.overallScore,
      knowledge: r.knowledgeScore,
      confidence: r.confidenceScore,
      potdCompleted: r.totalPotdCompleted,
      interviewsCompleted: r.totalInterviewsCompleted,
    })));

    const resumes = await db.select().from(resumeEvaluations).limit(4);
    console.log('\n--- LIVE resume_evaluations in Supabase ---');
    console.table(resumes.map(r => ({
      userId: r.userId,
      atsScore: r.overallAtsScore,
      targetRole: r.parsedData?.targetRole,
      hasParsedData: Boolean(r.parsedData),
    })));

    const stats = await db.select().from(studentStats).limit(4);
    console.log('\n--- LIVE student_stats in Supabase ---');
    console.table(stats.map(s => ({
      studentId: s.studentId,
      points: s.totalPoints,
      streak: s.currentStreak,
      tier: s.currentLeagueTier,
    })));
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running test:', err);
  process.exit(1);
});
