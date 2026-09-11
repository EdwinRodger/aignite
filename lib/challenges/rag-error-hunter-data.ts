export interface DiagnosticOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface ErrorHunterMission {
  id: string;
  title: string;
  topic: string;
  severity: string;
  rewardXp: number;
  whyItMatters: string;
  codeSnippet: {
    language: string;
    unpatchedCode: string[];
    patchedDiffLine: string;
    bugLineNumber: number;
    bugExplanation: string;
  };
  diagnoses: DiagnosticOption[];
  explanation: string;
}

export const RAG_ERROR_HUNTER_MISSION: ErrorHunterMission = {
  id: 'rag-vector-inversion',
  title: 'Silent Inversion in Vector Retrieval Top-K Ranking',
  topic: 'RAG Retrieval Ranking',
  severity: 'Critical (Silent Failure)',
  rewardXp: 25,
  whyItMatters:
    'Silent ranking regressions do not throw runtime crashes. The search pipeline executes cleanly, but supplies the LLM with completely irrelevant or contradictory document chunks, causing severe hallucinations in production.',
  codeSnippet: {
    language: 'python',
    unpatchedCode: [
      'import numpy as np',
      'from sklearn.metrics.pairwise import cosine_similarity',
      '',
      'def retrieve_top_k_chunks(query_vector, chunk_embeddings, chunks, k=3):',
      '    # 1. Compute cosine similarity between query and all stored document chunks',
      '    similarities = cosine_similarity(query_vector, chunk_embeddings)[0]',
      '    ',
      '    # 2. Extract top-k chunk indices for context augmentation',
      '    top_indices = np.argsort(similarities)[:k]',
      '    ',
      '    # 3. Return grounded document passages to prompt template',
      '    return [chunks[i] for i in top_indices]',
    ],
    patchedDiffLine:
      '    top_indices = np.argsort(-similarities)[:k]  # PROD FIX: Negative sign sorts descending for highest similarity!',
    bugLineNumber: 9,
    bugExplanation:
      'np.argsort(similarities) sorts from lowest to highest score. Slicing [:k] returns the worst chunks instead of the best.',
  },
  diagnoses: [
    {
      id: 1,
      text: 'np.argsort() sorts in ascending order by default. Slicing [:k] selects chunks with the lowest similarity scores (least relevant) instead of highest.',
      isCorrect: true,
    },
    {
      id: 2,
      text: 'The cosine_similarity function cannot accept arrays and must be called inside an asynchronous thread pool.',
      isCorrect: false,
    },
    {
      id: 3,
      text: 'The argument k=3 is an invalid default parameter in Python and causes a compilation error.',
      isCorrect: false,
    },
    {
      id: 4,
      text: 'Chunk embeddings must be rounded to single-digit integers before any vector comparison can occur.',
      isCorrect: false,
    },
  ],
  explanation:
    'In NumPy, np.argsort() sorts elements in ascending order (smallest first). When retrieving top-k similar vectors, the array must be negated (np.argsort(-similarities)) or reversed (np.argsort(similarities)[::-1]) to select the most relevant passages with the highest cosine scores.',
};
