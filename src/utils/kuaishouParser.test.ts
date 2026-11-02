import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isKuaishouUrl,
  isValidUrl,
  formatDuration,
  formatFileSize,
  extractKuaishouToken,
  buildVideoResult
} from './kuaishouParser';

test('isKuaishouUrl detects valid Kuaishou domains correctly', () => {
  assert.equal(isKuaishouUrl('https://v.kuaishou.com/KwNH1t3F'), true);
  assert.equal(isKuaishouUrl('https://www.kuaishou.com/short-video/3xrdq4y24vncv22'), true);
  assert.equal(isKuaishouUrl('https://v.m.chenzhongtech.com/fw/photo/3xrdq4y24vncv22'), true);
  assert.equal(isKuaishouUrl('https://kwai.com/@user/video/12345'), true);
  assert.equal(isKuaishouUrl('https://youtube.com/watch?v=123'), false);
  assert.equal(isKuaishouUrl('invalid-url-string'), false);
  assert.equal(isKuaishouUrl(''), false);
});

test('isValidUrl detects valid and invalid web URLs', () => {
  assert.equal(isValidUrl('https://v.kuaishou.com/KwNH1t3F'), true);
  assert.equal(isValidUrl('http://example.com'), true);
  assert.equal(isValidUrl('not-a-url'), false);
});

test('formatDuration converts seconds and milliseconds to MM:SS', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(102066), '01:42'); // milliseconds test
  assert.equal(formatDuration('90'), '01:30');
  assert.equal(formatDuration(undefined), '00:00');
});

test('formatFileSize formats byte values to human readable strings', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(1024), '1.0 KB');
  assert.equal(formatFileSize(10485760), '10.0 MB');
  assert.equal(formatFileSize(0), 'Unknown');
});

test('extractKuaishouToken extracts short code or photoId', () => {
  assert.equal(extractKuaishouToken('https://v.kuaishou.com/KwNH1t3F'), 'KwNH1t3F');
  assert.equal(extractKuaishouToken('https://v.m.chenzhongtech.com/fw/photo/3xrdq4y24vncv22?cc=1'), '3xrdq4y24vncv22');
  assert.equal(extractKuaishouToken('https://kuaishou.com/short-video/3xrdq4y24vncv22'), '3xrdq4y24vncv22');
  assert.equal(extractKuaishouToken('https://google.com'), null);
});

test('buildVideoResult constructs complete media information with formats', () => {
  const result = buildVideoResult({
    id: 'KwNH1t3F',
    sourceUrl: 'https://v.kuaishou.com/KwNH1t3F',
    title: '那晚的男人竟然是公司老板',
    authorName: '短剧精选',
    durationMs: 102066
  });

  assert.equal(result.id, 'KwNH1t3F');
  assert.equal(result.title, '那晚的男人竟然是公司老板');
  assert.equal(result.author.name, '短剧精选');
  assert.equal(result.duration, '01:42');
  assert.equal(result.medias.length, 4);
  assert.equal(result.medias[0].quality, '720p HD (No Watermark)');
  assert.equal(result.medias[0].extension, 'mp4');
});
