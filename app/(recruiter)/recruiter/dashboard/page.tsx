'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { CandidateTalent, RecruiterJob, InterviewInvitation } from '@/lib/recruiter-data';
import {
  getCandidateTalentPoolAction,
  getRecruiterJobsAction,
  getRecruiterInvitationsAction,
} from '@/app/actions/recruiter';
import { signOutUser, getAuthUserAction } from '@/app/actions/auth';
import { CandidateCard } from '@/components/recruiter/CandidateCard';
import { CandidateDossierModal } from '@/components/recruiter/CandidateDossierModal';
import { InterviewInviteModal } from '@/components/recruiter/InterviewInviteModal';
import { CreateJobModal } from '@/components/recruiter/CreateJobModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Briefcase,
  Send,
  Trophy,
  Filter,
  Search,
  Plus,
  ShieldCheck,
  LogOut,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'talent' | 'jobs' | 'invitations'>('talent');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [minReportScore, setMinReportScore] = useState<number>(0);

  // Data States
  const [candidates, setCandidates] = useState<CandidateTalent[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [invitations, setInvitations] = useState<InterviewInvitation[]>([]);

  // Modal States
  const [inspectingCandidate, setInspectingCandidate] = useState<CandidateTalent | null>(null);
  const [invitingCandidate, setInvitingCandidate] = useState<CandidateTalent | null>(null);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  // Recruiter Profile Information
  const [recruiterInfo, setRecruiterInfo] = useState({
    company: 'Enterprise AI Partner',
    name: 'Talent Acquisition Lead',
    designation: 'GenAI & Systems Hiring Team',
  });

  const [, startTransition] = useTransition();

  // Load initial data
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

      const candRes = await getCandidateTalentPoolAction();
      if (candRes.success) setCandidates(candRes.candidates);

      const jobsRes = await getRecruiterJobsAction();
      if (jobsRes.success) setJobs(jobsRes.jobs);

      const invRes = await getRecruiterInvitationsAction();
      if (invRes.success) setInvitations(invRes.invitations);
    });

    return () => clearTimeout(timer);
  }, [router]);

  // Filter Trigger
  const applyFilters = () => {
    startTransition(async () => {
      const candRes = await getCandidateTalentPoolAction({
        query: searchQuery,
        minLeagueTier: selectedTier,
        requiredBadge: selectedBadge,
        minReportScore: minReportScore,
      });
      if (candRes.success) {
        setCandidates(candRes.candidates);
      }
    });
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/recruiter/login');
  };

  const handleJobCreated = (newJob: RecruiterJob) => {
    setJobs([newJob, ...jobs]);
  };

  const handleInviteSuccess = () => {
    startTransition(async () => {
      const invRes = await getRecruiterInvitationsAction();
      if (invRes.success) setInvitations(invRes.invitations);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recruiter Enterprise Header */}
        <Card className="p-6 sm:p-8 shadow-sm bg-card border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center text-3xl shadow-xs shrink-0">
                🏢
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                    {recruiterInfo.company}
                  </h1>
                  <Badge variant="outline" className="gap-1 px-2.5 py-0.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-700 text-sm font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Partner</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {recruiterInfo.name} - {recruiterInfo.designation}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                onClick={() => setIsCreateJobOpen(true)}
                className="font-bold text-sm shadow-xs gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post AI Engineering Role</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
                className="text-sm font-medium gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-border/80">
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border">
              <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Talent Indexed</span>
              </span>
              <div className="text-2xl font-black font-mono text-foreground mt-1">
                {candidates.length > 0 ? `${candidates.length} Profiles` : 'Ready to Index'}
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                Verified Skills &amp; Reports
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border">
              <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-chart-5" />
                <span>Architects</span>
              </span>
              <div className="text-2xl font-black font-mono text-foreground mt-1">
                {candidates.filter((c) => c.leagueTier === 'architect').length} Top Division
              </div>
              <span className="text-sm text-primary font-mono">
                Scores &gt; 9.0 on Capstones
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border">
              <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-secondary-foreground" />
                <span>Active Roles</span>
              </span>
              <div className="text-2xl font-black font-mono text-foreground mt-1">{jobs.length} Positions</div>
              <span className="text-sm text-muted-foreground font-mono">
                Threshold Gating Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border">
              <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-chart-4" />
                <span>Invites Dispatched</span>
              </span>
              <div className="text-2xl font-black font-mono text-foreground mt-1">{invitations.length} Sent</div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                Direct Fast-Track
              </span>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
          <Button
            type="button"
            variant={activeTab === 'talent' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('talent')}
            className="font-bold text-sm gap-2"
          >
            <Users className="w-4 h-4" />
            <span>AI Talent Discovery ({candidates.length})</span>
          </Button>

          <Button
            type="button"
            variant={activeTab === 'jobs' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('jobs')}
            className="font-bold text-sm gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Openings ({jobs.length})</span>
          </Button>

          <Button
            type="button"
            variant={activeTab === 'invitations' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('invitations')}
            className="font-bold text-sm gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Interview Invitations ({invitations.length})</span>
          </Button>
        </div>

        {/* TAB 1: TALENT DISCOVERY */}
        {activeTab === 'talent' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    placeholder="Search candidates by name, college (e.g. IIT Bombay), skills (Triton, CUDA, vLLM)..."
                    className="pl-10 text-sm font-medium"
                  />
                </div>

                <Button
                  type="button"
                  onClick={applyFilters}
                  className="font-bold text-sm gap-1.5 shrink-0"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Filters</span>
                </Button>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/60 text-sm">
                {/* League Tier Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-chart-5" />
                    <span>Min Tier:</span>
                  </span>
                  <select
                    value={selectedTier}
                    onChange={(e) => {
                      setSelectedTier(e.target.value);
                      setTimeout(applyFilters, 50);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Divisions</option>
                    <option value="architect">👑 AI Architect (Top 1%)</option>
                    <option value="diamond">💎 LLM Master</option>
                    <option value="gold">🥇 Gold AI Engineer</option>
                    <option value="silver">🥈 Silver AI Engineer</option>
                    <option value="bronze">🥉 Bronze AI Engineer</option>
                  </select>
                </div>

                {/* Badge Requirement Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Required Badge:</span>
                  </span>
                  <select
                    value={selectedBadge}
                    onChange={(e) => {
                      setSelectedBadge(e.target.value);
                      setTimeout(applyFilters, 50);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">Any Badge</option>
                    <option value="RAG Master">RAG Master</option>
                    <option value="NVIDIA TensorRT Specialist">NVIDIA TensorRT Specialist</option>
                    <option value="Agent Architect">Agent Architect</option>
                    <option value="Vector Wizard">Vector Wizard</option>
                    <option value="7-Day Flame Streak">7-Day Flame Streak</option>
                  </select>
                </div>

                {/* Min Report Score */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-chart-1" />
                    <span>Min Report Card:</span>
                  </span>
                  <select
                    value={minReportScore}
                    onChange={(e) => {
                      setMinReportScore(Number(e.target.value));
                      setTimeout(applyFilters, 50);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={0}>All Scores</option>
                    <option value={8.0}>8.0+ / 10</option>
                    <option value={8.5}>8.5+ / 10</option>
                    <option value={9.0}>9.0+ / 10 (Elite)</option>
                    <option value={9.5}>9.5+ / 10 (Exceptional)</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(selectedTier !== 'all' || selectedBadge !== 'all' || minReportScore > 0 || searchQuery) && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSelectedTier('all');
                      setSelectedBadge('all');
                      setMinReportScore(0);
                      setSearchQuery('');
                      startTransition(async () => {
                        const res = await getCandidateTalentPoolAction();
                        if (res.success) setCandidates(res.candidates);
                      });
                    }}
                    className="text-primary text-sm font-mono ml-auto p-0 h-auto"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Candidates Grid */}
            {candidates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onInspect={(c) => setInspectingCandidate(c)}
                    onInvite={(c) => setInvitingCandidate(c)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold text-foreground">No Candidates Matched Criteria</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try relaxing your minimum league tier or badge requirements, or wait for students to complete capstones and oral defense rounds.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedTier('all');
                    setSelectedBadge('all');
                    setMinReportScore(0);
                    setSearchQuery('');
                    startTransition(async () => {
                      const res = await getCandidateTalentPoolAction();
                      if (res.success) setCandidates(res.candidates);
                    });
                  }}
                  className="font-bold text-sm mt-2"
                >
                  Clear All Filters
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* TAB 2: JOB OPENINGS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground font-sans">Active AI Engineering Openings</h2>
                <p className="text-sm text-muted-foreground">
                  Roles published with verified threshold gating. Candidates who do not meet your required league tier or badges cannot submit spam applications.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setIsCreateJobOpen(true)}
                className="font-bold text-sm gap-1.5 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Post New AI Role</span>
              </Button>
            </div>

            {jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 space-y-4 shadow-sm hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {job.companyLogo}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground font-sans">{job.title}</h3>
                          <p className="text-sm text-muted-foreground font-mono mt-0.5">
                            {job.companyName} - {job.roleCategory}
                          </p>
                        </div>
                      </div>

                      <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold shrink-0">
                        Active
                      </Badge>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{job.salaryRange}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{job.postedDate}</span>
                      </span>
                    </div>

                    {/* Prerequisite Thresholds */}
                    <div className="p-3 rounded-2xl bg-muted/60 border border-border/80 space-y-2">
                      <span className="text-sm uppercase font-mono font-bold text-muted-foreground block">
                        Automated Gate Requirements:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="secondary" className="font-mono text-sm">
                          Tier: {job.minLeagueTier.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-primary font-mono font-bold text-sm bg-primary/10 border-primary/20">
                          Min Score: {job.minReportScore.toFixed(1)}/10
                        </Badge>
                        {job.requiredBadges.map((b) => (
                          <Badge
                            key={b}
                            variant="outline"
                            className="bg-primary/10 border-primary/20 text-primary font-medium text-sm"
                          >
                            🎖️ {b}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-border/80">
                      <span className="text-sm font-mono text-muted-foreground">
                        <strong className="text-foreground">{job.applicantsCount}</strong> Qualified Candidates Applied
                      </span>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveTab('talent')}
                        className="text-sm font-bold text-primary p-0 h-auto"
                      >
                        Find Matching Talent &rarr;
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold text-foreground">No Active Job Openings Posted Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Post your first AI role with verified thresholds to attract candidates filtered by league tier and technical badges.
                </p>
                <Button
                  type="button"
                  onClick={() => setIsCreateJobOpen(true)}
                  className="font-bold text-sm mt-2 gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post First AI Role</span>
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* TAB 3: INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground font-sans">Dispatched Interview Invitations</h2>
              <p className="text-sm text-muted-foreground">
                Track fast-track invitations sent directly to verified AIgnite engineers. Candidates receive priority calendar slots.
              </p>
            </div>

            {invitations.length > 0 ? (
              <div className="space-y-3">
                {invitations.map((inv) => (
                  <Card
                    key={inv.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{inv.candidateName}</h3>
                        <span className="text-sm text-muted-foreground font-mono">- {inv.roleTitle}</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic font-serif bg-muted/40 p-2.5 rounded-xl border border-border/50">
                        &ldquo;{inv.customNote}&rdquo;
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground pt-1">
                        <span>Round: <strong>{inv.roundType}</strong></span>
                        <span>-</span>
                        <span>Company: <strong>{inv.companyName}</strong></span>
                        <span>-</span>
                        <span>Sent: <strong>{inv.sentAt}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-sm font-bold font-mono px-3 py-1.5 ${
                          inv.status === 'Scheduled'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : inv.status === 'Accepted'
                            ? 'bg-primary/15 border-primary/30 text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        ● {inv.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center space-y-3">
                <Send className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold text-foreground">No Interview Invitations Dispatched Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Browse the verified candidate talent pool and dispatch direct technical interview invitations without preliminary screening calls.
                </p>
                <Button
                  type="button"
                  onClick={() => setActiveTab('talent')}
                  className="font-bold text-sm mt-2"
                >
                  <span>Explore Candidate Talent Pool</span>
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Candidate Dossier Deep-Dive Modal */}
      {inspectingCandidate && (
        <CandidateDossierModal
          candidate={inspectingCandidate}
          onClose={() => setInspectingCandidate(null)}
          onInvite={(c) => {
            setInspectingCandidate(null);
            setInvitingCandidate(c);
          }}
        />
      )}

      {/* Direct Interview Invite Modal */}
      {invitingCandidate && (
        <InterviewInviteModal
          candidate={invitingCandidate}
          activeJobs={jobs}
          currentCompany={recruiterInfo.company}
          onClose={() => setInvitingCandidate(null)}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Create Job Posting Modal */}
      {isCreateJobOpen && (
        <CreateJobModal
          currentCompany={recruiterInfo.company}
          onClose={() => setIsCreateJobOpen(false)}
          onCreated={handleJobCreated}
        />
      )}

      <MobileTabBar />
    </div>
  );
}
