import confetti from 'canvas-confetti';
import { MailOpen } from 'lucide-react';
import React, { useEffect } from 'react';
import { useWedding } from '../../../context/WeddingContext';
import { FloralCornerBunch, FloralDivider } from '../assets/VectorOrnaments';
import { FallingLeaves } from './FallingLeaves';

export const CoverModal = () => {
  const { config, guestName, isOpened, openInvitation } = useWedding();
  const [isFullyExited, setIsFullyExited] = React.useState(false);

  // Kunci scroll halaman web sepenuhnya selama cover belum dibuka & pastikan background menyatu tanpa celah
  useEffect(() => {
    if (!isOpened) {
      setIsFullyExited(false);
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.backgroundColor = '#13255A';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.backgroundColor = '#13255A';

      return () => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.backgroundColor = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.backgroundColor = '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.backgroundColor = '';

      // Setelah animasi slide-up (1000ms) selesai, unmount cover agar tidak menghalangi gesture scroll/touch
      const timer = setTimeout(() => {
        setIsFullyExited(true);
      }, 1050);
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  const handleOpen = () => {
    // Letusan confetti elegan yang otomatis lenyap bersih dalam 2.5 detik
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#28365F', '#A87F01', '#CAD6E4', '#F0F4F9', '#FFFFFF'],
      ticks: 180, // Partikel segera hilang tanpa sisa di layar
      gravity: 1.1,
      decay: 0.92,
      scalar: 0.85,
    });

    openInvitation();
  };

  if (isFullyExited) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 cover-backdrop-primary overflow-hidden transition-all duration-1000 ease-in-out ${
        isOpened
          ? '-translate-y-full opacity-0 pointer-events-none select-none invisible'
          : 'translate-y-0 opacity-100'
      }`}
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        touchAction: isOpened ? 'auto' : 'none',
      }}
      onTouchMove={(e) => {
        // Cegah gesture scroll tembus ke background sebelum cover dibuka
        if (!isOpened && e.cancelable) e.preventDefault();
      }}
    >
      {/* 1. Tekstur Halus Royal Gold Lace Pattern di atas Background Primary */}
      <div className="absolute inset-0 cover-pattern-overlay-dark pointer-events-none" />

      {/* 2. Ambient Radiant Glows (Pencahayaan Hangat Mewah) */}
      <div className="absolute -top-20 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-primary-light/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[560px] h-80 sm:h-[560px] rounded-full bg-primary-light/25 blur-2xl pointer-events-none" />

      {/* 3. Efek Partikel Daun Emas Gugur Melayang 3D (Falling Golden Botanical Leaves) */}
      <FallingLeaves />

      {/* 4. Ornamen Buket Bunga Transparan di 2 SUDUT BERLAWANAN secara Simetris (Living Botanical Sway) */}
      {/* Sudut 1: Kanan Atas - Menempel pas di sudut kanan atas */}
      <div className="cover-floral-corner-tr drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]">
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* Sudut 2: Kiri Bawah - Menempel pas di sudut kiri bawah secara simetris */}
      <div className="cover-floral-corner-bl drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]">
        <FloralCornerBunch className="w-full h-auto" />
      </div>

      {/* 5. KONTEN COVER POLOS (TANPA KOTAK CARD / FRAMELESS) */}
      <div className="relative z-20 w-full max-w-xl mx-auto my-auto text-center px-4 py-6 flex flex-col items-center justify-center">
        <p className="text-scale-xs uppercase tracking-[0.35em] text-[#E5C77A] font-medium mb-1">
          {config.monogram?.tagline || 'The Wedding of'}
        </p>

        {/* Nama Mempelai Megah (Putih & Emas Bersinar di atas Navy) */}
        <h1 className="font-serif text-scale-h2 sm:text-scale-h1 text-white font-bold tracking-tight my-1.5 sm:my-2 drop-shadow-md">
          {config.groom.shortName}{' '}
          <span className="font-script text-scale-h2 sm:text-scale-h1 text-gold font-normal px-1">
            &
          </span>{' '}
          {config.bride.shortName}
        </h1>

        <FloralDivider className="w-36 sm:w-44 h-5 sm:h-6 text-gold my-2 opacity-90" />

        <p className="text-scale-small sm:text-scale-p text-slate-100 tracking-wider font-light mb-4 sm:mb-5">
          {config.events[0]?.dateFormatted}
        </p>

        {/* Kotak Nama Tamu Personal (Glassmorphic Halus & Mewah, Menyatu dengan Background) */}
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
          className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-primary font-bold text-scale-small sm:text-scale-p tracking-wider shadow-[0_10px_25px_rgba(168,127,1,0.4)] hover:shadow-[0_10px_35px_rgba(220,182,88,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 mt-4 border border-white/30 cursor-pointer"
        >
          <MailOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </div>
  );
};
