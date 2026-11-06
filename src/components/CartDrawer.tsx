import React from 'react';
import { X, Plus, Minus, Trash2, Send, ShoppingBag, Truck, Gift } from 'lucide-react';
import {
  SHADES,
  SHIPPING_RATES,
  SHIPPING_RATES_EN,
  calculateOrder,
  formatWhatsAppOrderMessage,
  CustomerDetails,
  WHATSAPP_NUMBER,
  BASE_PRICE,
} from '../utils/storeLogic';
import { addOrderToLog } from '../utils/adminStorage';
import { trackMetaPixelEvent } from '../utils/analyticsTracker';
import { Language, TRANSLATIONS } from '../utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<number, number>;
  onUpdateQty: (shadeId: number, delta: number) => void;
  onRemoveItem: (shadeId: number) => void;
  customer: CustomerDetails;
  onCustomerChange: (fields: Partial<CustomerDetails>) => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  customer,
  onCustomerChange,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';

  const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const calc = calculateOrder(cart, customer.city);

  const isFormValid =
    cartEntries.length > 0 &&
    customer.name.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    customer.city.trim().length > 0 &&
    customer.address.trim().length > 0;

  const waMessage = formatWhatsAppOrderMessage(cart, customer, calc, lang);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label={t.cart.title}>
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
              <ShoppingBag className="w-5 h-5 text-[var(--gold)]" />
              <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
                {t.cart.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-bold">
                {calc.totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)] hover:bg-[var(--line)]/50 transition-colors"
              aria-label={t.modal.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Cart Items List */}
            {cartEntries.length === 0 ? (
              <div className="text-center py-16 text-[var(--mute)]">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-[var(--mute)]/50 mb-3" />
                <p className="text-sm">{t.cart.empty}</p>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-[var(--line)]">
                {cartEntries.map(([idStr, qty]) => {
                  const shade = SHADES[Number(idStr)];
                  if (!shade) return null;
                  const name = isEn ? shade.nameEn : shade.nameAr;

                  return (
                    <div key={shade.id} className="pt-3 first:pt-0 flex items-center gap-3.5">
                      {/* Swatch */}
                      <div
                        className="w-12 h-12 rounded-lg border border-white/20 shrink-0 shadow-sm flex items-end justify-start p-1"
                        style={{ backgroundColor: shade.hex }}
                      >
                        <span className="text-[10px] font-bold text-white/80 drop-shadow">
                          {shade.code}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[var(--mute)]">
                          {t.shop.shadeLabel} {shade.code}
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--fg)] truncate">
                          {name}
                        </h4>
                        <div className="text-xs text-[var(--gold)] font-mono font-medium">
                          {(BASE_PRICE * qty).toFixed(2)} {currency}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-[var(--line)] rounded-lg bg-[var(--bg2)]">
                        <button
                          onClick={() => onUpdateQty(shade.id, -1)}
                          className="w-8 h-8 inline-flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold font-mono">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(shade.id, 1)}
                          className="w-8 h-8 inline-flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(shade.id)}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--mute)] hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Incentives Banners */}
            {cartEntries.length > 0 && (
              <div className="space-y-2">
                {/* Next bundle tier hint */}
                {calc.nextTier && (
                  <div className="p-3 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-xs text-[var(--gold)] flex items-center gap-2">
                    <Gift className="w-4 h-4 shrink-0" />
                    <span>
                      {t.cart.nextTierPrompt
                        .replace('{needed}', String(calc.nextTier.needed))
                        .replace('{pct}', String(calc.nextTier.discountPct))}
                    </span>
                  </div>
                )}

                {/* Free shipping hint */}
                {!calc.isShippingFree && customer.city && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>
                      {t.cart.freeShippingPrompt.replace(
                        '{amount}',
                        calc.amountUntilFreeShipping.toFixed(2)
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Customer Delivery Details Form */}
            {cartEntries.length > 0 && (
              <div className="pt-2 border-t border-[var(--line)] space-y-3">
                <div className="text-xs uppercase tracking-wider text-[var(--gold)] font-medium">
                  {t.cart.customerInfo}
                </div>

                <div>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => onCustomerChange({ name: e.target.value })}
                    placeholder={t.cart.namePlaceholder}
                    className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--gold)]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => onCustomerChange({ phone: e.target.value })}
                    placeholder={t.cart.phonePlaceholder}
                    className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--gold)]"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <select
                    value={customer.city}
                    onChange={(e) => onCustomerChange({ city: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
                    required
                  >
                    <option value="">{t.cart.citySelect}</option>
                    {Object.keys(SHIPPING_RATES).map((c) => (
                      <option key={c} value={c}>
                        {isEn ? SHIPPING_RATES_EN[c] || c : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <textarea
                    value={customer.address}
                    onChange={(e) => onCustomerChange({ address: e.target.value })}
                    placeholder={t.cart.addressPlaceholder}
                    rows={2}
                    className="w-full p-3 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--gold)] resize-none"
                    required
                  />
                </div>

                <div>
                  <textarea
                    value={customer.notes || ''}
                    onChange={(e) => onCustomerChange({ notes: e.target.value })}
                    placeholder={t.cart.notesPlaceholder}
                    rows={2}
                    className="w-full p-3 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Totals & WhatsApp CTA */}
          {cartEntries.length > 0 && (
            <div className="p-6 border-t border-[var(--line)] bg-[var(--bg2)]/60 space-y-3">
              <div className="space-y-1.5 text-xs text-[var(--mute)]">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono text-[var(--fg)]">
                    {calc.subtotal.toFixed(2)} {currency}
                  </span>
                </div>

                {calc.discountPct > 0 && (
                  <div className="flex justify-between text-[var(--gold)] font-medium">
                    <span>
                      {t.cart.bundleDiscount} ({calc.discountPct}%)
                    </span>
                    <span className="font-mono">
                      -{calc.discountAmount.toFixed(2)} {currency}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.cart.delivery}</span>
                  <span className="font-mono text-[var(--fg)]">
                    {customer.city ? (
                      calc.isShippingFree ? (
                        <span className="text-emerald-500 font-semibold">{t.cart.freeDelivery}</span>
                      ) : (
                        `${calc.shippingFee.toFixed(2)} ${currency}`
                      )
                    ) : (
                      '—'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[var(--fg)] pt-2 border-t border-[var(--line)]">
                  <span>{t.cart.grandTotal}</span>
                  <span className="font-mono text-[var(--gold)]">
                    {calc.grandTotal.toFixed(2)} {currency}
                  </span>
                </div>
              </div>

              {!isFormValid && (
                <p className="text-[11px] text-[var(--mute)] text-center leading-tight">
                  {t.cart.fillRequired}
                </p>
              )}

              <a
                href={isFormValid ? waUrl : '#'}
                target={isFormValid ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!isFormValid) {
                    e.preventDefault();
                    return;
                  }
                  try {
                    const items = cartEntries.map(([idStr, qty]) => {
                      const s = SHADES[Number(idStr)];
                      return {
                        shadeId: Number(idStr),
                        code: s.code,
                        nameAr: s.nameAr,
                        nameEn: s.nameEn,
                        qty,
                        price: BASE_PRICE,
                      };
                    });
                    addOrderToLog({
                      customerName: customer.name,
                      customerPhone: customer.phone,
                      customerCity: customer.city,
                      customerAddress: customer.address,
                      customerNotes: customer.notes,
                      items,
                      subtotal: calc.subtotal,
                      discountPct: calc.discountPct,
                      discountAmount: calc.discountAmount,
                      shippingFee: calc.shippingFee,
                      grandTotal: calc.grandTotal,
                    });
                    trackMetaPixelEvent('InitiateCheckout', {
                      value: calc.grandTotal,
                      currency: 'JOD',
                      num_items: calc.totalItems,
                      content_ids: items.map((it) => it.code),
                    });
                  } catch {}
                }}
                className={`w-full h-12 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{t.cart.checkoutWhatsApp}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
