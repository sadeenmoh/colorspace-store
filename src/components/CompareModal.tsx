import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, ArrowLeftRight } from 'lucide-react';
import { SHADES, getLightness, isLightColor, BASE_PRICE, Shade } from '../utils/storeLogic';
import { Language, TRANSLATIONS } from '../utils/translations';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedIds: number[];
  lang: Language;
  onAddToCart: (shade: Shade) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedIds,
  lang,
  onAddToCart,
}) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';

  const visible = isOpen && comparedIds.length >= 2;

  // قفل تمرير الصفحة + إغلاق بـ Escape
  useEffect(() => {
    if (!visible) return;
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
  }, [visible, onClose]);

  if (!visible) return null;

  const shadeA = SHADES[comparedIds[0]];
  const shadeB = SHADES[comparedIds[1]];
  if (!shadeA || !shadeB) return null;

  const lightA = getLightness(shadeA.hex);
  const lightB = getLightness(shadeB.hex);
  const diffPct = Math.round((Math.abs(lightA - lightB) / 255) * 100);
  const lighterShade = lightA > lightB ? shadeA : shadeB;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] w-screen h-[100dvh] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t.compare.title}
    >
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Dialog: ما بتتجاوز الشاشة، والمحتوى بيتمرر جواتها إذا طال */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92dvh] rounded-2xl bg-[var(--bg)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--line)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ArrowLeftRight className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <h2 className="font-serif-luxury text-xl sm:text-2xl text-[var(--fg)] truncate">
              {t.compare.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)] transition-colors shrink-0"
            aria-label={t.compare.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* المحتوى القابل للتمرير */}
        <div className="overflow-y-auto overflow-x-hidden overscroll-contain">
          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[var(--line)] p-4 sm:p-6 gap-3 sm:gap-8">
            {[shadeA, shadeB].map((shade) => {
              const isLight = isLightColor(shade.hex);
              const isOut = shade.badge === 'out_of_stock';
              const name = isEn ? shade.nameEn : shade.nameAr;

              return (
                <div key={shade.id} className="flex flex-col items-center text-center min-w-0">
                  <div
                    className="w-full h-32 sm:h-48 rounded-xl hair-tile shadow-inner flex items-end justify-center p-3 sm:p-4 mb-4 border border-white/20"
                    style={{
                      backgroundColor: shade.hex,
                      color: isLight ? '#14100F' : '#F5EFE6',
                    }}
                  >
                    <span className="font-latin-display text-4xl sm:text-6xl font-light drop-shadow">
                      {shade.code}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--mute)] mb-1">
                    {t.shop.shadeLabel} {shade.code}
                  </div>
                  <h3 className="font-serif-luxury text-lg sm:text-2xl text-[var(--fg)] mb-2 break-words">
                    {name}
                  </h3>
                  <div className="text-sm font-semibold text-[var(--gold)] font-mono mb-4">
                    {BASE_PRICE.toFixed(2)} {currency}
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(shade);
                      onClose();
                    }}
                    disabled={isOut}
                    className={`w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isOut
                        ? 'bg-[var(--line)] text-[var(--mute)] cursor-not-allowed opacity-60'
                        : 'bg-[var(--gold)] text-[var(--on-gold)] hover:bg-[var(--gold-hover)]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isOut ? t.shop.soldOut : t.shop.addToCart}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Comparison Insight Banner */}
          <div className="p-4 bg-[var(--bg2)] border-t border-[var(--line)] text-center text-xs sm:text-sm text-[var(--gold)] font-medium">
            {diffPct > 3
              ? t.compare.shadeIsLighter
                  .replace('{code}', lighterShade.code)
                  .replace('{pct}', String(diffPct))
              : t.compare.shadesIdentical}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};