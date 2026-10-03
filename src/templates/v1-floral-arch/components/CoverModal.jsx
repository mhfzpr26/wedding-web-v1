import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MailOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import { FloralCornerBunch, FloralDivider } from '../assets/VectorOrnaments';
import { FallingLeaves } from './FallingLeaves';

gsap.registerPlugin(ScrollTrigger);

export const CoverModal = () => {
  const { config, guestName, isOpened, openInvitation } = useWedding();
  const [isOpening, setIsOpening] = useState(false);
  const [isFullyExited, setIsFullyExited] = useState(isOpened);

  const coverRef = useRef(null);
  const contentRef = useRef(null);
  const cornerTRRef = useRef(null);
  const cornerBLRef = useRef(null);

  // Kunci scroll halaman web sepenuhnya selama cover belum selesai meluncur keluar
  useEffect(() => {
    if (!isFullyExited) {
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
  }, [isFullyExited]);

  const handleOpen = () => {
    if (isOpening || isFullyExited) return;
    setIsOpening(true);

    // 1. Putar musik latar & tandai status terbuka di context
    openInvitation();

    // 2. Animasi Transisi Sinematik Curtain Glide-Up (Tirai Meluncur Anggun ke Atas)
    // Seluruh elemen cover, bunga sudut, teks, dan kartu bergerak utuh tanpa ada yang lenyap mendadak
    const tl = gsap.timeline({
      onComplete: () => {
        setIsFullyExited(true);
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 60);
      },
    });

    // Konten teks & kartu bergerak sedikit melayang ke atas memberi kedalaman ruang (parallax)
    tl.to(
      contentRef.current,
      {
        y: -35,
        duration: 1.15,
        ease: 'power3.inOut',
      },
      0,
    )
      // Seluruh layar cover meluncur anggun ke atas keluar layar (seperti kartu ditarik dari amplop)
      .to(
        coverRef.current,
        {
          yPercent: -100,
          duration: 1.15,
          ease: 'power3.inOut',
        },
        0,
      );
  };

  if (isFullyExited) {
    return null;
  }

  return (
    <div
      ref={coverRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 cover-backdrop-primary overflow-hidden will-change-transform select-none shadow-[0_25px_60px_rgba(0,0,0,0.65)] border-b border-gold/40 ${
        isOpened ? 'pointer-events-none' : ''
      }`}
      style={{
        minHeight: '100dvh',
        height: '100dvh',
      }}
      onTouchMove={(e) => {
        // Cegah gesture scroll tembus sebelum cover selesai keluar
        if (!isFullyExited && e.cancelable) e.preventDefault();
      }}
    >
      {/* 1. Tekstur Halus Royal Gold Lace Pattern di atas Background Primary */}
      <div className="absolute inset-0 cover-pattern-overlay-dark pointer-events-none" />

      {/* 2. Ambient Radiant Glows (Pencahayaan Hangat Mewah) */}
      <div className="absolute -top-20 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-primary-light/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[560px] h-80 sm:h-[560px] rounded-full bg-primary-light/25 blur-2xl pointer-events-none" />

      {/* 3. Efek Partikel Daun Emas Gugur Melayang 3D (Falling Golden Botanical Leaves) */}
      <div className="absolute inset-0 pointer-events-none">
        <FallingLeaves />
      </div>

      {/* 4. Ornamen Buket Bunga Transparan di 2 SUDUT BERLAWANAN secara Simetris */}
      {/* Sudut 1: Kanan Atas */}
      <div
        ref={cornerTRRef}
        className="cover-floral-corner-tr drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
      >
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* Sudut 2: Kiri Bawah */}
      <div
        ref={cornerBLRef}
        className="cover-floral-corner-bl drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
      >
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* 5. Konten Cover Utuh (Frameless & Bersih) */}
      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-xl mx-auto my-auto text-center px-4 py-6 flex flex-col items-center justify-center will-change-transform"
      >
        <p className="text-scale-xs uppercase tracking-[0.35em] text-[#E5C77A] font-medium mb-1">
          {config.monogram?.tagline || 'The Wedding of'}
        </p>

        {/* Nama Mempelai Megah (Destia & Raka - Mempelai Wanita Lebih Dahulu) */}
        <h1 className="font-serif text-scale-h2 sm:text-scale-h1 text-white font-bold tracking-tight my-1.5 sm:my-2 drop-shadow-md">
          {config.bride.shortName}{' '}
          <span className="font-script text-scale-h2 sm:text-scale-h1 text-gold font-normal px-1">
            &
          </span>{' '}
          {config.groom.shortName}
        </h1>

        <FloralDivider className="w-36 sm:w-44 h-5 sm:h-6 text-gold my-2 opacity-90" />

        <p className="text-scale-small sm:text-scale-p text-slate-100 tracking-wider font-light mb-4 sm:mb-5">
          {config.events[0]?.dateFormatted}
        </p>

        {/* Kotak Nama Tamu Personal (Glassmorphic Halus & Mewah) */}
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

        {/* Tombol Buka Undangan (Gold Ochre Bercahaya / Stand Out) */}
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-primary font-bold text-scale-small sm:text-scale-p tracking-wider shadow-[0_10px_25px_rgba(168,127,1,0.4)] hover:shadow-[0_10px_35px_rgba(220,182,88,0.65)] hover:scale-105 active:scale-95 disabled:pointer-events-none transition-all duration-300 mt-4 border border-white/30 cursor-pointer"
        >
          <MailOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </div>
  );
};
