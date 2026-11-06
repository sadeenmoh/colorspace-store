import React from 'react';
import { ShoppingBag, Heart, Globe, Sun, Moon } from 'lucide-react';
import { Language, Theme, TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)] transition-colors duration-200">
      <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            dir="ltr"
            className="flex items-baseline gap-1.5 font-latin-display text-xl sm:text-2xl tracking-[0.25em] text-[var(--fg)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
          >
            <span>SPACE</span>
            <span className="text-[var(--gold)] font-medium">INFINITY</span>
          </a>

          {/* Zone 2: Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--mute)]">
            <a
              href="#shop"
              className="hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.shades}
            </a>
            <a
              href="#deals"
              className="hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.bundles}
            </a>
            <a
              href="#care"
              className="hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.care}
            </a>
            <a
              href="#how"
              className="hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.how}
            </a>
            <a
              href="#faq"
              className="hover:text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: Actions (Theme, Language, Wishlist, Cart Button) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] hover:border-[var(--gold)]/50 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--gold)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--fg)]" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="h-10 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] text-xs font-semibold tracking-wider text-[var(--mute)] hover:text-[var(--fg)] hover:border-[var(--gold)]/50 transition-colors"
              aria-label={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="h-10 px-3 sm:px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] text-xs font-semibold text-[var(--mute)] hover:text-red-500 hover:border-red-500/50 transition-colors"
              title={lang === 'ar' ? 'قائمة الأمنيات' : 'Wishlist'}
              aria-label={lang === 'ar' ? `قائمة الأمنيات (${wishlistCount})` : `Wishlist (${wishlistCount})`}
            >
              <Heart
                className={`w-4 h-4 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`}
              />
              <span className="hidden sm:inline">
                {lang === 'ar' ? 'الأمنيات' : 'Wishlist'}
              </span>
              {wishlistCount > 0 && (
                <span className="min-w-4.5 h-4.5 px-1 rounded-full text- font-bold inline-flex items-center justify-center bg-red-500/20 text-red-400">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="h-10 px-3.5 sm:px-4 inline-flex items-center gap-2 rounded-lg border border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)] transition-all duration-200 font-medium text-sm"
              aria-label={`${t.cart.title} (${cartCount})`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'السلة' : 'Cart'}</span>
              <span
                className={`min-w-5 h-5 px-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center transition-colors ${
                  cartCount > 0
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'bg-[var(--line)] text-[var(--mute)]'
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};