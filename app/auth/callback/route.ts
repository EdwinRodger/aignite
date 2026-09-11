import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createClient();
  let userEmail: string | null = null;

  try {
    if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error && data?.user?.email) {
        userEmail = data.user.email;
      }
    } else if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user?.email) {
        userEmail = data.user.email;
      }
    }
  } catch (err) {
    console.error('Auth callback verification failed:', err);
  }

  if (userEmail) {
    const cookieStore = await cookies();
    cookieStore.set(
      'aignite_session',
      JSON.stringify({
        email: userEmail,
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

    // Check if user has already completed onboarding profile
    let targetPath = '/onboarding';
    if (db) {
      try {
        const existing = await db.query.profiles.findFirst({
          where: eq(profiles.username, userEmail.split('@')[0]),
        });
        if (existing && existing.fullName && existing.fullName !== userEmail.split('@')[0]) {
          targetPath = next.startsWith('/') ? next : '/dashboard';
        }
      } catch {
        targetPath = '/onboarding';
      }
    }

    return NextResponse.redirect(`${origin}${targetPath}`);
  }

  // Redirect to login page with clear error message if link is invalid or expired
  return NextResponse.redirect(`${origin}/login?error=Authentication%20link%20expired%20or%20invalid`);
}
