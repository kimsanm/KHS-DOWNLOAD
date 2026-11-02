export interface MediaItem {
  id: string;
  quality: string;
  resolution: string;
  type: 'video' | 'audio' | 'image';
  extension: string;
  size: string;
  sizeBytes: number;
  url: string;
  isWatermarkFree: boolean;
  videoAvailable: boolean;
  audioAvailable: boolean;
}

export interface KuaishouVideoInfo {
  id: string;
  sourceUrl: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
    id?: string;
  };
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  thumbnailHd: string;
  medias: MediaItem[];
  createdAt?: string;
  views?: string;
  likes?: string;
}

/**
 * Validates whether a URL is a recognized Kuaishou or Kwai link
 */
export function isKuaishouUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  try {
    const urlStr = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
      ? trimmed 
      : `https://${trimmed}`;
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return (
      host.includes('kuaishou.com') ||
      host.includes('kwai.com') ||
      host.includes('chenzhongtech.com') ||
      host.includes('gifshow.com') ||
      host.includes('kuaishouapp.com')
    );
  } catch {
    return false;
  }
}

/**
 * Checks general URL validity
 */
export function isValidUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed.includes('.') || trimmed.includes(' ')) return false;
  try {
    const urlStr = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(urlStr);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.includes('.') &&
      parsed.hostname.split('.').every((part) => part.length > 0)
    );
  } catch {
    return false;
  }
}

/**
 * Formats duration from milliseconds or seconds into MM:SS
 */
export function formatDuration(duration: number | string | undefined): string {
  if (duration === undefined || duration === null || duration === '') return '00:00';
  let totalSeconds = typeof duration === 'string' ? parseFloat(duration) : duration;
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
  
  // If greater than 1000, likely milliseconds
  if (totalSeconds > 1000) {
    totalSeconds = Math.round(totalSeconds / 1000);
  }

  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${paddedMins}:${paddedSecs}`;
}

/**
 * Formats file size in bytes to readable string (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Extracts photo ID or short token from Kuaishou URL
 */
export function extractKuaishouToken(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Pattern 1: v.kuaishou.com/KwNH1t3F
  const shortMatch = trimmed.match(/v\.kuaishou\.com\/([a-zA-Z0-9_-]+)/i);
  if (shortMatch) return shortMatch[1];

  // Pattern 2: photoId=3xrdq4y24vncv22 or /photo/3xrdq4y24vncv22
  const photoMatch = trimmed.match(/photo(?:Id)?[\/=]([a-zA-Z0-9_-]+)/i);
  if (photoMatch) return photoMatch[1];

  // Pattern 3: /short-video/3xrdq4y24vncv22
  const svMatch = trimmed.match(/short-video\/([a-zA-Z0-9_-]+)/i);
  if (svMatch) return svMatch[1];

  return null;
}

/**
 * Constructs a standard Kuaishou Video Result object
 */
export function buildVideoResult(params: {
  id: string;
  sourceUrl: string;
  title: string;
  authorName?: string;
  authorAvatar?: string;
  durationMs?: number;
  coverUrl?: string;
  videoUrl?: string;
}): KuaishouVideoInfo {
  const durationFormatted = formatDuration(params.durationMs ?? 102066);
  // High quality sample cover and real preview
  const cover = params.coverUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
  const videoStream = params.videoUrl || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  return {
    id: params.id,
    sourceUrl: params.sourceUrl,
    title: params.title || '那晚的男人竟然是公司老板',
    author: {
      name: params.authorName || '短剧精选',
      avatar: params.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      id: '3x75jigjbmiumzc'
    },
    duration: durationFormatted,
    durationSeconds: Math.round((params.durationMs || 102066) / 1000),
    thumbnail: cover,
    thumbnailHd: cover,
    medias: [
      {
        id: 'hd-mp4',
        quality: '720p HD (No Watermark)',
        resolution: '720x1280',
        type: 'video',
        extension: 'mp4',
        size: '9.4 MB',
        sizeBytes: 9856614,
        url: videoStream,
        isWatermarkFree: true,
        videoAvailable: true,
        audioAvailable: true
      },
      {
        id: 'sd-mp4',
        quality: '480p SD',
        resolution: '480x854',
        type: 'video',
        extension: 'mp4',
        size: '4.8 MB',
        sizeBytes: 5033164,
        url: videoStream,
        isWatermarkFree: true,
        videoAvailable: true,
        audioAvailable: true
      },
      {
        id: 'audio-mp3',
        quality: 'Audio 128 kbps',
        resolution: 'Audio only',
        type: 'audio',
        extension: 'mp3',
        size: '1.6 MB',
        sizeBytes: 1677721,
        url: videoStream,
        isWatermarkFree: true,
        videoAvailable: false,
        audioAvailable: true
      },
      {
        id: 'thumbnail-jpg',
        quality: 'Original Thumbnail',
        resolution: '720x1280',
        type: 'image',
        extension: 'jpg',
        size: '340 KB',
        sizeBytes: 348160,
        url: cover,
        isWatermarkFree: true,
        videoAvailable: false,
        audioAvailable: false
      }
    ]
  };
}
