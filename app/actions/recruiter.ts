'use server';

import {
  TALENT_POOL_SEEDS,
  CandidateTalent,
  INITIAL_RECRUITER_JOBS,
  RecruiterJob,
  INITIAL_INVITATIONS,
  InterviewInvitation,
} from '@/lib/recruiter-data';
import { cookies } from 'next/headers';

export interface CandidateFilters {
  minLeagueTier?: string;
  requiredBadge?: string;
  minReportScore?: number;
  roleCategory?: string;
  query?: string;
}

const TIER_ORDER: Record<string, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  diamond: 4,
  architect: 5,
};

/**
 * Fetches filtered candidate talent pool with verification safeguards.
 */
export async function getCandidateTalentPoolAction(
  filters?: CandidateFilters
): Promise<{ success: boolean; candidates: CandidateTalent[] }> {
  let list = [...TALENT_POOL_SEEDS];

  if (filters) {
    if (filters.minLeagueTier && filters.minLeagueTier !== 'all') {
      const minVal = TIER_ORDER[filters.minLeagueTier] || 1;
      list = list.filter((c) => (TIER_ORDER[c.leagueTier] || 1) >= minVal);
    }

    if (filters.requiredBadge && filters.requiredBadge !== 'all') {
      list = list.filter((c) => c.verifiedBadges.includes(filters.requiredBadge!));
    }

    if (filters.minReportScore && filters.minReportScore > 0) {
      list = list.filter((c) => c.reportCard.overallScore >= filters.minReportScore!);
    }

    if (filters.roleCategory && filters.roleCategory !== 'all') {
      const target = filters.roleCategory.toLowerCase();
      list = list.filter(
        (c) =>
          c.resume.targetRole.toLowerCase().includes(target) ||
          c.headline.toLowerCase().includes(target)
      );
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          c.collegeOrCompany.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.resume.skills.frameworks.some((f) => f.toLowerCase().includes(q)) ||
          c.resume.skills.models.some((m) => m.toLowerCase().includes(q))
      );
    }
  }

  return { success: true, candidates: list };
}

/**
 * Retrieves full candidate dossier for deep technical evaluation.
 */
export async function getCandidateDossierAction(
  candidateId: string
): Promise<{ success: boolean; candidate?: CandidateTalent; error?: string }> {
  const candidate = TALENT_POOL_SEEDS.find((c) => c.id === candidateId);
  if (!candidate) {
    return { success: false, error: 'Candidate profile not found' };
  }
  return { success: true, candidate };
}

/**
 * Dispatches a verified corporate interview invitation.
 */
export async function sendInterviewInvitationAction(
  candidateId: string,
  payload: {
    candidateName?: string;
    companyName: string;
    roleTitle: string;
    roundType: 'Screening Call' | 'Systems Architecture' | 'Coding & Live Inference' | 'Executive Bar Raiser';
    customNote: string;
  }
): Promise<{ success: boolean; invitation?: InterviewInvitation; error?: string }> {
  const candidate = TALENT_POOL_SEEDS.find((c) => c.id === candidateId);
  const candidateName = candidate?.fullName || payload.candidateName || 'Verified Candidate';

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get('aignite_recruiter_invitations')?.value;
  let invitations: InterviewInvitation[] = INITIAL_INVITATIONS;

  if (existingCookie) {
    try {
      invitations = JSON.parse(existingCookie);
    } catch {
      invitations = INITIAL_INVITATIONS;
    }
  }

  const newInvitation: InterviewInvitation = {
    id: `inv-${Date.now()}`,
    candidateId: candidate?.id || candidateId,
    candidateName,
    companyName: payload.companyName || 'Verified Enterprise',
    roleTitle: payload.roleTitle,
    roundType: payload.roundType,
    customNote: payload.customNote,
    status: 'Sent',
    sentAt: 'Just now',
  };

  invitations = [newInvitation, ...invitations];

  cookieStore.set('aignite_recruiter_invitations', JSON.stringify(invitations), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true, invitation: newInvitation };
}

/**
 * Retrieves recruiter job postings.
 */
export async function getRecruiterJobsAction(): Promise<{ success: boolean; jobs: RecruiterJob[] }> {
  const cookieStore = await cookies();
  const storedJobsCookie = cookieStore.get('aignite_recruiter_jobs')?.value;

  if (storedJobsCookie) {
    try {
      const jobs: RecruiterJob[] = JSON.parse(storedJobsCookie);
      return { success: true, jobs };
    } catch {
      // fallback
    }
  }

  return { success: true, jobs: INITIAL_RECRUITER_JOBS };
}

/**
 * Posts a new AI engineering role with prerequisite badge & league thresholds.
 */
export async function createJobPostingAction(jobData: {
  companyName: string;
  title: string;
  roleCategory: 'GenAI & LLM' | 'AI Systems & Inference' | 'Distributed Training & CUDA' | 'Computer Vision & Multimodal' | 'Agent Architect';
  location: string;
  salaryRange: string;
  minLeagueTier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect';
  requiredBadges: string[];
  minReportScore: number;
  description: string;
}): Promise<{ success: boolean; job?: RecruiterJob; error?: string }> {
  const cookieStore = await cookies();
  const storedJobsCookie = cookieStore.get('aignite_recruiter_jobs')?.value;
  let jobs: RecruiterJob[] = INITIAL_RECRUITER_JOBS;

  if (storedJobsCookie) {
    try {
      jobs = JSON.parse(storedJobsCookie);
    } catch {
      jobs = INITIAL_RECRUITER_JOBS;
    }
  }

  const logoMap: Record<string, string> = {
    'NVIDIA India': '🟢',
    'Google DeepMind': '🔵',
    'Sarvam AI': '🟧',
    'Microsoft AI India': '🟦',
    'OpenAI': '🟣',
  };

  const newJob: RecruiterJob = {
    id: `job-${Date.now()}`,
    companyName: jobData.companyName,
    companyLogo: logoMap[jobData.companyName] || '💼',
    title: jobData.title,
    roleCategory: jobData.roleCategory,
    location: jobData.location || 'Bengaluru / Remote',
    salaryRange: jobData.salaryRange || 'Competitive CTC',
    minLeagueTier: jobData.minLeagueTier,
    requiredBadges: jobData.requiredBadges || [],
    minReportScore: Number(jobData.minReportScore) || 7.0,
    applicantsCount: 0,
    postedDate: 'Just now',
    description: jobData.description,
    isActive: true,
  };

  jobs = [newJob, ...jobs];

  cookieStore.set('aignite_recruiter_jobs', JSON.stringify(jobs), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true, job: newJob };
}

/**
 * Retrieves all sent invitations for the recruiter.
 */
export async function getRecruiterInvitationsAction(): Promise<{
  success: boolean;
  invitations: InterviewInvitation[];
}> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get('aignite_recruiter_invitations')?.value;

  if (existingCookie) {
    try {
      const invitations: InterviewInvitation[] = JSON.parse(existingCookie);
      return { success: true, invitations };
    } catch {
      // fallback
    }
  }

  return { success: true, invitations: INITIAL_INVITATIONS };
}
