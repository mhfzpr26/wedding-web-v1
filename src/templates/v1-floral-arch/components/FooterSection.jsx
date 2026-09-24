import { Heart, Settings } from 'lucide-react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import { FloralDivider } from '../assets/VectorOrnaments';

export const FooterSection = () => {
  const { config, setIsAdminPanelOpen } = useWedding();

  return (
    <footer className="relative py-16 px-4 text-center border-t border-gold/30 bg-base-surface/50 mt-16 overflow-hidden">
      <div className="max-w-md mx-auto space-y-4">
        <ScrollReveal animation="fade-up" duration={800} repeat={true}>
          <p className="text-scale-small text-muted leading-relaxed">
            Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami
            mengucapkan terima kasih yang sebesar-besarnya.
          </p>

          <p className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold mt-3">
            Kami yang berbahagia,
          </p>

          <h3 className="font-serif text-scale-h3 sm:text-scale-h2 font-bold text-primary mt-2">
            {config.groom.shortName}{' '}
            <span className="font-script text-scale-h3 sm:text-scale-h2 text-gold font-normal px-1">
              &
            </span>{' '}
            {config.bride.shortName}
          </h3>

          <FloralDivider className="w-28 h-6 text-gold mx-auto my-3" />
        </ScrollReveal>

        {/* INVATERA BRAND WATERMARK */}
        <ScrollReveal
          animation="fade-up"
          delay={150}
          duration={800}
          repeat={true}
        >
          <div className="pt-6 flex flex-col items-center justify-center gap-1.5 opacity-90">
            <a
              href={config.brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-100 transition-opacity"
            >
              <img
                src={config.brand.logo}
                alt={config.brand.name}
                className="h-7 w-auto object-contain"
              />
              <span className="font-sans font-bold text-sm tracking-wider text-primary">
                {config.brand.name}
              </span>
            </a>
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold">
              {config.brand.tagline}
            </span>
            <p className="text-[10px] text-muted/60 mt-1 flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
              <span>for your special day</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Tombol Tersembunyi untuk Akses Admin / Helper Tool */}
        <div className="pt-6">
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] text-muted/60 hover:text-primary hover:bg-white/60 transition-colors"
          >
            <Settings className="w-3 h-3" />
            <span>Admin & Tools Agensi</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
