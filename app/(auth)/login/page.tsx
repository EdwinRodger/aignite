'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { sendStudentOtp } from '@/app/actions/auth';
import { Flame, Mail, ArrowRight, Sparkles, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await sendStudentOtp(email.trim().toLowerCase());
      if (res.success) {
        router.push(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      } else {
        setError(res.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Subtle Warm Flame ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Card Container */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/20">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent border border-primary/20 text-primary mb-1 shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Sign in to <span className="text-primary font-extrabold font-mono">AIgnite</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Passwordless login. We will send a 6-digit verification code to your email.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span>Student / Learner Email</span>
                  <span className="text-[10px] text-muted-foreground">Personal or University</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground/70 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  email.trim() && !loading
                    ? 'bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 active:scale-98 cursor-pointer'
                    : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending 6-Digit OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* SIH Presentation Demo Note */}
            <div className="mt-5 p-3.5 rounded-2xl bg-muted/60 border border-border text-[11px] text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>SIH Hackathon Demo Quick-Fill:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setEmail('learner@university.edu')}
                  className="px-2 py-1 rounded-xl bg-card border border-border text-foreground font-mono hover:border-primary transition-colors cursor-pointer text-[10px]"
                >
                  learner@university.edu
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('test@example.com')}
                  className="px-2 py-1 rounded-xl bg-card border border-border text-foreground font-mono hover:border-primary transition-colors cursor-pointer text-[10px]"
                >
                  test@example.com
                </button>
              </div>
            </div>

            {/* Recruiter Discriminator Banner */}
            <div className="mt-6 pt-5 border-t border-border/80 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">Hiring AI Engineers?</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Recruiter accounts require verified corporate domains.{' '}
                <Link
                  href="/recruiter/apply"
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  Apply via Corporate Recruiter Portal &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
