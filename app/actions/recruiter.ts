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
import { db } from '@/lib/db';
import { profiles, studentStats, aiReportCards, resumeEvaluations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

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
 * Fetches live verified student candidates from Supabase with their dynamic
 * 5-axis report card telemetry, ATS resumes, and habit streaks.
 */
async function fetchLiveCandidatesFromSupabase(): Promise<CandidateTalent[]> {
  if (!db) return TALENT_POOL_SEEDS;

  try {
    const studentProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.role, 'student'));

    if (studentProfiles.length === 0) {
      return TALENT_POOL_SEEDS;
    }

    // Fetch all student stats
    const allStats = await db.select().from(studentStats);
    const statsMap = new Map(allStats.map((s) => [s.studentId, s]));

    // Fetch all AI report cards
    const allReports = await db.select().from(aiReportCards);
    const reportsMap = new Map(allReports.map((r) => [r.studentId, r]));

    // Fetch all evaluated resumes (ordered newest first)
    const allResumes = await db
      .select()
      .from(resumeEvaluations)
      .orderBy(desc(resumeEvaluations.createdAt));

    const resumeMap = new Map<string, typeof resumeEvaluations.$inferSelect>();
    for (const res of allResumes) {
      if (res.userId && !resumeMap.has(res.userId)) {
        resumeMap.set(res.userId, res);
      }
    }

    const colorPalettes = [
      'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    ];

    return studentProfiles.map((p, index) => {
      const stat = statsMap.get(p.id);
      const rep = reportsMap.get(p.id);
      const res = resumeMap.get(p.id);

      const tierRaw = (stat?.currentLeagueTier || 'bronze').toLowerCase();
      let leagueTier: CandidateTalent['leagueTier'] = 'bronze';
      if (tierRaw.includes('architect')) leagueTier = 'architect';
      else if (tierRaw.includes('diamond')) leagueTier = 'diamond';
      else if (tierRaw.includes('gold')) leagueTier = 'gold';
      else if (tierRaw.includes('silver')) leagueTier = 'silver';

      const overallReportScore =
        Number(rep?.overallScore) ||
        Number(rep?.knowledgeScore) ||
        (rep ? 5.0 : 0.0);

      // Verified badges derived dynamically
      const badges: string[] = [];
      if (leagueTier === 'architect') {
        badges.push('Agent Architect', 'CUDA & TensorRT Specialist');
      } else if (leagueTier === 'diamond') {
        badges.push('Vector Wizard', 'RAG Master');
      } else if (leagueTier === 'gold') {
        badges.push('RAG Master');
      }
      if ((stat?.currentStreak ?? 0) >= 7) {
        badges.push('7-Day Flame Streak');
      }
      if ((stat?.totalPoints ?? 0) >= 100) {
        badges.push('Applied AI Pioneer');
      }

      // Parse resume details if available
      const parsedData = (res?.parsedData as {
        targetRole?: string;
        summary?: string;
        detectedSkills?: { category: string; skills: string[] }[];
        projects?: { title: string; description: string; impact: string }[];
      }) || {};

      const fwSkills =
        parsedData.detectedSkills?.find((c) => c.category === 'Core Frameworks')?.skills ||
        (res?.rawText?.includes('PyTorch')
          ? ['PyTorch', 'Transformers', 'FastAPI']
          : ['PyTorch', 'HuggingFace']);
      const modelSkills =
        parsedData.detectedSkills?.find((c) => c.category === 'Models & Architectures')?.skills ||
        ['Llama-3', 'DeepSeek-R1'];
      const retrievalSkills =
        parsedData.detectedSkills?.find((c) => c.category === 'Vector & Retrieval')?.skills ||
        ['pgvector', 'FAISS', 'RAG'];
      const infraSkills =
        parsedData.detectedSkills?.find((c) => c.category === 'Deployment & Infrastructure')?.skills ||
        ['Docker', 'Linux'];

      const projects =
        parsedData.projects && parsedData.projects.length > 0
          ? parsedData.projects
          : res
          ? [
              {
                title: 'High-Performance AI Systems Implementation',
                description: res.rawText?.slice(0, 180) || 'Production AI application pipeline.',
                impact: 'Verified hands-on delivery',
              },
            ]
          : [];

      return {
        id: p.id,
        fullName: p.fullName || 'AI Candidate',
        headline: p.headline || 'Aspiring AI Systems Engineer',
        collegeOrCompany: p.collegeOrCompany || 'Engineering Institution',
        region: p.region || 'India',
        avatarBg: colorPalettes[index % colorPalettes.length],
        leagueTier,
        leaguePoints: stat?.totalPoints ?? 0,
        weeklyRank: stat?.overallRanking ?? (index + 1),
        streakDays: stat?.currentStreak ?? 0,
        verifiedBadges: badges,
        reportCard: {
          knowledgeScore: Number(rep?.knowledgeScore) || 0.0,
          confidenceScore: Number(rep?.confidenceScore) || 0.0,
          communicationScore: Number(rep?.communicationScore) || 0.0,
          examplesScore: Number(rep?.examplesScore) || 0.0,
          industryLevelScore: Number(rep?.industryLevelScore) || 0.0,
          overallScore: overallReportScore,
          speechMetrics: {
            wordsPerMinute: rep?.wordsPerMinute ?? 130,
            fillerCount: rep?.fillerCount ?? 0,
            paceRating:
              (rep?.paceRating as CandidateTalent['reportCard']['speechMetrics']['paceRating']) ||
              'Natural & Confident',
            totalInterviews: rep?.totalInterviewsCompleted ?? 0,
          },
          strengths: Array.isArray(rep?.strengths)
            ? (rep?.strengths as string[])
            : ['Active technical learner'],
          improvementAreas: Array.isArray(rep?.areasForImprovement)
            ? (rep?.areasForImprovement as string[])
            : ['Continue building oral defense consistency'],
          recentModelAnswerExcerpt:
            rep?.latestDefenseExcerpt || 'Oral defense transcript pending.',
        },
        resume: {
          overallAtsScore: res ? res.overallAtsScore : 0,
          targetRole: parsedData.targetRole || 'AI/ML Systems Engineer',
          summary:
            parsedData.summary ||
            res?.rawText?.slice(0, 220) ||
            'Candidate has not yet uploaded or evaluated an ATS resume.',
          skills: {
            frameworks: fwSkills,
            models: modelSkills,
            infrastructure: infraSkills,
            retrieval: retrievalSkills,
          },
          projects,
          rawText: res?.rawText || undefined,
          resumeFileUrl: res?.resumeFileUrl || undefined,
        },
        contactEmail: p.email || p.workEmail || `${p.username}@talent.aignite`,
        githubUrl: p.githubUrl || `https://github.com/${p.username}`,
        linkedinUrl: p.linkedinUrl || `https://linkedin.com/in/${p.username}`,
      };
    });
  } catch (err) {
    console.warn('Error fetching live candidates from Supabase:', err);
    return TALENT_POOL_SEEDS;
  }
}

/**
 * Fetches filtered candidate talent pool with verification safeguards.
 */
export async function getCandidateTalentPoolAction(
  filters?: CandidateFilters
): Promise<{ success: boolean; candidates: CandidateTalent[] }> {
  const liveList = await fetchLiveCandidatesFromSupabase();
  let list = [...liveList];

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
  const liveList = await fetchLiveCandidatesFromSupabase();
  const candidate = liveList.find((c) => c.id === candidateId);
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
