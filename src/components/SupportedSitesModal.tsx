import React, { useState } from 'react';
import { X, Search, CheckCircle, ExternalLink, Globe } from 'lucide-react';

interface SupportedSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSite?: (siteName: string) => void;
  isDark: boolean;
}

export const SupportedSitesModal: React.FC<SupportedSitesModalProps> = ({
  isOpen,
  onClose,
  onSelectSite,
  isDark
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const sites = [
    { name: 'Kuaishou', category: 'short-form', domain: 'kuaishou.com', color: 'bg-amber-500' },
    { name: 'Kwai', category: 'short-form', domain: 'kwai.com', color: 'bg-orange-500' },
    { name: 'TikTok', category: 'short-form', domain: 'tiktok.com', color: 'bg-slate-900' },
    { name: 'Douyin', category: 'short-form', domain: 'douyin.com', color: 'bg-zinc-800' },
    { name: 'Instagram', category: 'social', domain: 'instagram.com', color: 'bg-pink-600' },
    { name: 'Facebook', category: 'social', domain: 'facebook.com', color: 'bg-blue-600' },
    { name: 'Twitter / X', category: 'social', domain: 'x.com', color: 'bg-black' },
    { name: 'Threads', category: 'social', domain: 'threads.net', color: 'bg-neutral-900' },
    { name: 'Bluesky', category: 'social', domain: 'bsky.app', color: 'bg-sky-500' },
    { name: 'YouTube', category: 'video', domain: 'youtube.com', color: 'bg-red-600' },
    { name: 'Reddit', category: 'social', domain: 'reddit.com', color: 'bg-orange-600' },
    { name: 'Pinterest', category: 'social', domain: 'pinterest.com', color: 'bg-red-700' },
    { name: 'Vimeo', category: 'video', domain: 'vimeo.com', color: 'bg-cyan-600' },
    { name: 'Bilibili', category: 'video', domain: 'bilibili.com', color: 'bg-blue-400' },
    { name: 'Dailymotion', category: 'video', domain: 'dailymotion.com', color: 'bg-slate-700' },
    { name: 'LinkedIn', category: 'social', domain: 'linkedin.com', color: 'bg-blue-700' },
    { name: 'Twitch Clips', category: 'video', domain: 'twitch.tv', color: 'bg-purple-600' },
    { name: 'CapCut', category: 'short-form', domain: 'capcut.com', color: 'bg-zinc-900' },
    { name: 'Likee', category: 'short-form', domain: 'likee.video', color: 'bg-pink-500' },
    { name: 'SoundCloud', category: 'audio', domain: 'soundcloud.com', color: 'bg-orange-500' },
    { name: 'Tumblr', category: 'social', domain: 'tumblr.com', color: 'bg-indigo-700' },
    { name: 'VKontakte', category: 'social', domain: 'vk.com', color: 'bg-blue-500' },
    { name: 'Snapchat Spotlight', category: 'short-form', domain: 'snapchat.com', color: 'bg-yellow-400' },
    { name: 'Weibo', category: 'social', domain: 'weibo.com', color: 'bg-red-500' },
  ];

  const categories = [
    { id: 'all', label: 'All Platforms' },
    { id: 'short-form', label: 'Short-Form Videos' },
    { id: 'social', label: 'Social Networks' },
    { id: 'video', label: 'Video Portals' },
    { id: 'audio', label: 'Music & Audio' },
  ];

  const filtered = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(search.toLowerCase()) || 
                          site.domain.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || site.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border flex flex-col max-h-[85vh] ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="supported-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 id="supported-title" className="text-lg font-bold">
              Supported Platforms & Websites
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AnyDownloader supports downloading from 30+ popular online media services
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close supported sites modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="siteInput"
              type="text" 
              placeholder="Search site or platform (e.g. Kuaishou, TikTok)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sites Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <ul id="sitelist" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filtered.map((site) => (
              <li 
                key={site.name}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${site.color} shrink-0`} />
                  <div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {site.name}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {site.domain}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Supported</span>
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching sites found for "{search}". AnyDownloader continually adds new platforms!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Total {filtered.length} platforms listed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
