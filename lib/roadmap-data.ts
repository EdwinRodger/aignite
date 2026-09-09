export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  keyKeywords: string[];
  interactiveModuleUrl?: string;
  interactiveType?: 'Company Pack' | 'Pipeline Game' | 'Voice Coach' | 'League Challenge';
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  headline: string;
  icon: string;
  estimatedHours: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  badgeAwarded: {
    name: string;
    icon: string;
    category: string;
  };
  prerequisites: string[];
  topics: RoadmapTopic[];
}

export const AI_CAREER_ROADMAP: RoadmapStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Foundations & Mathematical Intuition',
    headline: 'High-Performance Python, Vector Algebra & Matrix Calculus',
    icon: '📐',
    estimatedHours: '20 Hours',
    status: 'completed',
    badgeAwarded: {
      name: 'Math Foundations Titan',
      icon: '📐',
      category: 'Mathematical Rigor',
    },
    prerequisites: ['None (Entry Level)'],
    topics: [
      {
        id: 't-1-1',
        title: 'Linear Algebra for High-Dimensional Vectors',
        description: 'Eigenvalues, SVD, cosine similarity geometry, dot product projections, and matrix multiplication arithmetic.',
        keyKeywords: ['Vector Spaces', 'Cosine Similarity', 'SVD Decomposition', 'Dot Products'],
        interactiveModuleUrl: '/feed',
        interactiveType: 'League Challenge',
      },
      {
        id: 't-1-2',
        title: 'Multivariate Calculus & Automatic Differentiation',
        description: 'Partial derivatives, chain rule graphs, Jacobians, and computational graph backpropagation mechanics.',
        keyKeywords: ['Gradients', 'Chain Rule', 'Computational Graphs', 'Hessian Matrix'],
        interactiveModuleUrl: '/feed',
        interactiveType: 'Pipeline Game',
      },
      {
        id: 't-1-3',
        title: 'High-Throughput Vectorized Python (NumPy & SIMD)',
        description: 'Broadcasting rules, cache-line memory alignment, avoiding Python GIL stalls, and contiguous C-order arrays.',
        keyKeywords: ['Vectorization', 'NumPy Strides', 'Memory Locality', 'SIMD'],
        interactiveModuleUrl: '/packs',
        interactiveType: 'Company Pack',
      },
    ],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Classical Machine Learning Systems',
    headline: 'Optimization, Generalization, and Production Feature Pipelines',
    icon: '⚙️',
    estimatedHours: '30 Hours',
    status: 'completed',
    badgeAwarded: {
      name: 'ML Systems Specialist',
      icon: '⚙️',
      category: 'Core Machine Learning',
    },
    prerequisites: ['Foundations & Vector Algebra'],
    topics: [
      {
        id: 't-2-1',
        title: 'Stochastic Gradient Descent & Convex Optimization',
        description: 'Loss landscapes, momentum, AdamW optimizer mathematics, learning rate schedules, and gradient clipping.',
        keyKeywords: ['AdamW', 'Loss Surfaces', 'Learning Rate Warmup', 'Weight Decay'],
        interactiveModuleUrl: '/coach',
        interactiveType: 'Voice Coach',
      },
      {
        id: 't-2-2',
        title: 'Bias-Variance Dilemma & Cross-Validation Bounds',
        description: 'Overfitting prevention, L1/L2 regularization, stratified K-fold splits without test-set leakage, and ROC-AUC / PR-AUC.',
        keyKeywords: ['Data Leakage', 'Regularization', 'PR Curves', 'Calibration'],
        interactiveModuleUrl: '/feed',
        interactiveType: 'League Challenge',
      },
      {
        id: 't-2-3',
        title: 'Gradient Boosting Trees (XGBoost & LightGBM)',
        description: 'Histogram-based split finding, leaf-wise tree growth, handling sparse tabular categorical features at scale.',
        keyKeywords: ['XGBoost', 'Histogram Splitting', 'Ensembles', 'Feature Importance'],
        interactiveModuleUrl: '/packs',
        interactiveType: 'Company Pack',
      },
    ],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Deep Learning & PyTorch Core Systems',
    headline: 'Neural Tensors, CUDA Memory Hierarchies & Mixed-Precision',
    icon: '🧠',
    estimatedHours: '45 Hours',
    status: 'completed',
    badgeAwarded: {
      name: 'PyTorch Core Engineer',
      icon: '🔥',
      category: 'Deep Learning',
    },
    prerequisites: ['Classical ML Systems', 'Automatic Differentiation'],
    topics: [
      {
        id: 't-3-1',
        title: 'Custom PyTorch Modules & Autograd Functions',
        description: 'Implementing custom forward/backward passes in PyTorch, torch.autograd.Function, and in-place tensor memory traps.',
        keyKeywords: ['torch.nn.Module', 'Autograd Functions', 'Detached Tensors', 'Memory Hooks'],
        interactiveModuleUrl: '/packs/google-ai-pack',
        interactiveType: 'Company Pack',
      },
      {
        id: 't-3-2',
        title: 'Mixed-Precision Training (FP16 / BF16 & GradScaler)',
        description: 'Automatic Mixed Precision (AMP), gradient underflow prevention with GradScaler, and BF16 dynamic range benefits.',
        keyKeywords: ['torch.cuda.amp', 'BF16 vs FP16', 'GradScaler', 'Tensor Cores'],
        interactiveModuleUrl: '/packs/nvidia-ai-pack',
        interactiveType: 'Company Pack',
      },
      {
        id: 't-3-3',
        title: 'GPU Profiling & CUDA Memory Defragmentation',
        description: 'Using PyTorch Profiler, Nsight Systems, identifying CPU-GPU synchronization bottlenecks, and avoiding OOM crashes.',
        keyKeywords: ['PyTorch Profiler', 'Nsight Systems', 'CUDA Streams', 'OOM Allocation'],
        interactiveModuleUrl: '/packs/nvidia-ai-pack',
        interactiveType: 'Pipeline Game',
      },
    ],
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'NLP, Attention & Transformer Architectures',
    headline: 'Self-Attention, Positional Encodings & Modern LLM Pre-Training',
    icon: '🔮',
    estimatedHours: '50 Hours',
    status: 'in-progress',
    badgeAwarded: {
      name: 'Transformer Titan',
      icon: '🔮',
      category: 'Transformer Architecture',
    },
    prerequisites: ['Deep Learning & PyTorch Core'],
    topics: [
      {
        id: 't-4-1',
        title: 'Scaled Dot-Product Attention & KV-Cache Mechanics',
        description: 'Multi-Head Attention (MHA), Grouped-Query Attention (GQA), and KV-cache autoregressive token generation mechanics.',
        keyKeywords: ['Self-Attention', 'GQA', 'KV-Caching', 'Rotary Position Embeddings (RoPE)'],
        interactiveModuleUrl: '/coach',
        interactiveType: 'Voice Coach',
      },
      {
        id: 't-4-2',
        title: 'Modern Tokenizers & Vocabulary Compression',
        description: 'Byte-Pair Encoding (BPE), SentencePiece, Unigram, handling multilingual token bloat, and special tokens management.',
        keyKeywords: ['BPE', 'Tiktoken', 'Token Compression', 'Special Tokens'],
        interactiveModuleUrl: '/packs/google-ai-pack',
        interactiveType: 'Company Pack',
      },
      {
        id: 't-4-3',
        title: 'Parameter-Efficient Fine-Tuning (LoRA & QLoRA)',
        description: 'Low-Rank Adaptation matrix factorization, 4-bit NormalFloat (NF4) quantization, and gradient checkpointing.',
        keyKeywords: ['LoRA Rank & Alpha', 'QLoRA NF4', 'PEFT', 'Gradient Checkpointing'],
        interactiveModuleUrl: '/packs/openai-pack',
        interactiveType: 'Company Pack',
      },
    ],
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Generative AI, RAG & Vector Systems',
    headline: 'Enterprise Hybrid Search, pgvector HNSW & Cross-Encoder Reranking',
    icon: '🎖️',
    estimatedHours: '60 Hours',
    status: 'in-progress',
    badgeAwarded: {
      name: 'RAG Master',
      icon: '🎖️',
      category: 'Systems Architecture',
    },
    prerequisites: ['NLP & Transformers', 'Vector Algebra'],
    topics: [
      {
        id: 't-5-1',
        title: 'Document Ingestion, Chunking & Semantic Parsing',
        description: 'Hierarchical recursive chunking, chunk overlap math, parsing PDFs/tables without loss of semantic structure.',
        keyKeywords: ['Recursive Splitter', 'Chunk Overlap', 'Markdown Tables', 'Token Bounds'],
        interactiveModuleUrl: '/packs/openai-pack',
        interactiveType: 'Pipeline Game',
      },
      {
        id: 't-5-2',
        title: 'PostgreSQL pgvector: HNSW vs IVFFlat Indexing',
        description: 'High-concurrency Approximate Nearest Neighbor (ANN) search, M & efConstruction tuning, and scalar quantization.',
        keyKeywords: ['pgvector', 'HNSW Graph', 'IVFFlat', 'Cosine Distance'],
        interactiveModuleUrl: '/packs/openai-pack',
        interactiveType: 'Pipeline Game',
      },
      {
        id: 't-5-3',
        title: 'Hybrid Dense-Sparse Search & Reciprocal Rank Fusion (RRF)',
        description: 'Combining BM25 keyword search with dense embedding vectors, Cohere cross-encoder reranking, and sub-50ms SLAs.',
        keyKeywords: ['Hybrid Search', 'BM25', 'Reciprocal Rank Fusion', 'Cross-Encoders'],
        interactiveModuleUrl: '/coach',
        interactiveType: 'Voice Coach',
      },
      {
        id: 't-5-4',
        title: 'RAG Evaluation Benchmarks (RAGAS & TruLens)',
        description: 'Context Precision, Context Recall, Faithfulness, Answer Relevance, and synthetic test-set evaluation loops.',
        keyKeywords: ['RAGAS', 'Faithfulness Metric', 'Context Relevance', 'LLM-as-a-Judge'],
        interactiveModuleUrl: '/league',
        interactiveType: 'League Challenge',
      },
    ],
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    title: 'Agentic AI, Inference & Distributed Deployment',
    headline: 'Triton Kernels, TensorRT-LLM, vLLM PagedAttention & FSDP-2',
    icon: '👑',
    estimatedHours: '75 Hours',
    status: 'upcoming',
    badgeAwarded: {
      name: 'AI Architect',
      icon: '👑',
      category: 'Elite Production Tier',
    },
    prerequisites: ['Generative AI & RAG', 'CUDA & PyTorch Core'],
    topics: [
      {
        id: 't-6-1',
        title: 'Autonomous Agent Loops & JSON Schema Function Calling',
        description: 'ReAct agent execution, LangGraph state machine graphs, deterministic structured outputs, and self-healing SQL/code tools.',
        keyKeywords: ['LangGraph', 'ReAct Loop', 'JSON Schema Calling', 'Human-in-the-Loop'],
        interactiveModuleUrl: '/packs/openai-pack',
        interactiveType: 'Company Pack',
      },
      {
        id: 't-6-2',
        title: 'High-Throughput LLM Inference (vLLM & PagedAttention)',
        description: 'Virtual memory block allocation for non-contiguous KV-cache, continuous batching, chunked prefill, and speculative decoding.',
        keyKeywords: ['PagedAttention', 'Continuous Batching', 'vLLM', 'Speculative Decoding'],
        interactiveModuleUrl: '/packs/nvidia-ai-pack',
        interactiveType: 'Pipeline Game',
      },
      {
        id: 't-6-3',
        title: 'TensorRT-LLM Engine Compilation & FP8 Quantization',
        description: 'Warp-specialized kernels, TMA memory accelerators, AWQ/FP8 scaling factors, and Triton Inference Server C++ backends.',
        keyKeywords: ['TensorRT-LLM', 'FP8 Scaling', 'Triton Server', 'TMA Accelerators'],
        interactiveModuleUrl: '/packs/nvidia-ai-pack',
        interactiveType: 'Company Pack',
      },
      {
        id: 't-6-4',
        title: 'Multi-GPU Distributed Training (FSDP-2 & DeepSpeed ZeRO-3)',
        description: 'Sharding model parameters, gradients, and optimizer states across multi-node clusters with NCCL collective rings.',
        keyKeywords: ['PyTorch FSDP-2', 'ZeRO-3', 'NCCL Ring All-Reduce', '3D Parallelism'],
        interactiveModuleUrl: '/league',
        interactiveType: 'League Challenge',
      },
    ],
  },
];
