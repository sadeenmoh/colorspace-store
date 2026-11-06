import { Shade, SHADES, BUNDLE_TIERS, SHIPPING_RATES, FREE_DELIVERY_THRESHOLD, WHATSAPP_NUMBER } from './storeLogic';

export interface AdminOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  customerNotes?: string;
  items: Array<{ shadeId: number; code: string; nameAr: string; nameEn: string; qty: number; price: number }>;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface StoreSettings {
  whatsappNumber: string;
  freeDeliveryThreshold: number;
  shippingRates: Record<string, number>;
  bundleTiers: Array<{ minCount: number; discountPct: number }>;
  announcementNoticeAr: string;
  announcementNoticeEn: string;
  metaPixelId?: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: WHATSAPP_NUMBER,
  freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  shippingRates: { ...SHIPPING_RATES },
  bundleTiers: [...BUNDLE_TIERS],
  announcementNoticeAr: 'عرض خاص: صبغة تركية بـ ٢.٥ دينار · اشتري ٤ حبات واحصلي على توصيل مجاني لكافة المحافظات!',
  announcementNoticeEn: 'Special Offer: 2.5 JOD per box · Buy 4 boxes and get FREE delivery across Jordan!',
  metaPixelId: '',
};

// Seed demo orders for realistic admin view
const SEED_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-1082',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customerName: 'سارة العبداللات',
    customerPhone: '0798765432',
    customerCity: 'عمّان',
    customerAddress: 'دابوق، شارع الملك عبد الله الثاني، عمارة 12',
    customerNotes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
    items: [
      { shadeId: 3, code: '04', nameAr: 'بني غامق', nameEn: 'Dark Brown', qty: 2, price: 2.5 },
      { shadeId: 12, code: '13', nameAr: 'أشقر', nameEn: 'Blonde', qty: 2, price: 2.5 },
    ],
    subtotal: 10.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 0.0, // Free delivery on 4 items
    grandTotal: 10.0,
    status: 'new',
  },
  {
    id: 'ORD-1081',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    customerName: 'ديما الشريف',
    customerPhone: '0781234567',
    customerCity: 'إربد',
    customerAddress: 'شارع الجامعة، مجمع الأمل',
    customerNotes: '',
    items: [
      { shadeId: 9, code: '10', nameAr: 'كراميل', nameEn: 'Caramel', qty: 2, price: 2.5 },
    ],
    subtotal: 5.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 2.0,
    grandTotal: 7.0,
    status: 'processing',
  },
  {
    id: 'ORD-1080',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    customerName: 'لجين حداد',
    customerPhone: '0779988776',
    customerCity: 'الزرقاء',
    customerAddress: 'الزرقاء الجديدة، شارع 36',
    customerNotes: 'تغليف مميز لو سمحتم',
    items: [
      { shadeId: 18, code: '19', nameAr: 'نحاسي', nameEn: 'Copper', qty: 4, price: 2.5 },
    ],
    subtotal: 10.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 0.0, // Free delivery on 4 items
    grandTotal: 10.0,
    status: 'delivered',
  },
];

export function getStoredShades(): Shade[] {
  try {
    const raw = localStorage.getItem('sci-admin-shades');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === SHADES.length) {
        return parsed;
      }
    }
  } catch {}
  return SHADES;
}

export function saveStoredShades(shades: Shade[]): void {
  try {
    localStorage.setItem('sci-admin-shades', JSON.stringify(shades));
  } catch {}
}

export function getStoredOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem('sci-admin-orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return SEED_ORDERS;
}

export function saveStoredOrders(orders: AdminOrder[]): void {
  try {
    localStorage.setItem('sci-admin-orders', JSON.stringify(orders));
  } catch {}
}

export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem('sci-admin-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.whatsappNumber) return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem('sci-admin-settings', JSON.stringify(settings));
  } catch {}
}

export function addOrderToLog(order: Omit<AdminOrder, 'id' | 'createdAt' | 'status'>): AdminOrder {
  const currentOrders = getStoredOrders();
  const newOrder: AdminOrder = {
    ...order,
    id: `ORD-${1080 + currentOrders.length + 1}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newOrder, ...currentOrders];
  saveStoredOrders(updated);
  return newOrder;
}
