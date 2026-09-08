'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Smartphone,
  Sparkles,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { updateMobileLandingPreference, generateAiSparkAction } from '@/app/actions/feed';
import { FeedPost } from '@/lib/feed-data';

interface FeedSidebarProps {
  totalPoints: number;
  streakCount: number;
  onSparkGenerated?: (spark: FeedPost) => void;
}

export function FeedSidebar({
  totalPoints,
  streakCount,
  onSparkGenerated,
}: FeedSidebarProps) {
  const [mobileLanding, setMobileLanding] = useState<'feed' | 'coach' | 'league' | 'roadmap'>('feed');
  const [prefStatus, setPrefStatus] = useState<string | null>(null);
  const [genTopic, setGenTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aignite_mobile_landing') as 'feed' | 'coach' | 'league' | 'roadmap';
        if (saved) {
          setMobileLanding(saved);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLandingChange = async (val: 'feed' | 'coach' | 'league' | 'roadmap') => {
    setMobileLanding(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aignite_mobile_landing', val);
    }
    setPrefStatus('Updating...');
    const res = await updateMobileLandingPreference(val);
    if (res.success) {
      setPrefStatus('Saved!');
      setTimeout(() => setPrefStatus(null), 2500);
    }
  };

  const handleGenerateSpark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    setGenMessage(null);

    const result = await generateAiSparkAction(genTopic.trim());
    setIsGenerating(false);

    if (result.success && result.spark) {
      setGenMessage('✨ New Spark Synthesized!');
      setGenTopic('');
      if (onSparkGenerated) {
        onSparkGenerated(result.spark);
      }
      setTimeout(() => setGenMessage(null), 3000);
    } else {
      setGenMessage('⚠️ Could not generate spark at this time.');
      setTimeout(() => setGenMessage(null), 3000);
    }
  };

  return (
    <aside aria-label="Feed Sidebar" className="space-y-5">
      {/* Daily Flame Streak & League Status */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Daily Streak</div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {streakCount > 0 ? `${streakCount} Day Streak 🔥` : 'Start your streak today!'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-primary">+{totalPoints} XP</div>
            <div className="text-[10px] text-muted-foreground">League Points</div>
          </div>
        </div>

        {/* Progress Towards Daily Goal */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Today&apos;s Goal (3 Sparks)</span>
            <span className="font-mono font-bold text-foreground">
              {Math.min(3, Math.floor(totalPoints / 5))}/3
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (Math.floor(totalPoints / 5) / 3) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* League Tier Badge */}
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Current Tier:</span>
          </div>
          <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
            Bronze League
          </span>
        </div>
      </div>

      {/* Mobile Launch Screen Preference Settings */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>Mobile Launch Screen</span>
          </div>
          {prefStatus && (
            <span className="text-[10px] text-primary font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{prefStatus}</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
          Configure what opens first when launching AIgnite on mobile devices for instant transit learning.
        </p>

        <div className="space-y-1.5">
          {[
            { id: 'feed', label: 'Sparks Feed (Default)', desc: '5-min AI news & micro-quizzes' },
            { id: 'coach', label: 'Voice Coach', desc: 'Daily spoken mock question streak' },
            { id: 'league', label: 'Interview League', desc: 'Weekly ranking & brackets' },
            { id: 'roadmap', label: 'Roadmap & Packs', desc: 'Deep-dive company curricula' },
          ].map((item) => {
            const isSelected = mobileLanding === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLandingChange(item.id as 'feed' | 'coach' | 'league' | 'roadmap')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-foreground font-semibold ring-1 ring-primary/30'
                    : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <div>
                  <div className="text-xs text-foreground font-medium">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                </div>
                {isSelected && <Zap className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Gemini Spark Synthesizer (Free Tier) */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Synthesize AI Spark</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
          Powered by Gemini 2.0 Flash. Generate a real-time micro-quiz card for any emerging paper.
        </p>

        <form onSubmit={handleGenerateSpark} className="space-y-2">
          <input
            type="text"
            value={genTopic}
            onChange={(e) => setGenTopic(e.target.value)}
            placeholder="e.g. FlashAttention-3, KV Cache..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <button
            type="submit"
            disabled={isGenerating || !genTopic.trim()}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Card...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Synthesize with Gemini</span>
              </>
            )}
          </button>
        </form>

        {genMessage && (
          <div className="mt-2 text-[11px] text-center font-medium text-primary animate-in fade-in">
            {genMessage}
          </div>
        )}
      </div>

      {/* Trending AI Architecture Tags */}
      <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Trending Architecture Topics</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            '#DeepSeekR1',
            '#PagedAttention',
            '#FlashAttention3',
            '#SpeculativeDecoding',
            '#LoRA',
            '#MoERouting',
            '#ReActLoops',
            '#CLIP',
          ].map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-1 rounded-md bg-muted/60 border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
