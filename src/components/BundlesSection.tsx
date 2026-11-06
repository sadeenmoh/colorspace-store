import React from 'react';
import { Sparkles, Truck, Check, Package, Gift } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { BASE_PRICE } from '../utils/storeLogic';

interface BundlesSectionProps {
  lang: Language;
}

export const BundlesSection: React.FC<BundlesSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';

  return (
    <section id="deals" className="py-20 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.bundles.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)] mb-4">
            {t.bundles.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--mute)] leading-relaxed">
            {t.bundles.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto items-stretch">
          {/* Card 1: Single Box */}
          <div className="relative rounded-2xl p-6 sm:p-8 bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between hover:border-[var(--line)]/80 transition-colors">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-2">
                {isEn ? 'Single Box' : 'العلبة الواحدة'}
              </div>
              <div className="font-latin-display text-4xl sm:text-5xl font-light text-[var(--fg)] mb-1">
                2.50 <span className="text-sm font-sans text-[var(--gold)]">{isEn ? 'JOD' : 'د.أ'}</span>
              </div>
              <div className="text-xs text-[var(--mute)] mb-6">
                {isEn ? '+ 2.0 JOD delivery flat rate' : '+ ٢.٠ د.أ رسوم التوصيل لجميع المناطق'}
              </div>

              <div className="space-y-2.5 text-xs text-[var(--fg)] mb-8 border-t border-[var(--line)] pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? '2 Color Tubes (50ml each)' : '٢ تيوب صبغة × ٥٠ مل'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? '2 Oxidant Developers (50ml)' : '٢ أوكسجين × ٥٠ مل'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Post-Color Conditioning Balm' : 'بلسم العناية بعد الصبغة'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Low Ammonia Turkish formula 🇹🇷' : 'تركيبة تركية قليلة الأمونيا 🇹🇷'}</span>
                </div>
              </div>
            </div>

            <a
              href="#shop"
              className="w-full h-11 rounded-lg border border-[var(--line)] hover:border-[var(--gold)] text-xs font-semibold text-[var(--fg)] flex items-center justify-center transition-colors"
            >
              {isEn ? 'Pick a Shade' : 'اختاري درجتك'}
            </a>
          </div>

          {/* Card 2: Featured Hero Bundle - 4 Boxes Free Delivery */}
          <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[var(--bg2)] via-[var(--bg2)] to-[var(--gold)]/10 border-2 border-[var(--gold)] shadow-xl shadow-[var(--gold)]/10 flex flex-col justify-between md:-translate-y-2">
            {/* Best Seller Badge - جوات الكرت، مش absolute، فمستحيل تنقص */}
            <div className="flex justify-center mb-4">
              <span dir="rtl" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[var(--gold)] text-[var(--on-gold)] text-xs sm:text-[13px] font-bold shadow-md text-center leading-normal">
                <span aria-hidden="true">⭐</span>
                <span>{isEn ? 'Most Popular Offer' : 'العرض الأكثر طلباً'}</span>
              </span>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2 mt-2">
                {isEn ? '4 Boxes Bundle + FREE Delivery' : 'باقة ٤ حبات + توصيل مجاني'}
              </div>
              <div className="font-latin-display text-4xl sm:text-5xl font-light text-[var(--gold)] mb-1">
                10.00 <span className="text-sm font-sans text-[var(--fg)]">{isEn ? 'JOD' : 'د.أ'}</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold mb-6 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>{isEn ? 'FREE Delivery anywhere in Jordan (Save 2 JOD)' : 'توصيل مجاني لكافة المحافظات (توفير دينارين التوصيل)'}</span>
              </div>

              <div className="space-y-2.5 text-xs text-[var(--fg)] mb-8 border-t border-[var(--gold)]/30 pt-4">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                  <span>{isEn ? 'Choose any 4 shades of your choice' : 'اختاري أي ٤ درجات مختلفة حسب رغبتك'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? '8 Color Tubes + 8 Oxidants + 4 Balms' : '٨ تيوب صبغة + ٨ أوكسجين + ٤ أكياس بلسم'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Rich natural oils: Jojoba, Argan & Keratin' : 'غنية بزيت الجوجوبا والأرجان والكيراتين'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? '0 JOD Shipping applied automatically' : 'توصيل مجاني فوري في السلة!'}</span>
                </div>
              </div>
            </div>

            <a
              href="#shop"
              className="w-full h-11 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] hover:bg-[var(--gold-hover)] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Package className="w-4 h-4" />
              <span>{isEn ? 'Select 4 Shades Now' : 'اختاري ٤ درجات واستفيدي من العرض'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};