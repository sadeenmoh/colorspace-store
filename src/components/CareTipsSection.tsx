import React from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface CareTipsSectionProps {
  lang: Language;
}

export const CareTipsSection: React.FC<CareTipsSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="tips" className="py-20 md:py-24 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.tips.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.tips.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
              01
            </span>
            <h3 className="font-serif-luxury text-xl text-[var(--fg)] mb-2">
              {t.tips.tip1Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.tips.tip1Desc}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
              02
            </span>
            <h3 className="font-serif-luxury text-xl text-[var(--fg)] mb-2">
              {t.tips.tip2Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.tips.tip2Desc}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
              03
            </span>
            <h3 className="font-serif-luxury text-xl text-[var(--fg)] mb-2">
              {t.tips.tip3Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.tips.tip3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
