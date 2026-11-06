import React from 'react';
import { Instagram, MessageCircle, Facebook, Phone } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { WHATSAPP_NUMBER } from '../utils/storeLogic';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer id="contact" className="py-12 bg-[var(--bg)] border-t border-[var(--line)]">
      <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--mute)]">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-latin-display tracking-[0.25em] text-base text-[var(--gold)] font-medium">
              SPACE COLOR INFINITY
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.rights}</span>
          </div>

          {/* Social & Contact & Admin */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.instagram.com/spacecolorinfinity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--fg)] transition-colors"
            >
              <Instagram className="w-4 h-4 text-[var(--gold)]" />
              <span>@spacecolorinfinity</span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                lang === 'ar'
                  ? 'مرحباً، لدي استفسار عن منتجات Space Color Infinity'
                  : 'Hello, I have an inquiry about Space Color Infinity products'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--fg)] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Support</span>
            </a>

            {/* Facebook - NEW */}
            <a
              href="https://www.facebook.com/share/1FvRhdTAAR/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--fg)] transition-colors"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
            </a>

            {/* Phone - NEW */}
            <a
              href="tel:+962798883033"
              className="inline-flex items-center gap-1.5 hover:text-[var(--fg)] transition-colors"
            >
              <Phone className="w-4 h-4 text-[var(--gold)]" />
              <span dir="ltr">0798883033</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="text-xs text-[var(--mute)] hover:text-[var(--gold)] transition-colors underline"
            >
              {lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};