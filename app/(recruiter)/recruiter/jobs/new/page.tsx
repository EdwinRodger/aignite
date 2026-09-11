'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { createJobPostingAction } from '@/app/actions/recruiter';
import { getAuthUserAction } from '@/app/actions/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Plus,
  Loader2,
  Award,
  DollarSign,
  MapPin,
  Trophy,
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const BADGE_OPTIONS = [
  'RAG Master',
  'NVIDIA TensorRT Specialist',
  'Agent Architect',
  'Vector Wizard',
  '7-Day Flame Streak',
];

export default function PostRolePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [roleCategory, setRoleCategory] = useState<
    'GenAI & LLM' | 'AI Systems & Inference' | 'Distributed Training & CUDA' | 'Computer Vision & Multimodal' | 'Agent Architect'
  >('AI Systems & Inference');
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [salaryRange, setSalaryRange] = useState('₹30,00,000 - ₹45,00,000 CTC');
  const [minLeagueTier, setMinLeagueTier] = useState<
    'bronze' | 'silver' | 'gold' | 'diamond' | 'architect'
  >('gold');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['RAG Master']);
  const [minReportScore, setMinReportScore] = useState(8.0);
  const [description, setDescription] = useState(
    'Seeking an AI Systems Engineer to build low-latency inference pipelines, optimize CUDA/Triton kernels, and deploy models with TensorRT-LLM.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recruiterInfo, setRecruiterInfo] = useState({
    company: 'Enterprise AI Partner',
    name: 'Talent Acquisition Lead',
    designation: 'GenAI & Systems Hiring Team',
  });

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

    const verifyAuth = async () => {
      const auth = await getAuthUserAction();
      if (!auth.loggedIn || auth.role !== 'recruiter') {
        router.push('/recruiter/login');
      }
    };
    verifyAuth();

    return () => clearTimeout(timer);
  }, [router]);

  const toggleBadge = (b: string) => {
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((x) => x !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createJobPostingAction({
        companyName: recruiterInfo.company,
        title: title.trim(),
        roleCategory,
        location: location.trim(),
        salaryRange: salaryRange.trim(),
        minLeagueTier,
        requiredBadges: selectedBadges,
        minReportScore,
        description: description.trim(),
      });

      if (res.success && res.job) {
        router.push('/recruiter/dashboard?tab=jobs');
      } else {
        setError(res.error || 'Failed to post role.');
      }
    } catch {
      setError('An error occurred while creating job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <button
              type="button"
              onClick={() => router.push('/recruiter/dashboard?tab=jobs')}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Job Openings</span>
            </button>
            <span>/</span>
            <span className="text-foreground font-semibold">Post New AI Role</span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/recruiter/dashboard?tab=jobs')}
            className="text-sm font-medium gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel &amp; Back to Dashboard</span>
          </Button>
        </div>

        {/* Page Title Card */}
        <Card className="p-6 sm:p-8 shadow-sm bg-card border-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl shadow-xs shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                  Post AI Engineering Opening
                </h1>
                <Badge variant="outline" className="gap-1 bg-emerald-500/10 border-emerald-500/20 text-emerald-700 text-sm font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Threshold Gating</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 font-mono">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>Posting on behalf of <strong className="text-foreground font-semibold">{recruiterInfo.company}</strong></span>
              </p>
              <p className="text-sm text-foreground/80 pt-1">
                Configure automated skill thresholds. Candidates who do not meet your required competitive league tier, verified badges, or minimum capstone scores cannot submit unqualified applications.
              </p>
            </div>
          </div>
        </Card>

        {/* Form Container Card */}
        <Card className="p-6 sm:p-8 shadow-sm bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Role Title */}
            <div className="space-y-2">
              <label htmlFor="job-title" className="text-sm font-bold text-foreground font-sans">
                Role Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="job-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior AI Systems & Inference Engineer"
                className="text-sm font-medium h-11"
              />
              <span className="text-sm text-muted-foreground font-mono">
                Specific technical titles help match candidate models and framework specializations.
              </span>
            </div>

            {/* Role Category & Location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="job-role-category" className="text-sm font-bold text-foreground font-sans">
                  Role Category
                </label>
                <select
                  id="job-role-category"
                  value={roleCategory}
                  onChange={(e) =>
                    setRoleCategory(
                      e.target.value as
                        | 'GenAI & LLM'
                        | 'AI Systems & Inference'
                        | 'Distributed Training & CUDA'
                        | 'Computer Vision & Multimodal'
                        | 'Agent Architect'
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm h-11"
                >
                  <option value="AI Systems & Inference">AI Systems &amp; Inference</option>
                  <option value="GenAI & LLM">GenAI &amp; LLM</option>
                  <option value="Agent Architect">Agent Architect</option>
                  <option value="Distributed Training & CUDA">Distributed Training &amp; CUDA</option>
                  <option value="Computer Vision & Multimodal">Computer Vision &amp; Multimodal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="job-location" className="text-sm font-bold text-foreground font-sans flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Work Location / Modality</span>
                </label>
                <Input
                  id="job-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka (Hybrid) or Remote"
                  className="text-sm font-medium h-11"
                />
              </div>
            </div>

            {/* Compensation & Min Report Score */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="job-salary-range" className="text-sm font-bold text-foreground font-sans flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Salary / Compensation Band</span>
                </label>
                <Input
                  id="job-salary-range"
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. ₹30,00,000 - ₹45,00,000 CTC"
                  className="text-sm font-medium h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="job-min-report-score" className="text-sm font-bold text-foreground font-sans flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-chart-5" />
                    <span>Min AI Report Card Score</span>
                  </span>
                  <span className="text-primary font-mono font-bold">{minReportScore.toFixed(1)} / 10</span>
                </label>
                <select
                  id="job-min-report-score"
                  value={minReportScore}
                  onChange={(e) => setMinReportScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm h-11"
                >
                  <option value={7.0}>7.0+ (Intermediate Practitioner)</option>
                  <option value={7.5}>7.5+ (Proficient AI Engineer)</option>
                  <option value={8.0}>8.0+ (Advanced AI Engineer)</option>
                  <option value={8.5}>8.5+ (Senior Systems Bar)</option>
                  <option value={9.0}>9.0+ (Principal / Architect Bar)</option>
                </select>
              </div>
            </div>

            {/* Minimum Competitive League Tier Gating */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-foreground font-sans flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Minimum Competitive League Tier Prerequisite</span>
                </label>
                <p className="text-sm text-muted-foreground">
                  Candidates below this division in the weekly AIgnite League will be blocked from applying.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'bronze', label: '🥉 Bronze', desc: 'Foundational' },
                  { id: 'silver', label: '🥈 Silver', desc: 'Intermediate' },
                  { id: 'gold', label: '🥇 Gold', desc: 'Advanced' },
                  { id: 'diamond', label: '💎 Master', desc: 'Elite' },
                  { id: 'architect', label: '👑 Architect', desc: 'Top 1%' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      setMinLeagueTier(
                        tier.id as 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect'
                      )
                    }
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      minLeagueTier === tier.id
                        ? 'bg-primary/15 border-primary text-primary shadow-xs font-bold ring-1 ring-primary'
                        : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground font-medium'
                    }`}
                  >
                    <div className="text-sm font-bold">{tier.label}</div>
                    <div className="text-sm font-mono opacity-80 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Required Proof-of-Skill Badges */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-foreground font-sans">
                  Required Proof-of-Skill Badges
                </label>
                <p className="text-sm text-muted-foreground">
                  Select algorithmic badges that candidates must hold on their verified profile.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => {
                  const checked = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                        checked
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
                          : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {checked ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span>{badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label htmlFor="job-description" className="text-sm font-bold text-foreground font-sans">
                Role Description &amp; Technical Expectations
              </label>
              <Textarea
                id="job-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the production AI stack, kernel optimization requirements, inference frameworks, or agent architectures expected for this position..."
                className="resize-none text-sm font-medium leading-relaxed"
              />
            </div>

            {/* Form Action Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/recruiter/dashboard?tab=jobs')}
                className="rounded-xl text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl font-bold text-sm shadow-xs gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Role...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish AI Role &amp; Open Candidate Matching</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <MobileTabBar />
    </div>
  );
}
