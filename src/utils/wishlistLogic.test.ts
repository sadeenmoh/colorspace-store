import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleWishlistItem, formatWishlistWhatsAppMessage } from './wishlistLogic';
import { SHADES } from './storeLogic';

test('toggleWishlistItem adds and removes shades from wishlist', () => {
  let wishlist: Record<number, boolean> = {};
  wishlist = toggleWishlistItem(wishlist, 3);
  assert.equal(wishlist[3], true);

  wishlist = toggleWishlistItem(wishlist, 12);
  assert.equal(wishlist[12], true);
  assert.equal(Object.keys(wishlist).length, 2);

  // Toggle shade 3 off
  wishlist = toggleWishlistItem(wishlist, 3);
  assert.equal(wishlist[3], undefined);
  assert.equal(Object.keys(wishlist).length, 1);
});

test('formatWishlistWhatsAppMessage generates readable list of shades', () => {
  const messageAr = formatWishlistWhatsAppMessage([3, 12], SHADES, 'ar');
  assert.ok(messageAr.includes('قائمة أمنياتي'));
  assert.ok(messageAr.includes('الدرجة 04'));
  assert.ok(messageAr.includes('الدرجة 13'));

  const messageEn = formatWishlistWhatsAppMessage([3], SHADES, 'en');
  assert.ok(messageEn.includes('My Wishlist'));
  assert.ok(messageEn.includes('Shade 04'));
});
