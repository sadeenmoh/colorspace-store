import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

const CATALOG_PAGES = ['/assets/aistudio/ca.png', '/assets/aistudio/ca1.png'];

export const CatalogSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section id="catalog" className="py-20 md:py-28 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.catalog.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)] mb-3">{t.catalog.title}</h2>
          <p className="text-sm text-[var(--mute)]">{t.catalog.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATALOG_PAGES.map((src, i) => (
            <figure key={src} className="rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--bg2)]">
              <a href={src} target="_blank" rel="noopener noreferrer">
                <img src={src} alt={`${t.catalog.title} ${i + 1}`} loading="lazy" className="w-full h-auto" />
              </a>
              <figcaption className="flex items-center justify-center gap-3 p-3 text-xs">
                <a href={src} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-[var(--mute)] hover:text-[var(--fg)]">
                  <ExternalLink className="w-3.5 h-3.5" />{t.catalog.open}
                </a>
                <a href={src} download
                   className="inline-flex items-center gap-1.5 text-[var(--gold)] hover:text-[var(--gold-hover)]">
                  <Download className="w-3.5 h-3.5" />{t.catalog.download}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};