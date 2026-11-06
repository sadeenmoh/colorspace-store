import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrder,
  getLightness,
  isLightColor,
  filterAndSortShades,
  formatWhatsAppOrderMessage,
  SHADES,
  BASE_PRICE,
  FREE_DELIVERY_THRESHOLD,
} from './storeLogic';

test('Shades data contains exactly 25 shades with unique IDs and codes', () => {
  assert.equal(SHADES.length, 25);
  const ids = new Set(SHADES.map((s) => s.id));
  assert.equal(ids.size, 25);
  assert.equal(SHADES[0].code, '01');
  assert.equal(SHADES[24].code, '25');
});

test('calculateOrder computes subtotal without discount for 1 box', () => {
  const cart = { 0: 1 };
  const calc = calculateOrder(cart, 'عمّان');
  assert.equal(calc.totalItems, 1);
  assert.equal(calc.subtotal, 5.0);
  assert.equal(calc.discountPct, 0);
  assert.equal(calc.discountAmount, 0);
  assert.equal(calc.netSubtotal, 5.0);
  assert.equal(calc.shippingFee, 2.0);
  assert.equal(calc.grandTotal, 7.0);
  assert.equal(calc.isShippingFree, false);
  assert.equal(calc.nextTier?.needed, 1);
  assert.equal(calc.nextTier?.discountPct, 10);
});

test('calculateOrder applies 10% discount for 2 boxes', () => {
  const cart = { 0: 1, 1: 1 };
  const calc = calculateOrder(cart, 'عمّان');
  assert.equal(calc.totalItems, 2);
  assert.equal(calc.subtotal, 10.0);
  assert.equal(calc.discountPct, 10);
  assert.equal(calc.discountAmount, 1.0);
  assert.equal(calc.netSubtotal, 9.0);
  assert.equal(calc.shippingFee, 2.0);
  assert.equal(calc.grandTotal, 11.0);
});

test('calculateOrder applies 15% discount for 3 boxes', () => {
  const cart = { 0: 3 };
  const calc = calculateOrder(cart, 'الزرقاء');
  assert.equal(calc.totalItems, 3);
  assert.equal(calc.subtotal, 15.0);
  assert.equal(calc.discountPct, 15);
  assert.equal(calc.discountAmount, 2.25);
  assert.equal(calc.netSubtotal, 12.75);
  assert.equal(calc.shippingFee, 3.0);
  assert.equal(calc.grandTotal, 15.75);
});

test('calculateOrder applies 20% discount and free shipping when net subtotal >= 25', () => {
  // 7 boxes = 35.00 JOD subtotal - 20% (7.00) = 28.00 JOD net subtotal >= 25 JOD free threshold
  const cart = { 0: 7 };
  const calc = calculateOrder(cart, 'إربد');
  assert.equal(calc.totalItems, 7);
  assert.equal(calc.subtotal, 35.0);
  assert.equal(calc.discountPct, 20);
  assert.equal(calc.discountAmount, 7.0);
  assert.equal(calc.netSubtotal, 28.0);
  assert.equal(calc.isShippingFree, true);
  assert.equal(calc.shippingFee, 0.0);
  assert.equal(calc.grandTotal, 28.0);
});

test('getLightness and isLightColor detect contrasting tones correctly', () => {
  // #14100F is near black
  assert.equal(isLightColor('#14100F'), false);
  // #E8E0CC is platinum blonde (light)
  assert.equal(isLightColor('#E8E0CC'), true);
  // #FFFFFF should be ~255
  assert.ok(getLightness('#FFFFFF') > 250);
});

test('filterAndSortShades filters by Arabic query, digit query, and category', () => {
  // Category 2 is Blonde
  const blondeShades = filterAndSortShades(SHADES, '', 2, 'default');
  assert.ok(blondeShades.length > 0);
  blondeShades.forEach((s) => assert.equal(s.categoryId, 2));

  // Search by code "04"
  const shade4 = filterAndSortShades(SHADES, '04', -1, 'default');
  assert.equal(shade4.length, 1);
  assert.equal(shade4[0].nameAr, 'بني غامق');

  // Search by Eastern Arabic numerals "٠٤"
  const shade4Ar = filterAndSortShades(SHADES, '٠٤', -1, 'default');
  assert.equal(shade4Ar.length, 1);
  assert.equal(shade4Ar[0].nameAr, 'بني غامق');
});

test('formatWhatsAppOrderMessage contains correct formatted lines', () => {
  const cart = { 3: 2 };
  const calc = calculateOrder(cart, 'عمّان');
  const message = formatWhatsAppOrderMessage(
    cart,
    {
      name: 'سارة خالد',
      phone: '0791234567',
      city: 'عمّان',
      address: 'دابوق، شارع الملك عبد الله',
      notes: 'يرجى التوصيل بعد العصر',
    },
    calc,
    'ar'
  );

  assert.ok(message.includes('سارة خالد'));
  assert.ok(message.includes('بني غامق'));
  assert.ok(message.includes('خصم الباقة (10%)'));
  assert.ok(message.includes('دابوق'));
});
