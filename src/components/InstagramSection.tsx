import React, { useState } from 'react';
import { Instagram, ArrowUpRight, Play, X } from 'lucide-react';
import { Language } from '../utils/translations';

interface InstagramSectionProps {
  lang: Language;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ lang }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // 4 فيديوهات من مجلد public/assets/aistudio
  const videos = [
    { id: 1, src: '/assets/aistudio/01.mp4', tag: '#01' },
    { id: 2, src: '/assets/aistudio/02.mp4', tag: '#02' },
    { id: 3, src: '/assets/aistudio/03.mp4', tag: '#03' },
    { id: 4, src: '/assets/aistudio/04.mp4', tag: '#04' },
  ];

  return (
    <>
      <section id="ig" className="py-20 md:py-24 bg-[var(--bg2)] border-b border-[var(--line)]">
        <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-medium mb-2">
              Instagram Lookbook
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[var(--fg)] mb-3">
              {lang === 'ar' ? 'تابعي إطلالات Space' : 'Follow Our Space Looks'}
            </h2>
            <p className="text-sm text-[var(--mute)]">
              {lang === 'ar'
                ? 'شاركي إطلالتك معنا واستلهمي أحدث صيحات ألوان الشعر اليومية'
                : 'Share your look and get inspired by our latest salon-grade hair color trends'}
            </p>
          </div>

          {/* 4 Videos Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video.src)}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-[var(--line)] hover:border-[var(--gold)]/80 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <video
                  src={video.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                />

                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between text-white/80 p-3.5">
                  <span className="font-mono text-xs">{video.tag}</span>
                  <Instagram className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="relative z-10 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-[var(--on-gold)] transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="text- text-white flex items-center gap-0.5">
                      @spacecolorinfinity <ArrowUpRight className="w-3 h-3 inline" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://www.instagram.com/spacecolorinfinity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-[var(--gold)] text-sm font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-gold)] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@spacecolorinfinity</span>
            </a>
          </div>
        </div>
      </section>

      {/* Video Popup - لما تكبسي على أي فيديو */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <video
            src={selectedVideo}
            controls
            autoPlay
            playsInline
            className="relative max-h- max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};