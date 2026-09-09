# Database Seeding & Production Migration Guide

This document outlines the complete architectural roadmap and step-by-step procedures to transition AIgnite from its current **hackathon-resilient demo state** (hybrid live APIs + deterministic local fallbacks) to **100% live database hydration & production multi-tenancy**.

---

## 1. Overview of Current vs. Production Architecture

### Current State (Hackathon Resilient Mode)
- **Gemini 2.0 Flash**: Live for Voice Coach and Resume ATS scoring.
- **Supabase Auth**: Dispatches real OTP if configured, but accepts local demo bypass (`123456`) and seeds cookies for rapid judging evaluation.
- **Data Layers**: Dashboards, candidate talent pools, and leaderboards read from curated seed constants in `/lib/*-data.ts` to ensure 0% chance of empty screens or missing network connection during live presentations.

### Target Production State (Live Database Hydration)
- **Supabase PostgreSQL & Drizzle ORM**: The single source of truth for all profiles, stats, report cards, company packs, feed sparks, and job listings.
- **Dynamic Session Identity**: Dashboards query the active authenticated session (`auth.uid()`) to display the user's real name, streak, and XP.
- **Dynamic Recruiter Pipeline**: When a student records a spoken answer on `/coach`, their real report card is inserted into `ai_report_cards` and instantly searchable by verified recruiters on `/recruiter/dashboard`.
- **Clean Auth**: All hackathon demo quick-fill buttons and bypass codes (`123456`) are removed.

---

## 2. Step-by-Step Migration Plan

### Step 1: Database Schema Deployment
Ensure all tables defined in `lib/db/schema.ts` exist in your live Supabase database.

```bash
# Push Drizzle schema directly to Supabase PostgreSQL pooler
npx drizzle-kit push
```

Tables created:
1. `profiles` (Students, Recruiters, Admins, roles, verification status)
2. `student_stats` (Streaks, points, league tier, weekly ranking)
3. `ai_report_cards` (5-axis scores, speech metrics, strengths, improvement areas)
4. `course_packs` (Company packs metadata, badge associations)
5. `feed_posts` & `feed_post_quizzes` & `feed_user_interactions` (AI sparks, quizzes, likes, bookmarks)
6. `daily_coach_questions` & `daily_coach_submissions` (Voice coach POTD and transcripts)
7. `resume_evaluations` (ATS scores, domain matches, skill gaps, pgvector embeddings)
8. `job_postings` (Recruiter roles, salary, location, minimum tier and badge criteria)

---

### Step 2: One-Time Database Seeding Script

Create and execute `scripts/seed.ts` to populate baseline data so that your production database launches pre-populated with:
- The 5 Company Packs (Google, NVIDIA, OpenAI, Meta, Microsoft).
- The 8 Curated Feed Sparks & Micro-Quizzes.
- The 30-Student Competitive Bracket Roster.
- The 6 Top Candidate Talent Profiles (with real report cards and badges).
- Curated AI Engineering Job Postings.

#### Sample Seeding Runner:
```bash
npx tsx scripts/seed.ts
```

---

### Step 3: Server Action Refactoring (Querying Supabase)

Replace static array reads in `app/actions/` with Drizzle ORM / Supabase queries:

1. **`app/actions/recruiter.ts`**:
   - `getCandidateTalentPoolAction()`: Replace `TALENT_POOL_SEEDS` with:
     ```ts
     const candidates = await db.query.profiles.findMany({
       where: eq(profiles.role, 'student'),
       with: {
         stats: true,
         reportCard: true,
       },
     });
     ```
   - `createJobPostingAction()`: Insert directly into `job_postings` table.
   - `sendInterviewInvitationAction()`: Insert into `interview_invitations` table.

2. **`app/actions/league.ts`**:
   - `getLeagueBracket()`: Query `student_stats` sorted by `league_points_this_week DESC` partitioned into 30-student cohorts.

3. **`app/actions/feed.ts`**:
   - `getFeedPosts()`: Query `feed_posts` with relational `feed_post_quizzes`.

4. **`app/actions/coach.ts`**:
   - `evaluateCoachAnswerAction()`: In addition to returning the report, insert a row into `daily_coach_submissions` and upsert `ai_report_cards` for the authenticated student.

---

### Step 4: Dynamic Dashboard Hydration

1. **Student Dashboard (`app/(student)/dashboard/page.tsx`)**:
   - Replace static `const user = { name: 'Aarav Sharma', ... }` with a Server Component fetch or action call:
     ```ts
     const session = await getAuthenticatedSession();
     const profile = await db.query.profiles.findFirst({
       where: eq(profiles.id, session.userId),
       with: { stats: true, reportCard: true },
     });
     ```

2. **Recruiter Dashboard (`app/(recruiter)/recruiter/dashboard/page.tsx`)**:
   - Replace static `const recruiterCompany = 'Google DeepMind'` with:
     ```ts
     const recruiter = await db.query.profiles.findFirst({
       where: eq(profiles.id, session.userId),
     });
     ```

---

### Step 5: Clean Up Demo & Hackathon UI Elements

When ready for strict public production:
1. In `app/(auth)/login/page.tsx`: Remove the `⚡ SIH Hackathon Demo Quick-Fill` buttons.
2. In `app/(auth)/verify-otp/page.tsx`: Remove the `Auto-fill 123456` button.
3. In `app/actions/auth.ts`: Remove the `token === '123456'` fallback and the pre-approved email check (`@google.com`, `@nvidia.com`).
4. In `app/(recruiter)/recruiter/login/page.tsx`: Remove the `⚡ SIH Evaluator Quick-Test` shortcuts.

---

## 3. Checklist for Production Cutover

- [ ] Supabase project created with PostgreSQL 16 & `pgvector` extension enabled.
- [ ] Environment variables set in Vercel / production host (.env.production):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
  - `DATABASE_URL` (Supabase Transaction Pooler port 6543)
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL` (e.g. `gemini-2.5-flash`)
  - `RESEND_API_KEY`
- [ ] Schema migrated via `npx drizzle-kit push`.
- [ ] Baseline seeds populated via `npx tsx scripts/seed.ts`.
- [ ] Demo bypass codes and quick-fill UI buttons deactivated.
- [ ] Production smoke test: Register real email $\rightarrow$ receive real OTP $\rightarrow$ complete onboarding $\rightarrow$ record mock interview $\rightarrow$ verify appearance in recruiter search.
