'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface ArchitectureOption {
  id: string;
  name: string;
  framework: string;
  vramFootprint: string;
  p95Latency: string;
  status: 'optimal' | 'failed_latency' | 'failed_vram';
  verdict: string;
  architecturalInsight: string;
}

const DRONE_SCENARIO_OPTIONS: ArchitectureOption[] = [
  {
    id: 'A',
    name: 'Vision Transformer (ViT-Huge/14) 632M params',
    framework: 'PyTorch Native Float16',
    vramFootprint: '8.4 GB',
    p95Latency: '162ms',
    status: 'failed_latency',
    verdict: 'Fails SLA: 162ms exceeds 40ms threshold by 4x.',
    architecturalInsight: 'ViT-Huge quadratic attention complexity over high-resolution image patches introduces massive matrix multiplication delays on single-stream edge GPUs.',
  },
  {
    id: 'B',
    name: 'YOLOv11 / RT-DETR with TensorRT INT8 Quantization',
    framework: 'NVIDIA TensorRT 10.x',
    vramFootprint: '3.4 GB',
    p95Latency: '18ms',
    status: 'optimal',
    verdict: 'Optimal Solution: 18ms P95 latency easily clears the 40ms SLA.',
    architecturalInsight: 'INT8 PTQ quantization leverages NVIDIA T4 Turing INT8 Tensor Cores with zero mAP degradation, keeping memory bandwidth under 4GB.',
  },
  {
    id: 'C',
    name: 'CLIP-ViT-L/14 Unquantized with Float32 Tensors',
    framework: 'HuggingFace Transformers',
    vramFootprint: '17.2 GB',
    p95Latency: 'N/A (CUDA OOM)',
    status: 'failed_vram',
    verdict: 'Fails Hardware Limit: 17.2 GB exceeds 16 GB T4 VRAM.',
    architecturalInsight: 'Float32 weights combined with activation buffers exceed the physical 16GB VRAM limit during concurrent batch streaming, crashing the service.',
  },
  {
    id: 'D',
    name: 'Stable Diffusion Latent Feature Encoder',
    framework: 'Diffusers Pipeline',
    vramFootprint: '9.8 GB',
    p95Latency: '420ms',
    status: 'failed_latency',
    verdict: 'Fails SLA: 420ms latency unacceptable for autonomous flight control.',
    architecturalInsight: 'Variational autoencoder latent encoding is designed for generative conditioning, not real-time 30fps telemetry control loops.',
  },
];

export default function DecisionSimulatorPage() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(false);

  const selectedOption = DRONE_SCENARIO_OPTIONS.find((o) => o.id === selectedOptionId);

  const handleSelect = (id: string) => {
    setSelectedOptionId(id);
    if (id === 'B' && !xpEarned) {
      setXpEarned(true);
      if (typeof window !== 'undefined') {
        const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
        localStorage.setItem('aignite_student_points', (currentPoints + 30).toString());
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Understanding */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Scale className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            AI Decision Simulator - Hardware SLA Tradeoff Dilemma
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          <strong>Why this matters:</strong> Staff AI Engineers do not merely pick the newest or largest foundation model. They make hardware, quantization, and SLA tradeoff choices under strict budget and latency constraints.
        </p>
      </div>

      {/* Scenario Briefing Card */}
      <Card className="p-6 sm:p-8 space-y-4 shadow-xs border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-0.5">
            <span className="text-sm font-mono text-primary font-bold">Production Scenario</span>
            <h2 className="text-xl font-bold text-foreground font-sans">
              Autonomous Edge Drone Vision Obstacle Reasoning
            </h2>
          </div>
          <Badge variant="outline" className="text-sm font-mono bg-muted text-muted-foreground">
            SLA: Sub-40ms P95
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
          <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground text-sm">Deployment Hardware</span>
            <div className="font-bold text-foreground">NVIDIA T4 GPU (16 GB VRAM)</div>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground text-sm">Target P95 Latency</span>
            <div className="font-bold text-foreground">&lt; 40 milliseconds</div>
          </div>
          <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground text-sm">Throughput Bar</span>
            <div className="font-bold text-foreground">30 FPS Live Stream</div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed pt-1">
          Your autonomous drone navigation system must detect obstacles and compute steering vectors in real time. Given the NVIDIA T4 edge node, select the model family and optimization pipeline that satisfies all production requirements.
        </p>
      </Card>

      {/* Decision Options Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground font-sans">
          Select Deployment Architecture:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DRONE_SCENARIO_OPTIONS.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isOptimal = opt.status === 'optimal';

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`p-5 rounded-xl border text-left transition-all space-y-3 cursor-pointer ${
                  isSelected
                    ? isOptimal
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground ring-1 ring-emerald-500/40'
                      : 'bg-destructive/10 border-destructive/40 text-foreground ring-1 ring-destructive/40'
                    : 'bg-card border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-muted border border-border font-mono font-bold text-sm flex items-center justify-center">
                      {opt.id}
                    </span>
                    <h4 className="text-base font-bold text-foreground font-sans">{opt.name}</h4>
                  </div>
                  {isSelected && (
                    <Badge
                      variant="outline"
                      className={`text-sm font-mono font-bold ${
                        isOptimal
                          ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }`}
                    >
                      {isOptimal ? 'PASS' : 'FAIL'}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm font-mono text-muted-foreground border-y border-border/60 py-2">
                  <div>Framework: <span className="font-semibold text-foreground">{opt.framework}</span></div>
                  <div>Latency: <span className="font-semibold text-foreground">{opt.p95Latency}</span></div>
                  <div>VRAM: <span className="font-semibold text-foreground">{opt.vramFootprint}</span></div>
                  <div>T4 Tensor Cores: <span className="font-semibold text-foreground">{isOptimal ? 'Active' : 'Unused'}</span></div>
                </div>

                <p className="text-sm text-muted-foreground">{opt.verdict}</p>

                {isSelected && (
                  <div
                    className={`p-3 rounded-lg border text-sm space-y-1 ${
                      isOptimal
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900'
                        : 'bg-destructive/15 border-destructive/30 text-destructive'
                    }`}
                  >
                    <span className="font-bold block">Staff Architectural Analysis:</span>
                    <p className="leading-relaxed">{opt.architecturalInsight}</p>
                    {isOptimal && (
                      <span className="font-mono font-bold block pt-1 text-emerald-800">
                        ✓ Optimal Architecture Selected! +30 Verified XP
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff Takeaway Principles */}
      <Card className="p-6 sm:p-8 space-y-4 shadow-xs border-border">
        <h3 className="text-base font-bold text-foreground font-sans">
          Production Deployment Rubric for AI Architects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <h4 className="font-bold text-foreground">1. TensorRT INT8 Quantization</h4>
            <p>T4 GPUs have dedicated INT8 Turing Tensor Cores that yield up to 4x throughput over native PyTorch FP32.</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <h4 className="font-bold text-foreground">2. Memory Bandwidth Limits</h4>
            <p>VRAM consumption includes both weights and dynamic KV/activation buffers under live batch sizes.</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <h4 className="font-bold text-foreground">3. Real-Time Deadlines</h4>
            <p>At 30 FPS video streaming, any pipeline exceeding 33ms latency causes dropped camera frames.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
