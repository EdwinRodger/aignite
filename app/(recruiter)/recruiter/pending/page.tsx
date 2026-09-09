'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { Clock, ShieldAlert, CheckCircle2, ArrowRight, ExternalLink, Lock } from 'lucide-react';

export default function RecruiterPendingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/20 space-y-6 text-center">
            {/* Pulsing Status Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto relative">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-bold text-amber-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Account Quarantined (Security Measure)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                Verification Under Review
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your recruiter application has been placed in our Trust & Safety quarantine queue.
                Candidate resumes and search tools will remain locked until your company domain is verified.
              </p>
            </div>

            {/* Checklist of Verification Steps */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border text-left space-y-3 font-sans text-sm">
              <div className="flex items-start gap-2.5 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Corporate Email Domain Passed</span>
                  <p className="text-sm text-muted-foreground">Public webmails (@gmail, @yahoo) successfully filtered out.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-foreground">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-semibold">Company Identity Validation</span>
                  <p className="text-sm text-muted-foreground">Verification team is validating your official company domain and LinkedIn credentials.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground">
                <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Talent Pool Access Activation</span>
                  <p className="text-sm">Unlocks candidate AI report cards, verified skill badges, and job posting permissions.</p>
                </div>
              </div>
            </div>

            {/* SIH Hackathon Jury Fast-Track Demo Box */}
            <div className="p-4 rounded-2xl bg-accent/60 border border-primary/30 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <span>⚡ SIH Evaluator Fast-Track</span>
                </span>
                <span className="text-sm font-mono px-2 py-0.5 rounded bg-primary text-primary-foreground font-bold">
                  Demo Mode
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Testing this project for the hackathon evaluation? Open the Admin Console to approve this application with 1 click:
              </p>
              <Link
                href="/admin/verifications"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                <span>Go to Admin Verification Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-center gap-4 text-sm">
              <Link
                href="/recruiter/login"
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>Check Status via Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-muted-foreground">-</span>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
