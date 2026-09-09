export interface BubbleNode {
  id: string;
  name: string;
  category: 'ingest' | 'chunk' | 'embed' | 'store' | 'retrieve' | 'model' | 'rerank';
  latencyMs: number;
  vramGb: number;
  description: string;
}

export interface BubbleMission {
  id: string;
  title: string;
  scenario: string;
  targetSlotsCount: number;
  availableNodes: BubbleNode[];
  correctSequence: string[]; // Node IDs in exact order
  optimalLatencyP95: string;
  optimalVram: string;
  failureExplanations: Record<string, string>; // Explains why certain transitions are invalid
  pointsAwarded: number;
}

export interface ErrorHunterScenario {
  id: string;
  title: string;
  framework: 'PyTorch' | 'Transformers' | 'CUDA' | 'Scikit-Learn';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  contextDescription: string;
  buggyCode: string;
  fixedCode: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  pointsAwarded: number;
}

export interface DecisionScenario {
  id: string;
  title: string;
  companyContext: string;
  hardConstraints: {
    slaLatency: string;
    vramBudget: string;
    costLimit: string;
    accuracyTarget: string;
  };
  options: {
    id: string;
    title: string;
    architecture: string;
    metrics: {
      latencyScore: number; // 0-100
      costScore: number;
      accuracyScore: number;
    };
    verdict: 'optimal' | 'acceptable' | 'rejected';
    tradeoffSummary: string;
    productionReasoning: string;
  }[];
  pointsAwarded: number;
}

export interface CompanyPack {
  slug: string;
  companyName: 'NVIDIA' | 'Google' | 'OpenAI' | 'Microsoft' | 'Meta';
  title: string;
  tagline: string;
  badgeName: string;
  badgeIcon: string;
  accentColor: string;
  borderColor: string;
  description: string;
  modulesCount: number;
  bubbleMission: BubbleMission;
  errorHunterScenario: ErrorHunterScenario;
  decisionScenario: DecisionScenario;
  skillsCovered: string[];
}

export const COMPANY_PACKS: CompanyPack[] = [
  {
    slug: 'nvidia-ai-pack',
    companyName: 'NVIDIA',
    title: 'NVIDIA Accelerated AI Engineering',
    tagline: 'Master CUDA Kernels, TensorRT-LLM, FP8 Quantization & Triton Server',
    badgeName: 'NVIDIA TensorRT Specialist',
    badgeIcon: '🟢',
    accentColor: 'from-emerald-600/20 to-teal-600/20',
    borderColor: 'border-emerald-500/30',
    description:
      'Engineered directly for high-throughput, sub-100ms LLM serving. Dive deep into GPU memory hierarchies, asynchronous Tensor Memory Accelerators (TMA), and AWQ weight quantization.',
    modulesCount: 6,
    skillsCovered: ['CUDA Memory Hierarchy', 'TensorRT-LLM Engine', 'FP8 & AWQ Quantization', 'Triton Server', 'vLLM PagedAttention'],
    bubbleMission: {
      id: 'nvidia-bubble-rag',
      title: 'Mission: Low-Latency Enterprise RAG Pipeline',
      scenario:
        'Sequence a production-grade RAG pipeline capable of handling 500 QPS with sub-120ms P95 latency using NVIDIA-accelerated components.',
      targetSlotsCount: 5,
      availableNodes: [
        { id: 'doc-parser', name: 'Fast PDF Parser', category: 'ingest', latencyMs: 8, vramGb: 0.2, description: 'Extracts clean Markdown from PDF tokens' },
        { id: 'char-chunker', name: 'Recursive Splitter (512 tokens)', category: 'chunk', latencyMs: 3, vramGb: 0.1, description: 'Overlapping chunk boundary manager' },
        { id: 'tensorrt-embed', name: 'NV-Embed-v2 (TensorRT-FP8)', category: 'embed', latencyMs: 14, vramGb: 1.2, description: 'Hardware-accelerated 4096-dim embeddings' },
        { id: 'pgvector-hnsw', name: 'HNSW Vector Index (pgvector)', category: 'store', latencyMs: 18, vramGb: 2.0, description: 'Hierarchical Navigable Small World index' },
        { id: 'tensorrt-llm', name: 'Llama-3-70B (TensorRT-LLM 4-GPU)', category: 'model', latencyMs: 65, vramGb: 38.0, description: 'Quantized FP8 serving with dynamic batching' },
        { id: 'unquantized-llm', name: 'FP32 Unquantized Llama (OOM Trap)', category: 'model', latencyMs: 420, vramGb: 140.0, description: 'Exceeds GPU memory allocation' },
        { id: 'flat-index', name: 'Exact Flat Vector Scan (High Latency)', category: 'store', latencyMs: 350, vramGb: 4.0, description: 'O(N) brute force search bottleneck' },
      ],
      correctSequence: ['doc-parser', 'char-chunker', 'tensorrt-embed', 'pgvector-hnsw', 'tensorrt-llm'],
      optimalLatencyP95: '108ms',
      optimalVram: '41.5 GB',
      failureExplanations: {
        'doc-parser->tensorrt-embed': 'Fatal OOM: Raw document passed directly to embedding model without chunking! Context length exceeded.',
        'char-chunker->pgvector-hnsw': 'Type Error: Vector store requires float32 embeddings, but received raw string chunks.',
        'tensorrt-embed->tensorrt-llm': 'Logic Inversion: Prompt fed to generator before querying the vector retrieval store.',
        'flat-index': 'SLA Violation: Flat exact search adds +350ms to P95 latency, violating the 120ms requirement.',
        'unquantized-llm': 'Hardware Error: FP32 model requires 140GB VRAM, throwing CUDA Out-Of-Memory.',
      },
      pointsAwarded: 25,
    },
    errorHunterScenario: {
      id: 'nvidia-bug-zero-grad',
      title: 'PyTorch Gradient Accumulation Bug',
      framework: 'PyTorch',
      difficulty: 'Intermediate',
      contextDescription:
        'A junior ML engineer implemented gradient accumulation to simulate a batch size of 64 on a single 24GB GPU. However, model loss diverges to NaN after 50 steps.',
      buggyCode: `for step, batch in enumerate(dataloader):
    inputs, labels = batch["input_ids"].cuda(), batch["labels"].cuda()
    outputs = model(inputs, labels=labels)
    loss = outputs.loss / accumulation_steps
    loss.backward()

    if (step + 1) % accumulation_steps == 0:
        optimizer.step()
        # [BUG LOCATION]: Missing vital state reset here!
        scheduler.step()`,
      fixedCode: `for step, batch in enumerate(dataloader):
    inputs, labels = batch["input_ids"].cuda(), batch["labels"].cuda()
    outputs = model(inputs, labels=labels)
    loss = outputs.loss / accumulation_steps
    loss.backward()

    if (step + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()  # <-- FIX: Clears gradients before next accumulation window
        scheduler.step()`,
      options: [
        {
          id: 'opt-1',
          text: 'The learning rate scheduler step must occur before optimizer.step()',
          isCorrect: false,
          explanation: 'Incorrect: Stepping the scheduler before the optimizer causes wrong initial learning rates on warmup.',
        },
        {
          id: 'opt-2',
          text: 'optimizer.zero_grad() is never called inside the accumulation condition, so gradients accumulate endlessly until weights explode to NaN',
          isCorrect: true,
          explanation:
            'Spot on! PyTorch accumulates gradients by default on backward(). Without optimizer.zero_grad(), previous mini-batch gradients are added infinitely.',
        },
        {
          id: 'opt-3',
          text: 'loss should not be divided by accumulation_steps because PyTorch does this automatically',
          isCorrect: false,
          explanation: 'Incorrect: PyTorch backward() sums gradients across batches, so manual division is required.',
        },
      ],
      pointsAwarded: 20,
    },
    decisionScenario: {
      id: 'nvidia-decision-drone',
      title: 'Autonomous Edge Drone Object Tracking',
      companyContext: 'NVIDIA Jetson / Robotics Division',
      hardConstraints: {
        slaLatency: '< 45ms P95',
        vramBudget: '< 4 GB',
        costLimit: '$400/device',
        accuracyTarget: '> 50 mAP@50-95',
      },
      options: [
        {
          id: 'dec-1',
          title: 'RT-DETR (Real-Time DEtection TRansformer) TensorRT-FP16',
          architecture: 'End-to-end transformer without NMS post-processing, compiled via TensorRT with INT8 calibration.',
          metrics: { latencyScore: 96, costScore: 92, accuracyScore: 94 },
          verdict: 'optimal',
          tradeoffSummary: 'Optimal edge solution: 28ms latency, 2.1GB VRAM, 53.4 mAP.',
          productionReasoning:
            'RT-DETR removes Non-Maximum Suppression (NMS) latency bottlenecks. Compiled with TensorRT INT8, it effortlessly clears the 45ms SLA while fitting inside Jetson Orin 4GB memory limits.',
        },
        {
          id: 'dec-2',
          title: 'ViT-H/14 with Masked Autoencoder Pretraining',
          architecture: '632M parameter Vision Transformer running on standard PyTorch FP32.',
          metrics: { latencyScore: 20, costScore: 30, accuracyScore: 98 },
          verdict: 'rejected',
          tradeoffSummary: 'Catastrophic latency: 340ms per frame, 7.8GB VRAM (exceeds budget).',
          productionReasoning:
            'While ViT-H yields high theoretical accuracy, its quadratic attention complexity causes 340ms frame latency and consumes nearly 8GB VRAM, crashing the edge drone hardware.',
        },
        {
          id: 'dec-3',
          title: 'CLIP ViT-B/32 Zero-Shot Classifier',
          architecture: 'Zero-shot prompt-based classification using dual text-image encoders.',
          metrics: { latencyScore: 65, costScore: 75, accuracyScore: 62 },
          verdict: 'acceptable',
          tradeoffSummary: 'Viable classification, but lacks bounding box localization coordinates.',
          productionReasoning:
            'CLIP classifies image semantics well, but autonomous drone navigation requires spatial bounding box detection, making pure CLIP insufficient without a downstream detector.',
        },
      ],
      pointsAwarded: 25,
    },
  },
  {
    slug: 'openai-pack',
    companyName: 'OpenAI',
    title: 'OpenAI Frontier Agent & API Architectures',
    tagline: 'Function Calling, ReAct Agent Loops, JSON Schemas & Speculative Sampling',
    badgeName: 'OpenAI Certified Agent Architect',
    badgeIcon: '⚪',
    accentColor: 'from-emerald-950/40 to-slate-900/60',
    borderColor: 'border-emerald-500/30',
    description:
      'Master the engineering paradigms powering modern agentic systems: structured Pydantic/Zod tool definitions, stateful memory threads, context distillation, and sub-second reasoning loops.',
    modulesCount: 5,
    skillsCovered: ['Structured Tool Calling', 'ReAct Agent Loops', 'Context Window Packing', 'Vector Embeddings', 'Evaluations with evals'],
    bubbleMission: {
      id: 'openai-bubble-agent',
      title: 'Mission: Autonomous Multi-Tool Financial Analyst Agent',
      scenario:
        'Construct a reliable ReAct autonomous agent loop that verifies stock queries, queries an external SEC filing tool, and enforces JSON validation.',
      targetSlotsCount: 5,
      availableNodes: [
        { id: 'user-prompt', name: 'User Request ("Analyze AAPL Q3")', category: 'ingest', latencyMs: 0, vramGb: 0, description: 'Raw natural language user instruction' },
        { id: 'json-schema', name: 'Strict Tool Schema (Zod/JSON)', category: 'chunk', latencyMs: 2, vramGb: 0, description: 'Enforces deterministic argument structure' },
        { id: 'reasoning-llm', name: 'Reasoning Model (GPT-4o Mini)', category: 'model', latencyMs: 240, vramGb: 0, description: 'Emits structured tool_calls arguments' },
        { id: 'tool-executor', name: 'Deterministic SEC Edgar API', category: 'retrieve', latencyMs: 110, vramGb: 0, description: 'Executes approved financial query' },
        { id: 'guard-validator', name: 'Output Pydantic Validator', category: 'rerank', latencyMs: 5, vramGb: 0, description: 'Guarantees output conforms to financial schema' },
      ],
      correctSequence: ['user-prompt', 'json-schema', 'reasoning-llm', 'tool-executor', 'guard-validator'],
      optimalLatencyP95: '357ms',
      optimalVram: '0 GB (API Serviced)',
      failureExplanations: {
        'user-prompt->tool-executor': 'Security Error: Raw unparsed user prompt passed to tool executor without model interpretation or schema validation!',
        'tool-executor->reasoning-llm': 'Reversed Loop: Tool called before the model generated the required parameters.',
      },
      pointsAwarded: 25,
    },
    errorHunterScenario: {
      id: 'openai-bug-json-mode',
      title: 'Hallucinated Tool Arguments in Function Calling',
      framework: 'Transformers',
      difficulty: 'Beginner',
      contextDescription:
        'An API integration calls a weather lookup tool, but occasionally fails with JSONDecodeError when the model outputs trailing conversational pleasantries.',
      buggyCode: `response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a weather bot. Always output tool arguments in JSON."},
        {"role": "user", "content": "What is the humidity in Tokyo?"}
    ],
    # [BUG]: Relying purely on system prompt for JSON output
)`,
      fixedCode: `response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a weather bot."},
        {"role": "user", "content": "What is the humidity in Tokyo?"}
    ],
    response_format={"type": "json_object"},  # <-- FIX: Hardware/sampler-level JSON grammar constraint
)`,
      options: [
        {
          id: 'opt-1',
          text: 'Lower the model temperature to 0.0 to guarantee JSON format',
          isCorrect: false,
          explanation: 'Incorrect: Temperature=0 reduces randomness but does not enforce a formal context-free grammar constraint.',
        },
        {
          id: 'opt-2',
          text: 'Enable response_format={"type": "json_object"} or strict tool schemas to mathematically mask non-JSON tokens during decoding',
          isCorrect: true,
          explanation: 'Correct! OpenAI JSON mode and Structured Outputs enforce grammar-constrained decoding at the logit sampler level.',
        },
        {
          id: 'opt-3',
          text: 'Upgrade to an 8k context window model',
          isCorrect: false,
          explanation: 'Incorrect: Context length has no bearing on output format adherence.',
        },
      ],
      pointsAwarded: 20,
    },
    decisionScenario: {
      id: 'openai-decision-rag',
      title: 'HIPAA Medical Record Semantic QA Engine',
      companyContext: 'Healthcare AI Platform',
      hardConstraints: {
        slaLatency: '< 500ms P95',
        vramBudget: 'Zero On-Premise GPU',
        costLimit: '$0.005 / patient record query',
        accuracyTarget: 'Zero fabricated medical claims (100% cited)',
      },
      options: [
        {
          id: 'dec-1',
          title: 'Hybrid BM25 + text-embedding-3-small + Cohere Rerank + GPT-4o-Mini',
          architecture: 'Sparse keyword matching combined with dense vector embeddings and cross-encoder reranking before prompt generation.',
          metrics: { latencyScore: 90, costScore: 95, accuracyScore: 98 },
          verdict: 'optimal',
          tradeoffSummary: 'Superb balance: 290ms latency, $0.0018/query cost, 99.1% factual citation rate.',
          productionReasoning:
            'Medical terms (e.g. "Hydrochlorothiazide 25mg") require exact keyword precision (BM25) alongside semantic intent (embeddings). Reranking ensures only relevant medical charts enter the context window.',
        },
        {
          id: 'dec-2',
          title: 'Dense-Only 1536-dim embeddings without Reranker',
          architecture: 'Pure vector cosine similarity query directly into generation model.',
          metrics: { latencyScore: 95, costScore: 90, accuracyScore: 68 },
          verdict: 'rejected',
          tradeoffSummary: 'Dangerous false positives on medication dosages due to embedding semantic drift.',
          productionReasoning:
            'Dense vector embeddings frequently confuse numerical dosage variations (e.g. 5mg vs 50mg) because numbers share similar semantic neighborhoods. Unacceptable for medical compliance.',
        },
      ],
      pointsAwarded: 25,
    },
  },
  {
    slug: 'google-ai-pack',
    companyName: 'Google',
    title: 'Google Deep Learning & Vertex AI Pipelines',
    tagline: 'Master Gemma 2 Architectures, TPU Parallelism, Gemini 2.0 Flash & LoRA',
    badgeName: 'Google Cloud AI Fellow',
    badgeIcon: '🔴',
    accentColor: 'from-blue-600/20 to-emerald-600/20',
    borderColor: 'border-blue-500/30',
    description:
      'Learn how Google builds at scale: sliding window attention in Gemma, distributed model sharding on TPUs, multi-modal Gemini Flash streaming, and parameter-efficient fine-tuning with Jax/Keras.',
    modulesCount: 5,
    skillsCovered: ['Gemma 2 Architecture', 'Sliding Window Attention', 'Gemini Multimodal API', 'TPU Mesh Sharding', 'PEFT with LoRA'],
    bubbleMission: {
      id: 'google-bubble-gemma',
      title: 'Mission: Gemma 2 Efficient Fine-Tuning Pipeline',
      scenario:
        'Sequence a high-throughput fine-tuning pipeline for Gemma 2 (9B) combining LoRA adapters, gradient checkpointing, and flash attention.',
      targetSlotsCount: 4,
      availableNodes: [
        { id: 'tokenizer-spm', name: 'Gemma SentencePiece Tokenizer', category: 'ingest', latencyMs: 2, vramGb: 0.1, description: 'Encodes 256k vocabulary tokens' },
        { id: 'flash-attn', name: 'FlashAttention-2 Kernel', category: 'chunk', latencyMs: 15, vramGb: 2.1, description: 'Fused scaled dot-product attention' },
        { id: 'lora-adapter', name: 'Low-Rank Adapter (r=16, alpha=32)', category: 'embed', latencyMs: 5, vramGb: 0.8, description: 'Trainable projection matrices' },
        { id: 'grad-checkpoint', name: 'Activation Gradient Checkpointing', category: 'model', latencyMs: 25, vramGb: -6.0, description: 'Recomputes activations to free VRAM' },
      ],
      correctSequence: ['tokenizer-spm', 'flash-attn', 'lora-adapter', 'grad-checkpoint'],
      optimalLatencyP95: '47ms / step',
      optimalVram: '14.2 GB (Fits single GPU)',
      failureExplanations: {
        'lora-adapter->tokenizer-spm': 'Inverted Dataflow: Tokenizer must process text before weights can receive embeddings.',
      },
      pointsAwarded: 25,
    },
    errorHunterScenario: {
      id: 'google-bug-data-leakage',
      title: 'Feature Scaler Data Leakage in Preprocessing',
      framework: 'Scikit-Learn',
      difficulty: 'Beginner',
      contextDescription:
        'A model scores 99.2% accuracy in local training, but drops to 64% in real production deployment. What caused the discrepancy?',
      buggyCode: `scaler = StandardScaler()
# [BUG]: Fitting scaler on the ENTIRE dataset before splitting!
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)
model.fit(X_train, y_train)`,
      fixedCode: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # <-- FIX: Fit ONLY on training data
X_test_scaled = scaler.transform(X_test)        # <-- FIX: Transform test data without peeking
model.fit(X_train_scaled, y_train)`,
      options: [
        {
          id: 'opt-1',
          text: 'random_state=42 causes biased random permutations',
          isCorrect: false,
          explanation: 'Incorrect: random_state merely sets the seed for deterministic reproducibility.',
        },
        {
          id: 'opt-2',
          text: 'The scaler was fitted on the entire dataset before splitting, leaking test distribution parameters (mean and std) into training',
          isCorrect: true,
          explanation:
            'Spot on! Fitting a scaler on all data before splitting causes Data Leakage, producing artificially inflated training scores that fail in production.',
        },
        {
          id: 'opt-3',
          text: 'StandardScaler does not work with continuous neural network targets',
          isCorrect: false,
          explanation: 'Incorrect: StandardScaler is applied to features (X), not targets (y).',
        },
      ],
      pointsAwarded: 20,
    },
    decisionScenario: {
      id: 'google-decision-tpu',
      title: 'Distributed Pretraining Across TPU Pods',
      companyContext: 'Google DeepMind Core Infrastructure',
      hardConstraints: {
        slaLatency: '< 10ms inter-chip sync',
        vramBudget: 'Scale to 70B parameter model',
        costLimit: 'Minimize high-bandwidth interconnect saturation',
        accuracyTarget: 'Loss convergence within 2% of dense baseline',
      },
      options: [
        {
          id: 'dec-1',
          title: '3D Parallelism: Pipeline (PP) + Tensor (TP) + Fully Sharded Data Parallel (FSDP)',
          architecture: 'Megatron-style tensor slicing inside TPU slices, pipeline sharding across nodes, and zero-redundancy data parallelism.',
          metrics: { latencyScore: 94, costScore: 90, accuracyScore: 97 },
          verdict: 'optimal',
          tradeoffSummary: 'Optimal distributed training setup for 70B+ frontier models.',
          productionReasoning:
            'Combining TP within fast Optical Circuit Switches (OCS) and FSDP/PP across nodes maximizes compute throughput while preventing memory exhaustion.',
        },
        {
          id: 'dec-2',
          title: 'Naive Data Parallelism (DDP) with full model replication',
          architecture: 'Replicate the 70B parameter model across all chips identically.',
          metrics: { latencyScore: 10, costScore: 20, accuracyScore: 10 },
          verdict: 'rejected',
          tradeoffSummary: 'Impossible: A 70B model requires ~140GB just for weights, exceeding single chip HBM.',
          productionReasoning:
            'Individual TPU v5e chips feature 16GB–32GB HBM. A 70B model cannot physically fit on a single chip without sharding.',
        },
      ],
      pointsAwarded: 25,
    },
  },
  {
    slug: 'meta-ai-pack',
    companyName: 'Meta',
    title: 'Meta PyTorch & Llama 3 Core Architecture',
    tagline: 'Master RoPE, Grouped-Query Attention (GQA), PyTorch FSDP-2 & Torchtune',
    badgeName: 'Meta Open-Source AI Contributor',
    badgeIcon: '🔷',
    accentColor: 'from-blue-700/20 to-indigo-900/30',
    borderColor: 'border-blue-500/30',
    description:
      'Learn the architectural secrets of the world’s most popular open-weights models: Grouped-Query Attention (GQA) memory reduction, RoPE high-frequency scaling for 128k context, and PyTorch 2.0 torch.compile.',
    modulesCount: 5,
    skillsCovered: ['Grouped-Query Attention', 'Rotary Positional Embeddings (RoPE)', 'PyTorch FSDP-2', 'torch.compile & Inductor', 'Llama-3 Architecture'],
    bubbleMission: {
      id: 'meta-bubble-gqa',
      title: 'Mission: Grouped-Query Attention Inference Pipeline',
      scenario: 'Assemble an optimized Llama-3 8B inference step utilizing Grouped-Query Attention (8 KV heads for 32 Query heads).',
      targetSlotsCount: 4,
      availableNodes: [
        { id: 'query-proj', name: 'Query Projection (32 Heads)', category: 'embed', latencyMs: 4, vramGb: 0.5, description: 'Generates 32 independent query subspaces' },
        { id: 'gqa-kv-proj', name: 'GQA KV Projection (8 Heads)', category: 'chunk', latencyMs: 2, vramGb: 0.15, description: 'Shares 1 KV head across 4 Query heads' },
        { id: 'rope-rotary', name: 'RoPE Embedding Rotation', category: 'model', latencyMs: 3, vramGb: 0.05, description: 'Encodes relative token distances in complex space' },
        { id: 'sdpa-kernel', name: 'Flash-SDPA Attention Kernel', category: 'retrieve', latencyMs: 8, vramGb: 0.4, description: 'Fused memory-efficient attention computation' },
      ],
      correctSequence: ['query-proj', 'gqa-kv-proj', 'rope-rotary', 'sdpa-kernel'],
      optimalLatencyP95: '17ms / token',
      optimalVram: '1.1 GB (KV Cache)',
      failureExplanations: {
        'rope-rotary->query-proj': 'Inverted Order: RoPE applies rotational complex matrix multiplication to queries and keys AFTER projection!',
      },
      pointsAwarded: 25,
    },
    errorHunterScenario: {
      id: 'meta-bug-rope-broadcast',
      title: 'RoPE Rotary Position Dimension Mismatch',
      framework: 'PyTorch',
      difficulty: 'Advanced',
      contextDescription:
        'A developer modified Llama attention code to support longer contexts, but tensor broadcasting fails with RuntimeError: The size of tensor a (128) must match the size of tensor b (64) at non-singleton dimension 3.',
      buggyCode: `def apply_rotary_pos_emb(q, k, cos, sin):
    # q shape: [batch, num_heads, seq_len, head_dim]
    # cos, sin shape: [1, 1, seq_len, head_dim // 2]
    # [BUG]: Attempting elementwise multiplication without interleaving or duplicating frequencies
    q_embed = (q * cos) + (rotate_half(q) * sin)
    return q_embed`,
      fixedCode: `def apply_rotary_pos_emb(q, k, cos, sin):
    # q shape: [batch, num_heads, seq_len, head_dim]
    # Repeat frequencies to match full head_dim (128):
    cos = torch.cat([cos, cos], dim=-1)  # <-- FIX: Expands [64] -> [128]
    sin = torch.cat([sin, sin], dim=-1)
    q_embed = (q * cos) + (rotate_half(q) * sin)
    return q_embed`,
      options: [
        {
          id: 'opt-1',
          text: 'The batch size must be equal to the sequence length in RoPE',
          isCorrect: false,
          explanation: 'Incorrect: RoPE operates independently across batches and sequence positions.',
        },
        {
          id: 'opt-2',
          text: 'Rotary sine/cosine frequencies are calculated for head_dim // 2 (64) and must be duplicated/concatenated along the last dimension to match full head_dim (128)',
          isCorrect: true,
          explanation:
            'Spot on! RoPE applies 2D rotation pairs over even/odd coordinates. The frequencies cover half the dimension and must be concatenated `[cos, cos]` to match tensor `q`.',
        },
        {
          id: 'opt-3',
          text: 'PyTorch requires complex numbers (torch.cfloat) for all rotary calculations',
          isCorrect: false,
          explanation: 'Incorrect: Real-valued 2D matrix implementations are the industry standard in Llama and Hugging Face.',
        },
      ],
      pointsAwarded: 20,
    },
    decisionScenario: {
      id: 'meta-decision-gqa',
      title: 'High-Concurrency Serving Architecture for Llama 3',
      companyContext: 'Meta Production Infrastructure',
      hardConstraints: {
        slaLatency: '< 20ms per output token',
        vramBudget: 'Single 80GB A100 GPU',
        costLimit: 'Max concurrency (target > 64 active parallel streams)',
        accuracyTarget: 'Identical perplexity to Multi-Head Attention',
      },
      options: [
        {
          id: 'dec-1',
          title: 'Grouped-Query Attention (GQA) with 8 Key-Value Heads',
          architecture: 'Groups 4 query heads per KV head, shrinking KV-cache footprint by 75% compared to full MHA.',
          metrics: { latencyScore: 96, costScore: 98, accuracyScore: 95 },
          verdict: 'optimal',
          tradeoffSummary: 'Allows 4x larger batch sizes with zero loss in generation quality.',
          productionReasoning:
            'At high batch sizes, memory bandwidth reading the KV-cache is the dominant bottleneck. GQA slashes KV memory bandwidth by 4x, unlocking 64+ concurrent streams on a single GPU.',
        },
        {
          id: 'dec-2',
          title: 'Full Multi-Head Attention (MHA) with 32 KV Heads',
          architecture: 'Traditional attention where every single query head has its own dedicated key and value head.',
          metrics: { latencyScore: 40, costScore: 35, accuracyScore: 96 },
          verdict: 'rejected',
          tradeoffSummary: 'KV-cache bloat limits max concurrency to under 16 streams before CUDA OOM.',
          productionReasoning:
            'With full MHA, KV-cache consumes ~32GB for just 16 concurrent users at 8k context, causing severe memory starvation and sub-optimal GPU compute utilization.',
        },
      ],
      pointsAwarded: 25,
    },
  },
  {
    slug: 'microsoft-ai-pack',
    companyName: 'Microsoft',
    title: 'Microsoft Azure AI & Multi-Agent Orchestration',
    tagline: 'Master Semantic Kernel, AutoGen Multi-Agent Systems & DeepSpeed ZeRO',
    badgeName: 'Microsoft Certified Enterprise AI Architect',
    badgeIcon: '🔷',
    accentColor: 'from-cyan-600/20 to-blue-600/20',
    borderColor: 'border-cyan-500/30',
    description:
      'Engineered for enterprise scale: AutoGen collaborative multi-agent patterns, Semantic Kernel memory connectors, DeepSpeed ZeRO memory optimization, and enterprise RAG on Azure AI Search.',
    modulesCount: 5,
    skillsCovered: ['AutoGen Multi-Agent Framework', 'Semantic Kernel', 'DeepSpeed ZeRO-3', 'Azure AI Search Vector Indexing', 'Copilot Studio Patterns'],
    bubbleMission: {
      id: 'msft-bubble-autogen',
      title: 'Mission: AutoGen Collaborative Multi-Agent Pipeline',
      scenario:
        'Sequence an autonomous multi-agent software engineering team with User Proxy, Coder Agent, Code Executor, and Critic Agent.',
      targetSlotsCount: 4,
      availableNodes: [
        { id: 'user-proxy', name: 'User Proxy Agent (Human-in-the-loop)', category: 'ingest', latencyMs: 0, vramGb: 0, description: 'Receives prompt and governs execution permissions' },
        { id: 'coder-agent', name: 'Senior Python Coder Agent', category: 'model', latencyMs: 220, vramGb: 0, description: 'Emits runnable Python scripts in fenced blocks' },
        { id: 'docker-executor', name: 'Sandboxed Docker Execution Environment', category: 'retrieve', latencyMs: 80, vramGb: 0, description: 'Safely runs generated code and collects STDOUT' },
        { id: 'critic-agent', name: 'Code Quality & Security Critic', category: 'rerank', latencyMs: 190, vramGb: 0, description: 'Audits outputs against security specifications' },
      ],
      correctSequence: ['user-proxy', 'coder-agent', 'docker-executor', 'critic-agent'],
      optimalLatencyP95: '490ms / round',
      optimalVram: '0 GB (Azure Hosted)',
      failureExplanations: {
        'coder-agent->user-proxy': 'Missing Sandbox: Code emitted directly to user without secure execution testing!',
      },
      pointsAwarded: 25,
    },
    errorHunterScenario: {
      id: 'msft-bug-deepspeed-zero',
      title: 'DeepSpeed ZeRO-3 Parameter Partitioning Deadlock',
      framework: 'CUDA',
      difficulty: 'Advanced',
      contextDescription:
        'Training a large model with DeepSpeed ZeRO-3, but the process hangs indefinitely at the start of backward() with 0% GPU compute utilization.',
      buggyCode: `with deepspeed.zero.Init():
    model = MyLargeTransformer()

# [BUG]: Accessing partitioned parameter directly outside ZeRO context in training loop:
for param in model.parameters():
    print(f"Weight norm: {param.norm().item()}")`,
      fixedCode: `with deepspeed.zero.Init():
    model = MyLargeTransformer()

# FIX: In ZeRO-3, parameters are partitioned across GPUs.
# Use deepspeed.zero.GatheredParameters to collect weights across ranks:
with deepspeed.zero.GatheredParameters(model.parameters()):
    for param in model.parameters():
        print(f"Weight norm: {param.norm().item()}")`,
      options: [
        {
          id: 'opt-1',
          text: 'The model must be converted to float16 before calling deepspeed.zero.Init()',
          isCorrect: false,
          explanation: 'Incorrect: DeepSpeed ZeRO handles data types automatically during initialization.',
        },
        {
          id: 'opt-2',
          text: 'In ZeRO-3, model parameters are partitioned across all GPU ranks; accessing param.data directly outside a GatheredParameters context triggers an unhandled distributed barrier deadlock',
          isCorrect: true,
          explanation:
            'Spot on! Under ZeRO Stage 3, each GPU holds only 1/N of the model weights. Attempting to calculate norm on sliced parameters deadlocks inter-GPU communication unless gathered.',
        },
        {
          id: 'opt-3',
          text: 'ZeRO-3 requires NCCL_DEBUG=INFO environment variable to function',
          isCorrect: false,
          explanation: 'Incorrect: NCCL_DEBUG is a diagnostic logging flag, not an execution prerequisite.',
        },
      ],
      pointsAwarded: 20,
    },
    decisionScenario: {
      id: 'msft-decision-agent',
      title: 'Multi-Agent vs Single Monolithic Prompt for Financial Compliance',
      companyContext: 'Azure Enterprise Services',
      hardConstraints: {
        slaLatency: '< 15 seconds total turn',
        vramBudget: 'Zero Local Infra',
        costLimit: '< $0.05 per audit report',
        accuracyTarget: '> 99% regulatory compliance audit fidelity',
      },
      options: [
        {
          id: 'dec-1',
          title: 'Collaborative Multi-Agent Network (Planner + Auditor + Verifier)',
          architecture: 'Decomposed specialized agent roles with structured inter-agent message validation and explicit handoff states.',
          metrics: { latencyScore: 82, costScore: 88, accuracyScore: 99 },
          verdict: 'optimal',
          tradeoffSummary: 'Far higher audit fidelity (99.4%) with zero runaway hallucination.',
          productionReasoning:
            'Complex enterprise compliance workflows overwhelm a single context window. Decomposing tasks into specialized Auditor and Verifier agents eliminates single-point reasoning failures.',
        },
        {
          id: 'dec-2',
          title: 'Single Giant 128k Prompt containing all 400 pages of compliance rules',
          architecture: 'Stuffing all legal manuals into one mega-prompt with a single generation step.',
          metrics: { latencyScore: 70, costScore: 40, accuracyScore: 61 },
          verdict: 'rejected',
          tradeoffSummary: 'Catastrophic "Lost in the Middle" phenomenon; missed critical clauses.',
          productionReasoning:
            'Large language models suffer severe attention degradation in the middle 60% of massive 100k+ contexts. Substantial compliance rules are consistently overlooked.',
        },
      ],
      pointsAwarded: 25,
    },
  },
];
