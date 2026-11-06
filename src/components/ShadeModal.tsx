import React, { useState } from 'react';
import { X, Heart, ArrowLeftRight, Share2, Copy, Check, ShoppingBag } from 'lucide-react';
import { Shade, CATEGORIES, isLightColor, BASE_PRICE, SHADES } from '../utils/storeLogic';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ShadeModalProps {
  shade: Shade | null;
  onClose: () => void;
  lang: Language;
  onAddToCart: (shade: Shade) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  isCompared: boolean;
  onToggleCompare: (id: number) => void;
  onSelectShade: (shade: Shade) => void;
  onShowToast: (msg: string) => void;
}

export const ShadeModal: React.FC<ShadeModalProps> = ({
  shade,
  onClose,
  lang,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onSelectShade,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';

  if (!shade) return null;

  const category = CATEGORIES.find((c) => c.id === shade.categoryId);
  const categoryName = category ? (isEn ? category.nameEn : category.nameAr) : '';
  const name = isEn ? shade.nameEn : shade.nameAr;
  const desc = isEn ? shade.descEn : shade.descAr;
  const isLight = isLightColor(shade.hex);
  const isOut = shade.badge === 'out_of_stock';

  // Find 3 neighboring shades as similar shades
  const similarShades = [shade.id - 1, shade.id + 1, shade.id + 2]
    .filter((id) => id >= 0 && id < SHADES.length && id !== shade.id)
    .slice(0, 3)
    .map((id) => SHADES[id]);

  const shareUrl = `${window.location.origin}${window.location.pathname}#shade-${shade.code}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast(t.modal.linkCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(shareUrl);
    }
  };

  const handleShareWhatsApp = () => {
    const text = isEn
      ? `Check out this shade from Space Color Infinity: Shade ${shade.code} (${shade.nameEn})\n${shareUrl}`
      : `شوفي هاي الدرجة من Space Color Infinity: الدرجة ${shade.code} (${shade.nameAr})\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={name}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-[var(--bg)] border border-[var(--line)] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          aria-label={t.modal.close}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Big Shade Image - NEW */}
        <div
          className="relative min-h- md:min-h- flex items-end p-8 overflow-hidden"
          style={{ backgroundColor: shade.hex }}
        >
          {shade.image ? (
            <img
              src={shade.image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          {/* تدرج خفيف من تحت عشان الرقم يبين */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span
              className="font-latin-display text-7xl sm:text-9xl font-light leading-none select-none text-white"
              style={{ textShadow: '0 3px 12px rgba(0,0,0,0.7)' }}
            >
              {shade.code}
            </span>
          </div>
          {/* Badge جوا الصورة إذا موجود */}
          {shade.badge && (
            <div className="absolute top-4 end-4 z-10">
              <span
                className={`px-2.5 py-1 rounded text- font-bold tracking-wider uppercase ${
                  shade.badge === 'out_of_stock'
                    ? 'bg-neutral-800 text-neutral-300'
                    : shade.badge === 'best_seller'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {shade.badge === 'out_of_stock'
                  ? t.shop.soldOut
                  : shade.badge === 'best_seller'
                  ? t.shop.bestSeller
                  : t.shop.new}
              </span>
            </div>
          )}
        </div>

        {/* Right: Detailed Info */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium mb-1">
              {categoryName} · {t.shop.shadeLabel} {shade.code}
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[var(--fg)] mb-3">
              {name}
            </h2>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-2xl font-bold text-[var(--gold)]">
                {BASE_PRICE.toFixed(2)} {currency}
              </span>
              <span className="text- px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                {isEn ? 'Turkish Formula 🇹🇷' : 'صناعة تركية 🇹🇷'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed mb-4">
              {desc}
            </p>

            {/* Box Contents Breakdown */}
            <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] mb-4 text-xs space-y-1.5">
              <div className="text- font-bold text-[var(--gold)]">
                {isEn ? 'Full Kit in Each Box (2.5 JOD):' : 'محتويات العلبة الواحدة (٢.٥ د.أ):'}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text- text-[var(--fg)]">
                <div>✔ {isEn ? '2 Color Tubes (50ml)' : '٢ تيوب صبغة ٥٠ مل'}</div>
                <div>✔ {isEn ? '2 Oxidants (50ml)' : '٢ أوكسجين ٥٠ مل'}</div>
                <div className="col-span-2">✔ {isEn ? 'Post-Color Conditioning Balm' : 'بلسم العناية بعد الصبغة'}</div>
              </div>
              <div className="text- text-emerald-400 pt-1 border-t border-[var(--line)] font-medium">
                {isEn ? '✨ Buy 4 boxes and get FREE delivery anywhere in Jordan!' : '✨ عرض ٤ حبات مع توصيل مجاني لجميع المحافظات!'}
              </div>
            </div>

            {/* Main CTA */}
            <button
              onClick={() => {
                onAddToCart(shade);
                onClose();
              }}
              disabled={isOut}
              className={`w-full h-12 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all mb-4 ${
                isOut
                  ? 'bg-[var(--line)] text-[var(--mute)] cursor-not-allowed opacity-60'
                  : 'bg-[var(--gold)] text-[var(--on-gold)] hover:bg-[var(--gold-hover)] shadow-lg shadow-[var(--gold)]/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOut ? t.shop.soldOut : t.shop.addToCart}</span>
            </button>

            {/* Quick Actions (Favorite, Compare, Share, Copy) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onToggleFavorite(shade.id)}
                className={`h-9 px-3 rounded-lg border border-[var(--line)] flex items-center justify-center gap-1.5 transition-colors ${
                  isFavorite ? 'text-red-500 border-red-500/50 bg-red-500/10' : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? (isEn ? 'Saved' : 'في المفضلة') : t.shop.favorite}</span>
              </button>

              <button
                onClick={() => onToggleCompare(shade.id)}
                className={`h-9 px-3 rounded-lg border border-[var(--line)] flex items-center justify-center gap-1.5 transition-colors ${
                  isCompared ? 'text-[var(--gold)] border-[var(--gold)] bg-[var(--gold)]/10' : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isCompared ? (isEn ? 'Comparing' : 'في المقارنة') : t.shop.compare}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="h-9 px-3 rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.modal.shareWhatsApp}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="h-9 px-3 rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isEn ? 'Copied!' : 'تم النسخ') : t.modal.copyLink}</span>
              </button>
            </div>
          </div>

          {/* Similar Shades Row - NEW with images */}
          {similarShades.length > 0 && (
            <div className="pt-6 mt-6 border-t border-[var(--line)]">
              <div className="text- text-[var(--mute)] mb-2.5">
                {t.modal.similarShades}:
              </div>
              <div className="flex items-center gap-2">
                {similarShades.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onSelectShade(sim)}
                    className="w-12 h-12 rounded-full border border-white/20 hover:scale-110 transition-transform overflow-hidden relative flex items-center justify-center"
                    style={{ backgroundColor: sim.hex }}
                    title={isEn ? sim.nameEn : sim.nameAr}
                    aria-label={isEn ? sim.nameEn : sim.nameAr}
                  >
                    {sim.image ? (
                      <img src={sim.image} alt={isEn ? sim.nameEn : sim.nameAr} className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <span className="relative z-10 text- font-bold text-white drop-shadow" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {sim.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};