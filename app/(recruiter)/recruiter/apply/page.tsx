'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { submitRecruiterApplication } from '@/app/actions/auth';
import {
  ShieldCheck,
  Building2,
  Globe,
  Mail,
  User,
  Briefcase,
  Link2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock
} from 'lucide-react';

const BLOCKED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'zoho.com',
  'proton.me',
  'protonmail.com',
  'mail.com',
];

export default function RecruiterApplyPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [recruiterDesignation, setRecruiterDesignation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side domain check
    const domain = workEmail.split('@')[1]?.toLowerCase();
    if (!domain || BLOCKED_DOMAINS.includes(domain)) {
      setError(`Public email domain (@${domain || 'unknown'}) is not permitted. Please use your official corporate work email (e.g. name@company.com).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitRecruiterApplication({
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim(),
        workEmail: workEmail.trim().toLowerCase(),
        recruiterDesignation: recruiterDesignation.trim(),
        linkedinUrl: linkedinUrl.trim() || undefined,
      });

      if (res.success) {
        router.push('/recruiter/pending');
      } else {
        setError(res.error || 'Failed to submit application.');
      }
    } catch {
      setError('An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/20 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-primary/20 text-sm font-bold text-primary mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Recruiter Access Only</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Apply for Recruiter Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                To protect student candidate privacy and prevent impersonation, all hiring managers must verify their corporate identity.
              </p>
            </div>

            {/* Anti-Impersonation Warning Box */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-sm text-muted-foreground space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Anti-Impersonation Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Free webmail addresses (@gmail, @yahoo, @outlook) are automatically rejected.
                Submitted accounts enter quarantine and are manually reviewed before student resumes can be accessed.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Satya Nadella"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Your Job Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterDesignation}
                    onChange={(e) => setRecruiterDesignation(e.target.value)}
                    placeholder="e.g. Lead Technical Recruiter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Company Name & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Company Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. NVIDIA Corporation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Company Website</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="nvidia.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Corporate Work Email</span>
                  </span>
                  <span className="text-[10px] text-primary font-semibold">Strictly Corporate Domain</span>
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="recruiter@nvidia.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Company / Recruiter LinkedIn URL (Optional Verification Proof)</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/recruiter-profile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !fullName.trim() || !companyName.trim() || !workEmail.trim()}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4 ${
                  fullName.trim() && companyName.trim() && workEmail.trim() && !loading
                    ? 'bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 active:scale-98 cursor-pointer'
                    : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit for Corporate Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link to Recruiter Login */}
            <div className="pt-4 border-t border-border/80 text-center text-sm text-muted-foreground">
              <span>Already verified by our team? </span>
              <Link
                href="/recruiter/login"
                className="text-primary font-semibold hover:underline underline-offset-2"
              >
                Sign In to Recruiter Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
