import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Coffee, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Share2, 
  QrCode, 
  Check, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Layers,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { KuaishouVideoInfo, MediaItem } from '../types';

interface ResultCardProps {
  data: KuaishouVideoInfo;
  onOpenPreview: () => void;
  onOpenQrCode: () => void;
  onReset: () => void;
  isDark: boolean;
  onAddToBatch: (media?: MediaItem) => void;
  isMediaInBatch: (mediaId?: string) => boolean;
  batchCount: number;
  onDownloadAll?: () => void;
  onScrollToBatch?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  data,
  onOpenPreview,
  onOpenQrCode,
  onReset,
  isDark,
  onAddToBatch,
  isMediaInBatch,
  batchCount,
  onDownloadAll,
  onScrollToBatch
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Default primary video media (720p HD or first video)
  const primaryMedia = data.medias.find(m => m.type === 'video') || data.medias[0];
  const isPrimaryInBatch = isMediaInBatch(primaryMedia?.id);

  const handleDownload = async (media: MediaItem) => {
    setDownloadingId(media.id);
    
    try {
      const filename = `kuaishou_${data.id}_${media.quality.replace(/[^a-zA-Z0-9]/g, '_')}.${media.extension}`;
      
      const endpoint = `/api/download?url=${encodeURIComponent(media.url)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      }

      setDownloadedIds(prev => ({ ...prev, [media.id]: true }));
    } catch (e) {
      console.error('Download trigger error:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadThumbnail = () => {
    const thumbMedia = data.medias.find(m => m.type === 'image') || {
      id: 'thumb',
      quality: 'HD Thumbnail',
      resolution: '720x1280',
      type: 'image' as const,
      extension: 'jpg',
      size: '340 KB',
      sizeBytes: 348160,
      url: data.thumbnailHd || data.thumbnail,
      isWatermarkFree: true,
      videoAvailable: false,
      audioAvailable: false
    };
    handleDownload(thumbMedia);
  };

  const handleAddPrimaryToBatch = () => {
    onAddToBatch(primaryMedia);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Social share links
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://anydownloader.com';
  const shareText = encodeURIComponent(`Download ${data.title} without watermark on KHS DOWNLOAD`);
  
  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bg: 'bg-blue-600 hover:bg-blue-700 text-white',
      label: 'FB'
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`,
      bg: 'bg-black hover:bg-zinc-800 text-white',
      label: 'X'
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`,
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      label: 'WA'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${shareText}`,
      bg: 'bg-red-600 hover:bg-red-700 text-white',
      label: 'Pin'
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${shareText}`,
      bg: 'bg-orange-600 hover:bg-orange-700 text-white',
      label: 'Reddit'
    }
  ];

  return (
    <section id="result" className={`py-10 px-4 sm:px-6 transition-colors border-b scroll-mt-24 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
    }`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header Card notification with Download All button if multiple in batch */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Video ready for download!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Extracted watermark-free streams from Kuaishou CDN.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Show 'Download All' button when more than one link is in the queue */}
            {batchCount > 1 && onDownloadAll && (
              <button
                onClick={onDownloadAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm active:scale-95 transition-all"
                aria-label={`Download all ${batchCount} queued videos`}
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download All ({batchCount})</span>
              </button>
            )}

            {/* Batch Queue Pill Counter */}
            {batchCount > 0 && onScrollToBatch && (
              <button
                onClick={onScrollToBatch}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/40 hover:bg-blue-200/80 transition-colors"
                title="View batch queue"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Queue: {batchCount}</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Download Another</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Thumbnail & Actions, Right Formats Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Video Poster & Info */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 bg-slate-950">
              <img 
                src={data.thumbnail} 
                alt={data.title}
                className="w-full aspect-9/14 object-cover object-center group-hover:scale-102 transition-transform duration-300"
              />

              {/* Duration badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-xs font-semibold tracking-wider font-mono">
                {data.duration}
              </div>

              {/* Watermark Free Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold tracking-wide shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>No Watermark</span>
              </div>

              {/* Preview Overlay Button */}
              <button
                onClick={onOpenPreview}
                aria-label="Play video preview"
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-blue-600 transition-all backdrop-blur-xs group/btn"
              >
                <Play className="w-6 h-6 fill-white ml-1" />
              </button>
            </div>

            {/* Quick Action Buttons Below Thumbnail (including 'Add to Batch') */}
            <div className="mt-4 flex flex-col gap-2 w-full max-w-sm">
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleDownloadThumbnail}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Thumbnail</span>
                </button>

                <button
                  onClick={onOpenPreview}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {/* 'Add to Batch' Button */}
              <button
                onClick={handleAddPrimaryToBatch}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                  isPrimaryInBatch
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : addedAnimation
                    ? 'bg-emerald-500 text-white scale-102'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                }`}
                aria-label={isPrimaryInBatch ? "Video already added to batch" : "Add this video to download batch"}
              >
                {isPrimaryInBatch ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>In Batch Queue ({batchCount})</span>
                  </>
                ) : addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Batch!</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Add to Batch</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-2 w-full max-w-sm">
              <a
                href="https://ko-fi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy Us a Coffee</span>
              </a>
            </div>
          </div>

          {/* Right Column: Title & Quality Formats Table */}
          <div className="lg:col-span-7">
            
            {/* Video Title Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <span>Creator: <strong className="text-slate-800 dark:text-slate-200">{data.author.name}</strong></span>
                <span>•</span>
                <span>Duration: <strong>{data.duration}</strong></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {data.title}
              </h2>
            </div>

            {/* Quality Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th scope="col" className="px-4 py-3">Quality & Format</th>
                    <th scope="col" className="px-4 py-3">File Size</th>
                    <th scope="col" className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.medias.map((media) => {
                    const isDownloading = downloadingId === media.id;
                    const isDownloaded = downloadedIds[media.id];
                    const inBatch = isMediaInBatch(media.id);

                    let badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
                    let btnColor = 'bg-blue-600 hover:bg-blue-700 text-white';

                    if (media.type === 'video' && media.isWatermarkFree) {
                      badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
                      btnColor = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';
                    } else if (media.type === 'audio') {
                      badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300';
                      btnColor = 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20';
                    } else if (media.type === 'image') {
                      badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300';
                      btnColor = 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600';
                    }

                    return (
                      <tr 
                        key={media.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                              {media.type === 'video' ? (
                                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              ) : media.type === 'audio' ? (
                                <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{media.quality}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${badgeColor}`}>
                                  {media.extension}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                {media.resolution}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300">
                            {media.size}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* '+ Batch' button for format row */}
                            <button
                              onClick={() => onAddToBatch(media)}
                              className={`p-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                inBatch
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                              }`}
                              title={inBatch ? "Already in batch" : "Add this format to batch"}
                              aria-label={`Add ${media.quality} to batch`}
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </button>

                            {/* Direct Download button */}
                            <button
                              onClick={() => handleDownload(media)}
                              disabled={isDownloading}
                              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 ${btnColor}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>
                                {isDownloading ? 'Saving...' : isDownloaded ? 'Downloaded' : 'Download'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Social Share Bar */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Share this downloader:</span>
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {shareLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs ${s.bg}`}
                      title={`Share on ${s.name}`}
                    >
                      {s.label}
                    </a>
                  ))}

                  <button
                    onClick={onOpenQrCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Generate QR code to download on mobile"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
