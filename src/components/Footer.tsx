import React from 'react';
import { Download, Moon, Sun, Heart, Shield, Globe } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES } from './Header';

interface FooterProps {
  isDark: boolean;
  onToggleDark: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSupportedSites: () => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDark,
  onToggleDark,
  onNavigateTab,
  onOpenSupportedSites,
  currentLang,
  onLanguageChange
}) => {
  return (
    <footer className={`py-12 sm:py-16 px-4 sm:px-6 transition-colors ${
      isDark ? 'bg-slate-950 text-slate-400 border-t border-slate-800' : 'bg-slate-900 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Download className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                KHS <span className="text-blue-400">DOWNLOAD</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              KHS DOWNLOAD is the leading free online video downloader supporting Kuaishou, Kwai, TikTok, Instagram, Facebook, and 30+ other platforms without watermarks in pristine HD quality.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onToggleDark}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-300 bg-slate-800/80 transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={onOpenSupportedSites}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-300 bg-slate-800/80 transition-colors"
              >
                Supported Sites
              </button>
            </div>
          </div>

          {/* Downloaders Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Downloaders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('kuaishou')} className="hover:text-blue-400 transition-colors">
                  Kuaishou Downloader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('tiktok')} className="hover:text-blue-400 transition-colors">
                  TikTok Downloader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('instagram')} className="hover:text-blue-400 transition-colors">
                  Instagram Downloader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('facebook')} className="hover:text-blue-400 transition-colors">
                  Facebook Downloader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('x')} className="hover:text-blue-400 transition-colors">
                  X Downloader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('all')} className="hover:text-blue-400 transition-colors">
                  All Video Downloaders
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-blue-400 cursor-pointer">About Us</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Cookie Policy</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Disclaimer</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Sitemap</span></li>
            </ul>
          </div>

          {/* Languages Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Languages
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`text-left px-2 py-1 rounded-md transition-colors ${
                    currentLang === lang.code 
                      ? 'text-blue-400 font-bold bg-slate-800' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Disclaimer Box */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed mb-6">
          <p>
            <strong className="text-slate-400">Disclaimer:</strong> All site names, logos, and trademarks are property of their respective owners and are used on this site for identification purposes only. We do not host any pirated or copyrighted content on our server, and all the content that you download is downloaded to your system directly from their respective CDN servers. This website is for personal use only; downloading copyrighted material is strictly prohibited. You are solely responsible for any copyright violations or misuse of this website.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60 gap-3">
          <div>
            &copy; 2021-2026 KHS DOWNLOAD. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for fast, watermark-free media preservation.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
