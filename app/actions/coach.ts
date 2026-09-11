'use server';

import { DAILY_COACH_QUESTIONS, CoachQuestion, CoachEvaluationReport } from '@/lib/coach-data';
import { db } from '@/lib/db';
import { dailyCoachQuestions, dailyCoachSubmissions, aiReportCards } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getAuthenticatedStudentId,
  getStudentStreakData,
  recordStudentActivityAndIncrementStreak,
} from '@/lib/session-user';

/**
 * Fetch all available interview coach questions directly from Supabase.
 * Falls back to curated beginner/moderate dataset if offline or empty.
 */
export async function getCoachQuestionsAction(): Promise<CoachQuestion[]> {
  try {
    if (db) {
      const rows = await db
        .select()
        .from(dailyCoachQuestions)
        .orderBy(desc(dailyCoachQuestions.forDate));

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          forDate: r.forDate,
          title: r.title || r.topic,
          topic: r.topic,
          track: (r.track as CoachQuestion['track']) || 'GenAI & LLMs',
          difficulty: (r.difficulty as CoachQuestion['difficulty']) || 'Beginner',
          questionText: r.questionText,
          contextHint: r.contextHint || 'Focus on fundamental mechanisms and practical engineering tradeoffs.',
          canonicalKeyPoints: Array.isArray(r.sampleKeyPoints) ? (r.sampleKeyPoints as string[]) : [],
          suggestedModelAnswer: r.suggestedModelAnswer || '',
          estimatedSpeakingTime: r.estimatedSpeakingTime || '45-60 seconds',
        }));
      }
    }
  } catch (err) {
    console.warn('Could not fetch coach questions from Supabase, falling back to local data:', err);
  }

  return DAILY_COACH_QUESTIONS;
}

/**
 * Returns today's featured AI Interview Coach question directly from Supabase.
 */
export async function getTodayCoachQuestion(): Promise<CoachQuestion> {
  const questions = await getCoachQuestionsAction();
  const today = new Date().toISOString().slice(0, 10);
  const matched = questions.find((q) => q.forDate === today);
  return matched || questions[0] || DAILY_COACH_QUESTIONS[0];
}

/**
 * Directly queries the student's current streak and points from Supabase.
 */
export async function getCoachStreakAction(): Promise<{
  currentStreak: number;
  highestStreak: number;
  totalPoints: number;
}> {
  const data = await getStudentStreakData();
  return {
    currentStreak: data.currentStreak,
    highestStreak: data.highestStreak,
    totalPoints: data.totalPoints,
  };
}

/**
 * Evaluates candidate's spoken answer against canonical concepts.
 * Analyzes speech cadence, filler words, technical depth, and generates
 * a multi-axis AI report card with Gemini 2.0/2.5 Flash (or heuristic demo fallback).
 * Automatically records the submission in Supabase and increments the student streak!
 */
export async function evaluateCoachAnswerAction(
  questionId: string,
  transcript: string,
  durationSeconds: number
): Promise<{
  success: boolean;
  report?: CoachEvaluationReport;
  updatedStreak?: number;
  error?: string;
}> {
  try {
    const questions = await getCoachQuestionsAction();
    const question =
      questions.find((q) => q.id === questionId) ||
      DAILY_COACH_QUESTIONS.find((q) => q.id === questionId) ||
      questions[0] ||
      DAILY_COACH_QUESTIONS[0];

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Minimum 10 words required to prevent gaming with trivial inputs like "hello"
    if (wordCount < 10) {
      return {
        success: false,
        error:
          'Your answer is too brief (minimum 10 words required). Please provide a fuller spoken or written explanation of the concept.',
      };
    }

    const durationMinutes = Math.max(0.1, durationSeconds / 60);
    const wordsPerMinute = Math.round(wordCount / durationMinutes);

    // Detect conversational filler words
    const fillerRegex = /\b(um|uh|like|basically|you know|sort of|kind of|i mean|right)\b/gi;
    const matchedFillers = transcript.match(fillerRegex) || [];
    const fillerWordsDetected = Array.from(new Set(matchedFillers.map((f) => f.toLowerCase())));
    const fillerCount = matchedFillers.length;

    let paceRating: 'Too Slow' | 'Natural & Confident' | 'Rushed' = 'Natural & Confident';
    if (wordsPerMinute < 100) paceRating = 'Too Slow';
    else if (wordsPerMinute > 175) paceRating = 'Rushed';

    let evaluationReport: CoachEvaluationReport;

    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API key is configured, evaluate using Gemini Flash
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `
You are an expert AI technical interview coach evaluating a student answer.
Question (${question.difficulty} level): "${question.questionText}"
Key Concepts Expected: ${JSON.stringify(question.canonicalKeyPoints)}
Candidate Transcript: "${transcript}"
Duration: ${durationSeconds} seconds, Words: ${wordCount}, WPM: ${wordsPerMinute}, Fillers detected: ${fillerCount} (${fillerWordsDetected.join(', ')})

Evaluate the response constructively across 5 dimensions (each scored strictly between 0.0 and 10.0 with 1 decimal place).
If the candidate's answer is nonsensical, off-topic, or fails to address the question, score knowledgeScore below 2.0.
Tailor the scoring to ${question.difficulty} level expectations.
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
            parsed.knowledgeScore * 0.35 +
            parsed.confidenceScore * 0.15 +
            parsed.communicationScore * 0.15 +
            parsed.examplesScore * 0.15 +
            parsed.industryReadinessScore * 0.2
          ).toFixed(1)
        );

        evaluationReport = {
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
          keyStrengths: parsed.keyStrengths || ['Addressed the interview prompt directly'],
          areasForImprovement: parsed.areasForImprovement || ['Provide concrete numerical examples or production scenarios'],
          principalModelAnswer: question.suggestedModelAnswer,
          evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } catch (geminiError) {
        console.warn('Gemini evaluation failed, falling back to smart heuristic engine:', geminiError);
        evaluationReport = generateHeuristicReport(
          question,
          transcript,
          durationSeconds,
          wordCount,
          wordsPerMinute,
          fillerWordsDetected,
          fillerCount,
          paceRating
        );
      }
    } else {
      evaluationReport = generateHeuristicReport(
        question,
        transcript,
        durationSeconds,
        wordCount,
        wordsPerMinute,
        fillerWordsDetected,
        fillerCount,
        paceRating
      );
    }

    // 2. Persist submission and sync streak directly in Supabase
    let updatedStreak: number | undefined;
    const studentId = await getAuthenticatedStudentId();
    const passed = evaluationReport.scores.compositeScore >= 4.0;

    if (db && studentId) {
      try {
        // Resolve database UUID for question to prevent FK constraint violations
        let dbQuestionId: string = question.id;
        if (dbQuestionId.length !== 36) {
          const matching = await db
            .select({ id: dailyCoachQuestions.id })
            .from(dailyCoachQuestions)
            .where(eq(dailyCoachQuestions.forDate, question.forDate))
            .limit(1);
          if (matching.length > 0) {
            dbQuestionId = matching[0].id;
          }
        }

        if (dbQuestionId.length === 36) {
          await db.insert(dailyCoachSubmissions).values({
            studentId,
            questionId: dbQuestionId,
            transcript,
            knowledgeScore: evaluationReport.scores.knowledgeScore.toFixed(1),
            confidenceScore: evaluationReport.scores.confidenceScore.toFixed(1),
            communicationScore: evaluationReport.scores.communicationScore.toFixed(1),
            overallScore: evaluationReport.scores.compositeScore.toFixed(1),
            aiFeedback:
              evaluationReport.keyStrengths.join('. ') +
              ' | Improvement: ' +
              evaluationReport.areasForImprovement.join('. '),
          });
        }

        // Only increment streak and grant XP if candidate met passing threshold (score >= 4.0)
        if (passed) {
          const streakResult = await recordStudentActivityAndIncrementStreak(studentId, 25);
          updatedStreak = streakResult.currentStreak;

          // Upsert AI report card in Supabase
          await db
            .insert(aiReportCards)
            .values({
              studentId,
              knowledgeScore: evaluationReport.scores.knowledgeScore.toFixed(1),
              confidenceScore: evaluationReport.scores.confidenceScore.toFixed(1),
              communicationScore: evaluationReport.scores.communicationScore.toFixed(1),
              examplesScore: evaluationReport.scores.examplesScore.toFixed(1),
              industryLevelScore: evaluationReport.scores.industryReadinessScore.toFixed(1),
              totalInterviewsCompleted: 1,
              strengths: evaluationReport.keyStrengths,
              areasForImprovement: evaluationReport.areasForImprovement,
              aiSummaryFeedback: evaluationReport.keyStrengths[0] || 'Good verbal response.',
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: aiReportCards.studentId,
              set: {
                knowledgeScore: evaluationReport.scores.knowledgeScore.toFixed(1),
                confidenceScore: evaluationReport.scores.confidenceScore.toFixed(1),
                communicationScore: evaluationReport.scores.communicationScore.toFixed(1),
                examplesScore: evaluationReport.scores.examplesScore.toFixed(1),
                industryLevelScore: evaluationReport.scores.industryReadinessScore.toFixed(1),
                strengths: evaluationReport.keyStrengths,
                areasForImprovement: evaluationReport.areasForImprovement,
                updatedAt: new Date(),
              },
            });
        } else {
          const currentData = await getStudentStreakData();
          updatedStreak = currentData.currentStreak;
        }
      } catch (dbErr) {
        console.warn('Error recording coach submission to Supabase:', dbErr);
      }
    }

    return {
      success: true,
      report: evaluationReport,
      updatedStreak,
    };
  } catch (error) {
    console.error('Coach answer evaluation failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during speech evaluation. Please try again.',
    };
  }
}

/**
 * Smart heuristic evaluator fallback for offline/demo use.
 * Strictly verifies conceptual relevance and prevents high scores on nonsense text.
 */
function generateHeuristicReport(
  question: CoachQuestion,
  transcript: string,
  durationSeconds: number,
  wordCount: number,
  wordsPerMinute: number,
  fillerWordsDetected: string[],
  fillerCount: number,
  paceRating: 'Too Slow' | 'Natural & Confident' | 'Rushed'
): CoachEvaluationReport {
  const lower = transcript.toLowerCase();

  // Extract key concept terms from question's canonical key points
  const expectedTerms: string[] = [];
  question.canonicalKeyPoints.forEach((pt) => {
    pt.toLowerCase()
      .split(/[^a-z0-9_-]+/)
      .filter(
        (w) =>
          w.length >= 4 &&
          !['that', 'this', 'with', 'from', 'when', 'they', 'have', 'more', 'than', 'into', 'also', 'what', 'does', 'make'].includes(w)
      )
      .forEach((w) => expectedTerms.push(w));
  });

  // Common AI engineering vocabulary
  const domainKeywords = [
    'model', 'models', 'learn', 'learning', 'weight', 'weights', 'train', 'training', 'error',
    'errors', 'data', 'predict', 'prediction', 'predictions', 'pattern', 'patterns',
    'prompt', 'prompts', 'context', 'instruction', 'instructions', 'supervised',
    'unsupervised', 'label', 'labels', 'labeled', 'unlabeled', 'cluster', 'clusters',
    'hallucination', 'hallucinations', 'factual', 'grounding', 'retrieval', 'parameter',
    'parameters', 'rag', 'vector', 'database', 'algorithm', 'accuracy', 'metric'
  ];

  const allRelevantTerms = Array.from(new Set([...expectedTerms, ...domainKeywords]));

  let hits = 0;
  const matchedTerms: string[] = [];
  allRelevantTerms.forEach((term) => {
    const regex = new RegExp(`\\b${term}`, 'i');
    if (regex.test(lower)) {
      hits++;
      matchedTerms.push(term);
    }
  });

  // Non-relevant, gibberish, or completely off-topic input (e.g. repeated "hello")
  if (hits === 0) {
    const knowledgeScore = 1.0;
    const confidenceScore = Math.min(3.0, Math.max(1.0, 1.5 + (wordCount >= 20 ? 1.0 : 0)));
    const communicationScore = 2.0;
    const examplesScore = 1.0;
    const industryReadinessScore = 1.0;
    const compositeScore = 1.2;

    return {
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
        knowledgeScore,
        confidenceScore,
        communicationScore,
        examplesScore,
        industryReadinessScore,
        compositeScore,
      },
      keyStrengths: [
        'Spoke clearly and submitted an answer attempt',
        `Paced delivery across ${durationSeconds} seconds`,
      ],
      areasForImprovement: [
        `The response did not discuss key concepts for "${question.title}".`,
        `Expected key concepts: ${question.canonicalKeyPoints.slice(0, 2).join('; ')}.`,
        'Explain the core mechanism directly rather than giving generic or unrelated text.',
      ],
      principalModelAnswer: question.suggestedModelAnswer,
      evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // Meaningful response with keyword hits:
  const termCoverageRatio = Math.min(1, hits / 4);
  let knowledgeScore = Math.min(9.5, 2.5 + termCoverageRatio * 6.0 + (wordCount >= 35 ? 1.0 : 0));
  if (wordCount < 20) knowledgeScore = Math.min(knowledgeScore, 3.5);

  let confidenceScore = 8.0;
  if (fillerCount > 3) confidenceScore -= Math.min(3.0, fillerCount * 0.5);
  if (paceRating !== 'Natural & Confident') confidenceScore -= 1.0;
  confidenceScore = Math.max(3.5, Math.min(9.5, confidenceScore));

  let communicationScore = 7.5;
  const sentenceCount = (transcript.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 2 && wordCount >= 30) communicationScore = 8.5;
  if (wordCount < 20) communicationScore = 4.5;

  let examplesScore = 5.0;
  if (
    lower.includes('for example') ||
    lower.includes('such as') ||
    lower.includes('production') ||
    lower.includes('application') ||
    lower.includes('system')
  ) {
    examplesScore = 8.5;
  } else if (wordCount < 25) {
    examplesScore = 3.0;
  }

  const industryReadinessScore = Number(
    (knowledgeScore * 0.4 + confidenceScore * 0.3 + examplesScore * 0.3).toFixed(1)
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
  if (hits >= 2) strengths.push(`Addressed core technical terms (${matchedTerms.slice(0, 3).join(', ')})`);
  if (fillerCount <= 2) strengths.push('Clear delivery with minimal conversational filler words');
  if (wordCount >= 30) strengths.push('Structured response demonstrating clear conceptual thinking');
  if (strengths.length === 0) strengths.push('Addressed the interview prompt directly');

  const improvements: string[] = [];
  if (fillerCount > 3) {
    improvements.push(`Reduce conversational pauses (detected ${fillerCount} fillers like "${fillerWordsDetected.join(', ')}")`);
  }
  if (wordCount < 30) {
    improvements.push('Expand your explanation with a concrete production example or scenario');
  }
  if (hits < 3) {
    improvements.push(`Incorporate more expected concepts: ${question.canonicalKeyPoints.slice(0, 2).join('; ')}`);
  }
  if (improvements.length === 0) {
    improvements.push('Mention edge-case handling or failure mode considerations');
  }

  return {
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
}

/**
 * Transcribes audio via Groq Whisper API (whisper-large-v3-turbo).
 * Simple, fast, and rock-solid server-side Speech-to-Text without cloud WebSocket dependencies.
 */
export async function transcribeAudioAction(formData: FormData): Promise<{
  success: boolean;
  transcript?: string;
  error?: string;
}> {
  try {
    const file = formData.get('audio') as File | Blob | null;
    if (!file) {
      return { success: false, error: 'No audio data received.' };
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey || groqKey === 'your_groq_api_key_here') {
      return {
        success: false,
        error: 'Groq STT API key not configured.',
      };
    }

    const groqForm = new FormData();
    groqForm.append('file', file, 'candidate_answer.webm');
    groqForm.append('model', 'whisper-large-v3-turbo');
    groqForm.append('language', 'en');
    groqForm.append('response_format', 'json');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
      },
      body: groqForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Groq STT transcription failed:', res.status, errText);
      return {
        success: false,
        error: 'Speech-to-text service error. Please switch to Text Entry mode.',
      };
    }

    const data = (await res.json()) as { text?: string };
    const text = (data.text || '').trim();

    return {
      success: true,
      transcript: text,
    };
  } catch (err) {
    console.error('Audio transcription error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during transcription. Switch to Text Entry mode if this persists.',
    };
  }
}
