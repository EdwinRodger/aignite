'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SocialFeedPost } from '@/lib/feed-social-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  Globe,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Check,
} from 'lucide-react';
import { toggleSocialPostLikeAction } from '@/app/actions/feed';

function getInitials(name: string): string {
  if (!name) return 'AI';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface SocialFeedCardProps {
  post: SocialFeedPost;
  onPostInteracted?: (type: 'like' | 'share' | 'bookmark') => void;
}

export function SocialFeedCard({ post, onPostInteracted }: SocialFeedCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCommentNotice, setShowCommentNotice] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Toggle Like with action and streak trigger
  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (onPostInteracted) {
      onPostInteracted('like');
    }

    try {
      await toggleSocialPostLikeAction(post.id);
    } catch (err) {
      console.error('Failed to toggle like on server:', err);
    }
  };

  // Toggle Video Play / Pause
  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Video Sound
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Autoplay video when scrolled into view (Instagram-style), pause when scrolled out
  useEffect(() => {
    if (post.mediaType !== 'video' || !post.mediaUrl) return;

    const videoEl = videoRef.current;
    const containerEl = videoContainerRef.current;
    if (!videoEl || !containerEl) return;

    videoEl.muted = isMuted;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            videoEl.play().catch(() => {
              setIsPlaying(false);
            });
          } else if (entry.intersectionRatio < 0.15) {
            videoEl.pause();
          }
        });
      },
      { threshold: [0.15, 0.4] }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [post.mediaType, post.mediaUrl, isMuted]);

  // Handle Share: Always copies post link to clipboard and triggers message
  const handleShare = async () => {
    if (onPostInteracted) {
      onPostInteracted('share');
    }

    const postUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/feed#${post.id}`
      : `https://aignite.ai/feed#${post.id}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    if (onPostInteracted) {
      onPostInteracted('bookmark');
    }
  };

  // Source Type Icon & Label
  const renderSourceBadge = () => {
    switch (post.sourceType) {
      case 'news':
        return (
          <Badge variant="outline" className="gap-1.5 px-2 py-0.5 text-sm font-semibold bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Globe className="w-3.5 h-3.5" />
            <span>AI News</span>
          </Badge>
        );
      case 'lab':
        return (
          <Badge variant="outline" className="gap-1.5 px-2 py-0.5 text-sm font-semibold bg-purple-500/10 text-purple-400 border-purple-500/20">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Research Lab</span>
          </Badge>
        );
      case 'user':
      default:
        return (
          <Badge variant="outline" className="gap-1.5 px-2 py-0.5 text-sm font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Community Spark</span>
          </Badge>
        );
    }
  };

  return (
    <Card id={post.id} className="w-full overflow-hidden border border-border/80 bg-card/95 shadow-md hover:shadow-lg transition-all rounded-3xl">
      {/* 1. Author & Source Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            {post.authorAvatarUrl && !avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authorAvatarUrl}
                alt={post.authorName}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-sm font-bold text-primary">
                {getInitials(post.authorName)}
              </span>
            )}
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-foreground truncate">
                {post.authorName}
              </span>
              {renderSourceBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <span>{post.authorHandle}</span>
              <span>-</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Source Link if Available */}
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Read full source from ${post.sourceName || 'external link'}`}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* 2. Media Container (Video, Image, or Typographic Banner) */}
      {post.mediaType === 'video' && post.mediaUrl ? (
        <div
          ref={videoContainerRef}
          onClick={handleTogglePlay}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black/90 overflow-hidden cursor-pointer group flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={post.mediaUrl}
            playsInline
            loop
            muted={isMuted}
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Center Play/Pause Indicator Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-xs transition-opacity pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/70 text-white border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform hover:scale-110">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Bottom Right Mute/Unmute Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      ) : post.mediaType === 'image' && post.mediaUrl ? (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-muted/40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
      ) : null}

      {/* 3. Social Interaction Bar (Like, Comment, Share, Bookmark) */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Heart / Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
            title={isLiked ? 'Unlike' : 'Like spark'}
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isLiked
                  ? 'fill-rose-500 text-rose-500 scale-105'
                  : 'text-muted-foreground group-hover:text-rose-500'
              }`}
            />
            <span
              className={`text-sm font-bold font-mono ${
                isLiked ? 'text-rose-500' : 'text-muted-foreground group-hover:text-foreground'
              }`}
            >
              {likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment Button (Visible, shows count, disabled with notice) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCommentNotice(true);
                setTimeout(() => setShowCommentNotice(false), 2500);
              }}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl opacity-75 hover:opacity-100 hover:bg-muted/60 transition-all cursor-pointer"
              title="Comments coming soon"
            >
              <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-bold font-mono text-muted-foreground group-hover:text-foreground">
                {post.commentsCount}
              </span>
            </button>

            {/* Coming Soon Tooltip Popover */}
            {showCommentNotice && (
              <div className="absolute left-0 bottom-full mb-2 z-20 whitespace-nowrap px-3 py-1.5 rounded-xl bg-popover text-popover-foreground border border-border text-sm font-medium shadow-xl animate-in fade-in zoom-in-95">
                💬 Comments coming in the next update!
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              title="Copy spark link to clipboard"
            >
              {copiedLink ? (
                <Check className="w-5 h-5 text-emerald-500 animate-in zoom-in-50" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
              <span className={`text-sm font-semibold transition-colors ${copiedLink ? 'text-emerald-500' : ''}`}>
                {copiedLink ? 'Copied!' : ''}
              </span>
            </button>

            {/* Clear feedback message when copied */}
            {copiedLink && (
              <div className="absolute left-0 bottom-full mb-2 z-30 whitespace-nowrap px-3 py-1.5 rounded-xl bg-popover text-popover-foreground border border-border text-sm font-semibold shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark spark'}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? 'fill-primary text-primary' : ''
            }`}
          />
        </button>
      </div>

      {/* 4. Content Caption, Key Takeaway & Tags */}
      <div className="px-4 sm:px-5 pb-5 space-y-3">
        {/* Title */}
        <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight leading-snug">
          {post.title}
        </h2>

        {/* Summary / Caption */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className={!isExpanded && post.summary.length > 140 ? 'line-clamp-2' : ''}>
            {post.summary}
          </p>
          {post.summary.length > 140 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 font-semibold text-primary hover:underline cursor-pointer"
            >
              {isExpanded ? 'Show less' : '...more'}
            </button>
          )}
        </div>

        {/* Key Takeaway Highlight Box */}
        {post.keyTakeaway && (
          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <strong className="font-bold text-primary">Takeaway: </strong>
              <span>{post.keyTakeaway}</span>
            </div>
          </div>
        )}

        {/* Category & Tags */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <Badge variant="secondary" className="text-sm font-semibold">
            {post.category}
          </Badge>
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-sm font-medium text-primary hover:underline cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
