import { Heart } from 'lucide-react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  FloralBranch,
  FloralDivider,
} from '../assets/VectorOrnaments';

export const StorySection = () => {
  const { config } = useWedding();

  if (!config.stories || config.stories.length === 0) return null;

  return (
    <section className="relative py-16 px-5 sm:px-8 max-w-2xl mx-auto my-8 rounded-[36px] bg-gradient-to-b from-base-surface/40 via-base-surface/75 to-base-surface/40 border border-gold/30 shadow-xs overflow-hidden">
      {/* Kelopak Bunga Melayang di Sisi Cerita */}
      <div className="absolute top-12 right-5 sm:right-6 pointer-events-none opacity-40">
        <FloralBranch className="w-10 sm:w-12 h-auto transform rotate-45" />
      </div>

      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="text-center mb-8">
          <span className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
            Kisah Kami
          </span>
          <h2 className="font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold">
            Love Story
          </h2>
          <FloralDivider className="w-32 h-6 text-gold mx-auto my-2" />
        </div>
      </ScrollReveal>

      {/* Alur Garis Waktu Emas (Golden Narrative Ribbon) */}
      <div className="relative ml-2 sm:ml-4 pl-10 sm:pl-11 space-y-7 before:absolute before:top-4 before:bottom-4 before:left-3.5 sm:before:left-3.5 before:w-[2px] before:bg-gradient-to-b before:from-gold/20 via-gold before:to-gold/20">
        {config.stories.map((story, index) => (
          <ScrollReveal
            key={index}
            animation="fade-left"
            delay={index * 150}
            duration={750}
            repeat={true}
          >
            <div className="relative group">
              {/* Titik Lingkaran Simbol Emas (Illuminated Node) - Terpusat persis di atas garis */}
              <div className="absolute -left-9 sm:-left-9 top-4 w-7 h-7 rounded-full bg-white border-2 border-gold flex items-center justify-center text-gold shadow-md z-10 group-hover:scale-110 group-hover:shadow-glow/40 transition-all duration-300">
                <Heart className="w-3.5 h-3.5 fill-gold/30 text-gold" />
              </div>

              {/* Kartu Bab Cerita (Parchment Chapter Card) */}
              <div className="relative p-5 sm:p-6 rounded-2xl luxury-pearl-card border-l-4 border-l-gold border-t border-r border-b border-gold/40 transition-all duration-300 group-hover:shadow-md overflow-hidden">
                {/* Garis Border Ganda Bagian Dalam */}
                <div className="absolute inset-1.5 rounded-xl border border-gold/20 pointer-events-none" />

                {/* Watermark Flora Alam Halus */}
                <CardBotanicalWatermark className="w-28 sm:w-36 opacity-[0.06]" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-0.5 rounded-full text-scale-xs font-bold tracking-wider bg-primary text-white border border-gold/30 mb-2 shadow-2xs">
                    {story.year}
                  </span>
                  <h4 className="font-serif text-scale-h5 font-bold text-primary mb-1.5">
                    {story.title}
                  </h4>
                  <p className="text-scale-small text-muted leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
