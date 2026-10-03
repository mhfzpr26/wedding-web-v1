import {
  AlertCircle,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  Gift,
  Heart,
  Image,
  MapPin,
  Music,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

const BANK_OPTIONS = [
  'BCA',
  'Bank Mandiri',
  'BNI',
  'BRI',
  'Bank Syariah Indonesia (BSI)',
  'CIMB Niaga',
  'Permata Bank',
  'Bank Jago',
  'SeaBank',
  'DANA',
  'OVO',
  'GoPay',
  'ShopeePay',
  'Lainnya',
];

const PRESET_SONGS = [
  {
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    url: '/audio/christina_perri_-_thousand_years_-mp3.pm-.mp3',
  },
  {
    title: 'Beautiful in White',
    artist: 'Shane Filan',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113576.mp3',
  },
  {
    title: 'Canon in D (Piano)',
    artist: 'Johann Pachelbel',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=canon-in-d-classical-piano-10022.mp3',
  },
];

export const ClientInfoForm = ({ slug = 'destia-raka' }) => {
  const { config, updateWeddingData, saveWeddingConfig } = useWedding();

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState(() => ({ ...config }));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sinkronisasi data awal saat config diperbarui dari cloud
  useEffect(() => {
    if (config) {
      setFormData((prev) => ({
        ...config,
        bride: { ...(config.bride || {}), ...(prev.bride || {}) },
        groom: { ...(config.groom || {}), ...(prev.groom || {}) },
        events: config.events || prev.events || [],
        gift: {
          ...(config.gift || {}),
          accounts: config.gift?.accounts || prev.gift?.accounts || [],
          physicalGift: {
            ...(config.gift?.physicalGift || {}),
            ...(prev.gift?.physicalGift || {}),
          },
        },
        audio: { ...(config.audio || {}), ...(prev.audio || {}) },
        gallery: {
          ...(config.gallery || {}),
          photos: config.gallery?.photos || prev.gallery?.photos || [],
          video: {
            ...(config.gallery?.video || {}),
            ...(prev.gallery?.video || {}),
          },
        },
      }));
    }
  }, [config]);

  // Handler update field bersarang
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handler Event (Akad / Resepsi)
  const handleEventChange = (index, field, value) => {
    setFormData((prev) => {
      const nextEvents = [...(prev.events || [])];
      nextEvents[index] = {
        ...nextEvents[index],
        [field]: value,
      };
      return { ...prev, events: nextEvents };
    });
  };

  const handleAddEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...(prev.events || []),
        {
          id: `event-${Date.now()}`,
          title: 'Acara Tambahan',
          dateFormatted: 'Sabtu, 7 November 2026',
          time: '19.00 WIB - Selesai',
          venue: 'Nama Tempat / Gedung',
          address: 'Alamat lengkap tempat acara...',
          googleMapsUrl: '',
        },
      ],
    }));
  };

  const handleRemoveEvent = (index) => {
    if (formData.events.length <= 1) {
      alert('Minimal harus ada 1 acara (misal: Akad Nikah atau Resepsi).');
      return;
    }
    if (window.confirm('Hapus acara ini?')) {
      setFormData((prev) => ({
        ...prev,
        events: prev.events.filter((_, i) => i !== index),
      }));
    }
  };

  // Handler Rekening Bank
  const handleAccountChange = (index, field, value) => {
    setFormData((prev) => {
      const nextAccounts = [...(prev.gift?.accounts || [])];
      nextAccounts[index] = {
        ...nextAccounts[index],
        [field]: value,
      };
      return {
        ...prev,
        gift: {
          ...prev.gift,
          accounts: nextAccounts,
        },
      };
    });
  };

  const handleAddAccount = () => {
    setFormData((prev) => ({
      ...prev,
      gift: {
        ...prev.gift,
        accounts: [
          ...(prev.gift?.accounts || []),
          {
            id: `acc-${Date.now()}`,
            bankName: 'BCA',
            accountNumber: '',
            accountHolder: '',
          },
        ],
      },
    }));
  };

  const handleRemoveAccount = (index) => {
    setFormData((prev) => ({
      ...prev,
      gift: {
        ...prev.gift,
        accounts: (prev.gift?.accounts || []).filter((_, i) => i !== index),
      },
    }));
  };

  // Handler Simpan Data Permanen ke Supabase Cloud
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      if (updateWeddingData) {
        updateWeddingData(formData);
      }
      if (saveWeddingConfig) {
        const res = await saveWeddingConfig(formData);
        if (!res?.success) {
          throw new Error(res?.message || 'Gagal menyimpan data ke cloud.');
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Gagal menyimpan data pengantin:', err);
      setErrorMessage(
        err.message || 'Gagal menyimpan data. Pastikan koneksi internet aktif.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { id: 1, label: 'Kedua Mempelai', icon: Heart, subtitle: 'Pria & Wanita' },
    {
      id: 2,
      label: 'Jadwal & Lokasi',
      icon: Calendar,
      subtitle: 'Akad & Resepsi',
    },
    {
      id: 3,
      label: 'Hadiah & Kado',
      icon: Gift,
      subtitle: 'Rekening & Alamat',
    },
    { id: 4, label: 'Galeri & Musik', icon: Music, subtitle: 'Foto & Lagu' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* HEADER BANNER KONTROL PENGANTIN */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-md relative overflow-hidden border border-slate-700/60">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Formulir Mandiri Pengantin</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              Lengkapi Informasi Undangan Anda
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Semua data yang Anda simpan di sini akan otomatis terhubung ke
              server cloud, diperbarui di Admin Studio, dan langsung tampil pada
              halaman undangan utama Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Hasil Undangan</span>
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Data'}</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK STATUS SUKSES */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Alhamdulillah!</strong> Perubahan data undangan Anda telah
              berhasil disimpan ke cloud database.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* STEP PROGRESS WIZARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.id;
          const isDone = activeStep > st.id;

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStep(st.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                  : isDone
                    ? 'bg-white/80 border-emerald-300 text-slate-700'
                    : 'bg-white/50 border-slate-200 text-slate-400 hover:bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Langkah {st.id}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {st.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* KONTEN WIZARD STEP */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
        {/* ============================================================== */}
        {/* LANGKAH 1: KEDUA MEMPELAI */}
        {/* ============================================================== */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-500" />
                <span>Identitas Kedua Mempelai</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Isi nama panggilan, nama lengkap bergelar, serta nama orang tua
                untuk kedua mempelai.
              </p>
            </div>

            {/* MEMPELAI WANITA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  👰
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mempelai Wanita (The Bride)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan Wanita{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bride?.shortName || ''}
                    onChange={(e) =>
                      handleNestedChange('bride', 'shortName', e.target.value)
                    }
                    placeholder="Contoh: Destia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bride?.fullName || ''}
                    onChange={(e) =>
                      handleNestedChange('bride', 'fullName', e.target.value)
                    }
                    placeholder="Contoh: Destia Dwi Ramadhani, S.Kom"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Nama Orang Tua{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bride?.parents || ''}
                    onChange={(e) =>
                      handleNestedChange('bride', 'parents', e.target.value)
                    }
                    placeholder="Contoh: Putri Kedua dari Bpk. Hendra & Ibu Sri Mulyati"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Akun Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.bride?.instagram || ''}
                    onChange={(e) =>
                      handleNestedChange('bride', 'instagram', e.target.value)
                    }
                    placeholder="Contoh: drdestia atau https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* MEMPELAI PRIA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/40 border border-sky-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  🤵
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mempelai Pria (The Groom)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan Pria <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.groom?.shortName || ''}
                    onChange={(e) =>
                      handleNestedChange('groom', 'shortName', e.target.value)
                    }
                    placeholder="Contoh: Raka"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.groom?.fullName || ''}
                    onChange={(e) =>
                      handleNestedChange('groom', 'fullName', e.target.value)
                    }
                    placeholder="Contoh: Rakafansa Saputra, S.T."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Nama Orang Tua{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.groom?.parents || ''}
                    onChange={(e) =>
                      handleNestedChange('groom', 'parents', e.target.value)
                    }
                    placeholder="Contoh: Putra Pertama dari Bpk. Mashudi & Ibu Lenny Gusnita"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Akun Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.groom?.instagram || ''}
                    onChange={(e) =>
                      handleNestedChange('groom', 'instagram', e.target.value)
                    }
                    placeholder="Contoh: rakafansa_ atau https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH 2: RANGKAIAN ACARA & LOKASI */}
        {/* ============================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span>Jadwal Acara & Lokasi Google Maps</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan tanggal, waktu, nama gedung, dan tautan Google Maps
                  untuk setiap sesi acara.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEvent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Acara Baru</span>
              </button>
            </div>

            <div className="space-y-4">
              {(formData.events || []).map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 relative"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{ev.title || `Sesi Acara #${idx + 1}`}</span>
                    </span>

                    {formData.events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(idx)}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Acara (Judul Sesi)
                      </label>
                      <input
                        type="text"
                        value={ev.title || ''}
                        onChange={(e) =>
                          handleEventChange(idx, 'title', e.target.value)
                        }
                        placeholder="Contoh: Akad Nikah / Resepsi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tanggal Acara (Teks Tampil)
                      </label>
                      <input
                        type="text"
                        value={ev.dateFormatted || ''}
                        onChange={(e) =>
                          handleEventChange(
                            idx,
                            'dateFormatted',
                            e.target.value,
                          )
                        }
                        placeholder="Contoh: Sabtu, 7 November 2026"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Waktu / Jam Pelaksanaan
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={ev.time || ''}
                          onChange={(e) =>
                            handleEventChange(idx, 'time', e.target.value)
                          }
                          placeholder="Contoh: 08.00 WIB - Selesai"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Gedung / Tempat
                      </label>
                      <div className="relative">
                        <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={ev.venue || ''}
                          onChange={(e) =>
                            handleEventChange(idx, 'venue', e.target.value)
                          }
                          placeholder="Contoh: Grand Ballroom Hotel Mulia"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Lengkap Tempat Acara
                      </label>
                      <textarea
                        rows={2}
                        value={ev.address || ''}
                        onChange={(e) =>
                          handleEventChange(idx, 'address', e.target.value)
                        }
                        placeholder="Tuliskan nama jalan, RT/RW, kelurahan, dan kota..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tautan Google Maps Lokasi
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="url"
                          value={ev.googleMapsUrl || ''}
                          onChange={(e) =>
                            handleEventChange(
                              idx,
                              'googleMapsUrl',
                              e.target.value,
                            )
                          }
                          placeholder="Contoh: https://maps.app.goo.gl/..."
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH 3: HADIAH DIGITAL & KADO FISIK */}
        {/* ============================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>Amplop Digital & Kado Fisik</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Atur rekening bank atau e-wallet untuk kado digital, serta
                alamat tujuan jika tamu ingin mengirim kado fisik.
              </p>
            </div>

            {/* DAFTAR REKENING BANK */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>
                    Rekening Bank / E-Wallet (
                    {formData.gift?.accounts?.length || 0})
                  </span>
                </span>

                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tambah Rekening</span>
                </button>
              </div>

              {(formData.gift?.accounts || []).map((acc, idx) => (
                <div
                  key={acc.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Bank / E-Wallet
                    </label>
                    <select
                      value={acc.bankName || 'BCA'}
                      onChange={(e) =>
                        handleAccountChange(idx, 'bankName', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-semibold"
                    >
                      {BANK_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nomor Rekening / No. HP
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
                      placeholder="Contoh: 1234567890"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Atas Nama Pemilik
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
                      placeholder="Contoh: Destia Dwi R."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(idx)}
                      title="Hapus Rekening"
                      className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ALAMAT PENGIRIMAN KADO FISIK */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Alamat Pengiriman Kado Fisik</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penerima Kado
                  </label>
                  <input
                    type="text"
                    value={formData.gift?.physicalGift?.recipientName || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gift: {
                          ...prev.gift,
                          physicalGift: {
                            ...prev.gift?.physicalGift,
                            recipientName: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Contoh: Destia & Raka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp Penerima
                  </label>
                  <input
                    type="text"
                    value={formData.gift?.physicalGift?.phone || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gift: {
                          ...prev.gift,
                          physicalGift: {
                            ...prev.gift?.physicalGift,
                            phone: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Contoh: 0857-8217-6285"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Rumah Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={formData.gift?.physicalGift?.address || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gift: {
                          ...prev.gift,
                          physicalGift: {
                            ...prev.gift?.physicalGift,
                            address: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kecamatan, kota, & kode pos..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH 4: GALERI FOTO & MUSIK */}
        {/* ============================================================== */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <span>Galeri Foto & Musik Latar</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tentukan lagu pengiring undangan pernikahan Anda serta tautan
                galeri foto prewedding.
              </p>
            </div>

            {/* MUSIK PENGIRING */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pilihan Lagu Romantis
                </h4>
              </div>

              {/* Preset Lagu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_SONGS.map((song) => {
                  const isSelected =
                    formData.audio?.title?.toLowerCase() ===
                    song.title.toLowerCase();

                  return (
                    <button
                      key={song.title}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          audio: {
                            ...prev.audio,
                            title: song.title,
                            artist: song.artist,
                            url: song.url,
                            externalAudio: song.url,
                          },
                        }));
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{song.title}</p>
                      <p
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {song.artist}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Lagu
                  </label>
                  <input
                    type="text"
                    value={formData.audio?.title || ''}
                    onChange={(e) =>
                      handleNestedChange('audio', 'title', e.target.value)
                    }
                    placeholder="Contoh: A Thousand Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penyanyi / Artis
                  </label>
                  <input
                    type="text"
                    value={formData.audio?.artist || ''}
                    onChange={(e) =>
                      handleNestedChange('audio', 'artist', e.target.value)
                    }
                    placeholder="Contoh: Christina Perri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* VIDEO TEASER PREWEDDING */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Image className="w-4 h-4 text-slate-600" />
                <span>Video Teaser Prewedding (YouTube / Drive)</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan Video YouTube
                </label>
                <input
                  type="url"
                  value={formData.gallery?.video?.url || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gallery: {
                        ...prev.gallery,
                        video: {
                          ...prev.gallery?.video,
                          url: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Contoh: https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Video akan otomatis disematkan (embed) pada bagian galeri
                  undangan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGASI STEP & TOMBOL SIMPAN */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Langkah Sebelumnya</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>Lanjut ke Langkah {activeStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving ? 'Menyimpan...' : 'Selesai & Simpan Data'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
