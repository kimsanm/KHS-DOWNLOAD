import React, { useState, useEffect } from 'react';
import { 
  Clipboard, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { isValidUrl } from '../utils/kuaishouParser';

interface HeroDownloaderProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (targetUrl?: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onOpenSupportedSites: () => void;
  isDark: boolean;
}

export const HeroDownloader: React.FC<HeroDownloaderProps> = ({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  errorMessage,
  onClearError,
  onOpenSupportedSites,
  isDark,
}) => {
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Sample Kuaishou URL requested by user
  const sampleKuaishouUrl = 'https://v.kuaishou.com/KwNH1t3F';

  const handlePasteOrClear = async () => {
    onClearError();
    if (url.trim().length > 0) {
      onUrlChange('');
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            onUrlChange(text.trim());
            setCopiedFeedback(true);
            setTimeout(() => setCopiedFeedback(false), 1500);
          }
        } else {
          // Fallback if clipboard API is restricted
          onUrlChange(sampleKuaishouUrl);
        }
      } catch (err) {
        // Fallback to sample URL if permission denied
        onUrlChange(sampleKuaishouUrl);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }
    onSubmit();
  };

  const supportedPills = [
    { name: 'X', bg: 'bg-black text-white hover:bg-zinc-800' },
    { name: 'Facebook', bg: 'bg-blue-600 text-white hover:bg-blue-700' },
    { name: 'Instagram', bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white' },
    { name: 'TikTok', bg: 'bg-slate-900 text-white hover:bg-slate-800' },
    { name: 'Pinterest', bg: 'bg-red-600 text-white hover:bg-red-700' },
    { name: 'Bluesky', bg: 'bg-sky-500 text-white hover:bg-sky-600' },
    { name: 'Vimeo', bg: 'bg-cyan-600 text-white hover:bg-cyan-700' },
    { name: 'LinkedIn', bg: 'bg-blue-700 text-white hover:bg-blue-800' },
  ];

  return (
    <section className={`py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden transition-colors ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gradient-to-b from-blue-50/50 via-white to-slate-50 text-slate-800'
    }`}>
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-500/10 to-teal-400/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free • No Watermark • 720p & 1080p HD</span>
        </div>

        {/* Headlines */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-display">
          Kuaishou Downloader
        </h1>
        <h2 className="mt-3 sm:mt-4 text-lg sm:text-2xl font-semibold text-slate-600 dark:text-slate-300">
          Download Videos from Kuaishou Without Watermark
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Save high-quality MP4 videos & MP3 audio directly to your iPhone, Android, PC or Mac with zero registration.
        </p>

        {/* Error notification alert */}
        {errorMessage && (
          <div className="mt-6 max-w-2xl mx-auto p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={onClearError}
              className="text-xs font-semibold hover:underline px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Downloader Form Input Box */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form 
            onSubmit={handleFormSubmit}
            className={`p-1.5 sm:p-2 rounded-full flex items-center shadow-xl transition-all ${
              isDark 
                ? 'bg-slate-800/90 border border-slate-700 shadow-slate-950/50 focus-within:border-blue-500' 
                : 'bg-white border border-slate-200 shadow-blue-500/5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100'
            }`}
          >
            {/* Input Element */}
            <input
              id="url"
              type="text"
              name="url"
              value={url}
              onChange={(e) => {
                onUrlChange(e.target.value);
                if (errorMessage) onClearError();
              }}
              placeholder="Paste the link here"
              aria-label="Paste the Kuaishou link here"
              className="flex-1 bg-transparent px-4 sm:px-6 py-2.5 sm:py-3.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none w-full"
            />

            {/* Paste / Clear Button */}
            <button
              type="button"
              onClick={handlePasteOrClear}
              id="paste"
              aria-label={url.trim().length > 0 ? "Clear link" : "Paste link from clipboard"}
              className={`p-2 sm:p-2.5 rounded-full transition-colors mr-1 sm:mr-2 ${
                url.trim().length > 0
                  ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={url.trim().length > 0 ? "Clear input" : "Paste from clipboard"}
            >
              {url.trim().length > 0 ? (
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : copiedFeedback ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              ) : (
                <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Submit Download Button */}
            <button
              type="submit"
              id="downloadBtn"
              disabled={isLoading || !url.trim()}
              className={`px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 text-white transition-all shadow-md ${
                isLoading || !url.trim()
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-75'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset / Sample Link Option */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Try sample URL:</span>
            <button
              type="button"
              onClick={() => {
                onUrlChange(sampleKuaishouUrl);
                onSubmit(sampleKuaishouUrl);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              <span>{sampleKuaishouUrl}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Supported Sites Tag Badges */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Supported Social Platforms
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {supportedPills.map((site) => (
              <span
                key={site.name}
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${site.bg} cursor-default`}
              >
                {site.name}
              </span>
            ))}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenSupportedSites}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4"
            >
              List of all supported sites &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
