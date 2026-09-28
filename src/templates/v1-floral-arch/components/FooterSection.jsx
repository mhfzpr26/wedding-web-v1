import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import { FloralDivider } from '../assets/VectorOrnaments';

export const FooterSection = () => {
  const { config } = useWedding();

  return (
    <footer className="relative pt-8 pb-12 sm:pt-10 sm:pb-14 px-4 text-center border-t border-gold/30 bg-base-surface/50 mt-6 sm:mt-8 overflow-hidden">
      <div className="max-w-md mx-auto space-y-4">
        <ScrollReveal animation="fade-up" duration={800} repeat={true}>
          <p className="text-scale-small text-muted leading-relaxed">
            Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami
            mengucapkan terima kasih yang sebesar-besarnya.
          </p>

          <p className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold mt-3">
            Kami yang berbahagia,
          </p>

          <h3 className="font-serif text-[24px] sm:text-scale-h3 md:text-scale-h2 font-bold text-primary mt-2">
            {config.bride.shortName}{' '}
            <span className="font-script text-[26px] sm:text-scale-h3 md:text-scale-h2 text-gold font-normal px-1">
              &
            </span>{' '}
            {config.groom.shortName}
          </h3>

          <FloralDivider className="w-28 h-6 text-gold mx-auto my-3" />
        </ScrollReveal>
      </div>
    </footer>
  );
};
