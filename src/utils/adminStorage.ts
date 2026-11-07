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

// Seed demo orders - تم تصحيح الأكواد لتطابق SHADES الحقيقي
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
      { shadeId: 1, code: '3.0', nameAr: 'بني غامق', nameEn: 'Dark Brown', qty: 2, price: 2.5 },
      { shadeId: 5, code: '7.0', nameAr: 'أشقر', nameEn: 'Blonde', qty: 2, price: 2.5 },
    ],
    subtotal: 10.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 0.0,
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
      { shadeId: 20, code: '8.73', nameAr: 'كراميل', nameEn: 'Caramel', qty: 2, price: 2.5 },
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
      { shadeId: 24, code: '8.45', nameAr: 'نحاسي قرفة', nameEn: 'Cinnamon Copper', qty: 4, price: 2.5 },
    ],
    subtotal: 10.0,
    discountPct: 0,
    discountAmount: 0,
    shippingFee: 0.0,
    grandTotal: 10.0,
    status: 'delivered',
  },
];

// تنظيف وتأمين أي لون جاي من localStorage - هاي بتمنع الشاشة البيضا
function sanitizeShade(s: any, fallback?: Shade): Shade | null {
  if (!s || typeof s !== 'object') return null;
  const base = fallback || SHADES.find((x) => x.id === s.id) || SHADES[0];
  if (!base) return null;
  return {
    id: typeof s.id === 'number' ? s.id : base.id,
    code: typeof s.code === 'string' && s.code ? s.code : base.code,
    nameAr: typeof s.nameAr === 'string' && s.nameAr ? s.nameAr : base.nameAr,
    nameEn: typeof s.nameEn === 'string' && s.nameEn ? s.nameEn : base.nameEn,
    hex: typeof s.hex === 'string' && s.hex ? s.hex : base.hex,
    image: typeof s.image === 'string' ? s.image : base.image,
    categoryId: typeof s.categoryId === 'number' ? s.categoryId : base.categoryId,
    badge: s.badge,
    descAr: typeof s.descAr === 'string' ? s.descAr : base.descAr,
    descEn: typeof s.descEn === 'string' ? s.descEn : base.descEn,
  };
}

export function getStoredShades(): Shade[] {
  try {
    const raw = localStorage.getItem('sci-admin-shades');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed
          .map((s: any) => sanitizeShade(s))
          .filter(Boolean) as Shade[];

        // اذا كل الألوان خربانة، ارجع للأساسي
        if (cleaned.length > 0) {
          // دمج: اذا الأدمن حذف لون بالغلط، لا ترجع لون مكرر
          const seen = new Set<number>();
          const unique = cleaned.filter((s) => {
            if (seen.has(s.id)) return false;
            seen.add(s.id);
            return true;
          });
          return unique;
        }
      }
    }
  } catch {
    // اذا localStorage خربان، امسحه عشان ما يضل يضرب
    try { localStorage.removeItem('sci-admin-shades'); } catch {}
  }
  // نسخة جديدة عشان ما نعدل على الأصلي بالغلط
  return SHADES.map((s) => ({ ...s }));
}

export function saveStoredShades(shades: Shade[]): void {
  try {
    const cleaned = (shades || [])
      .map((s) => sanitizeShade(s))
      .filter(Boolean);
    localStorage.setItem('sci-admin-shades', JSON.stringify(cleaned));
  } catch {}
}

export function getStoredOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem('sci-admin-orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // تأمين الطلبات: اذا طلب ناقص حقول، لا ترجعه
        return parsed.filter((o: any) => o && o.id && Array.isArray(o.items));
      }
    }
  } catch {
    try { localStorage.removeItem('sci-admin-orders'); } catch {}
  }
  return [...SEED_ORDERS];
}

export function saveStoredOrders(orders: AdminOrder[]): void {
  try {
    localStorage.setItem('sci-admin-orders', JSON.stringify(orders || []));
  } catch {}
}

export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem('sci-admin-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          shippingRates: { ...DEFAULT_SETTINGS.shippingRates, ...(parsed.shippingRates || {}) },
          bundleTiers: Array.isArray(parsed.bundleTiers) ? parsed.bundleTiers : DEFAULT_SETTINGS.bundleTiers,
        };
      }
    }
  } catch {
    try { localStorage.removeItem('sci-admin-settings'); } catch {}
  }
  return { ...DEFAULT_SETTINGS, shippingRates: { ...DEFAULT_SETTINGS.shippingRates }, bundleTiers: [...DEFAULT_SETTINGS.bundleTiers] };
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
    id: `ORD-${Date.now().toString().slice(-4)}-${currentOrders.length + 1}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newOrder, ...currentOrders];
  saveStoredOrders(updated);
  return newOrder;
}