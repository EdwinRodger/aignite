'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { sendStudentOtp } from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, Sparkles, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

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

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-sm border-border">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto inline-flex items-center justify-center mb-1">
                <Image
                  src="/logo-icon.png"
                  alt="AIgnite Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain"
                  priority
                />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Sign in to <span className="text-primary font-extrabold font-mono">AIgnite</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Passwordless login. We will send a verification code to your email.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span>Student / Learner Email</span>
                    <span className="text-sm text-muted-foreground">Personal or University</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="learner@university.edu"
                      className="pl-9 text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !email.trim()}
                  className="w-full font-bold text-sm shadow-xs gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* SIH Presentation Demo Note */}
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>SIH Hackathon Demo Quick-Fill:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEmail('learner@university.edu')}
                    className="font-mono text-sm h-8 px-2.5"
                  >
                    learner@university.edu
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEmail('test@example.com')}
                    className="font-mono text-sm h-8 px-2.5"
                  >
                    test@example.com
                  </Button>
                </div>
              </div>

              {/* Recruiter Discriminator Banner */}
              <div className="pt-4 border-t border-border/80 text-center">
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-foreground">Hiring AI Engineers?</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Recruiter accounts require verified corporate domains.{' '}
                  <Link
                    href="/recruiter/apply"
                    className="text-primary font-semibold hover:underline underline-offset-2"
                  >
                    Apply via Corporate Recruiter Portal &rarr;
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
