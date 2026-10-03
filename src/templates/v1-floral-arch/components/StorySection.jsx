import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart } from 'lucide-react';
import { useRef } from 'react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import { CardBotanicalWatermark } from '../assets/VectorOrnaments';
import { OrganicTitleBadge } from './OrganicTitleBadge';

gsap.registerPlugin(ScrollTrigger);

export const StorySection = () => {
  const { config, isOpened } = useWedding();
  const sectionRef = useRef(null);
  const lineProgressRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(
    () => {
      if (!isOpened || !config.stories || config.stories.length === 0) return;

      // 1. Alur Garis Emas Tumbuh Mengikuti Scroll Pengguna (Scrubbed Progress Ribbon)
      if (lineProgressRef.current && timelineRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.5,
            },
          },
        );
      }

      // 2. Setiap Milestone Bab Cerita Membuka Anggun saat Garis Melewatinya
      const storyItems = gsap.utils.toArray('.story-milestone-item');
      storyItems.forEach((item) => {
        const node = item.querySelector('.story-node-bullet');
        const card = item.querySelector('.story-parchment-card');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play reverse play reverse',
          },
        });

        // Simbol Hati meletup anggun
        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              ease: 'back.out(2.2)',
            },
            0,
          );
        }

        // Kartu Bab Cerita meluncur masuk dan terbuka dari kanan
        if (card) {
          tl.fromTo(
            card,
            { x: 28, opacity: 0, scale: 0.96 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.75,
              ease: 'power3.out',
            },
            0.08,
          );
        }
      });
    },
    { dependencies: [isOpened, config.stories], scope: sectionRef },
  );

  if (
    config.storiesEnabled === false ||
    !config.stories ||
    config.stories.length === 0
  )
    return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-8 sm:py-10 px-4 sm:px-8 max-w-2xl mx-auto my-4 sm:my-6 rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-base-surface/40 via-base-surface/75 to-base-surface/40 border border-gold/30 shadow-xs overflow-hidden"
    >
      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="text-center mb-4 sm:mb-6">
          <OrganicTitleBadge subtitle="Kisah Kami" title="Love Story" />
        </div>
      </ScrollReveal>

      {/* Alur Garis Waktu Emas (GSAP Animated Golden Ribbon) */}
      <div
        ref={timelineRef}
        className="relative ml-2 sm:ml-4 pl-10 sm:pl-11 space-y-5 sm:space-y-6"
      >
        {/* Track Latar Belakang Statis (Faint Guide Line) */}
        <div className="absolute top-4 bottom-4 left-3.5 w-[2px] bg-gold/20 rounded-full pointer-events-none" />

        {/* Garis Emas Hidup Bercahaya yang Terlukis saat Scroll (Luminous Scrub Fill) */}
        <div
          ref={lineProgressRef}
          className="absolute top-4 bottom-4 left-3.5 w-[2px] bg-gradient-to-b from-gold via-gold-light to-gold rounded-full pointer-events-none origin-top shadow-[0_0_8px_rgba(212,175,55,0.7)]"
        />

        {config.stories.map((story, index) => (
          <div
            key={index}
            className="story-milestone-item relative group will-change-transform"
          >
            {/* Titik Lingkaran Simbol Emas (Illuminated Node) - Terpusat persis di atas garis */}
            <div className="story-node-bullet absolute -left-9 sm:-left-9 top-4 w-7 h-7 rounded-full bg-white border-2 border-gold flex items-center justify-center text-gold shadow-md z-10 group-hover:scale-110 group-hover:shadow-glow/40 transition-transform duration-300">
              <span className="absolute -inset-1 rounded-full bg-gold/25 animate-ping opacity-25 pointer-events-none" />
              <Heart className="w-3.5 h-3.5 fill-gold/40 text-gold animate-gentle-pulse" />
            </div>

            {/* Kartu Bab Cerita (Parchment Chapter Card) */}
            <div className="story-parchment-card relative p-5 sm:p-6 rounded-2xl luxury-pearl-card border-l-4 border-l-gold border-t border-r border-b border-gold/40 transition-all duration-300 group-hover:shadow-md overflow-hidden will-change-transform">
              {/* Garis Border Ganda Bagian Dalam */}
              <div className="absolute inset-1.5 rounded-xl border border-gold/20 pointer-events-none" />

              {/* Watermark Flora Alam Halus */}
              <CardBotanicalWatermark className="w-32 sm:w-40 opacity-[0.20]" />

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
        ))}
      </div>
    </section>
  );
};
