'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SocialFeedCard } from '@/components/feed/SocialFeedCard';
import { InterleavedQuizCard } from '@/components/feed/InterleavedQuizCard';
import { JobFeedCard } from '@/components/feed/JobFeedCard';
import { CreateSparkModal } from '@/components/feed/CreateSparkModal';
import {
  SocialFeedPost,
  SEED_SOCIAL_POSTS,
  SEED_INTERLEAVED_QUIZZES,
  SEED_JOB_POSTINGS,
  buildInterleavedFeed,
  FeedItem,
  InterleavedQuiz,
  JobPostingFeedItem,
} from '@/lib/feed-social-data';
import {
  getSocialFeedPostsAction,
  getStudentFeedStreakAction,
  recordFeedInteractionAction,
  getInterleavedQuizzesAction,
  getFeedJobPostingsAction,
  getCurrentStudentFeedIdentityAction,
} from '@/app/actions/feed';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Flame,
  PlusCircle,
  Briefcase,
} from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

const FEED_CATEGORIES = [
  'All',
  'GenAI',
  'Robotics',
  'ML Systems',
  'Student Projects',
  'Computer Vision',
  'AI Jobs',
];

interface UserFeedIdentity {
  name: string;
  handle: string;
  avatarUrl?: string;
  initials: string;
}

export default function FeedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<SocialFeedPost[]>(SEED_SOCIAL_POSTS);
  const [quizzes, setQuizzes] = useState<InterleavedQuiz[]>(SEED_INTERLEAVED_QUIZZES);
  const [jobs, setJobs] = useState<JobPostingFeedItem[]>(SEED_JOB_POSTINGS);
  const [userProfile, setUserProfile] = useState<UserFeedIdentity | undefined>(undefined);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [hasInteractedToday, setHasInteractedToday] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check student authentication and load real data from Supabase
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

    // Check guest mode flag
    if (typeof window !== 'undefined') {
      const storedGuest = localStorage.getItem('aignite_feed_guest');
      if (storedGuest === 'true') setIsGuestMode(true);
    }

    // Load real streak and points directly from Supabase per account
    getStudentFeedStreakAction()
      .then((streakData) => {
        if (!isMounted) return;
        if (streakData.authenticated) {
          setStreakCount(streakData.currentStreak);
          setTotalPoints(streakData.totalPoints);
          setHasInteractedToday(streakData.hasInteractedToday);
        } else if (typeof window !== 'undefined') {
          // Fallback to local session storage for guest demo
          const storedPoints = localStorage.getItem('aignite_student_points');
          const storedStreak = localStorage.getItem('aignite_student_streak');
          const storedInteractionDate = localStorage.getItem('aignite_last_feed_interaction');
          const todayDate = new Date().toISOString().slice(0, 10);

          if (storedPoints) setTotalPoints(parseInt(storedPoints, 10));
          if (storedStreak) setStreakCount(parseInt(storedStreak, 10));
          if (storedInteractionDate === todayDate) setHasInteractedToday(true);
        }
      })
      .catch((err) => {
        console.warn('Could not load streak from Supabase:', err);
      });

    // Load current student profile identity from Supabase
    getCurrentStudentFeedIdentityAction()
      .then((identity) => {
        if (isMounted && identity) {
          setUserProfile(identity);
        }
      })
      .catch((err) => {
        console.warn('Could not load student identity:', err);
      });

    // Fetch real feed posts from Supabase database
    setIsLoadingPosts(true);
    getSocialFeedPostsAction()
      .then((fetchedPosts) => {
        if (isMounted && fetchedPosts && fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch posts from Supabase, using seed bank:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPosts(false);
      });

    // Fetch real interleaved quizzes from Supabase database
    getInterleavedQuizzesAction()
      .then((fetchedQuizzes) => {
        if (isMounted && fetchedQuizzes && fetchedQuizzes.length > 0) {
          setQuizzes(fetchedQuizzes);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch quizzes from Supabase:', err);
      });

    // Fetch real recruiter job postings from Supabase database
    getFeedJobPostingsAction()
      .then((fetchedJobs) => {
        if (isMounted && fetchedJobs && fetchedJobs.length > 0) {
          setJobs(fetchedJobs);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch jobs from Supabase:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    if (activeCategory === 'AI Jobs') return [];
    return posts.filter(
      (p) =>
        p.category.toLowerCase() === activeCategory.toLowerCase() ||
        p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [posts, activeCategory]);

  // Build interleaved feed stream with quizzes (every 4) and job postings (every 6)
  const feedItems: FeedItem[] = useMemo(() => {
    if (activeCategory === 'AI Jobs') {
      return jobs.map((job) => ({ type: 'job' as const, job }));
    }
    return buildInterleavedFeed(filteredPosts, quizzes, jobs, 4, 6);
  }, [filteredPosts, quizzes, jobs, activeCategory]);

  // Handler for user interaction (persists streak to Supabase per account)
  const handlePostInteraction = async (_type: 'like' | 'share' | 'bookmark', postId?: string) => {
    try {
      const res = await recordFeedInteractionAction({ postId });
      if (res.success) {
        setStreakCount(res.currentStreak);
        setTotalPoints(res.totalPoints);
        setHasInteractedToday(true);
      } else {
        // Guest mode fallback
        if (!hasInteractedToday) {
          setHasInteractedToday(true);
          const nextStreak = streakCount + 1;
          setStreakCount(nextStreak);
          const todayDate = new Date().toISOString().slice(0, 10);
          if (typeof window !== 'undefined') {
            localStorage.setItem('aignite_last_feed_interaction', todayDate);
            localStorage.setItem('aignite_student_streak', nextStreak.toString());
          }
        }
      }
    } catch (err) {
      console.error('Failed to update streak in Supabase:', err);
    }
  };

  // Handler for solving an interleaved MCQ checkpoint
  const handleQuizAnswered = (pointsAwarded: number) => {
    setTotalPoints((prev) => prev + pointsAwarded);
    handlePostInteraction('like');
  };

  // Handler for newly created spark
  const handleSparkCreated = (newPost: SocialFeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveCategory('All');
    handlePostInteraction('like', newPost.id);
  };

  if (isAuthenticated === null && !isGuestMode) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-muted-foreground font-mono text-sm">
          <Sparkles className="w-4 h-4 animate-spin text-primary" />
          <span>Loading AI Sparks feed...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <ProtectedRouteGate
        title="AI Sparks Feed"
        badge="Account Feature - Student Sign In"
        description="Daily micro-learning feed featuring short AI video demos, cutting-edge papers, recruiter job postings, and active retention streak checkpoints."
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
            title: 'Instagram-Style AI Micro-Feed',
            description: 'Short video demos and verified AI breakthroughs formatted for quick 1-minute daily retention.',
            icon: Sparkles,
          },
          {
            title: 'Daily Habit Flame Streak',
            description: 'Maintain your daily learning habit streak by liking, sharing, or answering quick trivia checkpoints.',
            icon: Flame,
          },
          {
            title: 'Recruiter Job Opportunities',
            description: 'Discover verified AI systems engineering roles posted by premier labs and companies directly in the feed.',
            icon: Briefcase,
          },
        ]}
      />
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      {/* Centered Single-Column Container (Instagram Web / Threads Style) */}
      <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-5">
        {/* Guest Mode Banner if active */}
        {isGuestMode && !isAuthenticated && (
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong>Guest Mode:</strong> Exploring public sparks. <Link href="/login" className="underline font-bold text-primary hover:text-primary/80">Sign in</Link> to sync your streak.
              </span>
            </div>
            <Button asChild size="sm" className="font-semibold text-sm shrink-0">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        )}

        {/* 1. Header & Daily Habit Streak Status */}
        <div className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-sm font-bold bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Sparks</span>
                </Badge>
                <span className="text-sm text-muted-foreground font-mono">Micro-Learning</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
                Pulse Feed
              </h1>
            </div>

            {/* Create Spark Button */}
            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl font-bold text-sm gap-2 shadow-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Spark</span>
            </Button>
          </div>

          {/* Habit Retention Streak Bar with Static (Non-Jumping) Icon */}
          <div className="mt-3 p-3 rounded-2xl bg-card border border-border/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                hasInteractedToday ? 'bg-amber-500/15 text-amber-500' : 'bg-muted text-muted-foreground'
              }`}>
                <Flame className={`w-5 h-5 ${hasInteractedToday ? 'text-amber-500' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-foreground font-mono">
                    {streakCount} Day Streak
                  </span>
                  {hasInteractedToday ? (
                    <Badge variant="outline" className="px-1.5 py-0 text-sm font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active Today
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="px-1.5 py-0 text-sm font-semibold bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Interact to Extend
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {hasInteractedToday
                    ? 'Streak locked in for today! Great momentum.'
                    : 'Like a post or solve a quick checkpoint to extend streak.'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-mono font-bold text-primary">
                +{totalPoints} XP
              </span>
              <p className="text-sm text-muted-foreground">League Score</p>
            </div>
          </div>
        </div>

        {/* 2. Category Filter Bar (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FEED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. Main Single-Column Social Stream */}
        <div className="space-y-6 pt-1">
          {isLoadingPosts ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Sparkles className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching real sparks from Supabase...</p>
            </div>
          ) : feedItems.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground">No Sparks in this Category</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try selecting &apos;All&apos; or create a new student spark to share your work.
              </p>
              <Button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="mt-4 font-semibold text-sm rounded-xl"
              >
                View All Sparks
              </Button>
            </Card>
          ) : (
            feedItems.map((item, index) => {
              if (item.type === 'post') {
                return (
                  <SocialFeedCard
                    key={item.post.id}
                    post={item.post}
                    onPostInteracted={(type) => handlePostInteraction(type, item.post.id)}
                  />
                );
              }

              if (item.type === 'quiz') {
                return (
                  <InterleavedQuizCard
                    key={`${item.quiz.id}-${index}`}
                    quiz={item.quiz}
                    onAnswerResolved={handleQuizAnswered}
                  />
                );
              }

              if (item.type === 'job') {
                return (
                  <JobFeedCard
                    key={item.job.id}
                    job={item.job}
                    onJobBookmarked={(jobId) => handlePostInteraction('bookmark', jobId)}
                  />
                );
              }

              return null;
            })
          )}

          {/* End of Stream Footer */}
          <div className="p-6 text-center rounded-3xl bg-muted/20 border border-border/60">
            <p className="text-sm font-semibold text-foreground">
              You are all caught up on today&apos;s AI breakthroughs!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back tomorrow for fresh student community sparks and AI breakthroughs.
            </p>
            <div className="mt-4 flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm font-semibold rounded-xl"
              >
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Create Spark Modal Dialog */}
      <CreateSparkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSparkCreated={handleSparkCreated}
        userProfile={userProfile}
      />
    </div>
  );
}
