'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SystemConfig {
  mission: string;
  vectorIndex: 'hnsw' | 'ivfflat' | 'flat';
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: 'text-embedding-3-large' | 'bge-m3' | 'nomic-embed';
  inferenceEngine: 'vllm-fp8' | 'tensorrt-llm' | 'pytorch-amp';
  temperature: number;
  enableReranker: boolean;
}

interface TelemetryResult {
  p95LatencyMs: number;
  vramGb: number;
  costPerMillion: number;
  retrievalAccuracy: number;
  safetyScore: number;
  status: 'optimal' | 'warning' | 'critical';
  diagnosis: string;
}

export function UserBuildsSandbox() {
  const [config, setConfig] = useState<SystemConfig>({
    mission: 'Legal SEC-10K Financial Regulatory Assistant',
    vectorIndex: 'hnsw',
    chunkSize: 512,
    chunkOverlap: 64,
    embeddingModel: 'bge-m3',
    inferenceEngine: 'vllm-fp8',
    temperature: 0.2,
    enableReranker: true,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryResult | null>({
    p95LatencyMs: 44,
    vramGb: 14.8,
    costPerMillion: 0.22,
    retrievalAccuracy: 95.8,
    safetyScore: 98.2,
    status: 'optimal',
    diagnosis:
      'Optimal production equilibrium: pgvector HNSW paired with vLLM PagedAttention FP8 yields sub-50ms P95 latency while keeping VRAM well within single L40S envelope.',
  });

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      let latency = 35;
      let vram = 12.0;
      let cost = 0.15;
      let accuracy = 88.0;
      let safety = 95.0;
      let status: 'optimal' | 'warning' | 'critical' = 'optimal';
      let diagnosis = '';

      // Vector Index Impact
      if (config.vectorIndex === 'flat') {
        latency += 65;
        accuracy += 4;
        diagnosis = 'Flat brute-force search guarantees 100% recall but introduces severe 100ms+ linear latency penalty on large collections.';
        status = 'warning';
      } else if (config.vectorIndex === 'ivfflat') {
        latency += 12;
        vram -= 3.5;
        accuracy -= 4;
      } else {
        latency += 5;
        vram += 2.0;
        accuracy += 6;
      }

      // Chunk size
      if (config.chunkSize > 800) {
        latency += 18;
        accuracy -= 6;
        vram += 2.5;
      }

      // Embedding
      if (config.embeddingModel === 'text-embedding-3-large') {
        vram += 3.0;
        cost += 0.25;
        accuracy += 5;
      } else if (config.embeddingModel === 'nomic-embed') {
        vram -= 1.5;
        cost -= 0.05;
        accuracy -= 3;
      }

      // Inference Engine
      if (config.inferenceEngine === 'tensorrt-llm') {
        latency -= 14;
        vram -= 2.0;
      } else if (config.inferenceEngine === 'pytorch-amp') {
        latency += 32;
        vram += 4.5;
        status = 'warning';
        diagnosis = 'Vanilla PyTorch lacks KV-cache block allocation; continuous high batch concurrency triggers CUDA memory fragmentation.';
      }

      // Reranker
      if (config.enableReranker) {
        latency += 15;
        accuracy += 8;
        cost += 0.08;
      }

      // Temperature
      if (config.temperature > 0.6) {
        safety -= 18;
        if (config.mission.includes('Legal') || config.mission.includes('Medical')) {
          status = 'critical';
          diagnosis = 'High temperature (>0.6) in regulatory/medical mission leads to hallucinated compliance clauses.';
        }
      }

      if (!diagnosis) {
        diagnosis = 'Architecture satisfies enterprise SLA (<60ms P95 latency, >92% recall accuracy, and sub-$0.35/1M token budget).';
      }

      setTelemetry({
        p95LatencyMs: Math.max(18, Math.round(latency)),
        vramGb: Number(Math.max(6.5, vram).toFixed(1)),
        costPerMillion: Number(Math.max(0.08, cost).toFixed(2)),
        retrievalAccuracy: Number(Math.min(99.4, accuracy).toFixed(1)),
        safetyScore: Number(Math.min(99.9, safety).toFixed(1)),
        status,
        diagnosis,
      });
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-sans">
              User Builds System — The AI Systems Lab
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Architect end-to-end production AI infrastructure. Tune parameters and observe live hardware telemetry and cost SLAs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfig({
              mission: 'Legal SEC-10K Financial Regulatory Assistant',
              vectorIndex: 'hnsw',
              chunkSize: 512,
              chunkOverlap: 64,
              embeddingModel: 'bge-m3',
              inferenceEngine: 'vllm-fp8',
              temperature: 0.2,
              enableReranker: true,
            });
            setTimeout(runSimulation, 50);
          }}
          className="px-3 py-1.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Grid: 2 Columns (Controls vs Telemetry HUD) */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mission Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Target Mission & Production SLA</span>
            </label>
            <select
              value={config.mission}
              onChange={(e) => setConfig({ ...config, mission: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            >
              <option value="Legal SEC-10K Financial Regulatory Assistant">
                🏛️ Legal SEC-10K Regulatory Assistant (P95 &lt; 50ms, Zero Hallucination)
              </option>
              <option value="Edge Drone Autonomous Vision Reasoning">
                🚁 Edge Drone Vision Reasoning (VRAM &lt; 16GB, Sub-30ms)
              </option>
              <option value="Enterprise Vernacular Voice Support Agent">
                🎙️ Sovereign Vernacular Voice Agent (Ultra-Low Latency &lt; 40ms)
              </option>
            </select>
          </div>

          {/* Vector Indexing & Chunk Size */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-secondary-foreground" />
                <span>Vector Index (pgvector)</span>
              </label>
              <select
                value={config.vectorIndex}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    vectorIndex: e.target.value as 'hnsw' | 'ivfflat' | 'flat',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              >
                <option value="hnsw">HNSW Graph (M=16, ef=64) — High Recall</option>
                <option value="ivfflat">IVFFlat (lists=100) — Low Memory</option>
                <option value="flat">Flat (Brute Force Exact Search)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Chunk Size &amp; Overlap</span>
                <span className="text-[10px] font-mono text-primary">{config.chunkSize} / {config.chunkOverlap} tokens</span>
              </label>
              <select
                value={`${config.chunkSize}-${config.chunkOverlap}`}
                onChange={(e) => {
                  const [size, overlap] = e.target.value.split('-').map(Number);
                  setConfig({ ...config, chunkSize: size, chunkOverlap: overlap });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              >
                <option value="256-32">256 tokens (32 overlap) — Fine Granularity</option>
                <option value="512-64">512 tokens (64 overlap) — Industry Standard</option>
                <option value="1024-128">1024 tokens (128 overlap) — Wide Context</option>
              </select>
            </div>
          </div>

          {/* Embedding Model & Serving Engine */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-chart-4" />
                <span>Embedding Model</span>
              </label>
              <select
                value={config.embeddingModel}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    embeddingModel: e.target.value as 'text-embedding-3-large' | 'bge-m3' | 'nomic-embed',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              >
                <option value="bge-m3">BGE-M3 (1024-dim, Multi-Lingual)</option>
                <option value="text-embedding-3-large">text-embedding-3-large (3072-dim)</option>
                <option value="nomic-embed">Nomic Embed (768-dim, Ultra-Fast)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-chart-1" />
                <span>Inference Engine</span>
              </label>
              <select
                value={config.inferenceEngine}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    inferenceEngine: e.target.value as 'vllm-fp8' | 'tensorrt-llm' | 'pytorch-amp',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              >
                <option value="vllm-fp8">vLLM FP8 (PagedAttention + KV-Block)</option>
                <option value="tensorrt-llm">TensorRT-LLM (Warp-Specialized)</option>
                <option value="pytorch-amp">Vanilla PyTorch 2.4 AMP (No Cache Block)</option>
              </select>
            </div>
          </div>

          {/* Reranker Toggle & Temperature Slider */}
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-muted/60 border border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">2nd-Stage Reranker</span>
                <span className="text-[10px] text-muted-foreground">Cohere Cross-Encoder</span>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, enableReranker: !config.enableReranker })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.enableReranker ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    config.enableReranker ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-muted/60 border border-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Sampling Temperature</span>
                <span className="font-mono text-primary font-bold">{config.temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: Number(e.target.value) })}
                className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Compile Button */}
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Play className="w-3.5 h-3.5 fill-primary-foreground" />
            <span>{isRunning ? 'Compiling Architecture & Benchmarking...' : 'Simulate Architecture & Measure Telemetry'}</span>
          </button>
        </div>

        {/* Telemetry HUD (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-muted/40 border border-border p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Live Hardware &amp; SLA HUD</span>
              </span>
              {telemetry && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    telemetry.status === 'optimal'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : telemetry.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}
                >
                  {telemetry.status.toUpperCase()} STATUS
                </span>
              )}
            </div>

            {telemetry && (
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">P95 Latency</span>
                  <div className="text-lg font-black text-foreground">{telemetry.p95LatencyMs} ms</div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block">SLA: &lt; 60 ms</span>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">VRAM Footprint</span>
                  <div className="text-lg font-black text-foreground">{telemetry.vramGb} GB</div>
                  <span className="text-[9px] text-primary block">GPU: Single L40S</span>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">Cost / 1M Tokens</span>
                  <div className="text-lg font-black text-foreground">${telemetry.costPerMillion}</div>
                  <span className="text-[9px] text-muted-foreground block">Enterprise Budget</span>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">Recall Precision</span>
                  <div className="text-lg font-black text-foreground">{telemetry.retrievalAccuracy}%</div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block">RAGAS Benchmark</span>
                </div>
              </div>
            )}

            {/* Architectural Diagnosis */}
            {telemetry && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  telemetry.status === 'optimal'
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                    : telemetry.status === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20 text-foreground'
                    : 'bg-destructive/5 border-destructive/20 text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1 text-[11px]">
                  {telemetry.status === 'optimal' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>AI Architecture Feedback:</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {telemetry.diagnosis}
                </p>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/60 flex items-center justify-between">
            <span>Verified System Build #804</span>
            <span className="text-primary font-bold">+50 XP Awarded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
