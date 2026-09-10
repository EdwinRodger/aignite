'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, studentStats } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// Disallowed public email domains for recruiters
const PUBLIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'zoho.com',
  'proton.me',
  'protonmail.com',
  'mail.com',
  'gmx.com',
  'yandex.com',
];

export interface RecruiterApplicationData {
  fullName: string;
  companyName: string;
  companyWebsite: string;
  workEmail: string;
  linkedinUrl?: string;
  recruiterDesignation: string;
}

export interface StoredRecruiterRecord extends RecruiterApplicationData {
  id: string;
  status: string;
  appliedAt: string;
}

export interface OnboardingData {
  fullName: string;
  username: string;
  collegeOrCompany: string;
  headline?: string;
  bio?: string;
  defaultMobileLandingPage?: 'feed' | 'dashboard' | 'coach' | 'league';
}

/**
 * Check if Supabase environment variables are provided with real keys
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  if (url.includes('placeholder') || url.includes('your-project-id') || url.includes('your-supabase')) return false;
  if (key.includes('placeholder') || key.includes('your-publishable-key') || key.includes('your-supabase')) return false;
  return true;
}

/**
 * 1. Request a 6-digit OTP for student login
 */
export async function sendStudentOtp(email: string) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const cookieStore = await cookies();

  // Try real Supabase Auth only if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: { role: 'student' },
        },
      });

      if (error) {
        // If it's a network/DNS error, log warning and fall back to demo mode
        if (
          error.message.includes('fetch failed') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('network')
        ) {
          console.warn('Supabase auth network unavailable, falling back to demo mode:', error.message);
        } else {
          return { success: false, error: error.message };
        }
      }
    } catch (err: unknown) {
      console.warn('Supabase auth exception, falling back to demo mode:', err);
    }
  }

  // Set demo OTP cookie for testing/hackathon presentation (Demo OTP: 123456)
  const demoOtp = '123456';
  cookieStore.set('aignite_demo_otp', JSON.stringify({ email, code: demoOtp, timestamp: Date.now() }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  return { success: true, message: 'OTP sent to your email address.' };
}

/**
 * 2. Verify 6-digit OTP
 */
export async function verifyStudentOtp(email: string, token: string) {
  if (!email || !token || token.length !== 6) {
    return { success: false, error: 'Please enter the complete 6-digit verification code.' };
  }

  const cookieStore = await cookies();
  let verified = false;

  // 1. Try Supabase Auth token verification if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (!error && data?.user) {
        verified = true;
      }
    } catch {
      // Fall back to demo OTP check
    }
  }

  // 2. Demo OTP fallback
  if (!verified) {
    const demoCookie = cookieStore.get('aignite_demo_otp')?.value;
    if (demoCookie) {
      try {
        const parsed = JSON.parse(demoCookie);
        if (parsed.email === email && (token === '123456' || parsed.code === token)) {
          verified = true;
        }
      } catch {
        // Invalid cookie
      }
    } else if (token === '123456') {
      verified = true;
    }
  }

  if (!verified) {
    return { success: false, error: 'Invalid or expired verification code. Please try again.' };
  }

  // Create session cookie
  cookieStore.set(
    'aignite_session',
    JSON.stringify({
      email,
      role: 'student',
      authenticatedAt: Date.now(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  // Check if user has already completed profile
  let needsOnboarding = true;
  if (db) {
    try {
      const existing = await db.query.profiles.findFirst({
        where: eq(profiles.username, email.split('@')[0]),
      });
      if (existing && existing.fullName && existing.fullName !== email.split('@')[0]) {
        needsOnboarding = false;
      }
    } catch {
      // Database not connected yet, allow onboarding
    }
  }

  return { success: true, needsOnboarding };
}

/**
 * 3. Complete Student Onboarding
 */
export async function completeStudentOnboarding(data: OnboardingData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('aignite_session')?.value;

  if (!sessionCookie) {
    return { success: false, error: 'Unauthorized. Please sign in first.' };
  }

  const session = JSON.parse(sessionCookie);

  // Update Drizzle ORM if connected
  if (db) {
    try {
      // Upsert profile
      await db
        .insert(profiles)
        .values({
          id: crypto.randomUUID(),
          role: 'student',
          fullName: data.fullName,
          username: data.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          collegeOrCompany: data.collegeOrCompany,
          headline: data.headline || 'Aspiring AI Systems Engineer',
          bio: data.bio || '',
          defaultMobileLandingPage: data.defaultMobileLandingPage || 'feed',
          defaultWebLandingPage: 'dashboard',
          isVerified: true,
        })
        .onConflictDoUpdate({
          target: profiles.username,
          set: {
            fullName: data.fullName,
            collegeOrCompany: data.collegeOrCompany,
            headline: data.headline,
            bio: data.bio,
            defaultMobileLandingPage: data.defaultMobileLandingPage || 'feed',
          },
        });
    } catch (err) {
      console.warn('Database upsert error during onboarding:', err);
    }
  }

  // Update session cookie with user display name
  cookieStore.set(
    'aignite_session',
    JSON.stringify({
      ...session,
      fullName: data.fullName,
      username: data.username,
      onboardingComplete: true,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  return { success: true };
}

/**
 * 4. Submit Corporate Recruiter Application
 */
export async function submitRecruiterApplication(data: RecruiterApplicationData) {
  // Validate work email domain
  const emailDomain = data.workEmail.split('@')[1]?.toLowerCase();

  if (!emailDomain || PUBLIC_EMAIL_DOMAINS.includes(emailDomain)) {
    return {
      success: false,
      error: `Public email domain (@${emailDomain || 'unknown'}) is not permitted for recruiters. Please use your official corporate domain (e.g. name@company.com).`,
    };
  }

  if (!data.companyWebsite.startsWith('http://') && !data.companyWebsite.startsWith('https://')) {
    data.companyWebsite = `https://${data.companyWebsite}`;
  }

  const cookieStore = await cookies();

  // Store in pending recruiters registry
  const pendingRecruitersCookie = cookieStore.get('aignite_pending_recruiters')?.value;
  let pendingList: Array<RecruiterApplicationData & { id: string; status: string; appliedAt: string }> = [];

  if (pendingRecruitersCookie) {
    try {
      pendingList = JSON.parse(pendingRecruitersCookie);
    } catch {
      pendingList = [];
    }
  }

  const newApplication = {
    ...data,
    id: `rec_${Date.now()}`,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };

  pendingList = [newApplication, ...pendingList.filter((p) => p.workEmail !== data.workEmail)];

  cookieStore.set('aignite_pending_recruiters', JSON.stringify(pendingList), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Set recruiter session in pending quarantine
  cookieStore.set(
    'aignite_recruiter_session',
    JSON.stringify({
      email: data.workEmail,
      company: data.companyName,
      status: 'pending',
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  // If Drizzle DB is connected, store in profiles table
  if (db) {
    try {
      await db.insert(profiles).values({
        id: crypto.randomUUID(),
        role: 'recruiter',
        fullName: data.fullName,
        username: `rec_${data.workEmail.split('@')[0]}_${Date.now().toString().slice(-4)}`,
        workEmail: data.workEmail,
        companyWebsite: data.companyWebsite,
        collegeOrCompany: data.companyName,
        recruiterDesignation: data.recruiterDesignation,
        verificationStatus: 'pending',
        isVerified: false,
      });
    } catch (err) {
      console.warn('DB error inserting recruiter application:', err);
    }
  }

  return { success: true };
}

/**
 * 5. Get Recruiter Status by Email
 */
export async function getRecruiterStatus(email: string) {
  const cookieStore = await cookies();
  const normalizedEmail = email.trim().toLowerCase();
  const pendingCookie = cookieStore.get('aignite_pending_recruiters')?.value;

  if (pendingCookie) {
    try {
      const list: StoredRecruiterRecord[] = JSON.parse(pendingCookie);
      const found = list.find((item) => item.workEmail.toLowerCase() === normalizedEmail);
      if (found) {
        if (found.status === 'approved') {
          cookieStore.set(
            'aignite_recruiter_session',
            JSON.stringify({
              email: found.workEmail,
              role: 'recruiter',
              company: found.companyName,
              status: 'approved',
              authenticatedAt: Date.now(),
            }),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
            }
          );
        }
        return { found: true, status: found.status, company: found.companyName };
      }
    } catch {
      // ignore
    }
  }

  // If Drizzle DB is connected, check profiles table
  if (db) {
    try {
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.workEmail, normalizedEmail),
      });
      if (profile && profile.role === 'recruiter') {
        const status = profile.verificationStatus || 'pending';
        if (status === 'approved') {
          cookieStore.set(
            'aignite_recruiter_session',
            JSON.stringify({
              email: profile.workEmail || normalizedEmail,
              role: 'recruiter',
              company: profile.collegeOrCompany || 'Enterprise Partner',
              status: 'approved',
              authenticatedAt: Date.now(),
            }),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
            }
          );
        }
        return {
          found: true,
          status,
          company: profile.collegeOrCompany || 'Enterprise Partner',
        };
      }
    } catch {
      // ignore
    }
  }

  return { found: false, status: 'none' };
}

/**
 * 6. Get All Applications for Admin Console
 */
export async function getPendingRecruiters() {
  const cookieStore = await cookies();
  const pendingCookie = cookieStore.get('aignite_pending_recruiters')?.value;

  let combined: StoredRecruiterRecord[] = [];

  if (pendingCookie) {
    try {
      const stored: StoredRecruiterRecord[] = JSON.parse(pendingCookie);
      combined = [...stored];
    } catch {
      combined = [];
    }
  }

  // If Drizzle DB is connected, fetch recruiter profiles and merge
  if (db) {
    try {
      const dbRecruiters = await db.query.profiles.findMany({
        where: eq(profiles.role, 'recruiter'),
      });
      for (const r of dbRecruiters) {
        if (r.workEmail && !combined.some((item) => item.workEmail.toLowerCase() === r.workEmail?.toLowerCase())) {
          combined.push({
            id: r.id,
            fullName: r.fullName,
            companyName: r.collegeOrCompany || 'Enterprise Partner',
            companyWebsite: r.companyWebsite || '',
            workEmail: r.workEmail,
            linkedinUrl: r.linkedinUrl || undefined,
            recruiterDesignation: r.recruiterDesignation || 'Technical Recruiter',
            status: r.verificationStatus || 'pending',
            appliedAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return combined;
}

/**
 * 7. Admin Action: Approve or Reject a Recruiter
 */
export async function toggleRecruiterVerification(recruiterId: string, status: 'approved' | 'rejected') {
  const cookieStore = await cookies();

  let list = await getPendingRecruiters();
  const target = list.find((item) => item.id === recruiterId);
  list = list.map((item) => (item.id === recruiterId ? { ...item, status } : item));

  cookieStore.set('aignite_pending_recruiters', JSON.stringify(list), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  // If the active recruiter session matches this approved or rejected applicant, update session
  if (target) {
    const sessionCookie = cookieStore.get('aignite_recruiter_session')?.value;
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        if (session.email?.toLowerCase() === target.workEmail?.toLowerCase()) {
          cookieStore.set(
            'aignite_recruiter_session',
            JSON.stringify({
              ...session,
              status,
              authenticatedAt: status === 'approved' ? Date.now() : undefined,
            }),
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
            }
          );
        }
      } catch {
        // ignore
      }
    }

    // Also update Drizzle DB if connected
    if (db) {
      try {
        await db
          .update(profiles)
          .set({
            verificationStatus: status,
            isVerified: status === 'approved',
            verifiedAt: status === 'approved' ? new Date() : null,
          })
          .where(eq(profiles.workEmail, target.workEmail));
      } catch (err) {
        console.warn('DB error updating recruiter status:', err);
      }
    }
  }

  return { success: true, updatedStatus: status };
}

/**
 * 8. Sign Out
 */
export async function signOutUser() {
  const cookieStore = await cookies();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  cookieStore.delete('aignite_session');
  cookieStore.delete('aignite_recruiter_session');
  cookieStore.delete('aignite_demo_otp');

  return { success: true };
}

/**
 * 9. Get Current Authenticated User Status (Server Action)
 */
export async function getAuthUserAction(): Promise<{
  loggedIn: boolean;
  role: 'student' | 'recruiter' | null;
  email?: string;
}> {
  const cookieStore = await cookies();

  // 1. Check recruiter session first
  const recruiterCookie = cookieStore.get('aignite_recruiter_session')?.value;
  if (recruiterCookie) {
    try {
      const parsed = JSON.parse(recruiterCookie);
      if (parsed.status === 'approved' || !parsed.status) {
        return { loggedIn: true, role: 'recruiter', email: parsed.email };
      }
    } catch {
      // ignore
    }
  }

  // 2. Check student session
  const studentCookie = cookieStore.get('aignite_session')?.value;
  if (studentCookie) {
    try {
      const parsed = JSON.parse(studentCookie);
      return { loggedIn: true, role: 'student', email: parsed.email };
    } catch {
      // ignore
    }
  }

  return { loggedIn: false, role: null };
}

/**
 * 10. Set Recruiter Session Cookie
 */
export async function setRecruiterSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(
    'aignite_recruiter_session',
    JSON.stringify({
      email,
      role: 'recruiter',
      authenticatedAt: Date.now(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );
  return { success: true };
}

/**
 * 11. Live Platform Infrastructure Health Telemetry
 */
export interface HealthIndicator {
  status: 'connected' | 'not_configured' | 'error' | 'active';
  label: string;
  detail: string;
  badge: string;
  isHealthy: boolean;
}

export interface PlatformHealthStatus {
  database: HealthIndicator;
  auth: HealthIndicator;
  firewall: HealthIndicator;
  ai: HealthIndicator;
}

export async function getPlatformHealthAction(): Promise<PlatformHealthStatus> {
  // 1. Live Database Check
  let dbStatus: 'connected' | 'not_configured' | 'error' = 'not_configured';
  let dbDetail = 'DATABASE_URL not configured (Standby / Local Session Mode)';
  let dbBadge = 'Not Connected';
  let dbHealthy = false;

  if (process.env.DATABASE_URL && db) {
    try {
      await db.execute(sql`SELECT 1`);
      dbStatus = 'connected';
      dbDetail = 'Supabase PostgreSQL + Drizzle ORM (Connected)';
      dbBadge = 'Operational';
      dbHealthy = true;
    } catch {
      dbStatus = 'error';
      dbDetail = 'DATABASE_URL set, but connection failed';
      dbBadge = 'Unreachable';
      dbHealthy = false;
    }
  }

  // 2. Auth Provider Check
  const supabaseConfigured = isSupabaseConfigured();
  const authStatus: 'connected' | 'not_configured' = supabaseConfigured ? 'connected' : 'not_configured';
  const authDetail = supabaseConfigured
    ? 'Supabase Auth (Magic OTP & Row-Level Security)'
    : 'Standalone Cookie Session Mode (Supabase keys not added)';
  const authBadge = supabaseConfigured ? 'Supabase Auth' : 'Local Session Mode';

  // 3. Recruiter Firewall Check
  const firewallDetail = `Active filter on ${PUBLIC_EMAIL_DOMAINS.length} public domains (Gmail, Yahoo, Proton, etc.)`;

  // 4. Gemini AI Key Check
  const rawKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = Boolean(rawKey && rawKey.trim() !== '' && !rawKey.includes('YourGeminiApiKeyHere'));
  const aiStatus: 'connected' | 'not_configured' = hasGeminiKey ? 'connected' : 'not_configured';
  const aiDetail = hasGeminiKey
    ? 'Google Gemini 2.5 Flash API Connected'
    : 'GEMINI_API_KEY not set in environment (mock analysis fallback)';
  const aiBadge = hasGeminiKey ? 'Ready' : 'Not Configured';

  return {
    database: {
      status: dbStatus,
      label: 'Database Layer',
      detail: dbDetail,
      badge: dbBadge,
      isHealthy: dbHealthy,
    },
    auth: {
      status: authStatus,
      label: 'Authentication Engine',
      detail: authDetail,
      badge: authBadge,
      isHealthy: supabaseConfigured,
    },
    firewall: {
      status: 'active',
      label: 'Recruiter Domain Firewall',
      detail: firewallDetail,
      badge: 'Active (Strict)',
      isHealthy: true,
    },
    ai: {
      status: aiStatus,
      label: 'AI Evaluation Pipeline',
      detail: aiDetail,
      badge: aiBadge,
      isHealthy: hasGeminiKey,
    },
  };
}

export interface CurrentStudentProfile {
  fullName: string;
  username: string;
  email: string;
  collegeOrCompany: string;
  headline: string;
  totalPoints: number;
  currentStreak: number;
  leagueTier: string;
  leagueRank: number;
  atsScore: number;
}

/**
 * 12. Retrieve authenticated student profile from DB/session
 */
export async function getCurrentStudentProfileAction(): Promise<CurrentStudentProfile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('aignite_session')?.value;

  if (!sessionCookie) {
    return null;
  }

  let session: { email?: string; fullName?: string; username?: string; role?: string } = {};
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return null;
  }

  const email = session.email || '';
  let fullName = session.fullName || (email ? email.split('@')[0] : 'Learner');
  let username = session.username || (email ? email.split('@')[0] : 'learner');
  let collegeOrCompany = 'AI Engineering Campus';
  let headline = 'Aspiring AI Systems Engineer';
  let totalPoints = 415;
  let currentStreak = 3;
  let leagueTier = 'Silver AI Engineer';
  let leagueRank = 5;
  let atsScore = 84;

  if (db && email) {
    try {
      const dbProfile = await db.query.profiles.findFirst({
        where: eq(profiles.username, username),
      });

      if (dbProfile) {
        fullName = dbProfile.fullName || fullName;
        username = dbProfile.username || username;
        collegeOrCompany = dbProfile.collegeOrCompany || collegeOrCompany;
        headline = dbProfile.headline || headline;

        const stats = await db.query.studentStats.findFirst({
          where: eq(studentStats.studentId, dbProfile.id),
        });

        if (stats) {
          totalPoints = stats.totalPoints || totalPoints;
          currentStreak = stats.currentStreak || currentStreak;
          leagueTier = stats.currentLeagueTier || leagueTier;
          leagueRank = stats.overallRanking || leagueRank;
        }
      }
    } catch (err) {
      console.warn('Could not load student profile from database:', err);
    }
  }

  return {
    fullName,
    username,
    email,
    collegeOrCompany,
    headline,
    totalPoints,
    currentStreak,
    leagueTier,
    leagueRank,
    atsScore,
  };
}

/**
 * 13. Sign Out Action
 */
export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('aignite_session');
  cookieStore.delete('aignite_recruiter_session');
  cookieStore.delete('aignite_demo_otp');
  cookieStore.delete('sb_token');

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  }

  return { success: true };
}

