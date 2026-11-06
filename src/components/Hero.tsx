import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-[var(--line)]">
      {/* Background Subtle Gradient & Animated Wave Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-40">
        <svg
          className="w-full h-full object-cover animate-wave"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9B28A" stopOpacity="0" />
              <stop offset="50%" stopColor="#C9B28A" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#C9B28A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#goldGradient)" strokeWidth="1.2">
            <path d="M-50 300C250 100 550 500 850 300S1350 150 1500 320" />
            <path d="M-50 330C250 130 550 530 850 330S1350 180 1500 350" />
            <path d="M-50 360C250 160 550 560 850 360S1350 210 1500 380" />
            <path d="M-50 390C250 190 550 590 850 390S1350 240 1500 410" />
            <path d="M-50 420C250 220 550 620 850 420S1350 270 1500 440" />
          </g>
        </svg>
      </div>

      {/* Radial soft glow */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Unboxed Metadata / Eyebrow */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.eyebrow}</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl leading-[1.15] tracking-tight text-[var(--fg)] mb-6">
              <span>{t.hero.title1}</span>
              <br />
              <span className="text-[var(--gold)] italic font-normal">
                {t.hero.title2}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--mute)] leading-relaxed max-w-xl mb-8">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] hover:bg-[var(--gold-hover)] font-semibold text-sm transition-all duration-200 shadow-lg shadow-[var(--gold)]/20"
              >
                {t.hero.shopNow}
              </a>
              <a
                href="#deals"
                className="inline-flex items-center justify-center h-12 px-7 rounded-lg border border-[var(--gold)]/60 text-[var(--gold)] hover:bg-[var(--gold)]/10 font-semibold text-sm transition-colors duration-200"
              >
                {t.hero.viewBundles}
              </a>
            </div>

            {/* Package Contents Banner */}
            <div className="mt-8 p-4 rounded-xl bg-[var(--bg2)] border border-[var(--gold)]/40 w-full max-w-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--gold)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'محتويات كل علبة كاملة:' : 'Full Kit Inside Each Box:'}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold)] text-[var(--on-gold)] text-xs font-bold font-mono shadow-sm">
                  {lang === 'ar' ? '٢.٥ دينار فقط' : '2.5 JOD Only'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[var(--fg)] font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✔️</span>
                  <span>{lang === 'ar' ? '2 تيوب صبغة 50ml' : '2 Dye Tubes 50ml'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✔️</span>
                  <span>{lang === 'ar' ? '2 أوكسجين 50ml' : '2 Oxidants 50ml'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✔️</span>
                  <span>{lang === 'ar' ? 'بلسم عناية مغذي' : 'Post-Color Balm'}</span>
                </div>
              </div>
              <div className="text-[11px] text-[var(--gold)] font-medium pt-1 border-t border-[var(--line)]">
                {lang === 'ar'
                  ? '✨ عرض خاص: اشتري ٤ حبات واحصلي على توصيل مجاني لكافة المحافظات!'
                  : '✨ Special Offer: Buy 4 boxes and get FREE delivery anywhere in Jordan!'}
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-[var(--line)] w-full max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-latin-display text-[var(--gold)]">
                  25
                </div>
                <div className="text-xs text-[var(--mute)] mt-0.5">
                  {lang === 'ar' ? 'درجة دقيقة' : 'Precision Shades'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-latin-display text-[var(--gold)]">
                  100%
                </div>
                <div className="text-xs text-[var(--mute)] mt-0.5">
                  {lang === 'ar' ? 'تغطية للشيب' : 'Grey Coverage'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-latin-display text-[var(--gold)]">
                  {lang === 'ar' ? 'قليلة الأمونيا' : 'Low Ammonia'}
                </div>
                <div className="text-xs text-[var(--mute)] mt-0.5">
                  {lang === 'ar' ? 'أرجان · كيراتين · جوجوبا' : 'Argan · Keratin · Jojoba'}
                </div>
              </div>
            </div>
          </div>

          {/* Product Box Image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                const el = document.getElementById('shop');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Backing Ambient Halo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--gold)]/20 to-purple-500/10 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Price Badge */}
              <div className="absolute -top-3 -end-3 z-20 px-3.5 py-1.5 rounded-full bg-[var(--gold)] text-[var(--on-gold)] font-bold text-xs shadow-xl flex items-center gap-1.5 animate-bounce">
                <span>{lang === 'ar' ? '٢.٥ دينار' : '2.5 JOD'}</span>
              </div>

              {/* Box image */}
              <img
                src="/assets/aistudio/box.jpg"
                alt="Space Infinity - Turkish Hair Color"
                className="relative w-80 sm:w-96 lg:w-[30rem] h-auto max-h-[560px] object-contain rounded-xl border border-[var(--gold)]/60 shadow-2xl transition-transform duration-500 animate-float hover:scale-[1.02]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};