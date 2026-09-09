import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { ResumeAnalyzerClient } from '@/components/resume/ResumeAnalyzerClient';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Resume ATS Analyzer & Skill Gap Bridge | AIgnite',
  description:
    'Free public ATS analyzer engineered for modern AI & ML engineering jobs. Benchmarks your resume against NVIDIA, Google, and OpenAI hiring bars and bridges skill gaps with interactive micro-modules.',
};

export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary pb-20 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Hero Header */}
        <section className="text-center space-y-3 relative">
          <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary text-sm font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public AI Systems Acquisition Utility</span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-sans tracking-tight">
            AI Resume ATS Analyzer &amp; Skill Gap Radar
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop getting screened out by legacy keyword parsers. Evaluate your resume against modern 2026 AI systems hiring bars (RAG, quantization, CUDA kernels, agent loops) and close missing gaps with interactive mini-modules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Free &amp; Private</span>
            </span>
            <span>-</span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              <span>Gemini 2.0 Flash Powered</span>
            </span>
            <span>-</span>
            <span>No Account Required to Test</span>
          </div>
        </section>

        {/* Interactive Analyzer Engine */}
        <ResumeAnalyzerClient />
      </main>

      <MobileTabBar />
    </div>
  );
}
