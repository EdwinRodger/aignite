import { pgTable, text, uuid, integer, numeric, boolean, timestamp, jsonb, customType } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom pgvector type for Drizzle ORM
export const customVector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(768)';
  },
  toDriver(val: number[]) {
    return JSON.stringify(val);
  },
  fromDriver(val: unknown) {
    return typeof val === 'string' ? JSON.parse(val) : (val as number[]);
  },
});

// 1. Profiles & Roles (Students, Recruiters, Admins)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  role: text('role', { enum: ['student', 'recruiter', 'admin'] }).default('student').notNull(),
  fullName: text('full_name').notNull(),
  username: text('username').unique().notNull(),
  avatarUrl: text('avatar_url'),
  headline: text('headline'),
  bio: text('bio'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  portfolioUrl: text('portfolio_url'),
  region: text('region').default('India'),
  collegeOrCompany: text('college_or_company'),
  isVerified: boolean('is_verified').default(false),
  verificationStatus: text('verification_status', { enum: ['none', 'pending', 'approved', 'rejected'] }).default('none'),
  workEmail: text('work_email'),
  companyWebsite: text('company_website'),
  recruiterDesignation: text('recruiter_designation'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  fcmToken: text('fcm_token'),
  defaultMobileLandingPage: text('default_mobile_landing_page').default('feed').notNull(),
  defaultWebLandingPage: text('default_web_landing_page').default('dashboard').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 2. Student Stats (Streaks, Points, League Tiers)
export const studentStats = pgTable('student_stats', {
  studentId: uuid('student_id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  totalPoints: integer('total_points').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  highestStreak: integer('highest_streak').default(0).notNull(),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD
  currentLeagueTier: text('current_league_tier').default('bronze').notNull(),
  leaguePointsThisWeek: integer('league_points_this_week').default(0).notNull(),
  overallRanking: integer('overall_ranking'),
  regionalRanking: integer('regional_ranking'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 3. AI Interview Report Cards
export const aiReportCards = pgTable('ai_report_cards', {
  studentId: uuid('student_id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  knowledgeScore: numeric('knowledge_score', { precision: 3, scale: 1 }).default('0.0').notNull(),
  confidenceScore: numeric('confidence_score', { precision: 3, scale: 1 }).default('0.0').notNull(),
  communicationScore: numeric('communication_score', { precision: 3, scale: 1 }).default('0.0').notNull(),
  examplesScore: numeric('examples_score', { precision: 3, scale: 1 }).default('0.0').notNull(),
  industryLevelScore: numeric('industry_level_score', { precision: 3, scale: 1 }).default('0.0').notNull(),
  totalInterviewsCompleted: integer('total_interviews_completed').default(0).notNull(),
  strengths: jsonb('strengths').$type<string[]>(),
  areasForImprovement: jsonb('areas_for_improvement').$type<string[]>(),
  aiSummaryFeedback: text('ai_summary_feedback'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 4. Course Packs (Company Packs)
export const coursePacks = pgTable('course_packs', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  companyName: text('company_name').notNull(), // 'Google', 'NVIDIA', 'OpenAI', 'Microsoft', 'Amazon'
  description: text('description').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  badgeName: text('badge_name'),
  badgeIcon: text('badge_icon'),
  topicsCount: integer('topics_count').default(5),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 5. AIgnite Pulse / AI Feed & Instant Micro-Quizzes
export const feedPosts = pgTable('feed_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  keyTakeaway: text('key_takeaway'),
  sourceName: text('source_name'),
  sourceUrl: text('source_url'),
  mediaUrl: text('media_url').notNull(),
  mediaType: text('media_type').default('image').notNull(),
  category: text('category').default('GenAI').notNull(),
  likesCount: integer('likes_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const feedPostQuizzes = pgTable('feed_post_quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => feedPosts.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  options: jsonb('options').$type<string[]>().notNull(),
  correctOptionIndex: integer('correct_option_index').notNull(),
  explanation: text('explanation').notNull(),
  pointsAwarded: integer('points_awarded').default(5),
});

export const feedUserInteractions = pgTable('feed_user_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  postId: uuid('post_id').references(() => feedPosts.id, { onDelete: 'cascade' }).notNull(),
  quizId: uuid('quiz_id').references(() => feedPostQuizzes.id, { onDelete: 'set null' }),
  selectedOptionIndex: integer('selected_option_index'),
  isQuizCorrect: boolean('is_quiz_correct'),
  liked: boolean('liked').default(false),
  bookmarked: boolean('bookmarked').default(false),
  interactedAt: timestamp('interacted_at', { withTimezone: true }).defaultNow(),
});

// 6. Daily Coach Questions & Spoken Answers
export const dailyCoachQuestions = pgTable('daily_coach_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  forDate: text('for_date').unique().notNull(), // YYYY-MM-DD
  topic: text('topic').notNull(),
  questionText: text('question_text').notNull(),
  sampleKeyPoints: jsonb('sample_key_points').$type<string[]>().notNull(),
  difficulty: text('difficulty').default('Intermediate'),
});

export const dailyCoachSubmissions = pgTable('daily_coach_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => dailyCoachQuestions.id, { onDelete: 'cascade' }).notNull(),
  audioRecordingUrl: text('audio_recording_url'),
  transcript: text('transcript'),
  knowledgeScore: numeric('knowledge_score', { precision: 3, scale: 1 }).notNull(),
  confidenceScore: numeric('confidence_score', { precision: 3, scale: 1 }).notNull(),
  communicationScore: numeric('communication_score', { precision: 3, scale: 1 }).notNull(),
  overallScore: numeric('overall_score', { precision: 3, scale: 1 }).notNull(),
  aiFeedback: text('ai_feedback').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 7. Resume Evaluations
export const resumeEvaluations = pgTable('resume_evaluations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
  resumeFileUrl: text('resume_file_url'),
  rawText: text('raw_text'),
  overallAtsScore: integer('overall_ats_score').notNull(),
  domainScores: jsonb('domain_scores').notNull(),
  skillGaps: jsonb('skill_gaps').$type<string[]>().notNull(),
  recommendations: jsonb('recommendations').$type<string[]>(),
  embedding: customVector('embedding'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 8. Job Postings & Applications
export const jobPostings = pgTable('job_postings', {
  id: uuid('id').defaultRandom().primaryKey(),
  recruiterId: uuid('recruiter_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  companyName: text('company_name').notNull(),
  companyLogoUrl: text('company_logo_url'),
  title: text('title').notNull(),
  roleCategory: text('role_category').notNull(),
  description: text('description').notNull(),
  minimumLeagueTier: text('minimum_league_tier').default('bronze'),
  requiredBadges: jsonb('required_badges').$type<string[]>(),
  minReportCardScore: numeric('min_report_card_score', { precision: 3, scale: 1 }).default('6.0'),
  salaryRange: text('salary_range'),
  location: text('location').default('Remote / Hybrid'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relational Definitions
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  stats: one(studentStats, {
    fields: [profiles.id],
    references: [studentStats.studentId],
  }),
  reportCard: one(aiReportCards, {
    fields: [profiles.id],
    references: [aiReportCards.studentId],
  }),
  coachSubmissions: many(dailyCoachSubmissions),
  feedInteractions: many(feedUserInteractions),
}));

export const feedPostsRelations = relations(feedPosts, ({ one, many }) => ({
  quiz: one(feedPostQuizzes, {
    fields: [feedPosts.id],
    references: [feedPostQuizzes.postId],
  }),
  interactions: many(feedUserInteractions),
}));
