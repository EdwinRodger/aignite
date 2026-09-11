'use client';

import React, { useState } from 'react';
import { JobPostingFeedItem } from '@/lib/feed-social-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Trophy,
  DollarSign,
  Bookmark,
  Sparkles,
  Check,
} from 'lucide-react';

interface JobFeedCardProps {
  job: JobPostingFeedItem;
  onJobBookmarked?: (jobId: string) => void;
}

function getInitials(name: string): string {
  if (!name) return 'CO';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function JobFeedCard({ job, onJobBookmarked }: JobFeedCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    if (onJobBookmarked) {
      onJobBookmarked(job.id);
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2 border-primary/25 bg-gradient-to-b from-primary/5 via-card to-card shadow-md hover:shadow-lg transition-all rounded-3xl p-5 sm:p-6">
      {/* 1. Header: Recruiter & Company Info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Company Logo or Initials */}
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            {job.companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primary">
                {getInitials(job.companyName)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-foreground truncate">
                {job.companyName}
              </span>
              <Badge variant="outline" className="gap-1 px-2 py-0 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Recruiter</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </span>
              {job.employmentType && (
                <>
                  <span>-</span>
                  <span>{job.employmentType}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Career Spark Badge */}
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-1 text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Hiring</span>
        </Badge>
      </div>

      {/* 2. Job Title & Category */}
      <div className="space-y-1 mb-3">
        <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight leading-snug">
          {job.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* 3. Salary & League Eligibility Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {job.salaryRange && (
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-foreground font-mono block">
                {job.salaryRange}
              </span>
              <span className="text-sm text-muted-foreground">Compensation</span>
            </div>
          </div>
        )}

        {job.minimumLeagueTier && (
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground block truncate">
                {job.minimumLeagueTier}
              </span>
              <span className="text-sm text-muted-foreground">Min League Requirement</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Required AI Skills Tags */}
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <span className="text-sm font-semibold text-muted-foreground mr-1">Skills:</span>
          {job.skillsRequired.map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="text-sm font-medium">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {/* 5. Actions: Apply & Bookmark */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
        <button
          type="button"
          onClick={handleToggleBookmark}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-sm font-medium"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <Button
          asChild={Boolean(job.applyUrl)}
          onClick={() => {
            if (!job.applyUrl) {
              setHasApplied(true);
              setTimeout(() => setHasApplied(false), 3000);
            }
          }}
          className="rounded-xl text-sm font-bold gap-2 shadow-xs"
        >
          {job.applyUrl ? (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <span>Apply Directly</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              {hasApplied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Application Sent!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Quick Apply with AI Profile</span>
                </>
              )}
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}
