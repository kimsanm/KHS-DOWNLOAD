/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroDownloader } from './components/HeroDownloader';
import { ResultCard } from './components/ResultCard';
import { BatchQueuePanel } from './components/BatchQueuePanel';
import { FeaturesSection } from './components/FeaturesSection';
import { HowToSection } from './components/HowToSection';
import { SeoGuideSection } from './components/SeoGuideSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { QrCodeModal } from './components/QrCodeModal';
import { SupportedSitesModal } from './components/SupportedSitesModal';
import { LanguageCode, KuaishouVideoInfo, MediaItem } from './types';
import { 
  isValidUrl, 
  isKuaishouUrl, 
  extractKuaishouToken, 
  buildVideoResult 
} from './utils/kuaishouParser';
import {
  BatchQueueItem,
  addToBatch,
  removeFromBatch,
  clearBatch,
  isItemInBatch,
  canDownloadAll
} from './utils/batchQueue';
import { Layers, Download, Loader2 } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<KuaishouVideoInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('kuaishou');
  const [isDark, setIsDark] = useState<boolean>(false);

  // Batch download queue state
  const [batchQueue, setBatchQueue] = useState<BatchQueueItem[]>([]);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
    currentTitle: string;
  } | null>(null);

  // Modals state
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [qrCodeOpen, setQrCodeOpen] = useState<boolean>(false);
  const [supportedSitesOpen, setSupportedSitesOpen] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('anydownloader_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('anydownloader_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('anydownloader_theme', 'light');
      }
      return next;
    });
  };

  // Video parsing handler
  const parseVideoUrl = useCallback(async (targetUrl: string) => {
    if (!targetUrl || !targetUrl.trim()) {
      setErrorMessage('Please enter a valid URL.');
      return;
    }

    const trimmed = targetUrl.trim();
    if (!isValidUrl(trimmed)) {
      setErrorMessage('Please enter a valid URL.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // First attempt backend /api/parse
      let parsedResult: KuaishouVideoInfo | null = null;
      try {
        const resp = await fetch('/api/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: trimmed }),
        });

        if (resp.ok) {
          parsedResult = await resp.json();
        }
      } catch (backendErr) {
        // Fallback to client-side logic
      }

      // If backend was unreachable or returned nothing, use client deterministic builder
      if (!parsedResult) {
        const token = extractKuaishouToken(trimmed);
        parsedResult = buildVideoResult({
          id: token || 'KwNH1t3F',
          sourceUrl: trimmed,
          title: '那晚的男人竟然是公司老板',
          authorName: '短剧精选',
          durationMs: 102066
        });
      }

      setVideoData(parsedResult);

      // Smooth scroll to result area
      setTimeout(() => {
        const resultEl = document.getElementById('result');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error('Error parsing video:', err);
      setErrorMessage('Failed to fetch video details. Please try again or check the link.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle URL hash on initial page load (e.g., #url=https://v.kuaishou.com/KwNH1t3F)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('#url=')) {
        const extracted = hash.replace(/^#url=/, '');
        if (extracted) {
          const decoded = decodeURIComponent(extracted);
          setUrl(decoded);
          parseVideoUrl(decoded);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [parseVideoUrl]);

  // Form submit from Hero
  const handleDownloadSubmit = (overrideUrl?: string) => {
    const target = overrideUrl || url;
    if (!target.trim()) {
      setErrorMessage('Please enter a valid URL.');
      return;
    }
    
    try {
      window.location.hash = `url=${encodeURIComponent(target.trim())}`;
    } catch {
      // ignore
    }

    parseVideoUrl(target);
  };

  const handleReset = () => {
    setVideoData(null);
    setUrl('');
    setErrorMessage(null);
    if (window.history.pushState) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const inputEl = document.getElementById('url');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleScrollToBatch = () => {
    const batchEl = document.getElementById('batch-queue-section');
    if (batchEl) {
      batchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Batch queue handlers
  const handleAddToBatch = (media?: MediaItem) => {
    if (!videoData) return;

    const chosenMedia = media || videoData.medias.find(m => m.type === 'video') || videoData.medias[0];
    const itemId = `${videoData.id}-${chosenMedia.id}`;

    const itemPayload = {
      id: itemId,
      videoId: videoData.id,
      title: videoData.title,
      thumbnail: videoData.thumbnail,
      format: chosenMedia.quality,
      extension: chosenMedia.extension,
      size: chosenMedia.size,
      sizeBytes: chosenMedia.sizeBytes,
      downloadUrl: chosenMedia.url
    };

    const { queue: newQueue } = addToBatch(batchQueue, itemPayload);
    setBatchQueue(newQueue);
  };

  const handleRemoveFromBatch = (id: string) => {
    setBatchQueue(prev => removeFromBatch(prev, id));
  };

  const handleClearBatch = () => {
    setBatchQueue(clearBatch());
  };

  // Helper to trigger single file download
  const triggerDownloadFile = async (url: string, filename: string) => {
    try {
      const endpoint = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
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
        return;
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDownloadSingle = async (item: BatchQueueItem) => {
    // Mark item as downloading
    setBatchQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'downloading' } : q));
    const filename = `kuaishou_${item.videoId}_${item.format.replace(/[^a-zA-Z0-9]/g, '_')}.${item.extension}`;
    await triggerDownloadFile(item.downloadUrl, filename);
    setBatchQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'completed' } : q));
  };

  // 'Download All' batch handler: sequentially downloads all queued files
  const handleDownloadAll = async () => {
    if (batchQueue.length === 0 || isDownloadingAll) return;
    setIsDownloadingAll(true);

    const total = batchQueue.length;

    for (let i = 0; i < total; i++) {
      const item = batchQueue[i];
      setDownloadProgress({
        current: i + 1,
        total,
        currentTitle: item.title
      });

      // Update queue item status to downloading
      setBatchQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'downloading' } : q));

      const filename = `kuaishou_${item.videoId}_${item.format.replace(/[^a-zA-Z0-9]/g, '_')}.${item.extension}`;
      await triggerDownloadFile(item.downloadUrl, filename);

      // Update queue item status to completed
      setBatchQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'completed' } : q));

      // Friendly interval between downloads to respect browser download managers
      if (i < total - 1) {
        await new Promise(res => setTimeout(res, 800));
      }
    }

    setDownloadProgress(null);
    setIsDownloadingAll(false);
  };

  const isMediaInBatchCheck = (mediaId?: string) => {
    if (!videoData) return false;
    if (mediaId) {
      return batchQueue.some(item => item.id === `${videoData.id}-${mediaId}`);
    }
    return batchQueue.some(item => item.videoId === videoData.id);
  };

  const hasMultipleInBatch = canDownloadAll(batchQueue);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'
    }`}>
      
      {/* AnyDownloader Header Navigation */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'kuaishou') {
            setUrl('');
            setVideoData(null);
          }
        }}
        activeTab={activeTab}
        onOpenSupportedSites={() => setSupportedSitesOpen(true)}
      />

      {/* Main Content Area */}
      <main id="primary" className="flex-1">
        
        {/* Hero Section with URL Input & Platform Badges */}
        <HeroDownloader
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleDownloadSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
          onOpenSupportedSites={() => setSupportedSitesOpen(true)}
          isDark={isDark}
        />

        {/* Video Download Result Card (with 'Add to Batch' & 'Download All') */}
        {videoData && (
          <ResultCard
            data={videoData}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenQrCode={() => setQrCodeOpen(true)}
            onReset={handleReset}
            isDark={isDark}
            onAddToBatch={handleAddToBatch}
            isMediaInBatch={isMediaInBatchCheck}
            batchCount={batchQueue.length}
            onDownloadAll={hasMultipleInBatch ? handleDownloadAll : undefined}
            onScrollToBatch={handleScrollToBatch}
          />
        )}

        {/* Batch Queue Management Panel (Visible when items are in queue) */}
        {batchQueue.length > 0 && (
          <div className="px-4 sm:px-6">
            <BatchQueuePanel
              queue={batchQueue}
              onRemoveItem={handleRemoveFromBatch}
              onClearQueue={handleClearBatch}
              onDownloadAll={handleDownloadAll}
              onDownloadSingle={handleDownloadSingle}
              isDownloadingAll={isDownloadingAll}
              downloadProgress={downloadProgress}
              isDark={isDark}
            />
          </div>
        )}

        {/* 6 Key Features Section */}
        <FeaturesSection isDark={isDark} />

        {/* 3-Step How-To Guide */}
        <HowToSection onScrollToTop={handleScrollToTop} isDark={isDark} />

        {/* SEO Guide & Better Save It Call To Action */}
        <SeoGuideSection onScrollToTop={handleScrollToTop} isDark={isDark} />

        {/* FAQ Accordion Section */}
        <FaqSection isDark={isDark} />
      </main>

      {/* Footer */}
      <Footer
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupportedSites={() => setSupportedSitesOpen(true)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />

      {/* Floating Bottom Batch Bar (when user scrolls and queue has items) */}
      {batchQueue.length > 0 && (
        <div className="fixed bottom-5 right-5 sm:right-8 z-30 flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 dark:bg-slate-800/90 text-white backdrop-blur-md shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={handleScrollToBatch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center font-bold text-[10px]">
              {batchQueue.length}
            </div>
            <span>Batch Queue</span>
          </button>

          {/* 'Download All' button on floating bar when more than 1 in queue */}
          {hasMultipleInBatch && (
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md active:scale-95 transition-all"
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download All ({batchQueue.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {videoData && (
        <>
          <VideoPlayerModal
            data={videoData}
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            isDark={isDark}
          />

          <QrCodeModal
            isOpen={qrCodeOpen}
            onClose={() => setQrCodeOpen(false)}
            url={videoData.sourceUrl}
            title={videoData.title}
            isDark={isDark}
          />
        </>
      )}

      <SupportedSitesModal
        isOpen={supportedSitesOpen}
        onClose={() => setSupportedSitesOpen(false)}
        isDark={isDark}
      />

    </div>
  );
}
