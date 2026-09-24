import { FloatingMusic } from '../../components/common/FloatingMusic';
import { useWedding } from '../../context/WeddingContext';
import { CharacterArch } from './components/CharacterArch';
import { CoverModal } from './components/CoverModal';
import { DigitalGift } from './components/DigitalGift';
import { EventSection } from './components/EventSection';
import { FooterSection } from './components/FooterSection';
import { RSVPSection } from './components/RSVPSection';
import { StorySection } from './components/StorySection';
import { TopMonogram } from './components/TopMonogram';

const TemplateV1FloralArch = () => {
  const { isOpened } = useWedding();

  return (
    <div
      className={`relative min-h-screen min-h-[100dvh] bg-base overflow-x-clip ${!isOpened ? 'h-[100dvh] overflow-hidden' : ''} selection:bg-gold selection:text-white transition-colors duration-500`}
    >
      {/* Dynamic Fine-Art Cotton Paper Backdrop (Soft Sky Mist Nature Watercolor Canvas) */}
      <div className="fixed inset-0 fine-art-paper-bg pointer-events-none transition-colors duration-700" />
      <div className="fixed inset-0 nature-watercolor-overlay pointer-events-none" />
      <div className="fixed inset-0 fine-art-paper-texture pointer-events-none" />

      {/* 1. Cover Modal (Halaman Pembuka & Unlock Audio) */}
      <CoverModal />

      {/* 2. Floating Music Controller */}
      <FloatingMusic />

      {/* 3. Konten Utama Undangan (Setelah Dibuka) */}
      <main
        className={`relative z-10 overflow-x-clip transition-opacity duration-700 ${!isOpened ? 'hidden' : 'block'}`}
      >
        <TopMonogram />
        <CharacterArch />
        <EventSection />
        <StorySection />
        <DigitalGift />
        <RSVPSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default TemplateV1FloralArch;
