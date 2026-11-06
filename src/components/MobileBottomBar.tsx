import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface MobileBottomBarProps {
  totalItems: number;
  grandTotal: number;
  onOpenCart: () => void;
  lang: Language;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  totalItems,
  grandTotal,
  onOpenCart,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';

  if (totalItems <= 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--gold)]/40 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] flex items-center justify-between shadow-2xl">
      <div>
        <div className="font-mono text-base font-bold text-[var(--gold)]">
          {grandTotal.toFixed(2)} {currency}
        </div>
        <div className="text-[11px] text-[var(--mute)]">
          {totalItems} {t.cart.itemsCount}
        </div>
      </div>

      <button
        onClick={onOpenCart}
        className="h-10 px-5 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:bg-[var(--gold-hover)] transition-colors"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>{t.mobileBar.checkout}</span>
      </button>
    </div>
  );
};
