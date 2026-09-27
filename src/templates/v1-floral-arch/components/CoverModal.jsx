import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { MailOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import { FloralCornerBunch, FloralDivider } from '../assets/VectorOrnaments';
import { FallingLeaves } from './FallingLeaves';

export const CoverModal = () => {
  const { config, guestName, isOpened, openInvitation } = useWedding();
  const [isFullyExited, setIsFullyExited] = useState(isOpened);

  const containerRef = useRef(null);
  const leftGateRef = useRef(null);
  const rightGateRef = useRef(null);
  const centerSeamRef = useRef(null);
  const contentRef = useRef(null);
  const cornerTopRightRef = useRef(null);
  const cornerBottomLeftRef = useRef(null);

  // Kunci scroll halaman web sepenuhnya selama cover belum dibuka
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
  }, [isOpened]);

  const handleOpen = () => {
    // 1. Letusan confetti elegan bertema Navy & Emas
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#28365F', '#A87F01', '#CAD6E4', '#F0F4F9', '#FFFFFF'],
      ticks: 180,
      gravity: 1.1,
      decay: 0.92,
      scalar: 0.85,
    });

    // 2. Mainkan musik latar sesaat sebelum tirai terbuka
    openInvitation();

    // 3. GSAP Grand Palace Gate Opening Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsFullyExited(true);
      },
    });

    // Teks dan tombol melayang naik dengan fade halus
    tl.to(contentRef.current, {
      y: -30,
      opacity: 0,
      scale: 0.96,
      duration: 0.45,
      ease: 'power2.in',
    })
      // Ornamen buket bunga sudut meluncur keluar
      .to(
        cornerTopRightRef.current,
        { x: 70, y: -70, opacity: 0, duration: 0.65, ease: 'power2.in' },
        '-=0.25',
      )
      .to(
        cornerBottomLeftRef.current,
        { x: -70, y: 70, opacity: 0, duration: 0.65, ease: 'power2.in' },
        '<',
      )
      // Garis tengah emas memudar
      .to(centerSeamRef.current, { opacity: 0, duration: 0.3 }, '-=0.35')
      // Pintu gerbang kerajaan kiri & kanan terbelah membuka secara megah
      .to(
        leftGateRef.current,
        {
          xPercent: -102,
          duration: 1.15,
          ease: 'power4.inOut',
        },
        '-=0.15',
      )
      .to(
        rightGateRef.current,
        {
          xPercent: 102,
          duration: 1.15,
          ease: 'power4.inOut',
        },
        '<',
      );
  };

  if (isFullyExited) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden select-none"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
      }}
      onTouchMove={(e) => {
        if (!isOpened && e.cancelable) e.preventDefault();
      }}
    >
      {/* PINTU GERBANG KIRI (Left Royal Gate) */}
      <div
        ref={leftGateRef}
        className="fixed top-0 left-0 w-1/2 h-full z-40 cover-backdrop-primary overflow-hidden border-r border-gold/30 shadow-[12px_0_35px_rgba(0,0,0,0.3)] will-change-transform"
      >
        <div className="absolute inset-0 cover-pattern-overlay-dark pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-80 sm:w-[560px] h-80 sm:h-[560px] rounded-full bg-primary-light/25 blur-2xl pointer-events-none" />
      </div>

      {/* PINTU GERBANG KANAN (Right Royal Gate) */}
      <div
        ref={rightGateRef}
        className="fixed top-0 right-0 w-1/2 h-full z-40 cover-backdrop-primary overflow-hidden border-l border-gold/30 shadow-[-12px_0_35px_rgba(0,0,0,0.3)] will-change-transform"
      >
        <div className="absolute inset-0 cover-pattern-overlay-dark pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-primary-light/40 blur-3xl pointer-events-none" />
      </div>

      {/* GARIS EMAS PEMISAH DI TENGAH GERBANG (Center Golden Hairline) */}
      <div
        ref={centerSeamRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full z-42 bg-gradient-to-b from-transparent via-gold/60 to-transparent pointer-events-none"
      />

      {/* PARTIKEL DAUN EMAS MELAYANG */}
      <div className="fixed inset-0 z-45 pointer-events-none">
        <FallingLeaves />
      </div>

      {/* ORNAMEN BUKET BUNGA SUDUT KANAN ATAS */}
      <div
        ref={cornerTopRightRef}
        className="cover-floral-corner-tr drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] z-46 pointer-events-none will-change-transform"
      >
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* ORNAMEN BUKET BUNGA SUDUT KIRI BAWAH */}
      <div
        ref={cornerBottomLeftRef}
        className="cover-floral-corner-bl drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] z-46 pointer-events-none will-change-transform"
      >
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* KONTEN COVER DI TENGAH (Frameless Royal Typography) */}
      <div
        ref={contentRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none will-change-transform"
      >
        <div className="relative w-full max-w-xl mx-auto my-auto text-center px-4 py-6 flex flex-col items-center justify-center pointer-events-auto">
          <p className="text-scale-xs uppercase tracking-[0.35em] text-[#E5C77A] font-medium mb-1">
            {config.monogram?.tagline || 'The Wedding of'}
          </p>

          {/* Nama Mempelai Megah (Putih & Emas Bersinar di atas Navy) */}
          <h1 className="font-serif text-[30px] sm:text-scale-h2 md:text-scale-h1 text-white font-bold tracking-tight my-1.5 sm:my-2 drop-shadow-md">
            {config.bride.shortName}{' '}
            <span className="font-script text-[32px] sm:text-scale-h2 md:text-scale-h1 text-gold font-normal px-1">
              &
            </span>{' '}
            {config.groom.shortName}
          </h1>

          <FloralDivider className="w-36 sm:w-44 h-5 sm:h-6 text-gold my-2 opacity-90" />

          <p className="text-scale-small sm:text-scale-p text-slate-100 tracking-wider font-light mb-4 sm:mb-5">
            {config.events[0]?.dateFormatted}
          </p>

          {/* Kotak Nama Tamu Personal */}
          <div className="w-full max-w-xs sm:max-w-sm mx-auto my-2 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-center">
            <p className="text-scale-xs text-slate-200 tracking-widest uppercase mb-1 font-medium">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <p className="font-serif text-scale-h5 sm:text-scale-h4 font-bold text-white tracking-wide my-0.5">
              {guestName}
            </p>
            <p className="text-scale-xs text-[#E5C77A] tracking-wider font-medium">
              di Tempat
            </p>
          </div>

          {/* Tombol Buka Undangan (Gold Ochre Bercahaya) */}
          <button
            onClick={handleOpen}
            className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-primary font-bold text-scale-small sm:text-scale-p tracking-wider shadow-[0_10px_25px_rgba(168,127,1,0.4)] hover:shadow-[0_10px_35px_rgba(220,182,88,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 mt-4 border border-white/30 cursor-pointer"
          >
            <MailOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
