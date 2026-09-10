'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

const CORRECT_ORDER = [
  'Document Parser',
  'Recursive Splitter',
  'text-embedding-3',
  'pgvector (HNSW)',
  'Hybrid Retriever',
  'Cohere Rerank',
  'Prompt Template',
  'LLM Generator',
];

const NODE_DETAILS: Record<string, { role: string; latencyBudget: string; rationale: string }> = {
  'Document Parser': {
    role: 'Extracts clean text and metadata from PDF, HTML, and Markdown.',
    latencyBudget: '4ms',
    rationale: 'Must run first to normalize unstructured inputs into streamable tokens.',
  },
  'Recursive Splitter': {
    role: 'Partitions documents into semantically coherent 512-token chunks with 64-token overlap.',
    latencyBudget: '2ms',
    rationale: 'Chunks must be prepared before embeddings can be computed.',
  },
  'text-embedding-3': {
    role: 'Generates 1536-dimensional dense vector embeddings per chunk.',
    latencyBudget: '12ms',
    rationale: 'Embedding generation transforms text chunks into queryable vector points.',
  },
  'pgvector (HNSW)': {
    role: 'Indexes high-dimensional vectors in Hierarchical Navigable Small World graphs.',
    latencyBudget: '5ms',
    rationale: 'Provides sub-10ms logarithmic approximate nearest neighbor search.',
  },
  'Hybrid Retriever': {
    role: 'Combines dense vector cosine similarity with BM25 keyword matching.',
    latencyBudget: '6ms',
    rationale: 'Eliminates keyword blind spots in pure dense semantic search.',
  },
  'Cohere Rerank': {
    role: 'Cross-encoder scoring to rerank the top 20 candidate passages to top 3.',
    latencyBudget: '8ms',
    rationale: 'High-precision cross-attention ensures only the most relevant chunks enter context.',
  },
  'Prompt Template': {
    role: 'Assembles instructions, retrieved top 3 chunks, and user query into context window.',
    latencyBudget: '1ms',
    rationale: 'Constructs the final grounded payload for generation.',
  },
  'LLM Generator': {
    role: 'vLLM FP8 quantized engine generating streaming answer under 50 tokens/sec.',
    latencyBudget: '14ms',
    rationale: 'Final generation step returning grounded answer to the client.',
  },
};

export default function PipelineBubbleGamePage() {
  const [availableNodes, setAvailableNodes] = useState<string[]>([
    'pgvector (HNSW)',
    'Cohere Rerank',
    'Document Parser',
    'LLM Generator',
    'Recursive Splitter',
    'Prompt Template',
    'text-embedding-3',
    'Hybrid Retriever',
  ]);

  const [pipelineSequence, setPipelineSequence] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const handleAddNode = (node: string) => {
    if (pipelineSequence.includes(node)) return;
    setPipelineSequence((prev) => [...prev, node]);
    setAvailableNodes((prev) => prev.filter((n) => n !== node));
    setIsVerified(false);
  };

  const handleRemoveNode = (node: string) => {
    setPipelineSequence((prev) => prev.filter((n) => n !== node));
    setAvailableNodes((prev) => [...prev, node]);
    setIsVerified(false);
  };

  const handleReset = () => {
    setAvailableNodes([
      'pgvector (HNSW)',
      'Cohere Rerank',
      'Document Parser',
      'LLM Generator',
      'Recursive Splitter',
      'Prompt Template',
      'text-embedding-3',
      'Hybrid Retriever',
    ]);
    setPipelineSequence([]);
    setIsVerified(false);
    setIsSuccess(false);
  };

  const handleVerify = () => {
    if (pipelineSequence.length !== CORRECT_ORDER.length) {
      setIsVerified(true);
      setIsSuccess(false);
      return;
    }

    const correct = pipelineSequence.every((val, idx) => val === CORRECT_ORDER[idx]);
    setIsVerified(true);
    setIsSuccess(correct);

    if (correct && !xpEarned) {
      setXpEarned(true);
      if (typeof window !== 'undefined') {
        const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
        localStorage.setItem('aignite_student_points', (currentPoints + 25).toString());
      }
    }
  };

  const handleAutoSolve = () => {
    setPipelineSequence([...CORRECT_ORDER]);
    setAvailableNodes([]);
    setIsVerified(true);
    setIsSuccess(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Game Header & Understanding */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <CircleDot className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Pipeline Bubble Game - RAG Sequencer
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          <strong>Why this matters:</strong> An unoptimized Retrieval-Augmented Generation (RAG) architecture incurs severe latency penalties when components execute out of order. Connect each execution stage in correct chronological sequence to build an enterprise RAG pipeline under a 50ms P95 latency SLA.
        </p>
      </div>

      {/* Target Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Target SLA</span>
          <div className="text-base font-bold text-foreground font-mono">Sub-50ms P95 Latency</div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Reward</span>
          <div className="text-base font-bold text-primary font-mono">+25 Verified XP</div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Domain Bar</span>
          <div className="text-base font-bold text-foreground font-mono">Staff AI Systems Bar</div>
        </Card>
      </div>

      {/* Interactive Assembly Workspace */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground font-sans">
              Pipeline Construction Track
            </h2>
            <p className="text-sm text-muted-foreground">
              Click available nodes below to append them in sequential execution order.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoSolve}
              className="text-sm font-mono"
            >
              Inspect Optimal Order
            </Button>
          </div>
        </div>

        {/* Selected Sequence Rail */}
        <div className="p-6 rounded-xl bg-muted/40 border border-border min-h-28 flex flex-wrap items-center gap-3">
          {pipelineSequence.length === 0 ? (
            <p className="text-sm text-muted-foreground italic mx-auto">
              No nodes placed yet. Click available nodes below to begin sequencing.
            </p>
          ) : (
            pipelineSequence.map((node, idx) => (
              <React.Fragment key={node}>
                <button
                  type="button"
                  onClick={() => handleRemoveNode(node)}
                  title="Click to remove"
                  className="px-3 py-2 rounded-lg bg-card border border-primary/40 text-primary font-bold shadow-xs text-sm hover:border-destructive hover:text-destructive transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <span className="w-5 h-5 rounded-md bg-primary/10 text-primary group-hover:bg-destructive/10 group-hover:text-destructive flex items-center justify-center font-mono text-sm">
                    {idx + 1}
                  </span>
                  <span>{node}</span>
                </button>
                {idx < pipelineSequence.length - 1 && (
                  <span className="text-muted-foreground font-black">&rarr;</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Available Candidate Nodes */}
        <div className="space-y-2 pt-2">
          <span className="text-sm font-bold text-foreground">Available Architecture Nodes:</span>
          <div className="flex flex-wrap gap-2.5">
            {availableNodes.map((node) => (
              <Button
                key={node}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddNode(node)}
                className="text-sm font-medium hover:border-primary/50"
              >
                + {node}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm font-mono text-muted-foreground">
            {pipelineSequence.length} of {CORRECT_ORDER.length} stages configured
          </span>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={pipelineSequence.length === 0}
            className="font-bold text-sm shadow-xs gap-2"
          >
            <span>Run Pipeline Verification</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Verification Result Feedback */}
        {isVerified && (
          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                : 'bg-destructive/10 border-destructive/30 text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-emerald-800">
                    Optimal Pipeline Verified: 42ms P95 SLA Achieved!
                  </h3>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h3 className="text-base font-bold text-destructive">
                    Pipeline Sequencing Error Detected
                  </h3>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed">
              {isSuccess
                ? 'Your execution order correctly ensures that token extraction precedes embedding generation, hybrid vector retrieval extracts candidates, and Cohere cross-encoders rerank before context insertion. +25 XP awarded.'
                : 'The components are out of chronological order. Verify that parsing happens before splitting, vector index queries happen before cross-encoder reranking, and generation is the final step.'}
            </p>

            {isSuccess && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-sm font-mono">
                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-sm">Latency</span>
                  <span className="font-bold text-foreground">42ms (Pass)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-sm">Throughput</span>
                  <span className="font-bold text-foreground">120 req/s</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-sm">Accuracy</span>
                  <span className="font-bold text-foreground">96.4%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-sm">Memory</span>
                  <span className="font-bold text-foreground">3.2 GB VRAM</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Deep Dive: Why Each Stage Matters */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground font-sans">
          Architecture Understanding &amp; Node Specs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CORRECT_ORDER.map((node, idx) => {
            const detail = NODE_DETAILS[node];
            return (
              <Card key={node} className="p-5 space-y-2 shadow-xs border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-primary/10 text-primary font-mono font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-foreground font-sans">{node}</h3>
                  </div>
                  <Badge variant="outline" className="text-sm font-mono bg-muted text-muted-foreground">
                    Budget: {detail.latencyBudget}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{detail.role}</p>
                <p className="text-sm text-muted-foreground border-t border-border/60 pt-2 font-mono">
                  {detail.rationale}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
