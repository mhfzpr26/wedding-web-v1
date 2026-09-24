import { useEffect, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

export const CountdownTimer = () => {
  const { config } = useWedding();
  const targetDate = new Date(config.countdownTarget).getTime();

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
    <div className="w-full max-w-sm mx-auto my-6">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {units.map((unit, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center justify-center p-3 rounded-2xl luxury-pearl-card transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Garis Border Ganda Bagian Dalam */}
            <div className="absolute inset-1 rounded-xl border border-gold/20 pointer-events-none" />

            <span className="relative z-10 font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="relative z-10 text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-semibold mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
