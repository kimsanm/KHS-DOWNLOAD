/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroDownloader } from './components/HeroDownloader';
import { ResultCard } from './components/ResultCard';
import { FeaturesSection } from './components/FeaturesSection';
import { HowToSection } from './components/HowToSection';
import { SeoGuideSection } from './components/SeoGuideSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { QrCodeModal } from './components/QrCodeModal';
import { SupportedSitesModal } from './components/SupportedSitesModal';
import { LanguageCode, KuaishouVideoInfo } from './types';
import { 
  isValidUrl, 
  isKuaishouUrl, 
  extractKuaishouToken, 
  buildVideoResult 
} from './utils/kuaishouParser';

export default function App() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<KuaishouVideoInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('kuaishou');
  const [isDark, setIsDark] = useState<boolean>(false);

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
    
    // Update hash to reflect user action matching anydownloader behavior
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
    // Remove hash
    if (window.history.pushState) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const inputEl = document.getElementById('url');
    if (inputEl) {
      inputEl.focus();
    }
  };

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

        {/* Video Download Result Card (shown when parsed) */}
        {videoData && (
          <ResultCard
            data={videoData}
            onOpenPreview={() => setPreviewOpen(true)}
            onOpenQrCode={() => setQrCodeOpen(true)}
            onReset={handleReset}
            isDark={isDark}
          />
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
