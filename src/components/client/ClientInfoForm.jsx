import {
  AlertCircle,
  BookOpen,
  Building,
  Calendar,
  Camera,
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
  Loader2,
  MapPin,
  Music,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { uploadWeddingPhoto } from '../../services/storageService';

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
        couple: { ...(config.couple || {}), ...(prev.couple || {}) },
        bride: { ...(config.bride || {}), ...(prev.bride || {}) },
        groom: { ...(config.groom || {}), ...(prev.groom || {}) },
        events: config.events || prev.events || [],
        stories: config.stories || prev.stories || [],
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

  // State & Handlers Upload Foto
  const [isUploadingCouplePhoto, setIsUploadingCouplePhoto] = useState(false);
  const [couplePhotoError, setCouplePhotoError] = useState('');
  const coupleFileInputRef = useRef(null);

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [galleryError, setGalleryError] = useState('');
  const galleryFileInputRef = useRef(null);

  const handleCouplePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCouplePhoto(true);
    setCouplePhotoError('');
    try {
      const res = await uploadWeddingPhoto(file, 'couple');
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          couple: {
            ...(prev.couple || {}),
            photo: res.url,
            showPhoto: true,
          },
        }));
      } else {
        throw new Error(res.error || 'Gagal mengunggah foto pasangan.');
      }
    } catch (err) {
      setCouplePhotoError(err.message || 'Gagal mengunggah foto pasangan.');
    } finally {
      setIsUploadingCouplePhoto(false);
      if (coupleFileInputRef.current) coupleFileInputRef.current.value = '';
    }
  };

  const handleRemoveCouplePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      couple: {
        ...(prev.couple || {}),
        photo: '',
      },
    }));
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    setGalleryError('');
    setGalleryUploadProgress({ current: 0, total: files.length });

    const newPhotos = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setGalleryUploadProgress({ current: i + 1, total: files.length });
        const res = await uploadWeddingPhoto(files[i], 'gallery');
        if (res.success && res.url) {
          newPhotos.push({
            id: `photo-${Date.now()}-${i}`,
            url: res.url,
            caption: 'Momen Indah Bersama',
          });
        }
      }

      if (newPhotos.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: {
            ...prev.gallery,
            photos: [...(prev.gallery?.photos || []), ...newPhotos],
          },
        }));
      }
    } catch (err) {
      setGalleryError(err.message || 'Sebagian foto gagal diunggah.');
    } finally {
      setIsUploadingGallery(false);
      setGalleryUploadProgress({ current: 0, total: 0 });
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  const handleDeleteGalleryPhoto = (index) => {
    setFormData((prev) => {
      const currentPhotos = prev.gallery?.photos || [];
      return {
        ...prev,
        gallery: {
          ...prev.gallery,
          photos: currentPhotos.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const handleGalleryCaptionChange = (index, caption) => {
    setFormData((prev) => {
      const currentPhotos = [...(prev.gallery?.photos || [])];
      if (currentPhotos[index]) {
        currentPhotos[index] = { ...currentPhotos[index], caption };
      }
      return {
        ...prev,
        gallery: {
          ...prev.gallery,
          photos: currentPhotos,
        },
      };
    });
  };

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

  // Handler Kisah Cinta
  const handleStoryChange = (index, field, value) => {
    setFormData((prev) => {
      const nextStories = [...(prev.stories || [])];
      nextStories[index] = {
        ...nextStories[index],
        [field]: value,
      };
      return { ...prev, stories: nextStories };
    });
  };

  const handleAddStory = () => {
    setFormData((prev) => ({
      ...prev,
      stories: [
        ...(prev.stories || []),
        {
          year: new Date().getFullYear().toString(),
          title: 'Momen Berkesan',
          description: 'Ceritakan momen indah dan bermakna ini...',
        },
      ],
    }));
  };

  const handleRemoveStory = (index) => {
    setFormData((prev) => ({
      ...prev,
      stories: (prev.stories || []).filter((_, i) => i !== index),
    }));
  };

  // Evaluasi mode konten yang diaktifkan oleh Admin di Admin Studio
  const isCouplePhotoEnabled = config.couple?.showPhoto !== false;
  const isBrideInstagramEnabled = config.bride?.showInstagram !== false;
  const isGroomInstagramEnabled = config.groom?.showInstagram !== false;
  const isGiftEnabled = config.gift?.enabled !== false;
  const isPhysicalGiftEnabled =
    isGiftEnabled && config.gift?.physicalGift?.enabled !== false;
  const isGalleryEnabled = config.gallery?.enabled !== false;
  const isVideoEnabled = config.gallery?.video?.enabled !== false;
  const isStoriesEnabled = Boolean(config.storiesEnabled);

  // Bangun daftar langkah dinamis (Smart Wizard)
  const dynamicSteps = [
    {
      key: 'couple',
      label: 'Kedua Mempelai',
      icon: Heart,
      subtitle: 'Pria & Wanita',
    },
    {
      key: 'events',
      label: 'Jadwal & Lokasi',
      icon: Calendar,
      subtitle: 'Akad & Resepsi',
    },
    ...(isGiftEnabled
      ? [
          {
            key: 'gift',
            label: 'Hadiah & Kado',
            icon: Gift,
            subtitle: isPhysicalGiftEnabled
              ? 'Rekening & Alamat'
              : 'Rekening Bank',
          },
        ]
      : []),
    {
      key: 'media',
      label: isGalleryEnabled ? 'Galeri & Musik' : 'Musik Pengiring',
      icon: isGalleryEnabled ? Image : Music,
      subtitle: isGalleryEnabled ? 'Foto & Lagu' : 'Lagu Latar',
    },
    ...(isStoriesEnabled
      ? [
          {
            key: 'stories',
            label: 'Kisah Cinta',
            icon: BookOpen,
            subtitle: 'Timeline Momen',
          },
        ]
      : []),
  ];

  const currentStepIndex = Math.min(
    Math.max(1, activeStep),
    dynamicSteps.length,
  );
  const currentStep = dynamicSteps[currentStepIndex - 1] || dynamicSteps[0];
  const currentStepKey = currentStep.key;

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

      {/* STEP PROGRESS WIZARD DINAMIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {dynamicSteps.map((st, idx) => {
          const Icon = st.icon;
          const stepNumber = idx + 1;
          const isActive = currentStepIndex === stepNumber;
          const isDone = currentStepIndex > stepNumber;

          return (
            <button
              key={st.key}
              type="button"
              onClick={() => setActiveStep(stepNumber)}
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
                      ? 'bg-emerald-100 text-emerald-700 font-bold'
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
                  Langkah {stepNumber}
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
        {/* LANGKAH: KEDUA MEMPELAI                                        */}
        {/* ============================================================== */}
        {currentStepKey === 'couple' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-500" />
                <span>Identitas Kedua Mempelai</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Isi foto pasangan bersama, nama panggilan, nama lengkap
                bergelar, serta nama orang tua untuk kedua mempelai.
              </p>
            </div>

            {/* FOTO PASANGAN / BERDUA (HANYA MUNCUL JIKA DIAKTIFKAN ADMIN) */}
            {isCouplePhotoEnabled && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                      <Camera className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Foto Pasangan Berdua (Tampil di Atas Card Mempelai)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Foto Anda dan pasangan akan ditampilkan dalam bingkai
                        kubah lengkung yang elegan. Jika kosong, akan memakai
                        ilustrasi karakter romantis.
                      </p>
                    </div>
                  </div>
                </div>

                {couplePhotoError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                    {couplePhotoError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Preview Thumbnail Arch */}
                  <div className="w-28 h-36 rounded-t-full rounded-b-xl overflow-hidden bg-white border-2 border-amber-400/50 shadow-sm shrink-0 relative group flex items-center justify-center">
                    {formData.couple?.photo ? (
                      <img
                        src={formData.couple.photo}
                        alt="Foto Pasangan"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Image className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px] leading-tight block">
                          Karakter Vektor Aktif
                        </span>
                      </div>
                    )}

                    {isUploadingCouplePhoto && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-5 h-5 animate-spin mb-1 text-amber-400" />
                        <span className="text-[10px] font-bold">
                          Mengunggah...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tombol Upload */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={coupleFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCouplePhotoUpload}
                        className="hidden"
                        id="client-couple-photo-input"
                        disabled={isUploadingCouplePhoto}
                      />
                      <label
                        htmlFor="client-couple-photo-input"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          isUploadingCouplePhoto
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>
                          {formData.couple?.photo
                            ? 'Ganti Foto Pasangan'
                            : 'Pilih Foto dari Galeri HP / Laptop'}
                        </span>
                      </label>

                      {formData.couple?.photo && (
                        <button
                          type="button"
                          onClick={handleRemoveCouplePhoto}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Foto (Gunakan Karakter Vektor)</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Pilih foto terbaik berdua bersama pasangan. Foto otomatis
                      dikompresi agar undangan dimuat super cepat oleh seluruh
                      tamu undangan.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

                {isBrideInstagramEnabled && (
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
                )}
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

                {isGroomInstagramEnabled && (
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH: RANGKAIAN ACARA & LOKASI                              */}
        {/* ============================================================== */}
        {currentStepKey === 'events' && (
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
        {/* LANGKAH: HADIAH DIGITAL & KADO FISIK                           */}
        {/* ============================================================== */}
        {currentStepKey === 'gift' && (
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

            {/* ALAMAT PENGIRIMAN KADO FISIK (HANYA JIKA DIAKTIFKAN OLEH ADMIN) */}
            {isPhysicalGiftEnabled && (
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
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH: GALERI FOTO & MUSIK                                   */}
        {/* ============================================================== */}
        {currentStepKey === 'media' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                {isGalleryEnabled ? (
                  <Image className="w-5 h-5 text-amber-500" />
                ) : (
                  <Music className="w-5 h-5 text-amber-500" />
                )}
                <span>
                  {isGalleryEnabled
                    ? 'Galeri Foto & Musik Latar'
                    : 'Musik Latar Undangan'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isGalleryEnabled
                  ? 'Tentukan lagu pengiring undangan pernikahan Anda serta unggah galeri foto prewedding.'
                  : 'Tentukan lagu romantis pengiring undangan pernikahan Anda.'}
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

            {/* VIDEO TEASER PREWEDDING (HANYA JIKA DIAKTIFKAN OLEH ADMIN) */}
            {isVideoEnabled && (
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
            )}

            {/* GALERI FOTO PREWEDDING (HANYA JIKA DIAKTIFKAN OLEH ADMIN) */}
            {isGalleryEnabled && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Image className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Galeri Foto Prewedding (
                        {formData.gallery?.photos?.length || 0} Foto)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Foto akan tertata rapi dan bisa diklik oleh tamu
                        undangan untuk diperbesar (lightbox).
                      </p>
                    </div>
                  </div>

                  <div>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      id="client-gallery-photo-input"
                      disabled={isUploadingGallery}
                    />
                    <label
                      htmlFor="client-gallery-photo-input"
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                        isUploadingGallery
                          ? 'bg-amber-300 text-slate-700 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isUploadingGallery ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>
                            Mengunggah ({galleryUploadProgress.current}/
                            {galleryUploadProgress.total})...
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>+ Upload Foto Prewedding (Bisa Banyak)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {galleryError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                    {galleryError}
                  </div>
                )}

                {!formData.gallery?.photos ||
                formData.gallery.photos.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <Image className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">
                      Belum ada foto galeri
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Klik tombol "+ Upload Foto Prewedding" di atas untuk
                      memilih foto langsung dari galeri HP atau laptop Anda.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.gallery.photos.map((photo, index) => (
                      <div
                        key={photo.id || index}
                        className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group"
                      >
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-200 relative">
                          <img
                            src={photo.url}
                            alt="Galeri"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryPhoto(index)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) =>
                            handleGalleryCaptionChange(index, e.target.value)
                          }
                          placeholder="Keterangan foto..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* LANGKAH: KISAH CINTA (LOVE STORY TIMELINE)                     */}
        {/* ============================================================== */}
        {currentStepKey === 'stories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>Kisah Cinta (Love Story Timeline)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tuliskan perjalanan kisah cinta Anda mulai dari awal
                  perjumpaan hingga hari lamaran pernikahan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Momen</span>
              </button>
            </div>

            {!formData.stories || formData.stories.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Belum ada momen kisah cinta
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                  Klik tombol "+ Tambah Momen" untuk menambahkan babak cerita
                  perjalanan cinta Anda.
                </p>
                <button
                  type="button"
                  onClick={handleAddStory}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Momen Pertama</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.stories.map((story, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 relative"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{story.title || `Momen #${idx + 1}`}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveStory(idx)}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tahun / Periode
                        </label>
                        <input
                          type="text"
                          value={story.year || ''}
                          onChange={(e) =>
                            handleStoryChange(idx, 'year', e.target.value)
                          }
                          placeholder="Contoh: 2021"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Judul Bab Cerita
                        </label>
                        <input
                          type="text"
                          value={story.title || ''}
                          onChange={(e) =>
                            handleStoryChange(idx, 'title', e.target.value)
                          }
                          placeholder="Contoh: Pertama Kali Bertemu di Kampus"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Isi Cerita / Penggalan Kenangan
                        </label>
                        <textarea
                          rows={3}
                          value={story.description || ''}
                          onChange={(e) =>
                            handleStoryChange(
                              idx,
                              'description',
                              e.target.value,
                            )
                          }
                          placeholder="Ceritakan momen indah dan bermakna ini secara singkat dan romantis..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NAVIGASI STEP & TOMBOL SIMPAN */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {currentStepIndex > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(currentStepIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Langkah Sebelumnya</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {currentStepIndex < dynamicSteps.length ? (
              <button
                type="button"
                onClick={() => setActiveStep(currentStepIndex + 1)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>Lanjut ke Langkah {currentStepIndex + 1}</span>
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
