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
  Zap,
  ArrowRight,
  Brain,
  Cpu,
  Layers,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeedPost } from '@/lib/feed-data';
import { AudioReaderButton } from './AudioReaderButton';
import { submitFeedQuizAnswer, toggleFeedPostLike, toggleFeedPostBookmark } from '@/app/actions/feed';

interface FeedCardProps {
  post: FeedPost;
  onAnswerCorrect?: (points: number) => void;
}

export function FeedCard({ post, onAnswerCorrect }: FeedCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSelect = async (index: number) => {
    if (hasAnswered) return;

    setSelectedIdx(index);
    setHasAnswered(true);

    const result = await submitFeedQuizAnswer(post.id, post.quiz.id, index);
    setIsCorrect(result.isCorrect);

    if (result.isCorrect) {
      if (onAnswerCorrect) {
        onAnswerCorrect(result.pointsAwarded);
      }

      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#F97316', '#E11D48', '#10B981', '#6366F1'],
          });
        }
      } catch {
        // Fallback for restricted canvas
      }
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
    setLikes((prev) => (nextState ? prev + 1 : prev - 1));
    await toggleFeedPostLike(post.id);
  };

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    await toggleFeedPostBookmark(post.id);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/feed#${post.id}` : '';
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <article
      id={post.id}
      className="w-full max-w-xl mx-auto rounded-2xl bg-card text-card-foreground border border-border shadow-xl relative overflow-hidden transition-all duration-300 hover:border-border/80 flex flex-col mb-6"
    >
      {/* Decorative Warm Flame Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {post.category === 'Agents & RL' ? (
              <Brain className="w-3.5 h-3.5" />
            ) : post.category === 'Inference & Infra' ? (
              <Cpu className="w-3.5 h-3.5" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            <span>{post.tagBadge}</span>
          </span>
          <span className="text-xs text-muted-foreground font-mono">{post.readTime}</span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline-block">• {post.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Web Speech API Audio TTS Readout */}
          <AudioReaderButton title={post.title} textToRead={`${post.summary} ${post.keyTakeaway}`} />

          {/* League Points Badge */}
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
              isCorrect
                ? 'bg-primary/20 text-primary border-primary/40 scale-105'
                : 'text-primary bg-primary/10 border-primary/20'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{isCorrect ? '+5 Claimed!' : '+5 XP'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
          {post.title}
        </h2>

        {/* 2-Sentence Architectural Breakdown */}
        <p className="text-sm text-foreground/90 leading-relaxed font-sans">
          {post.summary}
        </p>

        {/* Highlighted Rule of Thumb Callout */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary-foreground/90 font-serif italic flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="text-foreground/90 not-italic font-sans text-xs leading-relaxed">
            {post.keyTakeaway}
          </span>
        </div>

        {/* Hardware / Architectural Metrics Grid */}
        {post.metrics && post.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {post.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-center"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  {m.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 font-mono">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Visual Architecture Comparison Box */}
        {post.diagramComparison && (
          <div className="p-3.5 rounded-xl bg-muted/60 border border-border font-mono text-[11px] space-y-2">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider flex items-center justify-between">
              <span>Architecture Trade-Off</span>
              <span className="text-primary font-bold">Production Impact</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded bg-card/80 border border-border/80 text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive/80 shrink-0" />
                <span className="text-[11px] line-through">{post.diagramComparison.before}</span>
              </div>
              <div className="p-2 rounded bg-card border border-primary/30 text-foreground font-semibold flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-[11px] text-primary truncate">{post.diagramComparison.after}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground italic tracking-normal font-sans pt-0.5">
              💡 {post.diagramComparison.advantage}
            </p>
          </div>
        )}

        {/* 5-Second Interactive Micro-Quiz Card */}
        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5" id={`quiz-${post.quiz.id}`}>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>5-Second Check: {post.quiz.questionText}</span>
            </span>
            {hasAnswered && (
              <button
                type="button"
                onClick={handleReset}
                aria-label="Retry quiz"
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Retry</span>
              </button>
            )}
          </div>

          <div role="radiogroup" aria-labelledby={`quiz-${post.quiz.id}`} className="space-y-2">
            {post.quiz.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isOptionCorrect = idx === post.quiz.correctOptionIndex;

              let buttonStyle =
                'bg-muted/50 hover:bg-muted border-border text-foreground hover:border-primary/40';

              if (hasAnswered) {
                if (isOptionCorrect) {
                  buttonStyle =
                    'bg-primary/20 border-primary text-foreground shadow-sm shadow-primary/20 ring-1 ring-primary/40 font-semibold';
                } else if (isSelected && !isOptionCorrect) {
                  buttonStyle = 'bg-destructive/20 border-destructive text-foreground';
                } else {
                  buttonStyle = 'opacity-40 bg-muted/30 border-border text-muted-foreground';
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
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${buttonStyle}`}
                >
                  <span className="pr-2">{option}</span>
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

          {/* Feedback & Technical Takeaway Drawer */}
          <div role="status" aria-live="polite">
            {hasAnswered && (
              <div className="mt-3 p-3 rounded-xl bg-muted/70 border border-border text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                {isCorrect ? (
                  <div>
                    <div className="font-bold text-primary flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Spot On! +5 Points Added to Weekly League</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {post.quiz.explanation}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-destructive flex items-center gap-1.5 mb-1">
                      <span>Insight for Revision</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {post.quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Footer Bar */}
      <div className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            aria-label={isLiked ? 'Unlike spark' : 'Like spark'}
            className={`flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1 ${
              isLiked ? 'text-primary font-semibold' : 'hover:text-foreground'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-primary text-primary' : ''
              }`}
            />
            <span className="font-mono text-[11px]">{likes}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark spark for revision'}
            className={`flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1 ${
              isBookmarked ? 'text-primary font-semibold' : 'hover:text-foreground'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isBookmarked ? 'fill-primary text-primary' : ''
              }`}
            />
            <span className="hidden sm:inline text-[11px]">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share spark"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                <span className="text-[11px] text-primary font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Source Link */}
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1.5 py-0.5"
        >
          <span className="truncate max-w-[130px] sm:max-w-[180px]">{post.sourceName}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </div>
    </article>
  );
}
