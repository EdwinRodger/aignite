# API & Edge Functions Specification - AIgnite
> **Project**: AIgnite (*pronounced ignite, 'A' is silent*)  
> **Runtime**: Supabase Edge Functions (Deno / TypeScript) & Next.js App Router API

---

## 1. Edge Function Directory & Endpoints

| Function Name | Method | Purpose | Invocation Source |
| :--- | :--- | :--- | :--- |
| `evaluate-coach-speech` | `POST` | Transcribes student audio, analyzes speech pace/fillers, grades response with Gemini. | Next.js Client on submit |
| `analyze-resume` | `POST` | Parses uploaded resume PDF, computes ATS score, domain matches, and skill gaps. | Landing Page / Profile |
| `evaluate-ai-lab` | `POST` | Evaluates student's architectural choices in the AI Lab sandbox. | Next.js Client on lab submit |
| `aggregate-ai-news-and-quizzes` | `POST` | Daily cron aggregating trending AI papers & generating 5-sec interactive quizzes. | Supabase `pg_cron` (Daily 04:00) |
| `submit-feed-quiz-answer` | `POST` | Validates user answer to feed quiz, increments streak, and awards points. | Feed UI on quiz tap |
| `process-league-promotions` | `POST` | Weekly cron processing promotions, demotions, and badge awards. | Supabase `pg_cron` (Sunday 23:59) |
| `generate-potd` | `POST` | Generates a daily scenario question for Problem of the Day & Coach. | Nightly Cron |

---

## 2. Detailed Function Specifications

### 2.1. `evaluate-coach-speech`
Evaluates a student's spoken answer to the Daily Interview Coach question or Module Mock Interview.

- **Request Headers**:
  ```http
  Authorization: Bearer <SUPABASE_USER_JWT>
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "questionId": "8f88cb04-e53b-4171-88c9-bf2f0775d5e2",
    "audioUrl": "https://<supabase-id>.supabase.co/storage/v1/object/public/voice-answers/user123_q4.webm",
    "audioDurationSeconds": 48
  }
  ```

- **AI Prompt & Evaluation Logic**:
  ```typescript
  // Edge Function Pseudo-Implementation (Deno)
  import { GoogleGenerativeAI } from "npm:@google/generative-ai";

  const gemini = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
  const model = gemini.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
  You are a Principal AI Hiring Architect at Google. Evaluate the candidate's speech response to the following interview question:
  Question: "${questionText}"
  Key Concepts Expected: ${JSON.stringify(canonicalKeyPoints)}
  Transcript: "${candidateTranscript}"

  Provide a rigorous, unbiased evaluation strictly following this JSON schema:
  {
    "knowledgeScore": number (0.0 - 10.0),
    "confidenceScore": number (0.0 - 10.0),
    "communicationScore": number (0.0 - 10.0),
    "examplesScore": number (0.0 - 10.0),
    "industryReadinessScore": number (0.0 - 10.0),
    "keyStrengths": string[],
    "missingPoints": string[],
    "suggestedModelAnswer": string,
    "fillerWordsDetected": string[]
  }
  `;
  ```

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "transcript": "Gradient descent is an optimization algorithm that iteratively tweaks parameters in the direction of steepest descent...",
    "scores": {
      "knowledge": 8.7,
      "confidence": 6.8,
      "communication": 7.3,
      "examples": 5.9,
      "industryLevel": 6.2
    },
    "feedback": {
      "strengths": ["Clear explanation of loss function gradient", "Good mention of learning rate"],
      "improvements": ["Did not mention local minima vs saddle points", "Could have given an example with Adam optimizer"],
      "speechMetrics": {
        "wordsPerMinute": 142,
        "fillerCount": 4,
        "fillers": ["um", "like"]
      }
    },
    "streak": {
      "currentStreak": 7,
      "pointsEarned": 50
    }
  }
  ```

---

### 2.2. `analyze-resume`
Parses candidate resume, runs semantic gap analysis against modern AI job markets, and creates vector embeddings.

- **Request Body (Multipart Form-Data or JSON)**:
  ```json
  {
    "resumePdfUrl": "https://<supabase-id>.supabase.co/storage/v1/object/public/resumes/candidate.pdf"
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "atsScore": 84,
    "domainScores": {
      "generativeAI": 91,
      "machineLearning": 82,
      "deepLearning": 74,
      "computerVision": 45,
      "nlp": 88
    },
    "skillGaps": [
      "No hands-on experience with Vector Databases (pgvector, Milvus, Qdrant)",
      "Missing Model Quantization techniques (AWQ, GGUF, bitsandbytes)",
      "Lack of real-time distributed training (DeepSpeed/vLLM)"
    ],
    "recommendations": [
      "Complete the AIgnite 'RAG Master' bubble pipeline module",
      "Enroll in the NVIDIA AI Company Pack for TensorRT and CUDA optimizations",
      "Add a production deployment project showcasing sub-100ms LLM serving"
    ],
    "percentileRank": "Top 12% among Indian AI engineering applicants"
  }
  ```

---

### 2.3. `evaluate-ai-lab`
Evaluates the student's system design in the AI Lab interactive sandbox.

- **Request Body**:
  ```json
  {
    "missionId": "chatbot-scalability",
    "architectureConfig": {
      "embeddingModel": "text-embedding-3-small",
      "chunkSize": 512,
      "chunkOverlap": 50,
      "retrievalStrategy": "hybrid_bm25_dense",
      "vectorIndex": "HNSW",
      "llm": "gemini-2.5-flash",
      "temperature": 0.2
    }
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "score": 92,
    "tradeoffBreakdown": {
      "latency": "Excellent (estimated ~180ms P95 with HNSW and Flash)",
      "costEfficiency": "High (Small embedding dimensions minimize memory footprint)",
      "retrievalAccuracy": "Superb (Hybrid search captures both exact keywords and semantic meaning)"
    },
    "verdict": "Architecture Approved for Enterprise Deployment",
    "pointsAwarded": 120,
    "badgeEarned": "Vector Wizard"
  }
  ```

---

### 2.4. `process-league-promotions` (Automated Weekly Cron)
- **Schedule**: Every Sunday at 23:59 UTC.
- **Workflow**:
  1. Identifies all active league brackets for the week.
  2. Queries `league_participants` order by `points_earned DESC`.
  3. Divides brackets (30 learners per bracket):
     - Ranks 1-5: `promotion_status = 'promoted'`. Updates user's `current_league_tier` to next tier.
     - Ranks 6-24: `promotion_status = 'stayed'`.
     - Ranks 25-30: `promotion_status = 'demoted'`. Lowers tier (unless already Bronze).
  4. Archives the week's league and provisions new brackets for the upcoming week.
  5. Dispatches push notifications to mobile users via FCM.

---

### 2.5. `aggregate-ai-news-and-quizzes` (Automated Free Ingestion)
- **Schedule**: Every day at 04:00 UTC.
- **Data Source**: Hugging Face Daily Papers API (`https://huggingface.co/api/daily_papers`) & ArXiv AI Category RSS (100% Free, no rate limits or paid keys).
- **Prompt Logic (Gemini 2.0 Flash Free Tier)**:
  ```typescript
  const prompt = `
  You are an expert AI educator for AIgnite. Given this research paper / news snippet:
  Title: "${paper.title}"
  Summary: "${paper.summary}"

  Generate an Instagram-style bite-sized learning card and an embedded 5-second interactive quiz.
  Output JSON format:
  {
    "punchyTitle": "string (max 8 words)",
    "breakdown": "string (strictly 2 sentences highlighting architectural significance)",
    "keyTakeaway": "string (1 sentence rule-of-thumb)",
    "quiz": {
      "question": "string (conceptual check question, under 15 words)",
      "options": ["string", "string", "string"], // Exactly 3 options
      "correctIndex": number (0, 1, or 2),
      "instantExplanation": "string (1 punchy sentence explaining why)"
    }
  }
  `;
  ```
- **DB Write**: Inserts the parsed card into `feed_posts` and the quiz into `feed_post_quizzes`.

---

### 2.6. `submit-feed-quiz-answer`
Validates a student's answer when tapping on a micro-quiz in the AI Feed.

- **Request Body**:
  ```json
  {
    "postId": "e283b8b1-3832-4d51-9efb-3543d2c94d01",
    "quizId": "48bc78c2-28c0-4357-bb62-658b1424619d",
    "selectedOptionIndex": 1
  }
  ```

- **Response (200 OK)**:
  ```json
  {
    "isCorrect": true,
    "correctIndex": 1,
    "pointsAwarded": 5,
    "explanation": "Correct! GRPO eliminates the value critic model, saving nearly 60% of GPU memory during RL training.",
    "newStreak": 7,
    "hapticPattern": "success"
  }
  ```
