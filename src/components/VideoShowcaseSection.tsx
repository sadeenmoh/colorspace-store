import React, { useState } from 'react';
import { Play, X, Sparkles, Eye, Clock, Film, ExternalLink, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { VideoItem } from '../utils/videoData';
import { Language } from '../utils/translations';
import { SHADES } from '../utils/storeLogic';

interface VideoShowcaseSectionProps {
  videos: VideoItem[];
  lang: Language;
  onSelectShadeByCode?: (code: string) => void;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  videos,
  lang,
  onSelectShadeByCode,
}) => {
  const isEn = lang === 'en';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const categories = [
    { id: 'all', labelAr: 'جميع الفيديوهات', labelEn: 'All Videos' },
    { id: 'tutorial', labelAr: 'طريقة الاستخدام والمزج', labelEn: 'Application & Mixing' },
    { id: 'transformation', labelAr: 'نتائج التحول وتغطية الشيب', labelEn: 'Real Results' },
    { id: 'unboxing', labelAr: 'محتويات العلبة (2+2)', labelEn: 'Kit Unboxing' },
  ];

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <section id="videos" className="py-20 md:py-24 bg-[var(--bg2)] border-b border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-3">
            <Film className="w-4 h-4" />
            <span>{isEn ? 'Videos & Hair Transformations' : 'فيديوهات وتجارب حقيقية'}</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)] mb-4">
            {isEn ? 'Watch the Color Come to Life' : 'شاهدي النتيجة بالصوت والصورة'}
          </h2>
          <p className="text-sm sm:text-base text-[var(--mute)] leading-relaxed">
            {isEn
              ? 'Explore application tutorials, kit unboxing, and real client hair transformations with Space Color Infinity.'
              : 'استكشفي فيديوهات فتح العلبة، طريقة مزج الـ 2 تيوب مع الـ 2 أوكسجين، ونتائج درجات الألوان على أرض الواقع.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`h-9 px-4 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--on-gold)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:text-[var(--fg)]'
                }`}
              >
                {isEn ? cat.labelEn : cat.labelAr}
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const title = isEn ? video.titleEn : video.titleAr;
            const desc = isEn ? video.descriptionEn : video.descriptionAr;
            const matchedShade = video.shadeCode
              ? SHADES.find((s) => s.code === video.shadeCode)
              : undefined;

            return (
              <div
                key={video.id}
                onClick={() => setPlayingVideo(video)}
                className="group relative rounded-2xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden cursor-pointer hover:border-[var(--gold)]/70 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-[9/13] w-full overflow-hidden bg-black/40">
                  <img
                    src={video.thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--gold)]" />
                      <span>{video.duration}</span>
                    </span>

                    {matchedShade && (
                      <span
                        className="px-2 py-0.5 rounded-full border border-white/20 text-white font-mono text-[10px] drop-shadow"
                        style={{ backgroundColor: matchedShade.hex }}
                      >
                        #{matchedShade.code} {isEn ? matchedShade.nameEn : matchedShade.nameAr}
                      </span>
                    )}
                  </div>

                  {/* Center Golden Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[var(--gold)]/90 text-[var(--on-gold)] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[var(--gold)] transition-all duration-300">
                      <Play className="w-6 h-6 fill-current ms-0.5" />
                    </div>
                  </div>

                  {/* Bottom Views Counter */}
                  <div className="absolute bottom-3 start-3 text-[11px] text-white/80 flex items-center gap-1.5 drop-shadow">
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{video.views} {isEn ? 'views' : 'مشاهدة'}</span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-base text-[var(--fg)] font-medium leading-snug group-hover:text-[var(--gold)] transition-colors line-clamp-2 mb-2">
                      {title}
                    </h3>
                    <p className="text-xs text-[var(--mute)] line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--gold)] font-medium">
                    <span>{isEn ? 'Watch Video' : 'مشاهدة الفيديو'}</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setPlayingVideo(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-2xl bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[var(--gold)]" />
                <h4 className="font-serif-luxury text-base text-[var(--fg)] line-clamp-1">
                  {isEn ? playingVideo.titleEn : playingVideo.titleAr}
                </h4>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--mute)] hover:text-[var(--fg)] hover:bg-[var(--line)]/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={playingVideo.videoUrl}
                poster={playingVideo.thumbnailUrl}
                controls
                autoPlay
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer & Shade CTA */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg2)]">
              <div className="flex-1">
                <p className="text-xs text-[var(--fg)] leading-relaxed">
                  {isEn ? playingVideo.descriptionEn : playingVideo.descriptionAr}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[var(--mute)] mt-1.5">
                  <span>{playingVideo.views} {isEn ? 'views' : 'مشاهدة'}</span>
                  <span>•</span>
                  <span>{isEn ? 'Turkish Formula 🇹🇷' : 'صبغة تركية أصلية 🇹🇷'}</span>
                  <span>•</span>
                  <span>{isEn ? '2.5 JOD Only' : '٢.٥ دينار فقط'}</span>
                </div>
              </div>

              {playingVideo.shadeCode && (
                <button
                  onClick={() => {
                    const code = playingVideo.shadeCode;
                    setPlayingVideo(null);
                    if (onSelectShadeByCode && code) {
                      onSelectShadeByCode(code);
                    } else {
                      window.location.hash = `#shade-${code}`;
                    }
                  }}
                  className="h-10 px-5 rounded-lg bg-[var(--gold)] text-[var(--on-gold)] text-xs font-bold hover:bg-[var(--gold-hover)] inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isEn ? `Shop Shade #${playingVideo.shadeCode}` : `تسوّقي الدرجة #${playingVideo.shadeCode}`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
