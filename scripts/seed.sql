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
