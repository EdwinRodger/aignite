'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export default function ErrorCodeHunterPage() {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number | null>(null);
  const [isPatchApplied, setIsPatchApplied] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const handleApplyPatch = () => {
    setIsPatchApplied(true);
    if (!xpEarned) {
      setXpEarned(true);
      if (typeof window !== 'undefined') {
        const currentPoints = parseInt(localStorage.getItem('aignite_student_points') || '415', 10);
        localStorage.setItem('aignite_student_points', (currentPoints + 20).toString());
      }
    }
  };

  const handleReset = () => {
    setSelectedDiagnosis(null);
    setIsPatchApplied(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Understanding */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <Bug className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Error Code Hunter - Deep Learning Debugger
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          <strong>Why this matters:</strong> Silent bugs in deep learning training loops waste GPU clusters without throwing syntax crashes. Your objective is to inspect production AI code, identify the silent regression, and verify the production patch.
        </p>
      </div>

      {/* Target Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Active Mission</span>
          <div className="text-base font-bold text-foreground font-mono">PyTorch Gradient Exploder</div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Reward</span>
          <div className="text-base font-bold text-primary font-mono">+20 Verified XP</div>
        </Card>
        <Card className="p-4 bg-muted/30 border-border space-y-1 shadow-xs">
          <span className="text-sm font-mono text-muted-foreground">Severity Level</span>
          <div className="text-base font-bold text-destructive font-mono">Critical (Silent Failure)</div>
        </Card>
      </div>

      {/* Interactive Code Editor & Diff Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xs border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground font-sans flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span>Training Loop Code Snippet</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Review lines 1 through 8. Notice the gradient lifecycle in each mini-batch iteration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyPatch}
              disabled={isPatchApplied}
              className="font-bold text-sm"
            >
              {isPatchApplied ? '✓ Patch In Place' : 'Apply Production Patch'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Code Block with Diff Highlights */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 font-mono text-sm text-slate-100 space-y-1.5 overflow-x-auto">
          <div className="text-slate-500"># PyTorch Model Fine-Tuning Loop Snippet</div>
          <div><span className="text-slate-500 select-none mr-4">1</span><span className="text-purple-400">for</span> epoch <span className="text-purple-400">in</span> range(num_epochs):</div>
          <div><span className="text-slate-500 select-none mr-4">2</span>    <span className="text-purple-400">for</span> batch <span className="text-purple-400">in</span> train_dataloader:</div>
          {isPatchApplied && (
            <div className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
              <span className="text-emerald-400 select-none mr-3">+</span>        optimizer.zero_grad()  # PROD FIX: Clears buffers from previous batch!
            </div>
          )}
          <div><span className="text-slate-500 select-none mr-4">3</span>        inputs, targets = batch[&apos;inputs&apos;].to(device), batch[&apos;targets&apos;].to(device)</div>
          <div><span className="text-slate-500 select-none mr-4">4</span>        outputs = model(inputs)</div>
          <div><span className="text-slate-500 select-none mr-4">5</span>        loss = criterion(outputs, targets)</div>
          <div>
            <span className="text-slate-500 select-none mr-4">6</span>        
            <span className={!isPatchApplied ? 'bg-rose-500/25 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40 font-bold' : 'text-slate-200'}>
              loss.backward() {!isPatchApplied && '# BUG: Accumulates indefinitely into .grad without zero_grad!'}
            </span>
          </div>
          <div><span className="text-slate-500 select-none mr-4">7</span>        optimizer.step()</div>
        </div>

        {/* Diagnostic Assessment Multiple Choice */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-foreground">
            What is the catastrophic consequence of omitting <code className="text-primary font-mono">optimizer.zero_grad()</code>?
          </h3>

          <div className="space-y-2.5">
            {[
              {
                id: 0,
                text: 'PyTorch accumulates gradients in .grad tensor buffers across batches, causing effective batch sizes and gradient magnitudes to explode.',
                isCorrect: true,
                explanation: 'By default in PyTorch, .backward() sums gradients into existing .grad fields (+=). Without zero_grad(), batch N inherits all gradients from batches 1 through N-1.',
              },
              {
                id: 1,
                text: 'The CUDA memory allocator throws an immediate Out Of Memory (OOM) error before batch 2 can load.',
                isCorrect: false,
                explanation: 'Incorrect. The gradient buffers maintain a static allocation shape equal to model parameters, so it does not trigger an OOM crash.',
              },
              {
                id: 2,
                text: 'The loss value becomes negative infinity because Float16 underflows during backprop.',
                isCorrect: false,
                explanation: 'Incorrect. Float16 underflow happens with unscaled gradients in mixed precision, not missing zero_grad.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedDiagnosis(option.id);
                  if (option.isCorrect) handleApplyPatch();
                }}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all space-y-1 cursor-pointer ${
                  selectedDiagnosis === option.id
                    ? option.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                      : 'bg-destructive/10 border-destructive/30 text-foreground'
                    : 'bg-muted/40 border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between font-medium">
                  <span>{option.text}</span>
                  {selectedDiagnosis === option.id && option.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                </div>
                {selectedDiagnosis === option.id && (
                  <p
                    className={`text-sm font-mono pt-1 ${
                      option.isCorrect ? 'text-emerald-800' : 'text-destructive'
                    }`}
                  >
                    {option.explanation}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Patch Confirmation Box */}
        {isPatchApplied && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-sm text-foreground">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              <span>Production Bug Resolved! +20 XP Awarded</span>
            </div>
            <p className="text-sm leading-relaxed">
              Placing <code className="font-mono text-primary font-bold">optimizer.zero_grad()</code> at the start of each iteration resets parameter gradients, ensuring that <code className="font-mono text-primary">optimizer.step()</code> executes isolated stochastic gradient updates per batch.
            </p>
          </div>
        )}
      </Card>

      {/* Engineering Deep Dive */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground font-sans">
          Engineering Post-Mortem &amp; Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-2 shadow-xs border-border">
            <h3 className="text-base font-bold text-foreground font-sans">
              Why PyTorch Accumulates Gradients by Design
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              PyTorch defaults to accumulating gradients so developers can simulate large effective batch sizes on limited VRAM through gradient accumulation loops (e.g. running 4 micro-batches before calling zero_grad and step).
            </p>
          </Card>

          <Card className="p-5 space-y-2 shadow-xs border-border">
            <h3 className="text-base font-bold text-foreground font-sans">
              Modern Performance Alternative: set_to_none=True
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In PyTorch 2.x, use <code className="font-mono text-primary">optimizer.zero_grad(set_to_none=True)</code> instead of filling tensors with zeros. This deallocates the memory buffers, saving memory writes and speeding up execution by 5-10%.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
