import React from 'react';
import { Star } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ReviewsSectionProps {
  lang: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="py-20 md:py-24 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.reviews.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.reviews.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Review 1 */}
          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[var(--gold)] mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-[var(--mute)] leading-relaxed italic mb-6">
              "{t.reviews.r1Text}"
            </p>
            <div className="border-t border-[var(--line)] pt-4">
              <div className="font-semibold text-sm text-[var(--fg)]">
                {t.reviews.r1Name}
              </div>
              <div className="text-xs text-[var(--gold)]">
                {t.reviews.r1City}
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[var(--gold)] mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-[var(--mute)] leading-relaxed italic mb-6">
              "{t.reviews.r2Text}"
            </p>
            <div className="border-t border-[var(--line)] pt-4">
              <div className="font-semibold text-sm text-[var(--fg)]">
                {t.reviews.r2Name}
              </div>
              <div className="text-xs text-[var(--gold)]">
                {t.reviews.r2City}
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[var(--gold)] mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-[var(--mute)] leading-relaxed italic mb-6">
              "{t.reviews.r3Text}"
            </p>
            <div className="border-t border-[var(--line)] pt-4">
              <div className="font-semibold text-sm text-[var(--fg)]">
                {t.reviews.r3Name}
              </div>
              <div className="text-xs text-[var(--gold)]">
                {t.reviews.r3City}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
