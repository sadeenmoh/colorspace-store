import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface PerksCareSectionProps {
  lang: Language;
}

export const PerksCareSection: React.FC<PerksCareSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="care" className="py-20 md:py-24 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[var(--line)]">
          {/* Perk 1 */}
          <div className="py-6 md:py-0 md:px-8 first:ps-0 last:pe-0 flex flex-col items-start">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light italic mb-3">
              I.
            </span>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-2">
              {t.perks.p1Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.perks.p1Desc}
            </p>
          </div>

          {/* Perk 2 */}
          <div className="py-6 md:py-0 md:px-8 first:ps-0 last:pe-0 flex flex-col items-start">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light italic mb-3">
              II.
            </span>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-2">
              {t.perks.p2Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.perks.p2Desc}
            </p>
          </div>

          {/* Perk 3 */}
          <div className="py-6 md:py-0 md:px-8 first:ps-0 last:pe-0 flex flex-col items-start">
            <span className="font-latin-display text-4xl text-[var(--gold)] font-light italic mb-3">
              III.
            </span>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-2">
              {t.perks.p3Title}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.perks.p3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
