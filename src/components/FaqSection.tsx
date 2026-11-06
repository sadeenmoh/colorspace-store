import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <section id="faq" className="py-20 md:py-24 bg-[var(--bg2)] border-b border-[var(--line)]">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.faq.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full min-h-[56px] px-6 py-4 flex items-center justify-between text-start gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-luxury text-lg sm:text-xl text-[var(--fg)]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--gold)] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[var(--mute)] leading-relaxed border-t border-[var(--line)]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
