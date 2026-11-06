import React, { useState, useMemo } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  ExternalLink,
  MessageCircle,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Save,
  Globe,
  Sun,
  Moon,
  Activity,
  Radio,
  Film,
} from 'lucide-react';
import { Shade, CATEGORIES, isLightColor } from '../../utils/storeLogic';
import {
  AdminOrder,
  StoreSettings,
  getStoredShades,
  saveStoredShades,
  getStoredOrders,
  saveStoredOrders,
  getStoredSettings,
  saveStoredSettings,
} from '../../utils/adminStorage';
import { getStoredVisits, TrafficVisit } from '../../utils/analyticsTracker';
import { TrafficAnalyticsView } from './TrafficAnalyticsView';
import { VideoItem, getStoredVideos, saveStoredVideos } from '../../utils/videoData';
import { AdminVideoManager } from './AdminVideoManager';
import { Language, Theme } from '../../utils/translations';

interface AdminDashboardProps {
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onCloseAdmin: () => void;
  onShadesUpdated: (shades: Shade[]) => void;
  onSettingsUpdated: (settings: StoreSettings) => void;
  videos?: VideoItem[];
  onVideosUpdated?: (videos: VideoItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  onCloseAdmin,
  onShadesUpdated,
  onSettingsUpdated,
  videos: propsVideos,
  onVideosUpdated: propsOnVideosUpdated,
}) => {
  // Passcode gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sci-admin-auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'shades' | 'orders' | 'videos' | 'analytics' | 'settings'>('overview');

  // Videos state
  const [videos, setVideos] = useState<VideoItem[]>(() => propsVideos || getStoredVideos());

  // Traffic / Visits state
  const [visits, setVisits] = useState<TrafficVisit[]>(() => getStoredVisits());

  // Shades management state
  const [shades, setShades] = useState<Shade[]>(() => getStoredShades());
  const [shadeSearch, setShadeSearch] = useState('');
  const [editingShade, setEditingShade] = useState<Shade | null>(null);

  // Orders management state
  const [orders, setOrders] = useState<AdminOrder[]>(() => getStoredOrders());
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>(() => getStoredSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isEn = lang === 'en';
  const currency = isEn ? 'JOD' : 'د.أ';

  // Passcode Verification (default space2026)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
if (passcode.trim() === '85186') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sci-admin-auth', 'true');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sci-admin-auth');
  };

  // Shade stock toggle
  const handleToggleStock = (shadeId: number) => {
    const updated = shades.map((s) => {
      if (s.id === shadeId) {
        return {
          ...s,
          badge: (s.badge === 'out_of_stock' ? undefined : 'out_of_stock') as Shade['badge'],
        };
      }
      return s;
    });
    setShades(updated);
    saveStoredShades(updated);
    onShadesUpdated(updated);
  };

  // Shade badge toggle (Best seller / New / None)
  const handleBadgeChange = (shadeId: number, badge: Shade['badge']) => {
    const updated = shades.map((s) => {
      if (s.id === shadeId) {
        return { ...s, badge };
      }
      return s;
    });
    setShades(updated);
    saveStoredShades(updated);
    onShadesUpdated(updated);
  };

  // Save edited shade
  const handleSaveShade = (updatedShade: Shade) => {
    const updated = shades.map((s) => (s.id === updatedShade.id ? updatedShade : s));
    setShades(updated);
    saveStoredShades(updated);
    onShadesUpdated(updated);
    setEditingShade(null);
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    onSettingsUpdated(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  // Add Test Demo Order
  const handleAddTestOrder = () => {
    const sampleNames = ['ليان ناصر', 'زين حداد', 'نور القاسم', 'روان المصري'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const newOrder: AdminOrder = {
      id: `ORD-${1080 + orders.length + 1}`,
      createdAt: new Date().toISOString(),
      customerName: randomName,
      customerPhone: '079' + Math.floor(1000000 + Math.random() * 9000000),
      customerCity: 'عمّان',
      customerAddress: 'عبدون، قرب السفارة البريطانية',
      customerNotes: 'طلب تم إنشاؤه عبر لوحة الإدارة',
      items: [
        { shadeId: 3, code: '04', nameAr: 'بني غامق', nameEn: 'Dark Brown', qty: 2, price: 5.0 },
      ],
      subtotal: 10.0,
      discountPct: 10,
      discountAmount: 1.0,
      shippingFee: 2.0,
      grandTotal: 11.0,
      status: 'new',
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Export Orders as CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'City', 'Address', 'Total (JOD)', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerPhone,
      o.customerCity,
      `"${o.customerAddress}"`,
      o.grandTotal.toFixed(2),
      o.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Space_Infinity_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const outOfStockCount = shades.filter((s) => s.badge === 'out_of_stock').length;

    // Top shades count
    const shadeCountMap: Record<number, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        shadeCountMap[item.shadeId] = (shadeCountMap[item.shadeId] || 0) + item.qty;
      });
    });

    const topShades = Object.entries(shadeCountMap)
      .map(([idStr, qty]) => ({
        shade: shades[Number(idStr)],
        qty,
      }))
      .filter((item): item is { shade: Shade; qty: number } => Boolean(item.shade))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);

    return { totalSales, totalOrders, avgOrderValue, outOfStockCount, topShades };
  }, [orders, shades]);

  // Filtered shades
  const filteredShades = useMemo(() => {
    if (!shadeSearch.trim()) return shades;
    const q = shadeSearch.toLowerCase().trim();
    return shades.filter(
      (s) =>
        s.code.includes(q) ||
        s.nameAr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q)
    );
  }, [shades, shadeSearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim();
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.includes(q);
        const matchId = o.id.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchId) return false;
      }
      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  // If not logged in, render Passcode gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mx-auto mb-4 border border-[var(--gold)]/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-latin-display text-2xl tracking-[0.2em] font-medium text-[var(--fg)]">
              SPACE INFINITY
            </h1>
            <p className="text-xs text-[var(--gold)] tracking-widest uppercase mt-1">
              {isEn ? 'Admin Control Center' : 'لوحة الإدارة والتحكم'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--mute)] mb-1.5">
                {isEn ? 'Admin Passcode' : 'كلمة مرور لوحة الإدارة'}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder={isEn ? 'Enter passcode' : 'أدخلي كلمة المرور'}
                  className="w-full h-11 ps-4 pe-11 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--fg)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--gold)]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--mute)] hover:text-[var(--fg)]"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passcodeError && (
                <p className="text-xs text-red-500 mt-1.5">
                  {isEn ? 'Incorrect passcode.' : 'كلمة المرور غير صحيحة.'}
                </p>
              )}
            </div>

         

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] font-semibold text-sm hover:bg-[var(--gold-hover)] transition-colors"
            >
              {isEn ? 'Unlock Dashboard' : 'تسجيل الدخول للوحة التحكم'}
            </button>

            <button
              type="button"
              onClick={onCloseAdmin}
              className="w-full h-10 text-xs text-[var(--mute)] hover:text-[var(--fg)] transition-colors flex items-center justify-center gap-1.5"
            >
              {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isEn ? 'Back to Storefront' : 'العودة للمتجر'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg2)]/95 backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand + Admin Tag */}
            <div className="flex items-center gap-3">
              <a
                href="#top"
                dir="ltr"
                className="font-latin-display text-lg tracking-[0.25em] text-[var(--fg)] font-semibold"
              >
                <span>SPACE</span> <span className="text-[var(--gold)]">INFINITY</span>
              </a>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--gold)] text-[var(--on-gold)] uppercase tracking-wider">
                ADMIN
              </span>
            </div>

            {/* Admin Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[var(--bg)] p-1 rounded-xl border border-[var(--line)]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isEn ? 'Overview' : 'نظرة عامة'}</span>
              </button>

              <button
                onClick={() => setActiveTab('shades')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'shades'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{isEn ? 'Inventory' : 'المخزون والدرجات'}</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isEn ? 'Orders' : 'سجل الطلبات'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isEn ? 'Videos' : 'الفيديوهات'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                  {videos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isEn ? 'Traffic & Pixel' : 'مصادر الزيارات و Meta'}</span>
                {visits.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                    {visits.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[var(--gold)] text-[var(--on-gold)]'
                    : 'text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isEn ? 'Settings' : 'إعدادات المتجر'}</span>
              </button>
            </nav>

            {/* Quick Actions (Switch to Store, Lang, Theme, Logout) */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)] flex items-center justify-center transition-colors"
                title="Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--gold)]" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleLang}
                className="h-9 px-2.5 rounded-lg border border-[var(--line)] text-xs font-semibold text-[var(--mute)] hover:text-[var(--fg)] flex items-center gap-1 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isEn ? 'عربي' : 'EN'}</span>
              </button>

              <button
                onClick={onCloseAdmin}
                className="h-9 px-3 rounded-lg border border-[var(--gold)] text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)] inline-flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEn ? 'View Store' : 'الرجوع للمتجر'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="h-9 px-2.5 rounded-lg border border-[var(--line)] text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                {isEn ? 'Logout' : 'خروج'}
              </button>
            </div>
          </div>

          {/* Mobile Tab strip */}
          <div className="md:hidden flex items-center justify-around py-2 border-t border-[var(--line)] text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`p-2 rounded font-medium ${activeTab === 'overview' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Overview' : 'نظرة عامة'}
            </button>
            <button
              onClick={() => setActiveTab('shades')}
              className={`p-2 rounded font-medium ${activeTab === 'shades' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Shades' : 'الدرجات'}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`p-2 rounded font-medium ${activeTab === 'orders' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Orders' : 'الطلبات'}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`p-2 rounded font-medium ${activeTab === 'videos' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Videos' : 'فيديوهات'}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-2 rounded font-medium ${activeTab === 'analytics' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Traffic' : 'الزيارات'}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded font-medium ${activeTab === 'settings' ? 'text-[var(--gold)] font-bold' : 'text-[var(--mute)]'}`}
            >
              {isEn ? 'Settings' : 'الإعدادات'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
                <div className="text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Total Revenue' : 'إجمالي المبيعات'}
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--gold)]">
                  {metrics.totalSales.toFixed(2)} {currency}
                </div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Active catalog orders' : 'محدث تلقائياً'}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
                <div className="text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Total Orders' : 'إجمالي الطلبات'}
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)]">
                  {metrics.totalOrders}
                </div>
                <div className="text-[11px] text-[var(--mute)] mt-2">
                  {orders.filter((o) => o.status === 'new').length} {isEn ? 'new orders pending' : 'طلبات جديدة بالانتظار'}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
                <div className="text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Avg Order Value' : 'متوسط سلة الشراء'}
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)]">
                  {metrics.avgOrderValue.toFixed(2)} {currency}
                </div>
                <div className="text-[11px] text-[var(--mute)] mt-2">
                  {isEn ? 'Bundle tier incentives' : 'مع خصومات الباقات'}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
                <div className="text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Out of Stock' : 'درجات غير متوفرة'}
                </div>
                <div className={`text-2xl sm:text-3xl font-bold font-mono ${metrics.outOfStockCount > 0 ? 'text-amber-500' : 'text-emerald-400'}`}>
                  {metrics.outOfStockCount} / 25
                </div>
                <div className="text-[11px] text-[var(--mute)] mt-2">
                  {metrics.outOfStockCount > 0
                    ? (isEn ? 'Needs replenishment' : 'بحاجة لتجديد الكمية')
                    : (isEn ? 'All shades in stock' : 'جميع الدرجات متوفرة')}
                </div>
              </div>
            </div>

            {/* Quick Row: Top Selling Shades & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Top Shades */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl text-[var(--fg)] mb-4">
                    {isEn ? 'Top Selling Shades' : 'الدرجات الأكثر طلباً'}
                  </h3>
                  <div className="space-y-4">
                    {metrics.topShades.map(({ shade, qty }) => (
                      <div key={shade.id} className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg border border-white/20 shrink-0 flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: shade.hex,
                            color: isLightColor(shade.hex) ? '#14100F' : '#FFF',
                          }}
                        >
                          {shade.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[var(--fg)] truncate">
                            {isEn ? shade.nameEn : shade.nameAr}
                          </div>
                          <div className="text-[11px] text-[var(--mute)]">
                            {qty} {isEn ? 'boxes ordered' : 'علب مباعة'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('shades')}
                  className="mt-6 w-full h-10 rounded-lg border border-[var(--line)] text-xs text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                >
                  {isEn ? 'Manage All 25 Shades' : 'إدارة جميع الـ ٢٥ درجة'}
                </button>
              </div>

              {/* Recent Orders Overview */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-luxury text-xl text-[var(--fg)]">
                    {isEn ? 'Latest WhatsApp Orders' : 'أحدث الطلبات الواردة'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[var(--gold)] hover:underline"
                  >
                    {isEn ? 'View all' : 'عرض الكل'} ({orders.length})
                  </button>
                </div>

                <div className="divide-y divide-[var(--line)]">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--gold)]">
                            {order.id}
                          </span>
                          <span className="text-xs font-semibold text-[var(--fg)]">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-[var(--mute)]">
                            ({order.customerCity})
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--mute)] mt-0.5">
                          {order.items.map((it: { code: string; qty: number }) => `${it.code} × ${it.qty}`).join(' · ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[var(--fg)]">
                          {order.grandTotal.toFixed(2)} {currency}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            order.status === 'new'
                              ? 'bg-blue-500/20 text-blue-400'
                              : order.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SHADES INVENTORY ===================== */}
        {activeTab === 'shades' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
                  {isEn ? 'Shades & Stock Inventory' : 'إدارة درجات الصبغة والمخزون'}
                </h2>
                <p className="text-xs text-[var(--mute)]">
                  {isEn
                    ? 'Toggle stock availability or edit shade pricing and details live.'
                    : 'تحكّمي بتوفر الدرجة (متوفر / نفذت الكمية) أو تعديل الأسعار والمسميات مباشرة.'}
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-[var(--mute)]" />
                <input
                  type="text"
                  value={shadeSearch}
                  onChange={(e) => setShadeSearch(e.target.value)}
                  placeholder={isEn ? 'Search shades...' : 'بحث في الدرجات...'}
                  className="w-full h-10 ps-9 pe-4 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            {/* Shades Table */}
            <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg2)]">
              <table className="w-full text-start text-xs">
                <thead className="bg-[var(--bg)] border-b border-[var(--line)] text-[var(--mute)] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5 text-start">{isEn ? 'Code' : 'الرقم'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'Color Swatch' : 'اللون'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'Arabic Name' : 'الاسم بالعربية'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'English Name' : 'الاسم بالإنجليزية'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'Category' : 'الفئة'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'Stock Status' : 'حالة المخزون'}</th>
                    <th className="p-3.5 text-start">{isEn ? 'Badge' : 'الشارة'}</th>
                    <th className="p-3.5 text-center">{isEn ? 'Actions' : 'إجراءات'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {filteredShades.map((shade: Shade) => {
                    const category = CATEGORIES.find((c) => c.id === shade.categoryId);
                    const isOut = shade.badge === 'out_of_stock';

                    return (
                      <tr key={shade.id} className="hover:bg-[var(--bg)]/40 transition-colors">
                        {/* Code */}
                        <td className="p-3.5 font-mono font-bold text-[var(--gold)]">
                          {shade.code}
                        </td>

                        {/* Swatch */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-md border border-white/20 shadow-sm shrink-0"
                              style={{ backgroundColor: shade.hex }}
                            />
                            <span className="font-mono text-[11px] text-[var(--mute)]">
                              {shade.hex}
                            </span>
                          </div>
                        </td>

                        {/* Arabic Name */}
                        <td className="p-3.5 font-medium text-[var(--fg)]">
                          {shade.nameAr}
                        </td>

                        {/* English Name */}
                        <td className="p-3.5 text-[var(--mute)]">
                          {shade.nameEn}
                        </td>

                        {/* Category */}
                        <td className="p-3.5 text-[var(--mute)]">
                          {isEn ? category?.nameEn : category?.nameAr}
                        </td>

                        {/* Stock Switch */}
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleStock(shade.id)}
                            className={`h-7 px-3 rounded-full text-[10px] font-bold tracking-wide transition-colors ${
                              isOut
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isOut ? (isEn ? 'Out of stock' : 'غير متوفرة') : (isEn ? 'In stock' : 'متوفرة')}
                          </button>
                        </td>

                        {/* Badge Selector */}
                        <td className="p-3.5">
                          <select
                            value={shade.badge || ''}
                            onChange={(e) =>
                              handleBadgeChange(
                                shade.id,
                                (e.target.value || undefined) as Shade['badge']
                              )
                            }
                            className="h-7 px-2 rounded bg-[var(--bg)] border border-[var(--line)] text-[11px] text-[var(--fg)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
                          >
                            <option value="">{isEn ? 'None' : 'بدون شارة'}</option>
                            <option value="best_seller">{isEn ? 'Best Seller' : 'الأكثر مبيعاً'}</option>
                            <option value="new">{isEn ? 'New' : 'جديد'}</option>
                            <option value="out_of_stock">{isEn ? 'Sold Out' : 'نفذت الكمية'}</option>
                          </select>
                        </td>

                        {/* Edit Button */}
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setEditingShade({ ...shade })}
                            className="h-7 px-3 rounded border border-[var(--line)] text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                          >
                            {isEn ? 'Edit' : 'تعديل'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ORDERS LOG ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
                  {isEn ? 'Customer Orders Log' : 'سجل طلبات الواتساب'}
                </h2>
                <p className="text-xs text-[var(--mute)]">
                  {isEn
                    ? 'Track WhatsApp customer inquiries, update statuses, or export reports.'
                    : 'متابعة الطلبات الواردة، تحديث حالتها، والتواصل المباشر مع الزبونات.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddTestOrder}
                  className="h-9 px-3 rounded-lg border border-[var(--line)] text-xs text-[var(--fg)] hover:border-[var(--gold)] flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{isEn ? 'Add Test Order' : 'إضافة طلب تجريبي'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="h-9 px-3 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[var(--gold-hover)] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Export CSV' : 'تصدير إكسل'}</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-[var(--mute)]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder={isEn ? 'Search by name, phone, order ID...' : 'بحث بالاسم، رقم الهاتف، أو رقم الطلب...'}
                  className="w-full h-10 ps-9 pe-4 rounded-lg bg-[var(--bg2)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`h-9 px-3 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${
                      orderFilter === st
                        ? 'bg-[var(--gold)] text-[var(--on-gold)] font-bold'
                        : 'bg-[var(--bg2)] border border-[var(--line)] text-[var(--mute)] hover:text-[var(--fg)]'
                    }`}
                  >
                    {st === 'all'
                      ? isEn ? 'All' : 'الكل'
                      : st === 'new'
                      ? isEn ? 'New' : 'جديد'
                      : st === 'processing'
                      ? isEn ? 'Processing' : 'قيد التجهيز'
                      : st === 'shipped'
                      ? isEn ? 'Shipped' : 'تم الشحن'
                      : st === 'delivered'
                      ? isEn ? 'Delivered' : 'تم التسليم'
                      : isEn ? 'Cancelled' : 'ملغي'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-[var(--bg2)] border border-[var(--line)] text-[var(--mute)] text-xs">
                  {isEn ? 'No orders match your filter criteria.' : 'لا توجد طلبات مطابقة للبحث.'}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const customerCleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                  const waCustomerLink = `https://wa.me/${customerCleanPhone.startsWith('962') ? customerCleanPhone : '962' + customerCleanPhone.replace(/^0+/, '')}?text=${encodeURIComponent(
                    isEn
                      ? `Hello ${order.customerName}, regarding your Space Color Infinity order (${order.id})...`
                      : `مرحباً ${order.customerName}، بخصوص طلبك من Space Color Infinity رقم (${order.id})...`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[var(--gold)]">
                            {order.id}
                          </span>
                          <span className="text-sm font-semibold text-[var(--fg)]">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-[var(--mute)] font-mono">
                            {order.customerPhone}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--line)] text-[var(--mute)]">
                            {order.customerCity}
                          </span>
                        </div>

                        <div className="text-xs text-[var(--mute)]">
                          {order.customerAddress}
                        </div>

                        {order.customerNotes && (
                          <div className="text-[11px] text-[var(--gold)] italic">
                            {isEn ? 'Notes: ' : 'ملاحظات: '} {order.customerNotes}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {order.items.map((it: { shadeId: number; code: string; nameAr: string; nameEn: string; qty: number }) => (
                            <span
                              key={it.shadeId}
                              className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[11px] font-mono"
                            >
                              {it.code} ({isEn ? it.nameEn : it.nameAr}) × {it.qty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Totals & Status Selector */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--line)]">
                        <div className="text-end">
                          <div className="font-mono text-lg font-bold text-[var(--gold)]">
                            {order.grandTotal.toFixed(2)} {currency}
                          </div>
                          <div className="text-[10px] text-[var(--mute)]">
                            {new Date(order.createdAt).toLocaleString(isEn ? 'en-US' : 'ar-JO')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as AdminOrder['status'])
                            }
                            className="h-8 px-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)] cursor-pointer"
                          >
                            <option value="new">{isEn ? 'New' : 'جديد'}</option>
                            <option value="processing">{isEn ? 'Processing' : 'قيد التجهيز'}</option>
                            <option value="shipped">{isEn ? 'Shipped' : 'تم الشحن'}</option>
                            <option value="delivered">{isEn ? 'Delivered' : 'تم التسليم'}</option>
                            <option value="cancelled">{isEn ? 'Cancelled' : 'ملغي'}</option>
                          </select>

                          <a
                            href={waCustomerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isEn ? 'WhatsApp' : 'واتساب'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB: VIDEOS MANAGEMENT ===================== */}
        {activeTab === 'videos' && (
          <AdminVideoManager
            videos={videos}
            onVideosUpdated={(updated) => {
              setVideos(updated);
              if (propsOnVideosUpdated) propsOnVideosUpdated(updated);
            }}
            lang={lang}
          />
        )}

        {/* ===================== TAB 4: TRAFFIC & META PIXEL ===================== */}
        {activeTab === 'analytics' && (
          <TrafficAnalyticsView
            visits={visits}
            onVisitsUpdated={(updated) => setVisits(updated)}
            settings={settings}
            onNavigateToSettings={() => setActiveTab('settings')}
            lang={lang}
          />
        )}

        {/* ===================== TAB 5: SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
                {isEn ? 'Store Business Rules & Tracking' : 'إعدادات المتجر ورسوم التوصيل وتتبع Meta'}
              </h2>
              <p className="text-xs text-[var(--mute)]">
                {isEn
                  ? 'Configure WhatsApp order number, free delivery limits, bundle discounts, and Meta Pixel ID.'
                  : 'تعديل رقم واتساب المعتمد، أسعار التوصيل، حد التوصيل المجاني، ومعرف كود Meta Pixel.'}
              </p>
            </div>

            {/* Meta Pixel (Facebook Pixel) Integration */}
            <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--gold)]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[var(--fg)] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--gold)]" />
                    <span>{isEn ? 'Meta (Facebook) Pixel Integration' : 'كود وتتبع إعلانات Meta Pixel (فيسبوك وإنستغرام)'}</span>
                  </h3>
                  <p className="text-xs text-[var(--mute)] mt-0.5">
                    {isEn
                      ? 'Automatically track PageView, ViewContent, AddToCart, and InitiateCheckout for your Meta Ads.'
                      : 'تتبع تلقائي للزيارات واستعراض الدرجات وإضافات السلة ونقرات الشراء عبر واتساب.'}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                    settings.metaPixelId && settings.metaPixelId.trim().length > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  }`}
                >
                  {settings.metaPixelId && settings.metaPixelId.trim().length > 0
                    ? isEn ? 'Configured' : 'مفعل جاهز'
                    : isEn ? 'Not Set' : 'غير مدخل'}
                </span>
              </div>

              <div>
                <label className="block text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Meta Pixel ID (Dataset ID)' : 'معرف البيكسل (Meta Pixel ID / Dataset ID)'}
                </label>
                <input
                  type="text"
                  value={settings.metaPixelId || ''}
                  onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value.trim() })}
                  placeholder="e.g. 123456789012345"
                  className="w-full h-11 px-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                  dir="ltr"
                />
                <p className="text-[11px] text-[var(--mute)] mt-1">
                  {isEn
                    ? 'Enter your 15-16 digit Meta Pixel ID from Meta Events Manager. Leaving this blank disables Pixel tracking.'
                    : 'أدخل رقم المعرف المكون من 15-16 رقم من مدير أحداث Meta. ترك الحقل فارغاً يوقف التتبع.'}
                </p>
              </div>

              {/* Supported events preview */}
              <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <span className="text-[11px] font-semibold text-[var(--gold)] block">
                  {isEn ? 'Events automatically tracked by this app:' : 'الأحداث المتتبعة تلقائياً في المتجر:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[var(--mute)]">
                  <div>• <code className="text-[var(--fg)] font-mono">PageView</code>: {isEn ? 'Site visits' : 'زيارة الموقع'}</div>
                  <div>• <code className="text-[var(--fg)] font-mono">ViewContent</code>: {isEn ? 'Viewing shades' : 'استعراض درجات الصبغة'}</div>
                  <div>• <code className="text-[var(--fg)] font-mono">AddToCart</code>: {isEn ? 'Adding to cart' : 'إضافة منتج للسلة'}</div>
                  <div>• <code className="text-[var(--fg)] font-mono">AddToWishlist</code>: {isEn ? 'Adding to wishlist' : 'إضافة للأمنيات'}</div>
                  <div className="sm:col-span-2">• <code className="text-[var(--fg)] font-mono">InitiateCheckout</code>: {isEn ? 'WhatsApp order click (Value & JOD currency)' : 'طلب عبر واتساب مع القيمة وقائمة الدرجات'}</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
              <h3 className="font-semibold text-sm text-[var(--fg)]">
                {isEn ? 'WhatsApp Order Number' : 'رقم واتساب استقبال الطلبات'}
              </h3>
              <div>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="962700000000"
                  className="w-full h-11 px-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                  dir="ltr"
                  required
                />
                <p className="text-[11px] text-[var(--mute)] mt-1">
                  {isEn
                    ? 'Enter country code without + or 00 (e.g. 962791234567)'
                    : 'يرجى إدخال الرقم مع الرمز الدولي بدون علامة + (مثال: 962791234567)'}
                </p>
              </div>
            </div>

            {/* Delivery Fees & Free threshold */}
            <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
              <h3 className="font-semibold text-sm text-[var(--fg)]">
                {isEn ? 'Shipping Rates by Governorate' : 'رسوم التوصيل وحد الشحن المجاني'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--mute)] mb-1">
                    {isEn ? 'Free Delivery Minimum (JOD)' : 'حد التوصيل المجاني (د.أ)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) || 0 })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {(Object.entries(settings.shippingRates) as [string, number][]).map(([city, rate]) => (
                  <div key={city}>
                    <label className="block text-xs text-[var(--mute)] mb-1">
                      {isEn ? `Rate for ${city} (JOD)` : `رسوم ${city} (د.أ)`}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={rate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shippingRates: {
                            ...settings.shippingRates,
                            [city]: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Announcement Notice */}
            <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
              <h3 className="font-semibold text-sm text-[var(--fg)]">
                {isEn ? 'Top Announcement Bar Text' : 'نص الشريط الإعلاني العلوي'}
              </h3>

              <div>
                <label className="block text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'Arabic Notice' : 'الإعلان بالعربية'}
                </label>
                <input
                  type="text"
                  value={settings.announcementNoticeAr}
                  onChange={(e) => setSettings({ ...settings, announcementNoticeAr: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--mute)] mb-1">
                  {isEn ? 'English Notice' : 'الإعلان بالإنجليزية'}
                </label>
                <input
                  type="text"
                  value={settings.announcementNoticeEn}
                  onChange={(e) => setSettings({ ...settings, announcementNoticeEn: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="h-11 px-8 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] font-bold text-sm hover:bg-[var(--gold-hover)] inline-flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isEn ? 'Save Store Settings' : 'حفظ الإعدادات'}</span>
              </button>

              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{isEn ? 'Settings updated successfully!' : 'تم حفظ الإعدادات بنجاح!'}</span>
                </span>
              )}
            </div>
          </form>
        )}
      </main>

      {/* Edit Shade Modal */}
      {editingShade && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setEditingShade(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] shadow-2xl z-10 space-y-4">
            <h3 className="font-serif-luxury text-xl text-[var(--fg)]">
              {isEn ? `Edit Shade ${editingShade.code}` : `تعديل الدرجة ${editingShade.code}`}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--mute)] mb-1">
                  {isEn ? 'Arabic Name' : 'الاسم بالعربية'}
                </label>
                <input
                  type="text"
                  value={editingShade.nameAr}
                  onChange={(e) => setEditingShade({ ...editingShade, nameAr: e.target.value })}
                  className="w-full h-9 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)]"
                />
              </div>

              <div>
                <label className="block text-[var(--mute)] mb-1">
                  {isEn ? 'English Name' : 'الاسم بالإنجليزية'}
                </label>
                <input
                  type="text"
                  value={editingShade.nameEn}
                  onChange={(e) => setEditingShade({ ...editingShade, nameEn: e.target.value })}
                  className="w-full h-9 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)]"
                />
              </div>

              <div>
                <label className="block text-[var(--mute)] mb-1">
                  {isEn ? 'Hex Color' : 'كود اللون'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingShade.hex}
                    onChange={(e) => setEditingShade({ ...editingShade, hex: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-[var(--line)] p-0"
                  />
                  <input
                    type="text"
                    value={editingShade.hex}
                    onChange={(e) => setEditingShade({ ...editingShade, hex: e.target.value })}
                    className="flex-1 h-9 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--mute)] mb-1">
                  {isEn ? 'Arabic Description' : 'الوصف بالعربية'}
                </label>
                <textarea
                  value={editingShade.descAr || ''}
                  onChange={(e) => setEditingShade({ ...editingShade, descAr: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] resize-none"
                />
              </div>

              <div>
                <label className="block text-[var(--mute)] mb-1">
                  {isEn ? 'English Description' : 'الوصف بالإنجليزية'}
                </label>
                <textarea
                  value={editingShade.descEn || ''}
                  onChange={(e) => setEditingShade({ ...editingShade, descEn: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setEditingShade(null)}
                className="h-9 px-4 rounded border border-[var(--line)] text-xs text-[var(--mute)] hover:text-[var(--fg)]"
              >
                {isEn ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="button"
                onClick={() => handleSaveShade(editingShade)}
                className="h-9 px-4 rounded bg-[var(--gold)] text-[var(--on-gold)] text-xs font-semibold hover:bg-[var(--gold-hover)]"
              >
                {isEn ? 'Save Changes' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
