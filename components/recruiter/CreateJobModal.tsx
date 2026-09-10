'use client';

import React, { useState } from 'react';
import { createJobPostingAction } from '@/app/actions/recruiter';
import { RecruiterJob } from '@/lib/recruiter-data';
import { Plus, Loader2, Award, Briefcase, DollarSign, MapPin, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateJobModalProps {
  currentCompany: string;
  onClose: () => void;
  onCreated: (job: RecruiterJob) => void;
}

const BADGE_OPTIONS = [
  'RAG Master',
  'NVIDIA TensorRT Specialist',
  'Agent Architect',
  'Vector Wizard',
  '7-Day Flame Streak',
];

export function CreateJobModal({ currentCompany, onClose, onCreated }: CreateJobModalProps) {
  const [title, setTitle] = useState('');
  const [roleCategory, setRoleCategory] = useState<
    'GenAI & LLM' | 'AI Systems & Inference' | 'Distributed Training & CUDA' | 'Computer Vision & Multimodal' | 'Agent Architect'
  >('AI Systems & Inference');
  const [location, setLocation] = useState('Bengaluru, Karnataka (Hybrid)');
  const [salaryRange, setSalaryRange] = useState('₹30,00,000 - ₹45,00,000 CTC');
  const [minLeagueTier, setMinLeagueTier] = useState<
    'bronze' | 'silver' | 'gold' | 'diamond' | 'architect'
  >('gold');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['RAG Master']);
  const [minReportScore, setMinReportScore] = useState(8.0);
  const [description, setDescription] = useState(
    'Seeking an AI Systems Engineer to build low-latency inference pipelines, optimize CUDA/Triton kernels, and deploy models with TensorRT-LLM.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBadge = (b: string) => {
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((x) => x !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createJobPostingAction({
        companyName: currentCompany,
        title: title.trim(),
        roleCategory,
        location: location.trim(),
        salaryRange: salaryRange.trim(),
        minLeagueTier,
        requiredBadges: selectedBadges,
        minReportScore,
        description: description.trim(),
      });

      if (res.success && res.job) {
        onCreated(res.job);
        onClose();
      } else {
        setError(res.error || 'Failed to post role.');
      }
    } catch {
      setError('An error occurred while creating job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl">
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground font-sans">
                Post AI Engineering Opening
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-mono">
                Company: {currentCompany}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Role Title</label>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior AI Inference Systems Engineer"
            />
          </div>

          {/* Role Category & Location */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Role Category</label>
              <select
                value={roleCategory}
                onChange={(e) =>
                  setRoleCategory(
                    e.target.value as
                      | 'GenAI & LLM'
                      | 'AI Systems & Inference'
                      | 'Distributed Training & CUDA'
                      | 'Computer Vision & Multimodal'
                      | 'Agent Architect'
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm"
              >
                <option value="AI Systems & Inference">AI Systems & Inference</option>
                <option value="GenAI & LLM">GenAI & LLM</option>
                <option value="Agent Architect">Agent Architect</option>
                <option value="Distributed Training & CUDA">Distributed Training & CUDA</option>
                <option value="Computer Vision & Multimodal">Computer Vision & Multimodal</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                <span>Location</span>
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru (Hybrid)"
              />
            </div>
          </div>

          {/* Salary & Min Report Score */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                <span>Salary / Compensation Band</span>
              </label>
              <Input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="₹28L - ₹45L CTC"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-chart-5" />
                  <span>Min AI Report Card Score</span>
                </span>
                <span className="text-primary font-mono font-bold">{minReportScore.toFixed(1)} / 10</span>
              </label>
              <select
                value={minReportScore}
                onChange={(e) => setMinReportScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm"
              >
                <option value={7.0}>7.0+ (Intermediate)</option>
                <option value={7.5}>7.5+ (Proficient)</option>
                <option value={8.0}>8.0+ (Advanced AI Engineer)</option>
                <option value={8.5}>8.5+ (Senior Bar)</option>
                <option value={9.0}>9.0+ (Principal / Architect Tier)</option>
              </select>
            </div>
          </div>

          {/* Minimum League Tier Prerequisite */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1">
              <Award className="w-3 h-3 text-primary" />
              <span>Minimum Competitive League Tier Gating</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'bronze', label: '🥉 Bronze' },
                { id: 'silver', label: '🥈 Silver' },
                { id: 'gold', label: '🥇 Gold' },
                { id: 'diamond', label: '💎 Master' },
                { id: 'architect', label: '👑 Architect' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() =>
                    setMinLeagueTier(
                      tier.id as 'bronze' | 'silver' | 'gold' | 'diamond' | 'architect'
                    )
                  }
                  className={`py-2 px-1 rounded-xl text-center font-bold text-sm border transition-all cursor-pointer ${
                    minLeagueTier === tier.id
                      ? 'bg-primary/15 border-primary text-primary shadow-xs'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Required Proof-of-Skill Badges */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Required Proof-of-Skill Badges (Candidate Must Hold):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BADGE_OPTIONS.map((badge) => {
                const checked = selectedBadges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      checked
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{checked ? '✓' : '+'}</span>
                    <span>{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Role Description & Architecture Expectations</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-lg font-bold shadow-xs gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing Role...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Role & Open Candidate Matching</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
