# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary:** AI Aspirants (Students, freshers, early career professionals, and career switchers) aiming to master applied AI/ML/GenAI and build interview confidence without getting trapped in passive 50+ hour video tutorials.
- **Secondary:** AI Recruiters & Hiring Managers seeking proven AI talent with demonstrated systems thinking (RAG architectures, quantization, latency, chunking, deployment tradeoffs) beyond boilerplate GitHub projects.

## Product Purpose
AIgnite (pronounced *ignite*, 'A' is silent) is an AI-specialized EdTech and recruitment platform engineered for Smart India Hackathon (SIH) 2026. It replaces generic passive video lectures with active, high-engagement micro-learning: an Instagram-style interactive AI feed for downtime, drag-and-drop architectural games (Pipeline Bubble Game), scenario simulators, weekly AI interview leagues, daily voice mock interviews with multi-axis report cards, and a direct talent pipeline for vetted recruiters. Success is defined by measurable interview readiness, hands-on architectural competence, and successful placement.

## Positioning
Unlike general coding or EdTech platforms that teach basic Python or passive theory, AIgnite is hyper-focused on Applied AI systems architecture and interview-ready proficiency. Its distinctive mechanism combines an addictive 5-second quiz AI micro-feed, tactile pipeline builders, automated voice-coached multi-metric interview evaluations, and a zero-cost architecture (Supabase, Gemini Flash, Vercel).

## Operating Context
- **Primary Device:** Desktop web for full-featured learning suites, sandbox simulators, and recruiter evaluation dashboards; fully responsive on mobile (including mobile WebView companion) with instant feed launch for transit/commute micro-learning.
- **Key Rituals:** Morning voice coach mock questions (streak maintenance), daily Problem of the Day (POTD), scrolling the AI feed for breakthrough news & quick quizzes, weekly competitive interview league rounds.
- **Workflow:** Sign in via friction-free 6-digit email OTP -> Daily AI Feed / POTD streak -> Interactive Module (Bubble Game / Decision Simulator / Error Hunter) -> Voice Mock Interview -> AI Report Card -> Badges & Recruiter Visibility.

## Capabilities and Constraints
- **Capabilities:**
  - Vertical bite-sized AI feed with 5-second interactive check quizzes.
  - Interactive Pipeline Bubble Game (drag-and-drop visual pipeline construction like RAG systems).
  - AI Decision Simulator (tradeoff scenarios: latency vs memory vs accuracy).
  - Error Hunter (debugging real AI/PyTorch code bugs).
  - Voice-enabled AI Mock Interview Coach with instant 5-metric report cards (Knowledge, Confidence, Communication, Systems Architecture, Industry Readiness).
  - Duolingo-style weekly competitive leagues and daily streak tracking.
  - Public AI Resume Analyzer (ATS score, skill gap analysis, domain fit).
  - Recruiter Portal with candidate search, skill gap metrics, and vetted badge filtering.
- **Constraints & Stack:**
  - Full-stack Web application on Next.js 16 (App Router), React 19, Tailwind CSS v4, and Drizzle ORM.
  - Supabase backend (Auth with Passwordless Email OTP, PostgreSQL 16 + pgvector, Edge Functions, Storage, Realtime).
  - Strict zero-cost / 100% free-tier architecture (Supabase Free, Gemini 2.0 Flash Free Tier, Vercel Free, Hugging Face/Groq Free APIs).
  - Strict dual-track security: students sign in with OTP; recruiters require corporate domain verification and manual admin vetting before accessing candidate resumes.

## Brand Commitments
- **Name:** AIgnite (pronounced *ignite*, the 'A' is silent).
- **Tone & Voice:** Crisp, intellectually demanding yet motivating, punchy, modern engineering rigor without corporate fluff.
- **Design Ambition:** "Warm Flame" high-contrast modern developer aesthetic powered by OKLCH color space (`oklch(0.6404 0.2153 35.9003)` primary flame accent, deep obsidian & crisp bone surfaces), dual light/dark mode support, typographic triad pairing Plus Jakarta Sans with Lora and IBM Plex Mono, and snappy tactile micro-interactions (confetti, node snaps, audio cues). Documented in [DESIGN.md](file:///d:/dev/SIH2026/aignite/DESIGN.md).

## Evidence on Hand
- System documentation:
  - [DESIGN.md](file:///d:/dev/SIH2026/aignite/DESIGN.md) (comprehensive OKLCH design system, typography hierarchy, component patterns, Tailwind v4 tokens)
  - `docs/PRODUCT_REQUIREMENTS_DOCUMENT.md` (complete feature requirements, persona definitions, game designs)
  - `docs/SYSTEM_DESIGN.md` (architecture, zero-cost pipeline, flow diagrams)
  - `docs/DATABASE_SCHEMA.md` (PostgreSQL schemas, Drizzle tables, RLS policies)
  - `docs/API_AND_EDGE_FUNCTIONS.md` (Edge functions, Gemini integration, speech scoring)
  - `docs/MOBILE_APP_ARCHITECTURE.md` (React Native WebView shell)
- Working web codebase in Next.js 16 with existing landing page (`app/page.tsx`), navigation components (`components/navigation/`), and micro-quiz card component (`components/feed/MicroQuizCard.tsx`).

## Product Principles
1. **Action Over Consumption:** No passive 2-hour videos; every concept is tested or constructed through tactile games, code debugging, or architectural trade-off decisions.
2. **5-Second Feedback Loops:** Whether in the micro-feed quiz, pipeline assembler, or voice mock interview, evaluation is immediate, diagnostic, and actionable.
3. **Desktop-First Power, Mobile-First Agility:** Rich simulators and dashboards thrive on desktop screens, while the feed and daily streaks are instantaneous and seamless on mobile.
4. **Ruthless Architectural Truth:** Problems reflect genuine production bottlenecks—quantization limits, token context limits, CUDA OOM, RAG retrieval drift, and latency tradeoffs.
5. **Zero-Cost Accessibility:** Engineered to operate completely on free-tier infrastructure so learners and hackathon evaluators face zero friction or paywalls.
