import React, { useState } from 'react';
import { Film, Plus, Trash2, ExternalLink, Play, Check, Sparkles, X } from 'lucide-react';
import { VideoItem, DEFAULT_VIDEOS } from '../../utils/videoData';
import { SHADES } from '../../utils/storeLogic';
import { Language } from '../../utils/translations';

interface AdminVideoManagerProps {
  videos: VideoItem[];
  onVideosUpdated: (videos: VideoItem[]) => void;
  lang: Language;
}

export const AdminVideoManager: React.FC<AdminVideoManagerProps> = ({
  videos,
  onVideosUpdated,
  lang,
}) => {
  const isEn = lang === 'en';
  const [isAdding, setIsAdding] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  // Form state for adding new video
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<VideoItem['category']>('tutorial');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('1:00');
  const [shadeCode, setShadeCode] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;

    const newVideo: VideoItem = {
      id: `vid-${Date.now().toString(36)}`,
      titleAr: titleAr.trim() || titleEn.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      category,
      duration: duration.trim() || '1:00',
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      videoUrl: videoUrl.trim() || 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-dyeing-a-clients-hair-41444-large.mp4',
      views: '1.2K',
      shadeCode: shadeCode ? shadeCode : undefined,
      descriptionAr: descriptionAr.trim() || 'فيديو استعراض صبغة Space Color Infinity',
      descriptionEn: descriptionEn.trim() || 'Space Color Infinity video showcase',
    };

    const updated = [newVideo, ...videos];
    onVideosUpdated(updated);
    try {
      localStorage.setItem('sci-videos', JSON.stringify(updated));
    } catch {}

    // Reset Form
    setTitleAr('');
    setTitleEn('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDescriptionAr('');
    setDescriptionEn('');
    setShadeCode('');
    setIsAdding(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2400);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(isEn ? 'Delete this video from showcase?' : 'هل أنت متأكد من حذف هذا الفيديو؟')) {
      const updated = videos.filter((v) => v.id !== id);
      onVideosUpdated(updated);
      try {
        localStorage.setItem('sci-videos', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm(isEn ? 'Reset to default demonstration videos?' : 'استرجاع الفيديوهات الافتراضية؟')) {
      onVideosUpdated(DEFAULT_VIDEOS);
      try {
        localStorage.setItem('sci-videos', JSON.stringify(DEFAULT_VIDEOS));
      } catch {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-5 h-5 text-[var(--gold)]" />
            <h2 className="font-serif-luxury text-2xl text-[var(--fg)]">
              {isEn ? 'Video Showcase & Reels Management' : 'إدارة قسم الفيديوهات والتجارب المصورة'}
            </h2>
          </div>
          <p className="text-xs text-[var(--mute)]">
            {isEn
              ? 'Add and customize videos shown on the website (Reels, TikTok transformations, and tutorial guides).'
              : 'أضيفي وعدّلي الفيديوهات المعروضة في قسم الفيديوهات بالموقع (ريلز إنستغرام، تيك توك، وطريقة الاستخدام).'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="h-10 px-4 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-bold hover:bg-[var(--gold-hover)] inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAdding ? (isEn ? 'Cancel' : 'إلغاء') : isEn ? '+ Add New Video' : '+ إضافة فيديو جديد'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="h-10 px-3 rounded-lg border border-[var(--line)] text-xs text-[var(--mute)] hover:text-[var(--fg)] transition-colors"
            title="Reset Defaults"
          >
            {isEn ? 'Reset' : 'استرجاع الافتراضي'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{isEn ? 'Video added successfully to showcase!' : 'تمت إضافة الفيديو بنجاح إلى قسم الفيديوهات في المتجر!'}</span>
        </div>
      )}

      {/* Add Video Form Drawer / Box */}
      {isAdding && (
        <form onSubmit={handleAddVideo} className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--gold)]/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="font-semibold text-sm text-[var(--fg)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>{isEn ? 'New Video Details' : 'بيانات الفيديو الجديد'}</span>
            </h3>
            <span className="text-[11px] text-[var(--mute)]">
              {isEn ? 'Supports MP4, Reels & Shorts' : 'يدعم روابط MP4، ريلز إنستغرام وتيك توك'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Arabic Title' : 'عنوان الفيديو بالعربية'} *
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: طريقة خلط الصبغة والأوكسجين في المنزل"
                required
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'English Title' : 'عنوان الفيديو بالإنجليزية'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. How to mix dye and oxidant at home"
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Video File / Embed URL (MP4)' : 'رابط ملف الفيديو (MP4 أو فيديو مباشر)'} *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://assets.mixkit.co/.../video.mp4"
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] font-mono focus:outline-none focus:border-[var(--gold)]"
                dir="ltr"
              />
              <span className="text-[10px] text-[var(--mute)] mt-0.5 block">
                {isEn ? 'Direct MP4 video URL or CDN link' : 'رابط مباشر لملف الفيديو بصيغة MP4'}
              </span>
            </div>

            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Thumbnail Image URL' : 'رابط صورة الغلاف (Thumbnail)'}
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] font-mono focus:outline-none focus:border-[var(--gold)]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Category' : 'تصنيف الفيديو'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="tutorial">{isEn ? 'Application & Mixing' : 'طريقة الاستخدام والمزج'}</option>
                <option value="transformation">{isEn ? 'Color Transformation' : 'نتائج التحول وتغطية الشيب'}</option>
                <option value="unboxing">{isEn ? 'Kit Unboxing (2+2)' : 'محتويات العلبة'}</option>
                <option value="review">{isEn ? 'Customer Review' : 'تجارب وآراء'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Related Shade (Optional)' : 'الدرجة المرتبطة بالفيديو (اختياري)'}
              </label>
              <select
                value={shadeCode}
                onChange={(e) => setShadeCode(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--gold)]"
              >
                <option value="">{isEn ? 'No specific shade' : 'بدون درجة محددة'}</option>
                {SHADES.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.code} - {isEn ? s.nameEn : s.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[var(--mute)] mb-1">
                {isEn ? 'Arabic Description' : 'الوصف بالعربية'}
              </label>
              <textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="شرح بسيط لما يعرضه الفيديو..."
                rows={2}
                className="w-full p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] resize-none focus:outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="h-9 px-4 rounded-lg border border-[var(--line)] text-xs text-[var(--mute)] hover:text-[var(--fg)]"
            >
              {isEn ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              className="h-9 px-6 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-bold hover:bg-[var(--gold-hover)]"
            >
              {isEn ? 'Save Video' : 'حفظ الفيديو ونشره'}
            </button>
          </div>
        </form>
      )}

      {/* Current Videos List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="rounded-xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black/60">
              <img
                src={v.thumbnailUrl}
                alt={v.titleAr}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewVideo(v)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 text-white transition-colors"
                title="Preview"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--gold)] text-[var(--on-gold)] flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-current ms-0.5" />
                </div>
              </button>
              <span className="absolute bottom-2 start-2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono">
                {v.duration}
              </span>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[var(--fg)] line-clamp-1 mb-1">
                  {isEn ? v.titleEn : v.titleAr}
                </h4>
                <p className="text-[11px] text-[var(--mute)] line-clamp-2">
                  {isEn ? v.descriptionEn : v.descriptionAr}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[var(--gold)] uppercase font-semibold">
                  {v.category}
                </span>

                <button
                  onClick={() => handleDelete(v.id)}
                  className="w-7 h-7 rounded text-[var(--mute)] hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewVideo(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden z-10">
            <div className="p-3 border-b border-[var(--line)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--fg)]">
                {isEn ? previewVideo.titleEn : previewVideo.titleAr}
              </span>
              <button
                onClick={() => setPreviewVideo(null)}
                className="w-7 h-7 rounded flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
