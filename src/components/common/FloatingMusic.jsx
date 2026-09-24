import { Volume2, VolumeX } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

export const FloatingMusic = () => {
  const { isPlaying, toggleMusic, isOpened } = useWedding();

  // Hanya tampilkan jika undangan sudah dibuka
  if (!isOpened) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gold/50 shadow-luxury text-primary hover:text-gold transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Glow effect saat musik berputar */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-gold/20 animate-ping opacity-75 pointer-events-none" />
        )}

        {/* Piringan / Icon musik */}
        <div
          className={`transition-transform duration-500 ${isPlaying ? 'animate-spin-slow' : ''}`}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-primary group-hover:text-gold transition-colors" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted" />
          )}
        </div>

        {/* Tooltip kecil */}
        <span className="absolute right-14 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary text-white shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isPlaying ? 'Matikan Musik' : 'Putar Musik'}
        </span>
      </button>
    </div>
  );
};
