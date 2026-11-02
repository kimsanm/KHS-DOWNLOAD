import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  MousePointerClick, 
  UserCheck, 
  Sparkles, 
  Award,
  Video
} from 'lucide-react';

interface FeaturesSectionProps {
  isDark: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ isDark }) => {
  const features = [
    {
      title: 'Free Tool',
      description: 'Our downloader allows you to save Kuaishou videos in HD quality. There is no need for subscriptions or hidden memberships.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Simple, Secure & Fast',
      description: 'We respect your privacy. Our downloader does not store or track your download history, keeping your personal data completely safe.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Easy to Use',
      description: 'You can save Kuaishou videos in just a few clicks. Simply copy the video URL, paste it into our tool, and download instantly.',
      icon: MousePointerClick,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'No Registration Required',
      description: 'You don\'t need to sign up, create an account, log in, or pay any fees. Our service is completely free and instant to use.',
      icon: UserCheck,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'
    },
    {
      title: 'No Watermarks',
      description: 'We extract clean, original watermark-free video streams. Perfect for personal archives, content inspiration, and offline playback.',
      icon: Sparkles,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800'
    },
    {
      title: 'High-Quality (Full HD & Audio)',
      description: 'AnyDownloader gives you the highest possible original resolution, including 1080p, 720p HD, and extracted MP3 audio without quality loss.',
      icon: Award,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800'
    }
  ];

  return (
    <section className={`py-14 sm:py-20 px-4 sm:px-6 transition-colors border-b ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>Why Choose AnyDownloader</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
            Online Kuaishou Video Downloader
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Download Kuaishou videos easily with our free Kuaishou video downloader. Save HD videos online without watermarks. Fast, secure, and no app required!
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.title}
                className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  isDark 
                    ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600' 
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-200 hover:bg-white hover:shadow-blue-500/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${feat.color}`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
