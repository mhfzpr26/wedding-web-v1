import {
  AlertCircle,
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  Database,
  Disc,
  Loader2,
  Music,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  UploadCloud,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// DAFTAR PRESET LAGU PERNIKAHAN POPULER SIAP PAKAI
const PRESET_PLAYLIST = [
  {
    id: 'canon-in-d',
    title: 'Canon in D (Romantic Piano)',
    artist: 'Johann Pachelbel (Solo Piano)',
    url: '/audio/wedding-song.mp3',
    genre: 'Klasik Romantis',
    badge: 'Rekomendasi Utama',
    desc: 'Alunan piano lembut klasik yang sakral dan abadi, sangat disukai untuk pembuka undangan.',
  },
  {
    id: 'akad',
    title: 'Akad',
    artist: 'Payung Teduh',
    url: '/audio/akad_payung-teduh.mp3',
    genre: 'Lagu Pernikahan Indonesia',
    badge: 'Paling Populer',
    desc: 'Lagu cinta legendaris bernuansa hangat dan penuh makna janji suci pernikahan.',
  },
  {
    id: 'thousand-years',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    url: '/audio/christina_perri_-_thousand_years_-mp3.pm-.mp3',
    genre: 'International Romance',
    badge: 'Favorit Dunia',
    desc: 'Lagu romantis emosional tentang cinta yang setia menanti sepanjang masa.',
  },
];

const LOCAL_STORAGE_SAVED_SONGS = 'invatera_saved_songs_library';

export const AudioThemeTab = ({
  config,
  updateSection,
  activeColorPreset,
  setActiveColorPreset,
}) => {
  const audio = config.audio || {};
  const integration = config.integration || {};

  // Audio Preview State
  const [previewTrackUrl, setPreviewTrackUrl] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const previewAudioRef = useRef(null);

  // File Upload State
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  // Saved Songs Library State
  const [savedSongs, setSavedSongs] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_SONGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const currentActiveUrl =
    audio.externalAudio || audio.url || '/audio/wedding-song.mp3';

  // Hentikan pemutaran preview saat komponen unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  // Simpan riwayat lagu ke localStorage
  const saveSongToLibrary = (songObj) => {
    if (!songObj?.url) return;
    setSavedSongs((prev) => {
      // Cek apakah URL sudah pernah ada di koleksi
      const existingIdx = prev.findIndex((s) => s.url === songObj.url);
      let updated;
      if (existingIdx >= 0) {
        updated = [songObj, ...prev.filter((_, idx) => idx !== existingIdx)];
      } else {
        updated = [songObj, ...prev];
      }
      try {
        localStorage.setItem(
          LOCAL_STORAGE_SAVED_SONGS,
          JSON.stringify(updated),
        );
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeSongFromLibrary = (songUrl) => {
    setSavedSongs((prev) => {
      const filtered = prev.filter((s) => s.url !== songUrl);
      try {
        localStorage.setItem(
          LOCAL_STORAGE_SAVED_SONGS,
          JSON.stringify(filtered),
        );
      } catch {
        // ignore
      }
      return filtered;
    });
  };

  // Handler Ganti Lagu (1-Klik Pakai)
  const handleSelectSong = (song) => {
    updateSection('audio', {
      url: song.url,
      externalAudio: song.url,
      title: song.title,
      artist: song.artist,
    });
    setPreviewError(null);

    // Otomatis masukkan ke koleksi tersimpan jika belum ada
    saveSongToLibrary({
      title: song.title,
      artist: song.artist,
      url: song.url,
      genre: song.genre || 'Lagu Pilihan',
      savedAt: new Date().toLocaleDateString('id-ID'),
    });
  };

  // Handler Preview Musik
  const handleTogglePreviewTrack = (targetUrl) => {
    if (!previewAudioRef.current) return;

    if (previewTrackUrl === targetUrl && isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      setPreviewError(null);
      setPreviewTrackUrl(targetUrl);
      previewAudioRef.current.src = targetUrl;
      previewAudioRef.current
        .play()
        .then(() => {
          setIsPreviewPlaying(true);
        })
        .catch((_err) => {
          setIsPreviewPlaying(false);
          setPreviewError(
            `Gagal memutar audio: format tidak didukung atau diblokir CORS browser.`,
          );
        });
    }
  };

  const handleAudioChange = (field, value) => {
    updateSection('audio', { [field]: value });
  };

  const handleIntegrationChange = (field, value) => {
    updateSection('integration', { [field]: value });
  };

  const handleResetToDefaultAudio = () => {
    handleSelectSong(PRESET_PLAYLIST[0]);
  };

  // Handler Unggah File Audio dari Komputer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.type.startsWith('audio/') &&
      !/\.(mp3|ogg|wav|m4a)$/i.test(file.name)
    ) {
      alert('Silakan pilih file audio berformat .mp3, .ogg, .wav, atau .m4a.');
      return;
    }

    setIsUploading(true);
    setUploadFeedback(null);
    setPreviewError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(',')[1];
        const res = await fetch('/api/upload-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            content: base64Content,
          }),
        });
        const data = await res.json();
        if (data.success) {
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          const newSong = {
            title: cleanTitle,
            artist: 'Upload Sendiri',
            url: data.url,
            genre: 'File Unggahan',
            savedAt: new Date().toLocaleDateString('id-ID'),
          };

          handleSelectSong(newSong);

          setUploadFeedback(
            `File "${data.filename}" berhasil diunggah dan langsung aktif!`,
          );
          setTimeout(() => setUploadFeedback(null), 5000);
        } else {
          throw new Error(data.error || 'Gagal menyimpan file audio.');
        }
      } catch (err) {
        setPreviewError(`Upload gagal: ${err.message}`);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const colorPresets = [
    {
      id: 'navy',
      name: 'Royal Midnight Navy',
      description: 'Biru navy agung dipadu aksen emas mewah klasik',
      primaryBg: '#13255A',
      goldBg: '#D4AF37',
    },
    {
      id: 'sage',
      name: 'Botanical Sage Garden',
      description: 'Nuansa hijau sage lembut alami nan menenangkan',
      primaryBg: '#2D4A3E',
      goldBg: '#C2A649',
    },
    {
      id: 'rose',
      name: 'Champagne Rose Blush',
      description: 'Keanggunan rona mawar lembut dan romantis',
      primaryBg: '#5A2D3C',
      goldBg: '#D8A47F',
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER TAB */}
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Tema Tampilan, Musik & Database</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih palet warna nuansa undangan, lagu latar belakang siap pakai,
          serta status database cloud Supabase.
        </p>
      </div>

      {/* 1. PILIHAN PALET WARNA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-amber-500" />
          <span>Preset Warna Undangan</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setActiveColorPreset(preset.id);
                updateSection('theme', { colorPreset: preset.id });
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeColorPreset === preset.id
                  ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs inline-block"
                  style={{ backgroundColor: preset.primaryBg }}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs inline-block -ml-2"
                  style={{ backgroundColor: preset.goldBg }}
                />
                <span className="text-xs font-bold text-slate-800 ml-1">
                  {preset.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MUSIK LATAR BELAKANG */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-500" />
              <span>Musik Latar Belakang (Background Audio)</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lagu yang otomatis diputar saat tamu membuka undangan pernikahan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetToDefaultAudio}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ke Canon in D</span>
          </button>
        </div>

        {/* STATUS LAGU AKTIF SAAT INI DENGAN MINI PLAYER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => handleTogglePreviewTrack(currentActiveUrl)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md ${
                previewTrackUrl === currentActiveUrl && isPreviewPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              title={
                previewTrackUrl === currentActiveUrl && isPreviewPlaying
                  ? 'Jeda Audio Preview'
                  : 'Dengarkan Lagu Aktif'
              }
            >
              {previewTrackUrl === currentActiveUrl && isPreviewPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  Lagu Aktif
                </span>
                {previewTrackUrl === currentActiveUrl && isPreviewPlaying && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 animate-pulse">
                    <Volume2 className="w-3 h-3" /> Sedang Diputar
                  </span>
                )}
              </div>
              <h5 className="text-sm font-bold text-slate-800 mt-1">
                {audio.title || 'Lagu Belum Diberi Judul'}
              </h5>
              <p className="text-xs text-slate-500">
                {audio.artist || 'Artis Tidak Diketahui'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentActiveUrl.startsWith('/audio/') ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>File Lokal Stabil (Bebas 404)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <Music className="w-3.5 h-3.5 text-amber-500" />
                <span>Eksternal URL</span>
              </span>
            )}
          </div>
        </div>

        {/* FEEDBACK & ERROR DISPLAY */}
        {uploadFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadFeedback}</span>
          </div>
        )}

        {previewError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-semibold">Perhatian Audio:</p>
              <p className="text-[11px] mt-0.5 text-rose-600 leading-relaxed">
                {previewError}
              </p>
            </div>
          </div>
        )}

        {/* PILIHAN PRESET PLAYLIST SIAP PAKAI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pilihan Musik Favorit Siap Pakai (1-Klik Aktif)</span>
            </h5>
            <span className="text-[11px] text-slate-400">
              Langsung tersedia di server
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_PLAYLIST.map((song) => {
              const isSelected = currentActiveUrl === song.url;
              const isSongPlaying =
                previewTrackUrl === song.url && isPreviewPlaying;

              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-400/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {song.genre}
                      </span>
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                          Aktif Dipakai
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-amber-600">
                          {song.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h6 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {song.title}
                      </h6>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {song.artist}
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                      {song.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleTogglePreviewTrack(song.url)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isSongPlaying
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={
                        isSongPlaying ? 'Jeda Suara' : 'Dengarkan Cuplikan Lagu'
                      }
                    >
                      {isSongPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectSong(song)}
                      disabled={isSelected}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-amber-100 text-amber-800 opacity-60 cursor-default'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                      }`}
                    >
                      {isSelected ? '✓ Sedang Digunakan' : 'Gunakan Lagu Ini'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLEKSI & RIWAYAT LAGU SAYA */}
        {savedSongs.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Bookmark className="w-4 h-4 text-indigo-500" />
                <span>Koleksi & Riwayat Lagu Anda ({savedSongs.length})</span>
              </h5>
              <span className="text-[11px] text-slate-400">
                Tersimpan di browser untuk dipakai kapan saja
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {savedSongs.map((s, idx) => {
                const isSelected = currentActiveUrl === s.url;
                const isSongPlaying =
                  previewTrackUrl === s.url && isPreviewPlaying;

                return (
                  <div
                    key={s.url || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-50/40 ring-1 ring-indigo-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePreviewTrack(s.url)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isSongPlaying
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSongPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {s.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {s.artist} {s.savedAt ? `• ${s.savedAt}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectSong(s)}
                        disabled={isSelected}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-100 text-indigo-700 cursor-default'
                            : 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Aktif' : 'Pilih'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSongFromLibrary(s.url)}
                        title="Hapus dari riwayat lagu"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INPUT LAGU KUSTOM / LINK SENDIRI */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Disc className="w-4 h-4 text-slate-500" />
              <span>Gunakan Lagu Sendiri (Link Audio MP3 Kustom)</span>
            </h5>
            <button
              type="button"
              onClick={() => {
                if (audio.url) {
                  saveSongToLibrary({
                    title: audio.title || 'Lagu Kustom',
                    artist: audio.artist || 'Artis Kustom',
                    url: audio.url,
                    genre: 'Lagu Kustom',
                    savedAt: new Date().toLocaleDateString('id-ID'),
                  });
                  alert('Lagu berhasil disimpan ke daftar koleksi!');
                }
              }}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Simpan ke Koleksi Saya</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Judul Lagu:
              </label>
              <input
                type="text"
                value={audio.title || ''}
                onChange={(e) => handleAudioChange('title', e.target.value)}
                placeholder="Misal: Sempurna (Instrumental)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Penyanyi / Artis:
              </label>
              <input
                type="text"
                value={audio.artist || ''}
                onChange={(e) => handleAudioChange('artist', e.target.value)}
                placeholder="Misal: Andra and The Backbone"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Tautan / URL File Audio (Format MP3 / OGG):
              </label>
              <input
                type="text"
                value={audio.externalAudio || audio.url || ''}
                onChange={(e) => {
                  handleAudioChange('externalAudio', e.target.value.trim());
                  handleAudioChange('url', e.target.value.trim());
                }}
                placeholder="https://server-anda.com/lagu-nikah.mp3"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Pastikan tautan dapat diakses publik langsung ke file{' '}
                <code>.mp3</code> (bukan tautan halaman pemutar
                Spotify/YouTube).
              </p>
            </div>
          </div>

          {/* OPSI UNGGAH FILE KHUSUS LOCAL DEV */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.ogg,.wav,.m4a"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-[11px] text-slate-500">
              Punya file audio di laptop?
            </span>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unggah File dari Komputer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HIDDEN HTML5 AUDIO UNTUK PREVIEW */}
        <audio
          ref={previewAudioRef}
          onEnded={() => setIsPreviewPlaying(false)}
          onError={() => {
            setIsPreviewPlaying(false);
            setPreviewError(
              'Tautan audio tidak dapat diputar. Kemungkinan link mati (404) atau diblokir oleh server asal.',
            );
          }}
        />
      </div>

      {/* 3. STATUS DATABASE CLOUD & INTEGRASI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Database Cloud & Integrasi Sistem</span>
        </h4>

        {/* KARTU STATUS SUPABASE POSTGRESQL (AKTIF) */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Supabase PostgreSQL Cloud
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Aktif & Terhubung
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Seluruh pengaturan Admin Studio dan data buku tamu (RSVP)
                tersinkronisasi otomatis secara real-time ke semua HP & Laptop.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-xl bg-white border border-emerald-200 text-[10px] font-mono font-semibold text-emerald-800">
              xovcthkeiwprfmqggtid.supabase.co
            </span>
          </div>
        </div>

        {/* INTEGRASI CADANGAN: GOOGLE SPREADSHEET (OPSIONAL) */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Cadangan Google Spreadsheet (Opsional):
          </label>
          <input
            type="text"
            value={integration.googleAppsScriptUrl || ''}
            onChange={(e) =>
              handleIntegrationChange(
                'googleAppsScriptUrl',
                e.target.value.trim(),
              )
            }
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <p className="text-[10px] text-slate-400">
            Opsional. Jika diisi, data RSVP selain masuk ke Supabase juga akan
            dikirimkan salinannya ke Google Spreadsheet Anda.
          </p>
        </div>
      </div>
    </div>
  );
};
