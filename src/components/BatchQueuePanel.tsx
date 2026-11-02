import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  X, 
  Film, 
  Sparkles, 
  AlertCircle,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { BatchQueueItem, calculateTotalBatchBytes, canDownloadAll } from '../utils/batchQueue';
import { formatFileSize } from '../utils/kuaishouParser';

interface BatchQueuePanelProps {
  queue: BatchQueueItem[];
  onRemoveItem: (id: string) => void;
  onClearQueue: () => void;
  onDownloadAll: () => Promise<void>;
  onDownloadSingle: (item: BatchQueueItem) => Promise<void>;
  isDownloadingAll: boolean;
  downloadProgress: { current: number; total: number; currentTitle: string } | null;
  isDark: boolean;
}

export const BatchQueuePanel: React.FC<BatchQueuePanelProps> = ({
  queue,
  onRemoveItem,
  onClearQueue,
  onDownloadAll,
  onDownloadSingle,
  isDownloadingAll,
  downloadProgress,
  isDark
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (queue.length === 0) return null;

  const totalBytes = calculateTotalBatchBytes(queue);
  const totalFormatted = formatFileSize(totalBytes);
  const isMultiple = canDownloadAll(queue);

  return (
    <section 
      id="batch-queue-section" 
      className={`my-8 max-w-5xl mx-auto rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900 border-slate-700/80 text-white shadow-black/40' 
          : 'bg-white border-blue-100 text-slate-800 shadow-blue-500/5'
      }`}
      aria-label="Batch Download Queue"
    >
      {/* Top Header Bar */}
      <div className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b ${
        isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Download Batch Queue
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                {queue.length} {queue.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total estimated download size: <strong className="text-slate-700 dark:text-slate-200">{totalFormatted}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2">
          {/* Download All Button (Primary if multiple) */}
          {isMultiple && (
            <button
              onClick={onDownloadAll}
              disabled={isDownloadingAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              aria-label={`Download all ${queue.length} queued videos`}
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading All ({downloadProgress?.current || 1}/{downloadProgress?.total || queue.length})...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download All ({queue.length})</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClearQueue}
            disabled={isDownloadingAll}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Clear entire batch queue"
            aria-label="Clear batch queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? "Collapse queue list" : "Expand queue list"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar (during batch downloading) */}
      {isDownloadingAll && downloadProgress && (
        <div className="bg-blue-600 text-white px-5 py-2.5 text-xs font-medium flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Downloading {downloadProgress.current} of {downloadProgress.total}: <strong>{downloadProgress.currentTitle}</strong></span>
          </div>
          <span>{Math.round((downloadProgress.current / downloadProgress.total) * 100)}%</span>
        </div>
      )}

      {/* Expandable Items List */}
      {isExpanded && (
        <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="space-y-3 pb-2">
            {queue.map((item, idx) => (
              <div 
                key={item.id}
                className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                  item.status === 'completed'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : item.status === 'downloading'
                    ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                    : isDark
                    ? 'bg-slate-800/60 border-slate-700/60'
                    : 'bg-slate-50/70 border-slate-200/70'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-slate-700">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded-sm bg-black/80 text-white font-bold">
                      {item.extension.toUpperCase()}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 uppercase">
                        {item.format}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {item.size}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-1" title={item.title}>
                      {idx + 1}. {item.title}
                    </h4>

                    {/* Status hint */}
                    <div className="mt-1 text-xs">
                      {item.status === 'completed' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Downloaded</span>
                        </span>
                      ) : item.status === 'downloading' ? (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Ready in queue</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Individual Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => onDownloadSingle(item)}
                    disabled={isDownloadingAll}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    disabled={isDownloadingAll}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove from batch"
                    aria-label={`Remove ${item.title} from queue`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar Notice & CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              {!isMultiple ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Queue 1 more video to activate the <strong>Download All</strong> button!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready to download <strong>{queue.length} files</strong> simultaneously.</span>
                </div>
              )}
            </div>

            {/* Bottom Download All button */}
            {isMultiple && (
              <button
                onClick={onDownloadAll}
                disabled={isDownloadingAll}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                {isDownloadingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Batch ({downloadProgress?.current || 1}/{downloadProgress?.total || queue.length})...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download All ({queue.length} Videos)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
