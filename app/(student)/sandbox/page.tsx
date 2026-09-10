'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserBuildsSandbox } from '@/components/dashboard/UserBuildsSandbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  BookOpen,
  ArrowRight,
  CircleDot,
  Bug,
  Scale,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { getCurrentStudentProfileAction } from '@/app/actions/auth';
import { ProtectedRouteGate } from '@/components/auth/ProtectedRouteGate';

export default function SandboxPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsAuthenticated(true);
        } else if (typeof window !== 'undefined' && localStorage.getItem('aignite_student_session')) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (typeof window !== 'undefined' && localStorage.getItem('aignite_student_session')) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-muted-foreground font-mono text-sm">
          <Sparkles className="w-4 h-4 animate-spin text-primary" />
          <span>Verifying student account...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRouteGate
        title="Architecture Sandbox & Telemetry Lab"
        badge="Protected Lab - Account Required"
        description="Configure enterprise AI architectures, inspect real-time latency and VRAM telemetry, test index scaling, and validate production SLAs with your student profile."
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner - Company Packs button removed as requested */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Architecture Sandbox &amp; Telemetry Lab
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Action-over-consumption workbench: configure enterprise AI architectures, inspect real-time latency and VRAM telemetry, test index scaling, and validate production SLAs.
        </p>
      </div>

      {/* Primary Telemetry Workbench */}
      <UserBuildsSandbox />

      {/* Interactive Practice Games Navigation Callout */}
      <div className="space-y-3 pt-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground font-sans">
            Interactive Practice Games
          </h2>
          <p className="text-sm text-muted-foreground">
            Targeted hands-on mini-games to master specific system design, debugging, and trade-off mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <CircleDot className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-foreground font-sans">
                Pipeline Bubble
              </h3>
              <p className="text-sm text-muted-foreground">
                Sequence RAG retrieval stages chronologically to achieve sub-50ms P95 latency.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/games/pipeline-bubble">
                <span>Play Bubble Game</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <Bug className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-foreground font-sans">
                Error Code Hunter
              </h3>
              <p className="text-sm text-muted-foreground">
                Inspect broken PyTorch training loops and patch silent gradient accumulation bugs.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/games/error-hunter">
                <span>Hunt Bugs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-foreground font-sans">
                Decision Simulator
              </h3>
              <p className="text-sm text-muted-foreground">
                Evaluate model selection tradeoffs under strict GPU VRAM and latency constraints.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/games/decision-simulator">
                <span>Run Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between space-y-4 shadow-xs border-border hover:border-primary/40 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-foreground font-sans">
                5-Second Micro-Quiz
              </h3>
              <p className="text-sm text-muted-foreground">
                Rapid-fire architectural questions on GRPO, FlashAttention-3, and KV cache.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full font-bold text-sm">
              <Link href="/games/micro-quiz">
                <span>Start Micro-Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* Architecture Theory & References */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Production Architecture Briefs
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            High-signal engineering breakdowns designed for rapid commute comprehension.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'FlashAttention-3 TMA Acceleration',
              tag: 'CUDA Kernels',
              readTime: '3 min read',
              desc: 'Warp specialization separates producer warps doing asynchronous TMA memory transfers from consumer tensor core compute warps.',
            },
            {
              title: 'vLLM PagedAttention Virtual Memory',
              tag: 'Inference',
              readTime: '4 min read',
              desc: 'Solves internal memory fragmentation by partitioning the KV cache into fixed-size physical blocks instead of contiguous memory.',
            },
            {
              title: 'pgvector HNSW Graph Mechanics',
              tag: 'Vector DB',
              readTime: '3 min read',
              desc: 'Hierarchical Navigable Small World graphs enable sub-10ms logarithmic time vector retrieval across millions of dense vectors.',
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="p-5 bg-muted/40 hover:border-primary/40 transition-all space-y-2 flex flex-col justify-between shadow-none"
            >
              <div className="space-y-1.5">
                <Badge
                  variant="outline"
                  className="text-sm font-mono bg-primary/10 text-primary font-bold border-primary/20"
                >
                  {item.tag}
                </Badge>
                <h3 className="text-sm font-bold text-foreground font-sans">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground block pt-2 border-t border-border/60">
                {item.readTime}
              </span>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
