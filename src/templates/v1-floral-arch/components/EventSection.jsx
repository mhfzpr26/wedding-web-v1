import { CalendarPlus, Clock, ExternalLink, MapPin } from 'lucide-react';
import { CountdownTimer } from '../../../components/common/CountdownTimer';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  FloralBranch,
  FloralDivider,
} from '../assets/VectorOrnaments';

export const EventSection = () => {
  const { config } = useWedding();

  const createGoogleCalendarUrl = (event) => {
    const title = encodeURIComponent(event.calendarTitle || event.title);
    const details = encodeURIComponent(
      `The Wedding of ${config.groom.shortName} & ${config.bride.shortName} - ${event.title}`,
    );
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    const dates = `${event.calendarStart}/${event.calendarEnd}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <section className="relative py-16 px-4 max-w-3xl mx-auto overflow-hidden">
      {/* Ornamen Floral Sudut Samping */}
      <div className="absolute top-1/2 right-12 pointer-events-none opacity-30 w-24 hidden lg:block">
        <FloralBranch className="w-full h-auto transform rotate-45" />
      </div>

      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="text-center mb-6">
          <span className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
            Waktu & Lokasi
          </span>
          <h2 className="font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold">
            Rangkaian Acara
          </h2>
          <FloralDivider className="w-32 h-6 text-gold mx-auto my-2" />
        </div>
      </ScrollReveal>

      {/* Countdown Timer */}
      <ScrollReveal
        animation="zoom-in"
        duration={800}
        delay={100}
        repeat={true}
      >
        <CountdownTimer />
      </ScrollReveal>

      {/* Daftar Kartu Acara (Desain Papan Acara / Regal Calendar Plaque) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {config.events.map((event, idx) => (
          <ScrollReveal
            key={event.id || idx}
            animation="fade-up"
            delay={idx * 150}
            duration={800}
            repeat={true}
            className="h-full"
          >
            <div className="group relative rounded-3xl luxury-pearl-card flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full">
              {/* Garis Border Ganda Bagian Dalam Kartu */}
              <div className="absolute inset-2 rounded-[22px] border border-gold/25 pointer-events-none" />

              {/* Watermark Siluet Flora Alam Tipis di Sudut Bawah Kartu */}
              <CardBotanicalWatermark className="w-40 sm:w-48 opacity-[0.08]" />

              <div className="relative z-10">
                {/* Header Pita Emas Kartu Acara */}
                <div className="bg-gradient-to-r from-primary-light/10 via-gold/15 to-primary-light/10 border-b border-gold/30 px-6 py-4 text-center">
                  <span className="inline-block px-4 py-1 rounded-full text-scale-xs uppercase tracking-widest font-bold bg-primary text-white border border-gold/50 shadow-xs mb-2">
                    {event.title}
                  </span>
                  <p className="font-serif text-scale-h5 font-bold text-primary">
                    {event.dateFormatted}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-scale-xs text-secondary mt-1.5 font-medium bg-white/80 px-3 py-1 rounded-full border border-gold/25">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Lokasi Gedung */}
                <div className="text-center p-6 pb-2">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gold/15 text-gold mb-2 border border-gold/40 shadow-xs">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-serif text-scale-h6 font-bold text-primary">
                    {event.venue}
                  </h4>
                  <p className="text-scale-xs text-muted leading-relaxed max-w-xs mx-auto mt-1.5">
                    {event.address}
                  </p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center gap-2 p-6 pt-2 border-t border-gold/20 mt-4">
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-white text-scale-xs font-semibold hover:bg-primary-light transition-all shadow-sm group-hover:shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={createGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-base-surface border border-gold/40 text-primary text-scale-xs font-semibold hover:bg-white transition-all shadow-sm"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-secondary" />
                  <span>Simpan Tanggal</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
