'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { analyzeResumeAction, ResumeAnalysisResult } from '@/app/actions/resume';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Trophy,
  Layers,
  Mic,
  Zap,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

const SAMPLE_AI_RESUME = `AARAV SHARMA
B.Tech Computer Science | Mumbai, India | aarav.sharma@gmail.com | github.com/aarav-ai | linkedin.com/in/aarav-sharma

SUMMARY:
Final-year CS student with strong foundations in PyTorch, Large Language Models, and RAG systems. Built low-latency generative AI applications with pgvector and vLLM. Seeking an AI/ML Systems Engineering role.

EDUCATION:
Indian Institute of Technology (IIT) Bombay - B.Tech in Computer Science & Engineering (2022 - 2026)
CGPA: 8.9 / 10.0

TECHNICAL SKILLS:
- Core Frameworks: PyTorch, HuggingFace Transformers, LangChain, FastAPI, vLLM, DeepSpeed
- Models: Llama-3, Mistral-7B, DeepSeek-R1, CLIP, GPT-4o
- Vector Databases & Retrieval: pgvector, FAISS, Pinecone, Hybrid Search, BM25, Cohere Rerank
- Infrastructure & Tools: Docker, Kubernetes, Linux, Git, Weights & Biases, Triton Inference Server

PROJECTS:
1. Sub-50ms Production Legal RAG Pipeline (PyTorch, pgvector, FastAPI)
- Built an enterprise question-answering system over 20,000 corporate legal contracts with recursive chunking and hybrid dense-sparse retrieval.
- Integrated Cohere cross-encoder reranking, reducing hallucination rate by 34% on unseen contract amendments.
- Scaled FastAPI backend with asynchronous batching and vLLM PagedAttention, achieving 42ms P95 latency.

2. LoRA Fine-Tuning of Indic Code Assistants (Transformers, PEFT, TRL)
- Fine-tuned Llama-3-8B on 50,000 synthetic Python and SQL instructional pairs using 4-bit QLoRA and flash-attn-2.
- Achieved a 12.8% boost on HumanEval-Python benchmark compared to base model with less than 16GB VRAM footprint.

3. Autonomous SQL Analytics Agent (LangGraph, PostgreSQL)
- Developed a self-healing agent loop that parses natural language queries, validates AST syntax, and auto-corrects execution errors.
- Reduced failed database query executions by 91% across 1,000 analytical queries.`;

export function ResumeAnalyzerClient() {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
      }
    };
    reader.onerror = () => {
      setError('Unable to read the uploaded file. Please paste your resume text directly.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setFileName('sample-ai-engineer-resume.txt');
    setResumeText(SAMPLE_AI_RESUME);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 30) {
      setError('Please paste your resume or upload a file with at least 30 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeResumeAction(resumeText, fileName || 'Pasted Resume');
      if (res.success && res.analysis) {
        setResult(res.analysis);
      } else {
        setError(res.error || 'Unable to complete resume analysis.');
      }
    } catch {
      setError('An unexpected error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Input Section */}
      {!result ? (
        <div className="space-y-6">
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight">
                  Upload or Paste Your AI Resume
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Evaluated against 2026 AI systems hiring bars at Google, NVIDIA, and top AI labs.
                </p>
              </div>

              {/* Sample Loader Shortcut */}
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>Load Sample AI Resume</span>
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-muted/20">
              <input
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {fileName ? (
                    <span className="text-primary font-mono">{fileName}</span>
                  ) : (
                    <span>Drag & drop resume file, or click to browse</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Supports TXT, Markdown, and PDF plain text extracts (up to 5MB)
                </p>
              </div>
            </div>

            {/* Paste Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Or Paste Resume Plain Text / Markdown:</span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {resumeText.length} characters
                </span>
              </label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                className="w-full p-4 rounded-2xl bg-muted/40 border border-border text-foreground font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                resumeText.trim() && !loading
                  ? 'bg-primary hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/25 active:scale-98 cursor-pointer'
                  : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating with Gemini 2.0 Flash AI ATS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze AI Resume & Detect Skill Gaps</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xl shadow-black/10 space-y-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                {/* Radial Score Gauge */}
                <div className="relative w-24 h-24 rounded-full bg-muted border-4 border-primary/30 flex items-center justify-center shadow-lg shrink-0">
                  <div className="text-center">
                    <span className="text-3xl font-black font-mono text-primary leading-none block">
                      {result.overallAtsScore}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      / 100 ATS
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground font-sans">
                      Resume ATS Evaluation Score
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold font-mono">
                      Top {100 - result.percentileRank}% (Percentile {result.percentileRank})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {result.headlineAssessment}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-center shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Analyze Another Resume</span>
              </button>
            </div>
          </div>

          {/* Domain Fit & Readiness Breakdown */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-chart-5" />
              <h3 className="text-lg font-bold text-foreground font-sans">
                Target AI Engineering Roles Compatibility
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.domainMatches.map((domain) => (
                <div
                  key={domain.domain}
                  className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-foreground font-mono">{domain.roleName}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        domain.readinessLevel === 'High Fit'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : domain.readinessLevel === 'Moderate Fit'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          : 'bg-destructive/10 border-destructive/20 text-destructive'
                      }`}
                    >
                      {domain.readinessLevel}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">ATS Match Fit</span>
                      <span className="text-primary font-bold">{domain.fitScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${domain.fitScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Over Consumption: AIgnite Gap Bridge */}
          <div className="rounded-3xl bg-gradient-to-tr from-primary/10 via-card to-card border border-primary/25 p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground font-sans">
                    Action Over Consumption: Close Your Skill Gaps with AIgnite
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Do not watch passive 50-hour lectures. Bridge your missing production competencies directly with interactive modules:
                </p>
              </div>
            </div>

            {/* Critical Gaps Radar */}
            <div className="space-y-3">
              <span className="text-sm font-bold text-destructive font-mono uppercase tracking-wider block">
                🚨 High-Priority Missing AI Skills Identified:
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.criticalSkillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-destructive/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">{gap.gap}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-destructive/10 text-destructive font-semibold">
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {gap.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bridge Action Cards */}
            <div className="space-y-3 pt-2">
              <span className="text-sm font-bold text-primary font-mono uppercase tracking-wider block">
                ⚡ Recommended Interactive Bridge Modules:
              </span>
              <div className="grid sm:grid-cols-3 gap-4">
                {result.recommendedModules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 shadow-2xs group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold uppercase">
                        {mod.type === 'Company Pack' && <Layers className="w-3.5 h-3.5" />}
                        {mod.type === 'Pipeline Game' && <Zap className="w-3.5 h-3.5" />}
                        {mod.type === 'Voice Coach' && <Mic className="w-3.5 h-3.5" />}
                        <span>{mod.type}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {mod.reason}
                      </p>
                    </div>

                    <Link
                      href={mod.url}
                      className="py-2 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-1 shadow-sm hover:opacity-90 transition-all"
                    >
                      <span>Launch Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Skills & Formatting Advice Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Detected Skills */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Extracted Technical Competencies</span>
              </h4>

              <div className="space-y-3">
                {result.detectedSkills.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">
                      {cat.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-muted text-[11px] font-mono text-foreground border border-border/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Strengths & Formatting Advice */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>ATS Optimization Insights</span>
              </h4>

              <div className="space-y-3 text-sm">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                    Key ATS Strengths:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground leading-relaxed">
                    {result.atsStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500 block">
                    Actionable Formatting Advice:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground leading-relaxed">
                    {result.formattingAdvice.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
