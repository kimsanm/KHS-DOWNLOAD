import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addToBatch,
  removeFromBatch,
  clearBatch,
  calculateTotalBatchBytes,
  isItemInBatch,
  canDownloadAll,
  BatchQueueItem
} from './batchQueue';

const sampleItem1 = {
  id: 'KwNH1t3F-hd',
  videoId: 'KwNH1t3F',
  title: '那晚的男人竟然是公司老板',
  thumbnail: 'https://example.com/cover1.jpg',
  format: '720p HD (No Watermark)',
  extension: 'mp4',
  size: '9.4 MB',
  sizeBytes: 9856614,
  downloadUrl: 'https://example.com/video1.mp4'
};

const sampleItem2 = {
  id: 'KwNH1t3F-audio',
  videoId: 'KwNH1t3F',
  title: '那晚的男人竟然是公司老板 - Audio',
  thumbnail: 'https://example.com/cover1.jpg',
  format: 'Audio 128 kbps',
  extension: 'mp3',
  size: '1.6 MB',
  sizeBytes: 1677721,
  downloadUrl: 'https://example.com/audio1.mp3'
};

const sampleItem3 = {
  id: '3xrdq4y24vncv22-hd',
  videoId: '3xrdq4y24vncv22',
  title: 'Episode 2 Kuaishou Drama',
  thumbnail: 'https://example.com/cover2.jpg',
  format: '720p HD (No Watermark)',
  extension: 'mp4',
  size: '12.0 MB',
  sizeBytes: 12582912,
  downloadUrl: 'https://example.com/video2.mp4'
};

test('addToBatch adds an item and sets default status and timestamp', () => {
  const result = addToBatch([], sampleItem1);
  assert.equal(result.added, true);
  assert.equal(result.queue.length, 1);
  assert.equal(result.queue[0].id, 'KwNH1t3F-hd');
  assert.equal(result.queue[0].status, 'idle');
  assert.ok(result.queue[0].addedAt > 0);
});

test('addToBatch prevents duplicate items with same id', () => {
  const first = addToBatch([], sampleItem1);
  const second = addToBatch(first.queue, sampleItem1);
  assert.equal(second.added, false);
  assert.equal(second.queue.length, 1);
});

test('canDownloadAll returns true only when more than one item is in queue', () => {
  assert.equal(canDownloadAll([]), false);
  
  const oneItem = addToBatch([], sampleItem1).queue;
  assert.equal(canDownloadAll(oneItem), false);

  const twoItems = addToBatch(oneItem, sampleItem2).queue;
  assert.equal(canDownloadAll(twoItems), true);

  const threeItems = addToBatch(twoItems, sampleItem3).queue;
  assert.equal(canDownloadAll(threeItems), true);
});

test('removeFromBatch removes only the targeted item', () => {
  let queue = addToBatch([], sampleItem1).queue;
  queue = addToBatch(queue, sampleItem2).queue;
  assert.equal(queue.length, 2);

  const afterRemove = removeFromBatch(queue, 'KwNH1t3F-hd');
  assert.equal(afterRemove.length, 1);
  assert.equal(afterRemove[0].id, 'KwNH1t3F-audio');
});

test('clearBatch empties the queue', () => {
  let queue = addToBatch([], sampleItem1).queue;
  queue = addToBatch(queue, sampleItem2).queue;
  assert.equal(queue.length, 2);

  const cleared = clearBatch();
  assert.equal(cleared.length, 0);
});

test('calculateTotalBatchBytes sums sizes properly', () => {
  let queue = addToBatch([], sampleItem1).queue;
  queue = addToBatch(queue, sampleItem2).queue;
  const total = calculateTotalBatchBytes(queue);
  assert.equal(total, 9856614 + 1677721);
});

test('isItemInBatch checks existence by videoId and format', () => {
  const queue = addToBatch([], sampleItem1).queue;
  assert.equal(isItemInBatch(queue, 'KwNH1t3F'), true);
  assert.equal(isItemInBatch(queue, 'KwNH1t3F', '720p HD (No Watermark)'), true);
  assert.equal(isItemInBatch(queue, 'KwNH1t3F', 'Audio 128 kbps'), false);
  assert.equal(isItemInBatch(queue, 'other-id'), false);
});
