import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  CoupleAvatar,
  FloralDivider,
} from '../assets/VectorOrnaments';

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
  const { config } = useWedding();

  return (
    <section className="relative py-12 px-3 sm:px-6 max-w-2xl sm:max-w-3xl mx-auto my-4 overflow-visible">
      <ScrollReveal animation="fade-up" duration={850} repeat={true}>
        {/* KARTU TUNGGAL GERBANG KUBAH LENGKUNG PENUH (Continuous Cathedral Arch Portal) */}
        <div className="relative p-6 sm:p-10 md:p-12 pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-24 md:pb-28 cathedral-arch-portal luxury-pearl-card shadow-luxury border border-gold/45 flex flex-col items-center text-center overflow-hidden">
          {/* Garis Border Ganda Bagian Dalam (Concentric Continuous Arch Hairlines) */}
          <div className="absolute inset-2.5 sm:inset-3.5 cathedral-arch-inner-solid border border-gold/30 pointer-events-none" />
          <div className="absolute inset-4 sm:inset-5 cathedral-arch-inner-dashed border border-dashed border-gold/20 pointer-events-none" />

          {/* Watermark Siluet Flora Alam Tipis di 4 Sudut Kubah */}
          <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.06] -top-2 -right-2 pointer-events-none" />
          <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.06] -top-2 -left-2 transform scale-x-[-1] pointer-events-none" />
          <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.06] -bottom-2 -right-2 pointer-events-none" />
          <CardBotanicalWatermark className="w-36 sm:w-48 opacity-[0.06] -bottom-2 -left-2 transform scale-x-[-1] pointer-events-none" />

          {/* 1. BAGIAN AYAT AL-QUR'AN (QS. AR-RUM: 21) */}
          <div className="relative z-10 max-w-xl mx-auto mb-6">
            <span className="font-serif italic text-gold text-lg sm:text-xl block mb-2 font-normal tracking-wide">
              Bismillahirrohmaanirrohiim
            </span>

            {/* Kaligrafi Arab */}
            <p
              className="font-['Amiri',_serif] text-2xl sm:text-3xl text-primary leading-[2.3] my-4 font-normal px-2 sm:px-6"
              dir="rtl"
            >
              {config.quote?.arabic}
            </p>

            <FloralDivider className="w-32 h-5 text-gold mx-auto my-3 opacity-90" />

            {/* Terjemahan Ayat */}
            <p className="text-scale-small sm:text-scale-p text-muted leading-relaxed italic px-3 sm:px-6 max-w-lg mx-auto">
              "{config.quote?.translation}"
            </p>

            <p className="text-scale-xs font-semibold text-secondary tracking-[0.25em] uppercase mt-4">
              — {config.quote?.source} —
            </p>
          </div>

          {/* 3. PEMISAH ORNAMEN EMAS (Sacred Divider) */}
          <div className="relative z-10 flex items-center justify-center gap-3 w-full max-w-xs mx-auto my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
            <div className="w-2 h-2 rotate-45 border border-gold/70 bg-gold/20" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
          </div>

          {/* 4. SALAM & SAMBUTAN MEMPELAI */}
          <div className="relative z-10 mb-6 max-w-lg mx-auto">
            <span className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
              Assalamu’alaikum Warahmatullahi Wabarakatuh
            </span>
            <h2 className="font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold">
              Mempelai Pengantin
            </h2>
            <FloralDivider className="w-32 h-5 text-gold mx-auto my-2" />
            <p className="text-scale-small text-muted max-w-md mx-auto mt-2 leading-relaxed px-2">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
              menyelenggarakan syukuran pernikahan putra-putri kami:
            </p>
          </div>

          {/* 5. ILUSTRASI PASANGAN "TOGETHER IN LOVE" */}
          <div className="relative z-10 my-6">
            <CoupleAvatar />
          </div>

          {/* 6. PROFIL MEMPELAI PRIA & MEMPELAI WANITA */}
          <div className="relative z-10 w-full max-w-xl mx-auto my-6 px-1 sm:px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Kartu Profil Mempelai Pria */}
              <div className="group relative p-6 pt-7 pb-6 rounded-3xl bg-white/75 border border-gold/35 shadow-2xs backdrop-blur-xs flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
                {/* Garis Border Inset */}
                <div className="absolute inset-2 rounded-2xl border border-gold/20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center mb-1">
                  <span className="text-scale-xs tracking-widest uppercase font-semibold text-secondary block mb-1.5">
                    Mempelai Pria
                  </span>
                  <h3 className="font-serif text-scale-h4 sm:text-scale-h3 font-bold text-primary mb-2">
                    {config.groom?.fullName}
                  </h3>
                  <p className="text-scale-small text-muted leading-relaxed mb-4 px-1">
                    {config.groom?.parents}
                  </p>
                </div>

                {config.groom?.instagram && (
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

              {/* Medallion Ampersand (&) di Tengah */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gold/60 shadow-soft items-center justify-center font-serif text-gold font-bold text-sm">
                &
              </div>

              {/* Pemisah Ampersand untuk Mobile */}
              <div className="md:hidden flex items-center justify-center gap-3 my-0.5">
                <div className="flex-1 h-px bg-gold/25" />
                <div className="w-7 h-7 rounded-full bg-white border border-gold/60 shadow-2xs flex items-center justify-center font-serif text-gold font-bold text-xs">
                  &
                </div>
                <div className="flex-1 h-px bg-gold/25" />
              </div>

              {/* Kartu Profil Mempelai Wanita */}
              <div className="group relative p-6 pt-7 pb-6 rounded-3xl bg-white/75 border border-gold/35 shadow-2xs backdrop-blur-xs flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 hover:-translate-y-1">
                {/* Garis Border Inset */}
                <div className="absolute inset-2 rounded-2xl border border-gold/20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center mb-1">
                  <span className="text-scale-xs tracking-widest uppercase font-semibold text-secondary block mb-1.5">
                    Mempelai Wanita
                  </span>
                  <h3 className="font-serif text-scale-h4 sm:text-scale-h3 font-bold text-primary mb-2">
                    {config.bride?.fullName}
                  </h3>
                  <p className="text-scale-small text-muted leading-relaxed mb-4 px-1">
                    {config.bride?.parents}
                  </p>
                </div>

                {config.bride?.instagram && (
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
            </div>
          </div>

          {/* 7. ORNAMEN PENUTUP KUBAH BAWAH */}
          <div className="relative z-10 flex flex-col items-center mt-6">
            <FloralDivider className="w-28 h-5 text-gold opacity-80" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
