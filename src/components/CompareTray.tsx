import React from 'react';
import { ArrowLeftRight, X, Eye } from 'lucide-react';
import { SHADES } from '../utils/storeLogic';
import { Language, TRANSLATIONS } from '../utils/translations';

interface CompareTrayProps {
  comparedIds: number[];
  onOpenModal: () => void;
  onClear: () => void;
  lang: Language;
}

export const CompareTray: React.FC<CompareTrayProps> = ({
  comparedIds,
  onOpenModal,
  onClear,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (comparedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-40 bg-[var(--bg)]/95 backdrop-blur-md border border-[var(--gold)] rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 text-xs text-[var(--fg)]">
        <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--gold)]" />
        <span className="font-medium">
          {t.compare.title}:
        </span>
        <div className="flex items-center gap-1.5 font-mono">
          {comparedIds.map((id) => (
            <span
              key={id}
              className="px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold"
            >
              {SHADES[id].code}
            </span>
          ))}
          {comparedIds.length < 2 && (
            <span className="text-[var(--mute)] text-[11px]">
              {t.compare.pickSecond}
            </span>
          )}
        </div>
      </div>

      {comparedIds.length === 2 && (
        <button
          onClick={onOpenModal}
          className="h-8 px-3 rounded-full bg-[var(--gold)] text-[var(--on-gold)] hover:bg-[var(--gold-hover)] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.compare.viewComparison}</span>
        </button>
      )}

      <button
        onClick={onClear}
        className="w-7 h-7 rounded-full text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center transition-colors"
        aria-label={t.compare.clear}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
