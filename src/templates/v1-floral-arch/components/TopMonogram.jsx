import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useWedding } from '../../../context/WeddingContext';

export const TopMonogram = () => {
  const { config, isOpened } = useWedding();
  const monogramRef = useRef(null);

  const monogram = config.monogram || {
    enabled: true,
    useCustomInitials: false,
    customInitials: 'D & R',
    separator: '&',
    tagline: 'The Wedding of',
    showTagline: true,
    showDate: false,
  };

  useGSAP(
    () => {
      if (!isOpened) return;

      const tl = gsap.timeline({
        delay: 0.55,
      });

      // 1. Pendar ambient emas membesar perlahan
      tl.fromTo(
        '.monogram-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, ease: 'power2.out' },
        0,
      )
        // 2. Tagline muncul dari atas
        .fromTo(
          '.monogram-tagline',
          { y: -12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          0.15,
        )
        // 3. Huruf Mempelai 1 meluncur turun dari atas
        .fromTo(
          '.monogram-char-1',
          { y: -22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0.25,
        )
        // 4. Huruf Mempelai 2 meluncur naik dari bawah
        .fromTo(
          '.monogram-char-2',
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0.3,
        )
        // 5. Simbol pemisah meletup anggun di tengah
        .fromTo(
          '.monogram-sep',
          { scale: 0.35, rotation: -12, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'back.out(1.8)',
            clearProps: 'transform',
          },
          0.45,
        )
        // 6. Tanggal muncul
        .fromTo(
          '.monogram-date',
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          0.6,
        );

      // 7. Ambient Breathing & Floating Lembut Berkelanjutan (Layar Terasa Hidup & Bernapas)
      gsap.to('.monogram-glow', {
        scale: 1.15,
        opacity: 0.28,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });

      gsap.to('.monogram-char-1', {
        y: -3,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });

      gsap.to('.monogram-char-2', {
        y: 3,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });

      gsap.to('.monogram-sep', {
        scale: 1.08,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        repeatDelay: 2.5,
        ease: 'power2.inOut',
        delay: 2.2,
      });
    },
    { dependencies: [isOpened], scope: monogramRef },
  );

  if (!monogram.enabled) return null;

  // Tentukan teks inisial mempelai otomatis (Mempelai Wanita Dahulu)
  const brideInitial = config.bride?.shortName
    ? config.bride.shortName.charAt(0).toUpperCase()
    : 'D';
  const groomInitial = config.groom?.shortName
    ? config.groom.shortName.charAt(0).toUpperCase()
    : 'R';

  // Karakter pemisah selalu merujuk ke konfigurasi monogram pilihan admin (default: '&')
  const activeSeparator = monogram.separator || '&';

  // Ekstraksi inisial (Mempelai Wanita di Atas, Mempelai Pria di Bawah)
  let firstInitial = brideInitial;
  let secondInitial = groomInitial;

  if (monogram.useCustomInitials && monogram.customInitials) {
    const raw = monogram.customInitials.trim();
    // Pisahkan jika format custom berisi inisial
    const match = raw.match(
      /^([A-Za-z0-9]+)\s*([&•♥|–—\-+])?\s*([A-Za-z0-9]+)?$/,
    );
    if (match) {
      firstInitial = match[1] || firstInitial;
      if (match[3]) secondInitial = match[3];
    } else {
      const parts = raw.split(/\s+/);
      if (parts.length >= 2) {
        firstInitial = parts[0];
        secondInitial = parts[1];
      }
    }
  }

  return (
    <section
      ref={monogramRef}
      className="relative pt-6 sm:pt-10 md:pt-14 pb-2 px-4 max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center select-none overflow-visible"
    >
      {/* 1. Ambient Glow Emas Lembut di Belakang Inisial */}
      <div className="monogram-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 md:w-72 h-28 sm:h-36 md:h-44 rounded-full bg-gold/10 blur-2xl pointer-events-none -z-10" />

      {/* 2. Tagline Atas */}
      {monogram.showTagline && monogram.tagline && (
        <div className="monogram-tagline relative z-10 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-scale-xs uppercase tracking-[0.4em] text-secondary font-semibold pl-[0.4em]">
            {monogram.tagline}
          </span>
        </div>
      )}

      {/* 3. INISIAL NAMA PASANGAN ASIMETRIS (HURUF 1 DI ATAS, HURUF 2 DI BAWAH) - RESPONSIVE MOBILE & DESKTOP */}
      <div className="relative z-10 inline-flex items-center justify-center py-2 sm:py-4 md:py-5 px-4 sm:px-6">
        <div className="flex items-center justify-center -space-x-1 sm:-space-x-2 md:-space-x-3">
          {/* Huruf Mempelai 1: Naik Nyata ke Atas (Asimetris Permanen) */}
          <span className="relative -translate-y-5 sm:-translate-y-7 md:-translate-y-9 inline-block">
            <span className="monogram-char-1 inline-block font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight drop-shadow-[0_4px_14px_rgba(40,54,95,0.18)] select-none">
              {firstInitial}
            </span>
          </span>

          {/* Simbol Pemisah / Ampersand Anggun di Tengah */}
          <span className="monogram-sep relative inline-flex items-center justify-center z-10">
            {activeSeparator === '&' ? (
              <span className="font-['Great_Vibes'] text-4xl sm:text-5xl md:text-6xl text-gold font-normal px-1.5 sm:px-2.5 select-none drop-shadow-2xs leading-none">
                &
              </span>
            ) : activeSeparator === '•' ? (
              <span className="text-gold text-2xl sm:text-3xl md:text-4xl px-2 font-bold select-none leading-none">
                •
              </span>
            ) : activeSeparator === '♥' ? (
              <span className="text-gold text-xl sm:text-2xl md:text-3xl px-2 select-none leading-none">
                ♥
              </span>
            ) : (
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold font-light px-2 select-none leading-none">
                {activeSeparator}
              </span>
            )}
          </span>

          {/* Huruf Mempelai 2: Turun Nyata ke Bawah (Asimetris Permanen) */}
          <span className="relative translate-y-4 sm:translate-y-5 md:translate-y-7 inline-block">
            <span className="monogram-char-2 inline-block font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight drop-shadow-[0_4px_14px_rgba(40,54,95,0.18)] select-none">
              {secondInitial}
            </span>
          </span>
        </div>
      </div>

      {/* 4. Tanggal / Subtitle Bawah (Opsional) */}
      {monogram.showDate && config.events?.[0]?.dateFormatted && (
        <div className="monogram-date relative z-10 mt-2">
          <p className="text-[10px] sm:text-scale-xs text-muted tracking-widest font-medium">
            {config.events[0].dateFormatted}
          </p>
        </div>
      )}
    </section>
  );
};
