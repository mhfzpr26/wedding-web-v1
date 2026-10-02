import {
  Calendar,
  Check,
  Clock,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

// Format teks tanggal resmi bahasa Indonesia (Contoh: "Sabtu, 14 November 2026")
const formatIndonesianDate = (isoDate) => {
  if (!isoDate) return '';
  try {
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      const dateObj = new Date(y, m - 1, d);
      const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
      ];
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      return `${days[dateObj.getDay()]}, ${d} ${months[dateObj.getMonth()]} ${y}`;
    }
  } catch (_e) {}
  return isoDate;
};

// Format tampilan pembacaan countdown
const formatIndonesianDatetime = (isoString) => {
  if (!isoString) return 'Belum ditentukan';
  try {
    const d = new Date(isoString);
    if (!Number.isNaN(d.getTime())) {
      const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
      ];
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const pad = (n) => String(n).padStart(2, '0');
      return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} pukul ${pad(d.getHours())}.${pad(d.getMinutes())} WIB`;
    }
  } catch (_e) {}
  return isoString;
};

// Konversi ISO string ke format input datetime-local (YYYY-MM-DDTHH:mm)
const toDatetimeLocalValue = (isoString) => {
  if (!isoString) return '';
  const match = isoString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (match) return match[1];
  try {
    const d = new Date(isoString);
    if (!Number.isNaN(d.getTime())) {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  } catch (_e) {}
  return '';
};

// Deteksi jam mulai dan jam selesai dari data event
const inferTimesFromEvent = (event) => {
  let startTime = '08:00';
  let endTime = '10:00';
  let isUntilEnd = false;

  if (event.calendarStart?.includes('T')) {
    const timePart = event.calendarStart.split('T')[1];
    if (timePart && timePart.length >= 4) {
      startTime = `${timePart.slice(0, 2)}:${timePart.slice(2, 4)}`;
    }
  } else if (event.time) {
    const match = event.time.match(/(\d{1,2})[.:](\d{2})/);
    if (match) {
      startTime = `${match[1].padStart(2, '0')}:${match[2]}`;
    }
  }

  if (event.time && /selesai/i.test(event.time)) {
    isUntilEnd = true;
  } else if (event.calendarEnd?.includes('T')) {
    const timePart = event.calendarEnd.split('T')[1];
    if (timePart && timePart.length >= 4) {
      endTime = `${timePart.slice(0, 2)}:${timePart.slice(2, 4)}`;
    }
  } else if (event.time) {
    const matches = [...event.time.matchAll(/(\d{1,2})[.:](\d{2})/g)];
    if (matches.length > 1) {
      endTime = `${matches[1][1].padStart(2, '0')}:${matches[1][2]}`;
    }
  }

  return { startTime, endTime, isUntilEnd };
};

export const EventsTab = ({ config, updateWeddingData }) => {
  const events = config.events || [];
  const [showAdvancedCountdown, setShowAdvancedCountdown] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const handleCountdownChange = (value) => {
    updateWeddingData({ countdownTarget: value });
  };

  const handleDatetimeLocalChange = (e) => {
    const val = e.target.value;
    if (!val) {
      handleCountdownChange('');
      return;
    }
    // Simpan dalam format ISO dengan zona waktu WIB (+07:00)
    const isoWithTz = `${val}:00+07:00`;
    handleCountdownChange(isoWithTz);
  };

  // Sinkronkan countdown target dengan suatu event
  const handleSyncCountdownWithEvent = (event) => {
    if (!event) return;
    const dateIso = event.dateIso || '2026-11-14';
    const { startTime } = inferTimesFromEvent(event);
    const newTarget = `${dateIso}T${startTime}:00+07:00`;
    handleCountdownChange(newTarget);
    setSyncFeedback(`Countdown disinkronkan dengan ${event.title || 'acara'}!`);
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleEventChange = (index, field, value) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    updateWeddingData({ events: updated });
  };

  // Saat user memilih tanggal di kalender picker event
  const handleEventDateIsoChange = (index, newDateIso) => {
    const updated = [...events];
    const target = updated[index];
    const dateFormatted = formatIndonesianDate(newDateIso);

    // Perbarui juga calendarStart dan calendarEnd jika ada
    const cleanDate = newDateIso.replace(/-/g, '');
    const startTimePart = target.calendarStart?.includes('T')
      ? target.calendarStart.split('T')[1]
      : '090000';
    const endTimePart = target.calendarEnd?.includes('T')
      ? target.calendarEnd.split('T')[1]
      : '120000';

    updated[index] = {
      ...target,
      dateIso: newDateIso,
      dateFormatted: dateFormatted || target.dateFormatted,
      calendarStart: `${cleanDate}T${startTimePart}`,
      calendarEnd: `${cleanDate}T${endTimePart}`,
    };
    updateWeddingData({ events: updated });
  };

  // Saat user mengatur jam mulai / selesai
  const handleEventTimesChange = (
    index,
    newStartTime,
    newEndTime,
    untilEnd,
  ) => {
    const updated = [...events];
    const target = updated[index];
    const cleanDate = (target.dateIso || '2026-11-14').replace(/-/g, '');

    const startH = newStartTime.replace(':', '');
    const endH = newEndTime.replace(':', '');

    const formattedTimeText = untilEnd
      ? `${newStartTime.replace(':', '.')} WIB - Selesai`
      : `${newStartTime.replace(':', '.')} - ${newEndTime.replace(':', '.')} WIB`;

    updated[index] = {
      ...target,
      time: formattedTimeText,
      calendarStart: `${cleanDate}T${startH}00`,
      calendarEnd: `${cleanDate}T${untilEnd ? `${startH}00` : `${endH}00`}`,
    };
    updateWeddingData({ events: updated });
  };

  const handleAddEvent = () => {
    const today = new Date();
    const defaultDateIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const cleanDate = defaultDateIso.replace(/-/g, '');

    const newEvent = {
      id: `acara-${Date.now()}`,
      title: 'Acara Baru',
      dateFormatted: formatIndonesianDate(defaultDateIso),
      dateIso: defaultDateIso,
      time: '10.00 - 13.00 WIB',
      venue: 'Nama Gedung / Kediaman',
      address: 'Alamat lengkap tempat pelaksanaan acara',
      googleMapsUrl: 'https://maps.google.com',
      calendarTitle: 'Acara Pernikahan',
      calendarStart: `${cleanDate}T100000`,
      calendarEnd: `${cleanDate}T130000`,
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
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <span>Rangkaian Acara Pernikahan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur jadwal akad, resepsi, lokasi peta Google Maps, dan hitung
            mundur (countdown) dengan mudah.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEvent}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold/15 text-primary hover:bg-gold hover:text-white border border-gold/40 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Acara Baru</span>
        </button>
      </div>

      {/* TARGET COUNTDOWN TIMER CARD (RAMAH PENGGUNA) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/15 text-primary flex items-center justify-center font-bold">
              ⏳
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Target Hitung Mundur (Countdown Timer)
              </h4>
              <p className="text-[11px] text-slate-500">
                Waktu acuan hitung mundur Hari, Jam, Menit, dan Detik di halaman
                depan.
              </p>
            </div>
          </div>

          {events.length > 0 && (
            <button
              type="button"
              onClick={() => handleSyncCountdownWithEvent(events[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              title="Samakan dengan tanggal dan jam acara pertama"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Samakan dengan {events[0]?.title || 'Acara Pertama'}</span>
            </button>
          )}
        </div>

        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Tanggal & Jam Target Countdown:
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={toDatetimeLocalValue(config.countdownTarget)}
                onChange={handleDatetimeLocalChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-gold transition-colors bg-slate-50/50 hover:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Klik ikon kalender/jam untuk memilih waktu tanpa perlu mengetik
              kode manual.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Teks Acuan Terbaca:
            </span>
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>{formatIndonesianDatetime(config.countdownTarget)}</span>
            </p>
            <button
              type="button"
              onClick={() => setShowAdvancedCountdown(!showAdvancedCountdown)}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer mt-1 inline-block"
            >
              {showAdvancedCountdown
                ? 'Tutup Kode ISO Teknis'
                : 'Lihat / Edit Kode ISO Mentah'}
            </button>
          </div>
        </div>

        {/* Opsi Advanced ISO Format (Bagi yang membutuhkan) */}
        {showAdvancedCountdown && (
          <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs space-y-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Format ISO String Mentah:
            </label>
            <input
              type="text"
              value={config.countdownTarget || ''}
              onChange={(e) => handleCountdownChange(e.target.value)}
              placeholder="2026-11-14T08:00:00+07:00"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs bg-white text-slate-800"
            />
          </div>
        )}
      </div>

      {/* DAFTAR KARTU RANGKAIAN ACARA */}
      <div className="space-y-4">
        {events.map((event, index) => {
          const { startTime, endTime, isUntilEnd } = inferTimesFromEvent(event);

          return (
            <div
              key={event.id || index}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 relative"
            >
              {/* Header Kartu Acara */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-white shadow-2xs">
                    Acara #{index + 1}: {event.title || 'Tanpa Judul'}
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    ({event.dateFormatted || 'Belum ada tanggal'})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSyncCountdownWithEvent(event)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-gold/15 text-slate-600 hover:text-primary text-[11px] font-medium transition-colors cursor-pointer"
                    title="Jadikan tanggal & jam acara ini sebagai target countdown"
                  >
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>Jadikan Countdown</span>
                  </button>

                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                      title="Hapus Acara Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Judul & Nama Acara */}
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
                  placeholder="Contoh: Akad Nikah / Resepsi Pernikahan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* SECTION: PEMILIH TANGGAL VISUAL & TEKS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>Pengaturan Tanggal Acara</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleEventChange(
                        index,
                        'dateFormatted',
                        formatIndonesianDate(event.dateIso || '2026-11-14'),
                      )
                    }
                    className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-gold transition-colors cursor-pointer"
                    title="Otomatiskan teks format resmi Indonesia"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Format Otomatis</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      1. Pilih Tanggal di Kalender:
                    </label>
                    <input
                      type="date"
                      value={event.dateIso || '2026-11-14'}
                      onChange={(e) =>
                        handleEventDateIsoChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Teks formal di sebelah kanan otomatis diperbarui saat
                      tanggal dipilih.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      2. Teks Tanggal Ditampilkan di Undangan:
                    </label>
                    <input
                      type="text"
                      value={event.dateFormatted || ''}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          'dateFormatted',
                          e.target.value,
                        )
                      }
                      placeholder="Sabtu, 14 November 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Dapat diedit bebas jika ingin menambahkan pasaran (misal:{' '}
                      <em>Sabtu Kliwon</em>).
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: PEMILIH WAKTU (JAM MULAI & SELESAI) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>Pengaturan Waktu / Jam Pelaksanaan</span>
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUntilEnd}
                      onChange={(e) =>
                        handleEventTimesChange(
                          index,
                          startTime,
                          endTime,
                          e.target.checked,
                        )
                      }
                      className="rounded text-gold focus:ring-gold"
                    />
                    <span>Hingga Selesai</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jam Mulai:
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) =>
                        handleEventTimesChange(
                          index,
                          e.target.value,
                          endTime,
                          isUntilEnd,
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  {!isUntilEnd && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Jam Selesai:
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                          handleEventTimesChange(
                            index,
                            startTime,
                            e.target.value,
                            false,
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  )}

                  <div className={isUntilEnd ? 'sm:col-span-2' : ''}>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Teks Waktu di Undangan:
                    </label>
                    <input
                      type="text"
                      value={event.time || ''}
                      onChange={(e) =>
                        handleEventChange(index, 'time', e.target.value)
                      }
                      placeholder="08.00 - 10.00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Lokasi & Google Maps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        handleEventChange(
                          index,
                          'googleMapsUrl',
                          e.target.value,
                        )
                      }
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Tempat:
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
