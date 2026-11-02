export interface BatchQueueItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  format: string;
  extension: string;
  size: string;
  sizeBytes: number;
  downloadUrl: string;
  addedAt: number;
  status: 'idle' | 'downloading' | 'completed' | 'failed';
}

/**
 * Adds an item to the batch queue if not already present (deduplication check by id)
 */
export function addToBatch(
  queue: BatchQueueItem[],
  item: Omit<BatchQueueItem, 'status' | 'addedAt'>
): { queue: BatchQueueItem[]; added: boolean } {
  const exists = queue.some(q => q.id === item.id);
  if (exists) {
    return { queue, added: false };
  }

  const newItem: BatchQueueItem = {
    ...item,
    status: 'idle',
    addedAt: Date.now()
  };

  return {
    queue: [...queue, newItem],
    added: true
  };
}

/**
 * Removes an item from the batch queue by its unique id
 */
export function removeFromBatch(queue: BatchQueueItem[], id: string): BatchQueueItem[] {
  return queue.filter(item => item.id !== id);
}

/**
 * Clears the batch queue
 */
export function clearBatch(): BatchQueueItem[] {
  return [];
}

/**
 * Computes total size in bytes of all items in the queue
 */
export function calculateTotalBatchBytes(queue: BatchQueueItem[]): number {
  return queue.reduce((acc, item) => acc + (item.sizeBytes || 0), 0);
}

/**
 * Checks whether an item is already queued
 */
export function isItemInBatch(queue: BatchQueueItem[], videoId: string, format?: string): boolean {
  if (format) {
    return queue.some(item => item.videoId === videoId && item.format === format);
  }
  return queue.some(item => item.videoId === videoId);
}

/**
 * Determines if 'Download All' should be active (more than one link in queue)
 */
export function canDownloadAll(queue: BatchQueueItem[]): boolean {
  return queue.length > 1;
}
