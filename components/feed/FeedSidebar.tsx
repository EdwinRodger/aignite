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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

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
      setGenMessage(result.notice ? `✨ ${result.notice}` : '✨ New Spark Synthesized!');
      setGenTopic('');
      if (onSparkGenerated) {
        onSparkGenerated(result.spark);
      }
      setTimeout(() => setGenMessage(null), 4000);
    } else {
      setGenMessage('⚠️ Could not generate spark at this time.');
      setTimeout(() => setGenMessage(null), 3000);
    }
  };

  return (
    <aside aria-label="Feed Sidebar" className="space-y-5">
      {/* Daily Flame Streak & League Status */}
      <Card className="rounded-2xl border-border shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Daily Streak</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {streakCount > 0 ? `${streakCount} Day Streak 🔥` : 'Start your streak today!'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-primary">+{totalPoints} XP</div>
              <div className="text-sm text-muted-foreground">League Points</div>
            </div>
          </div>

          {/* Progress Towards Daily Goal */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today&apos;s Goal (3 Sparks)</span>
              <span className="font-mono font-bold text-foreground">
                {Math.min(3, Math.floor(totalPoints / 5))}/3
              </span>
            </div>
            <Progress
              value={Math.min(100, (Math.floor(totalPoints / 5) / 3) * 100)}
              className="h-1.5"
            />
          </div>

          {/* League Tier Badge */}
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Current Tier:</span>
            </div>
            <Badge variant="secondary" className="font-bold text-foreground">
              Bronze League
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Launch Screen Preference Settings */}
      <Card className="rounded-2xl border-border shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Mobile Launch Screen</span>
            </div>
            {prefStatus && (
              <span className="text-sm text-primary font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{prefStatus}</span>
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
                  className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-foreground font-semibold ring-1 ring-primary/30'
                      : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                >
                  <div>
                    <div className="text-sm text-foreground font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  {isSelected && <Zap className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Gemini Spark Synthesizer */}
      <Card className="rounded-2xl border-border shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Synthesize AI Spark</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Powered by Gemini 3.6 Flash (5 req/min, 20 req/day limits). Generate a real-time micro-quiz card for any emerging paper.
          </p>

          <form onSubmit={handleGenerateSpark} className="space-y-2">
            <Input
              type="text"
              aria-label="Topic or research paper for AI spark synthesis"
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              placeholder="e.g. FlashAttention-3, KV Cache..."
            />

            <Button
              type="submit"
              disabled={isGenerating || !genTopic.trim()}
              className="w-full rounded-xl text-sm font-semibold shadow-xs gap-1.5"
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
            </Button>
          </form>

          {genMessage && (
            <div className="text-sm text-center font-medium text-primary animate-in fade-in">
              {genMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending AI Architecture Tags */}
      <Card className="rounded-2xl border-border shadow-xs">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
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
              <Badge
                key={tag}
                variant="outline"
                className="text-sm font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
