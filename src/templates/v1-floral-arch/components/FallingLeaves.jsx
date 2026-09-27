// Konfigurasi Minimalis Mewah: Hanya 5-6 helai daun di sisi samping
// Meninggalkan area tengah (nama mempelai & teks undangan) tetap bersih, lega, dan nyaman dibaca
const SERENE_LEAVES = [
  // Sisi Kiri Layar (Flank Kiri)
  {
    id: 'left-1',
    left: '6%',
    width: 21,
    height: 37,
    duration: '16s',
    delay: '-3.5s',
    anim: 'anim-serene-leaf-1',
    opacity: 0.72,
  },
  {
    id: 'left-2',
    left: '17%',
    width: 17,
    height: 30,
    duration: '18.5s',
    delay: '-11.2s',
    anim: 'anim-serene-leaf-2',
    opacity: 0.62,
  },
  {
    id: 'left-3',
    left: '25%',
    width: 22,
    height: 39,
    duration: '17s',
    delay: '-7.0s',
    anim: 'anim-serene-leaf-1',
    opacity: 0.68,
  },

  // Sisi Kanan Layar (Flank Kanan)
  {
    id: 'right-1',
    left: '75%',
    width: 18,
    height: 32,
    duration: '17.5s',
    delay: '-5.2s',
    anim: 'anim-serene-leaf-2',
    opacity: 0.65,
  },
  {
    id: 'right-2',
    left: '84%',
    width: 24,
    height: 42,
    duration: '15.5s',
    delay: '-13.0s',
    anim: 'anim-serene-leaf-1',
    opacity: 0.75,
  },
  {
    id: 'right-3',
    left: '93%',
    width: 17,
    height: 29,
    duration: '18s',
    delay: '-8.5s',
    anim: 'anim-serene-leaf-2',
    opacity: 0.6,
  },
];

// SVG Siluet Daun Eucalyptus / Sage Green Halus (Sesuai Dedaunan Ornamen Buket Sudut)
const SereneSageLeafSvg = () => (
  <svg
    viewBox="0 0 24 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]"
  >
    {/* Helai Daun Organik Eucalyptus */}
    <path
      d="M12 2 C19.5 10 22 24 16 35 C13.5 39 9.5 39 7.5 34 C4 26 5.5 13 12 2 Z"
      fill="url(#serene-sage-grad)"
    />
    {/* Tulang Daun Utama (Pale Mint Ivory Halus) */}
    <path
      d="M12 3 Q12 21 10.5 37"
      stroke="#EAF5EF"
      strokeWidth="0.85"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Urat Daun Halus (Subtle Secondary Veins) */}
    <path
      d="M12 14 Q15.5 12.5 18 14"
      stroke="#EAF5EF"
      strokeWidth="0.6"
      strokeLinecap="round"
      opacity="0.55"
    />
    <path
      d="M11.5 22 Q7.5 19.5 5.5 22"
      stroke="#EAF5EF"
      strokeWidth="0.6"
      strokeLinecap="round"
      opacity="0.55"
    />
    <path
      d="M11.5 27 Q14.5 25.5 16.5 28"
      stroke="#EAF5EF"
      strokeWidth="0.6"
      strokeLinecap="round"
      opacity="0.45"
    />
  </svg>
);

export const FallingLeaves = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {/* Definisi Gradasi Daun Sage Green / Eucalyptus Halus */}
      <svg
        width="0"
        height="0"
        className="absolute pointer-events-none select-none"
      >
        <defs>
          <linearGradient
            id="serene-sage-grad"
            x1="15%"
            y1="0%"
            x2="85%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#D8EDE2" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#8EBAA7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F7765" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>

      {/* Render 6 Daun Sage Melayang Tenang & Halus di Sisi Kiri & Kanan */}
      {SERENE_LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute top-0 ${leaf.anim}`}
          style={{
            left: leaf.left,
            width: `${leaf.width}px`,
            height: `${leaf.height}px`,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
            opacity: leaf.opacity,
          }}
        >
          <SereneSageLeafSvg />
        </div>
      ))}
    </div>
  );
};
