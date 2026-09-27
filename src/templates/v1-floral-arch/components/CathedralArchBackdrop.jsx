/**
 * CathedralArchBackdrop
 * Implementasi Opsi 2: Grand Cathedral Arch Watermark.
 *
 * Menghadirkan siluet lengkungan arsitektur katedral megah (Romanesque / Classical Arch)
 * dengan pilar bergalur (fluted columns), keystone bermahkota, spandrel filigree,
 * serta bias cahaya temaram (heavenly ambient sunlight glow).
 * Membingkai seluruh halaman undangan secara anggun dan selaras sempurna dengan tema "Floral Arch".
 */
export const CathedralArchBackdrop = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Bias Cahaya Surgawi Temaram (Heavenly Sunlit Cathedral Ambient Glow) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 45% at 50% 0%, rgba(254, 240, 199, 0.42) 0%, rgba(225, 239, 252, 0.2) 55%, transparent 85%),
            radial-gradient(circle at 10% 30%, rgba(200, 225, 245, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 90% 30%, rgba(200, 225, 245, 0.25) 0%, transparent 60%)
          `,
        }}
      />

      {/* 2. LENGKUNGAN ATAS KATEDRAL (GRAND OVERHEAD ROMANESQUE ARCH) */}
      {/* Membentang di bagian atas layar dari pilar kiri hingga pilar kanan */}
      <div className="absolute top-0 left-2 sm:left-6 md:left-12 lg:left-16 right-2 sm:right-6 md:right-12 lg:right-16 h-40 sm:h-52 md:h-64 lg:h-72 pointer-events-none">
        <svg
          viewBox="0 0 1000 280"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradasi Garis Emas Katedral */}
            <linearGradient
              id="arch-gold-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#b38a38" stopOpacity="0.25" />
              <stop offset="25%" stopColor="#d4af37" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#f7e8a9" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#d4af37" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#b38a38" stopOpacity="0.25" />
            </linearGradient>

            {/* Gradasi Garis Biru Slate */}
            <linearGradient
              id="arch-slate-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2c527c" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3b6998" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2c527c" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* ============================================================== */}
          {/* LENGKUNGAN KONSENTRIS (CONCENTRIC ARCH MOULDINGS)               */}
          {/* ============================================================== */}
          {/* Lengkungan Luar (Outer Moulding Line - Slate Blue) */}
          <path
            d="M 0,280 C 0,40 320,10 500,10 C 680,10 1000,40 1000,280"
            fill="none"
            stroke="url(#arch-slate-grad)"
            strokeWidth="1.6"
          />

          {/* Lengkungan Kedua (Gold Filigree Trim dengan Garis Putus Mutiara) */}
          <path
            d="M 14,280 C 14,52 328,24 500,24 C 672,24 986,52 986,280"
            fill="none"
            stroke="url(#arch-gold-grad)"
            strokeWidth="1.2"
            strokeDasharray="5 7"
          />

          {/* Lengkungan Ketiga (Inner Rib Moulding) */}
          <path
            d="M 28,280 C 28,65 335,38 500,38 C 665,38 972,65 972,280"
            fill="none"
            stroke="url(#arch-slate-grad)"
            strokeWidth="1"
            strokeOpacity="0.35"
          />

          {/* Lengkungan Keempat (Delicate Cusped Arch / Renda Katedral Bawah) */}
          <path
            d="M 42,280 C 42,78 342,52 500,52 C 658,52 958,78 958,280"
            fill="none"
            stroke="url(#arch-gold-grad)"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* ============================================================== */}
          {/* ORNAMEN KUNCI MAHKOTA PUSAT (CENTRAL KEYSTONE & CARTOUCHE)      */}
          {/* ============================================================== */}
          <g transform="translate(500, 26)">
            {/* Bentuk Batu Kunci (Keystone Bracket) */}
            <path
              d="M -16,-18 L 16,-18 L 12,22 L -12,22 Z"
              fill="#f8fafc"
              fillOpacity="0.6"
              stroke="#b38a38"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />
            {/* Roset Bunga & Permata Pusat */}
            <circle
              cx="0"
              cy="2"
              r="6"
              fill="#d4af37"
              fillOpacity="0.25"
              stroke="#b38a38"
              strokeWidth="0.8"
            />
            <circle cx="0" cy="2" r="2.5" fill="#f5e194" />
            {/* Daun Akantus Puncak */}
            <path
              d="M 0,-18 C 4,-26 8,-28 0,-34 C -8,-28 -4,-26 0,-18 Z"
              fill="#d4af37"
              fillOpacity="0.5"
            />
            {/* Mutiara Gantung Bawah */}
            <circle cx="0" cy="30" r="2.2" fill="#d4af37" fillOpacity="0.6" />
          </g>

          {/* ============================================================== */}
          {/* FILIGREE SUDUT SPANDREL (KIRI ATAS & KANAN ATAS)                */}
          {/* ============================================================== */}
          {/* Spandrel Kiri Atas */}
          <g transform="translate(110, 40)" opacity="0.35">
            <path
              d="M -80,-15 C -40,-18 -10,5 -5,25 C 0,45 -20,60 -35,52 C -50,44 -38,20 -20,20 C 5,20 15,-5 -60,-8"
              fill="none"
              stroke="#b38a38"
              strokeWidth="1"
            />
            <circle cx="-5" cy="25" r="2" fill="#d4af37" />
            <circle cx="-35" cy="52" r="1.5" fill="#b38a38" />
          </g>

          {/* Spandrel Kanan Atas (Simetris) */}
          <g transform="translate(890, 40) scale(-1, 1)" opacity="0.35">
            <path
              d="M -80,-15 C -40,-18 -10,5 -5,25 C 0,45 -20,60 -35,52 C -50,44 -38,20 -20,20 C 5,20 15,-5 -60,-8"
              fill="none"
              stroke="#b38a38"
              strokeWidth="1"
            />
            <circle cx="-5" cy="25" r="2" fill="#d4af37" />
            <circle cx="-35" cy="52" r="1.5" fill="#b38a38" />
          </g>
        </svg>
      </div>

      {/* 3. PILAR KATEDRAL KIRI (LEFT FLUTED ARCHITECTURAL COLUMN) */}
      <div className="absolute left-2 sm:left-6 md:left-12 lg:left-16 top-0 bottom-0 w-6 sm:w-8 md:w-12 pointer-events-none flex flex-col justify-between">
        {/* Ornamen Kepala Pilar (Capital Moulding) */}
        <div className="w-full h-8 sm:h-12 mt-36 sm:mt-48 md:mt-60 lg:mt-68">
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 4,4 L 36,4 L 32,16 L 8,16 Z"
              fill="#2c527c"
              fillOpacity="0.08"
              stroke="#b38a38"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <circle cx="20" cy="10" r="2" fill="#d4af37" fillOpacity="0.5" />
            <path
              d="M 6,18 C 14,24 26,24 34,18"
              fill="none"
              stroke="#2c527c"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          </svg>
        </div>

        {/* Batang Pilar Bergalur Vertikal (Fluted Shaft) - Membentang Sepanjang Halaman */}
        <div className="w-full flex-1">
          <svg
            viewBox="0 0 40 100"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Galur Luar 1 (Slate) */}
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="100"
              stroke="#2c527c"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
            {/* Galur Tengah (Gold Pin) */}
            <line
              x1="20"
              y1="0"
              x2="20"
              y2="100"
              stroke="#d4af37"
              strokeWidth="1"
              strokeOpacity="0.32"
              strokeDasharray="8 12"
            />
            {/* Galur Dalam (Slate) */}
            <line
              x1="32"
              y1="0"
              x2="32"
              y2="100"
              stroke="#2c527c"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
          </svg>
        </div>

        {/* Kaki Pilar (Base Plinth Moulding) */}
        <div className="w-full h-10 mb-4">
          <svg
            viewBox="0 0 40 30"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 8,4 L 32,4 L 36,18 L 4,18 Z"
              fill="#2c527c"
              fillOpacity="0.08"
              stroke="#b38a38"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <line
              x1="2"
              y1="22"
              x2="38"
              y2="22"
              stroke="#2c527c"
              strokeWidth="1.2"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* 4. PILAR KATEDRAL KANAN (RIGHT FLUTED ARCHITECTURAL COLUMN) */}
      <div className="absolute right-2 sm:right-6 md:right-12 lg:right-16 top-0 bottom-0 w-6 sm:w-8 md:w-12 pointer-events-none flex flex-col justify-between">
        {/* Ornamen Kepala Pilar (Capital Moulding) */}
        <div className="w-full h-8 sm:h-12 mt-36 sm:mt-48 md:mt-60 lg:mt-68">
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 4,4 L 36,4 L 32,16 L 8,16 Z"
              fill="#2c527c"
              fillOpacity="0.08"
              stroke="#b38a38"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <circle cx="20" cy="10" r="2" fill="#d4af37" fillOpacity="0.5" />
            <path
              d="M 6,18 C 14,24 26,24 34,18"
              fill="none"
              stroke="#2c527c"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          </svg>
        </div>

        {/* Batang Pilar Bergalur Vertikal (Fluted Shaft) */}
        <div className="w-full flex-1">
          <svg
            viewBox="0 0 40 100"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="100"
              stroke="#2c527c"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
            <line
              x1="20"
              y1="0"
              x2="20"
              y2="100"
              stroke="#d4af37"
              strokeWidth="1"
              strokeOpacity="0.32"
              strokeDasharray="8 12"
            />
            <line
              x1="32"
              y1="0"
              x2="32"
              y2="100"
              stroke="#2c527c"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
          </svg>
        </div>

        {/* Kaki Pilar (Base Plinth Moulding) */}
        <div className="w-full h-10 mb-4">
          <svg
            viewBox="0 0 40 30"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 8,4 L 32,4 L 36,18 L 4,18 Z"
              fill="#2c527c"
              fillOpacity="0.08"
              stroke="#b38a38"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <line
              x1="2"
              y1="22"
              x2="38"
              y2="22"
              stroke="#2c527c"
              strokeWidth="1.2"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
