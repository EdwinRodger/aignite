# Product Requirements Document (PRD) — AIgnite
> **Project**: AIgnite (*pronounced ignite, 'A' is silent*)  
> **Event**: Smart India Hackathon (SIH) 2026  
> **Status**: Ready for Implementation  
> **Target Platforms**: Web (Next.js 16) & Mobile (React Native WebView)  

---

## 1. Vision & Core Philosophy

**AIgnite** is an AI-first learning, evaluation, and recruitment ecosystem designed to fix the current crisis in AI education:
- **Problem**: Most platforms offer generic, outdated 60-hour video lectures with little hands-on architecture practice, zero real-time speech evaluation, and disconnect from actual hiring standards.
- **Solution**: AIgnite provides high-engagement interactive learning games, scenario-based architecture simulators, weekly competitive leagues, daily voice interview coaching, and automated recruitment pipelines that connect certified AI talent directly with companies.

---

## 2. Target Personas

### Persona A: The AI Aspirant (Student / Fresher / Career Switcher)
- **Goal**: Master applied AI/ML/GenAI without tutorial hell, build consistent interview confidence, and get hired.
- **Pain Points**: Lack of interview practice, cannot judge own communication/confidence, generic resumes rejected by ATS, overwhelmed by the rapid pace of GenAI breakthroughs.

### Persona B: The AI Recruiter / Hiring Manager
- **Goal**: Hire proven AI engineers who know real-world tradeoffs (latency, quantization, chunking, RAG architectures) rather than rote memorization.
- **Pain Points**: Hundreds of boilerplate resumes with identical copy-pasted projects; no reliable signal on candidate communication, problem-solving, or real architecture decision skills.

---

## 3. Public Features (Unauthenticated & Landing Page)

The landing page functions as both an acquisition engine and a public utility showcase:

### 3.1. Public AI Resume Analyzer
- **Input**: Drag-and-drop PDF resume upload.
- **Output**:
  - **Overall ATS Score** (0-100).
  - **Domain-Wise Fit**: Percentage readiness for *Machine Learning Engineer*, *GenAI / LLM Engineer*, *Data Scientist*, *Computer Vision Engineer*, and *AI Architect*.
  - **Skill Gap Analysis**: List of missing critical skills (e.g., "Missing Vector DBs (Milvus/Pinecone), Quantization (bitsandbytes), LangChain/LlamaIndex").
  - **Benchmarking**: Regional & percentile ranking among all analyzed resumes.

### 3.2. Public AI Mock Interview Preview
- Single-question interactive voice/text trial.
- Instant feedback demo showcasing the 5-metric AI Report Card.

### 3.3. Modular Company Course Packs
Instead of charging for a single 100-hour generic course, AIgnite offers laser-targeted company packs mimicking actual engineering bars:
- **Google AI Pack**: Deep Dive into Transformers, Gemma, TPU optimizations, Vertex AI.
- **NVIDIA AI Pack**: CUDA basics, TensorRT, Triton Inference Server, NeMo framework.
- **Microsoft AI Pack**: Azure OpenAI Service, Semantic Kernel, Copilot Studio architectures.
- **OpenAI Pack**: Function calling, Assistant APIs, Fine-tuning GPT models, Whisper & Vision.
- **Amazon AI Pack**: AWS Bedrock, SageMaker distributed training, Titan models.

### 3.4. Interactive AI Career Roadmap
- Public interactive visual roadmap tree with expandable sub-topics:
  - Foundations -> Classical ML -> Deep Learning & PyTorch -> NLP & Transformers -> GenAI & RAG -> Agentic AI & Deployment.
- Highlights prerequisite tracks, time estimates, and associated badges.

### 3.5. Problem of the Day (POTD) Preview
- Displays today's scenario question on the landing page to hook visitors into creating an account to maintain their streak.

---

## 4. Student Learning Suite (Authenticated)

Students progress through 5 specialized interactive modules per track (GenAI, ML, DL, NLP, CV):

### 4.1. Core Module Structure
1. **Interactive Bite-Sized Reading**: Clean visual theory with interactive diagrams, no bloated 2-hour videos.
2. **The "Bubble Game" (Pipeline Builder)**:
   - Example: **RAG Master Pipeline**.
   - Timed mini-game where learners drag, drop, and connect nodes in the right sequential pipeline:
     `Document Parser` ➔ `Recursive Character Splitter` ➔ `Embedding Model (text-embedding-3)` ➔ `Vector Store (pgvector)` ➔ `Hybrid Retriever` ➔ `Reranker (Cohere)` ➔ `Prompt Template` ➔ `LLM Generator`.
   - Scoring based on speed, accuracy, and handling edge cases (e.g., rate limits, out-of-memory).
3. **Error Hunter (Bug Correction MCQs)**:
   - Students inspect real-world broken AI code snippets and identify the bug or performance bottleneck:
     - Missing `optimizer.zero_grad()` in a PyTorch loop.
     - Token limit overflow in context window.
     - Data leakage across train/test splits before standard scaling.
4. **AI Decision Simulator**:
   - Scenario-driven architectural decision making:
     > *"You have 10 GB of unlabeled image data, an on-premise single T4 GPU, and strict sub-50ms inference requirements for edge drones. Which vision model family do you choose?"*  
     > A) Vision Transformer (ViT-H/14)  
     > B) YOLOv11 / RT-DETR  
     > C) CLIP with Zero-Shot  
     > D) Stable Diffusion Encoder  
   - Detailed AI explanation analyzing latency, memory footprint, and detection performance.
5. **The AI Lab (System Architect Sandbox)**:
   - Students configure an end-to-end system for a specific mission (e.g., *"Design an internal medical compliance QA bot"*).
   - Configure: Embedding dimension, chunk overlap, vector indexing (HNSW vs IVFFlat), temperature, system prompt guards.
   - LLM evaluates the student's architecture on Cost, Latency, Retrieval Quality, and Safety.
6. **Module Capstone: AI Voice Mock Interview**:
   - Audio/speech-based 3-question evaluation before module completion certificate/badge is unlocked.

---

## 5. Gamification & Retention Mechanics

### 5.1. The AI Interview League 🏆
Inspired by competitive ranked tiers, running on weekly cycles:
- **Divisions**:
  1. 🥉 **Bronze AI Engineer**
  2. 🥈 **Silver AI Engineer**
  3. 🥇 **Gold AI Engineer**
  4. 💎 **LLM Master**
  5. 👑 **AI Architect**
- **League Mechanics**:
  - Every Monday, 5 new high-yield AI interview challenges are posted in the league pool.
  - Students post their recorded or written answers.
  - Automated AI scoring + community peer upvotes.
  - Sunday midnight UTC: Top 20% promoted to higher league; bottom 15% demoted; middle stays.

### 5.2. Daily Interview Coach & Morning Habit
- Push notification at 8:00 AM: *"Today's Question: Explain Gradient Descent to a 10-year-old vs an ML Engineer."*
- Student speaks their answer (using phone mic or laptop mic).
- AI transcribes and scores the response within 5 seconds.
- Streak increments by +1.

### 5.3. AI Interview Report Card (Student Portfolio)
Every student has a dynamic, verified Report Card based on aggregated mock interview and coach data:
- **Knowledge Score** (0 - 10.0): Depth of mathematical, algorithmic, and framework knowledge.
- **Confidence Score** (0 - 10.0): Speech pace, reduction in filler words (um, uh), vocal consistency.
- **Communication Score** (0 - 10.0): Clarity, structure (e.g. STAR method), brevity.
- **Practical Examples Score** (0 - 10.0): Mentions of real metrics, error handling, production hurdles.
- **Industry Readiness Index** (0 - 10.0): Overall weighted hiring recommendation.

### 5.4. Achievement Badges
Non-fungible verified skill badges displayed on profile:
- 🎖️ **RAG Master**: Flawless score in RAG Bubble Game and Vector indexing.
- 🎖️ **CNN Explorer**: Mastery over Convolutional and Computer Vision modules.
- 🎖️ **Vector Wizard**: Top score in pgvector and similarity search trade-offs.
- 🎖️ **Prompt Engineer**: Perfect evaluation in System Prompt design & guardrails.
- 🎖️ **Transformer Titan**: Flawless explanation of Self-Attention and KV-caching.

### 5.5. Leaderboards (Regional & Global)
- Filter by:
  - **Streak Leaderboard**: Consistency in daily coaching.
  - **Skill Score Leaderboard**: Aggregated score across modules & leagues.
  - **Regional Filter**: State, University, or City ranking for local competitive spirit (vital for SIH presentation).

### 5.6. AIgnite Pulse / AI Feed (The Productive Instagram Alternative)
- **Problem Solved**: When standing in line, waiting for a bus, or doing routine chores, users habitually unlock their phones and doomscroll Instagram/Reels for 5–10 minutes with zero learning value.
- **AIgnite Solution**: A vertical, snappy, Instagram-style feed containing strictly curated AI breakthroughs, research highlights, and architectural news.
- **The Core Differentiator: Instant Embedded Micro-Quizzes**:
  - Instead of passive reading or watching, **every single feed card contains an interactive, 5-second check question**!
  - **Structure of an AI Feed Item**:
    1. **Media / Visual**: High-res architecture diagram, infographic, benchmark bar chart, or 10-second demo clip.
    2. **Headline & 2-Sentence Breakdown**: Clear, non-fluff summary of the AI event (e.g., *"DeepSeek-R1 introduces group relative policy optimization (GRPO) without a critic model, cutting training VRAM by 60%"*).
    3. **Embedded Interactive Quiz Card**:
       - Single tap multiple-choice or binary dilemma (e.g., *"Why does GRPO require significantly less memory than PPO?"* ➔ `A) Eliminates Value Network`, `B) Uses 4-bit Quantization`, `C) Reduces Context Window`).
       - Immediate green/red celebration visual + crisp 1-sentence explanation upon tapping.
       - Correct answers award **+5 AIgnite Points** and count toward the daily streak.
    4. **Social & Utility Actions**: Like, Bookmark for quick revision, Share to LinkedIn/X, and "Open in AI Lab" to test the concept hands-on.

### 5.7. Mobile-First Default Launch Behavior & Customizable Landing Page
- **Default Behavior**:
  - On **Mobile devices / React Native App**, launching the application opens directly to the **Instagram-style AI Feed (`/feed`)** by default. This eliminates friction and captures the user's 5-minute idle attention immediately.
  - On **Desktop / Laptop browsers**, launching opens to the **Command Dashboard (`/dashboard`)** or Landing Page.
- **User Preference Override**:
  - Users can configure their preferred default landing screen in `Profile > Preferences`:
    - 📱 **AI Pulse Feed (`/feed`)**: Instant micro-learning & news (Default on mobile).
    - 📊 **Main Dashboard (`/dashboard`)**: Full track progress, resume score, and roadmaps (Default on web).
    - 🎙️ **Daily Interview Coach (`/coach`)**: Jump straight to recording today's spoken answer.
    - 🏆 **AI Interview League (`/league`)**: For competitive users monitoring their weekly promotion tier.

---

## 6. Recruiter Portal & B2B Talent Pipeline

### 6.1. Recruiter Verification
- Registration with work email and company domain verification.
- Recruiter dashboard for talent scouting.

### 6.2. Talent Discovery & Advanced Filtering
Recruiters do not search through unvetted keywords; they filter through verified skill metrics:
- Filter by **League Rank** (e.g., Only show *LLM Master* & *AI Architect*).
- Filter by **Specific Badges** (e.g., Must have *RAG Master* badge).
- Filter by **AI Report Card Scores** (e.g., Communication > 7.5, Knowledge > 8.0).
- Filter by **Regional Proximity** or University.

### 6.3. Job Board & One-Click Apply
- Verified companies post AI internships and full-time roles with required threshold criteria.
- Students who meet criteria can apply with their AIgnite Verified Profile + AI Report Card.

---

## 7. 100% Free-Tier & Zero-Cost Architecture Plan

AIgnite is engineered to run **completely free of cost** during development and the Smart India Hackathon competition without requiring a credit card or incurring paid bills:

| Layer | Free Resource / Provider | Generous Free Limit & Allocation |
| :--- | :--- | :--- |
| **Frontend & Web Hosting** | **Vercel Hobby Plan** | 100 GB bandwidth, unlimited serverless edge executions, global CDN, automatic HTTPS. |
| **Backend-as-a-Service** | **Supabase Free Tier** | 500 MB PostgreSQL database (with `pgvector`), 50,000 MAU Auth, 1 GB Storage for audio/resumes, 500,000 Edge Function invocations/mo. |
| **Generative AI Scoring** | **Google Gemini 2.0 Flash Free Tier** | **15 Requests Per Minute (RPM)**, **1,000,000 Tokens Per Minute (TPM)**, and **1,500 Requests Per Day (RPD)** completely free with Google AI Studio API key. |
| **Fast Speech-to-Text (STT)** | **Groq Cloud Whisper Free Tier / Web Speech API** | Lightning-fast Whisper large-v3 transcription at zero cost within generous daily rate limits, backed up by the zero-cost native browser Web Speech API. |
| **AI News & Content Ingestion** | **Hugging Face Daily Papers & ArXiv RSS** | Completely free, public, rate-limit-friendly APIs for curating daily AI breakthroughs. |
| **Mobile Runtime & Build** | **React Native + Expo Application Services (Free Tier)** | Open-source framework, local Android/iOS builds, free Expo Go testing. |
| **Database Vector Search** | **PostgreSQL `pgvector`** | Bundled free inside Supabase without requiring external paid vector databases (like Pinecone). |
| **ORM & Schema Migrations** | **Drizzle ORM (`drizzle-orm` + `drizzle-kit`)** | 100% Free, open-source TypeScript ORM with zero serverless cold-start overhead. |

---

## 8. Non-Functional Requirements (NFR)

1. **Latency**:
   - Audio feedback and AI scoring returned within **under 3.5 seconds** using streaming Gemini 2.0 Flash or Groq Whisper.
   - Feed cards and micro-quizzes render instantly with zero layout shifts ($<500\text{ms}$).
2. **Cross-Platform Parity**:
   - Responsive design tailored for single-handed mobile navigation (bottom nav bar, thumb-friendly tap zones).
   - Mobile WebView app communicates seamlessly with native microphone/camera and device push notifications.
3. **Offline & Low-Bandwidth Resilience**:
   - Text questions and cached feed cards remain readable even with unstable Indian mobile network connections (2G/3G fallback).
4. **Security & Data Privacy**:
   - Supabase Row Level Security (RLS) ensuring students can only modify their own drafts and submissions.
   - Secure signed URLs for uploaded resumes and audio files.
5. **Reliability**:
   - Weekly league cron transitions automated through Supabase pg_cron / Edge Functions with retry logic.
