import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, ArrowLeftRight, Share2, Copy, Check, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Shade, CATEGORIES, BASE_PRICE, SHADES } from '../utils/storeLogic';
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

  // قفل تمرير الصفحة اللي ورا النافذة + إغلاق بزر Escape
  useEffect(() => {
    if (!shade) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [shade, onClose]);

  if (!shade) return null;

  const category = CATEGORIES.find((c) => c.id === shade.categoryId);
  const categoryName = category ? (isEn ? category.nameEn : category.nameAr) : '';
  const name = isEn ? shade.nameEn : shade.nameAr;
  const desc = isEn ? shade.descEn : shade.descAr;
  const isOut = shade.badge === 'out_of_stock';

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

  const badgeLabel =
    shade.badge === 'out_of_stock'
      ? t.shop.soldOut
      : shade.badge === 'best_seller'
      ? t.shop.bestSeller
      : shade.badge
      ? t.shop.new
      : '';

  // createPortal: النافذة بتنعرض مباشرة على document.body فما بتتأثر
  // بأي transform / overflow / عرض محدود في العناصر الأب (سبب القص من اليمين)
  return createPortal(
    <div
      className="fixed inset-0 z-[100] w-screen h-[100dvh] flex items-stretch sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* على الموبايل: بياخد كل الشاشة بالضبط. على الشاشات الكبيرة: نافذة بالنص */}
      <div className="relative z-10 w-full max-w-3xl h-full sm:h-auto sm:max-h-[92dvh] bg-[var(--bg)] sm:border sm:border-[var(--line)] sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* أزرار ثابتة فوق وما بتتحرك مع التمرير */}
        <button
          onClick={onClose}
          className="absolute top-3 start-3 z-30 h-10 px-3 rounded-full bg-white text-black shadow flex items-center justify-center gap-1.5 hover:bg-zinc-100 transition-colors"
          aria-label={isEn ? 'Back' : 'رجوع'}
        >
          {isEn ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          <span className="text-xs font-bold">{isEn ? 'Back' : 'رجوع'}</span>
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 end-3 z-30 w-10 h-10 rounded-full bg-white text-black shadow flex items-center justify-center hover:bg-zinc-100 transition-colors"
          aria-label={t.modal.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* المحتوى القابل للتمرير */}
        <div className="h-full sm:max-h-[92dvh] overflow-y-auto overflow-x-hidden overscroll-contain grid grid-cols-1 md:grid-cols-2">
          {/* الصورة: كاملة بدون قص، وبدون بادج فوقها */}
          <div className="relative w-full bg-white flex items-center justify-center md:self-start">
            {shade.image ? (
              <img
                src={shade.image}
                alt={name}
                className="w-full h-auto max-h-[55dvh] md:max-h-[85dvh] object-contain px-4 pt-16 pb-4 sm:px-6"
              />
            ) : (
              <div className="w-full aspect-square" />
            )}

            {/* رقم الدرجة */}
            <div className="absolute bottom-3 start-4 z-[3] bg-black/50 backdrop-blur px-3 py-1 rounded-full">
              <span className="font-latin-display text-2xl font-light leading-none text-white">
                {shade.code}
              </span>
            </div>
          </div>

          {/* التفاصيل */}
          <div className="p-5 sm:p-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col justify-between min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
                  {categoryName} · {t.shop.shadeLabel} {shade.code}
                </span>
                {/* البادج انتقل من فوق الصورة لهون كوسم صغير */}
                {badgeLabel && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      shade.badge === 'out_of_stock'
                        ? 'bg-neutral-800 text-neutral-300'
                        : shade.badge === 'best_seller'
                        ? 'bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {badgeLabel}
                  </span>
                )}
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[var(--fg)] mb-3 break-words">
                {name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-2xl font-bold text-[var(--gold)]">
                  {BASE_PRICE.toFixed(2)} {currency}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                  {isEn ? 'Turkish Formula 🇹🇷' : 'صناعة تركية 🇹🇷'}
                </span>
              </div>

              <p className="text-sm text-[var(--mute)] leading-relaxed mb-4">{desc}</p>

              {/* محتويات العلبة */}
              <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] mb-4 text-xs space-y-1.5">
                <div className="text-sm font-bold text-[var(--gold)]">
                  {isEn ? 'Full Kit in Each Box (2.5 JOD):' : 'محتويات العلبة الواحدة (٢.٥ د.أ):'}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-[var(--fg)]">
                  <div>✔ {isEn ? '2 Color Tubes (50ml)' : '٢ تيوب صبغة ٥٠ مل'}</div>
                  <div>✔ {isEn ? '2 Oxidants (50ml)' : '٢ أوكسجين ٥٠ مل'}</div>
                  <div className="col-span-2">
                    ✔ {isEn ? 'Post-Color Conditioning Balm' : 'بلسم العناية بعد الصبغة'}
                  </div>
                </div>
                <div className="text-xs text-emerald-400 pt-1 border-t border-[var(--line)] font-medium">
                  {isEn
                    ? '✨ Buy 4 boxes and get FREE delivery anywhere in Jordan!'
                    : '✨ عرض ٤ حبات مع توصيل مجاني لجميع المحافظات!'}
                </div>
              </div>

              {/* زر الإضافة للسلة */}
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

              {/* إجراءات سريعة */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onToggleFavorite(shade.id)}
                  className={`h-10 px-3 rounded-lg border border-[var(--line)] flex items-center justify-center gap-1.5 transition-colors ${
                    isFavorite
                      ? 'text-red-500 border-red-500/50 bg-red-500/10'
                      : 'text-[var(--mute)] hover:text-[var(--fg)]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? (isEn ? 'Saved' : 'في المفضلة') : t.shop.favorite}</span>
                </button>

                <button
                  onClick={() => onToggleCompare(shade.id)}
                  className={`h-10 px-3 rounded-lg border border-[var(--line)] flex items-center justify-center gap-1.5 transition-colors ${
                    isCompared
                      ? 'text-[var(--gold)] border-[var(--gold)] bg-[var(--gold)]/10'
                      : 'text-[var(--mute)] hover:text-[var(--fg)]'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{isCompared ? (isEn ? 'Comparing' : 'في المقارنة') : t.shop.compare}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="h-10 px-3 rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.modal.shareWhatsApp}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="h-10 px-3 rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? (isEn ? 'Copied!' : 'تم النسخ') : t.modal.copyLink}</span>
                </button>
              </div>
            </div>

            {/* درجات مشابهة */}
            {similarShades.length > 0 && (
              <div className="pt-6 mt-6 border-t border-[var(--line)]">
                <div className="text-xs text-[var(--mute)] mb-2.5">{t.modal.similarShades}:</div>
                <div className="flex items-center gap-2">
                  {similarShades.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => onSelectShade(sim)}
                      className="w-14 h-14 rounded-2xl border border-white/20 hover:scale-105 transition-transform overflow-hidden relative flex items-center justify-center bg-white"
                      title={isEn ? sim.nameEn : sim.nameAr}
                      aria-label={isEn ? sim.nameEn : sim.nameAr}
                    >
                      {sim.image ? (
                        <img
                          src={sim.image}
                          alt={isEn ? sim.nameEn : sim.nameAr}
                          className="absolute inset-0 w-full h-full object-contain p-1"
                        />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};