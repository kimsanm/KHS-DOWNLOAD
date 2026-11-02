import React from 'react';
import { Download, Sparkles, Smartphone, Monitor, ShieldAlert } from 'lucide-react';

interface SeoGuideSectionProps {
  onScrollToTop: () => void;
  isDark: boolean;
}

export const SeoGuideSection: React.FC<SeoGuideSectionProps> = ({ onScrollToTop, isDark }) => {
  return (
    <section className={`py-14 sm:py-20 px-4 sm:px-6 transition-colors border-b ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Article Section */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
            Free Kuaishou Video Downloader
          </h2>
          
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            Kuaishou is one of the most popular short-video platforms in the world, offering engaging content that users often want to save for offline viewing. Our Kuaishou Video Downloader is the perfect tool to help you effortlessly download your favorite videos in high quality to your computer or mobile device (iOS and Android).
          </p>

          <p className="text-sm sm:text-base leading-relaxed mb-6">
            Unlike other downloaders that compress video resolution or insert annoying logos, KHS DOWNLOAD fetches the authentic, high-bitrate media directly from official CDN nodes. Whether it’s an entertaining sketch, a culinary recipe, or a dramatic short series episode, our tool extracts the original audio and video streams without watermarks.
          </p>

          {/* Compatibility Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50/50 border-blue-100'
            }`}>
              <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  iPhone & Android Mobile
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Works seamlessly in Safari, Chrome, and Samsung Internet. Download directly to your Camera Roll or Files app without installing third-party apps.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-indigo-50/50 border-indigo-100'
            }`}>
              <Monitor className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Windows, Mac & Linux
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  High-speed downloading via Edge, Chrome, Firefox, or Brave. Save in HD MP4 or extract audio directly to MP3.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner: "Better save it Before it's gone. Download" */}
        <div className="mt-12 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs mb-3">
                KHS DOWNLOAD
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
                Better save it before it’s gone.
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
                Fast, secure, watermark-free Kuaishou video downloads ready in seconds.
              </p>
            </div>

            <button
              onClick={onScrollToTop}
              className="px-8 py-3.5 rounded-full font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 active:scale-95 shadow-lg shadow-black/10 transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Now</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
