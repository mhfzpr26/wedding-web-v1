import { Heart } from 'lucide-react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import { FloralDivider } from '../assets/VectorOrnaments';

export const FooterSection = () => {
  const { config } = useWedding();

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
          <div className="pt-6 flex flex-col items-center justify-center select-none text-center">
            {/* Symmetrical Brand Lockup Box */}
            <div className="inline-flex flex-col items-center justify-center">
              {/* Line 1: [ ICON LOGO ] + INVATERA */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                <img
                  src={config.brand.logo}
                  alt={config.brand.name}
                  className="h-5 sm:h-6 w-auto object-contain shrink-0"
                />
                <span className="font-sans font-bold text-sm sm:text-base tracking-[0.2em] text-primary uppercase leading-none">
                  {config.brand.name}
                </span>
              </div>

              {/* Line 2: DIGITAL INVITATIONS (Centered directly under the icon + brand name) */}
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-muted font-medium text-center mt-1.5 pl-[0.28em]">
                {config.brand.tagline}
              </span>
            </div>

            {/* Line 3: Crafted with ♥ for your special day */}
            <p className="text-[10px] text-muted/60 mt-2.5 flex items-center justify-center gap-1 font-light tracking-wide text-center">
              <span>Crafted with</span>
              <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 inline-block" />
              <span>for your special day</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};
