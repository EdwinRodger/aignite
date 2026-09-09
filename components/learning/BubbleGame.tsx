'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  RotateCcw,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  ArrowRight,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BubbleMission, BubbleNode } from '@/lib/learning-data';
import { verifyBubblePipeline } from '@/app/actions/learning';

interface BubbleGameProps {
  mission: BubbleMission;
  packSlug: string;
  onCompleted?: (points: number) => void;
}

export function BubbleGame({ mission, packSlug, onCompleted }: BubbleGameProps) {
  const [placedNodes, setPlacedNodes] = useState<BubbleNode[]>([]);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [optimalLatency, setOptimalLatency] = useState<string | null>(null);
  const [optimalVram, setOptimalVram] = useState<string | null>(null);

  // Available nodes that haven't been placed in the pipeline yet
  const availableNodes = mission.availableNodes.filter(
    (node) => !placedNodes.some((p) => p.id === node.id)
  );

  // Calculate live telemetry metrics
  const liveLatency = placedNodes.reduce((acc, n) => acc + n.latencyMs, 0);
  const liveVram = placedNodes.reduce((acc, n) => acc + n.vramGb, 0);

  const handleAddNode = (node: BubbleNode) => {
    if (placedNodes.length >= mission.targetSlotsCount) return;
    setPlacedNodes((prev) => [...prev, node]);
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleRemoveNode = (index: number) => {
    setPlacedNodes((prev) => prev.filter((_, i) => i !== index));
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleReset = () => {
    setPlacedNodes([]);
    setStatus('idle');
    setErrorMessage(null);
    setOptimalLatency(null);
    setOptimalVram(null);
  };

  const handleVerify = async () => {
    if (placedNodes.length === 0) return;

    setStatus('verifying');
    setErrorMessage(null);

    const sequenceIds = placedNodes.map((n) => n.id);
    const result = await verifyBubblePipeline(packSlug, sequenceIds);

    if (result.isCorrect) {
      setStatus('success');
      setOptimalLatency(result.optimalLatency || mission.optimalLatencyP95);
      setOptimalVram(result.optimalVram || mission.optimalVram);

      try {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.6 },
            colors: ['#F97316', '#10B981', '#3B82F6', '#8B5CF6'],
          });
        }
      } catch {
        // Fallback for restricted canvas
      }

      if (onCompleted) {
        onCompleted(result.pointsAwarded);
      }
    } else {
      setStatus('error');
      setErrorMessage(result.errorFeedback || 'Pipeline connection error.');
    }
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Mission Briefing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tactile Pipeline Builder</span>
            </span>
            <span className="text-sm text-muted-foreground font-mono">
              Slots: {placedNodes.length}/{mission.targetSlotsCount}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {mission.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {mission.scenario}
          </p>
        </div>

        {/* Action Points Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg border bg-primary/10 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            <span>+{mission.pointsAwarded} XP</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset board"
            className="p-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Telemetry HUD Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 rounded-xl bg-muted/40 border border-border font-mono text-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            <span>P95 Latency</span>
          </span>
          <span className="text-sm font-bold text-foreground mt-0.5">
            {status === 'success' ? optimalLatency : `${liveLatency} ms`}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-secondary-foreground" />
            <span>VRAM Footprint</span>
          </span>
          <span className="text-sm font-bold text-foreground mt-0.5">
            {status === 'success' ? optimalVram : `${Math.max(0, liveVram).toFixed(1)} GB`}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
            <Layers className="w-3 h-3 text-chart-4" />
            <span>Pipeline Status</span>
          </span>
          <span
            className={`text-sm font-bold mt-0.5 ${
              status === 'success'
                ? 'text-primary'
                : status === 'error'
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {status === 'success' ? 'Validated ✓' : status === 'error' ? 'Bottleneck ✗' : 'Drafting...'}
          </span>
        </div>
      </div>

      {/* Pipeline Assembly Runway (Slots) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span>Active Sequential Pipeline:</span>
          <span className="text-muted-foreground text-[11px]">Tap slot to remove</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {Array.from({ length: mission.targetSlotsCount }).map((_, slotIdx) => {
            const placed = placedNodes[slotIdx];

            return (
              <div
                key={slotIdx}
                className={`min-h-[90px] rounded-xl border-2 transition-all p-3 flex flex-col justify-between relative group ${
                  placed
                    ? 'border-primary/50 bg-card shadow-md shadow-primary/5'
                    : 'border-dashed border-border/80 bg-muted/20 items-center justify-center text-muted-foreground'
                }`}
              >
                {placed ? (
                  <>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        0{slotIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNode(slotIdx)}
                        aria-label={`Remove ${placed.name} from slot ${slotIdx + 1}`}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-bold text-foreground leading-tight mt-1">
                      {placed.name}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-2 border-t border-border/40 pt-1">
                      <span>{placed.latencyMs}ms</span>
                      <span>{placed.vramGb > 0 ? `${placed.vramGb}GB` : 'API'}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <span className="text-sm font-mono font-bold text-muted-foreground block">
                      Slot {slotIdx + 1}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                      {slotIdx === placedNodes.length ? 'Next step...' : 'Empty'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Node Palette (Click/Tap to Add) */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Available Architectural Components (Tap to Chain):</span>
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {availableNodes.length} remaining
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {availableNodes.length === 0 ? (
            <div className="col-span-full p-4 text-center text-sm text-muted-foreground rounded-xl bg-muted/20 border border-dashed border-border">
              All available nodes placed! Ready to verify.
            </div>
          ) : (
            availableNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => handleAddNode(node)}
                disabled={placedNodes.length >= mission.targetSlotsCount}
                className="p-3 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/50 transition-all text-left flex flex-col justify-between group disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {node.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      +{node.latencyMs}ms
                    </span>
                  </div>
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {node.name}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {status === 'error' && errorMessage && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive text-sm animate-in fade-in slide-in-from-top-2 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-destructive block mb-0.5">
              Architectural Fault Detected:
            </span>
            <span className="text-foreground leading-relaxed">{errorMessage}</span>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary text-sm animate-in fade-in slide-in-from-top-2 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block mb-0.5">
              Optimal Pipeline Assembled! +{mission.pointsAwarded} League XP Claimed
            </span>
            <span className="text-muted-foreground leading-relaxed">
              Your architecture achieved {optimalLatency} latency and fits within {optimalVram} memory limits.
              Zero context truncation or GPU memory thrashing detected.
            </span>
          </div>
        </div>
      )}

      {/* Primary Verification Action */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleVerify}
          disabled={placedNodes.length !== mission.targetSlotsCount || status === 'verifying'}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {status === 'verifying' ? (
            <span>Simulating Architecture...</span>
          ) : (
            <>
              <span>Verify Pipeline Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
