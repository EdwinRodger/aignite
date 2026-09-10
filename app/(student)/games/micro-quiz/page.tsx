'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  topic: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'RL & Reasoning',
    question: 'Why does DeepSeek-R1 Group Relative Policy Optimization (GRPO) use significantly less GPU memory than standard PPO?',
    options: [
      'It eliminates the Critic / Value network entirely, removing an extra full model copy from VRAM.',
      'It forces 2-bit quantization across all query and key attention matrices.',
      'It shrinks the context window from 32,000 tokens down to 512 tokens.',
      'It offloads weights to host CPU RAM using PCIe Gen3 transfers.',
    ],
    correctIndex: 0,
    explanation: 'Standard PPO maintains both an Actor (Policy) and a Critic (Value) model in VRAM. GRPO computes baseline advantages by sampling a group of responses to the same prompt and normalizing rewards across the group, eliminating the critic model completely.',
  },
  {
    id: 2,
    topic: 'CUDA & Attention',
    question: 'What architectural innovation in FlashAttention-3 enables near theoretical peak compute on NVIDIA Hopper H100 GPUs?',
    options: [
      'Tensor Memory Accelerator (TMA) warp specialization decoupling asynchronous memory transfers from compute warps.',
      'Replacing softmax attention with linear kernel convolutions.',
      'Caching all intermediate attention matrices in L2 cache permanently.',
      'Quantizing token embeddings to ternary (-1, 0, +1) weights.',
    ],
    correctIndex: 0,
    explanation: 'Hopper GPUs introduce TMA hardware for asynchronous global-to-shared memory transfers. FlashAttention-3 uses warp specialization: producer warps issue TMA memory transfers while consumer warps execute matrix multiplications, hiding memory latency completely.',
  },
  {
    id: 3,
    topic: 'Inference Engines',
    question: 'How does vLLM PagedAttention eliminate nearly all internal memory fragmentation in the KV Cache?',
    options: [
      'By partitioning the KV cache into fixed-size physical memory blocks managed through a page table, mirroring OS virtual memory.',
      'By recomputing all past key-value states at every single token step.',
      'By dropping 50% of the oldest tokens when GPU VRAM utilization exceeds 80%.',
      'By serializing the KV cache to NVMe SSD storage.',
    ],
    correctIndex: 0,
    explanation: 'Traditional LLM serving pre-allocates contiguous memory for maximum possible sequence lengths (e.g. 8k tokens), wasting 60-80% of VRAM on unused capacity. PagedAttention dynamic paging achieves near 100% memory utilization.',
  },
  {
    id: 4,
    topic: 'Positional Encodings',
    question: 'Why do modern LLMs (Llama 3, Mistral, Gemma) prefer Rotary Position Embeddings (RoPE) over absolute sinusoidal encodings?',
    options: [
      'RoPE naturally models relative token distances through complex rotation matrices and enables efficient context window extension.',
      'RoPE requires zero parameters and requires no dot product operations.',
      'RoPE reduces vocabulary size from 128,000 tokens to 32,000 tokens.',
      'RoPE eliminates the need for multi-head attention entirely.',
    ],
    correctIndex: 0,
    explanation: 'RoPE applies a 2D rotation matrix to paired query and key dimensions. The inner product between rotated vectors depends solely on the relative distance (m - n), enabling natural length generalization and methods like YaRN.',
  },
];

export default function MicroQuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectAnswer = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;

    const isCorrect = optionIdx === currentQ.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      if (!xpEarned) {
        setXpEarned(true);
        if (typeof window !== 'undefined') {
          const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
          localStorage.setItem('aignite_student_points', (currentPoints + 20).toString());
        }
      }
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Understanding */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            5-Second Micro-Quiz - Architectural Drills
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          <strong>Why this matters:</strong> In technical interview rounds and system architecture reviews, AI engineers must instinctively grasp reasoning loss functions, memory paging, and hardware kernels.
        </p>
      </div>

      {/* Score & Progress Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Question Progress</span>
          <div className="text-base font-bold text-foreground font-mono">
            {quizCompleted ? QUIZ_QUESTIONS.length : currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Accuracy Score</span>
          <div className="text-base font-bold text-primary font-mono">
            {score} / {QUIZ_QUESTIONS.length} Correct
          </div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Reward</span>
          <div className="text-base font-bold text-foreground font-mono">+20 Verified XP</div>
        </Card>
      </div>

      {/* Main Quiz Card */}
      {!quizCompleted ? (
        <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-border">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm font-mono bg-primary/10 text-primary border-primary/20">
              Topic: {currentQ.topic}
            </Badge>
            <span className="text-sm font-mono text-muted-foreground">
              Question {currentIdx + 1}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground font-sans leading-snug">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const isCorrect = idx === currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    hasAnsweredCurrent
                      ? isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground font-semibold'
                        : isSelected
                        ? 'bg-destructive/10 border-destructive/40 text-foreground'
                        : 'bg-muted/30 border-border text-muted-foreground opacity-60'
                      : 'bg-muted/30 border-border hover:border-primary/40 text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-card border border-border flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </div>
                  {hasAnsweredCurrent && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-destructive shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {hasAnsweredCurrent && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1.5 text-sm">
              <span className="font-bold text-foreground block">
                Staff Architecture Explanation:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Controls */}
          {hasAnsweredCurrent && (
            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={handleNext}
                className="font-bold text-sm gap-1.5 shadow-xs"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center space-y-5 shadow-xs border-border">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-foreground font-sans">
              Micro-Quiz Completed!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You scored <span className="font-bold text-primary font-mono">{score} out of {QUIZ_QUESTIONS.length}</span> on core AI systems architecture mechanics. +20 XP awarded to your verified profile.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="font-bold text-sm gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </Button>
            <Button asChild className="font-bold text-sm gap-1.5 shadow-xs">
              <Link href="/packs">
                <span>Explore Company Packs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
