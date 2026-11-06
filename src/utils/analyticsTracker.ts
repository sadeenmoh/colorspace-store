export interface TrafficVisit {
  id: string;
  timestamp: string;
  source: 'instagram' | 'facebook' | 'tiktok' | 'google' | 'whatsapp' | 'direct' | 'other';
  sourceName: string;
  medium?: string;
  campaign?: string;
  referrer: string;
  device: 'mobile' | 'desktop' | 'tablet';
  page: string;
}

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

const SEED_VISITS: TrafficVisit[] = [
  {
    id: 'vis-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    source: 'instagram',
    sourceName: 'Instagram Ad (Reels)',
    medium: 'cpc',
    campaign: 'fall_hair_color_2026',
    referrer: 'https://l.instagram.com/',
    device: 'mobile',
    page: '/',
  },
  {
    id: 'vis-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    source: 'facebook',
    sourceName: 'Facebook Feed Ad',
    medium: 'cpc',
    campaign: 'argan_caramel_shades',
    referrer: 'https://m.facebook.com/',
    device: 'mobile',
    page: '#shade-10',
  },
  {
    id: 'vis-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    source: 'tiktok',
    sourceName: 'TikTok Bio Link',
    medium: 'social',
    campaign: 'salon_transformation',
    referrer: 'https://www.tiktok.com/',
    device: 'mobile',
    page: '/',
  },
  {
    id: 'vis-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    source: 'google',
    sourceName: 'Google Organic Search',
    referrer: 'https://www.google.com/',
    device: 'desktop',
    page: '/',
  },
  {
    id: 'vis-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    source: 'whatsapp',
    sourceName: 'WhatsApp Shared Link',
    referrer: 'android-app://com.whatsapp',
    device: 'mobile',
    page: '#shade-04',
  },
  {
    id: 'vis-106',
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    source: 'direct',
    sourceName: 'Direct / Bookmarks',
    referrer: '',
    device: 'desktop',
    page: '/',
  },
];

export function parseTrafficSource(referrerUrl: string, searchParams: URLSearchParams): {
  source: TrafficVisit['source'];
  sourceName: string;
  medium?: string;
  campaign?: string;
} {
  const utmSource = searchParams.get('utm_source')?.toLowerCase();
  const utmMedium = searchParams.get('utm_medium')?.toLowerCase();
  const utmCampaign = searchParams.get('utm_campaign') || undefined;

  // 1. Check UTM parameters first
  if (utmSource) {
    if (utmSource.includes('insta') || utmSource.includes('ig')) {
      return { source: 'instagram', sourceName: 'Instagram Campaign', medium: utmMedium, campaign: utmCampaign };
    }
    if (utmSource.includes('fb') || utmSource.includes('facebook') || utmSource.includes('meta')) {
      return { source: 'facebook', sourceName: 'Facebook / Meta Ad', medium: utmMedium, campaign: utmCampaign };
    }
    if (utmSource.includes('tiktok')) {
      return { source: 'tiktok', sourceName: 'TikTok Campaign', medium: utmMedium, campaign: utmCampaign };
    }
    if (utmSource.includes('google')) {
      return { source: 'google', sourceName: 'Google Ad / Search', medium: utmMedium, campaign: utmCampaign };
    }
    if (utmSource.includes('wa') || utmSource.includes('whatsapp')) {
      return { source: 'whatsapp', sourceName: 'WhatsApp Link', medium: utmMedium, campaign: utmCampaign };
    }
    return { source: 'other', sourceName: `Campaign (${utmSource})`, medium: utmMedium, campaign: utmCampaign };
  }

  // 2. Check Referrer URL
  const ref = referrerUrl.toLowerCase();
  if (ref.includes('instagram.com')) {
    return { source: 'instagram', sourceName: 'Instagram (Bio / Story / Post)' };
  }
  if (ref.includes('facebook.com') || ref.includes('fb.me')) {
    return { source: 'facebook', sourceName: 'Facebook' };
  }
  if (ref.includes('tiktok.com')) {
    return { source: 'tiktok', sourceName: 'TikTok' };
  }
  if (ref.includes('google.')) {
    return { source: 'google', sourceName: 'Google Search' };
  }
  if (ref.includes('whatsapp') || ref.includes('wa.me')) {
    return { source: 'whatsapp', sourceName: 'WhatsApp Share' };
  }

  if (!referrerUrl) {
    return { source: 'direct', sourceName: 'Direct Visit' };
  }

  return { source: 'other', sourceName: 'External Referral' };
}

export function detectDevice(): TrafficVisit['device'] {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function getStoredVisits(): TrafficVisit[] {
  try {
    const raw = localStorage.getItem('sci-traffic-log');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SEED_VISITS;
}

export function recordCurrentVisit(): TrafficVisit {
  if (typeof window === 'undefined') return SEED_VISITS[0];

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer || '';
  const parsed = parseTrafficSource(referrer, urlParams);
  const device = detectDevice();

  const visit: TrafficVisit = {
    id: `vis-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    source: parsed.source,
    sourceName: parsed.sourceName,
    medium: parsed.medium,
    campaign: parsed.campaign,
    referrer: referrer ? new URL(referrer, window.location.origin).hostname : '',
    device,
    page: window.location.hash || window.location.pathname,
  };

  try {
    const current = getStoredVisits();
    // Keep max 50 visits to save storage
    const updated = [visit, ...current.slice(0, 49)];
    localStorage.setItem('sci-traffic-log', JSON.stringify(updated));
  } catch {}

  return visit;
}

/**
 * Meta (Facebook) Pixel Integration
 */
export function initMetaPixel(pixelId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const cleanId = (pixelId || '').trim();
  if (!cleanId) return false;

  // If already initialized with this ID, track pageview and return
  if (window.fbq) {
    try {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
      return true;
    } catch {
      return false;
    }
  }

  // Official Meta Pixel script injection
  try {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if (window.fbq) {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
      return true;
    }
  } catch {}

  return false;
}

export function trackMetaPixelEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params);
    } catch {}
  }
}
