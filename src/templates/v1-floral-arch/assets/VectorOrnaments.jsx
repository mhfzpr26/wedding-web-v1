// Ornamen Bunga Baru Buatan Khusus (100% Transparent PNG, No Background)
export const FloralCornerBunch = ({
  className = 'w-44 sm:w-56 h-auto',
  style = {},
}) => (
  <img
    src="/images/custom-ornaments/invatera-floral-corner.png"
    alt="Floral Corner"
    className={`ref-floral-ornament pointer-events-none select-none object-contain drop-shadow-sm ${className}`}
    style={style}
  />
);

const FloralArchFrame = ({
  className = 'w-full max-w-sm h-auto mx-auto',
  style = {},
}) => (
  <img
    src="/images/custom-ornaments/invatera-floral-arch.png"
    alt="Floral Arch"
    className={`ref-floral-ornament pointer-events-none select-none object-contain drop-shadow-sm ${className}`}
    style={style}
  />
);

export const FloralBranch = ({
  className = 'w-32 sm:w-40 h-auto',
  style = {},
}) => (
  <img
    src="/images/custom-ornaments/invatera-floral-branch.png"
    alt="Floral Branch"
    className={`ref-floral-ornament pointer-events-none select-none object-contain drop-shadow-xs ${className}`}
    style={style}
  />
);

// Watermark Siluet Flora Alam Tipis untuk Dalam Kartu (Subtle Botanical Card Watermark)
export const CardBotanicalWatermark = ({
  className = 'w-36 sm:w-48 opacity-[0.07]',
}) => (
  <div
    className={`absolute -bottom-2 -right-2 pointer-events-none select-none z-0 mix-blend-multiply overflow-hidden ${className}`}
  >
    <img
      src="/images/custom-ornaments/invatera-floral-branch.png"
      alt=""
      className="w-full h-auto object-contain transform rotate-[-12deg] scale-110"
    />
  </div>
);

// Pembatas Garis Floral Minimalis
export const FloralDivider = ({
  className = 'w-44 h-7 text-gold my-3 mx-auto',
}) => (
  <svg
    viewBox="0 0 300 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 20H110M190 20H290"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="150" cy="20" r="4" fill="currentColor" />
    <path
      d="M150 10C155 15 165 20 150 28C135 20 145 15 150 10Z"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M125 20C132 15 138 18 140 20C138 22 132 25 125 20Z"
      fill="currentColor"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="0.8"
    />
    <path
      d="M175 20C168 15 162 18 160 20C162 22 168 25 175 20Z"
      fill="currentColor"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="0.8"
    />
  </svg>
);

// Ilustrasi Karakter Mempelai di dalam Kubah Vektor Elegan (Fairytale Storybook Couple)
export const CoupleAvatar = ({
  className = 'w-full max-w-[340px] mx-auto',
}) => (
  <div className={`relative ${className}`}>
    {/* Lengkungan Bunga Mahkota yang Memeluk Sempurna Puncak Kubah */}
    <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-20 w-64 sm:w-72 pointer-events-none">
      <FloralArchFrame className="w-full h-auto drop-shadow-sm" />
    </div>

    {/* Frame Kubah Lengkung Ganda Bertekstur Mewah & Shadow Ambient */}
    <div className="relative mx-auto w-68 sm:w-76 h-[430px] sm:h-[470px] rounded-t-[150px] rounded-b-3xl border-2 border-gold/60 p-2.5 shadow-[0_20px_50px_-15px_rgba(40,54,95,0.18)] bg-white/95">
      <div className="w-full h-full rounded-t-[140px] rounded-b-2xl border border-dashed border-secondary/40 relative overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#FAFCFE] to-white flex flex-col justify-end items-center p-2 shadow-inner">
        {/* Lukisan Karakter Storybook (Hangat, Bersahaja, Manis) */}
        <div className="relative z-10 w-full h-[95%] flex items-end justify-center">
          <img
            src="/images/custom-ornaments/invatera-couple-art.png"
            alt="Mempelai Kevin & Sarah"
            className="w-full h-full object-contain object-bottom drop-shadow-md"
          />
        </div>
      </div>
    </div>

    {/* Ribbon Badge Elegan Beraksen Emas di Bawah Kubah */}
    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full bg-gradient-to-r from-white via-base-surface to-white border border-gold/60 shadow-soft">
      <span className="text-[10px] tracking-[0.28em] uppercase font-bold text-primary whitespace-nowrap">
        Together In Love
      </span>
    </div>
  </div>
);
