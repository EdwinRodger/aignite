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

  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
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
    if (index < 7 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 8 digits entered
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
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 8; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    if (pasted.length === 8) {
      inputRefs.current[7]?.focus();
      submitCode(pasted);
    } else if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const submitCode = async (codeToVerify?: string) => {
    const code = (codeToVerify || digits.join('')).trim();
    if (code.length !== 8 && code.length !== 6) {
      setError('Please enter the complete verification code.');
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
    const demoCode = ['1', '2', '3', '4', '5', '6', '7', '8'];
    setDigits(demoCode);
    submitCode('12345678');
  };

  const enteredCount = digits.filter((d) => d !== '').length;
  const canSubmit = enteredCount === 8 || enteredCount === 6;

  return (
    <div className="w-full max-w-lg relative z-10">
      <Card className="shadow-sm border-border">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent border border-primary/20 text-primary mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter the verification code sent to{' '}
            <span className="font-semibold text-foreground">{email}</span>, or click the verification link in your email.
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

          {/* OTP Input Boxes (8-digit / 6-digit responsive inputs) */}
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full px-1">
              {digits.map((digit, idx) => (
                <React.Fragment key={idx}>
                  <input
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
                    className={`flex-1 min-w-0 max-w-10 sm:max-w-11 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl border transition-all outline-none ${
                      digit
                        ? 'bg-accent/40 border-primary text-foreground shadow-xs'
                        : 'bg-muted/40 border-border text-foreground hover:border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-accent/10'
                    }`}
                  />
                  {idx === 3 && (
                    <span className="shrink-0 text-muted-foreground/50 font-bold text-sm px-0.5 select-none" aria-hidden="true">
                      -
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              onClick={() => submitCode()}
              disabled={loading || !canSubmit}
              size="lg"
              className="w-full font-bold text-sm shadow-xs gap-2"
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
                <span>Auto-fill 12345678</span>
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

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <Suspense fallback={<div className="text-center p-8 text-muted-foreground">Loading verification...</div>}>
          <VerifyOtpContent />
        </Suspense>
      </main>

      <MobileTabBar />
    </div>
  );
}
