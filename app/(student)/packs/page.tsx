'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { COMPANY_PACKS } from '@/lib/learning-data';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';

export default function CompanyPacksPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  const tracks = ['All', 'Inference & CUDA', 'Agent Systems', 'Model Architecture', 'Enterprise'];

  const filteredPacks = COMPANY_PACKS.filter((pack) => {
    if (selectedTrack === 'All') return true;
    if (selectedTrack === 'Inference & CUDA') return pack.companyName === 'NVIDIA';
    if (selectedTrack === 'Agent Systems') return pack.companyName === 'OpenAI' || pack.companyName === 'Microsoft';
    if (selectedTrack === 'Model Architecture') return pack.companyName === 'Meta' || pack.companyName === 'Google';
    if (selectedTrack === 'Enterprise') return pack.companyName === 'Microsoft' || pack.companyName === 'Google';
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-12">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Value Proposition */}
        <div className="mb-8 border-b border-border/60 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Company-Specific AI Packs</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">No 50-Hour Videos</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Learn What Top AI Teams Actually Build
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Replace passive tutorial hell with hands-on systems architecture. Each pack prepares you for specific technical interview rounds at NVIDIA, Google, OpenAI, Meta, and Microsoft.
          </p>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
            {tracks.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTrack(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedTrack === t
                    ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Company Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredPacks.map((pack) => (
            <div
              key={pack.slug}
              className={`rounded-2xl bg-card border ${pack.borderColor} p-6 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              {/* Decorative Subtle Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${pack.accentColor} pointer-events-none opacity-40`}
              />

              <div className="relative z-10 space-y-4">
                {/* Header with Company Logo / Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none" role="img" aria-label={pack.companyName}>
                      {pack.badgeIcon}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        {pack.companyName}
                      </span>
                      <h2 className="text-lg font-bold text-foreground tracking-tight">
                        {pack.title}
                      </h2>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border shrink-0">
                    {pack.modulesCount} Modules
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-xs text-primary font-medium">
                  {pack.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pack.description}
                </p>

                {/* Skills Covered Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.skillsCovered.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unlockable Recruiter Badge Preview */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Earnable Recruiter Badge</span>
                      <span className="font-semibold text-foreground">{pack.badgeName}</span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6 mt-4 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Interactive Games Included</span>
                </div>

                <Link
                  href={`/packs/${pack.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>Launch Pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
