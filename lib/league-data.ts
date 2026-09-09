export interface LeagueTier {
  id: 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect';
  name: string;
  badgeIcon: string;
  accentColor: string;
  borderColor: string;
  minPoints: number;
  perks: string[];
  description: string;
}

export interface BracketMember {
  id: string;
  rank: number;
  name: string;
  username: string;
  collegeOrCompany: string;
  region: string;
  weeklyPoints: number;
  rankChange: number; // +2, -1, 0
  isCurrentUser?: boolean;
  avatarBg: string;
  badges: string[];
  streakDays: number;
}

export interface WeeklyChallenge {
  id: string;
  weekNumber: number;
  title: string;
  category: string;
  prompt: string;
  pointsAwarded: number;
  sampleSubmissionHint: string;
  submissionsCount: number;
}

export interface AchievementBadge {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  recruiterValue: 'High' | 'Elite' | 'Distinguished';
}

export const LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'bronze',
    name: 'Bronze AI Engineer',
    badgeIcon: '🥉',
    accentColor: 'from-amber-700/20 to-orange-950/30',
    borderColor: 'border-amber-700/40',
    minPoints: 0,
    perks: ['Access to daily AI Sparks feed', 'Standard interview question pool'],
    description: 'Starting competitive division for all new AIgnite learners.',
  },
  {
    id: 'silver',
    name: 'Silver AI Engineer',
    badgeIcon: '🥈',
    accentColor: 'from-slate-400/20 to-zinc-700/30',
    borderColor: 'border-slate-400/40',
    minPoints: 200,
    perks: ['Unlocks company-specific mock challenges', 'Silver profile badge visible to recruiters'],
    description: 'Consistent practitioners mastering core PyTorch and RAG pipelines.',
  },
  {
    id: 'gold',
    name: 'Gold AI Engineer',
    badgeIcon: '🥇',
    accentColor: 'from-amber-400/20 to-yellow-600/30',
    borderColor: 'border-amber-400/40',
    minPoints: 500,
    perks: ['Direct recruiter talent pool listing', 'Priority speech coach evaluation'],
    description: 'Top 25% percentile demonstrating strong systems trade-off thinking.',
  },
  {
    id: 'diamond',
    name: 'LLM Master',
    badgeIcon: '💎',
    accentColor: 'from-cyan-400/20 to-blue-600/30',
    borderColor: 'border-cyan-400/40',
    minPoints: 1000,
    perks: ['Exclusive frontier lab interview challenges', 'Featured candidate card on recruiter homepage'],
    description: 'Advanced practitioners proficient in distributed training, GQA, and kernel optimization.',
  },
  {
    id: 'architect',
    name: 'AI Architect',
    badgeIcon: '👑',
    accentColor: 'from-primary/25 to-accent/30',
    borderColor: 'border-primary/50',
    minPoints: 2000,
    perks: ['Top 1% National Ranking recognition', 'Fast-track interview invitations from verified partners'],
    description: 'Elite architects capable of designing end-to-end multimodal systems from scratch.',
  },
];

export const INITIAL_BRACKET_MEMBERS: BracketMember[] = [];

export const WEEKLY_LEAGUE_CHALLENGES: WeeklyChallenge[] = [];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-rag-master',
    name: 'RAG Master',
    category: 'Systems Architecture',
    icon: '🎖️',
    description: 'Flawless assembly of the RAG Pipeline in the Bubble Game with hybrid search and reranker.',
    requirement: 'Complete the RAG Master Bubble Game challenge with 0 errors.',
    isUnlocked: true,
    unlockedAt: 'Yesterday',
    recruiterValue: 'Elite',
  },
  {
    id: 'badge-cuda-ninja',
    name: 'NVIDIA TensorRT Specialist',
    category: 'Hardware Acceleration',
    icon: '🟢',
    description: 'Mastery over CUDA memory hierarchies, TensorRT-LLM engines, and FP8 quantization.',
    requirement: 'Score > 8.0 on the NVIDIA Company Pack Capstone.',
    isUnlocked: true,
    unlockedAt: '2 days ago',
    recruiterValue: 'Elite',
  },
  {
    id: 'badge-agent-architect',
    name: 'Agent Architect',
    category: 'Agent Systems',
    icon: '🤖',
    description: 'Proven ability to build ReAct agentic loops with strict JSON schema tool validation.',
    requirement: 'Complete the OpenAI Pack and pass the Tool Calling Error Hunter challenge.',
    isUnlocked: false,
    recruiterValue: 'Distinguished',
  },
  {
    id: 'badge-flame-streak',
    name: '7-Day Flame Streak',
    category: 'Consistency & Dedication',
    icon: '🔥',
    description: 'Answered the Daily Voice Coach question 7 consecutive mornings at 8:00 AM.',
    requirement: 'Maintain a 7-day daily speaking streak.',
    isUnlocked: false,
    recruiterValue: 'High',
  },
  {
    id: 'badge-vector-wizard',
    name: 'Vector Wizard',
    category: 'Data & Retrieval',
    icon: '🔮',
    description: 'Top evaluation on pgvector HNSW vs IVFFlat indexing tradeoffs under sub-50ms constraints.',
    requirement: 'Solve the AI Decision Simulator Vector Mission with optimal rating.',
    isUnlocked: true,
    unlockedAt: '3 days ago',
    recruiterValue: 'High',
  },
  {
    id: 'badge-prompt-titan',
    name: 'Prompt Titan',
    category: 'LLM Steering',
    icon: '⚡',
    description: 'Zero format errors in structured JSON output generation and safety guardrail prompts.',
    requirement: 'Complete Error Hunter on Structured Outputs without hint.',
    isUnlocked: false,
    recruiterValue: 'High',
  },
];
