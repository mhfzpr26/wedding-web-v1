import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

gsap.registerPlugin(ScrollTrigger);

export const CountdownTimer = () => {
  const { config, isOpened } = useWedding();
  const targetDate = new Date(config.countdownTarget).getTime();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!isOpened) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        '.countdown-glass-plaque',
        { scale: 0.92, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      ).fromTo(
        '.countdown-unit-pod',
        { scale: 0.5, opacity: 0, y: 14 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'back.out(2)',
        },
        '-=0.4',
      );
    },
    { dependencies: [isOpened], scope: containerRef },
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm sm:max-w-md mx-auto my-7 select-none"
    >
      {/* 1a. Ranting Sulur Eucalyptus Kiri Atas: Turun sedikit & tetap bergerak berayun lembut */}
      <div className="absolute -top-3 -left-5 sm:-top-4 sm:-left-6 w-16 sm:w-20 h-auto pointer-events-none z-20 animate-botanical-sway-left">
        <img
          src="/images/custom-ornaments/botanical-branch-left.png"
          alt=""
          className="ref-floral-ornament w-full h-auto select-none pointer-events-none drop-shadow-[0_4px_10px_rgba(40,54,95,0.12)]"
        />
      </div>

      {/* 1b. Kuntum Bunga Gardenia Mekar: Diam di tempat (tidak bergerak & tidak turun), menimpa anggun di atas pangkal ranting */}
      <div className="absolute -top-5 left-2 sm:-top-6 sm:left-3.5 w-16 sm:w-18 h-auto pointer-events-none z-30 drop-shadow-[0_6px_14px_rgba(40,54,95,0.22)]">
        <img
          src="/images/custom-ornaments/blooming-gardenia-accent.png"
          alt=""
          className="ref-floral-ornament w-full h-auto select-none pointer-events-none"
        />
      </div>

      {/* 2. Ornamen Kanan Bawah: Sprig Botani Melengkung (Dikecilkan 1 Ukuran) */}
      <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 w-24 sm:w-28 h-auto pointer-events-none z-20 animate-botanical-sway-right drop-shadow-[0_4px_10px_rgba(40,54,95,0.12)]">
        <img
          src="/images/custom-ornaments/botanical-corner-bottom.png"
          alt=""
          className="ref-floral-ornament w-full h-auto select-none pointer-events-none"
        />
      </div>

      {/* Ambient Backdrop Glow: Mengangkat plakat dari latar */}
      <div className="absolute inset-0 rounded-3xl bg-secondary/25 blur-xl pointer-events-none -z-10" />

      {/* 3. Plakat Berwarna Soft Azure Mist (Jelas Terlihat & Berkontras Tinggi) */}
      <div className="countdown-glass-plaque will-change-transform relative w-full p-4 sm:p-5 rounded-3xl overflow-hidden bg-gradient-to-br from-[#d4e8f7]/95 via-[#e5f2fc]/90 to-[#c8e2f5]/95 backdrop-blur-md border-[1.5px] border-gold/55 shadow-[0_18px_40px_-8px_rgba(40,54,95,0.18),0_2px_8px_rgba(168,127,1,0.15),inset_0_1px_2px_rgba(255,255,255,0.95)] transition-all duration-300">
        {/* Bias Refraksi Cahaya Kaca Kristal */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/70 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

        {/* Garis Beveled Edge / Lis Emas Ganda Bingkai Kaca */}
        <div className="absolute inset-2 rounded-2xl border border-gold/40 pointer-events-none" />

        {/* Subtitle Plakat Kaca */}
        <div className="relative z-10 text-center mb-3">
          <span className="text-[10px] sm:text-scale-xs uppercase tracking-[0.35em] text-primary font-bold pl-[0.35em]">
            Menuju Hari Bahagia
          </span>
        </div>

        {/* Grid 4 Kotak Timer Putih Mutiara Berkontras Tajam (Crisp White Pods) */}
        <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-2.5">
          {units.map((unit, index) => (
            <div
              key={index}
              className="countdown-unit-pod will-change-transform group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-gold/35 shadow-[0_6px_16px_rgba(40,54,95,0.08),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
            >
              {/* Garis Border Ganda Halus Bagian Dalam Kotak */}
              <div className="absolute inset-1 rounded-xl border border-gold/20 pointer-events-none" />

              {/* Kilau Cahaya Mutiara Melintas */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-metallic-sweep pointer-events-none opacity-40" />

              <span className="relative z-10 font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight transition-transform duration-200">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="relative z-10 text-[9px] sm:text-[10px] uppercase tracking-widest text-secondary font-bold mt-0.5">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
