'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProtectedRouteGateProps {
  title?: string;
  badge?: string;
  description?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  allowGuestPreview?: boolean;
  onGuestPreview?: () => void;
  guestPreviewLabel?: string;
}

export function ProtectedRouteGate({
  title = 'Student Dashboard',
  badge = 'Protected Student Area - Account Required',
  description = 'Your personalized engineering telemetry, weekly league standing, interview report cards, and active flame streaks are saved directly to your verified student account.',
  allowGuestPreview = false,
  onGuestPreview,
  guestPreviewLabel = 'Explore as Guest',
  features = [
    {
      title: 'Persistent Streak & League XP',
      description: 'Retain your daily problem-of-the-day flame streak and climb weekly ranked divisions.',
      icon: Flame,
    },
    {
      title: 'Oral Defense Voice Telemetry',
      description: 'Comprehensive 5-metric report cards tracking speech cadence, fluency, and technical depth.',
      icon: Trophy,
    },
    {
      title: 'Verified Recruiter Portfolio',
      description: 'Showcase verified company pack completion badges to top hiring managers without resume fluff.',
      icon: ShieldCheck,
    },
  ],
}: ProtectedRouteGateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Card className="p-6 sm:p-10 rounded-3xl border-border bg-card shadow-md space-y-8 text-center">
        {/* Header Badge & Title */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center mb-2">
            <Image
              src="/logo-icon.png"
              alt="AIgnite Logo"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
              priority
            />
          </div>

          <div>
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3 Unlocked Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
          {features.map((feat, idx) => {
            const Icon = feat.icon || CheckCircle2;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-border bg-muted/30 flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-foreground">
                    {feat.title}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto px-8 font-bold text-sm shadow-xs gap-2">
            <Link href="/login">
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold text-sm">
            <Link href="/login">
              <span>Create Free Account</span>
            </Link>
          </Button>
          {allowGuestPreview && onGuestPreview && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onGuestPreview}
              className="w-full sm:w-auto font-bold text-sm text-primary hover:bg-primary/10 gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{guestPreviewLabel}</span>
            </Button>
          )}
        </div>

        {/* Public Routes Alternative Link */}
        <div className="pt-2 text-sm text-muted-foreground">
          <span>Just exploring? You can browse our </span>
          <Link
            href="/resume-analyzer"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Free AI Resume ATS
          </Link>
          <span>, </span>
          <Link
            href="/roadmap"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Career Roadmap
          </Link>
          <span>, or </span>
          <Link
            href="/packs"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Course Packs
          </Link>
          <span> without an account.</span>
        </div>
      </Card>
    </div>
  );
}
