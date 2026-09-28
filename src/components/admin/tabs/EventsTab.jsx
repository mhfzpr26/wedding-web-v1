import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';

export const EventsTab = ({ config, updateWeddingData }) => {
  const events = config.events || [];

  const handleCountdownChange = (value) => {
    updateWeddingData({ countdownTarget: value });
  };

  const handleEventChange = (index, field, value) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    updateWeddingData({ events: updated });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: `acara-${Date.now()}`,
      title: 'Acara Baru',
      dateFormatted: 'Sabtu, 14 November 2026',
      dateIso: '2026-11-14',
      time: '10.00 - Selesai',
      venue: 'Nama Gedung / Kediaman',
      address: 'Alamat lengkap tempat pelaksanaan acara',
      googleMapsUrl: 'https://maps.google.com',
      calendarTitle: 'Acara Pernikahan',
      calendarStart: '20261114T100000',
      calendarEnd: '20261114T130000',
    };
    updateWeddingData({ events: [...events, newEvent] });
  };

  const handleDeleteEvent = (index) => {
    if (events.length <= 1) {
      alert('Minimal harus ada 1 acara terdaftar.');
      return;
    }
    const updated = events.filter((_, i) => i !== index);
    updateWeddingData({ events: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <span>Rangkaian Acara Pernikahan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur jadwal akad, resepsi, lokasi peta Google Maps, dan hitung
            mundur (countdown).
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEvent}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold/15 text-primary hover:bg-gold hover:text-white border border-gold/40 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Acara</span>
        </button>
      </div>

      {/* Target Countdown Timer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Target Tanggal Countdown Timer (Format ISO):
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={config.countdownTarget || ''}
            onChange={(e) => handleCountdownChange(e.target.value)}
            placeholder="2026-11-14T08:00:00+07:00"
            className="w-full sm:w-80 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
          />
          <span className="text-[11px] text-slate-400">
            Digunakan sebagai acuan perhitungan waktu mundur (Hari, Jam, Menit,
            Detik).
          </span>
        </div>
      </div>

      {/* Daftar Kartu Acara */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id || index}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-white">
                Acara #{index + 1}: {event.title || 'Tanpa Judul'}
              </span>

              {events.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Acara Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama / Judul Acara:
                </label>
                <input
                  type="text"
                  value={event.title || ''}
                  onChange={(e) =>
                    handleEventChange(index, 'title', e.target.value)
                  }
                  placeholder="Contoh: Akad Nikah / Resepsi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu / Jam Pelaksanaan:
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={event.time || ''}
                    onChange={(e) =>
                      handleEventChange(index, 'time', e.target.value)
                    }
                    placeholder="Contoh: 08.00 - 10.00 WIB"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hari & Tanggal Teks:
                </label>
                <input
                  type="text"
                  value={event.dateFormatted || ''}
                  onChange={(e) =>
                    handleEventChange(index, 'dateFormatted', e.target.value)
                  }
                  placeholder="Contoh: Sabtu, 14 November 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Gedung / Tempat (Venue):
                </label>
                <input
                  type="text"
                  value={event.venue || ''}
                  onChange={(e) =>
                    handleEventChange(index, 'venue', e.target.value)
                  }
                  placeholder="Contoh: Grand Ballroom Hotel Sapphire"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap:
              </label>
              <textarea
                rows={2}
                value={event.address || ''}
                onChange={(e) =>
                  handleEventChange(index, 'address', e.target.value)
                }
                placeholder="Jl. Jend. Sudirman Kav. 45, Jakarta Selatan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link URL Google Maps:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={event.googleMapsUrl || ''}
                  onChange={(e) =>
                    handleEventChange(index, 'googleMapsUrl', e.target.value)
                  }
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
