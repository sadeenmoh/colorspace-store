export interface VideoItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'transformation' | 'tutorial' | 'unboxing' | 'review';
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: string;
  shadeCode?: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    titleAr: 'طريقة تطبيق صبغة Space Color Infinity في المنزل خطوة بخطوة',
    titleEn: 'Step-by-step DIY Application of Space Color Infinity',
    category: 'tutorial',
    duration: '1:15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-dyeing-a-clients-hair-41444-large.mp4',
    views: '24.8K',
    shadeCode: '10',
    descriptionAr: 'شرح مزج الـ 2 تيوب صبغة مع الـ 2 أوكسجين واستخدام البلسم المغذي بعد الغسل للحصول على لمعان حريري.',
    descriptionEn: 'Tutorial on mixing the 2 dye tubes with the 2 oxidants and applying the post-color care balm for silky shine.',
  },
  {
    id: 'vid-2',
    titleAr: 'تحول رائع إلى البني الدافئ الأيقوني (الدرجة 04) وتغطية الشيب 100%',
    titleEn: 'Stunning Dark Brown Transformation (Shade 04) & 100% Grey Coverage',
    category: 'transformation',
    duration: '0:58',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-brushing-long-blonde-hair-in-a-salon-41442-large.mp4',
    views: '41.2K',
    shadeCode: '04',
    descriptionAr: 'نتيجة صبغ حقيقية على شعر عنيد مع تغطية كاملة بدون نشفان بفضل زيت الأرجان والجوجوبا والكيراتين.',
    descriptionEn: 'Real client transformation with complete coverage without dryness thanks to argan, jojoba, and keratin.',
  },
  {
    id: 'vid-3',
    titleAr: 'فتح علبة Space Color Infinity: ما الذي تحتويه العلبة بـ 2.5 دينار؟',
    titleEn: 'Unboxing Space Color Infinity: What is Inside the 2.5 JOD Box?',
    category: 'unboxing',
    duration: '0:45',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-with-her-hair-blowing-in-the-wind-41434-large.mp4',
    views: '18.9K',
    descriptionAr: 'استعراض كامل لمحتويات العلبة: 2 تيوب صبغة 50 مل + 2 أوكسجين 50 مل + كيس بلسم عناية فاخر.',
    descriptionEn: 'Full unboxing: 2 dye tubes 50ml + 2 developer oxidants 50ml + post-color conditioning balm.',
  },
  {
    id: 'vid-4',
    titleAr: 'درجة الأشقر الرمادي (17) وتحييد اللون النحاسي في الصالون',
    titleEn: 'Ash Blonde (17) Brass Neutralization & Glossy Finish',
    category: 'transformation',
    duration: '1:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-hairdresser-washing-a-womans-hair-41440-large.mp4',
    views: '33.1K',
    shadeCode: '17',
    descriptionAr: 'شاهدي كيف تحول الشعر النحاسي إلى أشقر رمادي بارد ولمعان مشع بتركيبة تركية قليلة الأمونيا.',
    descriptionEn: 'Watch how brassy tones transform into elegant cool ash blonde with the low-ammonia Turkish formula.',
  },
];

export function getStoredVideos(): VideoItem[] {
  try {
    const raw = localStorage.getItem('sci-videos');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_VIDEOS;
}

export function saveStoredVideos(videos: VideoItem[]): void {
  try {
    localStorage.setItem('sci-videos', JSON.stringify(videos));
  } catch {}
}
