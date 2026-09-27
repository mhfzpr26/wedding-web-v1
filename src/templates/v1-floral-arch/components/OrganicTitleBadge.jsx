import { useId } from 'react';

/**
 * OrganicTitleBadge
 * Komponen badge judul konten mewah bergaya Classical Scalloped Porcelain Plaque.
 *
 * Latar belakang plat porselen klasik berlekuk sudut dengan garis ganda emas timbul (double gold hairline),
 * dipadukan dengan ornamen lukisan botani cat air & ranting emas (Opsi 3: Minimalist Gilded Eucalyptus)
 * yang merangkul dan menjuntai menyatu langsung di atas sudut kiri atas bingkai.
 */
export const OrganicTitleBadge = ({
  subtitle,
  title,
  className = '',
  titleClassName = '',
}) => {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const gradPorcelainId = `porcelain-grad-${safeId}`;
  const gradGoldId = `gold-border-${safeId}`;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center text-center px-6 sm:px-10 py-3 sm:py-4 my-2 select-none ${className}`}
    >
      {/* LATAR BELAKANG PLAT PORSELEN KLASIK BERLEKUK SUDUT (Classical Scalloped Plaque) */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 320 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_6px_20px_rgba(40,54,95,0.07)]"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradasi Permukaan Porselen Gading Mewah */}
            <linearGradient
              id={gradPorcelainId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#fbf9f6" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#f3f7fa" stopOpacity="0.97" />
            </linearGradient>

            {/* Gradasi Garis Emas Plaque */}
            <linearGradient id={gradGoldId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b38a38" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#dfb740" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#f5e194" stopOpacity="1" />
              <stop offset="100%" stopColor="#b38a38" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Lapisan 1: Bentuk Dasar Plat Porselen Klasik Berlekuk Sudut (Scalloped Plaque Base) */}
          <path
            d="M 26,5 L 294,5 C 303,5 311,11 311,19 C 311,23 315,27 315,31 L 315,55 C 315,59 311,63 311,67 C 311,75 303,81 294,81 L 26,81 C 17,81 9,75 9,67 C 9,63 5,59 5,55 L 5,31 C 5,27 9,23 9,19 C 9,11 17,5 26,5 Z"
            fill={`url(#${gradPorcelainId})`}
          />

          {/* Lapisan 2: Garis Luar Tipis Emas Emboss (Outer Gold Hairline) */}
          <path
            d="M 26,5 L 294,5 C 303,5 311,11 311,19 C 311,23 315,27 315,31 L 315,55 C 315,59 311,63 311,67 C 311,75 303,81 294,81 L 26,81 C 17,81 9,75 9,67 C 9,63 5,59 5,55 L 5,31 C 5,27 9,23 9,19 C 9,11 17,5 26,5 Z"
            fill="none"
            stroke="#c5a059"
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />

          {/* Lapisan 3: Garis Emas Ganda Bagian Dalam (Inner Gold Hairline Frame) */}
          <path
            d="M 27,9 L 293,9 C 300,9 307,14 307,20 C 307,24 311,28 311,32 L 311,54 C 311,58 307,62 307,66 C 307,72 300,77 293,77 L 27,77 C 20,77 13,72 13,66 C 13,62 9,58 9,54 L 9,32 C 9,28 13,24 13,20 C 13,14 20,9 27,9 Z"
            fill="none"
            stroke={`url(#${gradGoldId})`}
            strokeWidth="1.2"
          />

          {/* Lapisan 4: Garis Pinstripe Mikro Halus (Concentric Micro Hairline) */}
          <path
            d="M 28,12 L 292,12 C 297,12 304,16 304,21 C 304,25 308,28 308,32 L 308,54 C 308,58 304,61 304,65 C 304,70 297,74 292,74 L 28,74 C 23,74 16,70 16,65 C 16,61 12,58 12,54 L 12,32 C 12,28 16,25 16,21 C 16,16 23,12 28,12 Z"
            fill="none"
            stroke="#b38a38"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
        </svg>
      </div>

      {/* 3. SUBTITLE KECIL (MISAL: KISAH KAMI, WAKTU & LOKASI) */}
      {subtitle && (
        <span className="relative z-10 text-[10px] sm:text-scale-xs uppercase tracking-[0.28em] text-secondary font-semibold block mb-0.5 pl-[0.28em]">
          {subtitle}
        </span>
      )}

      {/* 4. JUDUL UTAMA (MISAL: LOVE STORY, RANGKAIAN ACARA) */}
      <h2
        className={`relative z-10 font-serif text-[21px] sm:text-scale-h4 md:text-scale-h3 text-primary font-bold px-2 leading-tight ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
};
