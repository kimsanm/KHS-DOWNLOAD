import React, { useRef } from 'react';
import { X, Download, ExternalLink, Play, Film } from 'lucide-react';
import { KuaishouVideoInfo } from '../types';

interface VideoPlayerModalProps {
  data: KuaishouVideoInfo;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  data,
  isOpen,
  onClose,
  isDark
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const defaultVideoUrl = data.medias.find(m => m.type === 'video')?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-600" />
            <h3 id="preview-title" className="text-base font-bold truncate max-w-md">
              {data.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close preview modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black flex items-center justify-center aspect-video max-h-[60vh]">
          <video
            ref={videoRef}
            src={defaultVideoUrl}
            poster={data.thumbnail}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video preview.
          </video>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span>Resolution: <strong>720p HD</strong></span>
            <span className="mx-2">•</span>
            <span>Duration: <strong>{data.duration}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={defaultVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
