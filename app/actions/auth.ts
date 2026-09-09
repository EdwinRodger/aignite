'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('placeholder') || url.includes('your-project-id') || url.includes('your-supabase')) return false;
  if (key.includes('placeholder') || key.includes('your-anon-key') || key.includes('your-supabase')) return false;
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
  const pendingCookie = cookieStore.get('aignite_pending_recruiters')?.value;

  if (pendingCookie) {
    try {
      const list: StoredRecruiterRecord[] = JSON.parse(pendingCookie);
      const found = list.find((item) => item.workEmail === email);
      if (found) {
        if (found.status === 'approved') {
          cookieStore.set(
            'aignite_recruiter_session',
            JSON.stringify({
              email,
              role: 'recruiter',
              company: found.companyName,
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

  // Pre-approved demo accounts
  if (email.includes('google.com') || email.includes('nvidia.com') || email === 'demo@company.com') {
    cookieStore.set(
      'aignite_recruiter_session',
      JSON.stringify({
        email,
        role: 'recruiter',
        company: 'Partner Enterprise',
        authenticatedAt: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      }
    );
    return { found: true, status: 'approved', company: 'Partner Enterprise' };
  }

  return { found: false, status: 'none' };
}

/**
 * 6. Get All Applications for Admin Console
 */
export async function getPendingRecruiters() {
  const cookieStore = await cookies();
  const pendingCookie = cookieStore.get('aignite_pending_recruiters')?.value;

  // Default seed applications for demo evaluation
  const defaultSeeds = [
    {
      id: 'rec_101',
      fullName: 'Aarav Sharma',
      companyName: 'NVIDIA India',
      companyWebsite: 'https://nvidia.com',
      workEmail: 'aarav.sharma@nvidia.com',
      linkedinUrl: 'https://linkedin.com/in/aarav-nvidia-ai',
      recruiterDesignation: 'Senior Technical Recruiter (Applied AI & CUDA)',
      status: 'pending',
      appliedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'rec_102',
      fullName: 'Priya Venkatesh',
      companyName: 'Google DeepMind',
      companyWebsite: 'https://deepmind.google',
      workEmail: 'pvenkatesh@google.com',
      linkedinUrl: 'https://linkedin.com/in/priya-deepmind-hiring',
      recruiterDesignation: 'Talent Acquisition Lead (GenAI & Gemma)',
      status: 'approved',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'rec_103',
      fullName: 'Devansh Roy',
      companyName: 'Sarvam AI',
      companyWebsite: 'https://sarvam.ai',
      workEmail: 'devansh@sarvam.ai',
      linkedinUrl: 'https://linkedin.com/in/devansh-sarvam',
      recruiterDesignation: 'Head of Engineering Talent',
      status: 'pending',
      appliedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ];

  if (pendingCookie) {
    try {
      const stored: StoredRecruiterRecord[] = JSON.parse(pendingCookie);
      // Merge with default seeds
      const combined = [...stored];
      for (const seed of defaultSeeds) {
        if (!combined.some((item) => item.workEmail === seed.workEmail)) {
          combined.push(seed);
        }
      }
      return combined;
    } catch {
      return defaultSeeds;
    }
  }

  return defaultSeeds;
}

/**
 * 7. Admin Action: Approve or Reject a Recruiter
 */
export async function toggleRecruiterVerification(recruiterId: string, status: 'approved' | 'rejected') {
  const cookieStore = await cookies();

  let list = await getPendingRecruiters();
  list = list.map((item) => (item.id === recruiterId ? { ...item, status } : item));

  cookieStore.set('aignite_pending_recruiters', JSON.stringify(list), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

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
      return { loggedIn: true, role: 'recruiter', email: parsed.email };
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
