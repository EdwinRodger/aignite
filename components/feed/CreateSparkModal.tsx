'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Upload,
  X,
  AlertCircle,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { uploadSparkMedia, validateSparkMediaFile } from '@/lib/supabase/storage';
import { createSparkPostAction, getCurrentStudentFeedIdentityAction } from '@/app/actions/feed';
import { SocialFeedPost } from '@/lib/feed-social-data';

interface UserFeedProfile {
  name: string;
  handle: string;
  avatarUrl?: string;
  initials: string;
}

interface CreateSparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSparkCreated: (newPost: SocialFeedPost) => void;
  userProfile?: UserFeedProfile;
}

const CATEGORIES: SocialFeedPost['category'][] = [
  'GenAI',
  'Robotics',
  'ML Systems',
  'Student Projects',
  'Computer Vision',
  'Deep Learning',
];

export function CreateSparkModal({
  isOpen,
  onClose,
  onSparkCreated,
  userProfile: initialProfile,
}: CreateSparkModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [category, setCategory] = useState<SocialFeedPost['category']>('Student Projects');
  const [tagsInput, setTagsInput] = useState('#StudentSpark, #AIgnite');
  const [profile, setProfile] = useState<UserFeedProfile>(
    initialProfile || {
      name: 'Student Learner',
      handle: '@student_dev',
      initials: 'SL',
    }
  );

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'none'>('none');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load identity from Supabase profile on mount
  useEffect(() => {
    if (initialProfile) return;

    getCurrentStudentFeedIdentityAction()
      .then((data) => {
        if (data) {
          setProfile(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load profile identity:', err);
      });
  }, [initialProfile]);

  // File selection handler with strict 10 MB check
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateSparkMediaFile(file);
    if (!validation.valid || !validation.mediaType) {
      setFileError(validation.error || 'Invalid file format.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setMediaType(validation.mediaType);

    // Create object URL for immediate client preview
    const preview = URL.createObjectURL(file);
    setMediaPreviewUrl(preview);
  };

  const handleRemoveMedia = () => {
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
    setSelectedFile(null);
    setMediaPreviewUrl(null);
    setMediaType('none');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!title.trim() || title.trim().length < 5) {
      setSubmitError('Please provide a title with at least 5 characters.');
      return;
    }

    if (!summary.trim() || summary.trim().length < 10) {
      setSubmitError('Please provide a summary or caption with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedUrl: string | undefined = undefined;
      let finalMediaType: 'video' | 'image' | 'none' = 'none';

      // 1. Upload media if file selected
      if (selectedFile) {
        const uploadResult = await uploadSparkMedia(selectedFile);
        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsSubmitting(false);
          return;
        }
        uploadedUrl = uploadResult.url;
        finalMediaType = uploadResult.mediaType;
      }

      // 2. Parse tags
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));

      // 3. Create spark post action (pulls identity from Supabase profile)
      const result = await createSparkPostAction({
        title: title.trim(),
        summary: summary.trim(),
        keyTakeaway: keyTakeaway.trim() || undefined,
        category,
        mediaUrl: uploadedUrl,
        mediaType: finalMediaType,
        tags: tags.length > 0 ? tags : ['#StudentSpark'],
        authorName: profile.name,
        authorHandle: profile.handle,
      });

      if (!result.success || !result.post) {
        setSubmitError(result.error || 'Failed to publish spark post.');
        setIsSubmitting(false);
        return;
      }

      // 4. Notify parent & reset form
      onSparkCreated(result.post);
      handleClose();
    } catch (err: unknown) {
      console.error('Error in spark submission:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSummary('');
    setKeyTakeaway('');
    setCategory('Student Projects');
    setTagsInput('#StudentSpark, #AIgnite');
    handleRemoveMedia();
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden rounded-3xl flex flex-col border border-border bg-card shadow-2xl">
        {/* Fixed Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/50 shrink-0 bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className="gap-1.5 px-2.5 py-0.5 text-sm font-bold bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Spark</span>
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">Community Feed</span>
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Share Your AI Project or Breakthrough
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Post short video demonstrations, experimental benchmarks, or edge AI milestones. Free Supabase media upload is capped at 10 MB per post.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body with inset padding and clean internal scroll */}
        <form
          id="create-spark-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
        >
          {submitError && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Posting Identity (Auto-populated from Supabase Profile) */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-primary">
                    {profile.initials}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground truncate">
                    {profile.name}
                  </span>
                  <Badge variant="outline" className="px-1.5 py-0 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                    Posting as You
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground font-mono truncate block">
                  {profile.handle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground font-mono shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Supabase</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Spark Title <span className="text-primary">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fine-tuned Llama-3 with QLoRA on Apple MLX at 45 FPS"
              className="rounded-xl text-sm"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Category
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 text-muted-foreground border-border/60 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Summary / Caption */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Summary / Caption <span className="text-primary">*</span>
            </label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explain the engineering breakthrough, memory optimization, or problem you solved..."
              rows={3}
              className="rounded-xl text-sm leading-relaxed"
              required
            />
          </div>

          {/* Key Takeaway */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Key Rule of Thumb / Takeaway (Optional)
            </label>
            <Input
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              placeholder="e.g. Always benchmark memory bandwidth before scaling parameter counts."
              className="rounded-xl text-sm"
            />
          </div>

          {/* Media Upload (Video or Image) with 10MB Constraint */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-foreground">
                Attach Short Video or Image (Max 10 MB)
              </label>
              <span className="text-sm text-muted-foreground font-mono">10 MB limit</span>
            </div>

            {mediaPreviewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-border bg-black/80 aspect-[16/10] flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors cursor-pointer"
                  title="Remove media"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-border/80 hover:border-primary/60 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">
                      Click to upload short video or image
                    </span>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      MP4, WebM, PNG, or JPG up to 10 MB
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {fileError && (
              <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Tags (comma separated)
            </label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#MLX, #PyTorch, #LocalLLM"
              className="rounded-xl text-sm"
            />
          </div>
        </form>

        {/* Fixed Bottom Action Footer */}
        <div className="p-4 sm:px-6 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-spark-form"
            disabled={isSubmitting}
            className="rounded-xl text-sm font-bold gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Spark</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
