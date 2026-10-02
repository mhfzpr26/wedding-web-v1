import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  FloralDivider,
} from '../assets/VectorOrnaments';

export const FooterSection = () => {
  const { config, activeColorPreset } = useWedding();
  const closing = config.closing || {};

  // Warna latar belakang gelap pekat dinamis sesuai preset
  const bgDarkClass =
    activeColorPreset === 'sage'
      ? 'bg-[#10201c]'
      : activeColorPreset === 'rose'
        ? 'bg-[#241318]'
        : 'bg-[#0d1a3a]'; // Default Navy Mewah

  const thankYouText =
    closing.thankYouText ||
    'Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih yang sebesar-besarnya.';
  const closingSalutation =
    closing.closingSalutation !== undefined
      ? closing.closingSalutation
      : 'Kami yang berbahagia,';
  const customNames = closing.customNames;
  const subfooterText =
    closing.subfooterText ||
    `The Wedding of ${config.bride?.shortName || 'Destia'} & ${config.groom?.shortName || 'Raka'}`;
  const showSubfooter = closing.showSubfooter !== false;

  return (
    <footer
      className={`relative pt-12 pb-16 sm:pt-14 sm:pb-20 px-4 text-center ${bgDarkClass} text-white overflow-hidden`}
    >
      {/* Efek Pendar Emas Lembut di Bagian Tengah (Radial Ambient Gold Glow) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
        }}
      />

      {/* Garis Aksen Emas Ganda di Tepi Atas */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      <div className="absolute top-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Ornamen Botani di Sudut Kubah Gelap */}
      <CardBotanicalWatermark className="w-32 sm:w-40 opacity-15 -top-2 -right-2 text-gold pointer-events-none" />
      <CardBotanicalWatermark className="w-32 sm:w-40 opacity-15 -top-2 -left-2 transform scale-x-[-1] text-gold pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-3.5 animate-in fade-in duration-700">
        <p className="text-scale-small text-slate-200/90 leading-relaxed font-light">
          {thankYouText}
        </p>

        {closingSalutation && (
          <p className="text-scale-xs uppercase tracking-[0.3em] text-gold-light font-bold mt-4">
            {closingSalutation}
          </p>
        )}

        <h3 className="font-serif text-[26px] sm:text-scale-h3 md:text-scale-h2 font-bold text-white tracking-wide mt-2 drop-shadow-md">
          {customNames ? (
            customNames
          ) : (
            <>
              {config.bride?.shortName || 'Destia'}{' '}
              <span className="font-script text-[30px] sm:text-[36px] text-gold-light font-normal px-1 drop-shadow-sm">
                &
              </span>{' '}
              {config.groom?.shortName || 'Raka'}
            </>
          )}
        </h3>

        <FloralDivider className="w-28 h-6 text-gold mx-auto my-3 opacity-90" />

        {showSubfooter && (
          <p className="text-[10px] text-slate-400/80 tracking-widest uppercase mt-4">
            {subfooterText}
          </p>
        )}
      </div>
    </footer>
  );
};
