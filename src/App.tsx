import React, { useState, useEffect, useMemo } from 'react';

import {
  Shade,
  filterAndSortShades,
  calculateOrder,
  CustomerDetails,
} from './utils/storeLogic';
import {
  getStoredShades,
  getStoredSettings,
  addOrderToLog,
  StoreSettings,
} from './utils/adminStorage';
import {
  recordCurrentVisit,
  initMetaPixel,
  trackMetaPixelEvent,
} from './utils/analyticsTracker';
import { Language, Theme, TRANSLATIONS } from './utils/translations';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopSection } from './components/ShopSection';
import { CatalogSection } from './components/CatalogSection';
import { BundlesSection } from './components/BundlesSection';
import { PerksCareSection } from './components/PerksCareSection';
import { IngredientsSection } from './components/IngredientsSection';
import { CareTipsSection } from './components/CareTipsSection';
import { HowToUseSection } from './components/HowToUseSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ShadeModal } from './components/ShadeModal';
import { CompareModal } from './components/CompareModal';
import { CompareTray } from './components/CompareTray';
import { MobileBottomBar } from './components/MobileBottomBar';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ShadeAIAdvisor } from './components/ShadeAIAdvisor';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('dark');

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin';
  });

  const [shades, setShades] = useState<Shade[]>(() => getStoredShades());
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => getStoredSettings());

  const [cart, setCart] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('sci-cart') || '{}');
    } catch {
      return {};
    }
  });

  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('sci-customer') ||
          JSON.stringify({ name: '', phone: '', city: '', address: '', notes: '' })
      );
    } catch {
      return { name: '', phone: '', city: '', address: '', notes: '' };
    }
  });

  const [favorites, setFavorites] = useState<Record<number, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('sci-fav') || '{}');
    } catch {
      return {};
    }
  });

  const [comparedIds, setComparedIds] = useState<number[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeShade, setActiveShade] = useState<Shade | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'favorites'>(-1);
  const [sortBy, setSortBy] = useState<'default' | 'light_to_dark' | 'dark_to_light' | 'name'>('default');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('sci-cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sci-customer', JSON.stringify(customer));
    } catch {}
  }, [customer]);

  useEffect(() => {
    try {
      localStorage.setItem('sci-fav', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  useEffect(() => {
    recordCurrentVisit();
  }, []);

  useEffect(() => {
    if (storeSettings.metaPixelId) {
      initMetaPixel(storeSettings.metaPixelId);
    }
  }, [storeSettings.metaPixelId]);

  useEffect(() => {
    if (activeShade) {
      trackMetaPixelEvent('ViewContent', {
        content_name: activeShade.nameEn,
        content_ids: [activeShade.code],
        value: 5.0,
        currency: 'JOD',
      });
    }
  }, [activeShade]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
        return;
      }
      const match = window.location.hash.match(/^#shade-(\d+)$/);
      if (match) {
        const code = match[1].padStart(2, '0');
        const found = shades.find((s) => s.code === code);
        if (found) {
          setActiveShade(found);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [shades]);

  const handleAddToCart = (shade: Shade) => {
    if (shade.badge === 'out_of_stock') {
      showToast(lang === 'ar' ? 'هذه الدرجة غير متوفرة حالياً' : 'This shade is currently out of stock');
      return;
    }
    setCart((prev) => ({
      ...prev,
      [shade.id]: (prev[shade.id] || 0) + 1,
    }));
    trackMetaPixelEvent('AddToCart', {
      content_name: shade.nameEn,
      content_ids: [shade.code],
      value: 5.0,
      currency: 'JOD',
    });
    const name = lang === 'en' ? shade.nameEn : shade.nameAr;
    showToast(lang === 'ar' ? `أضيفت ${name} إلى السلة` : `Added ${name} to cart`);
  };

  // وصلة المساعد الذكي: المساعد بيبعت id، ونحوله لـ Shade كامل
  const handleAIAddToCart = (shadeId: number) => {
    const shade = shades.find((s) => s.id === shadeId);
    if (shade) handleAddToCart(shade);
  };

  const handleUpdateQty = (shadeId: number, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[shadeId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        delete next[shadeId];
      } else {
        next[shadeId] = updated;
      }
      return next;
    });
  };

  const handleRemoveItem = (shadeId: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[shadeId];
      return next;
    });
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
        const s = shades[id];
        if (s) {
          trackMetaPixelEvent('AddToWishlist', {
            content_name: s.nameEn,
            content_ids: [s.code],
            value: 5.0,
            currency: 'JOD',
          });
        }
      }
      return next;
    });
  };

  const handleAddAllFavoritesToCart = () => {
    const favIds = Object.keys(favorites).map(Number);
    if (favIds.length === 0) return;
    setCart((prev) => {
      const next = { ...prev };
      favIds.forEach((id) => {
        if (shades[id] && shades[id].badge !== 'out_of_stock') {
          next[id] = (next[id] || 0) + 1;
        }
      });
      return next;
    });
    showToast(lang === 'ar' ? 'تمت إضافة جميع الدرجات المفضلة للسلة' : 'All favorite shades added to cart');
  };

  const handleShareFavoritesWhatsApp = () => {
    const favIds = Object.keys(favorites).map(Number);
    if (favIds.length === 0) return;
    const lines = favIds.map((id) => {
      const s = shades[id];
      const name = lang === 'en' ? s.nameEn : s.nameAr;
      return `• ${s.code} ${name}`;
    });
    const message = `${lang === 'ar' ? 'قائمتي المفضلة من صبغة Space Color Infinity:' : 'My favorite shades from Space Color Infinity:'}\n${lines.join('\n')}\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleToggleCompare = (id: number) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const displayedShades = useMemo(() => {
    return filterAndSortShades(
      shades,
      searchQuery,
      selectedCategory,
      sortBy,
      favorites,
      lang
    );
  }, [shades, searchQuery, selectedCategory, sortBy, favorites, lang]);

  const orderCalc = useMemo(() => {
    return calculateOrder(cart, customer.city);
  }, [cart, customer.city]);

  if (isAdminOpen) {
    return (
      <AdminDashboard
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onCloseAdmin={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
        onShadesUpdated={(updated) => setShades(updated)}
        onSettingsUpdated={(updatedSettings) => setStoreSettings(updatedSettings)}
      />
    );
  }

  const announcementText = lang === 'en'
    ? storeSettings.announcementNoticeEn || t.topBarNotice
    : storeSettings.announcementNoticeAr || t.topBarNotice;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col selection:bg-[var(--gold)]/30 selection:text-[var(--fg)]">
      <div className="bg-[var(--gold)] text-[var(--on-gold)] text-xs sm:text- font-semibold py-2 px-4 text-center tracking-wide">
        {announcementText}
      </div>

      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        cartCount={orderCalc.totalItems}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={Object.keys(favorites).length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <Hero lang={lang} />

      <ShopSection
        shades={displayedShades}
        lang={lang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        comparedIds={comparedIds}
        onToggleCompare={handleToggleCompare}
        onSelectShade={(s) => setActiveShade(s)}
        onAddToCart={handleAddToCart}
        onAddAllFavoritesToCart={handleAddAllFavoritesToCart}
        onShareFavoritesWhatsApp={handleShareFavoritesWhatsApp}
      />

      <CatalogSection lang={lang} />
      <BundlesSection lang={lang} />
      <PerksCareSection lang={lang} />
      <IngredientsSection lang={lang} />
      <CareTipsSection lang={lang} />
      <HowToUseSection lang={lang} />
      <ReviewsSection lang={lang} />
      <FaqSection lang={lang} />
      <InstagramSection lang={lang} />

      <Footer lang={lang} onOpenAdmin={() => setIsAdminOpen(true)} />

      <ShadeModal
        shade={activeShade}
        onClose={() => setActiveShade(null)}
        lang={lang}
        onAddToCart={handleAddToCart}
        isFavorite={activeShade ? !!favorites[activeShade.id] : false}
        onToggleFavorite={handleToggleFavorite}
        isCompared={activeShade ? comparedIds.includes(activeShade.id) : false}
        onToggleCompare={handleToggleCompare}
        onSelectShade={(s) => setActiveShade(s)}
        onShowToast={showToast}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedIds={comparedIds}
        lang={lang}
        onAddToCart={handleAddToCart}
      />

      <CompareTray
        comparedIds={comparedIds}
        onOpenModal={() => setIsCompareOpen(true)}
        onClear={() => setComparedIds([])}
        lang={lang}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        customer={customer}
        onCustomerChange={(fields) => setCustomer((prev) => ({ ...prev, ...fields }))}
        lang={lang}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={favorites}
        shades={shades}
        onRemoveFromWishlist={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onAddAllToCart={handleAddAllFavoritesToCart}
        lang={lang}
      />

      <MobileBottomBar
        totalItems={orderCalc.totalItems}
        grandTotal={orderCalc.grandTotal}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
      />

      <FloatingWhatsApp lang={lang} />

      {/* مساعد الذكاء الاصطناعي - اختيار الصبغة */}
      <ShadeAIAdvisor lang={lang} onAddToCart={handleAIAddToCart} />

      {toastMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 bg-[var(--gold)] text-[var(--on-gold)] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}