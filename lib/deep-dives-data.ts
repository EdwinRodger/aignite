export interface DeepDiveMetric {
  label: string;
  value: string;
}

export interface DeepDiveDiagramComparison {
  before: string;
  after: string;
  advantage: string;
}

export interface DeepDiveQuiz {
  id: string;
  deepDiveId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface DeepDive {
  id: string;
  slug: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  sourceName: string;
  sourceUrl: string;
  category: 'Inference & Infra' | 'Agents & RL' | 'GenAI & LLMs' | 'Vision & Multimodal' | 'Kernel Optimization';
  tagBadge: string;
  readTime: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Staff/Principal';
  likesCount: number;
  bookmarksCount: number;
  metrics: DeepDiveMetric[];
  diagramComparison: DeepDiveDiagramComparison;
  quiz: DeepDiveQuiz;
  createdAt: string;
  // Dynamic user interaction states hydrated from Supabase
  isLiked?: boolean;
  isBookmarked?: boolean;
  isQuizCompleted?: boolean;
  userSelectedOptionIndex?: number;
  isUserQuizCorrect?: boolean;
}

export const CURATED_DEEP_DIVES: DeepDive[] = [
  {
    id: '11111111-0001-4000-a000-000000000001',
    slug: 'deepseek-r1-grpo',
    title: 'DeepSeek-R1: Pure RL Reasoning Emergence via GRPO',
    summary:
      'DeepSeek-R1 demonstrates that high-order mathematical and algorithmic reasoning can emerge purely through large-scale reinforcement learning without human warm-up data. By replacing standard Proximal Policy Optimization (PPO) with Group Relative Policy Optimization (GRPO), it completely eliminates the memory-heavy value critic network.',
    keyTakeaway:
      'Rule of thumb: In post-training reasoning pipelines, GRPO slashes training GPU memory footprint by ~60% by calculating rewards relative to sampled group outputs rather than maintaining a separate critic model.',
    sourceName: 'DeepSeek AI Research',
    sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    category: 'Agents & RL',
    tagBadge: 'LLM Post-Training',
    readTime: '3 min read',
    difficulty: 'Advanced',
    likesCount: 342,
    bookmarksCount: 189,
    metrics: [
      { label: 'VRAM Savings', value: '~60%' },
      { label: 'Critic Memory', value: '0 GB (Eliminated)' },
      { label: 'AIME 2024 Score', value: '79.8% (Pass@1)' },
    ],
    diagramComparison: {
      before: 'PPO: Actor + Critic (2x Model VRAM footprint)',
      after: 'GRPO: Actor + Group Relative Score Normalization',
      advantage: 'Bypasses training and synchronizing a separate value critic network',
    },
    quiz: {
      id: 'quiz-deepseek-r1',
      deepDiveId: '11111111-0001-4000-a000-000000000001',
      questionText: 'Why does GRPO save ~60% VRAM compared to standard PPO during RL post-training?',
      options: [
        'A) Uses 4-bit Quantized Weights to compress the KV-cache',
        'B) Eliminates the Critic/Value Model entirely via relative group scoring',
        'C) Truncates prompt context length to sub-2048 tokens',
      ],
      correctOptionIndex: 1,
      explanation:
        'GRPO compares outputs against the baseline reward of a sampled group of completions, completely eliminating the need to allocate and update a secondary value critic model in VRAM.',
    },
    createdAt: '2 hours ago',
  },
  {
    id: '11111111-0002-4000-a000-000000000002',
    slug: 'vllm-paged-attention',
    title: 'vLLM PagedAttention: Eradicating KV-Cache Memory Fragmentation',
    summary:
      'In conventional LLM serving, 60% to 80% of GPU memory is lost to fragmentation because KV-caches are allocated contiguously for maximum sequence lengths. Inspired by operating system virtual memory paging, PagedAttention stores non-contiguous tokens in dynamic physical blocks.',
    keyTakeaway:
      'Rule of thumb: PagedAttention reduces KV-cache memory waste from >60% to under 4%, unlocking 2x to 4x higher serving throughput on identical GPU hardware.',
    sourceName: 'vLLM Project / UC Berkeley',
    sourceUrl: 'https://github.com/vllm-project/vllm',
    category: 'Inference & Infra',
    tagBadge: 'Inference Optimization',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    likesCount: 512,
    bookmarksCount: 264,
    metrics: [
      { label: 'Memory Waste', value: '<4% (vs 60-80%)' },
      { label: 'Serving Throughput', value: '2-4x Boost' },
      { label: 'Key Innovation', value: 'OS-style Memory Paging' },
    ],
    diagramComparison: {
      before: 'Contiguous Allocation: Over-allocated & fragmented static blocks',
      after: 'Paged Blocks: Dynamic non-contiguous allocation via page tables',
      advantage: 'Near-zero internal memory fragmentation and shared prefix caching',
    },
    quiz: {
      id: 'quiz-vllm-paged',
      deepDiveId: '11111111-0002-4000-a000-000000000002',
      questionText: 'How does PagedAttention eliminate memory fragmentation during continuous batching?',
      options: [
        'A) By dropping prompt tokens whenever context exceeds 4096 tokens',
        'B) By partitioning dynamic KV-cache into fixed-size virtual blocks mapped to physical memory',
        'C) By sharing weights between the encoder and decoder attention heads',
      ],
      correctOptionIndex: 1,
      explanation:
        'PagedAttention adapts OS virtual memory paging, allowing tokens in the KV-cache to reside in non-contiguous physical blocks and eliminating over-allocation.',
    },
    createdAt: '4 hours ago',
  },
  {
    id: '11111111-0003-4000-a000-000000000003',
    slug: 'flashattention-3-hopper',
    title: 'FlashAttention-3: Async FP8 Tensor Cores & Warp Specialization',
    summary:
      'FlashAttention-3 unleashes Hopper architecture (H100/H200) capabilities by overlapping memory transfers with tensor core computation. By utilizing the Tensor Memory Accelerator (TMA) and Warp Specialization, it reaches up to 75% of theoretical peak FP8 TFLOPs.',
    keyTakeaway:
      'Rule of thumb: Hardware-aware algorithms must decouple compute warps from memory-loading warps to hide memory latency on modern GPU microarchitectures.',
    sourceName: 'Tri Dao / Princeton AI',
    sourceUrl: 'https://tridao.me/blog/2024/flashdecoding/',
    category: 'Kernel Optimization',
    tagBadge: 'Kernel Engineering',
    readTime: '4 min read',
    difficulty: 'Staff/Principal',
    likesCount: 428,
    bookmarksCount: 310,
    metrics: [
      { label: 'Speedup over FA-2', value: '1.5x - 2.0x' },
      { label: 'FP8 Utilization', value: '~75% Peak H100 TFLOPs' },
      { label: 'Core Mechanism', value: 'Warp Specialization' },
    ],
    diagramComparison: {
      before: 'FA-2: Synchronous GMEM -> SMEM -> Tensor Cores pipeline',
      after: 'FA-3: Async TMA loads + Producer-Consumer Warp Specialization',
      advantage: 'Hides global memory latency entirely behind arithmetic execution',
    },
    quiz: {
      id: 'quiz-flash-3',
      deepDiveId: '11111111-0003-4000-a000-000000000003',
      questionText: 'What hardware architectural feature in NVIDIA Hopper enables FA-3 asynchronous loads?',
      options: [
        'A) Tensor Memory Accelerator (TMA) for direct global-to-shared memory transfers',
        'B) Software emulation of FP32 floating point operations',
        'C) Complete elimination of SRAM scratchpad memory',
      ],
      correctOptionIndex: 0,
      explanation:
        'Hopper hardware TMA allows copying data directly from global HBM memory into shared memory asynchronously without consuming register file bandwidth.',
    },
    createdAt: '7 hours ago',
  },
  {
    id: '11111111-0004-4000-a000-000000000004',
    slug: 'speculative-decoding',
    title: 'Speculative Decoding: Breaking the Memory-Bandwidth Bottleneck',
    summary:
      'LLM inference is fundamentally memory-bandwidth bound: loading 70B weights for every single token forward pass wastes GPU compute. Speculative decoding uses a lightweight draft model to speculate multiple tokens, which the target model verifies in a single parallel step.',
    keyTakeaway:
      'Rule of thumb: Speculative decoding yields 2x to 3x wall-clock latency reduction while preserving 100% mathematical equivalence to the target model output.',
    sourceName: 'Google Research / DeepMind',
    sourceUrl: 'https://arxiv.org/abs/2211.17192',
    category: 'Inference & Infra',
    tagBadge: 'Latency Reduction',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    likesCount: 389,
    bookmarksCount: 205,
    metrics: [
      { label: 'Latency Gain', value: '2-3x Lower P95' },
      { label: 'Distribution Fidelity', value: '100% Exact Match' },
      { label: 'Verification Cost', value: '1 Forward Pass for K tokens' },
    ],
    diagramComparison: {
      before: 'Sequential Target: K forward passes for K generated tokens',
      after: 'Draft (Fast K tokens) + Target 1-pass parallel verification',
      advantage: 'Decouples token latency from target model weight reading overhead',
    },
    quiz: {
      id: 'quiz-spec-dec',
      deepDiveId: '11111111-0004-4000-a000-000000000004',
      questionText: 'Why does speculative decoding maintain identical output distributions to the target model?',
      options: [
        'A) The draft model is larger and more accurate than the target model',
        'B) The target model validates draft tokens in parallel using modified rejection sampling',
        'C) Tokens are selected purely by temperature=0 greedy search',
      ],
      correctOptionIndex: 1,
      explanation:
        'A modified rejection sampling scheme mathematically ensures that the accepted token distribution strictly matches sampling directly from the larger target model.',
    },
    createdAt: '12 hours ago',
  },
  {
    id: '11111111-0005-4000-a000-000000000005',
    slug: 'qlora-4bit-tuning',
    title: 'QLoRA: 4-bit NormalFloat (NF4) & Double Quantization',
    summary:
      'QLoRA democratized fine-tuning by allowing 65B+ parameter LLMs to be tuned on a single 48GB GPU. It introduces NormalFloat 4 (NF4)-an information-theoretically optimal quant type for normally distributed weights-plus Double Quantization to save memory on quantization constants.',
    keyTakeaway:
      'Rule of thumb: When fine-tuning massive models on constrained hardware, QLoRA reduces memory by ~75% without compromising 16-bit baseline benchmark scores.',
    sourceName: 'Tim Dettmers / UW NLP',
    sourceUrl: 'https://github.com/artidoro/qlora',
    category: 'GenAI & LLMs',
    tagBadge: 'Quantization & PEFT',
    readTime: '3 min read',
    difficulty: 'Advanced',
    likesCount: 610,
    bookmarksCount: 340,
    metrics: [
      { label: 'VRAM Required', value: '48 GB (vs 160 GB)' },
      { label: 'Quantization Type', value: 'NF4 (Information Optimal)' },
      { label: 'Accuracy Drop', value: '<0.3% on MMLU' },
    ],
    diagramComparison: {
      before: 'Full 16-bit Tuning: 4x A100 (80GB) required for 65B model',
      after: 'NF4 Base Model + FP16 LoRA Adapters: 1x 48GB GPU',
      advantage: 'Freezes 4-bit base weights and backprops gradients through adapters only',
    },
    quiz: {
      id: 'quiz-qlora',
      deepDiveId: '11111111-0005-4000-a000-000000000005',
      questionText: 'Why is NF4 (NormalFloat 4) optimal for quantizing neural network weight tensors?',
      options: [
        'A) Neural network weights naturally follow a normal distribution centered at zero',
        'B) It converts all matrix multiplications into simple integer additions',
        'C) It forces all activations to be purely positive values',
      ],
      correctOptionIndex: 0,
      explanation:
        'Because pre-trained neural network weights typically exhibit zero-mean normal distributions, NF4 divides quantile bins with equal probability mass, maximizing theoretical information retention.',
    },
    createdAt: '1 day ago',
  },
  {
    id: '11111111-0006-4000-a000-000000000006',
    slug: 'mixture-of-experts-moe',
    title: 'Mixture of Experts: Decoupling Parameter Capacity from Compute',
    summary:
      'Sparse Mixture of Experts (MoE) architectures, popularized by Mixtral 8x7B, solve the parameter scaling bottleneck. Instead of activating all feed-forward network (FFN) layers for every token, a routing gating network activates only the Top-2 experts per token.',
    keyTakeaway:
      'Rule of thumb: MoE enables models to hold 40B+ parameters of knowledge while running with the compute cost and inference latency of a 13B dense model.',
    sourceName: 'Mistral AI Research',
    sourceUrl: 'https://mistral.ai/news/mixtral-of-experts/',
    category: 'GenAI & LLMs',
    tagBadge: 'Model Architecture',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    likesCount: 472,
    bookmarksCount: 220,
    metrics: [
      { label: 'Total Params', value: '46.7B' },
      { label: 'Active Params/Token', value: '12.9B' },
      { label: 'Routing Mechanism', value: 'Top-2 Softmax Gating' },
    ],
    diagramComparison: {
      before: 'Dense Transformer: All 47B parameters active per token forward pass',
      after: 'Sparse MoE: Only 2 of 8 experts dynamically active per token',
      advantage: 'Massive pre-training capacity with low single-token forward latency',
    },
    quiz: {
      id: 'quiz-moe',
      deepDiveId: '11111111-0006-4000-a000-000000000006',
      questionText: 'In a Sparse MoE (like Mixtral 8x7B), what decides which experts compute a given token?',
      options: [
        'A) A lightweight learned Gating/Router network with softmax over expert weights',
        'B) A static round-robin fixed assignment scheduler',
        'C) The total number of tokens currently in the prompt context',
      ],
      correctOptionIndex: 0,
      explanation:
        'A learned router layer takes the token representation, outputs logits across all experts, and selects the Top-k experts with the highest softmax affinity.',
    },
    createdAt: '1 day ago',
  },
  {
    id: '11111111-0007-4000-a000-000000000007',
    slug: 'agentic-tool-use-react',
    title: 'Agentic Tool Loops: ReAct with Structured JSON Schema Validation',
    summary:
      'Autonomous AI agents often hallucinate when attempting complex multi-step reasoning in a single pass. The ReAct (Reason + Act) loop couples chain-of-thought traces with tool executions, passing real environment observations back into context before subsequent actions.',
    keyTakeaway:
      'Rule of thumb: Production agent reliability depends on strict JSON schema enforcement (Zod/Pydantic) and finite-state guards against infinite loop hallucination.',
    sourceName: 'Yao et al. / Princeton & Google',
    sourceUrl: 'https://arxiv.org/abs/2210.03629',
    category: 'Agents & RL',
    tagBadge: 'Agent Architecture',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    likesCount: 319,
    bookmarksCount: 175,
    metrics: [
      { label: 'Multi-hop Accuracy', value: '+42% vs Zero-Shot' },
      { label: 'Hallucination Rate', value: 'Reduced by 64%' },
      { label: 'Key Paradigm', value: 'Thought -> Action -> Observation' },
    ],
    diagramComparison: {
      before: 'Single Prompt: Model invents plausible tool outputs blindly',
      after: 'ReAct Loop: Real tool execution injected into context iteratively',
      advantage: 'Grounds responses in deterministic external environment truth',
    },
    quiz: {
      id: 'quiz-react-loop',
      deepDiveId: '11111111-0007-4000-a000-000000000007',
      questionText: 'What prevents ungrounded hallucination loops in production AI agent systems?',
      options: [
        'A) Unbounded max_iterations parameters',
        'B) Structured schema validation with actual environment observations injected as feedback',
        'C) Disabling tool use entirely for multi-hop queries',
      ],
      correctOptionIndex: 1,
      explanation:
        'Validating tool arguments against schemas and requiring real tool outputs in the prompt prevents the model from fabricating hypothetical execution results.',
    },
    createdAt: '2 days ago',
  },
  {
    id: '11111111-0008-4000-a000-000000000008',
    slug: 'clip-multimodal-alignment',
    title: 'Vision-Language Alignment: CLIP Contrastive InfoNCE Pre-training',
    summary:
      'OpenAI CLIP bridged the vision-language divide by training image and text encoders simultaneously on 400 million web image-caption pairs using a symmetric InfoNCE contrastive loss over mini-batch cosine similarity matrices.',
    keyTakeaway:
      'Rule of thumb: Contrastive multi-modal alignment scales better than classification heads because it learns a continuous shared embedding space across modalities.',
    sourceName: 'OpenAI Research',
    sourceUrl: 'https://arxiv.org/abs/2103.00020',
    category: 'Vision & Multimodal',
    tagBadge: 'Multimodal Systems',
    readTime: '3 min read',
    difficulty: 'Intermediate',
    likesCount: 395,
    bookmarksCount: 198,
    metrics: [
      { label: 'Zero-Shot ImageNet', value: '76.2% Top-1' },
      { label: 'Embedding Space', value: 'Shared 512-dim Vector' },
      { label: 'Loss Function', value: 'Symmetric InfoNCE' },
    ],
    diagramComparison: {
      before: 'Fixed-class ImageNet Classifier: 1000 static discrete labels',
      after: 'Dual Encoders: Shared text-image cosine distance metric',
      advantage: 'Zero-shot recognition of arbitrary open-world concepts via text prompts',
    },
    quiz: {
      id: 'quiz-clip-loss',
      deepDiveId: '11111111-0008-4000-a000-000000000008',
      questionText: 'What loss objective enables CLIP to align visual representations with natural language?',
      options: [
        'A) Symmetric Contrastive Cross-Entropy (InfoNCE) maximizing diagonal cosine similarity',
        'B) Mean Squared Error on raw pixel RGB values',
        'C) Binary classification of whether an image contains text',
      ],
      correctOptionIndex: 0,
      explanation:
        'Symmetric contrastive InfoNCE loss pulls matching image-text pairs close together while pushing non-matching pairs apart in the shared embedding space.',
    },
    createdAt: '3 days ago',
  },
];
