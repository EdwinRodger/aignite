export interface CoachQuestion {
  id: string;
  forDate: string; // YYYY-MM-DD or identifier
  title: string;
  topic: string;
  track: 'Inference & Infra' | 'GenAI & LLMs' | 'Machine Learning' | 'Search & Embeddings' | 'Deep Learning';
  difficulty: 'Beginner' | 'Moderate' | 'Intermediate';
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
    id: 'coach-what-is-ai',
    forDate: '2026-09-11',
    title: 'What is an AI Model and How Does It Learn?',
    topic: 'AI Fundamentals',
    track: 'Machine Learning',
    difficulty: 'Beginner',
    questionText:
      'In simple words, what is an AI model, and how does it learn from training data?',
    contextHint:
      'Explain that an AI model is a computer program that learns patterns from examples by adjusting internal weights to minimize prediction errors.',
    canonicalKeyPoints: [
      'An AI model is a software program trained on data to recognize patterns and make predictions',
      'It learns by adjusting internal mathematical parameters (weights) to minimize errors',
      'Requires input training examples to learn relationships instead of relying on hardcoded rules',
      'Once trained, it can generalize and make predictions on brand-new, unseen data',
    ],
    suggestedModelAnswer:
      'An AI model is a software program that learns to solve tasks by analyzing patterns in data rather than following manually written rules. During training, the model is fed thousands or millions of examples. Each time it makes a prediction, it compares its guess with the correct answer and measures its error. Using an optimization algorithm like gradient descent, the model gradually tweaks its internal parameters-called weights-to reduce that error. Once training is complete, the model can look at brand-new, unseen data and accurately make predictions or generate answers.',
    estimatedSpeakingTime: '30-45 seconds',
  },
  {
    id: 'coach-what-is-prompt',
    forDate: '2026-09-10',
    title: 'What is a Prompt in Generative AI?',
    topic: 'Prompt Engineering',
    track: 'GenAI & LLMs',
    difficulty: 'Beginner',
    questionText:
      'What is a prompt in Generative AI, and what are two simple ways to write a better prompt?',
    contextHint:
      'Define a prompt as the text instruction given to an AI. Mention giving clear context, specifying desired output format, or providing an example.',
    canonicalKeyPoints: [
      'A prompt is the natural language instruction or question given to an AI model',
      'Way 1: Provide clear context and role instructions (e.g. "Act as a helpful tutor")',
      'Way 2: Specify the exact output format (e.g. "Provide 3 concise bullet points")',
      'Way 3: Provide a few-shot example to guide the desired tone and structure',
    ],
    suggestedModelAnswer:
      'A prompt is the natural language instruction or query that a user sends to a generative AI model to tell it what task to perform. To write a better prompt, first be specific about your goal and desired format-for example, asking for "a 3-bullet summary suitable for a beginner" rather than just "summarize this". Second, give the model clear context or role instructions, such as "Act as a senior software tutor", and optionally provide a short example of what a good answer looks like so the model follows your expected structure.',
    estimatedSpeakingTime: '30-45 seconds',
  },
  {
    id: 'coach-supervised-vs-unsupervised',
    forDate: '2026-09-09',
    title: 'Supervised vs Unsupervised Learning',
    topic: 'Machine Learning Types',
    track: 'Machine Learning',
    difficulty: 'Beginner',
    questionText:
      'What is the key difference between Supervised Learning and Unsupervised Learning? Give a simple example of each.',
    contextHint:
      'Focus on labeled data vs unlabeled data. For example: classifying spam emails (supervised) vs grouping customers by shopping habits (unsupervised).',
    canonicalKeyPoints: [
      'Supervised learning uses labeled data with known correct target outputs',
      'Example of supervised learning: email spam classification (spam vs not spam) or house price prediction',
      'Unsupervised learning uses unlabeled data where the model finds natural patterns or clusters',
      'Example of unsupervised learning: customer segmentation or grouping similar news articles',
    ],
    suggestedModelAnswer:
      'The main difference between supervised and unsupervised learning is whether the training data includes answer labels. In supervised learning, the model is trained on labeled input-output pairs-like thousands of emails marked "spam" or "inbox". The model learns the rule to map new emails to the correct label. In unsupervised learning, the data has no labels. The model explores the data to discover hidden patterns or clusters on its own-such as grouping online shoppers into different customer segments based on their browsing behavior.',
    estimatedSpeakingTime: '30-45 seconds',
  },
  {
    id: 'coach-what-is-hallucination',
    forDate: '2026-09-08',
    title: 'What is AI Hallucination and How Can We Reduce It?',
    topic: 'AI Reliability',
    track: 'GenAI & LLMs',
    difficulty: 'Beginner',
    questionText:
      'What is an AI hallucination, why does it happen, and what is one simple way to reduce it?',
    contextHint:
      'Explain that LLMs predict the most probable next word rather than checking facts. Mention providing source text (RAG) or asking the model to say "I do not know".',
    canonicalKeyPoints: [
      'Hallucination happens when an AI generates false or invented facts with high confidence',
      'It occurs because LLMs predict probable token sequences rather than querying a verified truth database',
      'Way 1: Provide reference documents or source context for the model to ground its answer (RAG)',
      'Way 2: Prompt the model explicitly to say "I do not know" if the information is not present in the prompt',
    ],
    suggestedModelAnswer:
      'An AI hallucination occurs when a language model generates factually incorrect or completely fabricated information while sounding confident and convincing. This happens because large language models are trained to predict the most statistically probable next words in a sentence, not to verify truth against a database. One simple and effective way to reduce hallucinations is Retrieval-Augmented Generation, or RAG: we supply the model with reliable source documents directly inside the prompt and instruct it to answer strictly using only the provided facts.',
    estimatedSpeakingTime: '30-45 seconds',
  },
];
