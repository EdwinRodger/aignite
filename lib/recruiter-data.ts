export interface CandidateTalent {
  id: string;
  fullName: string;
  headline: string;
  collegeOrCompany: string;
  region: string;
  avatarBg: string;
  leagueTier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect';
  leaguePoints: number;
  weeklyRank: number;
  streakDays: number;
  verifiedBadges: string[];
  reportCard: {
    knowledgeScore: number;
    confidenceScore: number;
    communicationScore: number;
    examplesScore: number;
    industryLevelScore: number;
    overallScore: number;
    speechMetrics: {
      wordsPerMinute: number;
      fillerCount: number;
      paceRating: 'Natural & Confident' | 'Too Slow' | 'Rushed';
      totalInterviews: number;
    };
    strengths: string[];
    improvementAreas: string[];
    recentModelAnswerExcerpt: string;
  };
  resume: {
    overallAtsScore: number;
    targetRole: string;
    summary: string;
    skills: {
      frameworks: string[];
      models: string[];
      infrastructure: string[];
      retrieval: string[];
    };
    projects: {
      title: string;
      description: string;
      impact: string;
    }[];
  };
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface RecruiterJob {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  roleCategory: 'GenAI & LLM' | 'AI Systems & Inference' | 'Distributed Training & CUDA' | 'Computer Vision & Multimodal' | 'Agent Architect';
  location: string;
  salaryRange: string;
  minLeagueTier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect';
  requiredBadges: string[];
  minReportScore: number;
  applicantsCount: number;
  postedDate: string;
  description: string;
  isActive: boolean;
}

export interface InterviewInvitation {
  id: string;
  candidateId: string;
  candidateName: string;
  companyName: string;
  roleTitle: string;
  roundType: 'Screening Call' | 'Systems Architecture' | 'Coding & Live Inference' | 'Executive Bar Raiser';
  customNote: string;
  status: 'Sent' | 'Accepted' | 'Scheduled' | 'Declined';
  sentAt: string;
}

export const TALENT_POOL_SEEDS: CandidateTalent[] = [
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

export const INITIAL_RECRUITER_JOBS: RecruiterJob[] = [
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
    title: 'Research Engineer — Post-Training & Reasoning',
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

export const INITIAL_INVITATIONS: InterviewInvitation[] = [
  {
    id: 'inv-101',
    candidateId: 'cand-1',
    candidateName: 'Aarav Sharma',
    companyName: 'Google DeepMind',
    roleTitle: 'Research Engineer — Post-Training & Reasoning',
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
