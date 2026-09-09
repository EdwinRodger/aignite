'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { COMPANY_PACKS } from '@/lib/learning-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm font-bold bg-primary/10 text-primary border-primary/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Company-Specific AI Packs</span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">No 50-Hour Videos</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Learn What Top AI Teams Actually Build
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Replace passive tutorial hell with hands-on systems architecture. Each pack prepares you for specific technical interview rounds at NVIDIA, Google, OpenAI, Meta, and Microsoft.
          </p>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
            {tracks.map((t) => (
              <Button
                key={t}
                type="button"
                variant={selectedTrack === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTrack(t)}
                className="rounded-full text-sm font-semibold h-8"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Company Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredPacks.map((pack) => (
            <Card
              key={pack.slug}
              className={`${pack.borderColor} p-6 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.01]`}
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
                      <span className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                        {pack.companyName}
                      </span>
                      <h2 className="text-lg font-bold text-foreground tracking-tight">
                        {pack.title}
                      </h2>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-sm font-mono font-semibold shrink-0">
                    {pack.modulesCount} Modules
                  </Badge>
                </div>

                {/* Tagline */}
                <p className="text-sm text-primary font-medium">
                  {pack.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pack.description}
                </p>

                {/* Skills Covered Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-sm uppercase font-mono tracking-wider text-muted-foreground block font-semibold">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.skillsCovered.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-sm font-mono bg-muted/60 text-muted-foreground border-border"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Unlockable Recruiter Badge Preview */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-sm text-muted-foreground block">Earnable Recruiter Badge</span>
                      <span className="font-semibold text-foreground">{pack.badgeName}</span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6 mt-4 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Interactive Games Included</span>
                </div>

                <Button asChild size="sm" className="font-bold text-sm gap-1.5 shadow-md shadow-primary/20">
                  <Link href={`/packs/${pack.slug}`}>
                    <span>Launch Pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
