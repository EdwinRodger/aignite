'use client';

import React, { useState } from 'react';
import { CandidateTalent, RecruiterJob } from '@/lib/recruiter-data';
import { sendInterviewInvitationAction } from '@/app/actions/recruiter';
import { Send, Loader2, CheckCircle2, Briefcase, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface InterviewInviteModalProps {
  candidate: CandidateTalent;
  activeJobs: RecruiterJob[];
  currentCompany: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function InterviewInviteModal({
  candidate,
  activeJobs,
  currentCompany,
  onClose,
  onSuccess,
}: InterviewInviteModalProps) {
  const [selectedJob, setSelectedJob] = useState(
    activeJobs[0]?.title || 'Senior AI Systems Engineer'
  );
  const [roundType, setRoundType] = useState<
    'Screening Call' | 'Systems Architecture' | 'Coding & Live Inference' | 'Executive Bar Raiser'
  >('Systems Architecture');
  const [customNote, setCustomNote] = useState(
    `Hi ${candidate.fullName}, our technical hiring team at ${currentCompany} reviewed your AIgnite Report Card (${candidate.reportCard.overallScore}/10) and your verified badges (${candidate.verifiedBadges.join(', ')}). We would love to invite you for an expedited ${roundType} round for our ${selectedJob} opening.`
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await sendInterviewInvitationAction(candidate.id, {
        candidateName: candidate.fullName,
        companyName: currentCompany,
        roleTitle: selectedJob,
        roundType,
        customNote,
      });

      if (res.success) {
        setSent(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to dispatch interview invite.');
      }
    } catch {
      setError('An error occurred while sending the invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col rounded-3xl">
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground font-sans">
                Dispatch Interview Invitation
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-mono">
                To: {candidate.fullName} ({candidate.collegeOrCompany})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {sent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Interview Invitation Dispatched!</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {candidate.fullName} has been sent an official notification with priority fast-track scheduling.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4 text-sm">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Select Role */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Target AI Engineering Opening</span>
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm"
              >
                {activeJobs.map((j) => (
                  <option key={j.id} value={j.title}>
                    {j.title} ({j.salaryRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Round */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Fast-Track Round Stage</span>
              </label>
              <select
                value={roundType}
                onChange={(e) =>
                  setRoundType(
                    e.target.value as
                      | 'Screening Call'
                      | 'Systems Architecture'
                      | 'Coding & Live Inference'
                      | 'Executive Bar Raiser'
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm"
              >
                <option value="Screening Call">Screening Call (30 mins)</option>
                <option value="Systems Architecture">Systems Architecture & RAG Deep Dive (60 mins)</option>
                <option value="Coding & Live Inference">Coding & Live Inference Optimization (60 mins)</option>
                <option value="Executive Bar Raiser">Principal / Executive Bar Raiser (45 mins)</option>
              </select>
            </div>

            {/* Personalized Note */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>Personalized Recruiter Invitation Note</span>
                <span className="text-sm text-muted-foreground font-mono">Visible to Candidate</span>
              </label>
              <Textarea
                rows={4}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="leading-relaxed resize-none font-sans"
              />
            </div>

            {/* Candidate Verification Summary */}
            <div className="p-3 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground flex items-center justify-between">
              <span>Candidate Match: {candidate.leagueTier.toUpperCase()} TIER</span>
              <span className="text-primary font-bold">Report Card: {candidate.reportCard.overallScore}/10</span>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl font-bold shadow-md shadow-primary/20 gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Verified Invitation</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
