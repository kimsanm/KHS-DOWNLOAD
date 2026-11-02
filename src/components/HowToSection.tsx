import React from 'react';
import { Copy, Link2, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowToSectionProps {
  onScrollToTop: () => void;
  isDark: boolean;
}

export const HowToSection: React.FC<HowToSectionProps> = ({ onScrollToTop, isDark }) => {
  const steps = [
    {
      step: '01',
      title: 'Copy the Kuaishou URL link',
      description: 'Open the Kuaishou app or website, locate the short video or clip you want to download, and tap "Share" then "Copy Link".',
      icon: Copy,
      tip: 'Supports v.kuaishou.com shortlinks and web URLs'
    },
    {
      step: '02',
      title: 'Paste your Kuaishou URL',
      description: 'Go to KHS DOWNLOAD Kuaishou Downloader, paste the copied link into the input box above, and press the Download button.',
      icon: Link2,
      tip: 'Automatic watermark removal parsing'
    },
    {
      step: '03',
      title: 'Download and Save',
      description: 'Pick your preferred format (720p HD MP4, 480p SD, or MP3 Audio) and click Download to save the clean video directly to your storage.',
      icon: Download,
      tip: 'Saves directly to Camera Roll or Downloads folder'
    }
  ];

  return (
    <section className={`py-14 sm:py-20 px-4 sm:px-6 transition-colors border-b ${
      isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Quick 3-Step Guide
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
            How To Download Kuaishou Videos Online?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Downloading videos from Kuaishou is simple and quick with our Kuaishou Video Downloader. Follow these easy steps to save your favorite videos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step}
                className={`p-6 sm:p-8 rounded-2xl border relative flex flex-col justify-between ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 shadow-md' 
                    : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-display text-blue-600 dark:text-blue-400">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{s.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <span>Start Downloading Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
