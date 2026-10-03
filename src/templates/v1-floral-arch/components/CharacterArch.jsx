import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  CoupleAvatar,
  FloralDivider,
} from '../assets/VectorOrnaments';
import { OrganicTitleBadge } from './OrganicTitleBadge';

gsap.registerPlugin(ScrollTrigger);

const InstagramIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const CharacterArch = () => {
  const { config, isOpened } = useWedding();
  const archRef = useRef(null);
  const coupleGridRef = useRef(null);

  useGSAP(
    () => {
      if (!isOpened) return;

      // 1. Pembukaan Megah & Khidmat (Sacred Opening Sequence: Bismillah, Kaligrafi QS Ar-Rum, Ranting Emas, Salam)
      // Mengalir tenang setelah tirai cover selesai keluar (delay: 1.1s)
      const sacredTl = gsap.timeline({
        delay: 1.1,
      });

      // Kartu Kubah Utama Masuk dengan Keanggunan Penuh
      sacredTl.fromTo(
        '.cathedral-arch-portal',
        { y: 20, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        0,
      );

      // Bismillah Emas Berpendar Lembut
      sacredTl.fromTo(
        '.sacred-bismillah',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
        0.1,
      );

      // Kaligrafi Ayat Suci Al-Qur'an (QS. Ar-Rum: 21) Terangkat Anggun
      sacredTl.fromTo(
        '.sacred-arabic-verse',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        0.25,
      );

      // Ranting Pembatas Floral 1 Mekar Melebar dari Titik Tengah ke Sisi Kiri-Kanan
      sacredTl.fromTo(
        '.sacred-divider-1',
        { scaleX: 0, opacity: 0, transformOrigin: 'center center' },
        { scaleX: 1, opacity: 0.9, duration: 0.85, ease: 'power2.out' },
        0.5,
      );

      // Terjemahan Ayat & Sumber Surat
      sacredTl.fromTo(
        '.sacred-translation',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        0.7,
      );

      sacredTl.fromTo(
        '.sacred-source',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.85,
      );

      // Ranting Pembatas Floral 2 Mekar
      sacredTl.fromTo(
        '.sacred-divider-2',
        { scaleX: 0, opacity: 0, transformOrigin: 'center center' },
        { scaleX: 1, opacity: 0.9, duration: 0.85, ease: 'power2.out' },
        1.0,
      );

      // Salam & Teks Sambutan Pengantin
      sacredTl.fromTo(
        '.sacred-salam',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        1.15,
      );

      sacredTl.fromTo(
        '.sacred-intro',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        1.25,
      );

      // Ranting Pembatas Floral 3 Mekar
      sacredTl.fromTo(
        '.sacred-divider-3',
        { scaleX: 0, opacity: 0, transformOrigin: 'center center' },
        { scaleX: 1, opacity: 0.9, duration: 0.85, ease: 'power2.out' },
        1.4,
      );

      // 2. Animasi Entrance & Breathing Melayang Lembut untuk Ilustrasi Mempelai (ScrollTrigger)
      gsap.from('.couple-avatar-wrap', {
        scrollTrigger: {
          trigger: '.couple-avatar-wrap',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        scale: 0.93,
        opacity: 0,
        y: 18,
        duration: 0.95,
        ease: 'power3.out',
      });

      gsap.to('.couple-avatar-wrap', {
        y: -5,
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      const mm = gsap.matchMedia();

      // Mobile (< 768px): Vertical Stagger Cascade (mengalir alami mengikuti scroll vertikal)
      mm.add('(max-width: 767px)', () => {
        gsap.from('.bride-profile-card', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
        });

        gsap.from('.ampersand-badge', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          scale: 0.4,
          opacity: 0,
          duration: 0.6,
          delay: 0.12,
          ease: 'back.out(2)',
        });

        gsap.from('.groom-profile-card', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          y: 28,
          opacity: 0,
          duration: 0.85,
          delay: 0.22,
          ease: 'power3.out',
        });
      });

      // Desktop (>= 768px): Horizontal Entrance dari Kiri & Kanan
      mm.add('(min-width: 768px)', () => {
        gsap.from('.bride-profile-card', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          x: -36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });

        gsap.from('.groom-profile-card', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          x: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });

        gsap.from('.ampersand-badge', {
          scrollTrigger: {
            trigger: coupleGridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          scale: 0,
          rotation: -45,
          opacity: 0,
          duration: 0.7,
          delay: 0.2,
          ease: 'back.out(2)',
        });
      });
    },
    { dependencies: [isOpened], scope: archRef },
  );

  return (
    <section
      ref={archRef}
      className="relative pt-2 sm:pt-4 pb-4 sm:pb-6 px-3 sm:px-6 max-w-2xl sm:max-w-3xl mx-auto my-1 overflow-visible"
    >
      {/* KARTU TUNGGAL GERBANG KUBAH LENGKUNG PENUH (Continuous Cathedral Arch Portal) */}
      <div className="relative p-5 sm:p-8 md:p-10 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 md:pb-28 cathedral-arch-portal luxury-pearl-card shadow-luxury border border-gold/45 flex flex-col items-center text-center overflow-hidden will-change-transform">
        {/* Garis Border Ganda Bagian Dalam (Concentric Continuous Arch Hairlines) */}
        <div className="absolute inset-2.5 sm:inset-3.5 cathedral-arch-inner-solid border border-gold/30 pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 cathedral-arch-inner-dashed border border-dashed border-gold/20 pointer-events-none" />

        {/* Watermark Siluet Flora Alam Tipis di 4 Sudut Kubah */}
        <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.14] -top-2 -right-2 pointer-events-none" />
        <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.14] -top-2 -left-2 transform scale-x-[-1] pointer-events-none" />
        <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.14] -bottom-2 -right-2 pointer-events-none" />
        <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.14] -bottom-2 -left-2 transform scale-x-[-1] pointer-events-none" />

        {/* 1. BAGIAN AYAT AL-QUR'AN / KUTIPAN PERNIKAHAN */}
        {(config.quote?.arabic ||
          config.quote?.translation ||
          config.quote?.bismillah ||
          config.greeting?.bismillah) && (
          <div className="relative z-10 max-w-xl mx-auto mb-4">
            {(config.quote?.bismillah || config.greeting?.bismillah) && (
              <p
                className="sacred-bismillah will-change-transform font-['Amiri',_serif] text-xl sm:text-2xl text-gold leading-relaxed mb-2 font-normal"
                dir="rtl"
              >
                {config.quote?.bismillah || config.greeting?.bismillah}
              </p>
            )}

            {/* Kaligrafi Arab (Jika Ada) */}
            {config.quote?.arabic && (
              <p
                className="sacred-arabic-verse will-change-transform font-['Amiri',_serif] text-2xl sm:text-3xl text-primary leading-[2.2] my-2.5 sm:my-3 font-normal px-2 sm:px-6"
                dir="rtl"
              >
                {config.quote.arabic}
              </p>
            )}

            <div className="sacred-divider-1 will-change-transform origin-center">
              <FloralDivider className="w-32 h-5 text-gold mx-auto my-2 opacity-90" />
            </div>

            {/* Terjemahan Ayat / Kutipan */}
            {config.quote?.translation && (
              <p className="sacred-translation will-change-transform text-scale-small sm:text-scale-p text-muted leading-relaxed italic px-3 sm:px-6 max-w-lg mx-auto">
                "{config.quote.translation}"
              </p>
            )}

            {config.quote?.source && (
              <p className="sacred-source will-change-transform text-scale-xs font-semibold text-secondary tracking-[0.25em] uppercase mt-2.5">
                — {config.quote.source} —
              </p>
            )}

            {/* Pembatas setelah kutipan / QS. Ar-Rum: 21 */}
            <div className="sacred-divider-2 will-change-transform origin-center">
              <FloralDivider className="w-32 h-5 text-gold mx-auto mt-4 opacity-90" />
            </div>
          </div>
        )}

        {/* 3. SALAM & SAMBUTAN MEMPELAI */}
        <div className="relative z-10 mb-4 max-w-lg mx-auto">
          {config.greeting?.salam && (
            <span className="sacred-salam will-change-transform text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
              {config.greeting.salam}
            </span>
          )}
          <p className="sacred-intro will-change-transform text-scale-small text-muted max-w-md mx-auto leading-relaxed px-2 mb-2">
            {config.greeting?.introText ||
              'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:'}
          </p>

          {/* Pembatas dipindahkan ke bawah teks intro */}
          <div className="sacred-divider-3 will-change-transform origin-center">
            <FloralDivider className="w-32 h-5 text-gold mx-auto my-2" />
          </div>

          <div className="mt-2.5">
            <OrganicTitleBadge title="Mempelai Pengantin" />
          </div>
        </div>

        {/* 5. ILUSTRASI PASANGAN "TOGETHER IN LOVE" */}
        <div className="couple-avatar-wrap will-change-transform relative z-10 my-3 sm:my-4">
          <CoupleAvatar />
        </div>

        {/* 6. PROFIL MEMPELAI WANITA & MEMPELAI PRIA (Mempelai Wanita Dahulu) */}
        <div className="relative z-10 w-full max-w-xl mx-auto mt-3 sm:mt-4 mb-3 px-1.5 sm:px-3">
          <div
            ref={coupleGridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative"
          >
            {/* Kartu Profil Mempelai Wanita */}
            <div className="bride-profile-card will-change-transform group relative p-6 pt-7 pb-6 rounded-3xl bg-white/75 border border-gold/35 shadow-2xs backdrop-blur-xs flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
              {/* Garis Border Inset */}
              <div className="absolute inset-2 rounded-2xl border border-gold/20 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center mb-1">
                <span className="text-scale-xs tracking-widest uppercase font-semibold text-secondary block mb-1.5">
                  Mempelai Wanita
                </span>
                <h3 className="font-serif text-[21px] sm:text-scale-h4 md:text-scale-h3 font-bold text-primary mb-2">
                  {config.bride?.fullName}
                </h3>
                <p className="text-scale-small text-muted leading-relaxed mb-4 px-1">
                  {config.bride?.parents}
                </p>
              </div>

              {config.bride?.showInstagram !== false &&
                config.bride?.instagram && (
                  <a
                    href={config.bride.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-scale-xs font-semibold text-secondary bg-white hover:bg-gold hover:text-white transition-all border border-gold/35 shadow-2xs group-hover:border-gold"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-gold group-hover:text-white" />
                    <span>{config.bride?.shortName}</span>
                  </a>
                )}
            </div>

            {/* Medallion Ampersand (&) di Tengah */}
            <div className="ampersand-badge will-change-transform hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gold/60 shadow-soft items-center justify-center font-serif text-gold font-bold text-sm">
              &
            </div>

            {/* Pemisah Ampersand untuk Mobile */}
            <div className="ampersand-badge will-change-transform md:hidden flex items-center justify-center gap-3 my-0.5">
              <div className="flex-1 h-px bg-gold/25" />
              <div className="w-7 h-7 rounded-full bg-white border border-gold/60 shadow-2xs flex items-center justify-center font-serif text-gold font-bold text-xs">
                &
              </div>
              <div className="flex-1 h-px bg-gold/25" />
            </div>

            {/* Kartu Profil Mempelai Pria */}
            <div className="groom-profile-card will-change-transform group relative p-6 pt-7 pb-6 rounded-3xl bg-white/75 border border-gold/35 shadow-2xs backdrop-blur-xs flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
              {/* Garis Border Inset */}
              <div className="absolute inset-2 rounded-2xl border border-gold/20 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center mb-1">
                <span className="text-scale-xs tracking-widest uppercase font-semibold text-secondary block mb-1.5">
                  Mempelai Pria
                </span>
                <h3 className="font-serif text-[21px] sm:text-scale-h4 md:text-scale-h3 font-bold text-primary mb-2">
                  {config.groom?.fullName}
                </h3>
                <p className="text-scale-small text-muted leading-relaxed mb-4 px-1">
                  {config.groom?.parents}
                </p>
              </div>

              {config.groom?.showInstagram !== false &&
                config.groom?.instagram && (
                  <a
                    href={config.groom.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-scale-xs font-semibold text-secondary bg-white hover:bg-gold hover:text-white transition-all border border-gold/35 shadow-2xs group-hover:border-gold"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-gold group-hover:text-white" />
                    <span>{config.groom?.shortName}</span>
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
