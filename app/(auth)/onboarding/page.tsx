'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { completeStudentOnboarding } from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
          router.push('/dashboard');
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
          <Card className="shadow-xl shadow-black/20">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-primary/20 text-sm font-bold text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30-Second Setup</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Welcome to <span className="text-primary font-mono">AIgnite</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Set up your public learner profile and customize your daily habit.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Full Name</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vaidik Saxena"
                    className="text-sm"
                  />
                </div>

                {/* Username Handle */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Unique Handle</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm font-mono">
                      @
                    </span>
                    <Input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="vaidik_ai"
                      className="pl-8 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* College / University */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>College / University / Affiliation</span>
                  </label>
                  <Input
                    type="text"
                    value={collegeOrCompany}
                    onChange={(e) => setCollegeOrCompany(e.target.value)}
                    placeholder="e.g. IIT Bombay / VIT Vellore"
                    className="text-sm"
                  />
                </div>

                {/* Primary Focus Track */}
                <div className="space-y-2 pt-1">
                  <label className="text-sm font-semibold text-foreground block">
                    Primary AI Focus Area
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {focusTracks.map((track) => {
                      const isSelected = headline.includes(track.label);
                      return (
                        <Button
                          key={track.id}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setHeadline(`Aspiring ${track.label} Engineer`)}
                          className="h-auto p-2.5 text-sm font-medium justify-start gap-1.5 text-left"
                        >
                          <span>{track.icon}</span>
                          <span className="truncate">{track.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Default Landing Preference */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-primary" />
                      <span>Default Launch Screen on Mobile</span>
                    </label>
                    <Badge variant="outline" className="text-sm text-primary font-bold">Customizable</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={defaultMobileLandingPage === 'feed' ? 'default' : 'outline'}
                      onClick={() => setDefaultMobileLandingPage('feed')}
                      className="h-auto p-2.5 flex-col items-center justify-center text-center gap-0.5"
                    >
                      <div className="font-bold text-sm">📱 AI Feed</div>
                      <div className="text-sm opacity-80">5-Min Sparks</div>
                    </Button>

                    <Button
                      type="button"
                      variant={defaultMobileLandingPage === 'coach' ? 'default' : 'outline'}
                      onClick={() => setDefaultMobileLandingPage('coach')}
                      className="h-auto p-2.5 flex-col items-center justify-center text-center gap-0.5"
                    >
                      <div className="font-bold text-sm">🎙️ Coach</div>
                      <div className="text-sm opacity-80">Voice Streak</div>
                    </Button>

                    <Button
                      type="button"
                      variant={defaultMobileLandingPage === 'dashboard' ? 'default' : 'outline'}
                      onClick={() => setDefaultMobileLandingPage('dashboard')}
                      className="h-auto p-2.5 flex-col items-center justify-center text-center gap-0.5"
                    >
                      <div className="font-bold text-sm">📊 Hub</div>
                      <div className="text-sm opacity-80">Dashboard</div>
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !fullName.trim() || username.trim().length < 3}
                  className="w-full font-bold text-sm shadow-lg shadow-primary/25 gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Complete Setup &amp; Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
