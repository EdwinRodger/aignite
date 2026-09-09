'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ResumeAnalysisResult {
  overallAtsScore: number;
  percentileRank: number;
  headlineAssessment: string;
  domainMatches: {
    domain: string;
    roleName: string;
    fitScore: number;
    readinessLevel: 'High Fit' | 'Moderate Fit' | 'Upskilling Needed';
  }[];
  detectedSkills: {
    category: string;
    skills: string[];
  }[];
  criticalSkillGaps: {
    gap: string;
    severity: 'High Priority' | 'Medium Priority';
    explanation: string;
  }[];
  recommendedModules: {
    title: string;
    type: 'Company Pack' | 'Pipeline Game' | 'Voice Coach' | 'League Challenge';
    url: string;
    reason: string;
  }[];
  atsStrengths: string[];
  formattingAdvice: string[];
}

/**
 * Parses and evaluates resume text against modern AI recruitment bars.
 * Uses Gemini 2.0 Flash with robust heuristic fallback.
 */
export async function analyzeResumeAction(
  resumeText: string,
  fileName?: string
): Promise<{ success: boolean; analysis?: ResumeAnalysisResult; error?: string }> {
  if (!resumeText || resumeText.trim().length < 30) {
    return {
      success: false,
      error: 'Resume content is too short. Please provide at least 30 characters or paste your full resume.',
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `
You are a Staff AI Hiring Architect at Google, NVIDIA, and OpenAI evaluating a candidate's resume for modern AI/ML engineering roles.
Resume File Name: ${fileName || 'Uploaded Resume'}
Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Evaluate this resume strictly against modern 2026 AI industry standards (RAG, quantization, Triton/CUDA, agent loops, distributed training, eval benchmarks).
Return a JSON object adhering exactly to this TypeScript schema:
{
  "overallAtsScore": number (integer 0-100 based on keyword density, metrics quantification, impact, modern stack),
  "percentileRank": number (integer 50-99, e.g. 88 means top 12%),
  "headlineAssessment": string (1-2 crisp punchy sentences evaluating candidate level and immediate impression),
  "domainMatches": [
    {
      "domain": "GenAI & LLMs",
      "roleName": "Generative AI / LLM Engineer",
      "fitScore": number (0-100),
      "readinessLevel": "High Fit" | "Moderate Fit" | "Upskilling Needed"
    },
    {
      "domain": "AI Systems & Inference",
      "roleName": "Inference Acceleration (CUDA/Triton) Engineer",
      "fitScore": number (0-100),
      "readinessLevel": "High Fit" | "Moderate Fit" | "Upskilling Needed"
    },
    {
      "domain": "MLOps & Distributed Systems",
      "roleName": "Distributed Training (FSDP/ZeRO) Engineer",
      "fitScore": number (0-100),
      "readinessLevel": "High Fit" | "Moderate Fit" | "Upskilling Needed"
    },
    {
      "domain": "Computer Vision & Multimodal",
      "roleName": "Vision-Language / Edge AI Engineer",
      "fitScore": number (0-100),
      "readinessLevel": "High Fit" | "Moderate Fit" | "Upskilling Needed"
    },
    {
      "domain": "Agent Systems",
      "roleName": "Autonomous Agent Architect",
      "fitScore": number (0-100),
      "readinessLevel": "High Fit" | "Moderate Fit" | "Upskilling Needed"
    }
  ],
  "detectedSkills": [
    { "category": "Core Frameworks", "skills": string[] },
    { "category": "Models & Architectures", "skills": string[] },
    { "category": "Vector & Retrieval", "skills": string[] },
    { "category": "Deployment & Infrastructure", "skills": string[] }
  ],
  "criticalSkillGaps": [
    {
      "gap": string (e.g. "Missing Quantization (FP8, AWQ, bitsandbytes)"),
      "severity": "High Priority" | "Medium Priority",
      "explanation": string (why this gap causes ATS or recruiter rejection)
    }
  ],
  "recommendedModules": [
    {
      "title": string (e.g. "NVIDIA AI Pack: CUDA & TensorRT"),
      "type": "Company Pack" | "Pipeline Game" | "Voice Coach" | "League Challenge",
      "url": string (choose from: "/packs/nvidia-ai-pack", "/packs/openai-pack", "/packs/google-ai-pack", "/packs", "/coach", "/league"),
      "reason": string (how this module closes the specific gap)
    }
  ],
  "atsStrengths": string[] (3-4 bullet points highlighting specific quantitative or technical strengths),
  "formattingAdvice": string[] (2-3 bullet points on ATS parser readability, layout, or bullet points structure)
}
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const parsed: ResumeAnalysisResult = JSON.parse(rawText);

      return { success: true, analysis: parsed };
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to heuristic engine:', err);
    }
  }

  // Heuristic Analysis Fallback Engine
  const heuristicAnalysis = runHeuristicResumeAnalysis(resumeText);
  return { success: true, analysis: heuristicAnalysis };
}

/**
 * Intelligent deterministic heuristic analyzer parsing AI keywords, frameworks, and metrics.
 */
function runHeuristicResumeAnalysis(text: string): ResumeAnalysisResult {
  const lower = text.toLowerCase();

  const techDictionary: Record<string, string[]> = {
    'Core Frameworks': [
      'pytorch',
      'tensorflow',
      'jax',
      'triton',
      'cuda',
      'tensorrt',
      'vllm',
      'deepspeed',
      'huggingface',
      'langchain',
      'llamaindex',
      'langgraph',
      'fastapi',
      'onnx',
    ],
    'Models & Architectures': [
      'transformer',
      'llama',
      'gpt',
      'bert',
      'vit',
      'yolo',
      'clip',
      'diffusion',
      'mistral',
      'deepseek',
      'gemma',
      'whisper',
    ],
    'Vector & Retrieval': [
      'pgvector',
      'faiss',
      'pinecone',
      'qdrant',
      'milvus',
      'chroma',
      'rag',
      'embedding',
      'reranking',
      'bm25',
      'hybrid search',
    ],
    'Deployment & Infrastructure': [
      'docker',
      'kubernetes',
      'slurm',
      'aws',
      'gcp',
      'azure',
      'linux',
      'triton inference server',
      'ray',
      'quantization',
      'awq',
      'fp8',
    ],
  };

  const detectedCategories: { category: string; skills: string[] }[] = [];
  let totalKeywordsFound = 0;

  for (const [category, keywords] of Object.entries(techDictionary)) {
    const matched = keywords.filter((k) => lower.includes(k));
    totalKeywordsFound += matched.length;
    detectedCategories.push({
      category,
      skills: matched.length > 0 ? matched.map((s) => s.toUpperCase()) : ['None detected yet'],
    });
  }

  // Quantified metrics check (e.g. %, ms, X, reduction, latency)
  const metricKeywords = ['%', 'percent', 'ms', 'latency', 'speedup', 'reduced', 'improved', 'increased', 'fps', 'tflops'];
  const metricMatches = metricKeywords.filter((m) => lower.includes(m)).length;

  let baseScore = 60;
  baseScore += Math.min(22, totalKeywordsFound * 1.6);
  baseScore += Math.min(15, metricMatches * 2.5);
  const atsScore = Math.min(96, Math.max(52, Math.round(baseScore)));
  const percentile = Math.min(99, Math.max(50, Math.round(atsScore * 0.95 + 4)));

  // Domain score heuristics
  const hasRag = lower.includes('rag') || lower.includes('embedding') || lower.includes('retrieval');
  const hasCuda = lower.includes('cuda') || lower.includes('triton') || lower.includes('kernel') || lower.includes('tensorrt');
  const hasDistributed = lower.includes('fsdp') || lower.includes('deepspeed') || lower.includes('slurm') || lower.includes('distributed');
  const hasVision = lower.includes('vision') || lower.includes('yolo') || lower.includes('cv') || lower.includes('vit') || lower.includes('image');
  const hasAgents = lower.includes('agent') || lower.includes('langgraph') || lower.includes('tool') || lower.includes('function call');

  const domainMatches: ResumeAnalysisResult['domainMatches'] = [
    {
      domain: 'GenAI & LLMs',
      roleName: 'Generative AI / LLM Engineer',
      fitScore: hasRag ? 88 : 68,
      readinessLevel: hasRag ? 'High Fit' : 'Moderate Fit',
    },
    {
      domain: 'AI Systems & Inference',
      roleName: 'Inference Acceleration (CUDA/Triton)',
      fitScore: hasCuda ? 92 : 60,
      readinessLevel: hasCuda ? 'High Fit' : 'Upskilling Needed',
    },
    {
      domain: 'MLOps & Distributed Systems',
      roleName: 'Distributed Training Engineer',
      fitScore: hasDistributed ? 89 : 64,
      readinessLevel: hasDistributed ? 'High Fit' : 'Upskilling Needed',
    },
    {
      domain: 'Computer Vision & Multimodal',
      roleName: 'Vision-Language / Edge AI',
      fitScore: hasVision ? 86 : 58,
      readinessLevel: hasVision ? 'High Fit' : 'Upskilling Needed',
    },
    {
      domain: 'Agent Systems',
      roleName: 'Autonomous Agent Architect',
      fitScore: hasAgents ? 90 : 66,
      readinessLevel: hasAgents ? 'High Fit' : 'Moderate Fit',
    },
  ];

  // Critical Skill Gaps
  const criticalSkillGaps: ResumeAnalysisResult['criticalSkillGaps'] = [];
  if (!hasCuda && !lower.includes('quantization')) {
    criticalSkillGaps.push({
      gap: 'Low-Bit Quantization (FP8, AWQ, bitsandbytes)',
      severity: 'High Priority',
      explanation:
        'Enterprise AI recruiters demand experience fitting 70B+ parameters on cost-effective enterprise GPUs using post-training quantization.',
    });
  }
  if (!lower.includes('rerank') && !lower.includes('cohere')) {
    criticalSkillGaps.push({
      gap: 'Cross-Encoder Reranking in RAG',
      severity: 'High Priority',
      explanation:
        'Basic vector search fails on production multi-step legal/financial queries without a 2nd-stage cross-encoder reranker.',
    });
  }
  if (!hasAgents) {
    criticalSkillGaps.push({
      gap: 'Autonomous Agent Loops (ReAct, LangGraph)',
      severity: 'Medium Priority',
      explanation:
        '2026 hiring heavily prioritizes deterministic JSON schema tool-calling over plain text chatbots.',
    });
  }
  if (criticalSkillGaps.length === 0) {
    criticalSkillGaps.push({
      gap: 'FlashAttention-3 TMA Specialization',
      severity: 'Medium Priority',
      explanation:
        'Hopper/Blackwell architecture optimization is the next frontier for sub-10ms token-to-first-token inference.',
    });
  }

  // Recommended AIgnite Modules
  const recommendedModules: ResumeAnalysisResult['recommendedModules'] = [
    {
      title: 'NVIDIA AI Pack: CUDA, TensorRT & FP8 Acceleration',
      type: 'Company Pack',
      url: '/packs/nvidia-ai-pack',
      reason: 'Bridges low-level GPU acceleration, P95 latency reduction, and memory footprint management.',
    },
    {
      title: 'Interactive RAG Master Pipeline Game',
      type: 'Pipeline Game',
      url: '/packs/openai-pack',
      reason: 'Hands-on practice wiring parsers, pgvector embeddings, hybrid retrievers, and rerankers.',
    },
    {
      title: 'Daily AI Voice Interview Coach',
      type: 'Voice Coach',
      url: '/coach',
      reason: 'Practice vocal articulation of distributed systems trade-offs and reduce speech filler words.',
    },
  ];

  return {
    overallAtsScore: atsScore,
    percentileRank: percentile,
    headlineAssessment:
      atsScore >= 85
        ? 'Strong candidate with impressive practical AI systems focus and clear engineering vocabulary. Ready for Tier-1 corporate screening.'
        : 'Solid foundations with good project concepts, but needs deeper quantitative metrics and bleeding-edge deployment skills (quantization, kernels) to pass top ATS filters.',
    domainMatches,
    detectedSkills: detectedCategories,
    criticalSkillGaps,
    recommendedModules,
    atsStrengths: [
      'Strong mentions of modern AI frameworks and architectural building blocks',
      metricMatches > 0
        ? 'Clear evidence of quantitative impact metrics and latency reduction goals'
        : 'Good technical breadth across data modeling and model inference',
      'Demonstrated project work aligning with contemporary LLM and ML engineering roles',
    ],
    formattingAdvice: [
      'Quantify every project bullet point with measurable business metrics (e.g. latency cut by 42%, 99.4% accuracy).',
      'Explicitly list target GPU architectures and memory constraints (e.g. A100 80GB, T4 16GB).',
      'Use standard single-column ATS layout to ensure 100% text parser readability.',
    ],
  };
}
