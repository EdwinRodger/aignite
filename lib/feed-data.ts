export interface FeedQuiz {
  id: string;
  postId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  pointsAwarded: number;
}

export interface FeedPost {
  id: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  sourceName: string;
  sourceUrl: string;
  category: 'GenAI & LLMs' | 'Inference & Infra' | 'Vision & Multimodal' | 'Agents & RL' | 'AI Systems';
  tagBadge: string;
  readTime: string;
  likesCount: number;
  metrics: { label: string; value: string }[];
  diagramComparison: {
    before: string;
    after: string;
    advantage: string;
  };
  quiz: FeedQuiz;
  createdAt: string;
}

export const CURATED_FEED_POSTS: FeedPost[] = [
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
        'Correct! Hopper\'s hardware TMA allows copying data directly from global HBM memory into shared memory asynchronously without using register file bandwidth.',
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
      'OpenAI\'s CLIP bridged the vision-language divide by training image and text encoders simultaneously on 400 million web image-caption pairs using a symmetric InfoNCE contrastive loss over mini-batch cosine similarity matrices.',
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
