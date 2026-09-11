'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { CandidateTalent, RecruiterJob } from '@/lib/recruiter-data';
import { getCandidateDossierAction, getRecruiterJobsAction } from '@/app/actions/recruiter';
import { getAuthUserAction } from '@/app/actions/auth';
import { InterviewInviteModal } from '@/components/recruiter/InterviewInviteModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  Building2,
} from 'lucide-react';

const TIER_META: Record<string, { label: string; icon: string; badgeClass: string }> = {
  bronze: { label: 'Bronze AI Eng', icon: '🥉', badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold' },
  silver: { label: 'Silver AI Eng', icon: '🥈', badgeClass: 'bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300 font-semibold' },
  gold: { label: 'Gold AI Eng', icon: '🥇', badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold' },
  diamond: { label: 'LLM Master', icon: '💎', badgeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold' },
  architect: { label: 'AI Architect', icon: '👑', badgeClass: 'bg-primary/10 border-primary/30 text-primary font-bold shadow-xs' },
};

export default function CandidateDossierPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.id as string;

  const [candidate, setCandidate] = useState<CandidateTalent | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showRawResume, setShowRawResume] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  const [recruiterInfo, setRecruiterInfo] = useState({
    company: 'Enterprise AI Partner',
    name: 'Talent Acquisition Lead',
    designation: 'GenAI & Systems Hiring Team',
  });

  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aignite_recruiter_profile');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setRecruiterInfo((prev) => ({ ...prev, ...parsed }));
          } catch {
            // fallback
          }
        }
      }
    }, 0);

    startTransition(async () => {
      const auth = await getAuthUserAction();
      if (!auth.loggedIn || auth.role !== 'recruiter') {
        router.push('/recruiter/login');
        return;
      }

      const jobsRes = await getRecruiterJobsAction();
      if (jobsRes.success) setJobs(jobsRes.jobs);

      if (!candidateId) {
        setError('No candidate ID provided.');
        setLoading(false);
        return;
      }

      const res = await getCandidateDossierAction(candidateId);
      if (res.success && res.candidate) {
        setCandidate(res.candidate);
      } else {
        setError(res.error || 'Candidate dossier could not be located.');
      }
      setLoading(false);
    });

    return () => clearTimeout(timer);
  }, [candidateId, router]);

  const handleCopyResume = () => {
    if (candidate?.resume.rawText) {
      navigator.clipboard.writeText(candidate.resume.rawText);
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-mono text-muted-foreground">Loading Candidate Technical Dossier...</p>
        </main>
        <MobileTabBar />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Candidate Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {error || 'The requested candidate profile is unavailable or has been updated.'}
          </p>
          <Button
            type="button"
            onClick={() => router.push('/recruiter/dashboard')}
            className="font-bold text-sm gap-2 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Talent Discovery</span>
          </Button>
        </main>
        <MobileTabBar />
      </div>
    );
  }

  const tierMeta = TIER_META[candidate.leagueTier] || TIER_META.bronze;
  const rep = candidate.reportCard;
  const res = candidate.resume;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <button
              type="button"
              onClick={() => router.push('/recruiter/dashboard')}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Talent Discovery</span>
            </button>
            <span>/</span>
            <span className="text-foreground font-semibold truncate max-w-xs">{candidate.fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/recruiter/dashboard')}
              className="text-sm font-medium gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pool</span>
            </Button>
            <Button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="text-sm font-bold shadow-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invite Candidate</span>
            </Button>
          </div>
        </div>

        {/* Candidate Profile Header Card */}
        <Card className="p-6 sm:p-8 shadow-sm bg-card border-border space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xs shrink-0 ${candidate.avatarBg}`}
              >
                {candidate.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                    {candidate.fullName}
                  </h1>
                  <Badge variant="outline" className="gap-1 border-primary/30 text-primary bg-primary/10 text-sm font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Talent</span>
                  </Badge>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${tierMeta.badgeClass}`}
                  >
                    <span>{tierMeta.icon}</span>
                    <span>{tierMeta.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>{candidate.collegeOrCompany}</span>
                  </span>
                  <span>-</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{candidate.region}</span>
                  </span>
                  <span>-</span>
                  <span>Rank #{candidate.weeklyRank} in <span className="capitalize font-semibold text-foreground">{candidate.leagueTier} League</span></span>
                </div>

                <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed pt-1">
                  {candidate.headline}
                </p>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-border">
              <div className="p-3 rounded-xl bg-muted/60 border border-border text-center md:text-right min-w-[120px]">
                <span className="text-sm font-mono text-muted-foreground uppercase block">
                  AI Defense Score
                </span>
                <span className="text-2xl font-black font-mono text-primary">
                  {rep.overallScore.toFixed(1)}{' '}
                  <span className="text-sm font-normal text-muted-foreground">/ 10</span>
                </span>
              </div>

              {res.overallAtsScore > 0 && (
                <div className="p-3 rounded-xl bg-muted/60 border border-border text-center md:text-right min-w-[120px]">
                  <span className="text-sm font-mono text-muted-foreground uppercase block">
                    ATS Match
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {res.overallAtsScore}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links & Activity Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/50 border border-border text-sm">
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono">
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
        </Card>

        {/* Section 1: AI Report Card & Multi-Axis Telemetry */}
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground font-sans">
                  AI Competency Report Card & Multi-Axis Telemetry
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Aggregated across oral AI defenses, hands-on coding challenges, interactive quizzes, and systems drills.
              </p>
            </div>

            <div className="text-right">
              <span className="text-sm uppercase font-mono text-muted-foreground block">
                Composite Score
              </span>
              <span className="text-3xl font-black font-mono text-primary">
                {rep.overallScore.toFixed(1)}{' '}
                <span className="text-base font-normal text-muted-foreground">/ 10</span>
              </span>
            </div>
          </div>

          {/* 5-Axis Score Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { name: 'Knowledge Depth', score: rep.knowledgeScore, desc: 'Algorithms, CUDA, RAG math' },
              { name: 'Confidence & Pace', score: rep.confidenceScore, desc: `${rep.speechMetrics.wordsPerMinute} WPM (${rep.speechMetrics.paceRating})` },
              { name: 'Communication', score: rep.communicationScore, desc: 'STAR structure, clarity' },
              { name: 'Practical Examples', score: rep.examplesScore, desc: 'Latency, VRAM, metrics' },
              { name: 'Industry Readiness', score: rep.industryLevelScore, desc: 'Hiring bar alignment' },
            ].map((axis) => (
              <div key={axis.name} className="p-3.5 rounded-xl bg-card border border-border space-y-2">
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
              <span>Speech Fillers: {rep.speechMetrics.fillerCount} detected</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span>Oral Defenses: {rep.speechMetrics.totalInterviews} Completed</span>
            </span>
          </div>

          {/* Recent Spoken Answer Excerpt */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                <span>🎙️ Verbatim Spoken Defense Excerpt</span>
              </span>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 text-sm font-mono">
                Live AI Voice Telemetry
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 font-serif italic leading-relaxed">
              &ldquo;{rep.recentModelAnswerExcerpt}&rdquo;
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
        </Card>

        {/* Section 2: Verified Badges Showcase */}
        <Card className="p-6 sm:p-8 space-y-4 shadow-sm bg-card border-border">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground font-sans">
              Verified Proof-of-Skill Badges ({candidate.verifiedBadges.length})
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidate.verifiedBadges.map((badgeName) => (
              <div
                key={badgeName}
                className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-3 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                  🎖️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{badgeName}</h3>
                  <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    ✓ Algorithmic Verification Passed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 3: Resume & Technical Work */}
        <Card className="p-6 sm:p-8 space-y-5 shadow-sm bg-card border-border">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground font-sans">
                ATS Resume & Technical Profile
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {res.resumeFileUrl && (
                <a
                  href={res.resumeFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Download PDF</span>
                </a>
              )}
              {res.overallAtsScore > 0 ? (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                  ATS Score: {res.overallAtsScore} / 100
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted/40 border-border text-muted-foreground font-mono text-sm font-medium">
                  ATS: Not Scanned Yet
                </Badge>
              )}
            </div>
          </div>

          {res.overallAtsScore > 0 || (res.projects && res.projects.length > 0) ? (
            <>
              <p className="text-sm text-foreground/85 leading-relaxed p-4 rounded-2xl bg-muted/40 border border-border">
                {res.summary}
              </p>

              {/* Skills Grid */}
              {((res.skills.frameworks && res.skills.frameworks.length > 0) ||
                (res.skills.infrastructure && res.skills.infrastructure.length > 0)) && (
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {res.skills.frameworks && res.skills.frameworks.length > 0 && (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
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
                  )}

                  {res.skills.infrastructure && res.skills.infrastructure.length > 0 && (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
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
                  )}
                </div>
              )}

              {/* Highlighted Projects */}
              {res.projects && res.projects.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-sm font-bold text-foreground font-mono block">
                    Highlighted Production Systems Projects:
                  </span>
                  <div className="space-y-3">
                    {res.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground font-mono">{proj.title}</h3>
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
              )}
            </>
          ) : (
            <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center space-y-2">
              <FileText className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <h3 className="text-sm font-bold text-foreground">No ATS Resume Scanned Yet</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                This candidate has not yet submitted a resume for automated ATS evaluation. Their technical skills and speech metrics are verified through their live interview defense and challenge completions above.
              </p>
            </div>
          )}

          {/* Raw Resume Text Expandable Section */}
          {res.rawText && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-3.5 bg-muted/40 border-b border-border flex items-center justify-between">
                <span className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Submitted Resume Text ({res.rawText.length} characters)</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyResume}
                    className="h-8 px-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground gap-1"
                  >
                    {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResume ? 'Copied' : 'Copy Text'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRawResume(!showRawResume)}
                    className="h-8 px-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground gap-1"
                  >
                    {showRawResume ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{showRawResume ? 'Collapse' : 'View Raw Resume'}</span>
                  </Button>
                </div>
              </div>
              {showRawResume && (
                <div className="p-4 bg-muted/20">
                  <pre className="text-sm font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto rounded-xl p-4 bg-card border border-border/80 select-text">
                    {res.rawText}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/recruiter/dashboard')}
            className="rounded-xl text-sm font-medium gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Talent Discovery</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="rounded-xl text-sm font-bold shadow-xs gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Fast-Track Direct Interview Invitation</span>
          </Button>
        </div>
      </main>

      {/* Direct Interview Invite Modal */}
      {isInviteOpen && (
        <InterviewInviteModal
          candidate={candidate}
          activeJobs={jobs}
          currentCompany={recruiterInfo.company}
          onClose={() => setIsInviteOpen(false)}
          onSuccess={() => {
            setIsInviteOpen(false);
            router.push('/recruiter/dashboard?tab=invitations');
          }}
        />
      )}

      <MobileTabBar />
    </div>
  );
}
