import React from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HowToUseSectionProps {
  lang: Language;
}

export const HowToUseSection: React.FC<HowToUseSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="how" className="py-20 md:py-24 bg-[var(--bg2)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.how.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.how.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
                {t.how.step1Num}
              </span>
              <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
                {t.how.step1Title}
              </h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed">
                {t.how.step1Desc}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
                {t.how.step2Num}
              </span>
              <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
                {t.how.step2Title}
              </h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed">
                {t.how.step2Desc}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
                {t.how.step3Num}
              </span>
              <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
                {t.how.step3Title}
              </h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed">
                {t.how.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
