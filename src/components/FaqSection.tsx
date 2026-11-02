import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  isDark: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ isDark }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is KHS DOWNLOAD?',
      a: 'KHS DOWNLOAD is a free web-based utility that lets you save videos, short clips, and music from Kuaishou (快手) or Kwai directly to your computer or mobile device in high-definition MP4 format without watermarks.'
    },
    {
      q: 'How can I download Kuaishou videos without watermarks?',
      a: 'Simply copy the video link from the Kuaishou app or browser (e.g., https://v.kuaishou.com/KwNH1t3F), paste it into our search bar, and click Download. KHS DOWNLOAD automatically accesses the original watermark-free stream provided by the content distribution network.'
    },
    {
      q: 'Is KHS DOWNLOAD completely free?',
      a: 'Yes, 100% free! There are no hidden fees, paid tiers, or daily download limits. You can download as many videos as you want without registering or logging in.'
    },
    {
      q: 'Does it work on iPhone, iPad, and Android?',
      a: 'Yes! On iOS, open Safari, paste the link into KHS DOWNLOAD, and tap Download. Safari will save the video straight to your Downloads manager or Photos app. On Android, Chrome and other mobile browsers work identically.'
    },
    {
      q: 'Where do downloaded videos get saved?',
      a: 'Files are saved to your device’s default download directory. On Windows and Mac, this is typically the "Downloads" folder. On mobile devices, check your browser downloads or Files app.'
    },
    {
      q: 'Can I extract and download MP3 audio from Kuaishou clips?',
      a: 'Yes! Along with 720p HD and 480p SD video streams, KHS DOWNLOAD provides an audio extraction option that lets you save high-quality MP3 tracks from any Kuaishou clip.'
    },
    {
      q: 'Do you track my downloads or store copies of videos?',
      a: 'No. KHS DOWNLOAD does not store downloaded videos on our servers and does not keep logs or tracking history of what you download. All content is fetched directly between your device and the CDN.'
    }
  ];

  return (
    <section className={`py-14 sm:py-20 px-4 sm:px-6 transition-colors border-b ${
      isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-100 text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about downloading Kuaishou videos
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all ${
                  isDark 
                    ? 'bg-slate-800/80 border-slate-700/80' 
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
