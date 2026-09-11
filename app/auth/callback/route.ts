import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createClient();
  let userEmail: string | null = null;
  let authUserId: string | null = null;

  try {
    if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error && data?.user?.email) {
        userEmail = data.user.email;
        authUserId = data.user.id;
      }
    } else if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user?.email) {
        userEmail = data.user.email;
        authUserId = data.user.id;
      }
    }
  } catch (err) {
    console.error('Auth callback verification failed:', err);
  }

  if (userEmail) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    let isCompleted = false;
    let existingProfile: typeof profiles.$inferSelect | null | undefined = null;

    if (db) {
      try {
        if (authUserId) {
          existingProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, authUserId),
          });
        }
        if (!existingProfile) {
          existingProfile = await db.query.profiles.findFirst({
            where: or(
              eq(profiles.email, normalizedEmail),
              eq(profiles.workEmail, normalizedEmail)
            ),
          });
        }
        if (!existingProfile) {
          existingProfile = await db.query.profiles.findFirst({
            where: eq(profiles.username, normalizedEmail.split('@')[0]),
          });
        }

        if (existingProfile) {
          isCompleted =
            existingProfile.onboardingCompleted === true ||
            Boolean(
              existingProfile.collegeOrCompany ||
              existingProfile.headline ||
              (existingProfile.fullName && existingProfile.fullName !== normalizedEmail.split('@')[0])
            );

          if (isCompleted && (!existingProfile.email || !existingProfile.onboardingCompleted)) {
            await db
              .update(profiles)
              .set({
                email: existingProfile.email || normalizedEmail,
                onboardingCompleted: true,
              })
              .where(eq(profiles.id, existingProfile.id));
          }
        }
      } catch (err) {
        console.warn('Auth callback db query error:', err);
      }
    }

    const cookieStore = await cookies();
    cookieStore.set(
      'aignite_session',
      JSON.stringify({
        userId: authUserId || existingProfile?.id,
        email: normalizedEmail,
        role: 'student',
        fullName: existingProfile?.fullName,
        username: existingProfile?.username,
        onboardingComplete: isCompleted,
        authenticatedAt: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );

    const targetPath = isCompleted ? (next.startsWith('/') ? next : '/dashboard') : '/onboarding';
    return NextResponse.redirect(`${origin}${targetPath}`);
  }

  // Redirect to login page with clear error message if link is invalid or expired
  return NextResponse.redirect(`${origin}/login?error=Authentication%20link%20expired%20or%20invalid`);
}
