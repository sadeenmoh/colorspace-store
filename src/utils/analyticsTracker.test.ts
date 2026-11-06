import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTrafficSource } from './analyticsTracker';

test('parseTrafficSource identifies Instagram UTM campaign', () => {
  const params = new URLSearchParams('utm_source=instagram&utm_medium=cpc&utm_campaign=hair_dye_fall');
  const res = parseTrafficSource('', params);
  assert.equal(res.source, 'instagram');
  assert.equal(res.medium, 'cpc');
  assert.equal(res.campaign, 'hair_dye_fall');
});

test('parseTrafficSource identifies Facebook referrer', () => {
  const params = new URLSearchParams('');
  const res = parseTrafficSource('https://m.facebook.com/', params);
  assert.equal(res.source, 'facebook');
  assert.equal(res.sourceName, 'Facebook');
});

test('parseTrafficSource identifies TikTok referrer and UTM', () => {
  const params = new URLSearchParams('utm_source=tiktok&utm_medium=video');
  const res = parseTrafficSource('https://www.tiktok.com/', params);
  assert.equal(res.source, 'tiktok');
  assert.equal(res.medium, 'video');
});

test('parseTrafficSource identifies Google search', () => {
  const params = new URLSearchParams('');
  const res = parseTrafficSource('https://www.google.com/search?q=sci+hair+dye', params);
  assert.equal(res.source, 'google');
});

test('parseTrafficSource identifies WhatsApp link', () => {
  const params = new URLSearchParams('utm_source=whatsapp');
  const res = parseTrafficSource('', params);
  assert.equal(res.source, 'whatsapp');
});

test('parseTrafficSource identifies Direct visits when referrer is empty', () => {
  const params = new URLSearchParams('');
  const res = parseTrafficSource('', params);
  assert.equal(res.source, 'direct');
});
