'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Cpu,
  Layers,
  Brain,
  Zap,
  Check,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DeepDive } from '@/lib/deep-dives-data';
import { AudioReaderButton } from '@/components/feed/AudioReaderButton';
import {
  submitDeepDiveQuizAction,
  toggleDeepDiveLikeAction,
  toggleDeepDiveBookmarkAction,
} from '@/app/actions/deep-dives';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DeepDiveCardProps {
  post: DeepDive;
  onBookmarkChanged?: (deepDiveId: string, isBookmarked: boolean) => void;
}

export function DeepDiveCard({ post, onBookmarkChanged }: DeepDiveCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    post.userSelectedOptionIndex ?? null
  );
  const [hasAnswered, setHasAnswered] = useState(post.isQuizCompleted ?? false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(
    post.isUserQuizCorrect ?? null
  );
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [bookmarks, setBookmarks] = useState(post.bookmarksCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const handleSelect = async (index: number) => {
    if (hasAnswered || isSubmittingQuiz) return;

    setSelectedIdx(index);
    setHasAnswered(true);
    setIsSubmittingQuiz(true);

    try {
      const result = await submitDeepDiveQuizAction(post.id, post.quiz.id, index);
      setIsCorrect(result.isCorrect);

      if (result.isCorrect) {
        try {
          const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (!prefersReducedMotion) {
            confetti({
              particleCount: 40,
              spread: 55,
              origin: { y: 0.65 },
              colors: ['#3B82F6', '#8B5CF6', '#10B981', '#06B6D4'],
            });
          }
        } catch {
          // Canvas fallback
        }
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setHasAnswered(false);
    setIsCorrect(null);
  };

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    await toggleDeepDiveLikeAction(post.id);
  };

  const handleToggleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    setBookmarks((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    if (onBookmarkChanged) {
      onBookmarkChanged(post.id, nextState);
    }
    await toggleDeepDiveBookmarkAction(post.id);
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/deep-dives#${post.slug || post.id}`
        : '';
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Select category icon
  const CategoryIcon =
    post.category === 'Agents & RL'
      ? Brain
      : post.category === 'Kernel Optimization' || post.category === 'Inference & Infra'
      ? Cpu
      : Layers;

  return (
    <Card
      id={post.slug || post.id}
      className="w-full rounded-2xl bg-card text-card-foreground border border-border shadow-xs transition-all duration-300 hover:border-primary/40 flex flex-col mb-6 overflow-hidden"
    >
      {/* 1. Header Bar */}
      <CardHeader className="p-4 sm:p-5 border-b border-border/60 flex flex-row items-center justify-between gap-3 bg-muted/20 space-y-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <Badge
            variant="outline"
            className="gap-1.5 bg-primary/10 text-primary border-primary/20 text-sm font-bold py-0.5 px-2.5"
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </Badge>

          {/* Tag Badge */}
          <span className="text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/60">
            {post.tagBadge}
          </span>

          {/* Difficulty Tier */}
          <Badge
            variant="secondary"
            className="text-sm font-medium py-0.5 px-2 text-foreground/80 bg-muted/70"
          >
            {post.difficulty}
          </Badge>

          {/* Read Time */}
          <span className="text-sm text-muted-foreground font-mono hidden sm:inline-block">
            {post.readTime}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Audio TTS Readout */}
          <AudioReaderButton
            title={post.title}
            textToRead={`${post.summary} ${post.keyTakeaway}`}
          />

          {/* Bookmark Header Shortcut */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark deep dive'}
            className={`h-8 px-2 text-sm rounded-lg ${
              isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>

      {/* 2. Main Content Body */}
      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
          {post.title}
        </h2>

        {/* Deep Architectural Breakdown */}
        <p className="text-sm text-foreground/90 leading-relaxed font-sans">
          {post.summary}
        </p>

        {/* Highlighted Rule of Thumb Callout */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-bold text-foreground block mb-0.5">
              Production Architecture Takeaway:
            </span>
            <span className="text-sm text-muted-foreground font-sans leading-relaxed">
              {post.keyTakeaway}
            </span>
          </div>
        </div>

        {/* Production Hardware / Architectural Telemetry Grid */}
        {post.metrics && post.metrics.length > 0 && (
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Systems Telemetry & Performance Benchmarks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {post.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-muted/40 border border-border flex flex-col justify-center"
                >
                  <span className="text-sm uppercase font-mono tracking-wider text-muted-foreground">
                    {m.label}
                  </span>
                  <span className="text-base font-extrabold text-foreground mt-0.5 font-mono">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Architecture Trade-Off Comparison Box */}
        {post.diagramComparison && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border/80 space-y-3 font-mono text-sm">
            <div className="text-muted-foreground text-sm uppercase tracking-wider flex items-center justify-between font-sans">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" />
                <span>Architecture Trade-Off Analysis</span>
              </span>
              <span className="text-primary font-semibold">Production Impact</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-card/80 border border-border/80 text-muted-foreground flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/70 shrink-0" />
                <span className="text-sm font-mono line-through opacity-80">
                  {post.diagramComparison.before}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-primary/40 text-foreground font-semibold flex items-center justify-between gap-2.5 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-primary font-mono font-bold">
                    {post.diagramComparison.after}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-sans pt-1 leading-relaxed">
              <strong>Engineering Advantage:</strong> {post.diagramComparison.advantage}
            </p>
          </div>
        )}

        {/* Technical Verification Checkpoint (Interactive Check Without XP) */}
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-extrabold text-foreground" id={`quiz-${post.quiz.id}`}>
                Technical Verification Checkpoint
              </span>
            </div>
            {hasAnswered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                aria-label="Retry verification checkpoint"
                className="gap-1.5 text-muted-foreground hover:text-foreground text-sm h-8 px-2.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>

          <p className="text-sm text-foreground font-medium mb-3">
            {post.quiz.questionText}
          </p>

          <div role="radiogroup" aria-labelledby={`quiz-${post.quiz.id}`} className="space-y-2">
            {post.quiz.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isOptionCorrect = idx === post.quiz.correctOptionIndex;

              let buttonStyle =
                'bg-muted/40 hover:bg-muted/80 border-border text-foreground hover:border-primary/40';

              if (hasAnswered) {
                if (isOptionCorrect) {
                  buttonStyle =
                    'bg-primary/10 border-primary text-foreground shadow-xs font-semibold';
                } else if (isSelected && !isOptionCorrect) {
                  buttonStyle = 'bg-destructive/15 border-destructive text-foreground';
                } else {
                  buttonStyle = 'opacity-40 bg-muted/20 border-border text-muted-foreground';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${buttonStyle}`}
                >
                  <span className="pr-2 leading-relaxed">{option}</span>
                  {hasAnswered && isOptionCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                  )}
                  {hasAnswered && isSelected && !isOptionCorrect && (
                    <XCircle className="w-4 h-4 text-destructive shrink-0 animate-in fade-in zoom-in-75 duration-200" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Verification Feedback Drawer (No XP references) */}
          <div role="status" aria-live="polite">
            {hasAnswered && (
              <div className="mt-3 p-3.5 rounded-xl bg-muted/70 border border-border text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                {isCorrect ? (
                  <div>
                    <div className="font-bold text-primary flex items-center gap-1.5 mb-1 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Understanding</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.quiz.explanation}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-destructive flex items-center gap-1.5 mb-1 text-sm">
                      <XCircle className="w-4 h-4" />
                      <span>Systems Architecture Insight</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* 3. Footer Bar */}
      <CardFooter className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            aria-label={isLiked ? 'Unlike deep dive' : 'Like deep dive'}
            className={`flex items-center gap-1.5 min-h-[44px] px-2.5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl cursor-pointer ${
              isLiked ? 'text-primary font-semibold' : 'hover:text-foreground'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-primary text-primary' : ''
              }`}
            />
            <span className="font-mono text-sm">{likes}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? 'Remove from saved' : 'Save deep dive to library'}
            className={`flex items-center gap-1.5 min-h-[44px] px-2.5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl cursor-pointer ${
              isBookmarked ? 'text-primary font-semibold' : 'hover:text-foreground'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isBookmarked ? 'fill-primary text-primary' : ''
              }`}
            />
            <span className="hidden sm:inline text-sm">
              {isBookmarked ? 'Saved' : 'Bookmark'}
            </span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share deep dive link"
            className="flex items-center gap-1.5 min-h-[44px] px-2.5 py-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Source Link to Research Paper or Framework */}
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1 bg-muted/40 hover:bg-muted/70 border border-border/50"
        >
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="truncate max-w-[140px] sm:max-w-[200px] font-medium">
            {post.sourceName}
          </span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
        </a>
      </CardFooter>
    </Card>
  );
}
