import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { FloatingMusic } from '../../components/common/FloatingMusic';
import { useWedding } from '../../context/WeddingContext';
import { CathedralArchBackdrop } from './components/CathedralArchBackdrop';
import { CharacterArch } from './components/CharacterArch';
import { CoverModal } from './components/CoverModal';
import { DigitalGift } from './components/DigitalGift';
import { EventSection } from './components/EventSection';
import { FooterSection } from './components/FooterSection';
import { GallerySection } from './components/GallerySection';
import { RSVPSection } from './components/RSVPSection';
import { StorySection } from './components/StorySection';
import { TopMonogram } from './components/TopMonogram';

gsap.registerPlugin(ScrollTrigger);

const TemplateV1FloralArch = () => {
  const { isOpened } = useWedding();
  const mainRef = useRef(null);

  // Animasi counter-rise lembut menyambut pembukaan cover undangan
  useEffect(() => {
    if (isOpened && mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { y: 35, opacity: 0.95 },
        {
          y: 0,
          opacity: 1,
          duration: 1.65,
          ease: 'power2.out',
          onComplete: () => {
            // Segarkan posisi ScrollTrigger agar kalkulasi titik scroll akurat
            ScrollTrigger.refresh();
          },
        },
      );
    }
  }, [isOpened]);

  return (
    <div
      className={`relative min-h-screen min-h-[100dvh] bg-base overflow-x-clip ${!isOpened ? 'h-[100dvh] overflow-hidden' : ''} selection:bg-gold selection:text-white transition-colors duration-500`}
    >
      {/* Dynamic Fine-Art Cotton Paper Backdrop with Grand Cathedral Arch Watermark */}
      <div className="fixed inset-0 fine-art-paper-bg pointer-events-none transition-colors duration-700" />
      <CathedralArchBackdrop />
      <div className="fixed inset-0 fine-art-paper-texture pointer-events-none opacity-45" />

      {/* 1. Cover Modal (Halaman Pembuka & Unlock Audio) */}
      <CoverModal />

      {/* 2. Floating Music Controller */}
      <FloatingMusic />

      {/* 3. Konten Utama Undangan (Setelah Dibuka) */}
      <main
        ref={mainRef}
        className={`relative z-10 overflow-x-clip ${!isOpened ? 'hidden' : 'block'}`}
      >
        {/* Layer Depan: Kartu Utama dengan ujung bawah membulat & bayangan elevasi 3D */}
        <div className="relative z-10 bg-base pb-6 rounded-b-[36px] sm:rounded-b-[48px] shadow-[0_30px_60px_-15px_rgba(13,26,58,0.35)] border-b border-gold/35 overflow-hidden">
          {/* MASTER RESPONSIVE WATERCOLOR BACKGROUND SYSTEM */}
          <div
            className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
            style={{
              maskImage:
                'linear-gradient(to bottom, black calc(100% - 160px), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black calc(100% - 160px), transparent 100%)',
            }}
          >
            {/* 1. Top Hero Monogram Crown Aura */}
            <div
              className="absolute top-0 left-0 right-0 h-[650px] sm:h-[750px] pointer-events-none mix-blend-multiply opacity-40 select-none"
              style={{
                backgroundImage:
                  'url(/images/ornaments/invatera-seamless-wash.webp)',
                backgroundPosition: 'top center',
                backgroundSize: '100% auto',
                backgroundRepeat: 'no-repeat',
                maskImage:
                  'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 50%, transparent 100%)',
              }}
            />

            {/* 2. Left Flank / Wing (Seamless vertical repeat, perfectly soft inward fade) */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[60vw] max-w-[650px] pointer-events-none mix-blend-multiply opacity-35 select-none"
              style={{
                backgroundImage:
                  'url(/images/ornaments/watercolor-wing-left.webp)',
                backgroundPosition: 'left top',
                backgroundRepeat: 'repeat-y',
                backgroundSize: 'clamp(380px, 50vw, 600px) auto',
                maskImage:
                  'linear-gradient(to right, black 25%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, black 25%, transparent 100%)',
              }}
            />

            {/* 3. Right Flank / Wing (Seamless vertical repeat, perfectly soft inward fade) */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[60vw] max-w-[650px] pointer-events-none mix-blend-multiply opacity-35 select-none"
              style={{
                backgroundImage:
                  'url(/images/ornaments/watercolor-wing-right.webp)',
                backgroundPosition: 'right top',
                backgroundRepeat: 'repeat-y',
                backgroundSize: 'clamp(380px, 50vw, 600px) auto',
                maskImage:
                  'linear-gradient(to left, black 25%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to left, black 25%, transparent 100%)',
              }}
            />
          </div>

          {/* Section 1: Monogram & Profil Mempelai */}
          <div className="relative z-10 w-full">
            <TopMonogram />
            <CharacterArch />
          </div>

          {/* Section 2: Rangkaian Acara & Countdown Timer */}
          <div className="relative z-10 w-full">
            <EventSection />
          </div>

          {/* Section 3: Kisah Cinta (Story Timeline) */}
          <div className="relative z-10 w-full">
            <StorySection />
          </div>

          {/* Section 4: Galeri Foto & Video Prewedding */}
          <div className="relative z-10 w-full">
            <GallerySection />
          </div>

          {/* Section 5: Hadiah Digital & Buku Tamu / RSVP */}
          <div className="relative z-10 w-full">
            <DigitalGift />
            <RSVPSection />
          </div>
        </div>

        {/* Section 6: Penutup & Ucapan Terima Kasih (Footer) */}
        <div className="relative z-10">
          <FooterSection />
        </div>
      </main>
    </div>
  );
};

export default TemplateV1FloralArch;
