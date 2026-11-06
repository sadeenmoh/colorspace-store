import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../utils/storeLogic';
import { Language } from '../utils/translations';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const isEn = lang === 'en';
  const text = isEn
    ? 'Hello, I have an inquiry about Space Color Infinity hair color'
    : 'مرحباً، عندي استفسار عن صبغة Space Color Infinity';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-30 h-12 px-4 rounded-full bg-[#25D366] text-[#07130B] font-bold text-xs inline-flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
      aria-label={isEn ? 'Contact us via WhatsApp' : 'تواصلي معنا عبر واتساب'}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline">
        {isEn ? 'Contact Us' : 'تواصلي معنا'}
      </span>
    </a>
  );
};
