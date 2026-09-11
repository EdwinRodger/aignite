-- ===========================================================================
-- AIgnite Supabase Baseline Seeding SQL
-- Generated for Production Migration (Reference: docs/DATABASE_SEEDING_AND_PRODUCTION_MIGRATION.md)
-- Run in Supabase Dashboard -> SQL Editor
-- ===========================================================================

-- 1. Course Packs
INSERT INTO course_packs (slug, title, company_name, description, badge_name, badge_icon, topics_count)
VALUES
  ('google-ai-pack', 'Google AI Pack', 'Google', 'Attention mechanisms, Gemma fine-tuning, TPU parallelization, and Vertex AI pipelines.', 'Gemma & TPU Master', '🔴', 5),
  ('nvidia-ai-pack', 'NVIDIA AI Pack', 'NVIDIA', 'CUDA kernels, model quantization (AWQ/FP8), TensorRT acceleration, and Triton Inference Server.', 'CUDA & TensorRT Specialist', '🟢', 6),
  ('openai-pack', 'OpenAI Pack', 'OpenAI', 'Tool use, agentic JSON schema calling, embedding fine-tuning, and structured reasoning.', 'Function Calling & Agent Architect', '⚪', 4),
  ('microsoft-ai-pack', 'Microsoft AI Pack', 'Microsoft', 'Azure AI Studio, Semantic Kernel agents, multi-agent orchestration, and Copilot patterns.', 'Semantic Kernel Architect', '🔷', 5),
  ('amazon-ai-pack', 'Amazon AI Pack', 'Amazon AWS', 'AWS Bedrock foundation models, SageMaker distributed training, and serverless LLM deployment.', 'Bedrock & SageMaker Specialist', '🟠', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Recruiter Account
INSERT INTO profiles (id, role, full_name, username, college_or_company, recruiter_designation, is_verified, verification_status, work_email)
VALUES
  ('11111111-1111-4111-a111-111111111111', 'recruiter', 'Priya Venkatesh', 'priya_deepmind', 'Google DeepMind', 'Talent Acquisition Lead (GenAI & Systems)', true, 'approved', 'priya@google.com')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Student Talent Profiles, Stats & AI Report Cards
INSERT INTO profiles (id, role, full_name, username, college_or_company, region, headline, is_verified, verification_status)
VALUES ('22222222-2222-4222-a222-222222222201', 'student', 'Aarav Sharma', 'aarav_sharma', 'IIT Bombay', 'Maharashtra', 'Inference Acceleration & Kernel Optimization Specialist', true, 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_stats (student_id, total_points, current_streak, highest_streak, current_league_tier, league_points_this_week, overall_ranking)
VALUES ('22222222-2222-4222-a222-222222222201', 2420, 28, 33, 'architect', 2420, 1)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO ai_report_cards (student_id, knowledge_score, confidence_score, communication_score, examples_score, industry_level_score, total_interviews_completed, strengths, areas_for_improvement)
VALUES ('22222222-2222-4222-a222-222222222201', 9.8, 9.4, 9.2, 9.6, 9.7, 34, '["Precise mathematical explanation of KV-cache PagedAttention","Deep intuition for FP8 scaling factors and TensorRT-LLM compilation"]'::jsonb, '["Can elaborate further on multi-node InfiniBand NCCL bottlenecks"]'::jsonb)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO profiles (id, role, full_name, username, college_or_company, region, headline, is_verified, verification_status)
VALUES ('22222222-2222-4222-a222-222222222202', 'student', 'Priya Patel', 'priya_ml', 'BITS Pilani', 'Rajasthan', 'Post-Training RL & Autonomous Multi-Agent Systems Builder', true, 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_stats (student_id, total_points, current_streak, highest_streak, current_league_tier, league_points_this_week, overall_ranking)
VALUES ('22222222-2222-4222-a222-222222222202', 2310, 24, 29, 'architect', 2310, 2)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO ai_report_cards (student_id, knowledge_score, confidence_score, communication_score, examples_score, industry_level_score, total_interviews_completed, strengths, areas_for_improvement)
VALUES ('22222222-2222-4222-a222-222222222202', 9.5, 9.1, 9.4, 9.2, 9.3, 29, '["Exemplary architectural understanding of LangGraph state reducers","Strong grasp of RLVR and GRPO relative reward normalization"]'::jsonb, '["Could discuss speculative decoding draft-model acceptance rates"]'::jsonb)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO profiles (id, role, full_name, username, college_or_company, region, headline, is_verified, verification_status)
VALUES ('22222222-2222-4222-a222-222222222203', 'student', 'Vikramaditya Rao', 'vikram_ann', 'NIT Surathkal', 'Karnataka', 'Vector DB Internals & Hybrid Retrieval Pipeline Engineer', true, 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_stats (student_id, total_points, current_streak, highest_streak, current_league_tier, league_points_this_week, overall_ranking)
VALUES ('22222222-2222-4222-a222-222222222203', 1980, 19, 24, 'diamond', 1980, 3)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO ai_report_cards (student_id, knowledge_score, confidence_score, communication_score, examples_score, industry_level_score, total_interviews_completed, strengths, areas_for_improvement)
VALUES ('22222222-2222-4222-a222-222222222203', 9.1, 8.4, 8.7, 8.3, 8.1, 18, '["Detailed comparison of HNSW M and efConstruction parameters","Solid database indexing background with PostgreSQL and columnar storage"]'::jsonb, '["Work on reducing filler words during open-ended architectural prompts"]'::jsonb)
ON CONFLICT (student_id) DO NOTHING;

-- 4. Recruiter Job Postings
INSERT INTO job_postings (id, recruiter_id, company_name, company_logo_url, title, role_category, description, minimum_league_tier, min_report_card_score, salary_range, location, is_active)
VALUES
  ('33333333-3333-4333-a333-333333333301', '11111111-1111-4111-a111-111111111111', 'NVIDIA India', '🟢', 'Senior AI Inference Systems Engineer', 'AI Systems & Inference', 'Optimize TensorRT-LLM and Triton Inference Server deployments for frontier reasoning models.', 'diamond', 8.5, '₹32,00,000 - ₹48,00,000 CTC', 'Bengaluru, Karnataka (Hybrid)', true),
  ('33333333-3333-4333-a333-333333333302', '11111111-1111-4111-a111-111111111111', 'Google DeepMind', '🔵', 'Research Engineer - Post-Training & Reasoning', 'GenAI & LLM', 'Scale Gemma and next-gen reasoning models with RLVR and structured agent loops.', 'architect', 9.0, '₹38,00,000 - ₹55,00,000 CTC', 'Bengaluru / Hyderabad (Hybrid)', true),
  ('33333333-3333-4333-a333-333333333303', '11111111-1111-4111-a111-111111111111', 'Sarvam AI', '🟧', 'Full-Stack Agent & RAG Architect', 'Agent Architect', 'Build sovereign Indic AI agents, hybrid search RAG over vernacular databases.', 'gold', 8.0, '₹26,00,000 - ₹42,00,000 CTC', 'Bengaluru, Karnataka (On-Site)', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Daily Coach Questions (POTD)
INSERT INTO daily_coach_questions (id, for_date, topic, question_text, sample_key_points, difficulty)
VALUES
  ('44444444-4444-4444-a444-444444444401', '2026-09-09', 'GPU Kernel Architecture', 'Explain how FlashAttention-3 avoids HBM bandwidth bottlenecks on NVIDIA Hopper (H100). What role do asynchronous TMA and Warp Specialization play?', '["Decouples memory loading warps from math warps via Warp Specialization", "Uses Hopper TMA to copy data directly from global HBM into shared memory", "Overlaps asynchronous data movement with FP8 matrix multiplication"]'::jsonb, 'Advanced'),
  ('44444444-4444-4444-a444-444444444402', '2026-09-10', 'Reinforcement Learning', 'Compare Group Relative Policy Optimization (GRPO) in DeepSeek-R1 with standard PPO. How does GRPO eliminate the value critic model?', '["Removes the dedicated critic network saving 60% VRAM", "Computes advantages across group responses generated per prompt", "Normalizes rewards across the group"]'::jsonb, 'Staff/Principal')
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- 6. Architecture Deep-Dives & Technical Verification Checkpoints
-- ===========================================================================
CREATE TABLE IF NOT EXISTS deep_dives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_takeaway TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tag_badge TEXT NOT NULL,
  read_time TEXT DEFAULT '2 min read' NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate' NOT NULL,
  metrics JSONB NOT NULL,
  diagram_comparison JSONB NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  bookmarks_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deep_dive_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deep_dive_id UUID NOT NULL REFERENCES deep_dives(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deep_dive_user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deep_dive_id UUID NOT NULL REFERENCES deep_dives(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT false NOT NULL,
  bookmarked BOOLEAN DEFAULT false NOT NULL,
  quiz_completed BOOLEAN DEFAULT false NOT NULL,
  selected_option_index INTEGER,
  is_quiz_correct BOOLEAN,
  interacted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, deep_dive_id)
);

CREATE INDEX IF NOT EXISTS idx_deep_dives_category ON deep_dives(category);
CREATE INDEX IF NOT EXISTS idx_deep_dive_quizzes_dive ON deep_dive_quizzes(deep_dive_id);
CREATE INDEX IF NOT EXISTS idx_deep_dive_user_interactions_uid ON deep_dive_user_interactions(user_id, deep_dive_id);

INSERT INTO deep_dives (id, slug, title, summary, key_takeaway, source_name, source_url, category, tag_badge, read_time, difficulty, metrics, diagram_comparison, likes_count, bookmarks_count)
VALUES
  (
    '11111111-0001-4000-a000-000000000001',
    'deepseek-r1-grpo',
    'DeepSeek-R1: Pure RL Reasoning Emergence via GRPO',
    'DeepSeek-R1 demonstrates that high-order mathematical and algorithmic reasoning can emerge purely through large-scale reinforcement learning without human warm-up data. By replacing standard Proximal Policy Optimization (PPO) with Group Relative Policy Optimization (GRPO), it completely eliminates the memory-heavy value critic network.',
    'Rule of thumb: In post-training reasoning pipelines, GRPO slashes training GPU memory footprint by ~60% by calculating rewards relative to sampled group outputs rather than maintaining a separate critic model.',
    'DeepSeek AI Research',
    'https://github.com/deepseek-ai/DeepSeek-R1',
    'Agents & RL',
    'LLM Post-Training',
    '3 min read',
    'Advanced',
    '[{"label":"VRAM Savings","value":"~60%"},{"label":"Critic Memory","value":"0 GB (Eliminated)"},{"label":"AIME 2024 Score","value":"79.8% (Pass@1)"}]'::jsonb,
    '{"before":"PPO: Actor + Critic (2x Model VRAM footprint)","after":"GRPO: Actor + Group Relative Score Normalization","advantage":"Bypasses training and synchronizing a separate value critic network"}'::jsonb,
    342,
    189
  ),
  (
    '11111111-0002-4000-a000-000000000002',
    'vllm-paged-attention',
    'vLLM PagedAttention: Eradicating KV-Cache Memory Fragmentation',
    'In conventional LLM serving, 60% to 80% of GPU memory is lost to fragmentation because KV-caches are allocated contiguously for maximum sequence lengths. Inspired by operating system virtual memory paging, PagedAttention stores non-contiguous tokens in dynamic physical blocks.',
    'Rule of thumb: PagedAttention reduces KV-cache memory waste from >60% to under 4%, unlocking 2x to 4x higher serving throughput on identical GPU hardware.',
    'vLLM Project / UC Berkeley',
    'https://github.com/vllm-project/vllm',
    'Inference & Infra',
    'Inference Optimization',
    '3 min read',
    'Intermediate',
    '[{"label":"Memory Waste","value":"<4% (vs 60-80%)"},{"label":"Serving Throughput","value":"2-4x Boost"},{"label":"Key Innovation","value":"OS-style Memory Paging"}]'::jsonb,
    '{"before":"Contiguous Allocation: Over-allocated & fragmented static blocks","after":"Paged Blocks: Dynamic non-contiguous allocation via page tables","advantage":"Near-zero internal memory fragmentation and shared prefix caching"}'::jsonb,
    512,
    264
  ),
  (
    '11111111-0003-4000-a000-000000000003',
    'flashattention-3-hopper',
    'FlashAttention-3: Async FP8 Tensor Cores & Warp Specialization',
    'FlashAttention-3 unleashes Hopper architecture (H100/H200) capabilities by overlapping memory transfers with tensor core computation. By utilizing the Tensor Memory Accelerator (TMA) and Warp Specialization, it reaches up to 75% of theoretical peak FP8 TFLOPs.',
    'Rule of thumb: Hardware-aware algorithms must decouple compute warps from memory-loading warps to hide memory latency on modern GPU microarchitectures.',
    'Tri Dao / Princeton AI',
    'https://tridao.me/blog/2024/flashdecoding/',
    'Kernel Optimization',
    'Kernel Engineering',
    '4 min read',
    'Staff/Principal',
    '[{"label":"Speedup over FA-2","value":"1.5x - 2.0x"},{"label":"FP8 Utilization","value":"~75% Peak H100 TFLOPs"},{"label":"Core Mechanism","value":"Warp Specialization"}]'::jsonb,
    '{"before":"FA-2: Synchronous GMEM -> SMEM -> Tensor Cores pipeline","after":"FA-3: Async TMA loads + Producer-Consumer Warp Specialization","advantage":"Hides global memory latency entirely behind arithmetic execution"}'::jsonb,
    428,
    310
  ),
  (
    '11111111-0004-4000-a000-000000000004',
    'speculative-decoding',
    'Speculative Decoding: Breaking the Memory-Bandwidth Bottleneck',
    'LLM inference is fundamentally memory-bandwidth bound: loading 70B weights for every single token forward pass wastes GPU compute. Speculative decoding uses a lightweight draft model to speculate multiple tokens, which the target model verifies in a single parallel step.',
    'Rule of thumb: Speculative decoding yields 2x to 3x wall-clock latency reduction while preserving 100% mathematical equivalence to the target model output.',
    'Google Research / DeepMind',
    'https://arxiv.org/abs/2211.17192',
    'Inference & Infra',
    'Latency Reduction',
    '3 min read',
    'Intermediate',
    '[{"label":"Latency Gain","value":"2-3x Lower P95"},{"label":"Distribution Fidelity","value":"100% Exact Match"},{"label":"Verification Cost","value":"1 Forward Pass for K tokens"}]'::jsonb,
    '{"before":"Sequential Target: K forward passes for K generated tokens","after":"Draft (Fast K tokens) + Target 1-pass parallel verification","advantage":"Decouples token latency from target model weight reading overhead"}'::jsonb,
    389,
    205
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO deep_dive_quizzes (id, deep_dive_id, question_text, options, correct_option_index, explanation)
VALUES
  (
    '22222222-0001-4000-b000-000000000001',
    '11111111-0001-4000-a000-000000000001',
    'Why does GRPO save ~60% VRAM compared to standard PPO during RL post-training?',
    '["A) Uses 4-bit Quantized Weights to compress the KV-cache","B) Eliminates the Critic/Value Model entirely via relative group scoring","C) Truncates prompt context length to sub-2048 tokens"]'::jsonb,
    1,
    'GRPO compares outputs against the baseline reward of a sampled group of completions, completely eliminating the need to allocate and update a secondary value critic model in VRAM.'
  ),
  (
    '22222222-0002-4000-b000-000000000002',
    '11111111-0002-4000-a000-000000000002',
    'How does PagedAttention eliminate memory fragmentation during continuous batching?',
    '["A) By dropping prompt tokens whenever context exceeds 4096 tokens","B) By partitioning dynamic KV-cache into fixed-size virtual blocks mapped to physical memory","C) By sharing weights between the encoder and decoder attention heads"]'::jsonb,
    1,
    'PagedAttention adapts OS virtual memory paging, allowing tokens in the KV-cache to reside in non-contiguous physical blocks and eliminating over-allocation.'
  ),
  (
    '22222222-0003-4000-b000-000000000003',
    '11111111-0003-4000-a000-000000000003',
    'What hardware architectural feature in NVIDIA Hopper enables FA-3 asynchronous loads?',
    '["A) Tensor Memory Accelerator (TMA) for direct global-to-shared memory transfers","B) Software emulation of FP32 floating point operations","C) Complete elimination of SRAM scratchpad memory"]'::jsonb,
    0,
    'Hopper hardware TMA allows copying data directly from global HBM memory into shared memory asynchronously without consuming register file bandwidth.'
  ),
  (
    '22222222-0004-4000-b000-000000000004',
    '11111111-0004-4000-a000-000000000004',
    'Why does speculative decoding maintain identical output distributions to the target model?',
    '["A) The draft model is larger and more accurate than the target model","B) The target model validates draft tokens in parallel using modified rejection sampling","C) Tokens are selected purely by temperature=0 greedy search"]'::jsonb,
    1,
    'A modified rejection sampling scheme mathematically ensures that the accepted token distribution strictly matches sampling directly from the larger target model.'
  )
ON CONFLICT (id) DO NOTHING;

