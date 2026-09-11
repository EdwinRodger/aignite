'use client';

import React, { useState } from 'react';
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
  Layers,
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

const INITIAL_NODES = [
  'pgvector (HNSW)',
  'Cohere Rerank',
  'Document Parser',
  'LLM Generator',
  'Recursive Splitter',
  'Prompt Template',
  'text-embedding-3',
  'Hybrid Retriever',
];

export function PipelineBubbleChallenge({ onComplete }: { onComplete?: () => void }) {
  const [availableNodes, setAvailableNodes] = useState<string[]>(INITIAL_NODES);
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
    setAvailableNodes(INITIAL_NODES);
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
      onComplete?.();
    }
  };

  const handleAutoSolve = () => {
    setPipelineSequence([...CORRECT_ORDER]);
    setAvailableNodes([]);
    setIsVerified(true);
    setIsSuccess(true);
    if (!xpEarned) {
      setXpEarned(true);
      if (typeof window !== 'undefined') {
        const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
        localStorage.setItem('aignite_student_points', (currentPoints + 25).toString());
      }
      onComplete?.();
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-border bg-card shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground font-sans">
                RAG Pipeline Bubble
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sequence the 8 core RAG stages chronologically from raw ingest to final generation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoSolve}
            className="text-sm font-semibold"
          >
            Auto-Solve Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm text-muted-foreground"
            title="Reset Pipeline"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Target Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Latency Budget</span>
          <span className="text-base font-bold text-foreground font-mono">52ms (Target: &lt; 60ms)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Vector Precision</span>
          <span className="text-base font-bold text-primary font-mono">1536-dim Cosine</span>
        </div>
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-sm font-mono text-muted-foreground block">Assembly Status</span>
          <span className="text-base font-bold text-foreground font-mono">
            {pipelineSequence.length} / {CORRECT_ORDER.length} Nodes Placed
          </span>
        </div>
      </div>

      {/* Stage 1: Sequence Builder Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" />
            Assembled Pipeline Sequence
          </span>
          <span className="text-sm text-muted-foreground">
            Click any placed node to remove it
          </span>
        </div>

        <div className="min-h-24 p-4 rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-wrap gap-2.5 items-center">
          {pipelineSequence.length === 0 ? (
            <div className="w-full text-center py-4 text-sm text-muted-foreground">
              Click available components below to add them to your execution pipeline in order.
            </div>
          ) : (
            pipelineSequence.map((node, idx) => (
              <div
                key={node}
                onClick={() => handleRemoveNode(node)}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-primary/40 text-foreground text-sm font-mono shadow-xs hover:border-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-150"
              >
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-semibold">{node}</span>
                <span className="text-sm text-muted-foreground group-hover:text-destructive transition-colors">
                  ×
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stage 2: Available Pool of Nodes */}
      <div className="space-y-3">
        <span className="text-sm font-bold text-foreground">
          Available Architecture Components
        </span>
        <div className="flex flex-wrap gap-2">
          {availableNodes.map((node) => (
            <Button
              key={node}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddNode(node)}
              className="text-sm font-mono bg-muted/30 hover:bg-primary/10 hover:border-primary transition-all duration-150 py-2 px-3"
            >
              + {node}
            </Button>
          ))}
        </div>
      </div>

      {/* Verification Feedback Alert */}
      {isVerified && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            isSuccess
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-sm">
            <div className="font-bold text-base">
              {isSuccess
                ? 'Sub-50ms RAG Pipeline Verified!'
                : 'Pipeline Sequence Architecture Failure'}
            </div>
            <div>
              {isSuccess
                ? 'All 8 stages are chronologically sequenced: Ingestion -> Chunking -> Embeddings -> Storage -> Hybrid Retrieval -> Rerank -> Prompt -> Generation. You earned +25 XP!'
                : `Your current order has inconsistencies. Remember: documents must be parsed before split, embeddings must precede vector indexing, and reranking occurs before prompt templating.`}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {xpEarned ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Verified Challenge Complete (+25 XP)
            </span>
          ) : (
            'Verify your sequence to earn +25 verified student XP'
          )}
        </div>

        <Button
          type="button"
          onClick={handleVerify}
          disabled={pipelineSequence.length === 0}
          className="w-full sm:w-auto font-bold text-sm px-6"
        >
          <Zap className="w-4 h-4 mr-2" />
          Verify Architecture Order
        </Button>
      </div>

      {/* Architectural Node Explanations Table */}
      <div className="pt-4 border-t border-border space-y-3">
        <span className="text-sm font-bold text-foreground block">
          Stage Latency Budget & Rationale Guide
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CORRECT_ORDER.map((nodeName, idx) => (
            <div
              key={nodeName}
              className="p-3 rounded-xl bg-muted/20 border border-border/60 text-sm space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {idx + 1}. {nodeName}
                </span>
                <Badge variant="secondary" className="text-sm font-mono">
                  {NODE_DETAILS[nodeName].latencyBudget}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {NODE_DETAILS[nodeName].role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
