export interface ChallengeGuideSection {
  id: string;
  title: string;
  badge: string;
  summary: string;
  keyPoints: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  pitfallWarning?: string;
  targetChallengeId?: string;
  targetChallengeName?: string;
}

export interface ChallengeItem {
  id: string;
  name: string;
  type: 'pipeline-bubble' | 'error-hunter' | 'micro-quiz' | 'decision-simulator';
  badge: string;
  estimatedMinutes: number;
  xpReward: number;
  description: string;
}

export interface ChallengeModule {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  status: 'active' | 'coming_soon';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  totalXp: number;
  iconName: string;
  overview: string;
  keyTopics: string[];
  challenges: ChallengeItem[];
  guideSections: ChallengeGuideSection[];
}

export const CHALLENGE_MODULES: ChallengeModule[] = [
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    shortTitle: 'RAG Systems',
    tagline: 'Connect private documents to LLMs with vector search, embeddings, and context grounding.',
    status: 'active',
    level: 'Beginner',
    estimatedTime: '20 mins',
    totalXp: 100,
    iconName: 'Database',
    overview:
      'Standard Large Language Models possess broad parametric knowledge frozen at training time, but lack your private documents and recent facts. Retrieval-Augmented Generation (RAG) solves this by retrieving relevant text passages from an external index and inserting them into the prompt before generating an answer.',
    keyTopics: [
      'Document Parsing & Text Extraction',
      'Text Chunking with Overlap',
      'Dense Vector Embeddings',
      'Vector Databases & HNSW Indexing',
      'Cosine Similarity & Hybrid Search',
      'Cross-Encoder Reranking',
      'Augmented Prompt Construction',
    ],
    challenges: [
      {
        id: 'pipeline-bubble',
        name: 'RAG Pipeline Bubble',
        type: 'pipeline-bubble',
        badge: 'Sequence Builder',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Arrange the 8 core RAG stages in correct execution order to achieve sub-50ms latency.',
      },
      {
        id: 'error-hunter',
        name: 'RAG Error Code Hunter',
        type: 'error-hunter',
        badge: 'Code Debugger',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Inspect a production retrieval function, diagnose the silent vector ranking bug, and apply the patch.',
      },
      {
        id: 'micro-quiz',
        name: 'Timed RAG Micro-Quiz',
        type: 'micro-quiz',
        badge: '60s Speed Drill',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Test your foundational RAG knowledge by answering 5 rapid-fire questions within a 60-second time limit.',
      },
      {
        id: 'decision-simulator',
        name: 'RAG Architecture Decision',
        type: 'decision-simulator',
        badge: 'System Architect',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Evaluate enterprise retrieval architectures under strict latency and token budget constraints.',
      },
    ],
    guideSections: [
      {
        id: 'what-is-rag',
        title: '1. What is RAG and Why Does It Matter?',
        badge: 'Core Concept',
        summary:
          'Large Language Models memorize patterns during pre-training, but they hallucinate facts when asked about proprietary data, internal company codebases, or recent events. RAG grounds the model in factual reality.',
        keyPoints: [
          'Parametric vs Non-Parametric: Parametric memory lives in frozen weights. Non-parametric memory lives in dynamic external document databases.',
          'Zero Retraining Required: You can update your knowledge base in seconds by adding new embeddings without retraining or fine-tuning models.',
          'Verifiable Sources: RAG enables direct source citations, allowing users to verify the exact document chunk used to generate each response sentence.',
        ],
        targetChallengeId: 'micro-quiz',
        targetChallengeName: 'Test Your RAG Basics in Micro-Quiz',
      },
      {
        id: 'ingestion-phase',
        title: '2. Phase 1 - Ingestion & Chunking',
        badge: 'Data Preparation',
        summary:
          'Raw files (PDFs, Markdown, HTML) cannot be fed directly into vector search. Documents must be parsed into clean text and sliced into manageable chunks.',
        keyPoints: [
          'Document Parsing: Strips styling tags, converts PDF layouts, and extracts core textual bodies and metadata.',
          'Chunk Size: Typically 256 to 512 tokens. Too small loses contextual meaning; too large dilutes specific semantic facts.',
          'Chunk Overlap: Overlapping chunks by 32 to 64 tokens ensures sentences split at boundary edges do not lose context.',
          'Embedding Conversion: An embedding model (such as text-embedding-3) converts each text chunk into a high-dimensional vector array (e.g. 1536 dimensions).',
        ],
        codeSnippet: {
          language: 'python',
          code: `# Standard recursive text chunking with overlap
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " "]
)
chunks = splitter.split_text(raw_document_text)`,
        },
        targetChallengeId: 'pipeline-bubble',
        targetChallengeName: 'Build Ingestion Order in Pipeline Bubble',
      },
      {
        id: 'retrieval-phase',
        title: '3. Phase 2 - Vector Search & Indexing',
        badge: 'Search & Retrieval',
        summary:
          'When a user asks a question, the question is converted into an embedding. The vector database performs similarity search against millions of stored chunk vectors.',
        keyPoints: [
          'HNSW Indexing: Hierarchical Navigable Small World graphs enable logarithmic approximate nearest neighbor search in under 10ms.',
          'Cosine Similarity: Measures the angular direction between the query vector and document vectors. A score of 1.0 represents an identical semantic direction.',
          'Hybrid Search: Combines dense vector similarity with sparse BM25 keyword matching to catch exact part numbers, acronyms, and product IDs.',
          'Top-K Selection: The system extracts the top K most similar chunks (e.g., top 3 to 5 chunks) as retrieval candidates.',
        ],
        pitfallWarning:
          'Caution: Forgetting to normalize vector lengths or incorrectly sorting similarities in ascending order will retrieve irrelevant documents.',
        targetChallengeId: 'error-hunter',
        targetChallengeName: 'Catch Vector Sorting Bugs in Error Hunter',
      },
      {
        id: 'generation-phase',
        title: '4. Phase 3 - Reranking, Prompting & Generation',
        badge: 'Synthesis & Generation',
        summary:
          'The retrieved chunks are refined through cross-encoder reranking and packed into a prompt template alongside the user question for final LLM synthesis.',
        keyPoints: [
          'Reranking: A cross-encoder model (like Cohere Rerank) examines query-chunk pairs simultaneously to score pure relevance, selecting the top 3 best passages.',
          'Prompt Assembly: The prompt template clearly instructs the LLM: "Answer the question using only the provided context. If the answer cannot be found, state that you do not know."',
          'Streaming Generation: The LLM streams the grounded answer back to the user with references to the specific chunk IDs.',
        ],
        codeSnippet: {
          language: 'markdown',
          code: `SYSTEM: You are a factual enterprise assistant.
Answer the user query strictly using the following retrieved context.
If the answer cannot be derived from the context, state "I cannot find this information in the documents."

CONTEXT:
[Doc 1]: The Q3 refund window is 30 calendar days from invoice date.
[Doc 2]: Warranty replacements require an original RMA authorization code.

USER QUESTION: What is the refund policy for Q3?`,
        },
        targetChallengeId: 'decision-simulator',
        targetChallengeName: 'Analyze Architecture Tradeoffs in Simulator',
      },
    ],
  },
  {
    id: 'image-recognition',
    title: 'Computer Vision & Image Recognition',
    shortTitle: 'Computer Vision',
    tagline: 'Explore CNNs, Vision Transformers, object detection pipelines, and edge inference.',
    status: 'coming_soon',
    level: 'Beginner',
    estimatedTime: '25 mins',
    totalXp: 100,
    iconName: 'Eye',
    overview:
      'Understand how artificial intelligence processes visual information, from pixel matrices and convolutional filters to state-of-the-art Vision Transformers (ViT) and real-time YOLO object detectors.',
    keyTopics: [
      'Pixel Convolutions & Feature Maps',
      'Pooling & Downsampling',
      'Vision Transformer (ViT) Patch Embeddings',
      'Object Detection & Bounding Boxes',
      'Non-Maximum Suppression (NMS)',
      'Edge Quantization (INT8 vs FP16)',
    ],
    challenges: [
      {
        id: 'cv-pipeline-bubble',
        name: 'Vision Pipeline Bubble',
        type: 'pipeline-bubble',
        badge: 'Sequence Builder',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Sequence the image preprocessing, backbone inference, and bounding box decoding steps.',
      },
      {
        id: 'cv-error-hunter',
        name: 'Vision Code Hunter',
        type: 'error-hunter',
        badge: 'Code Debugger',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Find silent channel dimension ordering (NCHW vs NHWC) errors causing zero-accuracy predictions.',
      },
      {
        id: 'cv-micro-quiz',
        name: 'Timed Vision Micro-Quiz',
        type: 'micro-quiz',
        badge: '20s Speed Drill',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Answer fast direct questions on receptive fields, kernel strides, and feature maps.',
      },
      {
        id: 'cv-decision-simulator',
        name: 'Edge Vision Simulator',
        type: 'decision-simulator',
        badge: 'System Architect',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Balance frames-per-second, VRAM footprint, and mean Average Precision (mAP) for drone cameras.',
      },
    ],
    guideSections: [],
  },
  {
    id: 'agentic-workflows',
    title: 'Agentic AI & Function Calling',
    shortTitle: 'AI Agents',
    tagline: 'Master autonomous reasoning loops, tool calling, execution sandboxes, and multi-agent coordination.',
    status: 'coming_soon',
    level: 'Intermediate',
    estimatedTime: '25 mins',
    totalXp: 100,
    iconName: 'Bot',
    overview:
      'Move beyond single-turn prompt-response interactions. Learn how AI agents reason through complex goals, call APIs and execute database queries, inspect results, and recover from runtime errors.',
    keyTopics: [
      'ReAct Framework (Reason + Act)',
      'Tool Definition & JSON Schema Validation',
      'Environment Feedback Loops',
      'Stateful Memory & Task Graphs',
      'Safety Guardrails & Tool Authorization',
    ],
    challenges: [
      {
        id: 'agent-pipeline-bubble',
        name: 'Agent Loop Bubble',
        type: 'pipeline-bubble',
        badge: 'Sequence Builder',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Construct the cyclical Thought-Action-Observation loop with fallback safeguards.',
      },
      {
        id: 'agent-error-hunter',
        name: 'Tool Call Debugger',
        type: 'error-hunter',
        badge: 'Code Debugger',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Diagnose recursive hallucination loops and unvalidated JSON schema tool arguments.',
      },
      {
        id: 'agent-micro-quiz',
        name: 'Timed Agent Micro-Quiz',
        type: 'micro-quiz',
        badge: '20s Speed Drill',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Direct questions on ReAct loops, context truncation, and idempotency.',
      },
      {
        id: 'agent-decision-simulator',
        name: 'Agent Architecture Tradeoffs',
        type: 'decision-simulator',
        badge: 'System Architect',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Choose between centralized planner agents and choreographed subagents for latency vs reliability.',
      },
    ],
    guideSections: [],
  },
  {
    id: 'fine-tuning',
    title: 'LLM Fine-Tuning & Alignment',
    shortTitle: 'Fine-Tuning',
    tagline: 'Adapt base models using LoRA, QLoRA, DPO, and reinforcement learning techniques.',
    status: 'coming_soon',
    level: 'Advanced',
    estimatedTime: '30 mins',
    totalXp: 100,
    iconName: 'Sliders',
    overview:
      'Learn how parameter-efficient fine-tuning (PEFT) and modern preference optimization allow developers to specialize open-weights models on consumer GPUs without training from scratch.',
    keyTopics: [
      'Low-Rank Adaptation (LoRA) & Rank Matrices',
      '4-Bit NormalFloat Quantized LoRA (QLoRA)',
      'Supervised Fine-Tuning (SFT) Formatting',
      'Direct Preference Optimization (DPO)',
      'Loss Curves & Catastrophic Forgetting',
    ],
    challenges: [
      {
        id: 'ft-pipeline-bubble',
        name: 'PEFT Pipeline Bubble',
        type: 'pipeline-bubble',
        badge: 'Sequence Builder',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Order the dataset formatting, tokenizer padding, LoRA adapter injection, and SFT trainer steps.',
      },
      {
        id: 'ft-error-hunter',
        name: 'Training Loop Debugger',
        type: 'error-hunter',
        badge: 'Code Debugger',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Detect gradient accumulation bugs and learning rate warmup issues causing NaN loss.',
      },
      {
        id: 'ft-micro-quiz',
        name: 'Timed Fine-Tuning Quiz',
        type: 'micro-quiz',
        badge: '20s Speed Drill',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Test knowledge on rank hyperparameters, alpha scaling, and memory savings.',
      },
      {
        id: 'ft-decision-simulator',
        name: 'Hardware & Batch Size Tuner',
        type: 'decision-simulator',
        badge: 'System Architect',
        estimatedMinutes: 5,
        xpReward: 25,
        description: 'Select optimal batch size, gradient checkpointing, and precision for single 24GB GPUs.',
      },
    ],
    guideSections: [],
  },
];
