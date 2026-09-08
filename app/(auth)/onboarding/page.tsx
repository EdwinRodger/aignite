'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { completeStudentOnboarding } from '@/app/actions/auth';
import { Sparkles, User, AtSign, GraduationCap, ArrowRight, Loader2, Compass, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [collegeOrCompany, setCollegeOrCompany] = useState('');
  const [headline, setHeadline] = useState('Aspiring Generative AI Engineer');
  const [defaultMobileLandingPage, setDefaultMobileLandingPage] = useState<'feed' | 'dashboard' | 'coach'>('feed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const focusTracks = [
    { id: 'gen_ai', label: 'GenAI & LLMs', icon: '🧠' },
    { id: 'ml', label: 'Classical ML', icon: '📊' },
    { id: 'dl', label: 'Deep Learning', icon: '⚡' },
    { id: 'cv', label: 'Computer Vision', icon: '👁️' },
    { id: 'nlp', label: 'NLP & Transformers', icon: '💬' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await completeStudentOnboarding({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        collegeOrCompany: collegeOrCompany.trim() || 'AIgnite Scholar',
        headline: headline.trim(),
        defaultMobileLandingPage,
      });

      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#F3582A', '#10B981', '#6366F1'],
          });
        } catch {
          // ignore
        }
        setTimeout(() => {
          router.push('/feed');
        }, 600);
      } else {
        setError(res.error || 'Failed to complete onboarding.');
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

        <div className="w-full max-w-lg relative z-10">
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/20">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-primary/20 text-xs font-bold text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30-Second Setup</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Welcome to <span className="text-primary font-mono">AIgnite</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Set up your public learner profile and customize your daily habit.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vaidik Saxena"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>

              {/* Username Handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Unique Handle</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="vaidik_ai"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* College / University */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>College / University / Affiliation</span>
                </label>
                <input
                  type="text"
                  value={collegeOrCompany}
                  onChange={(e) => setCollegeOrCompany(e.target.value)}
                  placeholder="e.g. IIT Bombay / VIT Vellore"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>

              {/* Primary Focus Track */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-foreground block">
                  Primary AI Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {focusTracks.map((track) => {
                    const isSelected = headline.includes(track.label);
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setHeadline(`Aspiring ${track.label} Engineer`)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-accent border-primary text-foreground ring-1 ring-primary'
                            : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{track.icon}</span>
                        <span className="truncate">{track.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Default Landing Preference */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    <span>Default Launch Screen on Mobile</span>
                  </label>
                  <span className="text-[10px] text-primary font-bold">Customizable</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDefaultMobileLandingPage('feed')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      defaultMobileLandingPage === 'feed'
                        ? 'bg-accent border-primary text-foreground ring-1 ring-primary'
                        : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-bold">📱 AI Feed</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">5-Min Sparks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDefaultMobileLandingPage('coach')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      defaultMobileLandingPage === 'coach'
                        ? 'bg-accent border-primary text-foreground ring-1 ring-primary'
                        : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-bold">🎙️ Coach</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Voice Streak</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDefaultMobileLandingPage('dashboard')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      defaultMobileLandingPage === 'dashboard'
                        ? 'bg-accent border-primary text-foreground ring-1 ring-primary'
                        : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-bold">📊 Hub</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Dashboard</div>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !fullName.trim() || username.trim().length < 3}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4 ${
                  fullName.trim() && username.trim().length >= 3 && !loading
                    ? 'bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 active:scale-98 cursor-pointer'
                    : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Complete Setup & Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
