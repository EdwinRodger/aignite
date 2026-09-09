'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { FeedCard } from '@/components/feed/FeedCard';
import { FeedFilterBar } from '@/components/feed/FeedFilterBar';
import { FeedSidebar } from '@/components/feed/FeedSidebar';
import { CURATED_FEED_POSTS, FeedPost } from '@/lib/feed-data';
import { Sparkles, Flame } from 'lucide-react';

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<FeedPost[]>(CURATED_FEED_POSTS);
  const [totalPoints, setTotalPoints] = useState(15);
  const [streakCount, setStreakCount] = useState(3);

  // Load points & streak from localStorage for realistic demo state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedPoints = localStorage.getItem('aignite_student_points');
        const storedStreak = localStorage.getItem('aignite_student_streak');
        if (storedPoints) setTotalPoints(parseInt(storedPoints, 10));
        if (storedStreak) setStreakCount(parseInt(storedStreak, 10));
      }
    }, 0);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-12">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Banner / Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20">
                <Flame className="w-3.5 h-3.5" />
                <span>AIgnite Pulse</span>
              </span>
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
          <div className="sm:hidden flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold font-mono">{streakCount} Day Streak</span>
            </div>
            <div className="text-sm font-mono font-bold text-primary">
              +{totalPoints} League XP
            </div>
          </div>
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
              <div className="p-12 text-center rounded-2xl bg-card border border-border">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground">No Sparks Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try switching category or synthesize a new card in the sidebar.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground"
                >
                  View All Sparks
                </button>
              </div>
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
              <p className="text-[11px] text-muted-foreground mt-1">
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
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <MobileTabBar />
    </div>
  );
}
