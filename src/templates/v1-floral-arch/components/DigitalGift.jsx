import { ChevronDown, ChevronUp, Gift, Home, Wifi } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '../../../components/common/CopyButton';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  FloralDivider,
} from '../assets/VectorOrnaments';

// Ikon Microchip Emas untuk Kartu ATM Mewah
const CardChipIcon = () => (
  <svg
    width="36"
    height="28"
    viewBox="0 0 36 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded shadow-xs"
  >
    <rect width="36" height="28" rx="4" fill="url(#chip-grad)" />
    <path
      d="M0 14H12M24 14H36M12 0V28M24 0V28M12 8H24M12 20H24"
      stroke="#8A6B0A"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
    <defs>
      <linearGradient
        id="chip-grad"
        x1="0"
        y1="0"
        x2="36"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F5E096" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#AA820A" />
      </linearGradient>
    </defs>
  </svg>
);

export const DigitalGift = () => {
  const { config } = useWedding();
  const [isOpen, setIsOpen] = useState(false);

  if (!config.gift?.enabled) return null;

  return (
    <section className="relative py-16 px-4 max-w-xl mx-auto text-center overflow-hidden">
      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="mb-6">
          <span className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
            Tanda Kasih
          </span>
          <h2 className="font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold">
            Wedding Gift
          </h2>
          <FloralDivider className="w-32 h-6 text-gold mx-auto my-2" />
          <p className="text-scale-small text-muted max-w-md mx-auto mt-2 leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda
            bermaksud memberikan tanda kasih, Anda dapat menyampaikannya secara
            cashless melalui:
          </p>
        </div>

        {/* Tombol Segel Amplop Digital (Royal Wax Seal Button) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold/15 via-white to-gold/15 border-2 border-gold/45 shadow-soft hover:shadow-glow/40 text-primary hover:text-gold-dark text-scale-small font-bold tracking-wider transition-all duration-300 active:scale-95 mb-6 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            <Gift className="w-3.5 h-3.5 text-gold" />
          </div>
          <span>
            {isOpen ? 'Tutup Amplop Digital' : 'Buka Amplop Digital & Rekening'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gold" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gold" />
          )}
        </button>
      </ScrollReveal>

      {/* Konten Amplop Digital (Desain Kartu ATM Mewah) */}
      {isOpen && (
        <div className="space-y-6 transition-all duration-500 animate-fadeIn">
          {/* Daftar Kartu Bank Bertema ATM Eksklusif */}
          {config.gift.accounts?.map((account, idx) => (
            <ScrollReveal
              key={account.id || idx}
              animation="fade-up"
              delay={idx * 100}
              duration={700}
              repeat={true}
            >
              <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1C2B4E] via-[#28365F] to-[#122347] text-white shadow-luxury border border-gold/45 flex flex-col justify-between overflow-hidden text-left">
                {/* Ornamen Lingkaran Refleksi Kartu */}
                <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute right-12 bottom-0 w-24 h-24 rounded-full bg-gold/10 pointer-events-none" />

                {/* Header Kartu: Chip & Nama Bank */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <CardChipIcon />
                    <Wifi className="w-5 h-5 text-white/50 transform rotate-90" />
                  </div>
                  <span className="font-serif text-scale-h5 font-bold tracking-wider text-white">
                    {account.bankName}
                  </span>
                </div>

                {/* Nomor Rekening Bergaya Timbul (Embossed) */}
                <div className="my-3 relative z-10">
                  <p className="font-mono text-lg sm:text-2xl font-bold tracking-[0.14em] sm:tracking-[0.18em] text-white drop-shadow-sm select-all break-all sm:break-normal">
                    {account.accountNumber}
                  </p>
                </div>

                {/* Pemilik Rekening & Tombol Salin */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-3 border-t border-white/15 relative z-10">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-300 block">
                      Card Holder
                    </span>
                    <p className="font-serif text-scale-small font-bold text-white tracking-wide">
                      {account.accountHolder}
                    </p>
                  </div>

                  <CopyButton
                    textToCopy={account.accountNumber}
                    label="Salin Rekening"
                    className="bg-gold hover:bg-gold-light text-primary font-bold shadow-md self-start sm:self-auto"
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Kado Fisik (Paket Pengiriman) */}
          {config.gift.physicalGift?.enabled && (
            <ScrollReveal
              animation="fade-up"
              delay={150}
              duration={750}
              repeat={true}
            >
              <div className="p-6 sm:p-7 rounded-3xl luxury-pearl-card border-2 border-dashed border-gold/45 shadow-soft flex flex-col items-center text-center relative overflow-hidden">
                {/* Garis Border Ganda Bagian Dalam */}
                <div className="absolute inset-2 rounded-[22px] border border-gold/20 pointer-events-none" />

                {/* Watermark Flora Alam Halus */}
                <CardBotanicalWatermark className="w-40 opacity-[0.06]" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gold/15 text-gold mb-3 border border-gold/40 shadow-xs">
                    <Home className="w-5 h-5 text-primary" />
                  </div>

                  <span className="text-scale-xs uppercase tracking-widest font-bold text-secondary mb-1">
                    Kirim Kado Fisik
                  </span>
                  <p className="font-serif text-scale-h6 font-bold text-primary mb-1">
                    Penerima: {config.gift.physicalGift.recipientName}
                  </p>
                  <p className="text-scale-small text-muted mb-1 font-medium">
                    {config.gift.physicalGift.phone}
                  </p>
                  <p className="text-scale-small text-muted leading-relaxed max-w-sm mx-auto mb-4">
                    {config.gift.physicalGift.address}
                  </p>

                  <CopyButton
                    textToCopy={config.gift.physicalGift.address}
                    label="Salin Alamat Lengkap"
                  />
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      )}
    </section>
  );
};
