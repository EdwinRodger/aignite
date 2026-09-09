export interface FeedQuiz {
  id: string;
  postId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  pointsAwarded: number;
}

export interface FeedPost {
  id: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  sourceName: string;
  sourceUrl: string;
  category: 'GenAI & LLMs' | 'Inference & Infra' | 'Vision & Multimodal' | 'Agents & RL' | 'AI Systems';
  tagBadge: string;
  readTime: string;
  likesCount: number;
  metrics: { label: string; value: string }[];
  diagramComparison: {
    before: string;
    after: string;
    advantage: string;
  };
  quiz: FeedQuiz;
  createdAt: string;
}

export const CURATED_FEED_POSTS: FeedPost[] = [];
