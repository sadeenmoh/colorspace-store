import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface StoresSectionProps {
  lang: Language;
}

export const StoresSection: React.FC<StoresSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const stores = [
    {
      num: '01',
      name: t.stores.s1Name,
      city: t.stores.s1City,
      address: t.stores.s1Address,
      query: `${t.stores.s1Name} ${t.stores.s1City}`,
    },
    {
      num: '02',
      name: t.stores.s2Name,
      city: t.stores.s2City,
      address: t.stores.s2Address,
      query: `${t.stores.s2Name} ${t.stores.s2City}`,
    },
    {
      num: '03',
      name: t.stores.s3Name,
      city: t.stores.s3City,
      address: t.stores.s3Address,
      query: `${t.stores.s3Name} ${t.stores.s3City}`,
    },
  ];

  return (
    <section id="stores" className="py-20 md:py-24 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
            {t.stores.eyebrow}
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)]">
            {t.stores.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stores.map((store) => (
            <div
              key={store.num}
              className="p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between"
            >
              <div>
                <span className="font-latin-display text-4xl text-[var(--gold)] font-light block mb-4">
                  {store.num}
                </span>
                <h3 className="font-serif-luxury text-2xl text-[var(--fg)] mb-2">
                  {store.name}
                </h3>
                <div className="flex items-start gap-2 text-sm text-[var(--mute)] leading-relaxed mb-6">
                  <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[var(--fg)] font-medium">{store.city}</strong> · {store.address}
                  </span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[var(--line)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                <span>{t.stores.mapButton}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
