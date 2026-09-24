import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';

export const TopMonogram = () => {
  const { config } = useWedding();

  const monogram = config.monogram || {
    enabled: true,
    useCustomInitials: false,
    customInitials: 'K & S',
    separator: '&',
    tagline: 'The Wedding of',
    showTagline: true,
    showDate: false,
  };

  if (!monogram.enabled) return null;

  // Tentukan teks inisial
  const groomInitial = config.groom?.shortName
    ? config.groom.shortName.charAt(0).toUpperCase()
    : 'K';
  const brideInitial = config.bride?.shortName
    ? config.bride.shortName.charAt(0).toUpperCase()
    : 'S';
  const separator = monogram.separator || '&';

  return (
    <section className="relative pt-12 sm:pt-16 pb-4 px-4 max-w-sm sm:max-w-md mx-auto text-center select-none overflow-visible">
      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        {/* 1. Ambient Glow Emas Lembut di Belakang Inisial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 h-28 sm:h-36 rounded-full bg-gold/10 blur-2xl pointer-events-none -z-10" />

        {/* 2. Tagline Atas */}
        {monogram.showTagline && monogram.tagline && (
          <div className="relative z-10 mb-4 sm:mb-5">
            <span className="text-[10px] sm:text-scale-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              {monogram.tagline}
            </span>
          </div>
        )}

        {/* 3. INISIAL NAMA PASANGAN ASIMETRIS (HURUF 1 KE ATAS SEDIKIT, HURUF 2 KE BAWAH SEDIKIT) */}
        <div className="relative z-10 inline-flex items-center justify-center py-2 sm:py-3 px-4">
          {monogram.useCustomInitials ? (
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-primary drop-shadow-[0_3px_10px_rgba(40,54,95,0.14)]">
              {monogram.customInitials}
            </h2>
          ) : (
            <div className="flex items-center justify-center gap-0.5 sm:gap-1.5">
              {/* Huruf Mempelai 1: Naik Lebih Terlihat ke Atas */}
              <span className="relative -translate-y-4 sm:-translate-y-5 font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight drop-shadow-[0_4px_12px_rgba(40,54,95,0.15)] transition-transform duration-300">
                {groomInitial}
              </span>

              {/* Simbol Pemisah / Ampersand Anggun di Tengah */}
              {separator === '&' ? (
                <span className="font-['Great_Vibes'] text-4xl sm:text-5xl md:text-6xl text-gold font-normal px-1 sm:px-2 z-10 select-none drop-shadow-2xs">
                  &
                </span>
              ) : separator === '•' ? (
                <span className="text-gold text-2xl sm:text-3xl px-1.5 font-bold select-none">
                  •
                </span>
              ) : separator === '♥' ? (
                <span className="text-gold text-xl sm:text-2xl px-1.5 select-none">
                  ♥
                </span>
              ) : (
                <span className="font-serif text-3xl sm:text-4xl text-gold font-light px-2 select-none">
                  {separator}
                </span>
              )}

              {/* Huruf Mempelai 2: Turun Sedikit ke Bawah */}
              <span className="relative translate-y-2.5 sm:translate-y-3.5 font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight drop-shadow-[0_4px_12px_rgba(40,54,95,0.15)] transition-transform duration-300">
                {brideInitial}
              </span>
            </div>
          )}
        </div>

        {/* 4. Tanggal / Subtitle Bawah (Opsional) */}
        {monogram.showDate && config.events?.[0]?.dateFormatted && (
          <div className="relative z-10 mt-3">
            <p className="text-[10px] text-muted tracking-widest font-medium">
              {config.events[0].dateFormatted}
            </p>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
};
