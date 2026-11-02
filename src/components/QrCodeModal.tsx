import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  isDark: boolean;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  isDark
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : url;

  // Google Chart API QR Code or reliable SVG QR Code
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border p-6 text-center ${
          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-left">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h3 id="qr-title" className="text-base font-bold">
              Scan to Download on Phone
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Scan this QR code with your iPhone Camera or Android QR scanner to immediately download the video on mobile.
        </p>

        {/* QR Code Container */}
        <div className="mx-auto w-56 h-56 p-3 bg-white rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center">
          <img 
            src={qrImageUrl} 
            alt="Scan QR code" 
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Link Copy Box */}
        <div className="mt-5 flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <input 
            type="text" 
            readOnly 
            value={currentUrl} 
            className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] truncate text-slate-600 dark:text-slate-300"
          />
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
