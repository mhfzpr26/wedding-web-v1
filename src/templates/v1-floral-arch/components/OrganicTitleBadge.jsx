import { useId } from 'react';

/**
 * OrganicTitleBadge
 * Komponen judul dengan latar belakang organik asimetris (Option 3 - Botanical Blob)
 * Dilengkapi dengan watermark siluet ranting daun emas yang realistis, anggun, dan mendetail.
 */
export const OrganicTitleBadge = ({
  subtitle,
  title,
  className = '',
  titleClassName = '',
}) => {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const gradBackId = `blob-back-${safeId}`;
  const gradFrontId = `blob-front-${safeId}`;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center text-center px-7 sm:px-10 py-3 sm:py-3.5 my-2 select-none ${className}`}
    >
      {/* BACKGROUND ORGANIC BOTANICAL BLOB (SVG) */}
      <div className="absolute inset-0 -inset-x-3 sm:-inset-x-6 -inset-y-2 pointer-events-none -z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 350 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(40,54,95,0.06)]"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradasi Lapisan Belakang (Soft Warm Sand & Ice Blue) */}
            <linearGradient id={gradBackId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#faece2" stopOpacity="0.75" />
              <stop offset="48%" stopColor="#e5eff7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#efe5d8" stopOpacity="0.7" />
            </linearGradient>

            {/* Gradasi Lapisan Depan (Porcelain Ivory Shimmer) */}
            <linearGradient id={gradFrontId} x1="5%" y1="90%" x2="95%" y2="10%">
              <stop offset="0%" stopColor="#fdfbf9" stopOpacity="0.94" />
              <stop offset="50%" stopColor="#f4f9fd" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#faf5ef" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Lapisan 1: Siluet Organik Belakang (Aura Lembut Asimetris) */}
          <path
            d="M 30,44 C 18,22 48,6 132,8 C 210,10 278,3 322,20 C 344,30 338,60 306,72 C 262,86 190,80 122,78 C 60,76 20,66 30,44 Z"
            fill={`url(#${gradBackId})`}
          />

          {/* Lapisan 2: Bentuk Organik Utama (Porcelain Badge dengan Border Emas Halus) */}
          <path
            d="M 24,41 C 16,19 60,11 140,13 C 216,15 284,7 325,26 C 341,36 331,62 300,70 C 256,80 180,76 114,74 C 52,72 22,62 24,41 Z"
            fill={`url(#${gradFrontId})`}
            stroke="#a87f01"
            strokeWidth="0.8"
            strokeOpacity="0.35"
          />

          {/* Lapisan 3: WATERMARK SILUET RANTING EMAS REALISTIK & ANGGUN (Sudut Kanan Atas) */}
          <g className="opacity-45" transform="translate(248, 2) scale(0.75)">
            {/* Batang Utama Melengkung Halus Menuju Pucuk */}
            <path
              d="M 12,85 C 32,68 55,48 78,25 C 88,14 96,6 105,2"
              stroke="#a87f01"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tangkai Ranting Samping 1 (Bawah Kanan) */}
            <path
              d="M 38,62 C 52,56 68,54 82,50"
              stroke="#a87f01"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Butir/Berry Emas Ranting 1 */}
            <circle cx="83" cy="50" r="2" fill="#a87f01" fillOpacity="0.65" />
            <circle cx="72" cy="46" r="1.6" fill="#a87f01" fillOpacity="0.55" />

            {/* Tangkai Ranting Samping 2 (Tengah Kanan) */}
            <path
              d="M 64,38 C 76,32 90,28 102,24"
              stroke="#a87f01"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
            <circle
              cx="103"
              cy="24"
              r="1.8"
              fill="#a87f01"
              fillOpacity="0.65"
            />

            {/* DAUN 1 (Kiri Bawah) */}
            <path
              d="M 28,68 C 16,64 10,54 14,44 C 24,46 31,56 29,66 Z"
              fill="#d4af37"
              fillOpacity="0.22"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 28,66 C 22,58 18,52 15,45"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />

            {/* DAUN 2 (Kanan Bawah) */}
            <path
              d="M 46,55 C 58,50 68,42 66,32 C 54,34 46,42 45,53 Z"
              fill="#d4af37"
              fillOpacity="0.22"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 46,53 C 54,46 60,40 65,33"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />

            {/* DAUN 3 (Kiri Tengah) */}
            <path
              d="M 52,47 C 40,40 36,30 42,20 C 50,24 55,34 53,45 Z"
              fill="#d4af37"
              fillOpacity="0.22"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 52,45 C 46,37 43,30 42,21"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />

            {/* DAUN 4 (Kanan Tengah) */}
            <path
              d="M 70,33 C 82,28 90,20 86,10 C 76,13 70,22 69,31 Z"
              fill="#d4af37"
              fillOpacity="0.22"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 70,31 C 77,25 82,18 85,11"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />

            {/* DAUN 5 (Kiri Atas) */}
            <path
              d="M 78,24 C 68,16 66,8 74,1 C 80,6 83,14 80,22 Z"
              fill="#d4af37"
              fillOpacity="0.22"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 78,22 C 75,16 73,10 74,2"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />

            {/* DAUN 6 (Pucuk Terminal Atas) */}
            <path
              d="M 94,12 C 102,6 112,2 118,0 C 114,8 106,14 96,14 Z"
              fill="#d4af37"
              fillOpacity="0.25"
              stroke="#a87f01"
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              d="M 95,13 C 103,8 110,4 117,1"
              stroke="#a87f01"
              strokeWidth="0.5"
              strokeOpacity="0.7"
              fill="none"
            />
          </g>

          {/* Lapisan 4: WATERMARK RANTING PELENGKAP (Sudut Kiri Bawah) */}
          <g className="opacity-35" transform="translate(10, 32) scale(0.55)">
            <path
              d="M 95,10 C 75,28 50,50 25,68 C 16,74 8,78 0,82"
              stroke="#a87f01"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
            {/* Butir/Berry Emas */}
            <circle cx="28" cy="46" r="1.6" fill="#a87f01" fillOpacity="0.6" />
            <circle cx="58" cy="24" r="1.8" fill="#a87f01" fillOpacity="0.6" />

            {/* Daun Bawah 1 */}
            <path
              d="M 75,28 C 82,38 84,48 76,54 C 70,48 68,38 73,30 Z"
              fill="#d4af37"
              fillOpacity="0.2"
              stroke="#a87f01"
              strokeWidth="0.8"
            />
            {/* Daun Bawah 2 */}
            <path
              d="M 52,46 C 42,54 32,58 36,66 C 44,64 50,56 52,48 Z"
              fill="#d4af37"
              fillOpacity="0.2"
              stroke="#a87f01"
              strokeWidth="0.8"
            />
            {/* Daun Bawah 3 */}
            <path
              d="M 32,62 C 38,70 38,78 30,82 C 26,76 26,68 31,63 Z"
              fill="#d4af37"
              fillOpacity="0.2"
              stroke="#a87f01"
              strokeWidth="0.8"
            />
          </g>
        </svg>
      </div>

      {/* SUBTITLE KECIL (JIKA ADA) */}
      {subtitle && (
        <span className="relative z-10 text-[10px] sm:text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-0.5">
          {subtitle}
        </span>
      )}

      {/* JUDUL UTAMA */}
      <h2
        className={`relative z-10 font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold px-2 leading-tight ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
};
