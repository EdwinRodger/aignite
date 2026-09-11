'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { DeepDiveCard } from '@/components/deep-dives/DeepDiveCard';
import { DeepDive } from '@/lib/deep-dives-data';
import { getDeepDivesAction } from '@/app/actions/deep-dives';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Cpu,
  ArrowLeft,
  Search,
  BookOpen,
  Bookmark,
  Layers,
  ShieldCheck,
  Zap,
  Filter,
} from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

const CATEGORIES = [
  'All',
  'Inference & Infra',
  'Kernel Optimization',
  'Agents & RL',
  'GenAI & LLMs',
  'Vision & Multimodal',
];

export default function DeepDivesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [deepDives, setDeepDives] = useState<DeepDive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check student authentication
  useEffect(() => {
    let isMounted = true;

    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsAuthenticated(true);
        } else if (
          typeof window !== 'undefined' &&
          localStorage.getItem('aignite_student_session')
        ) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (
          typeof window !== 'undefined' &&
          localStorage.getItem('aignite_student_session')
        ) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

    if (typeof window !== 'undefined') {
      const storedGuest = localStorage.getItem('aignite_feed_guest');
      if (storedGuest === 'true') {
        queueMicrotask(() => {
          if (isMounted) setIsGuestMode(true);
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch deep dives from Supabase
  const loadDeepDives = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDeepDivesAction();
      if (result.success && result.deepDives) {
        setDeepDives(result.deepDives);
      }
    } catch (err) {
      console.error('Failed to load deep dives from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeepDives();
  }, [loadDeepDives]);

  // Handle bookmark state changes from cards
  const handleBookmarkChanged = (deepDiveId: string, isBookmarked: boolean) => {
    setDeepDives((prev) =>
      prev.map((item) =>
        item.id === deepDiveId
          ? {
              ...item,
              isBookmarked,
              bookmarksCount: Math.max(
                0,
                item.bookmarksCount + (isBookmarked ? 1 : -1)
              ),
            }
          : item
      )
    );
  };

  // Filtered and searched list
  const filteredDeepDives = useMemo(() => {
    let items = deepDives;

    if (showBookmarksOnly) {
      items = items.filter((item) => item.isBookmarked);
    }

    if (activeCategory !== 'All') {
      items = items.filter(
        (item) =>
          item.category.toLowerCase() === activeCategory.toLowerCase() ||
          item.tagBadge.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.keyTakeaway.toLowerCase().includes(q) ||
          item.sourceName.toLowerCase().includes(q) ||
          item.tagBadge.toLowerCase().includes(q) ||
          item.metrics.some(
            (m) =>
              m.label.toLowerCase().includes(q) ||
              m.value.toLowerCase().includes(q)
          )
      );
    }

    return items;
  }, [deepDives, activeCategory, searchQuery, showBookmarksOnly]);

  const bookmarkedCount = useMemo(
    () => deepDives.filter((d) => d.isBookmarked).length,
    [deepDives]
  );

  if (isAuthenticated === null && !isGuestMode) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-muted-foreground font-mono text-sm">
          <Cpu className="w-5 h-5 animate-spin text-primary" />
          <span>Loading architecture library from Supabase...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <ProtectedRouteGate
        title="Architecture Deep-Dives"
        badge="Systems Engineering & Research Library"
        description="Comprehensive breakdowns of foundational AI research papers, GPU kernel optimizations, and production systems engineering architectures with active verification checkpoints."
        allowGuestPreview={true}
        guestPreviewLabel="Explore Deep-Dives as Guest"
        onGuestPreview={() => {
          setIsGuestMode(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('aignite_feed_guest', 'true');
          }
        }}
        features={[
          {
            title: 'Production Hardware Telemetry',
            description:
              'Concrete empirical metrics covering VRAM memory savings, arithmetic intensity, and kernel latency.',
            icon: Cpu,
          },
          {
            title: 'Architecture Trade-Off Comparisons',
            description:
              'Before vs After structural comparisons explaining how bottlenecks are eliminated in production.',
            icon: Layers,
          },
          {
            title: 'Technical Verification Checkpoints',
            description:
              'Interactive conceptual checkpoints to rigorously validate your systems engineering intuition.',
            icon: ShieldCheck,
          },
        ]}
      />
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      {/* Centered Spacious Reading Layout (Max-w-4xl) */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Top Navigation Link */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Link href="/feed">
              <ArrowLeft className="w-4 h-4" />
              <span>Switch to AI Sparks Feed</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-sm font-mono text-muted-foreground border-border/80"
            >
              {deepDives.length} Architectures Indexed
            </Badge>
          </div>
        </div>

        {/* Guest Mode Notification Banner */}
        {isGuestMode && !isAuthenticated && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>
                <strong>Guest Mode Active:</strong> You are exploring architecture
                deep-dives as a guest.{' '}
                <Link
                  href="/login"
                  className="underline font-bold text-primary hover:text-primary/80"
                >
                  Sign in
                </Link>{' '}
                to permanently sync your bookmarked papers and study progress to
                Supabase.
              </span>
            </div>
            <Button
              asChild
              size="sm"
              className="font-semibold text-sm shrink-0 rounded-xl"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        )}

        {/* 2. Hero Header & Authoritative Description */}
        <div className="border-b border-border/60 pb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-sm font-bold bg-primary/10 text-primary border-primary/20"
            >
              <Cpu className="w-4 h-4" />
              <span>Systems Engineering Lab</span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              Research & Infra Library
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Architecture Deep-Dives
            </h1>
            <p className="text-base text-foreground/90 mt-2 max-w-3xl leading-relaxed">
              A rigorous technical library breaking down foundational AI research
              papers, GPU kernel optimizations, and production systems engineering
              architectures. Unlike fast daily news sparks, Deep Dives
              deconstructs the underlying mechanics, memory layouts, and hardware
              trade-offs that power modern AI systems.
            </p>
          </div>

          {/* What Users Can Do Here: 4-Pillar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Deconstruct Modern Systems
                </h2>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                  Analyze KV-cache paging, CUDA warp specialization, and
                  post-training RL.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Inspect Hardware Telemetry
                </h2>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                  Review empirical VRAM savings, HBM bandwidth saturation, and
                  kernel latencies.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Evaluate Structural Trade-offs
                </h2>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                  Contrast bottlenecks with optimized implementations through
                  visual comparison boxes.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Validate Systems Intuition
                </h2>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">
                  Solve interactive technical checkpoints on every architecture to
                  verify retention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Search and View Filters */}
        <div className="space-y-3">
          {/* Search bar + Bookmark Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search architectures by keyword, paper, hardware (e.g. Hopper, PagedAttention, GRPO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-sm bg-card rounded-xl border-border focus-visible:ring-primary/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Switcher: All vs Bookmarks */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border shrink-0">
              <button
                type="button"
                onClick={() => setShowBookmarksOnly(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  !showBookmarksOnly
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Deep-Dives
              </button>
              <button
                type="button"
                onClick={() => setShowBookmarksOnly(true)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showBookmarksOnly
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({bookmarkedCount})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Main Deep-Dives List */}
        <section aria-label="Architecture Deep-Dive Breakdowns" className="space-y-6 pt-2">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Cpu className="w-7 h-7 animate-spin text-primary" />
              <p className="text-sm font-medium">
                Querying architecture library from Supabase...
              </p>
            </div>
          ) : filteredDeepDives.length === 0 ? (
            <Card className="p-12 text-center rounded-2xl border-dashed">
              <Cpu className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-foreground">
                {showBookmarksOnly
                  ? 'No Saved Architectures Yet'
                  : 'No Matching Architectures Found'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                {showBookmarksOnly
                  ? 'Click the bookmark icon on any architecture breakdown to save it to your personal technical library.'
                  : 'Try adjusting your search query or switching to another category.'}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                {showBookmarksOnly && (
                  <Button
                    type="button"
                    onClick={() => setShowBookmarksOnly(false)}
                    className="font-semibold text-sm rounded-xl"
                  >
                    Browse All Architectures
                  </Button>
                )}
                {(activeCategory !== 'All' || searchQuery) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchQuery('');
                    }}
                    className="font-semibold text-sm rounded-xl"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            filteredDeepDives.map((post) => (
              <DeepDiveCard
                key={post.id}
                post={post}
                onBookmarkChanged={handleBookmarkChanged}
              />
            ))
          )}

          {/* End of Deep-Dives Library Footer */}
          {!isLoading && filteredDeepDives.length > 0 && (
            <div className="p-6 text-center rounded-2xl bg-muted/20 border border-border/60">
              <p className="text-sm font-semibold text-foreground">
                You have reviewed all available architecture breakdowns in this
                view.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Looking for short-form AI news and 1-minute video demo reels?
                Visit the{' '}
                <Link
                  href="/feed"
                  className="text-primary font-semibold hover:underline"
                >
                  AI Sparks pulse feed
                </Link>
                .
              </p>
              <div className="mt-4 flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  className="text-sm font-semibold rounded-xl"
                >
                  Back to Top
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
