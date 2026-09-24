import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  HeartHandshake,
  Lock,
  MessageSquare,
  Quote,
  Send,
} from 'lucide-react';
import { useState } from 'react';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { useWedding } from '../../../context/WeddingContext';
import {
  CardBotanicalWatermark,
  FloralBranch,
  FloralDivider,
} from '../assets/VectorOrnaments';

// Helper inisial avatar tamu
const getInitial = (name) => {
  if (!name) return 'T';
  const clean = name.replace(/^(Bpk|Ibu|H\.|Hj\.|Dr\.)\s*/i, '').trim();
  return clean.charAt(0).toUpperCase() || 'T';
};

export const RSVPSection = () => {
  const {
    guestName,
    wishes,
    isLoadingWishes,
    existingConfirmation,
    submitRSVP,
  } = useWedding();

  const [attendance, setAttendance] = useState('hadir');
  const [guestsCount, setGuestsCount] = useState(2);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitRSVP({
        attendance,
        guestsCount: attendance === 'hadir' ? guestsCount : 0,
        message,
      });

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#28365F', '#A87F01', '#CAD6E4'],
        ticks: 150,
      });

      setMessage('');
      setShowEditForm(false);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 px-4 max-w-2xl mx-auto overflow-hidden">
      {/* Ornamen Floral Halus di Sisi RSVP */}
      <div className="absolute -top-4 right-14 pointer-events-none opacity-30 w-32 hidden lg:block">
        <FloralBranch className="w-full h-auto transform rotate-45" />
      </div>

      <ScrollReveal animation="fade-up" duration={750} repeat={true}>
        <div className="text-center mb-8">
          <span className="text-scale-xs uppercase tracking-[0.25em] text-secondary font-semibold block mb-1.5">
            Konfirmasi & Doa Restu
          </span>
          <h2 className="font-serif text-scale-h3 sm:text-scale-h2 text-primary font-bold">
            Buku Tamu & RSVP
          </h2>
          <FloralDivider className="w-32 h-6 text-gold mx-auto my-2" />
          <p className="text-scale-small text-muted max-w-md mx-auto mt-1 leading-relaxed">
            Mohon kesediaan Bapak/Ibu/Saudara/i untuk mengonfirmasi kehadiran
            dan memberikan doa restu.
          </p>
        </div>
      </ScrollReveal>

      {/* Jika Tamu Sudah Pernah Konfirmasi & Tidak Sedang Mode Edit */}
      <ScrollReveal
        animation="fade-up"
        delay={150}
        duration={800}
        repeat={true}
      >
        {existingConfirmation && !showEditForm ? (
          <div className="p-6 sm:p-8 rounded-3xl luxury-pearl-card border border-emerald-500/40 text-center mb-10 relative overflow-hidden">
            {/* Garis Border Ganda Bagian Dalam */}
            <div className="absolute inset-2 rounded-[22px] border border-emerald-500/25 pointer-events-none" />

            {/* Watermark Flora Alam Halus */}
            <CardBotanicalWatermark className="w-36 opacity-[0.06]" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-xl font-bold text-primary mb-1">
                Konfirmasi Telah Tercatat
              </h3>
              <p className="text-xs text-muted mb-4">
                Terima kasih{' '}
                <span className="font-semibold text-primary">{guestName}</span>,
                kehadiran dan doa restu Anda sangat berarti bagi kami.
              </p>

              <div className="inline-block px-4 py-2 rounded-xl bg-white/80 border border-gold/30 text-xs mb-4">
                <span className="font-medium text-muted">Status: </span>
                <span className="font-bold text-primary capitalize">
                  {existingConfirmation.attendance === 'hadir'
                    ? `Hadir (${existingConfirmation.guestsCount || 1} Orang)`
                    : 'Berhalangan Hadir'}
                </span>
              </div>

              <div>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-xs text-secondary hover:text-primary underline font-medium"
                >
                  Perbarui Konfirmasi Kehadiran
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulir RSVP */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl luxury-pearl-card mb-10 space-y-5 relative overflow-hidden"
          >
            {/* Garis Border Ganda Bagian Dalam */}
            <div className="absolute inset-2 rounded-[22px] border border-gold/25 pointer-events-none" />

            {/* Watermark Flora Alam Halus */}
            <CardBotanicalWatermark className="w-44 sm:w-56 opacity-[0.08]" />

            <div className="relative z-10 space-y-5">
              {/* NAMA TAMU (TERKUNCI / READ ONLY) */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-primary mb-1.5">
                  <span>Nama Tamu Undangan</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-secondary font-medium">
                    <Lock className="w-3 h-3 text-gold" />
                    <span>Terkunci sesuai tautan</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={guestName}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/85 border border-gold/30 text-primary font-medium text-sm cursor-not-allowed select-none focus:outline-none"
                  />
                </div>
              </div>

              {/* PILIHAN KEHADIRAN */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance('hadir')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition-all ${
                      attendance === 'hadir'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white/70 border-gold/30 text-muted hover:bg-white'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Akan Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('tidak_hadir')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-medium transition-all ${
                      attendance === 'tidak_hadir'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white/70 border-gold/30 text-muted hover:bg-white'
                    }`}
                  >
                    <span>Berhalangan</span>
                  </button>
                </div>
              </div>

              {/* JUMLAH TAMU */}
              {attendance === 'hadir' && (
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">
                    Jumlah Tamu Hadir
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          guestsCount === num
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white/70 border-gold/30 text-muted hover:bg-white'
                        }`}
                      >
                        {num} Orang
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOLOM PESAN & DOA */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/95 border border-gold/40 text-primary text-xs focus:ring-1 focus:ring-gold focus:border-gold outline-none resize-none transition-all placeholder:text-muted/60"
                />
              </div>

              {/* TOMBOL SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-xs font-semibold tracking-wider hover:bg-primary-light active:scale-[0.99] transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirim Konfirmasi...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>Kirim RSVP & Doa Restu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </ScrollReveal>

      {/* FEED UCAPAN & DOA (GUESTBOOK WALL ELEGAN) */}
      <ScrollReveal
        animation="fade-up"
        delay={200}
        duration={800}
        repeat={true}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gold/20 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-secondary" />
              <h4 className="font-serif text-base font-bold text-primary">
                Doa & Ucapan ({wishes.length})
              </h4>
            </div>
          </div>

          {/* List Ucapan Bergaya Kartu Hangat */}
          <div className="max-h-96 overflow-y-auto space-y-3.5 pr-1">
            {isLoadingWishes ? (
              <p className="text-center text-xs text-muted py-6">
                Memuat ucapan...
              </p>
            ) : wishes.length === 0 ? (
              <p className="text-center text-xs text-muted py-6">
                Belum ada ucapan. Jadilah yang pertama memberikan doa!
              </p>
            ) : (
              wishes.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="relative p-4 sm:p-5 rounded-2xl luxury-pearl-card border border-gold/35 flex items-start gap-3.5 transition-all hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Watermark Flora Halus */}
                  <CardBotanicalWatermark className="w-24 sm:w-32 opacity-[0.05]" />

                  {/* Avatar Inisial Nama */}
                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white to-gold/20 border-2 border-gold/40 flex items-center justify-center text-primary font-bold text-scale-small font-serif shadow-xs">
                    {getInitial(item.name)}
                  </div>

                  {/* Konten Doa */}
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-serif text-scale-small font-bold text-primary truncate">
                        {item.name}
                      </span>
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${
                          item.attendance === 'hadir'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.attendance === 'hadir' ? 'Hadir' : 'Berhalangan'}
                      </span>
                    </div>

                    <p className="text-scale-small text-muted leading-relaxed relative pr-6">
                      {item.message}
                      <Quote className="absolute right-0 top-0 w-3.5 h-3.5 text-gold/35 pointer-events-none" />
                    </p>

                    <p className="text-scale-xs text-secondary/70 pt-2 font-medium">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
