'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUserAction } from '@/app/actions/auth';

/**
 * AuthRedirector:
 * If a user is logged in, automatically redirects them from the public landing page (/)
 * directly into their dashboard (/dashboard for students, /recruiter/dashboard for recruiters).
 */
export function AuthRedirector() {
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const auth = await getAuthUserAction();
        if (auth.loggedIn) {
          if (auth.role === 'recruiter') {
            router.replace('/recruiter/dashboard');
          } else {
            router.replace('/dashboard');
          }
          return;
        }
      } catch {
        // Fall back to client storage check
      }

      if (typeof window !== 'undefined') {
        const studentStreak = localStorage.getItem('aignite_student_streak');
        const studentSession = localStorage.getItem('aignite_student_session');
        const recruiterSession = localStorage.getItem('aignite_recruiter_session');

        if (recruiterSession) {
          router.replace('/recruiter/dashboard');
        } else if (studentStreak || studentSession) {
          router.replace('/dashboard');
        }
      }
    }

    checkAndRedirect();
  }, [router]);

  return null;
}
