'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import {
  getPendingRecruiters,
  toggleRecruiterVerification,
  getPlatformHealthAction,
  PlatformHealthStatus,
} from '@/app/actions/auth';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Activity,
  Database,
  ExternalLink,
  Sparkles,
  Users,
  Briefcase,
  Layers,
  KeyRound,
} from 'lucide-react';

interface RecruiterItem {
  id: string;
  fullName: string;
  companyName: string;
  companyWebsite: string;
  workEmail: string;
  linkedinUrl?: string;
  recruiterDesignation: string;
  status: string;
  appliedAt: string;
}

export default function AdminOverviewPage() {
  const [recruiters, setRecruiters] = useState<RecruiterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [health, setHealth] = useState<PlatformHealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPendingRecruiters()
      .then((data) => {
        if (mounted) {
          setRecruiters(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    getPlatformHealthAction()
      .then((data) => {
        if (mounted) {
          setHealth(data);
          setHealthLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setHealthLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionInProgress(id);
    try {
      await toggleRecruiterVerification(id, newStatus);
      setRecruiters((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const pendingRecruiters = recruiters.filter((r) => r.status === 'pending');
  const approvedRecruiters = recruiters.filter((r) => r.status === 'approved');
  const rejectedRecruiters = recruiters.filter((r) => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-primary/20 text-sm font-bold text-primary mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Platform Admin & Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
              Administrative Control Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage enterprise verification queues, platform telemetry, access controls, and candidate trust protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/verifications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Verification Queue ({pendingRecruiters.length})</span>
            </Link>
          </div>
        </div>

        {/* Telemetry KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Pending Review</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-amber-500">
              {loading ? '-' : pendingRecruiters.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Corporate applications in security quarantine awaiting domain validation.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Verified Partners</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-500">
              {loading ? '-' : approvedRecruiters.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Enterprises with authorized candidate search and talent messaging access.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Rejected / Quarantined</span>
              <div className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-destructive">
              {loading ? '-' : rejectedRecruiters.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Submissions flagged for non-corporate domains or unverified company sites.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total Processed</span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-foreground">
              {loading ? '-' : recruiters.length}
            </div>
            <p className="text-sm text-muted-foreground">
              All-time recruiter onboarding submissions evaluated by the trust system.
            </p>
          </div>
        </div>

        {/* Priority Pending Recruiter Verifications */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Recruiter Access Requests</h2>
                {pendingRecruiters.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-sm font-bold">
                    {pendingRecruiters.length} Action Required
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Review submitted corporate credentials and toggle talent dashboard authorization in real time.
              </p>
            </div>

            <Link
              href="/admin/verifications"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <span>View Full Queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p className="text-sm">Fetching recruiter queue...</p>
            </div>
          ) : recruiters.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-muted/30 border border-border p-6 space-y-3">
              <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Recruiter Applications Submitted</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No recruiter applications have been submitted yet. Test the application workflow to populate this queue dynamically.
              </p>
              <div className="pt-2">
                <Link
                  href="/recruiter/apply"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  <span>Submit Test Application (/recruiter/apply)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recruiters.slice(0, 5).map((item) => {
                const isPending = item.status === 'pending';
                const isApproved = item.status === 'approved';
                const isBusy = actionInProgress === item.id;

                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-foreground">{item.fullName}</span>
                        <span className="text-sm text-muted-foreground">-</span>
                        <span className="text-sm font-semibold text-primary">{item.companyName}</span>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified Partner</span>
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/30">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span>{item.recruiterDesignation}</span>
                        <span>-</span>
                        <span className="font-mono">{item.workEmail}</span>
                        {item.companyWebsite && (
                          <>
                            <span>-</span>
                            <a
                              href={item.companyWebsite.startsWith('http') ? item.companyWebsite : `https://${item.companyWebsite}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-mono"
                            >
                              <span>{item.companyWebsite.replace(/^https?:\/\//, '')}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleToggle(item.id, 'approved')}
                            disabled={isBusy}
                            className="px-3.5 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>Approve & Grant</span>
                          </button>
                          <button
                            onClick={() => handleToggle(item.id, 'rejected')}
                            disabled={isBusy}
                            className="px-3 py-2 rounded-xl text-sm font-bold bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => handleToggle(item.id, 'rejected')}
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-all cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      )}

                      {item.status === 'rejected' && (
                        <button
                          onClick={() => handleToggle(item.id, 'approved')}
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-muted hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 border border-border transition-all cursor-pointer"
                        >
                          Re-Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Infrastructure & System Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-foreground">Platform Infrastructure Health</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of authentication barriers, domain validation engines, and storage layers.
            </p>

            <div className="space-y-3 pt-2">
              {healthLoading ? (
                <div className="py-8 text-center text-muted-foreground space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                  <p className="text-sm">Probing infrastructure services...</p>
                </div>
              ) : health ? (
                <>
                  {/* Database Health */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{health.database.label}</div>
                        <div className="text-sm text-muted-foreground">{health.database.detail}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-sm font-bold shrink-0 ml-2 ${
                        health.database.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : health.database.status === 'error'
                          ? 'bg-destructive/10 text-destructive border-destructive/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {health.database.badge}
                    </span>
                  </div>

                  {/* Auth Engine Health */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{health.auth.label}</div>
                        <div className="text-sm text-muted-foreground">{health.auth.detail}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-sm font-bold shrink-0 ml-2 ${
                        health.auth.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {health.auth.badge}
                    </span>
                  </div>

                  {/* Domain Firewall */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{health.firewall.label}</div>
                        <div className="text-sm text-muted-foreground">{health.firewall.detail}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-sm font-bold shrink-0 ml-2">
                      {health.firewall.badge}
                    </span>
                  </div>

                  {/* AI Evaluation Pipeline */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{health.ai.label}</div>
                        <div className="text-sm text-muted-foreground">{health.ai.detail}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-sm font-bold shrink-0 ml-2 ${
                        health.ai.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {health.ai.badge}
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-2xl bg-muted/40 border border-border text-sm text-muted-foreground">
                  Health telemetry unavailable.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Quick Management Actions</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Direct access to system portals, candidate rosters, and recruiter testing environments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/admin/verifications"
                className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/70 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-foreground">Full Verification Queue</div>
                  <div className="text-sm text-muted-foreground">Filter by approved or pending</div>
                </div>
              </Link>

              <Link
                href="/recruiter/apply"
                className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/70 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Building2 className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-foreground">Apply as Recruiter</div>
                  <div className="text-sm text-muted-foreground">Test application entry point</div>
                </div>
              </Link>

              <Link
                href="/recruiter/dashboard"
                className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/70 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-foreground">Recruiter Talent Portal</div>
                  <div className="text-sm text-muted-foreground">Search and invite candidates</div>
                </div>
              </Link>

              <Link
                href="/dashboard"
                className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/70 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Users className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-foreground">Student Dashboard</div>
                  <div className="text-sm text-muted-foreground">View learner progress & builds</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
