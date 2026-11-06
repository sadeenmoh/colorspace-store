import { Shade, SHADES } from './storeLogic';

export function toggleWishlistItem(
  wishlist: Record<number, boolean>,
  shadeId: number
): Record<number, boolean> {
  const next = { ...wishlist };
  if (next[shadeId]) {
    delete next[shadeId];
  } else {
    next[shadeId] = true;
  }
  return next;
}

export function formatWishlistWhatsAppMessage(
  wishlistIds: number[],
  shades: Shade[] = SHADES,
  lang: 'ar' | 'en' = 'ar'
): string {
  const isEn = lang === 'en';
  const title = isEn
    ? '✨ My Wishlist from Space Color Infinity ✨'
    : '✨ قائمة أمنياتي من Space Color Infinity ✨';

  const items = wishlistIds
    .map((id) => shades[id])
    .filter(Boolean)
    .map((s) => {
      const name = isEn ? s.nameEn : s.nameAr;
      const label = isEn ? `Shade ${s.code}` : `الدرجة ${s.code}`;
      return `• ${label} (${name})`;
    });

  const lines = [title, '', ...items];
  return lines.join('\n');
}
