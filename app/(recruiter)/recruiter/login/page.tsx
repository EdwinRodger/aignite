'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { getRecruiterStatus } from '@/app/actions/auth';
import { Building2, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RecruiterLoginPage() {
  const router = useRouter();

  const [workEmail, setWorkEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<{ status: string; company?: string } | null>(null);

  const handleLoginCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workEmail || !workEmail.includes('@')) {
      setError('Please enter your corporate work email.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusResult(null);

    try {
      const res = await getRecruiterStatus(workEmail.trim().toLowerCase());
      if (!res.found) {
        setError('No recruiter application found for this work email. Please submit an application first.');
        return;
      }

      setStatusResult(res);

      if (res.status === 'approved') {
        setTimeout(() => {
          router.push('/recruiter/dashboard');
        }, 800);
      } else if (res.status === 'pending') {
        setTimeout(() => {
          router.push('/recruiter/pending');
        }, 800);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/20 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent border border-primary/20 text-primary mb-1 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Recruiter Portal Sign In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your verified corporate work email to access candidate search.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {statusResult?.status === 'approved' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verified! Redirecting to Recruiter Dashboard for {statusResult.company || 'Enterprise'}...</span>
              </div>
            )}

            {statusResult?.status === 'pending' && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Account is currently in quarantine under review. Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleLoginCheck} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span>Corporate Work Email</span>
                  <span className="text-[10px] text-primary font-bold">Verified Domain</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !workEmail.trim()}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  workEmail.trim() && !loading
                    ? 'bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 active:scale-98 cursor-pointer'
                    : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Recruiter Suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* SIH Quick Test Shortcuts */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-[11px] text-muted-foreground space-y-1.5">
              <span className="font-bold text-foreground block">⚡ SIH Evaluator Quick-Test:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setWorkEmail('pvenkatesh@google.com')}
                  className="px-2 py-1 rounded-lg bg-card border border-border text-foreground font-mono hover:border-primary transition-colors cursor-pointer"
                >
                  pvenkatesh@google.com (Approved)
                </button>
                <button
                  type="button"
                  onClick={() => setWorkEmail('aarav.sharma@nvidia.com')}
                  className="px-2 py-1 rounded-lg bg-card border border-border text-foreground font-mono hover:border-primary transition-colors cursor-pointer"
                >
                  aarav.sharma@nvidia.com (Pending)
                </button>
              </div>
            </div>

            {/* Link to Apply */}
            <div className="pt-4 border-t border-border/80 text-center text-sm text-muted-foreground">
              <span>Not verified yet? </span>
              <Link
                href="/recruiter/apply"
                className="text-primary font-semibold hover:underline underline-offset-2"
              >
                Submit Corporate Application &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
