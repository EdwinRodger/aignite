'use server';

import { DAILY_COACH_QUESTIONS, CoachQuestion, CoachEvaluationReport } from '@/lib/coach-data';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Returns today's featured AI Interview Coach question.
 */
export async function getTodayCoachQuestion(): Promise<CoachQuestion> {
  // Rotate or return primary featured question
  return DAILY_COACH_QUESTIONS[0];
}

/**
 * Evaluates candidate's spoken or written answer against canonical concepts.
 * Analyzes speech cadence, filler words, technical depth, and generates
 * a multi-axis AI report card with Gemini 2.0 Flash (or heuristic demo fallback).
 */
export async function evaluateCoachAnswerAction(
  questionId: string,
  transcript: string,
  durationSeconds: number
): Promise<{ success: boolean; report?: CoachEvaluationReport; error?: string }> {
  try {
    const question =
      DAILY_COACH_QUESTIONS.find((q) => q.id === questionId) || DAILY_COACH_QUESTIONS[0];

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMinutes = Math.max(0.1, durationSeconds / 60);
    const wordsPerMinute = Math.round(wordCount / durationMinutes);

    // Detect filler words
    const fillerRegex = /\b(um|uh|like|basically|you know|sort of|kind of|i mean|right)\b/gi;
    const matchedFillers = transcript.match(fillerRegex) || [];
    const fillerWordsDetected = Array.from(new Set(matchedFillers.map((f) => f.toLowerCase())));
    const fillerCount = matchedFillers.length;

    let paceRating: 'Too Slow' | 'Natural & Confident' | 'Rushed' = 'Natural & Confident';
    if (wordsPerMinute < 105) paceRating = 'Too Slow';
    else if (wordsPerMinute > 175) paceRating = 'Rushed';

    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API key is configured, evaluate using Gemini 2.0 Flash
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `
You are a Principal AI Hiring Architect at Google & NVIDIA evaluating a technical interview candidate.
Question: "${question.questionText}"
Key Concepts Expected: ${JSON.stringify(question.canonicalKeyPoints)}
Candidate Transcript: "${transcript}"
Duration: ${durationSeconds} seconds, Words: ${wordCount}, WPM: ${wordsPerMinute}, Fillers detected: ${fillerCount} (${fillerWordsDetected.join(', ')})

Evaluate the response rigorously across 5 dimensions (each scored strictly between 0.0 and 10.0 with 1 decimal place).
Return JSON matching this schema:
{
  "knowledgeScore": number,
  "confidenceScore": number,
  "communicationScore": number,
  "examplesScore": number,
  "industryReadinessScore": number,
  "keyStrengths": ["string", "string"],
  "areasForImprovement": ["string", "string"]
}
`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());

        const composite = Number(
          (
            (parsed.knowledgeScore * 0.35 +
              parsed.confidenceScore * 0.15 +
              parsed.communicationScore * 0.15 +
              parsed.examplesScore * 0.15 +
              parsed.industryReadinessScore * 0.2)
          ).toFixed(1)
        );

        const report: CoachEvaluationReport = {
          questionId: question.id,
          transcript,
          durationSeconds,
          speechMetrics: {
            wordsPerMinute,
            fillerWordsDetected,
            fillerCount,
            paceRating,
          },
          scores: {
            knowledgeScore: Number(parsed.knowledgeScore.toFixed(1)),
            confidenceScore: Number(parsed.confidenceScore.toFixed(1)),
            communicationScore: Number(parsed.communicationScore.toFixed(1)),
            examplesScore: Number(parsed.examplesScore.toFixed(1)),
            industryReadinessScore: Number(parsed.industryReadinessScore.toFixed(1)),
            compositeScore: composite,
          },
          keyStrengths: parsed.keyStrengths || ['Clear technical articulation'],
          areasForImprovement: parsed.areasForImprovement || ['Include more quantitative hardware benchmarks'],
          principalModelAnswer: question.suggestedModelAnswer,
          evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        return { success: true, report };
      } catch (geminiError) {
        console.warn('Gemini evaluation failed, falling back to smart heuristic engine:', geminiError);
      }
    }

    // 2. High-Fidelity Heuristic Evaluation Fallback (Demo / Offline / Free-Tier)
    const lowerTranscript = transcript.toLowerCase();

    // Check keyword hits
    const keyTerms = [
      'asynchronous', 'tma', 'warp', 'specialization', 'fp8', 'tflops', 'hbm', 'sram',
      'shared memory', 'producer', 'consumer', 'tensor core', 'grpo', 'critic', 'ppo',
      'paged', 'kv cache', 'fragmentation', 'block', 'virtual', 'latency', 'memory'
    ];

    let hits = 0;
    keyTerms.forEach((term) => {
      if (lowerTranscript.includes(term)) hits++;
    });

    const termCoverageRatio = Math.min(1, hits / 4);

    // Knowledge Score: base on word count & keyword coverage
    let knowledgeScore = Math.min(9.8, 5.0 + termCoverageRatio * 4.5);
    if (wordCount < 20) knowledgeScore = Math.min(knowledgeScore, 4.2);

    // Confidence Score: penalize filler words and bad pacing
    let confidenceScore = 8.5;
    if (fillerCount > 3) confidenceScore -= Math.min(3.0, fillerCount * 0.6);
    if (paceRating !== 'Natural & Confident') confidenceScore -= 1.0;
    confidenceScore = Math.max(3.5, Math.min(9.5, confidenceScore));

    // Communication Score: sentence length & structure
    const sentenceCount = (transcript.match(/[.!?]+/g) || []).length;
    let communicationScore = 7.8;
    if (sentenceCount >= 2 && wordCount >= 30) communicationScore = 8.6;
    if (wordCount < 20) communicationScore = 5.0;

    // Examples Score: mention of concrete numbers, hardware, or frameworks
    let examplesScore = 6.2;
    if (lowerTranscript.includes('hopper') || lowerTranscript.includes('h100') || lowerTranscript.includes('75%') || lowerTranscript.includes('gpu')) {
      examplesScore = 8.8;
    }

    // Industry Readiness Score
    const industryReadinessScore = Number(
      ((knowledgeScore * 0.4 + confidenceScore * 0.3 + examplesScore * 0.3)).toFixed(1)
    );

    const compositeScore = Number(
      (
        knowledgeScore * 0.35 +
        confidenceScore * 0.15 +
        communicationScore * 0.15 +
        examplesScore * 0.15 +
        industryReadinessScore * 0.2
      ).toFixed(1)
    );

    const strengths: string[] = [];
    if (hits >= 2) strengths.push('Accurately identified core hardware mechanisms (Warp Specialization & TMA)');
    if (fillerCount <= 2) strengths.push('Strong delivery with minimal conversational filler words');
    if (wordCount >= 40) strengths.push('Structured response demonstrating technical breadth');
    if (strengths.length === 0) strengths.push('Addressed the core interview prompt concisely');

    const improvements: string[] = [];
    if (!lowerTranscript.includes('producer') && !lowerTranscript.includes('consumer')) {
      improvements.push('Clarify the Producer-Consumer warp decoupling model');
    }
    if (fillerCount > 3) {
      improvements.push(`Reduce verbal pauses (detected ${fillerCount} fillers like "${fillerWordsDetected.join(', ')}")`);
    }
    if (wordCount < 35) {
      improvements.push('Elaborate with concrete quantitative hardware metrics (e.g. FP8 vs FP16 TFLOPs)');
    }
    if (improvements.length === 0) {
      improvements.push('Discuss edge cases such as register pressure during high-occupancy kernels');
    }

    const fallbackReport: CoachEvaluationReport = {
      questionId: question.id,
      transcript,
      durationSeconds,
      speechMetrics: {
        wordsPerMinute,
        fillerWordsDetected,
        fillerCount,
        paceRating,
      },
      scores: {
        knowledgeScore: Number(knowledgeScore.toFixed(1)),
        confidenceScore: Number(confidenceScore.toFixed(1)),
        communicationScore: Number(communicationScore.toFixed(1)),
        examplesScore: Number(examplesScore.toFixed(1)),
        industryReadinessScore,
        compositeScore,
      },
      keyStrengths: strengths,
      areasForImprovement: improvements,
      principalModelAnswer: question.suggestedModelAnswer,
      evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return { success: true, report: fallbackReport };
  } catch (error) {
    console.error('Coach answer evaluation failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during speech evaluation. Please try again.',
    };
  }
}
