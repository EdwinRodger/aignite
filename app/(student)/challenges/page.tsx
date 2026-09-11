'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sparkles,
  Database,
  Eye,
  Bot,
  Sliders,
  CircleDot,
  Bug,
  HelpCircle,
  Scale,
  Columns,
  BookOpen,
  Maximize2,
  Clock,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CHALLENGE_MODULES, ChallengeModule } from '@/lib/challenges/modules-data';
import { ModuleGuideContent } from '@/components/challenges/ModuleGuideContent';
import { PipelineBubbleChallenge } from '@/components/challenges/PipelineBubbleChallenge';
import { ErrorCodeHunterChallenge } from '@/components/challenges/ErrorCodeHunterChallenge';
import { MicroQuizChallenge } from '@/components/challenges/MicroQuizChallenge';
import { DecisionSimulatorChallenge } from '@/components/challenges/DecisionSimulatorChallenge';

function ChallengesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeModuleId = searchParams.get('module') || 'rag';
  const initialChallenge = searchParams.get('challenge') || 'pipeline-bubble';

  const [selectedModuleId, setSelectedModuleId] = useState<string>(activeModuleId);
  const [activeChallengeId, setActiveChallengeId] = useState<string>(initialChallenge);
  const [layoutMode, setLayoutMode] = useState<'split' | 'guide' | 'challenge'>('split');
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});

  const currentModule =
    CHALLENGE_MODULES.find((m) => m.id === selectedModuleId) || CHALLENGE_MODULES[0];

  // Sync state with URL params
  useEffect(() => {
    const paramChallenge = searchParams.get('challenge');
    if (paramChallenge) {
      setActiveChallengeId(paramChallenge);
    }
  }, [searchParams]);

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId);
    router.replace(`/challenges?module=${modId}&challenge=${activeChallengeId}`);
  };

  const handleSelectChallenge = (cId: string) => {
    setActiveChallengeId(cId);
    router.replace(`/challenges?module=${selectedModuleId}&challenge=${cId}`);
  };

  const handleChallengeComplete = (cId: string) => {
    setCompletedChallenges((prev) => ({ ...prev, [cId]: true }));
  };

  const completedCount = Object.values(completedChallenges).filter(Boolean).length;
  const totalModuleChallenges = currentModule.challenges.length;
  const progressPercent = (completedCount / totalModuleChallenges) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Understanding */}
      <div className="flex flex-col gap-3 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                Interactive AI Challenges
              </h1>
              <p className="text-sm text-muted-foreground">
                Master applied artificial intelligence through modular theory guides and interactive engineering challenges.
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
            <Button
              type="button"
              variant={layoutMode === 'split' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayoutMode('split')}
              className="text-sm font-semibold gap-1.5 h-8 px-3"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Alongside Split</span>
            </Button>
            <Button
              type="button"
              variant={layoutMode === 'guide' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayoutMode('guide')}
              className="text-sm font-semibold gap-1.5 h-8 px-3"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide Only</span>
            </Button>
            <Button
              type="button"
              variant={layoutMode === 'challenge' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLayoutMode('challenge')}
              className="text-sm font-semibold gap-1.5 h-8 px-3"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Challenge Only</span>
            </Button>
          </div>
        </div>

        {/* Module Switcher Bar */}
        <div className="pt-2">
          <span className="text-sm font-semibold text-muted-foreground block mb-2">
            Select Curriculum Module:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHALLENGE_MODULES.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isActive = mod.status === 'active';

              return (
                <div
                  key={mod.id}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 space-y-1.5 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      {mod.id === 'rag' && <Database className="w-4 h-4 text-primary" />}
                      {mod.id === 'image-recognition' && <Eye className="w-4 h-4 text-muted-foreground" />}
                      {mod.id === 'agentic-workflows' && <Bot className="w-4 h-4 text-muted-foreground" />}
                      {mod.id === 'fine-tuning' && <Sliders className="w-4 h-4 text-muted-foreground" />}
                      {mod.shortTitle}
                    </span>
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className="text-sm py-0.5 px-2 font-medium"
                    >
                      {isActive ? 'Active' : 'Preview'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {mod.tagline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Module Header & Telemetry */}
      <Card className="p-6 border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm border-primary/30 text-primary">
                Module: {currentModule.shortTitle}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Level: {currentModule.level}
              </Badge>
              {currentModule.status === 'coming_soon' && (
                <Badge variant="destructive" className="text-sm">
                  Upcoming Preview
                </Badge>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-sans">
              {currentModule.title}
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {currentModule.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm font-mono shrink-0">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{currentModule.estimatedTime}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">+{currentModule.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar for Active Module */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Module Challenges Completed</span>
            <span className="font-bold text-foreground font-mono">
              {completedCount} / {totalModuleChallenges} Done ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* If Coming Soon Module Selected, Show Preview Notice */}
      {currentModule.status === 'coming_soon' ? (
        <Card className="p-8 sm:p-12 text-center border-border bg-card shadow-xs space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground font-sans">
              {currentModule.title} Is in Development
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are finalizing the text curriculum and interactive challenge engines for this module. The complete RAG (Retrieval-Augmented Generation) module is fully active and ready to explore now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2 text-left">
            {currentModule.challenges.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{c.name}</span>
                  <Badge variant="outline" className="text-sm">
                    {c.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button
              type="button"
              onClick={() => handleSelectModule('rag')}
              className="font-bold text-sm px-6"
            >
              <Database className="w-4 h-4 mr-2" />
              Switch to Active RAG Module
            </Button>
          </div>
        </Card>
      ) : (
        /* Active Module (RAG) Alongside Layout */
        <div
          className={`grid gap-8 ${
            layoutMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Column: Educational Text Guide */}
          {(layoutMode === 'split' || layoutMode === 'guide') && (
            <div
              className={`space-y-6 ${
                layoutMode === 'split' ? 'lg:col-span-5' : 'w-full'
              }`}
            >
              <ModuleGuideContent
                module={currentModule}
                activeChallengeId={activeChallengeId}
                onSelectChallenge={(cId) => {
                  handleSelectChallenge(cId);
                  if (layoutMode === 'guide') setLayoutMode('split');
                }}
              />
            </div>
          )}

          {/* Right Column: Interactive Challenge Suite */}
          {(layoutMode === 'split' || layoutMode === 'challenge') && (
            <div
              className={`space-y-6 ${
                layoutMode === 'split' ? 'lg:col-span-7' : 'w-full'
              }`}
            >
              {/* Challenge Selector Tabs */}
              <div className="space-y-4">
                <Tabs
                  value={activeChallengeId}
                  onValueChange={handleSelectChallenge}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto p-1.5 gap-1.5 rounded-xl bg-muted/50 border border-border">
                    <TabsTrigger
                      value="pipeline-bubble"
                      className="text-sm py-2 px-2 flex items-center gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                    >
                      <CircleDot className="w-4 h-4 shrink-0 text-primary" />
                      <span className="truncate">Pipeline</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="error-hunter"
                      className="text-sm py-2 px-2 flex items-center gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                    >
                      <Bug className="w-4 h-4 shrink-0 text-destructive" />
                      <span className="truncate">Bug Hunter</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="micro-quiz"
                      className="text-sm py-2 px-2 flex items-center gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                    >
                      <HelpCircle className="w-4 h-4 shrink-0 text-primary" />
                      <span className="truncate">Micro-Quiz</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="decision-simulator"
                      className="text-sm py-2 px-2 flex items-center gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-xs"
                    >
                      <Scale className="w-4 h-4 shrink-0 text-primary" />
                      <span className="truncate">Decision</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Challenge 1: Pipeline Bubble */}
                  <TabsContent value="pipeline-bubble" className="mt-4">
                    <PipelineBubbleChallenge
                      onComplete={() => handleChallengeComplete('pipeline-bubble')}
                    />
                  </TabsContent>

                  {/* Challenge 2: Error Code Hunter */}
                  <TabsContent value="error-hunter" className="mt-4">
                    <ErrorCodeHunterChallenge
                      onComplete={() => handleChallengeComplete('error-hunter')}
                    />
                  </TabsContent>

                  {/* Challenge 3: Timed Micro-Quiz */}
                  <TabsContent value="micro-quiz" className="mt-4">
                    <MicroQuizChallenge
                      onComplete={() => handleChallengeComplete('micro-quiz')}
                    />
                  </TabsContent>

                  {/* Challenge 4: Decision Simulator */}
                  <TabsContent value="decision-simulator" className="mt-4">
                    <DecisionSimulatorChallenge
                      onComplete={() => handleChallengeComplete('decision-simulator')}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChallengesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground">
          Loading Interactive Challenges...
        </div>
      }
    >
      <ChallengesPageContent />
    </Suspense>
  );
}
