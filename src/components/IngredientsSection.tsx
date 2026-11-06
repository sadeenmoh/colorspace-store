import React from 'react';
import { Droplet, Sparkles, Feather } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface IngredientsSectionProps {
  lang: Language;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="ingredients" className="py-20 md:py-24 bg-[var(--bg2)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.ingredients.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.ingredients.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Argan Oil */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mb-6 font-latin-display text-2xl font-light">
              A
            </div>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
              {t.ingredients.arganTitle}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.ingredients.arganDesc}
            </p>
          </div>

          {/* Keratin */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mb-6 font-latin-display text-2xl font-light">
              K
            </div>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
              {t.ingredients.keratinTitle}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.ingredients.keratinDesc}
            </p>
          </div>

          {/* Jojoba */}
          <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mb-6 font-latin-display text-2xl font-light">
              J
            </div>
            <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-3">
              {t.ingredients.jojobaTitle}
            </h3>
            <p className="text-sm text-[var(--mute)] leading-relaxed">
              {t.ingredients.jojobaDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
