import { db } from '../lib/db';

export async function runMigration() {
  if (!db) {
    console.error('Database connection not available.');
    process.exit(1);
  }

  console.log('Running Supabase migration...');

  await db.execute(`
    ALTER TABLE daily_coach_questions 
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS track TEXT,
    ADD COLUMN IF NOT EXISTS context_hint TEXT,
    ADD COLUMN IF NOT EXISTS suggested_model_answer TEXT,
    ADD COLUMN IF NOT EXISTS estimated_speaking_time TEXT;

    CREATE TABLE IF NOT EXISTS daily_potd_questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      for_date TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      track TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Beginner' NOT NULL,
      problem_statement TEXT NOT NULL,
      context_hint TEXT,
      starter_code TEXT,
      test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
      solution_explanation TEXT,
      canonical_solution TEXT,
      points_reward INTEGER DEFAULT 25 NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS daily_potd_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      potd_id UUID REFERENCES daily_potd_questions(id) ON DELETE CASCADE NOT NULL,
      submitted_code TEXT NOT NULL,
      status TEXT DEFAULT 'passed' NOT NULL,
      points_awarded INTEGER DEFAULT 25 NOT NULL,
      feedback TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('Migration completed successfully.');
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
