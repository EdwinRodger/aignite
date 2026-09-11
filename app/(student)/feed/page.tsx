'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { FeedCard } from '@/components/feed/FeedCard';
import { FeedFilterBar } from '@/components/feed/FeedFilterBar';
import { FeedSidebar } from '@/components/feed/FeedSidebar';
import { CURATED_FEED_POSTS, FeedPost } from '@/lib/feed-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Flame, Trophy } from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

export default function FeedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<FeedPost[]>(CURATED_FEED_POSTS);
  const [totalPoints, setTotalPoints] = useState(15);
  const [streakCount, setStreakCount] = useState(3);

  // Check student authentication & load stats
  useEffect(() => {
    let isMounted = true;

    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsAuthenticated(true);
        } else if (typeof window !== 'undefined' && localStorage.getItem('aignite_student_session')) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (typeof window !== 'undefined' && localStorage.getItem('aignite_student_session')) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedPoints = localStorage.getItem('aignite_student_points');
        const storedStreak = localStorage.getItem('aignite_student_streak');
        const storedGuest = localStorage.getItem('aignite_feed_guest');
        if (storedPoints) setTotalPoints(parseInt(storedPoints, 10));
        if (storedStreak) setStreakCount(parseInt(storedStreak, 10));
        if (storedGuest === 'true') setIsGuestMode(true);
      }
    }, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
  };

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const handleAnswerCorrect = (pointsAwarded: number) => {
    setTotalPoints((prev) => {
      const next = prev + pointsAwarded;
      if (typeof window !== 'undefined') {
        localStorage.setItem('aignite_student_points', next.toString());
      }
      return next;
    });

    setStreakCount((prev) => {
      const next = prev + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('aignite_student_streak', next.toString());
      }
      return next;
    });
  };

  const handleSparkGenerated = (newSpark: FeedPost) => {
    setPosts((prev) => [newSpark, ...prev]);
    setActiveCategory('All');
  };

  if (isAuthenticated === null && !isGuestMode) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-muted-foreground font-mono text-sm">
          <Sparkles className="w-4 h-4 animate-spin text-primary" />
          <span>Verifying student account...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <ProtectedRouteGate
        title="Interactive AI Sparks Feed"
        badge="Account Feature - Student Sign In Required"
        description="The daily AI Sparks feed delivers 5-minute architectural breakdowns with active retention check quizzes, bookmarking, and custom paper synthesis for registered students."
        allowGuestPreview={true}
        guestPreviewLabel="Explore Sparks as Guest"
        onGuestPreview={() => {
          setIsGuestMode(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('aignite_feed_guest', 'true');
          }
        }}
        features={[
          {
            title: 'Active Recall Check Quizzes',
            description: 'Single-tap comprehension checks that reinforce bleeding-edge AI paper concepts.',
            icon: Sparkles,
          },
          {
            title: 'Daily Streak & League Points',
            description: 'Answer daily sparks to build your consistency streak and earn weekly promotion XP.',
            icon: Flame,
          },
          {
            title: 'Gemini Paper Synthesizer',
            description: 'Generate on-demand bite-sized sparks from any technical paper or URL using Gemini 3.6 Flash.',
            icon: Trophy,
          },
        ]}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Guest Mode Notification Banner */}
      {isGuestMode && !isAuthenticated && (
        <div className="mb-6 p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>
              <strong>Guest Mode Active:</strong> You can solve micro-quizzes, listen to TTS summaries, and synthesize fresh paper cards. <Link href="/login" className="underline font-bold text-primary hover:text-primary/80">Sign in</Link> to save your streak and league points permanently.
            </span>
          </div>
          <Button asChild size="sm" className="font-semibold text-sm shrink-0 shadow-xs">
            <Link href="/login">Sign In to Save XP</Link>
          </Button>
        </div>
      )}

      {/* Page Banner / Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-sm font-bold bg-primary/10 text-primary border-primary/20">
                <Flame className="w-3.5 h-3.5" />
                <span>AIgnite Pulse</span>
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">5-Minute Downtime Learning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Interactive AI Sparks Feed
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Replace passive social media doomscrolling. Solve 5-second architectural micro-quizzes, explore production AI breakthroughs, and earn weekly interview league XP.
            </p>
          </div>

          {/* Quick Mobile Status Banner */}
          <Card className="sm:hidden flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold font-mono">{streakCount} Day Streak</span>
            </div>
            <div className="text-sm font-mono font-bold text-primary">
              +{totalPoints} League XP
            </div>
          </Card>
        </div>

        {/* Category Filter Pills */}
        <FeedFilterBar
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 2-Column Responsive Layout: Feed Column + Desktop Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column */}
          <section
            aria-label="AI Sparks Posts"
            className="lg:col-span-7 xl:col-span-8 space-y-6"
          >
            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground">No Sparks Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try switching category or synthesize a new card in the sidebar.
                </p>
                <Button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 font-semibold text-sm"
                >
                  View All Sparks
                </Button>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onAnswerCorrect={handleAnswerCorrect}
                />
              ))
            )}

            {/* End of Feed Callout */}
            <div className="p-6 text-center rounded-2xl bg-muted/30 border border-border/60">
              <p className="text-sm text-muted-foreground">
                🎉 You are all caught up on today&apos;s AI breakthroughs!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back in the morning or try generating a fresh paper breakdown with Gemini.
              </p>
            </div>
          </section>

          {/* Desktop Companion Sidebar */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24">
            <FeedSidebar
              totalPoints={totalPoints}
              streakCount={streakCount}
              onSparkGenerated={handleSparkGenerated}
            />
          </div>
        </div>
    </div>
  );
}
