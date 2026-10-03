import { ChevronLeft, ChevronRight, Eye, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import { CardBotanicalWatermark } from '../assets/VectorOrnaments';
import { OrganicTitleBadge } from './OrganicTitleBadge';

// Helper konversi URL YouTube biasa ke format embed aman
function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const clean = url.trim();

  // Jika sudah format embed
  if (clean.includes('youtube.com/embed/')) return clean;

  // youtu.be/VIDEO_ID
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  }

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  }

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0&modestbranding=1`;
  }

  return clean;
}

export const GallerySection = () => {
  const { config } = useWedding();
  const gallery = config.gallery || {};
  const isGalleryEnabled = gallery.enabled !== false;
  const video = gallery.video || {};
  const photos = Array.isArray(gallery.photos) ? gallery.photos : [];
  const embedVideoUrl = getYoutubeEmbedUrl(video.url);

  // Lightbox State
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Keyboard navigation untuk lightbox
  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIdx((prev) => (prev + 1) % photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx((prev) =>
          prev === 0 ? photos.length - 1 : prev - 1,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, photos.length]);

  if (!isGalleryEnabled) {
    return null;
  }

  return (
    <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 px-3 sm:px-6 max-w-3xl mx-auto overflow-hidden">
      {/* JUDUL SEKSI */}
      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="text-center mb-6 sm:mb-8">
          <OrganicTitleBadge
            subtitle={gallery.subtitle || 'Momen Bahagia'}
            title={gallery.title || 'Galeri & Video Kami'}
          />
        </div>
      </ScrollReveal>

      {/* 1. PEMUTAR VIDEO PREWEDDING (JIKA AKTIF) */}
      {video.enabled !== false && embedVideoUrl && (
        <ScrollReveal
          animation="zoom-in"
          duration={850}
          repeat={true}
          className="mb-8"
        >
          <div className="relative p-3.5 sm:p-5 rounded-3xl luxury-pearl-card shadow-luxury border border-gold/45 overflow-hidden">
            {/* Watermark Flora Halus */}
            <CardBotanicalWatermark className="w-32 sm:w-44 opacity-[0.16] -top-2 -right-2" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold/25">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-gold/15 text-primary">
                    <Video className="w-4 h-4 text-gold" />
                  </span>
                  <h4 className="text-xs sm:text-scale-small font-bold text-primary tracking-wide">
                    {video.title || 'Video Prewedding'}
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white border border-gold/40 shadow-xs">
                  Video Teaser
                </span>
              </div>

              {/* FRAME VIDEO 16:9 RESPONSIVE */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-gold/30 bg-black">
                <iframe
                  src={embedVideoUrl}
                  title={video.title || 'Prewedding Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 2. GRID FOTO PREWEDDING */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4.5">
          {photos.map((item, idx) => (
            <ScrollReveal
              key={item.id || idx}
              animation="fade-up"
              delay={idx * 80}
              duration={700}
              repeat={true}
            >
              <div
                onClick={() => setActivePhotoIdx(idx)}
                className="group relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-soft border border-gold/35 luxury-pearl-card transition-all duration-500 hover:-translate-y-1 hover:shadow-luxury"
              >
                {/* Garis Border Inset */}
                <div className="absolute inset-2 rounded-xl sm:rounded-2xl border border-white/40 z-10 pointer-events-none group-hover:border-gold/60 transition-colors" />

                {/* Gambar Foto */}
                <img
                  src={item.url}
                  alt={item.caption || `Foto Prewedding ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Overlay Efek Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[11px] font-medium truncate drop-shadow-xs">
                      {item.caption || 'Lihat Foto'}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                      <Eye className="w-3.5 h-3.5 text-gold-light" />
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* 3. LIGHTBOX MODAL FULLSCREEN */}
      {activePhotoIdx !== null && photos[activePhotoIdx] && (
        <div
          onClick={() => setActivePhotoIdx(null)}
          className="fixed inset-0 z-60 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* TOMBOL TUTUP */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIdx(null);
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-30"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* COUNTER FOTO */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 z-30">
            {activePhotoIdx + 1} / {photos.length}
          </div>

          {/* TOMBOL SEBELUMNYA */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) =>
                  prev === 0 ? photos.length - 1 : prev - 1,
                );
              }}
              className="absolute left-3 sm:left-6 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-30"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* CONTAINER GAMBAR BESAR */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] flex flex-col items-center justify-center z-20"
          >
            <img
              src={photos[activePhotoIdx].url}
              alt={photos[activePhotoIdx].caption || 'Foto Prewedding'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border-2 border-gold/40 shadow-2xl animate-scaleUp"
            />

            {photos[activePhotoIdx].caption && (
              <p className="mt-3.5 text-center text-xs sm:text-sm text-slate-200 font-medium px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 max-w-md">
                {photos[activePhotoIdx].caption}
              </p>
            )}
          </div>

          {/* TOMBOL SELANJUTNYA */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) => (prev + 1) % photos.length);
              }}
              className="absolute right-3 sm:right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-30"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
