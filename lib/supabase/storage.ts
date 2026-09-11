import { createClient as createBrowserClient } from './client';

export const MAX_SPARK_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
export const ALLOWED_SPARK_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export type AllowedMimeType = typeof ALLOWED_SPARK_MIME_TYPES[number];

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'video' | 'image';
}

/**
 * Validates file size and type client-side before upload.
 * Enforces strict 10 MB maximum size constraint.
 */
export function validateSparkMediaFile(file: File): MediaValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_SPARK_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed size is 10 MB.`,
    };
  }

  const mimeType = file.type.toLowerCase();
  const isAllowed = ALLOWED_SPARK_MIME_TYPES.some((allowed) => mimeType.startsWith(allowed) || allowed === mimeType);

  if (!isAllowed) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload MP4/WebM short videos or JPG/PNG/WebP images.',
    };
  }

  const mediaType: 'video' | 'image' = mimeType.startsWith('video') ? 'video' : 'image';
  return { valid: true, mediaType };
}

/**
 * Uploads media to Supabase Storage 'sparks-media' bucket.
 * If Supabase is unconfigured or in offline demo mode, returns a reliable data URL or object URL.
 */
export async function uploadSparkMedia(file: File): Promise<{
  url: string;
  mediaType: 'video' | 'image';
  error?: string;
}> {
  const validation = validateSparkMediaFile(file);
  if (!validation.valid || !validation.mediaType) {
    return {
      url: '',
      mediaType: 'image',
      error: validation.error || 'Invalid file.',
    };
  }

  const mediaType = validation.mediaType;

  // Check if Supabase client is properly configured with real credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isRealSupabase =
    Boolean(supabaseUrl) &&
    !supabaseUrl?.includes('placeholder.supabase.co') &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.includes('placeholder-publishable-key');

  if (!isRealSupabase) {
    // Generate an in-browser local URL for immediate offline/demo responsiveness
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          mediaType,
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          mediaType,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const supabase = createBrowserClient();
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `sparks/${timestamp}_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from('sparks-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload error, falling back to local preview:', error.message);
      // Fallback to client data URL if bucket does not exist yet or permissions are restricted
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            mediaType,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('sparks-media')
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      mediaType,
    };
  } catch (err: unknown) {
    console.error('Failed to upload spark media:', err);
    // Graceful fallback to data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          mediaType,
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
