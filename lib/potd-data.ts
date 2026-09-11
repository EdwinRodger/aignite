export interface PotdFormula {
  label: string;
  formula: string;
  numerator: string;
  denominator: string;
  result: string;
}

export interface PotdChallenge {
  id: string;
  forDate: string; // YYYY-MM-DD
  title: string;
  topic: string;
  track: 'ML Fundamentals' | 'GenAI & LLMs' | 'RAG & Retrieval';
  difficulty: 'Beginner' | 'Moderate';
  problemStatement: string;
  scenario?: string;
  codeSnippet?: string;
  formula?: PotdFormula;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint: string;
  pointsReward: number;
}

export const DAILY_POTD_CHALLENGES: PotdChallenge[] = [
  {
    id: 'potd-supervised-learning',
    forDate: '2026-09-11',
    title: 'Supervised vs Unsupervised Learning Data',
    topic: 'Machine Learning Basics',
    track: 'ML Fundamentals',
    difficulty: 'Beginner',
    problemStatement:
      'Different machine learning approaches require different types of training data to learn patterns.',
    scenario:
      'You are building an image classification app to identify whether an uploaded photo is a cat or a dog. You collect 10,000 photos, and each photo has a clear label attached: "cat" or "dog".',
    question: 'Which machine learning approach uses training data that includes both input examples and their correct target labels?',
    options: [
      'Reinforcement Learning (learning through environmental rewards and penalties)',
      'Supervised Learning (learning from input data paired with correct answer labels)',
      'Unsupervised Learning (discovering hidden clusters without any labels)',
      'Heuristic Rule Engine (manual if-else condition statements)',
    ],
    correctOptionIndex: 1, // Option B
    explanation:
      'Supervised learning trains an algorithm on input data paired with correct target labels (like photos marked "cat" or "dog"). The model learns the mapping function to predict the right label for new, unlabeled inputs.',
    hint: 'The word "supervised" means the learning process is guided by known correct answers.',
    pointsReward: 25,
  },
  {
    id: 'potd-llm-acronym',
    forDate: '2026-09-10',
    title: 'Understanding the LLM Acronym',
    topic: 'Generative AI',
    track: 'GenAI & LLMs',
    difficulty: 'Beginner',
    problemStatement:
      'Modern conversational AI systems like ChatGPT, Gemini, and Claude are based on foundation models.',
    scenario:
      'A teammate mentions during a sprint meeting that your company will deploy an open-source LLM for customer support automation.',
    question: 'What does the acronym LLM stand for in artificial intelligence?',
    options: [
      'Low Latency Memory',
      'Linear Logic Machine',
      'Large Language Model',
      'Linked Learning Module',
    ],
    correctOptionIndex: 2, // Option C
    explanation:
      'LLM stands for Large Language Model. These are deep neural networks with billions of parameters trained on vast text datasets to understand, summarize, and generate human-like language.',
    hint: 'Think of three words representing scale ("Large"), natural text ("Language"), and mathematical architecture ("Model").',
    pointsReward: 25,
  },
  {
    id: 'potd-what-is-hallucination',
    forDate: '2026-09-09',
    title: 'What is an AI Hallucination?',
    topic: 'Model Reliability',
    track: 'GenAI & LLMs',
    difficulty: 'Beginner',
    problemStatement:
      'When working with Generative AI applications, verifying factual output is an important safety step.',
    scenario:
      'A user asks an AI assistant for citations from a research paper, and the assistant responds with realistic-sounding book titles and author names that do not exist in reality.',
    question: 'What does it mean when an AI model "hallucinates"?',
    options: [
      'The computer GPU temperature exceeds safe thermal limits',
      'The server runs out of memory and automatically restarts',
      'The database loses internet connection during query retrieval',
      'The model generates factually incorrect or fabricated information with a confident tone',
    ],
    correctOptionIndex: 3, // Option D
    explanation:
      'An AI hallucination happens when an LLM produces plausible-sounding but factually false statements, fictitious citations, or nonexistent facts because it predicts probable token sequences rather than searching verified facts.',
    hint: 'Think about what happens when an AI generates invented details that sound completely convincing.',
    pointsReward: 25,
  },
  {
    id: 'potd-cosine-similarity-basics',
    forDate: '2026-09-08',
    title: 'Vector Cosine Similarity Basics',
    topic: 'Search & Embeddings',
    track: 'RAG & Retrieval',
    difficulty: 'Beginner',
    problemStatement:
      'In semantic search and RAG retrieval, text is converted into dense vector embeddings and compared using Cosine Similarity.',
    scenario:
      'Two sentences have been converted into vector embeddings. The angle between the two vectors in vector space is 0 degrees (they point in the exact same direction).',
    question: 'What is the Cosine Similarity score between two vectors that point in the exact same direction?',
    options: [
      '1.0 (Maximum similarity indicating identical directional alignment)',
      '0.0 (Completely orthogonal with zero overlap)',
      '-1.0 (Opposite directions with negative correlation)',
      '100.0 (Percentage representation)',
    ],
    correctOptionIndex: 0, // Option A
    explanation:
      'Cosine similarity computes the cosine of the angle between two vectors. Since cos(0°) = 1.0, two vectors pointing in the exact same direction achieve the maximum possible similarity score of 1.0.',
    hint: 'In trigonometry, the cosine of a 0-degree angle is 1.',
    pointsReward: 25,
  },
];
