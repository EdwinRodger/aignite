export interface CoachQuestion {
  id: string;
  forDate: string; // YYYY-MM-DD or identifier
  title: string;
  topic: string;
  track: 'Inference & Infra' | 'GenAI & LLMs' | 'Agents & RL' | 'Distributed Systems';
  difficulty: 'Intermediate' | 'Advanced' | 'Staff/Principal';
  questionText: string;
  contextHint: string;
  canonicalKeyPoints: string[];
  suggestedModelAnswer: string;
  estimatedSpeakingTime: string;
}

export interface CoachEvaluationReport {
  questionId: string;
  transcript: string;
  durationSeconds: number;
  speechMetrics: {
    wordsPerMinute: number;
    fillerWordsDetected: string[];
    fillerCount: number;
    paceRating: 'Too Slow' | 'Natural & Confident' | 'Rushed';
  };
  scores: {
    knowledgeScore: number; // 0.0 - 10.0
    confidenceScore: number;
    communicationScore: number;
    examplesScore: number;
    industryReadinessScore: number;
    compositeScore: number;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  principalModelAnswer: string;
  evaluatedAt: string;
}

export const DAILY_COACH_QUESTIONS: CoachQuestion[] = [
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
      'FlashAttention-3 maximizes Hopper H100 hardware by tackling the fundamental memory bandwidth bottleneck in attention computation. In traditional attention, intermediate N-by-N attention matrices must be read from and written to high-bandwidth global memory (HBM), creating an IO bottleneck. FlashAttention-3 introduces Warp Specialization, which partitions GPU warps into dedicated producer warps—responsible for loading tiles from HBM—and consumer warps—responsible for executing Tensor Core matrix operations. By leveraging Hopper’s hardware Tensor Memory Accelerator (TMA), producer warps asynchronously transfer data directly into shared memory (SRAM) without consuming register file bandwidth. Simultaneously, consumer warps compute FP8 scaled dot-products. This total overlap of memory transfers with computation allows FlashAttention-3 to sustain up to 75% of theoretical peak FP8 TFLOPs.',
    estimatedSpeakingTime: '60–90 seconds',
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
    estimatedSpeakingTime: '60–90 seconds',
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
    estimatedSpeakingTime: '45–75 seconds',
  },
];
