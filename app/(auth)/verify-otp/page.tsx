'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { verifyStudentOtp, sendStudentOtp } from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyRound, ArrowRight, Loader2, AlertCircle, RefreshCw, CheckCircle2, Clock, Sparkles } from 'lucide-react';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'learner@university.edu';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first digit input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal[cleanVal.length - 1];
    setDigits(newDigits);

    // Auto-advance to next input
    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newDigits.every((d) => d !== '')) {
      const fullCode = newDigits.join('');
      submitCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const submitCode = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyStudentOtp(email, code);
      if (res.success) {
        if (res.needsOnboarding) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(res.error || 'Invalid verification code.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const res = await sendStudentOtp(email);
      if (res.success) {
        setResendTimer(60);
        setResendSuccess(true);
      } else {
        setError(res.error || 'Failed to resend code.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleAutoFillDemo = () => {
    const demoCode = ['1', '2', '3', '4', '5', '6'];
    setDigits(demoCode);
    submitCode('123456');
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="w-full max-w-md relative z-10">
      <Card className="shadow-xl shadow-black/20">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent border border-primary/20 text-primary mb-1 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Resend Success Alert */}
          {resendSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>A fresh verification code has been dispatched to your inbox.</span>
            </div>
          )}

          {/* 6-Digit Boxes */}
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl border transition-all outline-none ${
                    digit
                      ? 'bg-accent/40 border-primary text-foreground ring-1 ring-primary/40 shadow-xs'
                      : 'bg-muted/40 border-border text-foreground hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-accent/10'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => submitCode()}
              disabled={loading || !isComplete}
              size="lg"
              className="w-full font-bold text-sm shadow-lg shadow-primary/25 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Resend Action Pill */}
          <div className="pt-2 flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span>Didn&apos;t receive the code?</span>
              {resendTimer > 0 ? (
                <Badge variant="outline" className="gap-1 font-mono text-sm">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Resend in <strong className="text-foreground">{resendTimer}s</strong></span>
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary font-bold hover:underline flex items-center gap-1 h-auto p-0 text-sm"
                >
                  {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Resend Code Now</span>
                </Button>
              )}
            </div>
          </div>

          {/* SIH Hackathon Demo Interactive Fill */}
          <div className="pt-4 border-t border-border flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>SIH Hackathon Demo:</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFillDemo}
                className="gap-1 font-mono font-bold text-primary text-sm h-8"
                title="Click to auto-fill demo OTP and sign in"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-fill 123456</span>
              </Button>
            </div>
            <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2 transition-colors">
              Change email address
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <Suspense fallback={<div className="text-center p-8 text-muted-foreground">Loading verification...</div>}>
          <VerifyOtpContent />
        </Suspense>
      </main>

      <MobileTabBar />
    </div>
  );
}
