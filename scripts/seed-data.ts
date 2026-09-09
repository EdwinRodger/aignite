/**
 * Supabase Baseline Seeding Data
 * Reference: docs/DATABASE_SEEDING_AND_PRODUCTION_MIGRATION.md
 *
 * This file consolidates all curated placeholder and demo data into structured,
 * production-ready datasets to be seeded into Supabase via Drizzle ORM (scripts/seed.ts)
 * or raw SQL (scripts/seed.sql).
 */

import { CandidateTalent, RecruiterJob, InterviewInvitation } from '../lib/recruiter-data';
import { FeedPost } from '../lib/feed-data';
import { BracketMember, WeeklyChallenge } from '../lib/league-data';
import { CoachQuestion } from '../lib/coach-data';

export interface LeaderboardRosterEntry {
  rank: number;
  name: string;
  username: string;
  institutionOrCountry: string;
  streakDays: number;
  scoreXp: number;
  rankChange: number;
  isCurrentUser?: boolean;
  avatarBg: string;
  topBadge: string;
}

export interface CoursePackSeed {
  slug: string;
  title: string;
  companyName: string;
  badgeName: string;
  badgeIcon: string;
  description: string;
  modulesCount: number;
}

// ---------------------------------------------------------------------------
// 1. COURSE PACKS (Company Curriculum)
// ---------------------------------------------------------------------------
export const SEED_COURSE_PACKS: CoursePackSeed[] = [
  {
    slug: 'google-ai-pack',
    title: 'Google AI Pack',
    companyName: 'Google',
    badgeName: 'Gemma & TPU Master',
    badgeIcon: '🔥',
    description: 'Attention mechanisms, Gemma fine-tuning, TPU parallelization, and Vertex AI pipelines.',
    modulesCount: 5,
  },
  {
    slug: 'nvidia-ai-pack',
    title: 'NVIDIA AI Pack',
    companyName: 'NVIDIA',
    badgeName: 'CUDA & TensorRT Specialist',
    badgeIcon: '🔥',
    description: 'CUDA kernels, model quantization (AWQ/FP8), TensorRT acceleration, and Triton Inference Server.',
    modulesCount: 6,
  },
  {
    slug: 'openai-pack',
    title: 'OpenAI Pack',
    companyName: 'OpenAI',
    badgeName: 'Function Calling & Agent Architect',
    badgeIcon: '?',
    description: 'Tool use, agentic JSON schema calling, embedding fine-tuning, and structured reasoning.',
    modulesCount: 4,
  },
  {
    slug: 'microsoft-ai-pack',
    title: 'Microsoft AI Pack',
    companyName: 'Microsoft',
    badgeName: 'Semantic Kernel Architect',
    badgeIcon: '🔥',
    description: 'Azure AI Studio, Semantic Kernel agents, multi-agent orchestration, and Copilot patterns.',
    modulesCount: 5,
  },
  {
    slug: 'amazon-ai-pack',
    title: 'Amazon AI Pack',
    companyName: 'Amazon AWS',
    badgeName: 'Bedrock & SageMaker Specialist',
    badgeIcon: '🔥',
    description: 'AWS Bedrock foundation models, SageMaker distributed training, and serverless LLM deployment.',
    modulesCount: 5,
  },
];

// ---------------------------------------------------------------------------
// 2. CANDIDATE TALENT POOL & PROFILES
// ---------------------------------------------------------------------------
export const SEED_CANDIDATE_TALENT: CandidateTalent[] = [
  {
    id: 'cand-1',
    fullName: 'Aarav Sharma',
    headline: 'Inference Acceleration & Kernel Optimization Specialist',
    collegeOrCompany: 'IIT Bombay',
    region: 'Maharashtra',
    avatarBg: 'bg-emerald-500/20 text-emerald-500',
    leagueTier: 'architect',
    leaguePoints: 2420,
    weeklyRank: 1,
    streakDays: 28,
    verifiedBadges: ['RAG Master', 'NVIDIA TensorRT Specialist', 'Vector Wizard'],
    reportCard: {
      knowledgeScore: 9.8,
      confidenceScore: 9.4,
      communicationScore: 9.2,
      examplesScore: 9.6,
      industryLevelScore: 9.7,
      overallScore: 9.5,
      speechMetrics: {
        wordsPerMinute: 142,
        fillerCount: 1,
        paceRating: 'Natural & Confident',
        totalInterviews: 34,
      },
      strengths: [
        'Precise mathematical explanation of KV-cache PagedAttention memory mechanics',
        'Deep intuition for FP8 scaling factors and TensorRT-LLM engine compilation',
        'Zero hesitation when architecting hybrid lexical + dense search pipelines',
      ],
      improvementAreas: [
        'Can elaborate further on multi-node InfiniBand NCCL collective communication bottlenecks',
      ],
      recentModelAnswerExcerpt:
        '“PagedAttention partitions the continuous physical KV-cache memory into non-contiguous blocks, preventing internal fragmentation from variable-length sequence generation and increasing throughput by 3.8x under high batch concurrency.”',
    },
    resume: {
      overallAtsScore: 96,
      targetRole: 'AI Systems Engineer (Inference)',
      summary:
        'Final-year CS undergrad at IIT Bombay with hands-on experience compiling custom Triton kernels and deploying Llama-3-70B on 8x H100 SXM5 nodes with TensorRT-LLM.',
      skills: {
        frameworks: ['PyTorch 2.4', 'Triton', 'TensorRT-LLM', 'vLLM', 'CUDA C++'],
        models: ['Llama-3', 'DeepSeek-R1', 'Mistral-Large', 'CLIP'],
        infrastructure: ['Kubernetes', 'Slurm', 'Docker', 'Ray Train', 'Prometheus'],
        retrieval: ['pgvector (HNSW)', 'Qdrant', 'Cohere Rerank', 'BM25'],
      },
      projects: [
        {
          title: 'Custom FlashAttention-3 Kernel for FP8 Forward Pass',
          description: 'Wrote specialized CUDA/Triton warp-specialized kernels targeting Hopper Tensor Memory Accelerator (TMA).',
          impact: 'Achieved 820 TFLOPs throughput on H100 with 31% latency reduction over standard torch.compile.',
        },
        {
          title: 'Sub-40ms Financial SEC-10K Hybrid RAG Pipeline',
          description: 'Integrated recursive hierarchical chunking with Cohere reranking and pgvector HNSW indexing.',
          impact: 'Zero retrieval failures on 10,000 regulatory documents with 38ms P95 latency.',
        },
      ],
    },
    contactEmail: 'aarav.sharma@cse.iitb.ac.in',
    githubUrl: 'https://github.com/aarav-ai-kernels',
    linkedinUrl: 'https://linkedin.com/in/aarav-sharma-ai',
  },
  {
    id: 'cand-2',
    fullName: 'Priya Patel',
    headline: 'Agentic Workflows & Multi-Hop RAG Systems Lead',
    collegeOrCompany: 'BITS Pilani',
    region: 'Rajasthan',
    avatarBg: 'bg-primary/20 text-primary',
    leagueTier: 'diamond',
    leaguePoints: 1840,
    weeklyRank: 2,
    streakDays: 21,
    verifiedBadges: ['RAG Master', 'Agent Architect', 'Vector Wizard', '7-Day Flame Streak'],
    reportCard: {
      knowledgeScore: 9.3,
      confidenceScore: 9.1,
      communicationScore: 9.5,
      examplesScore: 9.2,
      industryLevelScore: 9.3,
      overallScore: 9.3,
      speechMetrics: {
        wordsPerMinute: 138,
        fillerCount: 2,
        paceRating: 'Natural & Confident',
        totalInterviews: 29,
      },
      strengths: [
        'Exceptional structured communication using the STAR framework',
        'Mastery of ReAct decision loops and JSON schema deterministic tool calling',
        'Concrete understanding of evaluation metrics (RAGAS Faithfulness & Answer Relevance)',
      ],
      improvementAreas: [
        'Deeper exploration of speculative decoding trade-offs under high network jitter',
      ],
      recentModelAnswerExcerpt:
        '“In our production agent loop, we enforce JSON schema validation at the inference layer with structured decoding masks to eliminate hallucinated function arguments entirely.”',
    },
    resume: {
      overallAtsScore: 94,
      targetRole: 'Agent Architect & LLM Engineer',
      summary:
        'Senior at BITS Pilani specializing in autonomous multi-agent pipelines, LangGraph graph-based orchestration, and self-healing SQL generation agents.',
      skills: {
        frameworks: ['LangGraph', 'LlamaIndex', 'PyTorch', 'FastAPI', 'Pydantic V2'],
        models: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemma-2-9B', 'DeepSeek-Coder'],
        infrastructure: ['AWS Bedrock', 'Vercel AI SDK', 'Docker', 'PostgreSQL'],
        retrieval: ['Milvus', 'pgvector', 'Pinecone', 'Cross-Encoder Rerankers'],
      },
      projects: [
        {
          title: 'Autonomous Multi-Agent Enterprise Data Analyst',
          description: 'Orchestrated 4 specialized agents (Planner, Query Generator, Execution Guard, Chart Synthesizer) with LangGraph.',
          impact: 'Eliminated invalid SQL execution by 99.4% across 50,000 queries.',
        },
        {
          title: 'RAG Triad Evaluator with Synthetic Ground Truth',
          description: 'Built automated test harness evaluating Context Relevance, Groundedness, and Answer Relevance using RAGAS.',
          impact: 'Cut prompt engineering iteration cycles from 3 days to 4 hours.',
        },
      ],
    },
    contactEmail: 'priya.patel@pilani.bits-pilani.ac.in',
    githubUrl: 'https://github.com/priya-agentic',
    linkedinUrl: 'https://linkedin.com/in/priya-patel-agents',
  },
  {
    id: 'cand-3',
    fullName: 'Rohan Deshmukh',
    headline: 'High-Throughput Distributed Training & FSDP Engineer',
    collegeOrCompany: 'IIIT Hyderabad',
    region: 'Telangana',
    avatarBg: 'bg-cyan-500/20 text-cyan-500',
    leagueTier: 'diamond',
    leaguePoints: 1690,
    weeklyRank: 3,
    streakDays: 17,
    verifiedBadges: ['NVIDIA TensorRT Specialist', 'Vector Wizard'],
    reportCard: {
      knowledgeScore: 9.4,
      confidenceScore: 8.9,
      communicationScore: 8.8,
      examplesScore: 9.5,
      industryLevelScore: 9.1,
      overallScore: 9.1,
      speechMetrics: {
        wordsPerMinute: 132,
        fillerCount: 3,
        paceRating: 'Natural & Confident',
        totalInterviews: 22,
      },
      strengths: [
        'Deep operational familiarity with PyTorch FSDP-2 and DeepSpeed ZeRO-3',
        'Extensive knowledge of NCCL ring-allreduce communication overheads',
        'Strong production incident debugging experience with GPU OOMs and gradient spikes',
      ],
      improvementAreas: [
        'Can speed up speaking cadence slightly when explaining basic mathematical proofs',
      ],
      recentModelAnswerExcerpt:
        '“When scaling FSDP across 32 nodes, gradient bucket sizing and prefetching forward communication while overlapping backward computation prevents NCCL collective stalls on 100GbE NICs.”',
    },
    resume: {
      overallAtsScore: 92,
      targetRole: 'Distributed Systems & ML Training Engineer',
      summary:
        'Dual Degree researcher at IIIT Hyderabad focusing on large-scale distributed pre-training, parameter-efficient fine-tuning (LoRA/QLoRA), and CUDA synchronization debugging.',
      skills: {
        frameworks: ['PyTorch Distributed', 'DeepSpeed', 'Megatron-LM', 'vLLM', 'HuggingFace Accelerate'],
        models: ['Llama-3-8B', 'Mistral-7B', 'Phi-3-Mini', 'Whisper-Large'],
        infrastructure: ['Slurm Cluster', 'Kubernetes', 'NVIDIA Nsight Systems', 'Grafana'],
        retrieval: ['FAISS', 'pgvector', 'ChromaDB'],
      },
      projects: [
        {
          title: '32-GPU Distributed Continual Pre-Training Pipeline',
          description: 'Configured Megatron-DeepSpeed 3D parallelism (Tensor, Pipeline, and ZeRO-3) for Indic bilingual tokenizers.',
          impact: 'Sustained 58% Model FLOPs Utilization (MFU) on A100 SXM4 cluster without crash for 14 days.',
        },
      ],
    },
    contactEmail: 'rohan.deshmukh@research.iiit.ac.in',
    githubUrl: 'https://github.com/rohan-distributed-ml',
    linkedinUrl: 'https://linkedin.com/in/rohan-deshmukh-ai',
  },
  {
    id: 'cand-4',
    fullName: 'Ananya Iyer',
    headline: 'Multimodal Vision-Language & Real-Time Edge AI Engineer',
    collegeOrCompany: 'IIT Delhi',
    region: 'Delhi NCR',
    avatarBg: 'bg-chart-4/20 text-chart-4',
    leagueTier: 'gold',
    leaguePoints: 890,
    weeklyRank: 8,
    streakDays: 14,
    verifiedBadges: ['RAG Master', '7-Day Flame Streak'],
    reportCard: {
      knowledgeScore: 8.8,
      confidenceScore: 8.7,
      communicationScore: 8.9,
      examplesScore: 8.6,
      industryLevelScore: 8.8,
      overallScore: 8.8,
      speechMetrics: {
        wordsPerMinute: 145,
        fillerCount: 2,
        paceRating: 'Natural & Confident',
        totalInterviews: 18,
      },
      strengths: [
        'Clear explanations of CLIP zero-shot embedding spaces and ViT patch embeddings',
        'Expertise in ONNX Runtime and INT8 post-training quantization for edge devices',
      ],
      improvementAreas: [
        'Expand examples in large-scale vector similarity indexing and HNSW graph tuning',
      ],
      recentModelAnswerExcerpt:
        '“By distilling ViT-Large into a quantized MobileNetV4 backbone with cross-attention projector tokens, we reduced mobile edge inference latency from 180ms to 19ms on Snapdragon NPU.”',
    },
    resume: {
      overallAtsScore: 89,
      targetRole: 'Computer Vision & Multimodal Engineer',
      summary:
        'Undergraduate researcher at IIT Delhi building real-time vision-language models, YOLOv11 object tracking, and embedded TensorRT models for autonomous drones.',
      skills: {
        frameworks: ['PyTorch', 'TorchVision', 'ONNX Runtime', 'OpenCV', 'TensorRT'],
        models: ['YOLOv11', 'RT-DETR', 'CLIP', 'LLaVA-1.5', 'MobileNetV4'],
        infrastructure: ['Docker', 'NVIDIA Jetson AGX Orin', 'C++20', 'Linux'],
        retrieval: ['Milvus Lite', 'FAISS'],
      },
      projects: [
        {
          title: 'Sub-25ms Real-Time VLM for Jetson Orin Edge Robotics',
          description: 'Quantized LLaVA vision projector with 4-bit AWQ and deployed via TensorRT-LLM on Jetson Orin Nano.',
          impact: 'Achieved 38 FPS live object reasoning with less than 15W power envelope.',
        },
      ],
    },
    contactEmail: 'ananya.iyer@ee.iitd.ac.in',
    githubUrl: 'https://github.com/ananya-edge-vlm',
    linkedinUrl: 'https://linkedin.com/in/ananya-iyer-cv',
  },
  {
    id: 'cand-5',
    fullName: 'Kavya Nair',
    headline: 'Post-Training, DPO Alignment & Synthetic Data Lead',
    collegeOrCompany: 'DTU (Delhi Tech University)',
    region: 'Delhi NCR',
    avatarBg: 'bg-chart-2/20 text-chart-2',
    leagueTier: 'gold',
    leaguePoints: 820,
    weeklyRank: 11,
    streakDays: 12,
    verifiedBadges: ['Agent Architect', 'Vector Wizard'],
    reportCard: {
      knowledgeScore: 8.7,
      confidenceScore: 8.5,
      communicationScore: 8.8,
      examplesScore: 8.5,
      industryLevelScore: 8.6,
      overallScore: 8.6,
      speechMetrics: {
        wordsPerMinute: 136,
        fillerCount: 4,
        paceRating: 'Natural & Confident',
        totalInterviews: 16,
      },
      strengths: [
        'Lucid description of Direct Preference Optimization (DPO) vs PPO reward modeling',
        'Strong knowledge of synthetic data generation with self-instruct filtering loops',
      ],
      improvementAreas: [
        'Could include more quantitative benchmarks on catastrophic forgetting during SFT',
      ],
      recentModelAnswerExcerpt:
        '“DPO derives an analytical solution to the KL-constrained RLHF objective directly through the implicit reward function, removing the unstable reward model and critic training phases completely.”',
    },
    resume: {
      overallAtsScore: 87,
      targetRole: 'Post-Training & LLM Alignment Specialist',
      summary:
        'DTU Computer Science final-year engineer researching automated preference dataset curation, rejection sampling, and GRPO reasoning models.',
      skills: {
        frameworks: ['TRL (Transformer Reinforcement Learning)', 'PyTorch', 'Unsloth', 'Axolotl'],
        models: ['Llama-3.1', 'Gemma-2', 'Qwen-2.5-Coder', 'Mistral-Nemo'],
        infrastructure: ['HuggingFace Hub', 'Weights & Biases', 'RunPod', 'Docker'],
        retrieval: ['pgvector', 'Qdrant'],
      },
      projects: [
        {
          title: 'Curated 100k Indic Code Reasoning Dataset with Self-Correction',
          description: 'Automated synthetic verification loop using compiler AST checks and test-case execution filters.',
          impact: 'Improved Humaneval-Python benchmark on 8B model by +14.2% after DPO alignment.',
        },
      ],
    },
    contactEmail: 'kavya.nair@dtu.ac.in',
    githubUrl: 'https://github.com/kavya-dpo-indic',
    linkedinUrl: 'https://linkedin.com/in/kavya-nair-alignment',
  },
  {
    id: 'cand-6',
    fullName: 'Vikramaditya Rao',
    headline: 'High-Concurrency Vector Databases & Retrieval Architect',
    collegeOrCompany: 'NIT Surathkal',
    region: 'Karnataka',
    avatarBg: 'bg-chart-5/20 text-chart-5',
    leagueTier: 'silver',
    leaguePoints: 440,
    weeklyRank: 19,
    streakDays: 9,
    verifiedBadges: ['Vector Wizard'],
    reportCard: {
      knowledgeScore: 8.2,
      confidenceScore: 7.9,
      communicationScore: 8.1,
      examplesScore: 8.3,
      industryLevelScore: 8.1,
      overallScore: 8.1,
      speechMetrics: {
        wordsPerMinute: 128,
        fillerCount: 5,
        paceRating: 'Natural & Confident',
        totalInterviews: 11,
      },
      strengths: [
        'Detailed comparison of HNSW M & efConstruction parameters for recall vs memory',
        'Solid database indexing background with PostgreSQL and columnar storage',
      ],
      improvementAreas: [
        'Work on reducing filler words (um, basically) during open-ended architectural prompts',
      ],
      recentModelAnswerExcerpt:
        '“For 50 million vector collections, IVFFlat with scalar quantization (SQ8) provides a 4x reduction in RAM footprint over HNSW while retaining 93% top-10 recall with suitable nprobe tuning.”',
    },
    resume: {
      overallAtsScore: 83,
      targetRole: 'Data Systems & Vector Search Engineer',
      summary:
        'Systems builder at NIT Surathkal with deep interest in approximate nearest neighbor (ANN) search algorithms, distributed databases, and vector search acceleration.',
      skills: {
        frameworks: ['pgvector', 'Qdrant', 'Milvus', 'Faiss', 'Go', 'Python'],
        models: ['text-embedding-3-large', 'BGE-M3', 'Nomic-Embed'],
        infrastructure: ['PostgreSQL 16', 'Redis', 'Docker', 'Grafana'],
        retrieval: ['Hybrid Search', 'Reciprocal Rank Fusion (RRF)', 'BM25'],
      },
      projects: [
        {
          title: 'Distributed Vector Cache Layer with Sub-5ms P99 Latency',
          description: 'Wrote Go-based proxy caching frequent query vector neighborhoods with LSH filtering.',
          impact: 'Cut vector DB query costs by 48% across 2M daily semantic search queries.',
        },
      ],
    },
    contactEmail: 'vikram.rao@nitk.edu.in',
    githubUrl: 'https://github.com/vikram-ann-systems',
    linkedinUrl: 'https://linkedin.com/in/vikramaditya-rao-systems',
  },
];

// ---------------------------------------------------------------------------
// 3. JOB POSTINGS & INVITATIONS
// ---------------------------------------------------------------------------
export const SEED_JOB_POSTINGS: RecruiterJob[] = [
  {
    id: 'job-1',
    companyName: 'NVIDIA India',
    companyLogo: '🟢',
    title: 'Senior AI Inference Systems Engineer',
    roleCategory: 'AI Systems & Inference',
    location: 'Bengaluru, Karnataka (Hybrid)',
    salaryRange: '₹32,00,000 - ₹48,00,000 CTC',
    minLeagueTier: 'diamond',
    requiredBadges: ['NVIDIA TensorRT Specialist'],
    minReportScore: 8.5,
    applicantsCount: 14,
    postedDate: '3 days ago',
    description:
      'We are looking for an AI Systems Engineer to optimize TensorRT-LLM and Triton Inference Server deployments for frontier reasoning models. You will profile GPU kernels, implement FP8/AWQ quantization, and reduce P99 token-to-first-token latency.',
    isActive: true,
  },
  {
    id: 'job-2',
    companyName: 'Google DeepMind',
    companyLogo: '🔵',
    title: 'Research Engineer - Post-Training & Reasoning',
    roleCategory: 'GenAI & LLM',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    salaryRange: '₹38,00,000 - ₹55,00,000 CTC',
    minLeagueTier: 'architect',
    requiredBadges: ['Agent Architect', 'RAG Master'],
    minReportScore: 9.0,
    applicantsCount: 9,
    postedDate: 'Yesterday',
    description:
      'Join our team scaling Gemma and next-gen reasoning models. You will architect multi-step reinforcement learning from verifiable rewards (RLVR), self-consistency decoding, and structured agent execution loops.',
    isActive: true,
  },
  {
    id: 'job-3',
    companyName: 'Sarvam AI',
    companyLogo: '🟧',
    title: 'Full-Stack Agent & RAG Architect',
    roleCategory: 'Agent Architect',
    location: 'Bengaluru, Karnataka (On-Site)',
    salaryRange: '₹26,00,000 - ₹42,00,000 CTC',
    minLeagueTier: 'gold',
    requiredBadges: ['RAG Master', 'Vector Wizard'],
    minReportScore: 8.0,
    applicantsCount: 22,
    postedDate: '5 days ago',
    description:
      'Building sovereign Indic AI agents for 1.4 billion people. You will design ultra-low latency voice-to-voice pipelines, hybrid search RAG over vernacular databases, and autonomous banking action workflows.',
    isActive: true,
  },
  {
    id: 'job-4',
    companyName: 'Microsoft AI India',
    companyLogo: '🟦',
    title: 'Distributed Pre-Training & PyTorch Core Engineer',
    roleCategory: 'Distributed Training & CUDA',
    location: 'Hyderabad, Telangana (Hybrid)',
    salaryRange: '₹34,00,000 - ₹50,00,000 CTC',
    minLeagueTier: 'diamond',
    requiredBadges: ['NVIDIA TensorRT Specialist'],
    minReportScore: 8.8,
    applicantsCount: 11,
    postedDate: '1 week ago',
    description:
      'Scale Azure AI supercomputing infrastructure. Focus on PyTorch FSDP-2, InfiniBand NCCL collective tuning, CUDA memory defragmentation, and fault-tolerant checkpointing for trillion-parameter clusters.',
    isActive: true,
  },
];

export const SEED_INVITATIONS: InterviewInvitation[] = [
  {
    id: 'inv-101',
    candidateId: 'cand-1',
    candidateName: 'Aarav Sharma',
    companyName: 'Google DeepMind',
    roleTitle: 'Research Engineer - Post-Training & Reasoning',
    roundType: 'Systems Architecture',
    customNote:
      'Hi Aarav, our DeepMind team was blown away by your 9.5 AIgnite Report Card and your TMA warp-specialized CUDA kernel benchmarks. We would love to fast-track you directly to our Principal Systems round.',
    status: 'Scheduled',
    sentAt: 'Yesterday at 3:15 PM',
  },
  {
    id: 'inv-102',
    candidateId: 'cand-2',
    candidateName: 'Priya Patel',
    companyName: 'Sarvam AI',
    roleTitle: 'Full-Stack Agent & RAG Architect',
    roundType: 'Coding & Live Inference',
    customNote:
      'Priya, your verified Agent Architect badge and multi-agent LangGraph SQL benchmark fits our Indic agents mission perfectly. Let’s connect this Thursday.',
    status: 'Accepted',
    sentAt: '2 days ago',
  },
];

// ---------------------------------------------------------------------------
// 4. FEED POSTS & EMBEDDED QUIZZES
// ---------------------------------------------------------------------------
export const SEED_FEED_POSTS: FeedPost[] = [
  {
    id: 'deepseek-r1-grpo',
    title: 'DeepSeek-R1: Pure RL Reasoning Emergence via GRPO',
    summary:
      'DeepSeek-R1 demonstrates that high-order mathematical and algorithmic reasoning can emerge purely through large-scale reinforcement learning without human warm-up data. By ditching standard PPO for Group Relative Policy Optimization (GRPO), it eliminates the memory-heavy value network.',
    keyTakeaway:
      'Rule of thumb: In post-training reasoning pipelines, GRPO slashes training GPU memory footprint by ~60% by calculating rewards relative to sampled group outputs rather than maintaining a separate critic model.',
    sourceName: 'DeepSeek AI Research',
    sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    category: 'Agents & RL',
    tagBadge: 'LLM Post-Training',
    readTime: '1 min read',
    likesCount: 342,
    metrics: [
      { label: 'VRAM Savings', value: '~60%' },
      { label: 'Critic Memory', value: '0 GB (Eliminated)' },
      { label: 'AIME 2024 Score', value: '79.8% (Pass@1)' },
    ],
    diagramComparison: {
      before: 'PPO: Actor + Critic (2x Model VRAM)',
      after: 'GRPO: Actor + Group Relative Norm',
      advantage: 'Bypasses training a separate value critic network',
    },
    quiz: {
      id: 'quiz-deepseek-r1',
      postId: 'deepseek-r1-grpo',
      questionText: 'Why does GRPO save ~60% VRAM compared to standard PPO during RL?',
      options: [
        'A) Uses 4-bit Quantized Weights to compress the KV-cache',
        'B) Eliminates the Critic/Value Model entirely via relative group scoring',
        'C) Truncates prompt context length to sub-2048 tokens',
      ],
      correctOptionIndex: 1,
      explanation:
        'Correct! GRPO compares outputs against the average reward of a sampled group of completions, completely eliminating the need to train and store a secondary value critic model.',
      pointsAwarded: 5,
    },
    createdAt: '2 hours ago',
  },
  {
    id: 'vllm-paged-attention',
    title: 'vLLM PagedAttention: Eradicating KV-Cache Memory Fragmentation',
    summary:
      'In conventional LLM serving, 60% to 80% of GPU memory is lost to fragmentation because KV-caches are allocated contiguously for maximum sequence lengths. Inspired by operating system virtual memory paging, PagedAttention stores non-contiguous tokens in dynamic physical blocks.',
    keyTakeaway:
      'Rule of thumb: PagedAttention reduces KV-cache memory waste from >60% to under 4%, unlocking 2x to 4x higher serving throughput on identical GPU hardware.',
    sourceName: 'vLLM Project / UC Berkeley',
    sourceUrl: 'https://github.com/vllm-project/vllm',
    category: 'Inference & Infra',
    tagBadge: 'Inference Optimization',
    readTime: '2 min read',
    likesCount: 512,
    metrics: [
      { label: 'Memory Waste', value: '<4% (vs 60-80%)' },
      { label: 'Serving Throughput', value: '2-4x Boost' },
      { label: 'Key Innovation', value: 'OS-style Paging' },
    ],
    diagramComparison: {
      before: 'Contiguous Allocation (Over-allocated & Fragmented)',
      after: 'Paged Blocks (Dynamic non-contiguous allocation)',
      advantage: 'Near-zero internal memory fragmentation',
    },
    quiz: {
      id: 'quiz-vllm-paged',
      postId: 'vllm-paged-attention',
      questionText: 'How does PagedAttention eliminate memory fragmentation during continuous batching?',
      options: [
        'A) By dropping old prompt tokens when context exceeds 4k',
        'B) By partitioning dynamic KV-cache into fixed-size virtual blocks mapped to physical memory',
        'C) By sharing weights between the encoder and decoder heads',
      ],
      correctOptionIndex: 1,
      explanation:
        'Correct! PagedAttention adapts OS virtual memory paging, allowing tokens in the KV-cache to reside in non-contiguous physical blocks and eliminating over-allocation.',
      pointsAwarded: 5,
    },
    createdAt: '4 hours ago',
  },
  {
    id: 'flashattention-3-hopper',
    title: 'FlashAttention-3: Async FP8 Tensor Cores & Warp Specialization',
    summary:
      'FlashAttention-3 unleashes Hopper architecture (H100/H200) capabilities by overlapping memory transfers with tensor core computation. By utilizing the Tensor Memory Accelerator (TMA) and Warp Specialization, it reaches up to 75% of theoretical peak FP8 TFLOPs.',
    keyTakeaway:
      'Rule of thumb: Hardware-aware algorithms must decouple compute warps from memory-loading warps to hide memory latency on modern GPU microarchitectures.',
    sourceName: 'Tri Dao / Princeton AI',
    sourceUrl: 'https://tridao.me/blog/2024/flashdecoding/',
    category: 'Inference & Infra',
    tagBadge: 'Kernel Engineering',
    readTime: '2 min read',
    likesCount: 428,
    metrics: [
      { label: 'Speedup over FA-2', value: '1.5x - 2.0x' },
      { label: 'FP8 Utilization', value: '~75% Peak H100 TFLOPs' },
      { label: 'Core Mechanism', value: 'Warp Specialization' },
    ],
    diagramComparison: {
      before: 'FA-2: Synchronous GMEM -> SMEM -> Tensor Cores',
      after: 'FA-3: Async TMA loads + Producer-Consumer Warps',
      advantage: 'Hides global memory latency entirely behind math',
    },
    quiz: {
      id: 'quiz-flash-3',
      postId: 'flashattention-3-hopper',
      questionText: 'What hardware architectural feature in NVIDIA Hopper enables FA-3 asynchronous loads?',
      options: [
        'A) Tensor Memory Accelerator (TMA) for direct global-to-shared memory transfers',
        'B) Software emulation of FP32 floating point operations',
        'C) Complete elimination of SRAM scratchpad memory',
      ],
      correctOptionIndex: 0,
      explanation:
        'Correct! Hopper’s hardware TMA allows copying data directly from global HBM memory into shared memory asynchronously without using register file bandwidth.',
      pointsAwarded: 5,
    },
    createdAt: '7 hours ago',
  },
  {
    id: 'speculative-decoding',
    title: 'Speculative Decoding: Breaking the Memory-Bandwidth Bottleneck',
    summary:
      'LLM inference is fundamentally memory-bandwidth bound: loading 70B weights for every single token forward pass wastes GPU compute. Speculative decoding uses a lightweight draft model to speculate multiple tokens, which the target model verifies in a single parallel step.',
    keyTakeaway:
      'Rule of thumb: Speculative decoding yields 2x to 3x wall-clock latency reduction while preserving 100% mathematical equivalence to the target model output.',
    sourceName: 'Google Research / DeepMind',
    sourceUrl: 'https://arxiv.org/abs/2211.17192',
    category: 'Inference & Infra',
    tagBadge: 'Latency Reduction',
    readTime: '1 min read',
    likesCount: 389,
    metrics: [
      { label: 'Latency Gain', value: '2-3x Lower P95' },
      { label: 'Distribution Fidelity', value: '100% Exact Match' },
      { label: 'Verification Cost', value: '1 Forward Pass for K tokens' },
    ],
    diagramComparison: {
      before: 'Sequential Target: K forward passes for K tokens',
      after: 'Draft (Fast K tokens) + Target 1-pass verification',
      advantage: 'Decouples token latency from target model weight reading',
    },
    quiz: {
      id: 'quiz-spec-dec',
      postId: 'speculative-decoding',
      questionText: 'Why does speculative decoding maintain identical output distributions to the target model?',
      options: [
        'A) The draft model is larger and more accurate than the target model',
        'B) The target model validates draft tokens in parallel using modified rejection sampling',
        'C) Tokens are selected purely by temperature=0 greedy search',
      ],
      correctOptionIndex: 1,
      explanation:
        'Correct! A modified rejection sampling scheme mathematically ensures that the accepted token distribution strictly matches sampling directly from the larger target model.',
      pointsAwarded: 5,
    },
    createdAt: '12 hours ago',
  },
  {
    id: 'qlora-4bit-tuning',
    title: 'QLoRA: 4-bit NormalFloat (NF4) & Double Quantization',
    summary:
      'QLoRA democratized fine-tuning by allowing 65B+ parameter LLMs to be tuned on a single 48GB GPU. It introduces NormalFloat 4 (NF4)-an information-theoretically optimal quant type for normally distributed weights-plus Double Quantization to save memory on quant constants.',
    keyTakeaway:
      'Rule of thumb: When fine-tuning massive models on constrained hardware, QLoRA reduces memory by ~75% without compromising 16-bit baseline benchmark scores.',
    sourceName: 'Tim Dettmers / UW NLP',
    sourceUrl: 'https://github.com/artidoro/qlora',
    category: 'GenAI & LLMs',
    tagBadge: 'Quantization & PEFT',
    readTime: '2 min read',
    likesCount: 610,
    metrics: [
      { label: 'VRAM Required', value: '48 GB (vs 160 GB)' },
      { label: 'Quantization Type', value: 'NF4 (Information Optimal)' },
      { label: 'Accuracy Drop', value: '<0.3% on MMLU' },
    ],
    diagramComparison: {
      before: 'Full 16-bit Tuning: 4x A100 (80GB) required',
      after: 'NF4 Base Model + FP16 LoRA Adapters: 1x GPU',
      advantage: 'Freezes 4-bit base weights, backprops through adapters only',
    },
    quiz: {
      id: 'quiz-qlora',
      postId: 'qlora-4bit-tuning',
      questionText: 'Why is NF4 (NormalFloat 4) optimal for quantizing neural network weight tensors?',
      options: [
        'A) Neural network weights naturally follow a normal distribution centered at zero',
        'B) It converts all matrix multiplications into simple integer additions',
        'C) It forces all activations to be purely positive values',
      ],
      correctOptionIndex: 0,
      explanation:
        'Correct! Because pre-trained neural network weights typically exhibit zero-mean normal distributions, NF4 divides quantile bins with equal probability mass, maximizing theoretical information retention.',
      pointsAwarded: 5,
    },
    createdAt: '1 day ago',
  },
  {
    id: 'mixture-of-experts-moe',
    title: 'Mixture of Experts: Decoupling Parameter Capacity from Compute',
    summary:
      'Sparse Mixture of Experts (MoE) architectures, popularized by Mixtral 8x7B, solve the parameter scaling bottleneck. Instead of activating all feed-forward network (FFN) layers for every token, a routing gating network activates only the Top-2 experts per token.',
    keyTakeaway:
      'Rule of thumb: MoE enables models to hold 40B+ parameters of knowledge while running with the compute cost and inference latency of a 13B dense model.',
    sourceName: 'Mistral AI Research',
    sourceUrl: 'https://mistral.ai/news/mixtral-of-experts/',
    category: 'GenAI & LLMs',
    tagBadge: 'Model Architecture',
    readTime: '2 min read',
    likesCount: 472,
    metrics: [
      { label: 'Total Params', value: '46.7B' },
      { label: 'Active Params/Token', value: '12.9B' },
      { label: 'Routing Mechanism', value: 'Top-2 Softmax Gating' },
    ],
    diagramComparison: {
      before: 'Dense Transformer: All 47B params active per token',
      after: 'Sparse MoE: Only 2 of 8 experts active per token',
      advantage: 'Massive pre-training capacity with low token latency',
    },
    quiz: {
      id: 'quiz-moe',
      postId: 'mixture-of-experts-moe',
      questionText: 'In a Sparse MoE (like Mixtral 8x7B), what decides which experts compute a given token?',
      options: [
        'A) A lightweight learned Gating/Router network with softmax over expert weights',
        'B) A static round-robin fixed assignment scheduler',
        'C) The total number of tokens currently in the prompt',
      ],
      correctOptionIndex: 0,
      explanation:
        'Correct! A learned router layer takes the token representation, outputs logits across all experts, and selects the Top-k experts with the highest softmax affinity.',
      pointsAwarded: 5,
    },
    createdAt: '1 day ago',
  },
  {
    id: 'agentic-tool-use-react',
    title: 'Agentic Tool Loops: ReAct with Structured JSON Schema Validation',
    summary:
      'Autonomous AI agents often hallucinate when attempting complex multi-step reasoning in a single pass. The ReAct (Reason + Act) loop couples chain-of-thought traces with tool executions, passing real environment observations back into context before subsequent actions.',
    keyTakeaway:
      'Rule of thumb: Production agent reliability depends on strict JSON schema enforcement (Zod/Pydantic) and finite-state guards against infinite loop hallucination.',
    sourceName: 'Yao et al. / Princeton & Google',
    sourceUrl: 'https://arxiv.org/abs/2210.03629',
    category: 'Agents & RL',
    tagBadge: 'Agent Architecture',
    readTime: '2 min read',
    likesCount: 319,
    metrics: [
      { label: 'Multi-hop Accuracy', value: '+42% vs Zero-Shot' },
      { label: 'Hallucination Rate', value: 'Reduced by 64%' },
      { label: 'Key Paradigm', value: 'Thought -> Action -> Observation' },
    ],
    diagramComparison: {
      before: 'Single Prompt: Model invents plausible tool outputs',
      after: 'ReAct Loop: Real tool execution injected into context',
      advantage: 'Grounds responses in deterministic external truth',
    },
    quiz: {
      id: 'quiz-react-loop',
      postId: 'agentic-tool-use-react',
      questionText: 'What prevents ungrounded hallucination loops in production AI agent systems?',
      options: [
        'A) Unbounded max_iterations parameters',
        'B) Structured schema validation with actual environment observations injected as feedback',
        'C) Disabling tool use entirely for multi-hop queries',
      ],
      correctOptionIndex: 1,
      explanation:
        'Correct! Validating tool arguments against schemas and requiring real tool outputs in the prompt prevents the model from fabricating hypothetical execution results.',
      pointsAwarded: 5,
    },
    createdAt: '2 days ago',
  },
  {
    id: 'clip-multimodal-alignment',
    title: 'Vision-Language Alignment: CLIP Contrastive InfoNCE Pre-training',
    summary:
      'OpenAI’s CLIP bridged the vision-language divide by training image and text encoders simultaneously on 400 million web image-caption pairs using a symmetric InfoNCE contrastive loss over mini-batch cosine similarity matrices.',
    keyTakeaway:
      'Rule of thumb: Contrastive multi-modal alignment scales better than classification heads because it learns a continuous shared embedding space across modalities.',
    sourceName: 'OpenAI Research',
    sourceUrl: 'https://arxiv.org/abs/2103.00020',
    category: 'Vision & Multimodal',
    tagBadge: 'Multimodal Systems',
    readTime: '2 min read',
    likesCount: 395,
    metrics: [
      { label: 'Zero-Shot ImageNet', value: '76.2% Top-1' },
      { label: 'Embedding Space', value: 'Shared 512-dim Vector' },
      { label: 'Loss Function', value: 'Symmetric InfoNCE' },
    ],
    diagramComparison: {
      before: 'Fixed-class ImageNet Classifier (1000 fixed labels)',
      after: 'Dual Encoders (Shared text-image cosine metric)',
      advantage: 'Zero-shot recognition of arbitrary concepts via text prompts',
    },
    quiz: {
      id: 'quiz-clip-loss',
      postId: 'clip-multimodal-alignment',
      questionText: 'What loss objective enables CLIP to align visual representations with natural language?',
      options: [
        'A) Symmetric Contrastive Cross-Entropy (InfoNCE) maximizing diagonal cosine similarity',
        'B) Mean Squared Error on raw pixel RGB values',
        'C) Binary classification of whether an image contains text',
      ],
      correctOptionIndex: 0,
      explanation:
        'Correct! Symmetric contrastive InfoNCE loss pulls matching image-text pairs close together while pushing non-matching pairs apart in the shared embedding space.',
      pointsAwarded: 5,
    },
    createdAt: '3 days ago',
  },
];

// ---------------------------------------------------------------------------
// 5. DAILY COACH QUESTIONS (POTD)
// ---------------------------------------------------------------------------
export const SEED_DAILY_COACH_QUESTIONS: CoachQuestion[] = [
  {
    id: 'coach-flashattention-3',
    forDate: '2026-09-09',
    title: 'FlashAttention-3 & Hardware-Aware Memory Hierarchy',
    topic: 'GPU Kernel Architecture',
    track: 'Inference & Infra',
    difficulty: 'Advanced',
    questionText:
      'Explain how FlashAttention-3 avoids HBM bandwidth bottlenecks on NVIDIA Hopper (H100). What role do asynchronous TMA (Tensor Memory Accelerator) and Warp Specialization play in reaching ~75% peak FP8 TFLOPs?',
    contextHint:
      'Mention global vs shared memory (HBM vs SRAM), the decoupling of producer and consumer warps, and how FP8 Tensor Cores overlap with data loading.',
    canonicalKeyPoints: [
      'Decouples memory loading warps (producers) from math computation warps (consumers) via Warp Specialization',
      'Uses Hopper Tensor Memory Accelerator (TMA) to copy data directly from global HBM into shared memory asynchronously without using register file bandwidth',
      'Overlaps asynchronous data movement with FP8 matrix multiplication to hide memory latency behind compute',
      'Recomputes attention softmax on the fly during the backward pass instead of storing quadratic attention matrices in HBM',
    ],
    suggestedModelAnswer:
      'FlashAttention-3 maximizes Hopper H100 hardware by tackling the fundamental memory bandwidth bottleneck in attention computation. In traditional attention, intermediate N-by-N attention matrices must be read from and written to high-bandwidth global memory (HBM), creating an IO bottleneck. FlashAttention-3 introduces Warp Specialization, which partitions GPU warps into dedicated producer warps-responsible for loading tiles from HBM-and consumer warps-responsible for executing Tensor Core matrix operations. By leveraging Hopper’s hardware Tensor Memory Accelerator (TMA), producer warps asynchronously transfer data directly into shared memory (SRAM) without consuming register file bandwidth. Simultaneously, consumer warps compute FP8 scaled dot-products. This total overlap of memory transfers with computation allows FlashAttention-3 to sustain up to 75% of theoretical peak FP8 TFLOPs.',
    estimatedSpeakingTime: '60-90 seconds',
  },
  {
    id: 'coach-grpo-reasoning',
    forDate: '2026-09-10',
    title: 'DeepSeek-R1 GRPO vs PPO for Post-Training RL',
    topic: 'Reinforcement Learning',
    track: 'Agents & RL',
    difficulty: 'Staff/Principal',
    questionText:
      'Compare Group Relative Policy Optimization (GRPO) used in DeepSeek-R1 with standard Proximal Policy Optimization (PPO). How does GRPO eliminate the value critic model, and what architectural tradeoffs emerge during RL training?',
    contextHint:
      'Focus on GPU VRAM savings, group relative scoring vs baseline value networks, and reward variance on mathematical/code tasks.',
    canonicalKeyPoints: [
      'Standard PPO requires maintaining a separate critic model of equal size to estimate state values, consuming massive GPU VRAM',
      'GRPO samples a group of outputs for each prompt and uses the mean and standard deviation of their group rewards as the baseline',
      'Eliminates the entire critic network, freeing approximately 60% of GPU memory during post-training RL',
      'Trades critic memory for increased output sampling per prompt, which works exceptionally well for deterministic verifiable rewards (math, coding)',
    ],
    suggestedModelAnswer:
      'In standard PPO, reinforcement learning requires two large models in GPU memory: the actor (policy) model and a critic (value) model of comparable size that estimates expected baseline returns. For 70B+ frontier models, this critic network doubles the memory footprint and communication overhead. DeepSeek-R1 introduces Group Relative Policy Optimization (GRPO) to eradicate the critic model entirely. Instead of predicting a state value with a secondary neural network, GRPO samples a group of diverse completions for each prompt, scores each output, and normalizes the reward relative to the group’s empirical mean and standard deviation. This slashes RL training memory by ~60%, allowing larger batch sizes or longer reasoning contexts. The architectural tradeoff is that GRPO requires sampling multiple trajectories per prompt, but for verifiable domains like mathematical proofs and programming unit tests, this group variance estimation is significantly more stable than an imperfect learned critic.',
    estimatedSpeakingTime: '60-90 seconds',
  },
  {
    id: 'coach-vllm-paged-attention',
    forDate: '2026-09-11',
    title: 'vLLM PagedAttention & Dynamic Batching',
    topic: 'LLM Serving & KV Cache',
    track: 'Inference & Infra',
    difficulty: 'Intermediate',
    questionText:
      'Why is the KV cache the primary memory bottleneck in high-throughput LLM serving? Explain how vLLM’s PagedAttention solves internal and external memory fragmentation inspired by OS virtual memory.',
    contextHint:
      'Explain contiguous memory over-allocation for max context lengths vs non-contiguous block tables.',
    canonicalKeyPoints: [
      'Traditional KV caches pre-allocate contiguous memory buffers for maximum sequence lengths, wasting 60-80% of memory on unused or fragmented tokens',
      'PagedAttention partitions dynamic KV caches into fixed-size physical blocks (e.g. 16 tokens per block) mapped via virtual block tables',
      'Enables non-contiguous memory allocation in physical GPU RAM, reducing memory waste to under 4%',
      'Unlocks 2x to 4x higher serving concurrency and seamless KV-cache sharing during parallel sampling and beam search',
    ],
    suggestedModelAnswer:
      'During auto-regressive decoding, the Key-Value (KV) cache grows dynamically with each generated token. In legacy inference systems, memory must be allocated contiguously in GPU VRAM for the maximum possible sequence length (e.g., 8k tokens) because future length cannot be known in advance. This causes massive internal fragmentation and memory reservation waste, often exceeding 60-80% of total GPU memory. PagedAttention solves this by adopting operating system virtual memory paging: it divides the KV cache into fixed-size virtual blocks (such as 16 tokens) that can reside in non-contiguous physical GPU memory blocks. A dynamic block table maps logical token positions to physical blocks on demand. This virtually eliminates memory fragmentation (dropping waste to under 4%), allowing GPUs to pack 2x to 4x more concurrent request streams on the exact same hardware.',
    estimatedSpeakingTime: '45-75 seconds',
  },
];

// ---------------------------------------------------------------------------
// 6. LEAGUE BRACKET & CHALLENGES
// ---------------------------------------------------------------------------
export const SEED_BRACKET_MEMBERS: BracketMember[] = [
  {
    id: 'mem-1',
    rank: 1,
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    collegeOrCompany: 'IIT Bombay',
    region: 'Maharashtra',
    weeklyPoints: 520,
    rankChange: 0,
    avatarBg: 'bg-emerald-500/20 text-emerald-500',
    badges: ['RAG Master', 'TensorRT Specialist'],
    streakDays: 14,
  },
  {
    id: 'mem-2',
    rank: 2,
    name: 'Priya Patel',
    username: 'priya_ml',
    collegeOrCompany: 'BITS Pilani',
    region: 'Rajasthan',
    weeklyPoints: 495,
    rankChange: 2,
    avatarBg: 'bg-primary/20 text-primary',
    badges: ['Agent Architect', 'Vector Wizard'],
    streakDays: 19,
  },
  {
    id: 'mem-3',
    rank: 3,
    name: 'Rohan Deshmukh',
    username: 'rohan_cuda',
    collegeOrCompany: 'IIIT Hyderabad',
    region: 'Telangana',
    weeklyPoints: 460,
    rankChange: 1,
    avatarBg: 'bg-cyan-500/20 text-cyan-500',
    badges: ['CUDA Specialist'],
    streakDays: 11,
  },
  {
    id: 'mem-4',
    rank: 4,
    name: 'Ananya Iyer',
    username: 'ananya_ai',
    collegeOrCompany: 'IIT Madras',
    region: 'Tamil Nadu',
    weeklyPoints: 435,
    rankChange: -2,
    avatarBg: 'bg-purple-500/20 text-purple-500',
    badges: ['RAG Master', 'Prompt Titan'],
    streakDays: 8,
  },
  {
    id: 'mem-5',
    rank: 5,
    name: 'Vaidik (You)',
    username: 'vaidik_ai',
    collegeOrCompany: 'SIH Hackathon Squad',
    region: 'National',
    weeklyPoints: 415,
    rankChange: 3,
    isCurrentUser: true,
    avatarBg: 'bg-primary/30 text-primary',
    badges: ['RAG Master', '7-Day Streak'],
    streakDays: 5,
  },
  {
    id: 'mem-6',
    rank: 6,
    name: 'Kabir Mehta',
    username: 'kabir_llm',
    collegeOrCompany: 'DTU Delhi',
    region: 'Delhi NCR',
    weeklyPoints: 390,
    rankChange: 1,
    avatarBg: 'bg-amber-500/20 text-amber-500',
    badges: ['Vector Wizard'],
    streakDays: 6,
  },
  // Safe Zone
  {
    id: 'mem-7',
    rank: 7,
    name: 'Sneha Roy',
    username: 'sneha_nlp',
    collegeOrCompany: 'Jadavpur University',
    region: 'West Bengal',
    weeklyPoints: 365,
    rankChange: -1,
    avatarBg: 'bg-blue-500/20 text-blue-500',
    badges: ['Prompt Titan'],
    streakDays: 4,
  },
  {
    id: 'mem-8',
    rank: 8,
    name: 'Arjun Nair',
    username: 'arjun_vllm',
    collegeOrCompany: 'NIT Trichy',
    region: 'Tamil Nadu',
    weeklyPoints: 340,
    rankChange: 0,
    avatarBg: 'bg-emerald-500/20 text-emerald-500',
    badges: ['TensorRT Specialist'],
    streakDays: 9,
  },
  {
    id: 'mem-9',
    rank: 9,
    name: 'Devika Menon',
    username: 'devika_cv',
    collegeOrCompany: 'IIT Roorkee',
    region: 'Uttarakhand',
    weeklyPoints: 325,
    rankChange: 4,
    avatarBg: 'bg-pink-500/20 text-pink-500',
    badges: ['CNN Explorer'],
    streakDays: 7,
  },
  {
    id: 'mem-10',
    rank: 10,
    name: 'Aditya Sen',
    username: 'aditya_rl',
    collegeOrCompany: 'IIT Kharagpur',
    region: 'West Bengal',
    weeklyPoints: 310,
    rankChange: -2,
    avatarBg: 'bg-indigo-500/20 text-indigo-500',
    badges: ['Agent Architect'],
    streakDays: 5,
  },
  {
    id: 'mem-11',
    rank: 11,
    name: 'Ishaan Kulkarni',
    username: 'ishaan_k',
    collegeOrCompany: 'COEP Pune',
    region: 'Maharashtra',
    weeklyPoints: 290,
    rankChange: 0,
    avatarBg: 'bg-teal-500/20 text-teal-500',
    badges: [],
    streakDays: 3,
  },
  {
    id: 'mem-12',
    rank: 12,
    name: 'Meera Nambiar',
    username: 'meera_embed',
    collegeOrCompany: 'NIT Calicut',
    region: 'Kerala',
    weeklyPoints: 275,
    rankChange: -3,
    avatarBg: 'bg-cyan-500/20 text-cyan-500',
    badges: ['Vector Wizard'],
    streakDays: 4,
  },
  {
    id: 'mem-13',
    rank: 13,
    name: 'Siddharth Rao',
    username: 'sid_rag',
    collegeOrCompany: 'RVCE Bangalore',
    region: 'Karnataka',
    weeklyPoints: 260,
    rankChange: 2,
    avatarBg: 'bg-violet-500/20 text-violet-500',
    badges: ['RAG Master'],
    streakDays: 6,
  },
  {
    id: 'mem-14',
    rank: 14,
    name: 'Tanvi Gokhale',
    username: 'tanvi_g',
    collegeOrCompany: 'VJTI Mumbai',
    region: 'Maharashtra',
    weeklyPoints: 245,
    rankChange: -1,
    avatarBg: 'bg-amber-500/20 text-amber-500',
    badges: [],
    streakDays: 2,
  },
  {
    id: 'mem-15',
    rank: 15,
    name: 'Harsh Vardhan',
    username: 'harsh_v',
    collegeOrCompany: 'IIT BHU',
    region: 'Uttar Pradesh',
    weeklyPoints: 230,
    rankChange: 0,
    avatarBg: 'bg-rose-500/20 text-rose-500',
    badges: ['Prompt Titan'],
    streakDays: 5,
  },
  {
    id: 'mem-16',
    rank: 16,
    name: 'Nisha Pillai',
    username: 'nisha_ai',
    collegeOrCompany: 'PES University',
    region: 'Karnataka',
    weeklyPoints: 215,
    rankChange: 1,
    avatarBg: 'bg-fuchsia-500/20 text-fuchsia-500',
    badges: [],
    streakDays: 3,
  },
  {
    id: 'mem-17',
    rank: 17,
    name: 'Gaurav Bhatt',
    username: 'gaurav_b',
    collegeOrCompany: 'Thapar University',
    region: 'Punjab',
    weeklyPoints: 200,
    rankChange: -2,
    avatarBg: 'bg-sky-500/20 text-sky-500',
    badges: [],
    streakDays: 4,
  },
  {
    id: 'mem-18',
    rank: 18,
    name: 'Riya Mukherjee',
    username: 'riya_m',
    collegeOrCompany: 'Heritage Institute',
    region: 'West Bengal',
    weeklyPoints: 185,
    rankChange: 3,
    avatarBg: 'bg-emerald-500/20 text-emerald-500',
    badges: [],
    streakDays: 2,
  },
  {
    id: 'mem-19',
    rank: 19,
    name: 'Kunal Joshi',
    username: 'kunal_j',
    collegeOrCompany: 'DA-IICT Gandhinagar',
    region: 'Gujarat',
    weeklyPoints: 170,
    rankChange: -1,
    avatarBg: 'bg-orange-500/20 text-orange-500',
    badges: [],
    streakDays: 1,
  },
  {
    id: 'mem-20',
    rank: 20,
    name: 'Swati Bansal',
    username: 'swati_b',
    collegeOrCompany: 'IGDTUW Delhi',
    region: 'Delhi NCR',
    weeklyPoints: 155,
    rankChange: 0,
    avatarBg: 'bg-pink-500/20 text-pink-500',
    badges: [],
    streakDays: 2,
  },
  {
    id: 'mem-21',
    rank: 21,
    name: 'Manish Tiwari',
    username: 'manish_t',
    collegeOrCompany: 'MANIT Bhopal',
    region: 'Madhya Pradesh',
    weeklyPoints: 140,
    rankChange: -4,
    avatarBg: 'bg-indigo-500/20 text-indigo-500',
    badges: [],
    streakDays: 1,
  },
  {
    id: 'mem-22',
    rank: 22,
    name: 'Pooja Hegde',
    username: 'pooja_h',
    collegeOrCompany: 'BMS College Bangalore',
    region: 'Karnataka',
    weeklyPoints: 125,
    rankChange: 2,
    avatarBg: 'bg-lime-500/20 text-lime-500',
    badges: [],
    streakDays: 3,
  },
  {
    id: 'mem-23',
    rank: 23,
    name: 'Abhishek Saxena',
    username: 'abhi_s',
    collegeOrCompany: 'HBTI Kanpur',
    region: 'Uttar Pradesh',
    weeklyPoints: 110,
    rankChange: -1,
    avatarBg: 'bg-amber-500/20 text-amber-500',
    badges: [],
    streakDays: 1,
  },
  {
    id: 'mem-24',
    rank: 24,
    name: 'Divya Chawla',
    username: 'divya_c',
    collegeOrCompany: 'Chitkara University',
    region: 'Punjab',
    weeklyPoints: 95,
    rankChange: 0,
    avatarBg: 'bg-purple-500/20 text-purple-500',
    badges: [],
    streakDays: 2,
  },
  // Demotion Zone (Bottom 15% - Ranks 25 to 30)
  {
    id: 'mem-25',
    rank: 25,
    name: 'Vikram Sethi',
    username: 'vikram_s',
    collegeOrCompany: 'Amity Noida',
    region: 'Uttar Pradesh',
    weeklyPoints: 75,
    rankChange: -3,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
  {
    id: 'mem-26',
    rank: 26,
    name: 'Deepak Choudhary',
    username: 'deepak_c',
    collegeOrCompany: 'LNMIIT Jaipur',
    region: 'Rajasthan',
    weeklyPoints: 60,
    rankChange: -1,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
  {
    id: 'mem-27',
    rank: 27,
    name: 'Shreya Das',
    username: 'shreya_d',
    collegeOrCompany: 'KIIT Bhubaneswar',
    region: 'Odisha',
    weeklyPoints: 45,
    rankChange: 0,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
  {
    id: 'mem-28',
    rank: 28,
    name: 'Nitin Yadav',
    username: 'nitin_y',
    collegeOrCompany: 'SRM Chennai',
    region: 'Tamil Nadu',
    weeklyPoints: 30,
    rankChange: -2,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
  {
    id: 'mem-29',
    rank: 29,
    name: 'Anjali Verma',
    username: 'anjali_v',
    collegeOrCompany: 'Graphic Era Dehradun',
    region: 'Uttarakhand',
    weeklyPoints: 15,
    rankChange: -1,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
  {
    id: 'mem-30',
    rank: 30,
    name: 'Rahul Mishra',
    username: 'rahul_m',
    collegeOrCompany: 'Galgotias Greater Noida',
    region: 'Uttar Pradesh',
    weeklyPoints: 0,
    rankChange: 0,
    avatarBg: 'bg-red-500/20 text-red-500',
    badges: [],
    streakDays: 0,
  },
];

export const SEED_WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'chall-1',
    weekNumber: 36,
    title: 'Design a Sub-100ms Financial SEC Document RAG Pipeline',
    category: 'RAG & Vector Search',
    prompt:
      'Given 100,000 PDF SEC filings, design an end-to-end ingestion and retrieval architecture guaranteeing sub-100ms P95 latency and zero hallucinated numbers.',
    pointsAwarded: 50,
    sampleSubmissionHint:
      'Specify chunking strategy (hybrid sentence-window), vector index (HNSW with pgvector/Milvus), cross-encoder reranker, and numerical guardrail prompt.',
    submissionsCount: 184,
  },
  {
    id: 'chall-2',
    weekNumber: 36,
    title: 'Diagnose and Resolve Distributed PyTorch Deadlock in FSDP',
    category: 'Distributed Systems',
    prompt:
      'A 70B training run with PyTorch Fully Sharded Data Parallel (FSDP-2) freezes during gradient synchronization on 16 H100 nodes. How do you isolate the culprit NCCL barrier?',
    pointsAwarded: 50,
    sampleSubmissionHint:
      'Mention TORCH_DISTRIBUTED_DEBUG=DETAIL, NCCL_DEBUG=INFO, mismatched tensor reduction shapes across ranks, and CPU memory exhaustion.',
    submissionsCount: 122,
  },
  {
    id: 'chall-3',
    weekNumber: 36,
    title: 'Autonomous Tool-Calling Agent with Infinite Loop Protection',
    category: 'Agent Architecture',
    prompt:
      'Construct a ReAct agent framework using Zod/Pydantic schemas with hard state limits that prevents recursive tool-calling hallucination cycles.',
    pointsAwarded: 50,
    sampleSubmissionHint:
      'Describe finite state machine transitions, max iteration guards, schema parsing error feedback injection, and human-in-the-loop escalation.',
    submissionsCount: 209,
  },
  {
    id: 'chall-4',
    weekNumber: 36,
    title: 'Model Quantization Trade-offs: AWQ vs GPTQ vs GGUF',
    category: 'Inference & Quantization',
    prompt:
      'Compare Activation-aware Weight Quantization (AWQ) with GPTQ and GGUF. When is AWQ superior for high-throughput GPU serving in vLLM?',
    pointsAwarded: 50,
    sampleSubmissionHint:
      'Focus on preserving salient 1% activation weights, hardware-friendly matrix packing, and runtime dequantization overhead on Tensor Cores.',
    submissionsCount: 147,
  },
  {
    id: 'chall-5',
    weekNumber: 36,
    title: 'FlashAttention-3 Asynchronous Kernel Specialization Walkthrough',
    category: 'Kernel Engineering',
    prompt:
      'Walk through the producer-consumer warp model in FlashAttention-3 and explain why Hopper TMA completely eliminates register file pressure.',
    pointsAwarded: 50,
    sampleSubmissionHint:
      'Explain direct global memory to shared memory copies via hardware DMA, ping-pong buffering in SRAM, and math warp independence.',
    submissionsCount: 98,
  },
];

// ---------------------------------------------------------------------------
// 7. MULTI-SCOPE LEADERBOARD ROSTERS
// ---------------------------------------------------------------------------
export const SEED_REGIONAL_ROSTER: LeaderboardRosterEntry[] = [
  { rank: 1, name: 'Aarav Sharma', username: 'aarav_sharma', institutionOrCountry: 'IIT Bombay, MH', streakDays: 28, scoreXp: 2420, rankChange: 0, isCurrentUser: true, avatarBg: 'bg-emerald-500/20 text-emerald-500', topBadge: 'RAG Master' },
  { rank: 2, name: 'Rohan Deshmukh', username: 'rohan_cuda', institutionOrCountry: 'VJTI Mumbai, MH', streakDays: 22, scoreXp: 1890, rankChange: 1, avatarBg: 'bg-cyan-500/20 text-cyan-500', topBadge: 'TensorRT Specialist' },
  { rank: 3, name: 'Tanvi Joshi', username: 'tanvi_ai', institutionOrCountry: 'COEP Pune, MH', streakDays: 19, scoreXp: 1740, rankChange: -1, avatarBg: 'bg-primary/20 text-primary', topBadge: 'Vector Wizard' },
  { rank: 4, name: 'Aditya Kulkarni', username: 'aditya_k', institutionOrCountry: 'PICT Pune, MH', streakDays: 16, scoreXp: 1520, rankChange: 2, avatarBg: 'bg-chart-4/20 text-chart-4', topBadge: 'Agent Architect' },
  { rank: 5, name: 'Neha More', username: 'neha_more', institutionOrCountry: 'SPIT Mumbai, MH', streakDays: 14, scoreXp: 1390, rankChange: 0, avatarBg: 'bg-chart-2/20 text-chart-2', topBadge: '7-Day Streak' },
];

export const SEED_NATIONAL_ROSTER: LeaderboardRosterEntry[] = [
  { rank: 1, name: 'Aarav Sharma', username: 'aarav_sharma', institutionOrCountry: 'IIT Bombay (MH)', streakDays: 28, scoreXp: 2420, rankChange: 0, isCurrentUser: true, avatarBg: 'bg-emerald-500/20 text-emerald-500', topBadge: 'RAG Master' },
  { rank: 2, name: 'Priya Patel', username: 'priya_ml', institutionOrCountry: 'BITS Pilani (RJ)', streakDays: 24, scoreXp: 2310, rankChange: 1, avatarBg: 'bg-primary/20 text-primary', topBadge: 'Agent Architect' },
  { rank: 3, name: 'Karthik Raja', username: 'karthik_ann', institutionOrCountry: 'IIIT Hyderabad (TS)', streakDays: 21, scoreXp: 2150, rankChange: -1, avatarBg: 'bg-cyan-500/20 text-cyan-500', topBadge: 'TensorRT Specialist' },
  { rank: 4, name: 'Ananya Iyer', username: 'ananya_cv', institutionOrCountry: 'IIT Delhi (DL)', streakDays: 19, scoreXp: 1980, rankChange: 2, avatarBg: 'bg-chart-4/20 text-chart-4', topBadge: 'Vision Titan' },
  { rank: 5, name: 'Siddharth Sen', username: 'sid_rag', institutionOrCountry: 'IIT Kharagpur (WB)', streakDays: 17, scoreXp: 1840, rankChange: 0, avatarBg: 'bg-chart-5/20 text-chart-5', topBadge: 'Vector Wizard' },
];

export const SEED_INTERNATIONAL_ROSTER: LeaderboardRosterEntry[] = [
  { rank: 1, name: 'Alex Chen', username: 'alex_triton', institutionOrCountry: 'Stanford University, USA', streakDays: 35, scoreXp: 3100, rankChange: 0, avatarBg: 'bg-purple-500/20 text-purple-500', topBadge: 'AI Architect' },
  { rank: 2, name: 'Elena Rostova', username: 'elena_kernels', institutionOrCountry: 'ETH Zürich, Switzerland', streakDays: 31, scoreXp: 2890, rankChange: 1, avatarBg: 'bg-blue-500/20 text-blue-500', topBadge: 'TensorRT Specialist' },
  { rank: 3, name: 'Aarav Sharma', username: 'aarav_sharma', institutionOrCountry: 'IIT Bombay, India', streakDays: 28, scoreXp: 2420, rankChange: 2, isCurrentUser: true, avatarBg: 'bg-emerald-500/20 text-emerald-500', topBadge: 'RAG Master' },
  { rank: 4, name: 'Kenji Takahashi', username: 'kenji_vllm', institutionOrCountry: 'University of Tokyo, Japan', streakDays: 26, scoreXp: 2380, rankChange: -1, avatarBg: 'bg-amber-500/20 text-amber-500', topBadge: 'Agent Architect' },
  { rank: 5, name: 'Priya Patel', username: 'priya_ml', institutionOrCountry: 'BITS Pilani, India', streakDays: 24, scoreXp: 2310, rankChange: 0, avatarBg: 'bg-primary/20 text-primary', topBadge: 'Agent Architect' },
];
