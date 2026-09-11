export interface SocialFeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  sourceType: 'news' | 'user' | 'lab';
  sourceName?: string;
  sourceUrl?: string;
  title: string;
  summary: string;
  keyTakeaway?: string;
  mediaUrl?: string;
  mediaType: 'video' | 'image' | 'none';
  category: 'GenAI' | 'Robotics' | 'Computer Vision' | 'ML Systems' | 'Student Projects' | 'Deep Learning';
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface InterleavedQuiz {
  id: string;
  category: 'Machine Learning' | 'Deep Learning' | 'Data Science' | 'GenAI' | 'AI Fundamentals';
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  pointsAwarded: number;
}

export const SEED_SOCIAL_POSTS: SocialFeedPost[] = [
  {
    id: 'spark-post-01',
    authorName: 'Google DeepMind',
    authorHandle: '@deepmind',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    sourceType: 'news',
    sourceName: 'DeepMind Robotics Lab',
    sourceUrl: 'https://deepmind.google/discover/blog',
    title: 'Gemini 2.0 RT: Real-Time Vision-Language-Action in Autonomous Robotics',
    summary: 'DeepMind demonstrated end-to-end multimodal manipulation where robotic arms synthesize visual observation and natural language instructions into continuous 20Hz motor control trajectories.',
    keyTakeaway: 'Zero-shot generalist robots can now manipulate objects outside their training distribution using spatial reasoning tokens.',
    mediaUrl: '/videos/gemini-robotics.mp4',
    mediaType: 'video',
    category: 'Robotics',
    tags: ['#DeepMind', '#Robotics', '#VLA', '#AutonomousAgents'],
    likesCount: 1420,
    commentsCount: 86,
    createdAt: '2h ago',
  },
  {
    id: 'spark-post-02',
    authorName: 'Aarav Mehta',
    authorHandle: '@aarav_codes',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    sourceType: 'user',
    title: 'Ran an 8B Vision-LLM Locally on MacBook Pro at 42 FPS Using Apple MLX!',
    summary: 'Just finished porting the latest compact vision transformer to Apple silicon using Apple MLX. Unified memory allows zero-copy image encoding directly into the attention cache.',
    keyTakeaway: 'Unified memory architecture on Apple silicon completely eliminates PCIe transfer latency for edge multimodal models.',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'Student Projects',
    tags: ['#MLX', '#AppleSilicon', '#EdgeAI', '#LocalLLM'],
    likesCount: 512,
    commentsCount: 34,
    createdAt: '4h ago',
  },
  {
    id: 'spark-post-03',
    authorName: 'Hugging Face Research',
    authorHandle: '@huggingface',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=120&auto=format&fit=crop&q=80',
    sourceType: 'news',
    sourceName: 'Hugging Face Daily Papers',
    sourceUrl: 'https://huggingface.co/papers',
    title: 'DeepSeek-V3 Multi-Head Latent Attention (MLA) Explained',
    summary: 'MLA compresses Key-Value activation states into a low-rank latent vector during inference, reducing inference KV cache memory consumption by up to 93.3% compared to standard MHA.',
    keyTakeaway: 'Compressing KV states into low-rank representations allows 5x longer context windows on identical GPU clusters.',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'ML Systems',
    tags: ['#DeepSeek', '#OpenSourceAI', '#KVCache', '#InferenceEfficiency'],
    likesCount: 2310,
    commentsCount: 147,
    createdAt: '6h ago',
  },
  {
    id: 'spark-post-04',
    authorName: 'Priya Sharma',
    authorHandle: '@priya_ml',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    sourceType: 'user',
    title: 'Fine-Tuning Llama-3-8B with QLoRA on Free Colab T4 in 19 Minutes',
    summary: 'Tested 4-bit NormalFloat (NF4) quantization combined with Double Quantization and paged optimizers on a custom clinical Q&A dataset. Zero out-of-memory spikes encountered.',
    keyTakeaway: 'QLoRA preserves 99.3% of 16-bit performance while fitting within 6GB VRAM on accessible consumer and cloud GPUs.',
    mediaUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'Student Projects',
    tags: ['#QLoRA', '#FineTuning', '#PyTorch', '#OpenSource'],
    likesCount: 418,
    commentsCount: 28,
    createdAt: '7h ago',
  },
  {
    id: 'spark-post-05',
    authorName: 'OpenAI Research',
    authorHandle: '@openai',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    sourceType: 'news',
    sourceName: 'OpenAI Video Models',
    sourceUrl: 'https://openai.com/research',
    title: 'Sora Diffusion Spacetime Patches: Simulating Digital Worlds',
    summary: 'Video generation models trained on 3D spacetime visual patches demonstrate emergent physical world consistency, camera motion persistence, and realistic fluid dynamics.',
    keyTakeaway: 'Treating video as a collection of spacetime patches turns video synthesis into a scalable generative scaling problem.',
    mediaUrl: '/videos/sora-spacetime.mp4',
    mediaType: 'video',
    category: 'GenAI',
    tags: ['#Sora', '#GenerativeVideo', '#DiffusionModels', '#OpenAI'],
    likesCount: 3890,
    commentsCount: 215,
    createdAt: '9h ago',
  },
  {
    id: 'spark-post-06',
    authorName: 'NVIDIA AI Tech',
    authorHandle: '@nvidia_ai',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    sourceType: 'lab',
    sourceName: 'NVIDIA Developer',
    sourceUrl: 'https://developer.nvidia.com',
    title: 'Blackwell NVLink 5 & FP4 Tensor Cores: 30x Real-Time Throughput',
    summary: 'The Blackwell dual-die architecture introduces second-generation Transformer Engine with native microscopic scaling FP4 precision, cutting energy consumption by 25x.',
    keyTakeaway: 'Hardware and software co-design around FP4 quantization enables trillion-parameter inference in single NVLink domains.',
    mediaUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'ML Systems',
    tags: ['#NVIDIA', '#Blackwell', '#GPU', '#HardwareAcceleration'],
    likesCount: 1820,
    commentsCount: 94,
    createdAt: '12h ago',
  },
  {
    id: 'spark-post-07',
    authorName: 'Kavita Patel',
    authorHandle: '@kavita_nlp',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    sourceType: 'user',
    title: 'Benchmarking vLLM vs HuggingFace TGI Under 250 Concurrent Queries',
    summary: 'Ran load tests on two A100 GPUs comparing PagedAttention in vLLM against standard attention. vLLM maintained P99 latency below 38ms while baseline throttled at 75 concurrent requests.',
    keyTakeaway: 'PagedAttention eliminates virtual memory fragmentation in attention blocks, preventing GPU memory starvation.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'ML Systems',
    tags: ['#vLLM', '#Performance', '#Benchmarking', '#DistributedSystems'],
    likesCount: 685,
    commentsCount: 42,
    createdAt: '14h ago',
  },
  {
    id: 'spark-post-08',
    authorName: 'Anthropic AI',
    authorHandle: '@anthropic',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    sourceType: 'news',
    sourceName: 'Anthropic Research',
    sourceUrl: 'https://www.anthropic.com/research',
    title: 'Claude 3.7 Sonnet: Hybrid Dynamic Reasoning Architecture',
    summary: 'Introduces variable thinking budgets where developers can dial between instantaneous conversational inference and extensive multi-step algorithmic verification in a unified model.',
    keyTakeaway: 'Dynamic compute scaling at test time yields higher reasoning gains than simply increasing pre-training parameter counts.',
    mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'GenAI',
    tags: ['#Anthropic', '#Claude', '#ReasoningModels', '#TestTimeCompute'],
    likesCount: 2940,
    commentsCount: 168,
    createdAt: '16h ago',
  },
  {
    id: 'spark-post-09',
    authorName: 'Figure Robotics',
    authorHandle: '@figurerevolution',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80',
    sourceType: 'news',
    sourceName: 'Figure AI Systems',
    sourceUrl: 'https://www.figure.ai',
    title: 'Figure 02 Humanoid Deployed on BMW Assembly Line',
    summary: 'Humanoid robots operating completely autonomously on live automotive chassis assembly, using onboard neural networks for sub-millimeter sheet metal insertion.',
    keyTakeaway: 'Embodied AI has crossed the milestone from laboratory demonstrations into commercial industrial mass manufacturing.',
    mediaUrl: '/videos/figure-humanoid.mp4',
    mediaType: 'video',
    category: 'Robotics',
    tags: ['#Humanoid', '#Figure02', '#BMW', '#IndustrialAutomation'],
    likesCount: 3105,
    commentsCount: 230,
    createdAt: '18h ago',
  },
  {
    id: 'spark-post-10',
    authorName: 'Rohan Verma',
    authorHandle: '@rohan_vision',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    sourceType: 'user',
    title: 'Interactive 3D Gaussian Splatting in Real-Time WebGL',
    summary: 'Exported a 2.5 million Gaussian point cloud scanned with iPhone LiDAR and rendered it at a smooth 60 FPS directly in the browser using custom WebGL rasterizers.',
    keyTakeaway: '3D Gaussian Splatting achieves photorealistic radiance field synthesis without the expensive ray marching of NeRFs.',
    mediaUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    category: 'Computer Vision',
    tags: ['#GaussianSplatting', '#WebGL', '#3DVision', '#LiDAR'],
    likesCount: 540,
    commentsCount: 31,
    createdAt: '1d ago',
  },
];

export const SEED_INTERLEAVED_QUIZZES: InterleavedQuiz[] = [
  {
    id: 'quiz-easy-01',
    category: 'Machine Learning',
    questionText: 'What does the term "overfitting" mean in machine learning?',
    options: [
      'The model memorizes training noise and fails to generalize to unseen data',
      'The model takes too long to execute on GPUs',
      'The model has fewer parameters than the dataset rows',
    ],
    correctOptionIndex: 0,
    explanation: 'Overfitting occurs when a model learns the statistical noise in training data rather than underlying patterns, degrading test performance.',
    pointsAwarded: 5,
  },
  {
    id: 'quiz-easy-02',
    category: 'Deep Learning',
    questionText: 'Why is the ReLU activation function widely preferred over Sigmoid in deep neural networks?',
    options: [
      'It mitigates the vanishing gradient problem in deep layers',
      'It restricts all outputs strictly between 0 and 1',
      'It eliminates the need for backpropagation',
    ],
    correctOptionIndex: 0,
    explanation: 'For positive inputs, ReLU has a constant gradient of 1, preventing gradients from shrinking exponentially during backpropagation in deep networks.',
    pointsAwarded: 5,
  },
  {
    id: 'quiz-easy-03',
    category: 'GenAI',
    questionText: 'What is the primary role of the KV Cache during autoregressive LLM inference?',
    options: [
      'Avoid recomputing Key and Value attention matrices for previous tokens',
      'Compress model weights into INT4 format',
      'Translate English prompt tokens into Spanish embeddings',
    ],
    correctOptionIndex: 0,
    explanation: 'By caching Key and Value vectors of past tokens, the transformer only needs to compute attention for the single newly generated token at each step.',
    pointsAwarded: 5,
  },
  {
    id: 'quiz-easy-04',
    category: 'Data Science',
    questionText: 'Which evaluation metric is best suited for severe class imbalance (e.g. 99% negative, 1% fraud)?',
    options: [
      'PR-AUC (Precision-Recall Area Under Curve) or F1 Score',
      'Raw Accuracy Percentage',
      'Mean Squared Error (MSE)',
    ],
    correctOptionIndex: 0,
    explanation: 'A naive model predicting negative every time achieves 99% raw accuracy. PR-AUC and F1 measure true positive detection reliability despite class imbalance.',
    pointsAwarded: 5,
  },
  {
    id: 'quiz-easy-05',
    category: 'AI Fundamentals',
    questionText: 'In Reinforcement Learning from Human Feedback (RLHF), what does the Reward Model do?',
    options: [
      'Predicts a numerical scalar score representing human preference for model outputs',
      'Converts audio speech files to text transcripts',
      'Generates synthetic negative test samples',
    ],
    correctOptionIndex: 0,
    explanation: 'The reward model is trained on pairs of human-ranked outputs to score candidate responses, guiding policy optimization via PPO or DPO.',
    pointsAwarded: 5,
  },
];

export interface JobPostingFeedItem {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  roleCategory: string;
  employmentType?: string;
  description: string;
  minimumLeagueTier?: string;
  minReportCardScore?: string;
  salaryRange?: string;
  location: string;
  applyUrl?: string;
  skillsRequired?: string[];
  createdAt?: string;
}

export type FeedItem =
  | { type: 'post'; post: SocialFeedPost }
  | { type: 'quiz'; quiz: InterleavedQuiz }
  | { type: 'job'; job: JobPostingFeedItem };

export const SEED_JOB_POSTINGS: JobPostingFeedItem[] = [
  {
    id: 'job-deepmind-01',
    companyName: 'Google DeepMind',
    companyLogoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&auto=format&fit=crop&q=80',
    title: 'Research Engineer - Multimodal Robot Learning',
    roleCategory: 'Robotics & Embodied AI',
    employmentType: 'Full-Time',
    description: 'Develop end-to-end vision-language-action policies for dexterous robotic manipulation on physical hardware clusters.',
    minimumLeagueTier: 'Silver AI Engineer',
    minReportCardScore: '7.5',
    salaryRange: '$175,000 - $240,000',
    location: 'Mountain View, CA / Hybrid',
    applyUrl: 'https://deepmind.google/careers',
    skillsRequired: ['PyTorch', 'Robotics VLA', 'Spatial Reasoning', 'C++'],
  },
  {
    id: 'job-nvidia-02',
    companyName: 'NVIDIA',
    companyLogoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    title: 'AI Inference & Kernel Optimization Engineer',
    roleCategory: 'ML Systems & Hardware',
    employmentType: 'Full-Time',
    description: 'Accelerate next-generation transformer inference kernels on Blackwell NVLink clusters with FP4 quantization and PagedAttention.',
    minimumLeagueTier: 'Gold AI Engineer',
    minReportCardScore: '8.0',
    salaryRange: '$160,000 - $220,000',
    location: 'Santa Clara, CA / Remote',
    applyUrl: 'https://www.nvidia.com/careers',
    skillsRequired: ['CUDA', 'Triton', 'TensorRT-LLM', 'C++20'],
  },
  {
    id: 'job-hf-03',
    companyName: 'Hugging Face',
    companyLogoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=120&auto=format&fit=crop&q=80',
    title: 'Open Source ML Systems Engineer',
    roleCategory: 'Open Source GenAI',
    employmentType: 'Full-Time',
    description: 'Build high-throughput open-source inference tooling and optimize model quantization for millions of global developers.',
    minimumLeagueTier: 'Bronze',
    minReportCardScore: '6.5',
    salaryRange: '$140,000 - $190,000',
    location: 'Remote (Global)',
    applyUrl: 'https://huggingface.co/jobs',
    skillsRequired: ['vLLM', 'Transformers', 'Distributed Training', 'Python'],
  },
  {
    id: 'job-figure-04',
    companyName: 'Figure AI',
    companyLogoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80',
    title: 'Autonomous Systems & Perception Engineer',
    roleCategory: 'Robotics',
    employmentType: 'Full-Time',
    description: 'Deploy autonomous perception networks on humanoid robots operating in industrial manufacturing facilities.',
    minimumLeagueTier: 'Silver AI Engineer',
    minReportCardScore: '7.0',
    salaryRange: '$165,000 - $210,000',
    location: 'Sunnyvale, CA',
    applyUrl: 'https://www.figure.ai/careers',
    skillsRequired: ['Computer Vision', 'Real-time Control', 'ROS2', 'SLAM'],
  },
];

/**
 * Helper to build an interleaved stream:
 * Inserts one easy MCQ trivia checkpoint every `quizInterval` posts (default: 4),
 * and one recruiter job opportunity card every `jobInterval` posts (default: 6).
 */
export function buildInterleavedFeed(
  posts: SocialFeedPost[],
  quizzes: InterleavedQuiz[] = SEED_INTERLEAVED_QUIZZES,
  jobs: JobPostingFeedItem[] = SEED_JOB_POSTINGS,
  quizInterval: number = 4,
  jobInterval: number = 6
): FeedItem[] {
  const items: FeedItem[] = [];
  let quizIndex = 0;
  let jobIndex = 0;

  for (let i = 0; i < posts.length; i++) {
    items.push({ type: 'post', post: posts[i] });

    const postNumber = i + 1;

    // Interleave quiz checkpoints
    if (postNumber % quizInterval === 0 && quizzes.length > 0) {
      const quiz = quizzes[quizIndex % quizzes.length];
      items.push({ type: 'quiz', quiz });
      quizIndex++;
    }

    // Interleave recruiter job postings
    if (postNumber % jobInterval === 0 && jobs.length > 0) {
      const job = jobs[jobIndex % jobs.length];
      items.push({ type: 'job', job });
      jobIndex++;
    }
  }

  return items;
}
