import React from 'react';
import { X, Heart, ShoppingBag, Send, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Shade, BASE_PRICE, isLightColor } from '../utils/storeLogic';
import { formatWishlistWhatsAppMessage } from '../utils/wishlistLogic';
import { Language } from '../utils/translations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Record<number, boolean>;
  shades: Shade[];
  onRemoveFromWishlist: (shadeId: number) => void;
  onAddToCart: (shade: Shade) => void;
  onAddAllToCart: () => void;
  lang: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  shades,
  onRemoveFromWishlist,
  onAddToCart,
  onAddAllToCart,
  lang,
}) => {
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';
  const wishlistIds = Object.keys(wishlist).map(Number);
  const wishShades = wishlistIds.map((id) => shades[id]).filter(Boolean);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    if (wishlistIds.length === 0) return;
    const msg = formatWishlistWhatsAppMessage(wishlistIds, shades, lang);
    const url = `https://wa.me/?text=${encodeURIComponent(msg + '\n' + window.location.origin)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Wishlist' : 'قائمة الأمنيات'}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 start-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[var(--bg)] border-e border-[var(--line)] shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--line)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
                {isEn ? 'Wishlist' : 'قائمة الأمنيات'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-bold font-mono">
                {wishShades.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)] hover:bg-[var(--line)]/50 transition-colors"
              aria-label={isEn ? 'Close' : 'إغلاق'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishShades.length === 0 ? (
              <div className="text-center py-16 text-[var(--mute)]">
                <Heart className="w-12 h-12 mx-auto stroke-1 text-[var(--mute)]/40 mb-3" />
                <h3 className="font-serif-luxury text-xl text-[var(--fg)] mb-1">
                  {isEn ? 'Your Wishlist is Empty' : 'قائمة أمنياتك فارغة'}
                </h3>
                <p className="text-xs text-[var(--mute)] max-w-xs mx-auto mb-6">
                  {isEn
                    ? 'Tap the heart icon on any shade in the collection to save your favorite hair colors here.'
                    : 'اضغطي على أيقونة القلب على أي درجة تعجبك لحفظها والرجوع لها في أي وقت.'}
                </p>
                <button
                  onClick={onClose}
                  className="h-10 px-5 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-semibold hover:bg-[var(--gold-hover)] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{isEn ? 'Explore Shades' : 'استكشفي درجات الصبغة'}</span>
                  {isEn ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-[var(--line)]">
                {wishShades.map((shade) => {
                  const name = isEn ? shade.nameEn : shade.nameAr;
                  const isLight = isLightColor(shade.hex);
                  const isOut = shade.badge === 'out_of_stock';

                  return (
                    <div key={shade.id} className="pt-3 first:pt-0 flex items-center gap-3.5">
                      {/* Swatch */}
                      <div
                        className="w-12 h-12 rounded-lg border border-white/20 shrink-0 shadow-sm flex items-end justify-start p-1"
                        style={{
                          backgroundColor: shade.hex,
                          color: isLight ? '#14100F' : '#FFF',
                        }}
                      >
                        <span className="text-[10px] font-bold drop-shadow">
                          {shade.code}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[var(--mute)]">
                          {isEn ? 'Shade' : 'الدرجة'} {shade.code}
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--fg)] truncate">
                          {name}
                        </h4>
                        <div className="text-xs text-[var(--gold)] font-mono font-medium">
                          {BASE_PRICE.toFixed(2)} {currency}
                        </div>
                      </div>

                      {/* Quick Add to Cart */}
                      <button
                        onClick={() => onAddToCart(shade)}
                        disabled={isOut}
                        className={`h-9 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                          isOut
                            ? 'bg-[var(--line)] text-[var(--mute)] cursor-not-allowed opacity-60'
                            : 'border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {isOut ? (isEn ? 'Sold out' : 'نفذت') : (isEn ? 'Add' : 'أضيفي')}
                        </span>
                      </button>

                      {/* Remove from Wishlist */}
                      <button
                        onClick={() => onRemoveFromWishlist(shade.id)}
                        className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-[var(--mute)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        aria-label={isEn ? `Remove ${name}` : `إزالة ${name} من الأمنيات`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {wishShades.length > 0 && (
            <div className="p-6 border-t border-[var(--line)] bg-[var(--bg2)]/60 space-y-3">
              <button
                onClick={onAddAllToCart}
                className="w-full h-11 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:bg-[var(--gold-hover)] shadow-lg shadow-[var(--gold)]/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isEn ? 'Add All Wishlist to Cart' : 'أضيفي كل قائمة الأمنيات للسلة'}
                </span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full h-10 rounded-lg border border-[var(--line)] text-xs text-[var(--fg)] hover:border-emerald-500 hover:text-emerald-400 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {isEn ? 'Share My Wishlist via WhatsApp' : 'مشاركة قائمة أمنياتي عبر واتساب'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
