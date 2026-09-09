import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { RoadmapNodeTree } from '@/components/roadmap/RoadmapNodeTree';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Sparkles, Trophy, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Interactive AI Systems Career Roadmap | AIgnite',
  description:
    'Comprehensive step-by-step career path from Mathematical Foundations to Distributed Training & Triton Kernels. Curated for 2026 AI systems hiring bars.',
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header */}
        <section className="text-center space-y-3 relative">
          <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary text-sm font-semibold">
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Competency Tree</span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-sans tracking-tight">
            The Applied AI Systems Roadmap
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The complete 6-stage pathway to becoming an AI Systems Architect. Master mathematical intuition, PyTorch internals, RAG vector retrieval, and distributed CUDA training with interactive proof-of-skill challenges.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>6 Progressive Milestone Stages</span>
            </span>
            <span>-</span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>6 Recruiter-Verified Badges</span>
            </span>
            <span>-</span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-chart-5" />
              <span>280 Total Hours of Rigor</span>
            </span>
          </div>

          {/* Callout Banner */}
          <Card className="p-4 max-w-xl mx-auto flex items-center justify-between gap-4 text-sm text-left shadow-sm">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">Want to verify your current level?</span>
              <p className="text-muted-foreground text-sm">
                Run your resume through our AI ATS Analyzer to detect exactly which milestone stage you fit into.
              </p>
            </div>
            <Button asChild size="sm" className="font-bold text-sm shrink-0 gap-1">
              <Link href="/resume-analyzer">
                <span>Scan Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </Card>
        </section>

        {/* Visual Roadmap Tree */}
        <RoadmapNodeTree />
      </main>

      <MobileTabBar />
    </div>
  );
}
