export interface TimedQuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const TOTAL_QUIZ_TIME_SECONDS = 60;

export const RAG_BEGINNER_QUIZ_QUESTIONS: TimedQuizQuestion[] = [
  {
    id: 1,
    topic: 'RAG Fundamentals',
    question: 'What does the acronym RAG stand for in artificial intelligence?',
    options: [
      'Recursive Auto-Generated Graphs',
      'Retrieval-Augmented Generation',
      'Random Array Generation',
      'Real-time Attention Grouping',
    ],
    correctIndex: 1,
    explanation:
      'RAG stands for Retrieval-Augmented Generation. It augments a generative language model by retrieving relevant facts from an external knowledge base.',
  },
  {
    id: 2,
    topic: 'Vector Databases',
    question: 'What is the primary role of a Vector Database in a RAG system?',
    options: [
      'To train deep learning model weights from scratch on GPU clusters',
      'To compile Python code into machine language binaries',
      'To store text embeddings and perform fast similarity search for relevant passages',
      'To render interactive HTML web pages for end users',
    ],
    correctIndex: 2,
    explanation:
      'A vector database stores high-dimensional numerical vectors (embeddings) and uses algorithms like HNSW to rapidly find chunks mathematically closest to the user query.',
  },
  {
    id: 3,
    topic: 'Text Chunking',
    question: 'Why are large documents split into smaller chunks before being embedded in a RAG pipeline?',
    options: [
      'To fit within model token limits and retrieve only specific, relevant facts',
      'To permanently delete unnecessary words from the document',
      'To compress the files so they take up less hard drive space',
      'To translate documents from English to another language',
    ],
    correctIndex: 0,
    explanation:
      'Splitting documents into smaller chunks (e.g. 500 tokens) allows the retriever to return the exact relevant section instead of drowning the LLM in irrelevant text.',
  },
  {
    id: 4,
    topic: 'Embeddings',
    question: 'What does an embedding model convert human text into?',
    options: [
      'A randomized encrypted password',
      'An executable Python script',
      'A raster bitmap image file',
      'A dense numerical vector (array of numbers) representing semantic meaning',
    ],
    correctIndex: 3,
    explanation:
      'An embedding model transforms text into an array of floating-point numbers where semantically similar texts end up close to each other in vector space.',
  },
  {
    id: 5,
    topic: 'Prompt Augmentation',
    question: 'In a standard RAG system, what happens right before the LLM generates its response?',
    options: [
      'The database deletes all indexed document embeddings',
      'The retrieved text chunks and user question are combined into a prompt template',
      'The model weights are completely erased and reloaded',
      'The user is prompted to write custom Python code',
    ],
    correctIndex: 1,
    explanation:
      'The retriever passes the top matching document chunks into the prompt context, allowing the LLM to synthesize a grounded answer based directly on those documents.',
  },
];
