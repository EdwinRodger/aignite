'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * MobileLaunchRedirector:
 * Automatically routes mobile users on first launch of the session to their
 * preferred mobile landing screen (defaults to '/feed' for instant micro-learning),
 * while respecting their custom preference and avoiding redirect loops if they
 * intentionally visit the landing page.
 */
export function MobileLaunchRedirector() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if the user is on a mobile viewport or standalone PWA
    const isMobile = window.innerWidth < 768;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!isMobile && !isStandalone) return;

    // Prevent redirect loops: only redirect on cold app launch
    const hasLaunchedThisSession = sessionStorage.getItem('aignite_mobile_cold_launched');
    if (hasLaunchedThisSession) return;

    sessionStorage.setItem('aignite_mobile_cold_launched', 'true');

    const preference = localStorage.getItem('aignite_mobile_landing') || 'feed';

    if (preference === 'feed') {
      router.push('/feed');
    } else if (preference === 'coach') {
      router.push('/coach');
    } else if (preference === 'league') {
      router.push('/league');
    } else if (preference === 'roadmap') {
      router.push('/roadmap');
    }
  }, [router]);

  return null;
}
