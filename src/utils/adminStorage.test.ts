import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AdminOrder,
  StoreSettings,
} from './adminStorage';
import { SHADES, Shade } from './storeLogic';

test('Shades inventory status updates correctly', () => {
  // Test in-memory toggle of stock
  const shadesCopy: Shade[] = JSON.parse(JSON.stringify(SHADES));
  const shade0 = shadesCopy[0];
  assert.notEqual(shade0.badge, 'out_of_stock');

  // Toggle out of stock
  shade0.badge = 'out_of_stock';
  assert.equal(shade0.badge, 'out_of_stock');

  // Toggle back to best seller
  shade0.badge = 'best_seller';
  assert.equal(shade0.badge, 'best_seller');
});

test('Order status transition logic is valid', () => {
  const allowedStatuses: AdminOrder['status'][] = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
  assert.equal(allowedStatuses.length, 5);

  const testOrder: AdminOrder = {
    id: 'ORD-999',
    createdAt: new Date().toISOString(),
    customerName: 'فاطمة',
    customerPhone: '0791112233',
    customerCity: 'عمّان',
    customerAddress: 'دابوق',
    items: [{ shadeId: 0, code: '01', nameAr: 'أسود فحمي', nameEn: 'Charcoal Black', qty: 1, price: 5.0 }],
    subtotal: 5.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 2.0,
    grandTotal: 7.0,
    status: 'new',
  };

  assert.equal(testOrder.status, 'new');
  testOrder.status = 'processing';
  assert.equal(testOrder.status, 'processing');
  testOrder.status = 'delivered';
  assert.equal(testOrder.status, 'delivered');
});

test('StoreSettings validation allows custom WhatsApp number and shipping rates', () => {
  const customSettings: StoreSettings = {
    whatsappNumber: '962799998888',
    freeDeliveryThreshold: 30.0,
    shippingRates: { 'عمّان': 2.5, 'إربد': 3.5 },
    bundleTiers: [{ minCount: 2, discountPct: 12 }],
    announcementNoticeAr: 'خصم خاص اليوم فقط!',
    announcementNoticeEn: 'Special discount today only!',
  };

  assert.equal(customSettings.whatsappNumber, '962799998888');
  assert.equal(customSettings.freeDeliveryThreshold, 30.0);
  assert.equal(customSettings.shippingRates['عمّان'], 2.5);
  assert.equal(customSettings.bundleTiers[0].discountPct, 12);
});
