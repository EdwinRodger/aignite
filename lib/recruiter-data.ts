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
    rawText?: string;
    resumeFileUrl?: string;
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

export const TALENT_POOL_SEEDS: CandidateTalent[] = [];

export const INITIAL_RECRUITER_JOBS: RecruiterJob[] = [];

export const INITIAL_INVITATIONS: InterviewInvitation[] = [];
