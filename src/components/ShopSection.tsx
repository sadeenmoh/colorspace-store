import React from 'react';
import { Search, Heart, ArrowLeftRight, Sparkles, Send, Plus } from 'lucide-react';
import { Shade, CATEGORIES, BASE_PRICE } from '../utils/storeLogic';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ShopSectionProps {
  shades: Shade[];
  lang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: number | 'favorites';
  onCategoryChange: (cat: number | 'favorites') => void;
  sortBy: 'default' | 'light_to_dark' | 'dark_to_light' | 'name';
  onSortChange: (sort: 'default' | 'light_to_dark' | 'dark_to_light' | 'name') => void;
  favorites: Record<number, boolean>;
  onToggleFavorite: (id: number) => void;
  comparedIds: number[];
  onToggleCompare: (id: number) => void;
  onSelectShade: (shade: Shade) => void;
  onAddToCart: (shade: Shade) => void;
  onAddAllFavoritesToCart: () => void;
  onShareFavoritesWhatsApp: () => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  shades, lang, searchQuery, onSearchChange, selectedCategory, onCategoryChange, sortBy, onSortChange,
  favorites, onToggleFavorite, comparedIds, onToggleCompare, onSelectShade, onAddToCart,
  onAddAllFavoritesToCart, onShareFavoritesWhatsApp,
}) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';
  const favCount = Object.keys(favorites).length;

  return (
    <section id="shop" className="py-14 md:py-20 bg-[var(--bg2)] border-b border-[var(--line)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">{t.shop.eyebrow}</div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)] leading-tight">{t.shop.title}</h2>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[var(--mute)]" />
            <input type="search" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder={t.shop.searchPlaceholder} className="w-full h-11 ps-10 pe-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--fg)] placeholder:text-[var(--mute)]/70 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors" aria-label={t.shop.searchPlaceholder} />
          </div>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value as any)} className="h-11 px-3.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--gold)] transition-colors cursor-pointer w-full sm:w-auto" aria-label="Sort options">
            <option value="default">{t.shop.sortDefault}</option>
            <option value="light_to_dark">{t.shop.sortLightToDark}</option>
            <option value="dark_to_light">{t.shop.sortDarkToLight}</option>
            <option value="name">{t.shop.sortByName}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button onClick={() => onCategoryChange(-1)} className={`h-10 px-4 rounded-full text-xs font-medium border transition-colors ${selectedCategory === -1 ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--fg)]'}`}>{t.shop.allShades} (25)</button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return <button key={cat.id} onClick={() => onCategoryChange(cat.id)} className={`h-10 px-4 rounded-full text-xs font-medium border transition-colors ${isSelected ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--fg)]'}`}>{isEn ? cat.nameEn : cat.nameAr}</button>;
          })}
          <button onClick={() => onCategoryChange('favorites')} className={`h-10 px-4 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 transition-colors ${selectedCategory === 'favorites' ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--fg)]'}`}><Heart className={`w-3.5 h-3.5 ${favCount > 0 ? 'text-red-500 fill-red-500' : ''}`} /><span>{t.shop.favorites} ({favCount})</span></button>
        </div>

        {selectedCategory === 'favorites' && favCount > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-3 mb-8 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] max-w-md mx-auto">
            <button onClick={onShareFavoritesWhatsApp} className="h-9 px-3.5 rounded-lg border border-[var(--line)] text-xs text-[var(--fg)] hover:border-[var(--gold)] inline-flex items-center gap-1.5 transition-colors"><Send className="w-3.5 h-3.5 text-emerald-500" /><span>{t.shop.sendFavoritesWhatsApp}</span></button>
            <button onClick={onAddAllFavoritesToCart} className="h-9 px-3.5 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[var(--gold-hover)] transition-colors"><Plus className="w-3.5 h-3.5" /><span>{t.shop.addAllFavorites}</span></button>
          </div>
        )}

        {shades.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-[var(--mute)] text-base mb-4">{t.shop.noResults}</p>
            <button onClick={() => { onSearchChange(''); onCategoryChange(-1); }} className="text-xs text-[var(--gold)] underline hover:text-[var(--gold-hover)]">{lang === 'ar' ? 'عرض جميع الـ ٢٥ درجة' : 'Show all 25 shades'}</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {shades.map((shade) => {
              const isFav = !!favorites[shade.id];
              const isCompared = comparedIds.includes(shade.id);
              const isOut = shade.badge === 'out_of_stock';
              const name = isEn ? shade.nameEn : shade.nameAr;
              return (
                // الكرت كله قابل للضغط: أي ضغطة عليه بتفتح تفاصيل المنتج
                <article
                  key={shade.id}
                  onClick={() => onSelectShade(shade)}
                  className={`hair-card group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--bg)] border transition-all duration-300 w-full min-w-0 cursor-pointer ${isOut ? 'border-[var(--line)] opacity-75' : 'border-[var(--line)] hover:border-[var(--gold)]/80 hover:-translate-y-1 hover:shadow-lg'}`}
                >
                  {shade.badge && (
                    <div className="absolute top-2 start-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow ${shade.badge === 'out_of_stock' ? 'bg-neutral-800 text-neutral-300' : shade.badge === 'best_seller' ? 'bg-[var(--gold)] text-[var(--on-gold)]' : 'bg-emerald-600 text-white'}`}>
                        {shade.badge === 'out_of_stock' ? t.shop.soldOut : shade.badge === 'best_seller' ? t.shop.bestSeller : t.shop.new}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 end-2 z-10 flex flex-col gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(shade.id); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow ${isFav ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-zinc-100'}`} aria-label={`${t.shop.favorite} ${name}`} title={t.shop.favorite}><Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onToggleCompare(shade.id); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow ${isCompared ? 'bg-[var(--gold)] text-[var(--on-gold)]' : 'bg-white text-black hover:bg-zinc-100'}`} aria-label={`${t.shop.compare} ${name}`} title={t.shop.compare}><ArrowLeftRight className="w-3.5 h-3.5" /></button>
                  </div>

                  {/* صورة الكرت: مربعة بيضا والصورة كاملة جواتها */}
                  <button type="button" className="relative w-full aspect-square bg-white overflow-hidden focus:outline-none" aria-label={`${t.shop.viewDetails}: ${name} (${t.shop.shadeLabel} ${shade.code})`}>
                    {shade.image ? <img src={shade.image} alt={name} loading="lazy" className="w-full h-full object-contain p-3 group-hover:scale-[1.03] transition-transform duration-300" /> : null}
                    <span className="absolute bottom-2 start-3 font-latin-display text-2xl sm:text-3xl font-light text-black/70 select-none">{shade.code}</span>
                  </button>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="text-[11px] text-[var(--mute)] mb-0.5">{t.shop.shadeLabel} {shade.code}</div>
                      <h3 className="font-serif-luxury text-base sm:text-lg text-[var(--fg)] font-normal hover:text-[var(--gold)] transition-colors truncate">{name}</h3>
                      <div className="text-sm font-semibold text-[var(--gold)] mt-1 font-mono">{BASE_PRICE.toFixed(2)} {currency}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(shade); }} disabled={isOut} className={`w-full h-9 rounded-full text-xs font-bold transition-colors ${isOut ? 'bg-[var(--line)] text-[var(--mute)] cursor-not-allowed opacity-60' : 'border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)]'}`}>{isOut ? t.shop.soldOut : t.shop.addToCart}</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
