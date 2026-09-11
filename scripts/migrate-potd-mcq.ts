import { db } from '../lib/db';

export async function migratePotdMcq() {
  if (!db) {
    console.error('Database connection not available.');
    process.exit(1);
  }

  console.log('Running POTD MCQ schema migration in Supabase...');

  await db.execute(`
    ALTER TABLE daily_potd_questions
    ADD COLUMN IF NOT EXISTS scenario TEXT,
    ADD COLUMN IF NOT EXISTS code_snippet TEXT,
    ADD COLUMN IF NOT EXISTS formula_display TEXT,
    ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS correct_option_index INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS explanation TEXT,
    ADD COLUMN IF NOT EXISTS hint TEXT;

    ALTER TABLE daily_potd_submissions
    ADD COLUMN IF NOT EXISTS selected_option_index INTEGER,
    ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;
  `);

  console.log('POTD MCQ schema migration finished successfully.');
}

migratePotdMcq()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
  });
