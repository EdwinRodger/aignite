'use server';

import { COMPANY_PACKS, CompanyPack } from '@/lib/learning-data';

export async function getCompanyPacks(): Promise<CompanyPack[]> {
  return COMPANY_PACKS;
}

export async function getCompanyPackBySlug(slug: string): Promise<CompanyPack | null> {
  const pack = COMPANY_PACKS.find((p) => p.slug === slug);
  return pack || null;
}

/**
 * Validates a student's assembled pipeline sequence in the Bubble Game.
 */
export async function verifyBubblePipeline(
  packSlug: string,
  sequence: string[]
): Promise<{
  isCorrect: boolean;
  errorFeedback?: string;
  pointsAwarded: number;
  optimalLatency?: string;
  optimalVram?: string;
}> {
  const pack = COMPANY_PACKS.find((p) => p.slug === packSlug);
  if (!pack) {
    return { isCorrect: false, errorFeedback: 'Company pack not found', pointsAwarded: 0 };
  }

  const { correctSequence, failureExplanations, pointsAwarded, optimalLatencyP95, optimalVram } =
    pack.bubbleMission;

  // Check length
  if (sequence.length !== correctSequence.length) {
    return {
      isCorrect: false,
      errorFeedback: `Incomplete pipeline: You have connected ${sequence.length} of ${correctSequence.length} required nodes.`,
      pointsAwarded: 0,
    };
  }

  // Check exact sequence
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== correctSequence[i]) {
      const nodeA = sequence[i];
      const nodeB = sequence[i + 1] || sequence[i - 1];
      const transitionKey = `${nodeA}->${nodeB}`;

      const explanation =
        failureExplanations[transitionKey] ||
        failureExplanations[nodeA] ||
        `Architectural Inversion at Step ${i + 1}: Node order causes an upstream dependency bottleneck. Check your ingestion-to-retrieval flow.`;

      return {
        isCorrect: false,
        errorFeedback: explanation,
        pointsAwarded: 0,
      };
    }
  }

  return {
    isCorrect: true,
    pointsAwarded,
    optimalLatency: optimalLatencyP95,
    optimalVram: optimalVram,
  };
}

/**
 * Validates an Error Hunter bug diagnosis.
 */
export async function submitErrorHunterSolution(
  packSlug: string,
  selectedOptionId: string
): Promise<{
  isCorrect: boolean;
  explanation: string;
  fixedCode: string;
  pointsAwarded: number;
}> {
  const pack = COMPANY_PACKS.find((p) => p.slug === packSlug);
  if (!pack) {
    return {
      isCorrect: false,
      explanation: 'Pack not found',
      fixedCode: '',
      pointsAwarded: 0,
    };
  }

  const option = pack.errorHunterScenario.options.find((o) => o.id === selectedOptionId);
  if (!option) {
    return {
      isCorrect: false,
      explanation: 'Option not found',
      fixedCode: pack.errorHunterScenario.fixedCode,
      pointsAwarded: 0,
    };
  }

  return {
    isCorrect: option.isCorrect,
    explanation: option.explanation,
    fixedCode: pack.errorHunterScenario.fixedCode,
    pointsAwarded: option.isCorrect ? pack.errorHunterScenario.pointsAwarded : 0,
  };
}

/**
 * Evaluates an AI Decision Simulator tradeoff choice.
 */
export async function submitDecisionSimulatorChoice(
  packSlug: string,
  choiceId: string
): Promise<{
  success: boolean;
  verdict: 'optimal' | 'acceptable' | 'rejected';
  metrics: { latencyScore: number; costScore: number; accuracyScore: number };
  tradeoffSummary: string;
  productionReasoning: string;
  pointsAwarded: number;
}> {
  const pack = COMPANY_PACKS.find((p) => p.slug === packSlug);
  if (!pack) {
    return {
      success: false,
      verdict: 'rejected',
      metrics: { latencyScore: 0, costScore: 0, accuracyScore: 0 },
      tradeoffSummary: 'Pack not found',
      productionReasoning: '',
      pointsAwarded: 0,
    };
  }

  const option = pack.decisionScenario.options.find((o) => o.id === choiceId);
  if (!option) {
    return {
      success: false,
      verdict: 'rejected',
      metrics: { latencyScore: 0, costScore: 0, accuracyScore: 0 },
      tradeoffSummary: 'Option not found',
      productionReasoning: '',
      pointsAwarded: 0,
    };
  }

  const points = option.verdict === 'optimal' ? pack.decisionScenario.pointsAwarded : 10;

  return {
    success: true,
    verdict: option.verdict,
    metrics: option.metrics,
    tradeoffSummary: option.tradeoffSummary,
    productionReasoning: option.productionReasoning,
    pointsAwarded: points,
  };
}
