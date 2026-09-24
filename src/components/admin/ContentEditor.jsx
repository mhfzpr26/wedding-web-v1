import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Gift,
  Heart,
  Music,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

export const ContentEditor = () => {
  const {
    config,
    updateSection,
    updateWeddingData,
    resetWeddingData,
    isOpened,
    setIsOpened,
  } = useWedding();

  // Active accordion section
  const [activeSection, setActiveSection] = useState('monogram');
  const [copiedJson, setCopiedJson] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Shortcut update handlers
  const handleMonogramChange = (field, value) => {
    updateSection('monogram', { [field]: value });
  };

  const handleGroomChange = (field, value) => {
    updateSection('groom', { [field]: value });
  };

  const handleBrideChange = (field, value) => {
    updateSection('bride', { [field]: value });
  };

  const handleQuoteChange = (field, value) => {
    updateSection('quote', { [field]: value });
  };

  const handleAudioChange = (field, value) => {
    updateSection('audio', { [field]: value });
  };

  // Event handlers
  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...(config.events || [])];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    updateWeddingData({ events: updatedEvents });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: `acara-${Date.now()}`,
      title: 'Acara Tambahan',
      dateFormatted: 'Sabtu, 24 Oktober 2026',
      dateIso: '2026-10-24',
      time: '19.00 - 21.00 WIB',
      venue: 'Gedung Serbaguna',
      address: 'Jl. Mawar Indah No. 10, Jakarta',
      googleMapsUrl: 'https://maps.google.com',
    };
    updateWeddingData({ events: [...(config.events || []), newEvent] });
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = config.events.filter((_, i) => i !== index);
    updateWeddingData({ events: updatedEvents });
  };

  // Story handlers
  const handleStoryChange = (index, field, value) => {
    const updatedStories = [...(config.stories || [])];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    updateWeddingData({ stories: updatedStories });
  };

  const handleAddStory = () => {
    const newStory = {
      year: new Date().getFullYear().toString(),
      title: 'Momen Spesial',
      description: 'Tuliskan cerita indah perjalanan cinta Anda di sini.',
    };
    updateWeddingData({ stories: [...(config.stories || []), newStory] });
  };

  const handleDeleteStory = (index) => {
    const updatedStories = config.stories.filter((_, i) => i !== index);
    updateWeddingData({ stories: updatedStories });
  };

  // Gift handlers
  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...(config.gift?.accounts || [])];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    updateSection('gift', { accounts: updatedAccounts });
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: `acc-${Date.now()}`,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: config.groom?.shortName || 'Nama Penerima',
    };
    updateSection('gift', {
      accounts: [...(config.gift?.accounts || []), newAccount],
    });
  };

  const handleDeleteAccount = (index) => {
    const updatedAccounts = config.gift.accounts.filter((_, i) => i !== index);
    updateSection('gift', { accounts: updatedAccounts });
  };

  const handlePhysicalGiftChange = (field, value) => {
    updateSection('gift', {
      physicalGift: {
        ...(config.gift?.physicalGift || {}),
        [field]: value,
      },
    });
  };

  // Export JSON Config
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Toggle Accordion Section
  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* BAR QUICK ACTIONS (Preview Switcher & Quick Export) */}
      <div className="p-3 bg-gradient-to-r from-slate-50 via-amber-50/40 to-slate-50 rounded-xl border border-gold/30 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-gold" />
          <span className="font-bold text-[11px] text-primary">
            Preview Layar:
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpened(false)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              !isOpened
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Cover Depan
          </button>
          <button
            type="button"
            onClick={() => setIsOpened(true)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              isOpened
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Isi Undangan
          </button>
        </div>
      </div>

      {/* SEKSI 1: MONOGRAM FLORAL PALING ATAS (FITUR UTAMA BARU) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('monogram')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-serif font-bold text-xs">
              M
            </div>
            <div>
              <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                <span>Monogram Inisial Puncak</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                  Top Header
                </span>
              </h4>
              <p className="text-[10px] text-muted">
                Inisial nama asimetris dinamis (huruf 1 naik, huruf 2 turun)
              </p>
            </div>
          </div>
          {activeSection === 'monogram' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'monogram' && (
          <div className="p-4 space-y-3.5 border-t border-slate-100 bg-white">
            {/* Toggle Tampilkan */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="font-bold text-[11px] text-primary">
                  Tampilkan Monogram Puncak
                </p>
                <p className="text-[10px] text-muted">
                  Tampil di paling atas begitu cover dibuka
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.monogram?.enabled ?? true}
                  onChange={(e) =>
                    handleMonogramChange('enabled', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>

            {/* Mode Inisial Otomatis vs Custom */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pemisah / Separator:
                </label>
                <select
                  value={config.monogram?.separator || '&'}
                  onChange={(e) =>
                    handleMonogramChange('separator', e.target.value)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                >
                  <option value="&">& (Ampersand Kaligrafi Emas)</option>
                  <option value="•">• (Titik Bullet Emas)</option>
                  <option value="♥">♥ (Hati Emas)</option>
                  <option value="|">| (Garis Tegak Vertikal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tagline Atas:
                </label>
                <input
                  type="text"
                  value={config.monogram?.tagline || ''}
                  onChange={(e) =>
                    handleMonogramChange('tagline', e.target.value)
                  }
                  placeholder="Contoh: The Wedding of"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Pilihan Inisial Kustom */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">
                  Gunakan Teks Inisial Kustom:
                </span>
                <input
                  type="checkbox"
                  checked={config.monogram?.useCustomInitials || false}
                  onChange={(e) =>
                    handleMonogramChange('useCustomInitials', e.target.checked)
                  }
                  className="w-4 h-4 accent-gold"
                />
              </div>
              {config.monogram?.useCustomInitials && (
                <input
                  type="text"
                  value={config.monogram?.customInitials || ''}
                  onChange={(e) =>
                    handleMonogramChange('customInitials', e.target.value)
                  }
                  placeholder="Contoh: K & S atau KS"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-gold"
                />
              )}
              <p className="text-[10px] text-muted italic">
                {config.monogram?.useCustomInitials
                  ? 'Menggunakan teks kustom yang Anda ketik di atas.'
                  : `Otomatis: Huruf "${config.groom?.shortName?.[0] || 'K'}" naik ke atas, huruf "${config.bride?.shortName?.[0] || 'S'}" turun ke bawah.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SEKSI 2: DATA MEMPELAI (GROOM & BRIDE) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('couple')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Data Mempelai Pria & Wanita
              </h4>
              <p className="text-[10px] text-muted">
                Nama lengkap, nama panggilan, orang tua, dan media sosial
              </p>
            </div>
          </div>
          {activeSection === 'couple' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'couple' && (
          <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
            {/* MEMPELAI PRIA */}
            <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 space-y-2.5">
              <span className="font-bold text-[11px] text-blue-900 uppercase tracking-wider block">
                👦 Mempelai Pria (Groom)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Nama Panggilan:
                  </label>
                  <input
                    type="text"
                    value={config.groom?.shortName || ''}
                    onChange={(e) =>
                      handleGroomChange('shortName', e.target.value)
                    }
                    placeholder="Contoh: Kevin"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    value={config.groom?.fullName || ''}
                    onChange={(e) =>
                      handleGroomChange('fullName', e.target.value)
                    }
                    placeholder="Kevin Pratama, S.T."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Keterangan Orang Tua:
                </label>
                <input
                  type="text"
                  value={config.groom?.parents || ''}
                  onChange={(e) => handleGroomChange('parents', e.target.value)}
                  placeholder="Putra pertama dari Bpk. ... & Ibu ..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Link Instagram (Opsional):
                </label>
                <input
                  type="text"
                  value={config.groom?.instagram || ''}
                  onChange={(e) =>
                    handleGroomChange('instagram', e.target.value)
                  }
                  placeholder="https://instagram.com/username"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* MEMPELAI WANITA */}
            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-2.5">
              <span className="font-bold text-[11px] text-rose-900 uppercase tracking-wider block">
                👰 Mempelai Wanita (Bride)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Nama Panggilan:
                  </label>
                  <input
                    type="text"
                    value={config.bride?.shortName || ''}
                    onChange={(e) =>
                      handleBrideChange('shortName', e.target.value)
                    }
                    placeholder="Contoh: Sarah"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    value={config.bride?.fullName || ''}
                    onChange={(e) =>
                      handleBrideChange('fullName', e.target.value)
                    }
                    placeholder="Sarah Amanda, S.Kom."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Keterangan Orang Tua:
                </label>
                <input
                  type="text"
                  value={config.bride?.parents || ''}
                  onChange={(e) => handleBrideChange('parents', e.target.value)}
                  placeholder="Putri kedua dari Bpk. ... & Ibu ..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Link Instagram (Opsional):
                </label>
                <input
                  type="text"
                  value={config.bride?.instagram || ''}
                  onChange={(e) =>
                    handleBrideChange('instagram', e.target.value)
                  }
                  placeholder="https://instagram.com/username"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEKSI 3: RANGKAIAN ACARA & COUNTDOWN */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('events')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Rangkaian Acara & Countdown
              </h4>
              <p className="text-[10px] text-muted">
                Akad nikah, resepsi, lokasi peta, dan target hitung mundur
              </p>
            </div>
          </div>
          {activeSection === 'events' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'events' && (
          <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
            {/* Target Countdown Timer */}
            <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/60">
              <label className="block text-[11px] font-bold text-amber-950 mb-1">
                ⏱️ Target Countdown ISO (Format: YYYY-MM-DDTHH:mm:ss+07:00):
              </label>
              <input
                type="text"
                value={config.countdownTarget || ''}
                onChange={(e) =>
                  updateWeddingData({ countdownTarget: e.target.value })
                }
                placeholder="2026-10-24T08:00:00+07:00"
                className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            {/* List Acara */}
            <div className="space-y-3">
              {(config.events || []).map((event, idx) => (
                <div
                  key={event.id || idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-[11px] text-primary">
                      Acara #{idx + 1}: {event.title}
                    </span>
                    {(config.events || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(idx)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        title="Hapus Acara Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Nama Acara:
                      </label>
                      <input
                        type="text"
                        value={event.title || ''}
                        onChange={(e) =>
                          handleEventChange(idx, 'title', e.target.value)
                        }
                        placeholder="Akad Nikah / Resepsi"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        Waktu Jam:
                      </label>
                      <input
                        type="text"
                        value={event.time || ''}
                        onChange={(e) =>
                          handleEventChange(idx, 'time', e.target.value)
                        }
                        placeholder="08.00 - 10.00 WIB"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Tanggal Acara:
                    </label>
                    <input
                      type="text"
                      value={event.dateFormatted || ''}
                      onChange={(e) =>
                        handleEventChange(idx, 'dateFormatted', e.target.value)
                      }
                      placeholder="Sabtu, 24 Oktober 2026"
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Nama Lokasi / Gedung:
                    </label>
                    <input
                      type="text"
                      value={event.venue || ''}
                      onChange={(e) =>
                        handleEventChange(idx, 'venue', e.target.value)
                      }
                      placeholder="Masjid Agung / Grand Ballroom Hotel"
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Alamat Lengkap:
                    </label>
                    <textarea
                      rows={2}
                      value={event.address || ''}
                      onChange={(e) =>
                        handleEventChange(idx, 'address', e.target.value)
                      }
                      placeholder="Jl. Melati Raya No. 12..."
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Link Google Maps:
                    </label>
                    <input
                      type="text"
                      value={event.googleMapsUrl || ''}
                      onChange={(e) =>
                        handleEventChange(idx, 'googleMapsUrl', e.target.value)
                      }
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddEvent}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/50 text-emerald-800 font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Acara Baru</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEKSI 4: AYAT SUCI & DOA PEMBUKA */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('quote')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Kutipan Doa / Ayat Suci
              </h4>
              <p className="text-[10px] text-muted">
                Teks Arab, terjemahan ayat, dan sumber surat
              </p>
            </div>
          </div>
          {activeSection === 'quote' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'quote' && (
          <div className="p-4 space-y-3 border-t border-slate-100 bg-white">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                Teks Arab:
              </label>
              <textarea
                dir="rtl"
                rows={3}
                value={config.quote?.arabic || ''}
                onChange={(e) => handleQuoteChange('arabic', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-['Amiri',_serif] bg-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                Terjemahan Ayat:
              </label>
              <textarea
                rows={3}
                value={config.quote?.translation || ''}
                onChange={(e) =>
                  handleQuoteChange('translation', e.target.value)
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold italic"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                Sumber / Referensi:
              </label>
              <input
                type="text"
                value={config.quote?.source || ''}
                onChange={(e) => handleQuoteChange('source', e.target.value)}
                placeholder="QS. Ar-Rum: 21"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        )}
      </div>

      {/* SEKSI 5: KISAH CINTA (LOVE STORY TIMELINE) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('stories')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Kisah Cinta (Love Story)
              </h4>
              <p className="text-[10px] text-muted">
                Timeline perjalanan cinta dari awal jumpa sampai pelaminan
              </p>
            </div>
          </div>
          {activeSection === 'stories' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'stories' && (
          <div className="p-4 space-y-3 border-t border-slate-100 bg-white">
            {(config.stories || []).map((story, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="font-bold text-[11px] text-primary">
                    Cerita #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStory(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="Hapus Cerita Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Tahun:
                    </label>
                    <input
                      type="text"
                      value={story.year || ''}
                      onChange={(e) =>
                        handleStoryChange(idx, 'year', e.target.value)
                      }
                      placeholder="2021"
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Judul:
                    </label>
                    <input
                      type="text"
                      value={story.title || ''}
                      onChange={(e) =>
                        handleStoryChange(idx, 'title', e.target.value)
                      }
                      placeholder="Pertemuan Pertama"
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Deskripsi Cerita:
                  </label>
                  <textarea
                    rows={2}
                    value={story.description || ''}
                    onChange={(e) =>
                      handleStoryChange(idx, 'description', e.target.value)
                    }
                    placeholder="Ceritakan momen indah di tahun tersebut..."
                    className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddStory}
              className="w-full py-2 px-3 rounded-lg border border-dashed border-amber-400 bg-amber-50/50 text-amber-800 font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Cerita Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* SEKSI 6: AMPLOP DIGITAL & KADO FISIK */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('gifts')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-600" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Amplop Digital & Kado Fisik
              </h4>
              <p className="text-[10px] text-muted">
                Nomor rekening transfer, nama bank, dan alamat kirim kado
              </p>
            </div>
          </div>
          {activeSection === 'gifts' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'gifts' && (
          <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
            {/* Rekening Bank */}
            <div className="space-y-2.5">
              <span className="font-bold text-[11px] text-primary block">
                💳 Daftar Rekening Bank / E-Wallet:
              </span>

              {(config.gift?.accounts || []).map((acc, idx) => (
                <div
                  key={acc.id || idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] text-slate-700">
                      Rekening #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Hapus Rekening Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-600">
                        Bank / E-Wallet:
                      </label>
                      <input
                        type="text"
                        value={acc.bankName || ''}
                        onChange={(e) =>
                          handleAccountChange(idx, 'bankName', e.target.value)
                        }
                        placeholder="BCA / Mandiri / GoPay"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-600">
                        Nomor Rekening:
                      </label>
                      <input
                        type="text"
                        value={acc.accountNumber || ''}
                        onChange={(e) =>
                          handleAccountChange(
                            idx,
                            'accountNumber',
                            e.target.value,
                          )
                        }
                        placeholder="8830123456"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-slate-600">
                      Atas Nama Pemilik:
                    </label>
                    <input
                      type="text"
                      value={acc.accountHolder || ''}
                      onChange={(e) =>
                        handleAccountChange(
                          idx,
                          'accountHolder',
                          e.target.value,
                        )
                      }
                      placeholder="Kevin Pratama"
                      className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAccount}
                className="w-full py-1.5 px-3 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/50 text-emerald-800 font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Rekening Baru</span>
              </button>
            </div>

            {/* Alamat Kado Fisik */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[11px] text-primary block">
                📦 Pengiriman Kado Fisik:
              </span>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Nama Penerima & No HP:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.gift?.physicalGift?.recipientName || ''}
                    onChange={(e) =>
                      handlePhysicalGiftChange('recipientName', e.target.value)
                    }
                    placeholder="Nama Penerima"
                    className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    value={config.gift?.physicalGift?.phone || ''}
                    onChange={(e) =>
                      handlePhysicalGiftChange('phone', e.target.value)
                    }
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Alamat Lengkap Pengiriman:
                </label>
                <textarea
                  rows={2}
                  value={config.gift?.physicalGift?.address || ''}
                  onChange={(e) =>
                    handlePhysicalGiftChange('address', e.target.value)
                  }
                  placeholder="Jl. ..."
                  className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEKSI 7: MUSIK LATAR BELAKANG */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('audio')}
          className="w-full p-3.5 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-600" />
            <div>
              <h4 className="font-bold text-xs text-primary">
                Musik Latar Belakang (Audio)
              </h4>
              <p className="text-[10px] text-muted">
                Judul lagu, artis, dan link stream audio MP3
              </p>
            </div>
          </div>
          {activeSection === 'audio' ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {activeSection === 'audio' && (
          <div className="p-4 space-y-3 border-t border-slate-100 bg-white">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Judul Lagu:
                </label>
                <input
                  type="text"
                  value={config.audio?.title || ''}
                  onChange={(e) => handleAudioChange('title', e.target.value)}
                  placeholder="Judul Lagu"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Nama Artis / Musisi:
                </label>
                <input
                  type="text"
                  value={config.audio?.artist || ''}
                  onChange={(e) => handleAudioChange('artist', e.target.value)}
                  placeholder="Nama Artis"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                URL File Audio (MP3 / Stream Link):
              </label>
              <input
                type="text"
                value={config.audio?.externalAudio || ''}
                onChange={(e) =>
                  handleAudioChange('externalAudio', e.target.value)
                }
                placeholder="https://...mp3"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS (SALIN JSON CONFIG & RESET KE DEFAULT) */}
      <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopyJson}
          className="w-full py-2.5 px-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-primary-light transition-all active:scale-[0.98]"
        >
          {copiedJson ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Konfigurasi JSON Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gold" />
              <span>Salin Konfigurasi JSON Lengkap</span>
            </>
          )}
        </button>

        {!resetConfirm ? (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="w-full py-1.5 px-3 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data ke Pengaturan Default</span>
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2">
            <p className="text-[11px] text-rose-900 font-semibold">
              Yakin ingin mengembalikan semua data ke pengaturan awal?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetWeddingData();
                  setResetConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700"
              >
                Ya, Reset Sekarang
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-[10px] font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
