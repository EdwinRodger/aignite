'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { getPendingRecruiters, toggleRecruiterVerification } from '@/app/actions/auth';
import {
  ShieldCheck,
  Building2,
  Globe,
  Mail,
  Link2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowUpRight,
  Filter,
  Lock
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

export default function AdminVerificationsPage() {
  const [recruiters, setRecruiters] = useState<RecruiterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

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

  const filtered = recruiters.filter((item) => {
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'approved') return item.status === 'approved';
    return true;
  });

  const pendingCount = recruiters.filter((r) => r.status === 'pending').length;
  const approvedCount = recruiters.filter((r) => r.status === 'approved').length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href="/admin"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Platform Admin
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-bold text-foreground">Verifications</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-primary/20 text-sm font-bold text-primary mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Platform Admin & Trust Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
              Recruiter Verification Queue
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review company identities, validate corporate email domains, and authorize candidate resume access.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-card border border-border text-center">
              <div className="text-xl font-bold font-mono text-amber-500">{pendingCount}</div>
              <div className="text-sm text-muted-foreground uppercase font-semibold">Pending Review</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-card border border-border text-center">
              <div className="text-xl font-bold font-mono text-emerald-500">{approvedCount}</div>
              <div className="text-sm text-muted-foreground uppercase font-semibold">Verified Partners</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border text-sm font-medium">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({recruiters.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'pending' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'approved' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>

          <Link
            href="/recruiter/apply"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>+ Test New Application Form</span>
          </Link>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-16 space-y-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm">Loading recruiter verification queue...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-card border border-border p-8 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No applications in this view</h3>
            <p className="text-sm text-muted-foreground">All corporate recruiter submissions have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => {
              const isPending = item.status === 'pending';
              const isApproved = item.status === 'approved';
              const isBusy = actionInProgress === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-sm hover:border-border/80 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Recruiter & Company Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-foreground font-sans">
                          {item.fullName}
                        </span>
                        <span className="text-sm text-muted-foreground">-</span>
                        <span className="text-sm font-semibold text-primary">
                          {item.recruiterDesignation}
                        </span>
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
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.companyName}</span>
                        </div>

                        <a
                          href={item.companyWebsite.startsWith('http') ? item.companyWebsite : `https://${item.companyWebsite}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline font-mono text-sm"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{item.companyWebsite.replace(/^https?:\/\//, '')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>

                        <div className="flex items-center gap-1 font-mono text-sm">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.workEmail}</span>
                        </div>

                        {item.linkedinUrl && (
                          <a
                            href={item.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>LinkedIn Profile</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleToggle(item.id, 'approved')}
                            disabled={isBusy}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>Approve & Grant Access</span>
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
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MobileTabBar />
    </div>
  );
}
