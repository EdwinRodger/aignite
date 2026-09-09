'use client';

import React from 'react';
import { CandidateTalent } from '@/lib/recruiter-data';
import {
  Award,
  Trophy,
  Mic,
  FileText,
  Send,
  ExternalLink,
  Code,
  Globe,
  Mail,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CandidateDossierModalProps {
  candidate: CandidateTalent;
  onClose: () => void;
  onInvite: (candidate: CandidateTalent) => void;
}

export function CandidateDossierModal({
  candidate,
  onClose,
  onInvite,
}: CandidateDossierModalProps) {
  const rep = candidate.reportCard;
  const res = candidate.resume;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 text-left">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs ${candidate.avatarBg}`}
            >
              {candidate.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold text-foreground font-sans">
                  {candidate.fullName}
                </DialogTitle>
                <Badge variant="outline" className="gap-1 border-primary/30 text-primary bg-primary/10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Talent</span>
                </Badge>
              </div>
              <DialogDescription className="text-sm font-mono text-muted-foreground mt-0.5">
                {candidate.collegeOrCompany} - {candidate.region} - Rank #{candidate.weeklyRank} in{' '}
                <span className="capitalize font-semibold text-foreground">{candidate.leagueTier} League</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Social Links & Contact Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border text-sm">
            <div className="flex items-center gap-4 text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5 text-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{candidate.contactEmail}</span>
              </span>
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-foreground font-bold">
                🔥 {candidate.streakDays}-Day Streak
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-primary font-bold">
                ⚡ {candidate.leaguePoints} League XP
              </span>
            </div>
          </div>

          {/* AI Report Card Section */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground font-sans">
                    AI Interview Report Card & Speech Telemetry
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aggregated across {rep.speechMetrics.totalInterviews} simulated technical interviews and oral defenses.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm uppercase font-mono text-muted-foreground block">
                    Composite Score
                  </span>
                  <span className="text-2xl font-black font-mono text-primary">
                    {rep.overallScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 10</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Axis Score Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { name: 'Knowledge Depth', score: rep.knowledgeScore, desc: 'Algorithms, CUDA, RAG math' },
                { name: 'Confidence & Pace', score: rep.confidenceScore, desc: `${rep.speechMetrics.wordsPerMinute} WPM (${rep.speechMetrics.paceRating})` },
                { name: 'Communication', score: rep.communicationScore, desc: 'STAR structure, clarity' },
                { name: 'Practical Examples', score: rep.examplesScore, desc: 'Latency, VRAM, metrics' },
                { name: 'Industry Readiness', score: rep.industryLevelScore, desc: 'Hiring bar alignment' },
              ].map((axis) => (
                <div key={axis.name} className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide block truncate">
                    {axis.name}
                  </span>
                  <div className="text-xl font-black font-mono text-foreground">
                    {axis.score.toFixed(1)}
                  </div>
                  <Progress value={(axis.score / 10) * 100} className="h-1.5" />
                  <span className="text-sm font-mono text-muted-foreground block truncate">
                    {axis.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Speech Telemetry Tags */}
            <div className="flex flex-wrap gap-2 text-sm font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-chart-1" />
                <span>Pacing: {rep.speechMetrics.wordsPerMinute} Words / Min ({rep.speechMetrics.paceRating})</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Speech Fillers: Only {rep.speechMetrics.fillerCount} detected</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Anti-Cheating Liveness Check: Passed</span>
              </span>
            </div>

            {/* Recent Spoken Answer Excerpt */}
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
              <span className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                <span>🎙️ Verbatim Spoken Defense Excerpt:</span>
              </span>
              <p className="text-sm text-foreground/90 font-serif italic leading-relaxed">
                {rep.recentModelAnswerExcerpt}
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Technical Strengths:</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                  {rep.strengths.map((s, idx) => (
                    <li key={idx} className="leading-snug">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Identified Coaching Areas:</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                  {rep.improvementAreas.map((item, idx) => (
                    <li key={idx} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Verified Badges Showcase */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              <span>Verified Proof-of-Skill Badges</span>
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {candidate.verifiedBadges.map((badgeName) => (
                <div
                  key={badgeName}
                  className="p-3.5 rounded-2xl bg-card border border-border flex items-center gap-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                    🎖️
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{badgeName}</h4>
                    <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      ✓ Algorithmic Verification Passed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume & Technical Work */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                <span>ATS Resume Summary & Projects</span>
              </h3>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                ATS Score: {res.overallAtsScore} / 100
              </Badge>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed p-4 rounded-2xl bg-muted/40 border border-border">
              {res.summary}
            </p>

            {/* Skills Grid */}
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                <span className="text-sm uppercase font-mono font-bold text-muted-foreground block">
                  Frameworks & Engines
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {res.skills.frameworks.map((s) => (
                    <Badge key={s} variant="secondary" className="text-sm font-mono">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                <span className="text-sm uppercase font-mono font-bold text-muted-foreground block">
                  Infrastructure & Deployment
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {res.skills.infrastructure.map((s) => (
                    <Badge key={s} variant="secondary" className="text-sm font-mono">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlighted Projects */}
            <div className="space-y-3">
              <span className="text-sm font-bold text-foreground font-mono block">
                Highlighted Production Systems Projects:
              </span>
              <div className="space-y-3">
                {res.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground font-mono">{proj.title}</h4>
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 font-mono">
                        {proj.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-sm font-semibold">
            Close Dossier
          </Button>
          <Button
            onClick={() => {
              onClose();
              onInvite(candidate);
            }}
            className="rounded-xl text-sm font-bold shadow-md shadow-primary/20 gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Fast-Track Direct Interview Invitation</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
