export interface Shade {
  id: number;
  code: string; // e.g. "1.0"
  nameAr: string;
  nameEn: string;
  hex: string;
  image?: string;
  categoryId: number;
  badge?: 'out_of_stock' | 'best_seller' | 'new';
  descAr?: string;
  descEn?: string;
}

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
}

export const CATEGORIES: Category[] = [
  { id: 0, nameAr: 'الأسود والبني الغامق', nameEn: 'Black & Dark Brown' },
  { id: 1, nameAr: 'البني', nameEn: 'Brown' },
  { id: 2, nameAr: 'الأشقر', nameEn: 'Blonde Tones' },
  { id: 3, nameAr: 'النحاسي والأحمر', nameEn: 'Copper & Red' },
];

export const SHADES: Shade[] = [
  { id: 0, code: '1.0', nameAr: 'أسود', nameEn: 'Black', hex: '#121010', image: '/assets/aistudio/SPACE_12_1.0.png', categoryId: 0, badge: 'best_seller', descAr: 'أسود عميق وكثيف بلمعان كلاسيكي فاخر وتغطية كاملة.', descEn: 'Deep intense black with classic shine and full coverage.' },
  { id: 1, code: '1.1', nameAr: 'أسود مزرق', nameEn: 'Blue Black', hex: '#10141F', image: '/assets/aistudio/SPACE_15_1.1.png', categoryId: 0, descAr: 'أسود بلمسة زرقاء باردة يعطي عمق ولمعان مميز تحت الضوء.', descEn: 'Blue-black with a cool reflective shine and mysterious depth.' },
  { id: 2, code: '3.0', nameAr: 'بني غامق', nameEn: 'Dark Brown', hex: '#1E120C', image: '/assets/aistudio/SPACE_09_3.0.png', categoryId: 0, descAr: 'بني غامق غني وطبيعي، الأكثر طلباً للإطلالة اليومية الأنيقة.', descEn: 'Rich dark brown, natural and elegant for everyday wear.' },
  { id: 3, code: '4.0', nameAr: 'بني', nameEn: 'Brown', hex: '#2B1A12', image: '/assets/aistudio/SPACE_07_4.0.png', categoryId: 0, badge: 'best_seller', descAr: 'الدرجة الأيقونية بلونها الدافئ ولمعان زيت الأرجان.', descEn: 'Iconic warm brown with argan-infused brilliance.' },
  { id: 4, code: '5.0', nameAr: 'بني فاتح', nameEn: 'Light Brown', hex: '#3D2A1A', image: '/assets/aistudio/SPACE_16_5.0.png', categoryId: 0, descAr: 'بني فاتح ناعم ومشرق يمنح مظهراً حيوياً ومفعماً بالشباب.', descEn: 'Soft light brown adding vitality and youthful glow.' },
  { id: 5, code: '6.7', nameAr: 'بني شوكولاتة', nameEn: 'Chocolate Coffee', hex: '#221416', image: '/assets/aistudio/SPACE_23_6.7.png', categoryId: 0, descAr: 'بني شوكولاتة داكن وفاخر بلمسة قهوة غنية وبريق جذاب.', descEn: 'Dark chocolate coffee with rich depth and glossy finish.' },
  { id: 6, code: '7.7', nameAr: 'بني لامع', nameEn: 'Shining Coffee', hex: '#2E1A12', image: '/assets/aistudio/SPACE_01_7.7.png', categoryId: 0, badge: 'new', descAr: 'بني قهوة لامع يمنح الشعر بريقاً صحياً وإشراقة واضحة.', descEn: 'Shining coffee brown for healthy glossy hair.' },
  { id: 7, code: '7.33', nameAr: 'قشرة البندق', nameEn: 'Nutshell', hex: '#3A2818', image: '/assets/aistudio/SPACE_02_7.3.png', categoryId: 0, descAr: 'لون قشرة البندق الدافئ، مزيج طبيعي بين البني والذهبي.', descEn: 'Warm nutshell tone blending brown and golden hues.' },
  { id: 8, code: '7.66', nameAr: 'أحمر باذنجاني', nameEn: 'Aubergine Red', hex: '#2A1218', image: '/assets/aistudio/SPACE_22_3.66.png', categoryId: 3, badge: 'new', descAr: 'أحمر باذنجاني جريء بلمسة بنفسجية راقية وحضور استثنائي.', descEn: 'Bold aubergine red with elegant violet undertones.' },
  { id: 9, code: '5.65', nameAr: 'أحمر فراولة', nameEn: 'Strawberry Red', hex: '#6E1A22', image: '/assets/aistudio/SPACE_10_5.65.png', categoryId: 3, descAr: 'أحمر فراولة نابض بالحيوية يعكس قوة الشخصية وحب التميز.', descEn: 'Vibrant strawberry red full of energy and personality.' },
  { id: 10, code: '8.73', nameAr: 'كراميل', nameEn: 'Caramel', hex: '#8A5A33', image: '/assets/aistudio/SPACE_05_8.73.png', categoryId: 1, badge: 'best_seller', descAr: 'درجة الكراميل الغنية بحلاوتها ولمعانها الذهبي الخفيف.', descEn: 'Irresistible creamy caramel with warm golden facets.' },
  { id: 11, code: '8.3', nameAr: 'رغوة العسل', nameEn: 'Honey Foam', hex: '#7A5A33', image: '/assets/aistudio/SPACE_13_8.3.png', categoryId: 1, descAr: 'لون رغوة العسل الدافئ، إشراقة ذهبية ناعمة وطبيعية.', descEn: 'Warm honey foam with soft golden radiance.' },
  { id: 12, code: '8.45', nameAr: 'نحاسي قرفة', nameEn: 'Cinnamon Copper', hex: '#6E3526', image: '/assets/aistudio/SPACE_04_8.45.png', categoryId: 3, descAr: 'نحاسي قرفة دافئ يمزج بين دفء النحاس وبريق القرفة.', descEn: 'Warm cinnamon copper blending copper fire and spice.' },
  { id: 13, code: '8.37', nameAr: 'ساهارا', nameEn: 'Sahara', hex: '#6E4A2A', image: '/assets/aistudio/SPACE_11_8.37.png', categoryId: 1, descAr: 'لون صحراء دافئ مستوحى من رمال الصحراء الذهبية.', descEn: 'Warm sahara tone inspired by golden desert sands.' },
  { id: 14, code: '6.0', nameAr: 'أشقر غامق', nameEn: 'Dark Blonde', hex: '#4A3220', image: '/assets/aistudio/SPACE_25_6.0.png', categoryId: 2, descAr: 'درجة شقراء دافئة وراقية تشكل جسراً مثالياً بين البني والأشقر.', descEn: 'Sophisticated dark blonde bridging brown and blonde.' },
  { id: 15, code: '7.0', nameAr: 'أشقر', nameEn: 'Blonde', hex: '#5A4030', image: '/assets/aistudio/SPACE_17_7.0.png', categoryId: 2, badge: 'best_seller', descAr: 'أشقر نقي وكلاسيكي من أكثر الدرجات المفضلة لدى صالونات التجميل.', descEn: 'Pure radiant blonde, a timeless salon-favorite.' },
  { id: 16, code: '8.0', nameAr: 'أشقر فاتح', nameEn: 'Light Blonde', hex: '#6B4F35', image: '/assets/aistudio/SPACE_24_8.0.png', categoryId: 2, descAr: 'أشقر فاتح مفعم بالنعومة والرقة مع تغطية متكاملة.', descEn: 'Delicate light blonde with airy lightness.' },
  { id: 17, code: '10.0', nameAr: 'أشقر فاتح جداً', nameEn: 'Lightest Blonde', hex: '#C9B18A', image: '/assets/aistudio/SPACE_19_10.0.png', categoryId: 2, descAr: 'أشقر فاتح جداً بإشراقة شمسية لإطلالة مشرقة وجريئة.', descEn: 'Lightest blonde with sun-drenched luminosity.' },
  { id: 18, code: '0.1', nameAr: 'أشقر بلاتيني', nameEn: 'Platinum Blonde', hex: '#8A7A68', image: '/assets/aistudio/SPACE_08_0.1.png', categoryId: 2, descAr: 'أشقر بلاتيني بارد وأنيق يحيّد درجات النحاس غير المرغوبة.', descEn: 'Chic platinum blonde neutralizing brassiness.' },
  { id: 19, code: '0.2', nameAr: 'أشقر بيبي', nameEn: 'Baby Blonde', hex: '#D9C98A', image: '/assets/aistudio/SPACE_14_0.2.png', categoryId: 2, badge: 'new', descAr: 'أشقر بيبي ناعم وفاتح كشعر الأطفال بلمسة طبيعية مشرقة.', descEn: 'Soft baby blonde with natural bright glow.' },
  { id: 20, code: '0.02', nameAr: 'أبيض فضي', nameEn: 'Silver White', hex: '#2A2A2E', image: '/assets/aistudio/SPACE_18_0.02.png', categoryId: 2, descAr: 'أبيض فضي عصري بلمعان معدني فريد لإطلالة جريئة.', descEn: 'Modern silver white with unique metallic gleam.' },
  { id: 21, code: '7.1', nameAr: 'أشقر رمادي', nameEn: 'Medium Ash Blonde', hex: '#4F4438', image: '/assets/aistudio/SPACE_06_7.1.png', categoryId: 2, descAr: 'أشقر رمادي بارد وأنيق يحيّد درجات النحاس غير المرغوبة.', descEn: 'Cool medium ash blonde neutralizing unwanted warmth.' },
  { id: 22, code: '8.1', nameAr: 'أشقر فاتح رمادي', nameEn: 'Light Ash Blonde', hex: '#5C5040', image: '/assets/aistudio/SPACE_21_8.1.png', categoryId: 2, descAr: 'أشقر فاتح رمادي بلمسة باردة عصرية وناعمة.', descEn: 'Light ash blonde with cool modern softness.' },
  { id: 23, code: '7.11', nameAr: 'أشقر رمادي مكثف', nameEn: 'Intense Ash Blonde', hex: '#38322E', image: '/assets/aistudio/SPACE_03_7.11.png', categoryId: 2, badge: 'best_seller', descAr: 'أشقر رمادي مكثف يمنح تغطية قوية ولمسة رمادية واضحة.', descEn: 'Intense ash blonde for strong coverage and cool tone.' },
  { id: 24, code: '8.11', nameAr: 'أشقر فاتح رمادي مكثف', nameEn: 'Intense Ash Light Blonde', hex: '#2F2A26', image: '/assets/aistudio/SPACE_20_8.11.png', categoryId: 2, badge: 'out_of_stock', descAr: 'أشقر فاتح رمادي مكثف بتركيز عالي لإطلالة رمادية نقية.', descEn: 'Intense ash light blonde for pure cool perfection.' },
];

export const BASE_PRICE = 2.5;
export const FREE_DELIVERY_THRESHOLD = 10.0;
export const WHATSAPP_NUMBER = '962787201818';

export const BUNDLE_TIERS = [
  { minCount: 4, discountPct: 0 },
  { minCount: 6, discountPct: 10 },
  { minCount: 10, discountPct: 15 },
];

export const SHIPPING_RATES: Record<string, number> = {
  'عمّان': 2.0,
  'الزرقاء': 2.0,
  'إربد': 2.0,
  'باقي المحافظات': 2.0,
};

export const SHIPPING_RATES_EN: Record<string, string> = {
  'عمّان': 'Amman',
  'الزرقاء': 'Zarqa',
  'إربد': 'Irbid',
  'باقي المحافظات': 'Other Governorates',
};

export function getLightness(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return r * 0.299 + g * 0.587 + b * 0.114;
}

export function isLightColor(hex: string): boolean {
  return getLightness(hex) > 140;
}

export interface OrderCalculation {
  totalItems: number;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  netSubtotal: number;
  city: string;
  shippingFee: number;
  isShippingFree: boolean;
  grandTotal: number;
  nextTier?: { minCount: number; discountPct: number; needed: number };
  amountUntilFreeShipping: number;
}

export function calculateOrder(cart: Record<number, number>, city: string = ''): OrderCalculation {
  let totalItems = 0;
  let subtotal = 0;
  for (const [idStr, qty] of Object.entries(cart)) {
    const q = Number(qty) || 0;
    if (q > 0) { totalItems += q; subtotal += q * BASE_PRICE; }
  }
  let discountPct = 0;
  for (const tier of BUNDLE_TIERS) { if (totalItems >= tier.minCount) discountPct = tier.discountPct; }
  const discountAmount = (subtotal * discountPct) / 100;
  const netSubtotal = subtotal - discountAmount;
  const nextTierObj = BUNDLE_TIERS.find((t) => t.minCount > totalItems);
  const nextTier = nextTierObj ? { minCount: nextTierObj.minCount, discountPct: nextTierObj.discountPct, needed: nextTierObj.minCount - totalItems } : undefined;
  const isShippingFree = totalItems >= 4 || netSubtotal >= FREE_DELIVERY_THRESHOLD;
  const baseRate = city && SHIPPING_RATES[city] !== undefined ? SHIPPING_RATES[city] : 0;
  const shippingFee = city ? (isShippingFree ? 0 : baseRate) : 0;
  const grandTotal = netSubtotal + shippingFee;
  const amountUntilFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - netSubtotal);
  return { totalItems, subtotal, discountPct, discountAmount, netSubtotal, city, shippingFee, isShippingFree, grandTotal, nextTier, amountUntilFreeShipping };
}

export interface CustomerDetails { name: string; phone: string; city: string; address: string; notes?: string; }

export function formatWhatsAppOrderMessage(cart: Record<number, number>, customer: CustomerDetails, calc: OrderCalculation, lang: 'ar' | 'en' = 'ar'): string {
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';
  const title = isEn ? '✨ New Order from Space Color Infinity ✨' : '✨ طلب جديد من متجر Space Color Infinity ✨';
  const itemsLines: string[] = [];
  for (const [idStr, qty] of Object.entries(cart)) {
    const shadeId = Number(idStr);
    const shade = SHADES[shadeId];
    if (shade && qty > 0) {
      const name = isEn ? shade.nameEn : shade.nameAr;
      const shadeLabel = isEn ? `Shade ${shade.code}` : `الدرجة ${shade.code}`;
      itemsLines.push(`• ${shadeLabel} (${name}) × ${qty}`);
    }
  }
  const bundleDiscountLine = calc.discountPct > 0 ? (isEn ? `🎁 Bundle discount (${calc.discountPct}%): -${calc.discountAmount.toFixed(2)} ${currency}` : `🎁 خصم الباقة (${calc.discountPct}%): -${calc.discountAmount.toFixed(2)} ${currency}`) : '';
  const cityName = isEn ? (SHIPPING_RATES_EN[customer.city] || customer.city) : customer.city;
  const shippingLine = calc.shippingFee === 0 && customer.city ? (isEn ? `🚚 Delivery (${cityName}): Free` : `🚚 التوصيل (${cityName}): مجاني`) : (isEn ? `🚚 Delivery (${cityName}): ${calc.shippingFee.toFixed(2)} ${currency}` : `🚚 التوصيل (${cityName}): ${calc.shippingFee.toFixed(2)} ${currency}`);
  const totalLine = isEn ? `💰 Grand Total: ${calc.grandTotal.toFixed(2)} ${currency}` : `💰 المجموع الكلي: ${calc.grandTotal.toFixed(2)} ${currency}`;
  const customerHeader = isEn ? '👤 Customer Details:' : '👤 بيانات العميل:';
  const nameLine = isEn ? `• Name: ${customer.name}` : `• الاسم: ${customer.name}`;
  const phoneLine = isEn ? `• Phone: ${customer.phone}` : `• الهاتف: ${customer.phone}`;
  const addressLine = isEn ? `• Address: ${customer.address}` : `• العنوان: ${customer.address}`;
  const notesLine = customer.notes?.trim() ? (isEn ? `• Notes: ${customer.notes.trim()}` : `• ملاحظات: ${customer.notes.trim()}`) : '';
  const parts = [title, '', isEn ? '🛍 Order Items:' : '🛍 الدرجات المطلوبة:', ...itemsLines, '', bundleDiscountLine, shippingLine, totalLine, '', customerHeader, nameLine, phoneLine, addressLine, notesLine].filter((p) => p !== '');
  return parts.join('\n');
}

export function normalizeSearchTerm(term: string): string {
  const easternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let normalized = term.trim();
  easternDigits.forEach((char, index) => { normalized = normalized.split(char).join(String(index)); });
  return normalized.toLowerCase();
}

export function filterAndSortShades(shades: Shade[], searchQuery: string, categoryFilter: number | 'favorites', sortBy: 'default' | 'light_to_dark' | 'dark_to_light' | 'name', favorites: Record<number, boolean> = {}, lang: 'ar' | 'en' = 'ar'): Shade[] {
  const normQuery = normalizeSearchTerm(searchQuery);
  let filtered = shades.filter((s) => {
    if (categoryFilter === 'favorites') { if (!favorites[s.id]) return false; }
    else if (categoryFilter >= 0) { if (s.categoryId !== categoryFilter) return false; }
    if (normQuery) {
      const matchNameAr = s.nameAr.toLowerCase().includes(normQuery);
      const matchNameEn = s.nameEn.toLowerCase().includes(normQuery);
      const matchCode = s.code === normQuery || s.code === normQuery.padStart(2, '0') || String(s.id + 1) === normQuery;
      if (!matchNameAr && !matchNameEn && !matchCode) return false;
    }
    return true;
  });
  if (sortBy === 'light_to_dark') filtered = [...filtered].sort((a, b) => getLightness(b.hex) - getLightness(a.hex));
  else if (sortBy === 'dark_to_light') filtered = [...filtered].sort((a, b) => getLightness(a.hex) - getLightness(b.hex));
  else if (sortBy === 'name') filtered = [...filtered].sort((a, b) => { const nameA = lang === 'en' ? a.nameEn : a.nameAr; const nameB = lang === 'en' ? b.nameEn : b.nameAr; return nameA.localeCompare(nameB, lang === 'en' ? 'en' : 'ar'); });
  return filtered;
}