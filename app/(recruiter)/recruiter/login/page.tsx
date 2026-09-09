'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { getRecruiterStatus } from '@/app/actions/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
          <Card className="p-6 sm:p-8 shadow-xl shadow-black/20 space-y-6">
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
                  <Badge variant="outline" className="text-sm text-primary font-bold border-primary/20 bg-primary/5">Verified Domain</Badge>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="pl-10 text-sm font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || !workEmail.trim()}
                className="w-full font-bold text-sm shadow-lg shadow-primary/25 gap-2"
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
              </Button>
            </form>

            {/* SIH Quick Test Shortcuts */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-sm text-muted-foreground space-y-2">
              <span className="font-bold text-foreground block">⚡ SIH Evaluator Quick-Test:</span>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkEmail('pvenkatesh@google.com')}
                  className="font-mono text-sm h-8"
                >
                  pvenkatesh@google.com (Approved)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setWorkEmail('aarav.sharma@nvidia.com')}
                  className="font-mono text-sm h-8"
                >
                  aarav.sharma@nvidia.com (Pending)
                </Button>
              </div>
            </div>

            {/* Link to Apply */}
            <div className="pt-4 border-t border-border/80 text-center text-sm text-muted-foreground">
              <span>Don&apos;t have verified recruiter access? </span>
              <Link
                href="/recruiter/apply"
                className="text-primary font-semibold hover:underline underline-offset-2"
              >
                Apply for Company Access &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
