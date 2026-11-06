import React, { useState, useMemo } from 'react';
import {
  Share2,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Target,
  Sparkles,
  Info,
  Radio,
} from 'lucide-react';
import { TrafficVisit, trackMetaPixelEvent } from '../../utils/analyticsTracker';
import { StoreSettings } from '../../utils/adminStorage';
import { Language } from '../../utils/translations';

interface TrafficAnalyticsViewProps {
  visits: TrafficVisit[];
  onVisitsUpdated: (updated: TrafficVisit[]) => void;
  settings: StoreSettings;
  onNavigateToSettings: () => void;
  lang: Language;
}

export const TrafficAnalyticsView: React.FC<TrafficAnalyticsViewProps> = ({
  visits,
  onVisitsUpdated,
  settings,
  onNavigateToSettings,
  lang,
}) => {
  const isEn = lang === 'en';
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [testEventSent, setTestEventSent] = useState(false);
  const [campaignNameInput, setCampaignNameInput] = useState('summer_promo_2026');
  const [campaignPlatformInput, setCampaignPlatformInput] = useState<'instagram' | 'facebook' | 'tiktok'>('instagram');

  const metaPixelId = (settings.metaPixelId || '').trim();
  const isPixelActive = metaPixelId.length > 0;

  // Source categorization & metrics
  const stats = useMemo(() => {
    const total = visits.length;
    const bySource: Record<TrafficVisit['source'], number> = {
      instagram: 0,
      facebook: 0,
      tiktok: 0,
      google: 0,
      whatsapp: 0,
      direct: 0,
      other: 0,
    };
    const byDevice: Record<TrafficVisit['device'], number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };

    visits.forEach((v) => {
      if (bySource[v.source] !== undefined) {
        bySource[v.source]++;
      } else {
        bySource.other++;
      }
      if (byDevice[v.device] !== undefined) {
        byDevice[v.device]++;
      }
    });

    const metaAdsTotal = bySource.instagram + bySource.facebook;
    const mobilePct = total > 0 ? Math.round((byDevice.mobile / total) * 100) : 0;

    return {
      total,
      bySource,
      byDevice,
      metaAdsTotal,
      mobilePct,
    };
  }, [visits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    if (sourceFilter === 'all') return visits;
    if (sourceFilter === 'meta') {
      return visits.filter((v) => v.source === 'instagram' || v.source === 'facebook');
    }
    return visits.filter((v) => v.source === sourceFilter);
  }, [visits, sourceFilter]);

  // Unique campaigns list
  const campaigns = useMemo(() => {
    const campaignMap: Record<string, { name: string; source: string; medium?: string; count: number }> = {};
    visits.forEach((v) => {
      if (v.campaign) {
        const key = `${v.source}_${v.campaign}`;
        if (!campaignMap[key]) {
          campaignMap[key] = {
            name: v.campaign,
            source: v.source,
            medium: v.medium,
            count: 0,
          };
        }
        campaignMap[key].count++;
      }
    });
    return Object.values(campaignMap).sort((a, b) => b.count - a.count);
  }, [visits]);

  // Generated UTM Link
  const currentBaseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://spacecolorinfinity.jo/';
  const generatedCampaignUrl = `${currentBaseUrl}?utm_source=${campaignPlatformInput}&utm_medium=cpc&utm_campaign=${encodeURIComponent(campaignNameInput.trim() || 'promo')}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(generatedCampaignUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {}
  };

  const handleSendTestEvent = () => {
    trackMetaPixelEvent('ViewContent', {
      content_name: 'Admin Test - Ash Caramel 10',
      content_ids: ['10'],
      value: 5.0,
      currency: 'JOD',
    });
    setTestEventSent(true);
    setTimeout(() => setTestEventSent(false), 2400);
  };

  const handleAddSimulatedVisit = (source: TrafficVisit['source']) => {
    const sourceNames: Record<TrafficVisit['source'], string> = {
      instagram: 'Instagram Ad (Story)',
      facebook: 'Facebook Feed Sponsored',
      tiktok: 'TikTok Bio Referral',
      google: 'Google Search Organic',
      whatsapp: 'WhatsApp Share Link',
      direct: 'Direct Visit',
      other: 'Twitter / External Link',
    };

    const newVisit: TrafficVisit = {
      id: `vis-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      source,
      sourceName: sourceNames[source],
      medium: source === 'instagram' || source === 'facebook' ? 'cpc' : 'social',
      campaign: source === 'instagram' || source === 'facebook' ? 'live_test_promo' : undefined,
      referrer: source === 'instagram' ? 'l.instagram.com' : source === 'facebook' ? 'm.facebook.com' : source === 'tiktok' ? 'tiktok.com' : 'google.com',
      device: 'mobile',
      page: source === 'instagram' ? '#shade-10' : '/',
    };

    const updated = [newVisit, ...visits];
    onVisitsUpdated(updated);
    try {
      localStorage.setItem('sci-traffic-log', JSON.stringify(updated.slice(0, 50)));
    } catch {}
  };

  const handleClearLogs = () => {
    if (window.confirm(isEn ? 'Clear visitor traffic logs?' : 'هل أنت متأكد من مسح سجل الزيارات؟')) {
      onVisitsUpdated([]);
      try {
        localStorage.removeItem('sci-traffic-log');
      } catch {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header + Meta Pixel Status Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-[var(--gold)]" />
            <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
              {isEn ? 'Traffic Sources & Meta Pixel Tracking' : 'مصادر الزيارات وتتبع إعلانات Meta Pixel'}
            </h2>
          </div>
          <p className="text-xs text-[var(--mute)]">
            {isEn
              ? 'Track where your customers arrive from: Instagram Ads, Facebook, TikTok, Google, and WhatsApp referrals.'
              : 'لوحة تتبع متقدمة توضح مصدر كل زائر: إعلانات إنستغرام، فيسبوك، تيك توك، بحث جوجل، وروابط الواتساب.'}
          </p>
        </div>

        {/* Pixel Status Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
              isPixelActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPixelActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {isPixelActive
                ? isEn
                  ? `Meta Pixel Active (${metaPixelId})`
                  : `Meta Pixel مفعل (معرف: ${metaPixelId})`
                : isEn
                ? 'Meta Pixel Not Configured'
                : 'Meta Pixel غير مفعل بعد'}
            </span>
          </div>

          <button
            onClick={onNavigateToSettings}
            className="h-9 px-3.5 rounded-lg border border-[var(--gold)] text-xs text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)] font-medium transition-colors"
          >
            {isEn ? 'Configure Pixel' : 'ضبط المعرف'}
          </button>
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Visits */}
        <div className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
          <div className="text-xs text-[var(--mute)] mb-1">
            {isEn ? 'Total Tracked Visitors' : 'إجمالي الزيارات المسجلة'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)]">
            {stats.total}
          </div>
          <div className="text-[11px] text-[var(--mute)] mt-2 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{isEn ? 'Live session recording' : 'تسجيل حي لكل زائر'}</span>
          </div>
        </div>

        {/* Meta Ads (Instagram + Facebook) */}
        <div className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
          <div className="text-xs text-[var(--mute)] mb-1">
            {isEn ? 'Meta Ads (Instagram + FB)' : 'إعلانات Meta (إنستغرام وفيسبوك)'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--gold)]">
            {stats.metaAdsTotal}
          </div>
          <div className="text-[11px] text-[var(--gold)] mt-2">
            {stats.total > 0 ? Math.round((stats.metaAdsTotal / stats.total) * 100) : 0}%{' '}
            {isEn ? 'of total traffic' : 'من إجمالي حركة الزوار'}
          </div>
        </div>

        {/* TikTok & WhatsApp */}
        <div className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
          <div className="text-xs text-[var(--mute)] mb-1">
            {isEn ? 'TikTok & WhatsApp Shares' : 'تيك توك ومشاركات واتساب'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)]">
            {stats.bySource.tiktok + stats.bySource.whatsapp}
          </div>
          <div className="text-[11px] text-[var(--mute)] mt-2">
            {stats.bySource.tiktok} {isEn ? 'TikTok' : 'تيك توك'} • {stats.bySource.whatsapp}{' '}
            {isEn ? 'WhatsApp' : 'واتساب'}
          </div>
        </div>

        {/* Mobile Visitors Percentage */}
        <div className="p-5 rounded-2xl bg-[var(--bg2)] border border-[var(--line)]">
          <div className="text-xs text-[var(--mute)] mb-1">
            {isEn ? 'Mobile Device Share' : 'نسبة زوار الهواتف المحمولة'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {stats.mobilePct}%
          </div>
          <div className="text-[11px] text-[var(--mute)] mt-2 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{stats.byDevice.mobile} {isEn ? 'mobile visitors' : 'زائر عبر الهاتف'}</span>
          </div>
        </div>
      </div>

      {/* Traffic Sources Visual Breakdown */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-5">
        <h3 className="font-semibold text-sm text-[var(--fg)] flex items-center justify-between">
          <span>{isEn ? 'Traffic Channels & Attribution' : 'توزيع القنوات ومصادر الزيارات'}</span>
          <span className="text-xs text-[var(--mute)] font-normal">
            {isEn ? `${stats.total} visits recorded` : `${stats.total} زيارة مسجلة`}
          </span>
        </h3>

        {/* Progress Bar Stack */}
        <div className="w-full h-4 rounded-full bg-[var(--bg)] overflow-hidden flex border border-[var(--line)]">
          {stats.total > 0 ? (
            <>
              {stats.bySource.instagram > 0 && (
                <div
                  style={{ width: `${(stats.bySource.instagram / stats.total) * 100}%` }}
                  className="bg-pink-600 h-full transition-all"
                  title={`Instagram: ${stats.bySource.instagram}`}
                />
              )}
              {stats.bySource.facebook > 0 && (
                <div
                  style={{ width: `${(stats.bySource.facebook / stats.total) * 100}%` }}
                  className="bg-blue-600 h-full transition-all"
                  title={`Facebook: ${stats.bySource.facebook}`}
                />
              )}
              {stats.bySource.tiktok > 0 && (
                <div
                  style={{ width: `${(stats.bySource.tiktok / stats.total) * 100}%` }}
                  className="bg-teal-500 h-full transition-all"
                  title={`TikTok: ${stats.bySource.tiktok}`}
                />
              )}
              {stats.bySource.google > 0 && (
                <div
                  style={{ width: `${(stats.bySource.google / stats.total) * 100}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Google: ${stats.bySource.google}`}
                />
              )}
              {stats.bySource.whatsapp > 0 && (
                <div
                  style={{ width: `${(stats.bySource.whatsapp / stats.total) * 100}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`WhatsApp: ${stats.bySource.whatsapp}`}
                />
              )}
              {stats.bySource.direct > 0 && (
                <div
                  style={{ width: `${(stats.bySource.direct / stats.total) * 100}%` }}
                  className="bg-neutral-500 h-full transition-all"
                  title={`Direct: ${stats.bySource.direct}`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-neutral-800" />
          )}
        </div>

        {/* Channel Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Instagram */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-pink-500/20">
            <div className="flex items-center gap-1.5 text-xs text-pink-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>{isEn ? 'Instagram' : 'إنستغرام'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.instagram}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.instagram / stats.total) * 100) : 0}%
            </div>
          </div>

          {/* Facebook */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-blue-500/20">
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{isEn ? 'Facebook' : 'فيسبوك'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.facebook}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.facebook / stats.total) * 100) : 0}%
            </div>
          </div>

          {/* TikTok */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-teal-500/20">
            <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>{isEn ? 'TikTok' : 'تيك توك'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.tiktok}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.tiktok / stats.total) * 100) : 0}%
            </div>
          </div>

          {/* Google */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-amber-500/20">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{isEn ? 'Google' : 'بحث جوجل'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.google}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.google / stats.total) * 100) : 0}%
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isEn ? 'WhatsApp' : 'واتساب'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.whatsapp}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.whatsapp / stats.total) * 100) : 0}%
            </div>
          </div>

          {/* Direct */}
          <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span>{isEn ? 'Direct' : 'مباشر'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--fg)]">
              {stats.bySource.direct}
            </div>
            <div className="text-[10px] text-[var(--mute)]">
              {stats.total > 0 ? Math.round((stats.bySource.direct / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Campaign URL Builder Tool */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[var(--gold)]" />
          <h3 className="font-semibold text-sm text-[var(--fg)]">
            {isEn ? 'Meta & Ad Campaign Link Builder (UTM Tracking)' : 'مُنشئ روابط إعلانات إنستغرام وفيسبوك (تتبع تلقائي)'}
          </h3>
        </div>
        <p className="text-xs text-[var(--mute)]">
          {isEn
            ? 'Use this link in your Instagram Ads, Bio link, or Facebook Campaign. When customers click it, the source is automatically recorded in your dashboard and tracked by Meta Pixel.'
            : 'استخدم هذا الرابط المجهز في إعلانات إنستغرام أو البايو أو حملات فيسبوك. عند نقر أي عميل عليه، سيتم تسجيل مصدر الزيارة واسم الحملة بدقة وإرسالها إلى Meta Pixel.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-[var(--mute)] mb-1">
              {isEn ? 'Ad Platform' : 'منصة الإعلان'}
            </label>
            <select
              value={campaignPlatformInput}
              onChange={(e) => setCampaignPlatformInput(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="instagram">Instagram (Reels / Story / Post)</option>
              <option value="facebook">Facebook (Feed / Carousel)</option>
              <option value="tiktok">TikTok (Ad / Bio)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] text-[var(--mute)] mb-1">
              {isEn ? 'Campaign Name (UTM)' : 'اسم الحملة الإعلانية'}
            </label>
            <input
              type="text"
              value={campaignNameInput}
              onChange={(e) => setCampaignNameInput(e.target.value)}
              placeholder="e.g. blondes_promo_november"
              className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
              dir="ltr"
            />
          </div>
        </div>

        {/* Link Result + Copy */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
          <input
            type="text"
            readOnly
            value={generatedCampaignUrl}
            className="flex-1 bg-transparent text-xs font-mono text-[var(--gold)] px-2 focus:outline-none overflow-x-auto"
            dir="ltr"
          />
          <button
            onClick={handleCopyLink}
            className="h-8 px-3 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-semibold hover:bg-[var(--gold-hover)] inline-flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isEn ? 'Copied!' : 'تم النسخ!') : isEn ? 'Copy Ad Link' : 'نسخ رابط الإعلان'}</span>
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      {campaigns.length > 0 && (
        <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
          <h3 className="font-semibold text-sm text-[var(--fg)]">
            {isEn ? 'Active Ad Campaigns & Conversions' : 'الحملات الإعلانية النشطة المسجلة'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--mute)]">
                  <th className="py-2.5 px-3 text-start">{isEn ? 'Campaign' : 'اسم الحملة'}</th>
                  <th className="py-2.5 px-3 text-start">{isEn ? 'Source / Platform' : 'المنصة'}</th>
                  <th className="py-2.5 px-3 text-start">{isEn ? 'Medium' : 'نوع الإعلان'}</th>
                  <th className="py-2.5 px-3 text-start">{isEn ? 'Visitors' : 'عدد الزوار'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {campaigns.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[var(--line)]/20 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[var(--fg)] font-mono">
                      {c.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[var(--gold)]/10 text-[var(--gold)]">
                        {c.source}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--mute)]">
                      {c.medium || 'cpc'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[var(--fg)]">
                      {c.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Visitor Log Section */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-[var(--fg)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--gold)]" />
              <span>{isEn ? 'Recent Visitor Stream' : 'سجل الزوار الأحدث لحظة بلحظة'}</span>
            </h3>
            <span className="text-[11px] text-[var(--mute)]">
              {isEn ? 'Detailed log of incoming customer sessions' : 'تفاصيل مصدر كل عميل ونوع الجهاز والصفحة التي زارها'}
            </span>
          </div>

          {/* Actions: Filter + Simulated visit test + Clear */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--fg)]"
            >
              <option value="all">{isEn ? 'All Sources' : 'جميع المصادر'}</option>
              <option value="meta">{isEn ? 'Meta (IG + FB)' : 'إعلانات Meta'}</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="google">Google</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="direct">Direct</option>
            </select>

            {/* Quick Test Add Simulated Visit */}
            <button
              onClick={() => handleAddSimulatedVisit('instagram')}
              className="h-8 px-2.5 rounded-lg border border-[var(--line)] text-xs text-[var(--mute)] hover:text-[var(--fg)] inline-flex items-center gap-1 transition-colors"
              title="Add simulated visit for testing"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? '+ Test IG Visit' : '+ تجربة زيارة إنستغرام'}</span>
            </button>

            {/* Clear Logs */}
            <button
              onClick={handleClearLogs}
              className="h-8 w-8 rounded-lg border border-[var(--line)] text-xs text-[var(--mute)] hover:text-red-400 flex items-center justify-center transition-colors"
              title={isEn ? 'Clear logs' : 'مسح السجل'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visitors Log Table */}
        <div className="overflow-x-auto">
          {filteredVisits.length === 0 ? (
            <div className="text-center py-10 text-[var(--mute)] text-xs">
              {isEn ? 'No visitor records matching current filter' : 'لا توجد سجلات زيارة مطابقة للمرشح الحالي'}
            </div>
          ) : (
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--mute)]">
                  <th className="py-2 px-3 text-start">{isEn ? 'Time' : 'التوقيت'}</th>
                  <th className="py-2 px-3 text-start">{isEn ? 'Source & Channel' : 'المصدر والقناة'}</th>
                  <th className="py-2 px-3 text-start">{isEn ? 'Campaign / Medium' : 'الحملة / النوع'}</th>
                  <th className="py-2 px-3 text-start">{isEn ? 'Device' : 'الجهاز'}</th>
                  <th className="py-2 px-3 text-start">{isEn ? 'Landing Target' : 'صفحة الهبوط'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredVisits.map((v) => {
                  const date = new Date(v.timestamp);
                  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  // Source badge style
                  let badgeClass = 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
                  if (v.source === 'instagram') badgeClass = 'bg-pink-500/10 text-pink-400 border-pink-500/30';
                  if (v.source === 'facebook') badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  if (v.source === 'tiktok') badgeClass = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
                  if (v.source === 'google') badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (v.source === 'whatsapp') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                  return (
                    <tr key={v.id} className="hover:bg-[var(--line)]/20 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[var(--mute)] whitespace-nowrap">
                        {timeStr}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${badgeClass}`}>
                          {v.sourceName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[var(--mute)]">
                        {v.campaign ? (
                          <span className="text-[var(--gold)] font-medium">{v.campaign}</span>
                        ) : (
                          <span>{v.medium || '-'}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[var(--mute)]">
                          {v.device === 'mobile' ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : v.device === 'tablet' ? (
                            <Tablet className="w-3.5 h-3.5" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5" />
                          )}
                          <span className="capitalize">{v.device}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[var(--mute)]">
                        {v.page || '/'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Meta Pixel Live Test Card */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-[var(--fg)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span>{isEn ? 'Verify Meta Pixel Firing' : 'فحص إرسال أحداث Meta Pixel'}</span>
          </h3>
          <p className="text-xs text-[var(--mute)] mt-1">
            {isEn
              ? 'Send a test ViewContent event to verify your Meta Events Manager or Chrome Meta Pixel Helper extension receives data.'
              : 'أرسل حدث تجريبي للتأكد من وصول البيانات لمدير أحداث Meta أو إضافة Meta Pixel Helper.'}
          </p>
        </div>

        <button
          onClick={handleSendTestEvent}
          className="h-10 px-4 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] font-semibold text-xs hover:bg-[var(--gold-hover)] inline-flex items-center gap-2 transition-colors shrink-0"
        >
          {testEventSent ? <Check className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          <span>{testEventSent ? (isEn ? 'Test Event Sent!' : 'تم إرسال الحدث بنجاح!') : isEn ? 'Send Test Event' : 'إرسال حدث تجريبي'}</span>
        </button>
      </div>
    </div>
  );
};
