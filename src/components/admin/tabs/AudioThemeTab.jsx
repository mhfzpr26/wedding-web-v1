import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileAudio,
  Loader2,
  Music,
  Palette,
  Pause,
  Play,
  RotateCcw,
  UploadCloud,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const AudioThemeTab = ({
  config,
  updateSection,
  activeColorPreset,
  setActiveColorPreset,
}) => {
  const audio = config.audio || {};
  const integration = config.integration || {};

  // Audio Preview State
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const previewAudioRef = useRef(null);

  // File Upload & Local Library State
  const fileInputRef = useRef(null);
  const [localFiles, setLocalFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  const currentAudioSource =
    audio.externalAudio || audio.url || '/audio/wedding-song.mp3';

  // Hentikan audio preview jika tab atau source berganti
  useEffect(() => {
    if (!currentAudioSource) return;
    setIsPreviewPlaying(false);
    setPreviewError(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }
  }, [currentAudioSource]);

  // Muat daftar file audio lokal dari API
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (refreshTrigger < 0) return;
    const loadFiles = async () => {
      try {
        const res = await fetch('/api/audio-files');
        const data = await res.json();
        if (data.success && Array.isArray(data.files)) {
          setLocalFiles(data.files);
        }
      } catch (_e) {}
    };
    loadFiles();
  }, [refreshTrigger]);

  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      setPreviewError(null);
      previewAudioRef.current
        .play()
        .then(() => {
          setIsPreviewPlaying(true);
        })
        .catch((_err) => {
          setIsPreviewPlaying(false);
          setPreviewError(
            'Gagal memutar audio: URL tidak dapat diakses (404), format tidak didukung, atau diblokir CORS.',
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
    updateSection('audio', {
      url: '/audio/wedding-song.mp3',
      externalAudio: '/audio/wedding-song.mp3',
      title: 'Canon in D (Romantic Piano)',
      artist: 'Johann Pachelbel (Solo Piano)',
    });
    setPreviewError(null);
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
          // Bersihkan nama file untuk saran judul otomatis
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          updateSection('audio', {
            url: data.url,
            externalAudio: data.url,
            title: cleanTitle,
          });

          setUploadFeedback(
            `File "${data.filename}" berhasil diunggah & siap diputar!`,
          );
          setRefreshTrigger((prev) => prev + 1);
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

  // Pilih file yang sudah ada di library lokal
  const handleSelectLocalFile = (fileItem) => {
    const cleanTitle = fileItem.filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    updateSection('audio', {
      url: fileItem.url,
      externalAudio: fileItem.url,
      title:
        fileItem.filename === 'wedding-song.mp3'
          ? 'Canon in D (Romantic Piano)'
          : cleanTitle,
      artist:
        fileItem.filename === 'wedding-song.mp3'
          ? 'Johann Pachelbel (Solo Piano)'
          : audio.artist || 'Penyanyi',
    });
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
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Tema Tampilan, Musik & Database</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih palet warna nuansa undangan, lagu latar belakang, serta
          integrasi Google Sheets.
        </p>
      </div>

      {/* PILIHAN PALET WARNA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-gold" />
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
                  ? 'border-gold bg-gold/5 ring-2 ring-gold/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
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

      {/* MUSIK LATAR BELAKANG */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Music className="w-4 h-4 text-gold" />
            <span>Musik Latar Belakang (Background Audio)</span>
          </h4>
          <button
            type="button"
            onClick={handleResetToDefaultAudio}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-gold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Gunakan Lagu Bawaan</span>
          </button>
        </div>

        {/* WIDGET TEST PLAYBACK AUDIO PREVIEW */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePreview}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm ${
                isPreviewPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-gold hover:bg-gold-light text-slate-900'
              }`}
              title={
                isPreviewPlaying
                  ? 'Jeda Audio Preview'
                  : 'Putar Audio untuk Mengetes'
              }
            >
              {isPreviewPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {audio.title || 'Lagu Belum Diberi Judul'}
                </span>
                {isPreviewPlaying && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 animate-pulse">
                    <Volume2 className="w-3 h-3" /> Sedang Memutar
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {audio.artist || 'Artis Tidak Diketahui'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {previewError ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Link Audio Error (404/CORS)</span>
              </span>
            ) : currentAudioSource.startsWith('/audio/') ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lokal Aman (Bebas 404)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Music className="w-3.5 h-3.5 text-gold" />
                <span>Eksternal URL</span>
              </span>
            )}
          </div>

          {/* Hidden HTML5 Audio Element untuk Preview di Admin */}
          <audio
            ref={previewAudioRef}
            src={currentAudioSource}
            onEnded={() => setIsPreviewPlaying(false)}
            onError={() => {
              setIsPreviewPlaying(false);
              setPreviewError(
                'Tautan audio tidak dapat diputar. Kemungkinan link 404 atau diblokir oleh server asal.',
              );
            }}
          />
        </div>

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
              <button
                type="button"
                onClick={handleResetToDefaultAudio}
                className="mt-1.5 text-[11px] font-bold underline text-rose-800 hover:text-rose-950 cursor-pointer"
              >
                Klik di sini untuk beralih ke lagu lokal terpercaya (Canon in D)
              </button>
            </div>
          </div>
        )}

        {/* FITUR UNGGAH FILE AUDIO DARI KOMPUTER */}
        <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-gold/60 bg-slate-50/60 hover:bg-gold/5 transition-all text-center space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.ogg,.wav,.m4a"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-full bg-gold/15 text-primary mx-auto flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gold" />
            ) : (
              <UploadCloud className="w-5 h-5 text-gold" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800">
              {isUploading
                ? 'Sedang mengunggah file musik ke folder proyek...'
                : 'Unggah File Musik dari Komputer / Laptop Anda'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mendukung format file <strong>.mp3</strong>, <strong>.ogg</strong>
              , atau <strong>.wav</strong>. File akan disimpan permanen ke
              folder <code>public/audio/</code>.
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses Upload...</span>
              </>
            ) : (
              <>
                <FileAudio className="w-3.5 h-3.5" />
                <span>Pilih File Musik dari Komputer</span>
              </>
            )}
          </button>
        </div>

        {/* DAFTAR FILE LOKAL YANG SUDAH TERSEDIA */}
        {localFiles.length > 0 && (
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-semibold text-slate-600">
              Pilihan File Musik yang Tersimpan di Server Lokal:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {localFiles.map((f) => {
                const isActive = currentAudioSource === f.url;
                const sizeMb = (f.sizeBytes / (1024 * 1024)).toFixed(1);
                return (
                  <button
                    key={f.filename}
                    type="button"
                    onClick={() => handleSelectLocalFile(f)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'border-gold bg-gold/10 ring-2 ring-gold/30 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Music
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-gold' : 'text-slate-400'
                        }`}
                      />
                      <div className="truncate">
                        <p
                          className={`text-xs font-medium truncate ${
                            isActive
                              ? 'text-primary font-bold'
                              : 'text-slate-700'
                          }`}
                        >
                          {f.filename}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Ukuran: {sizeMb} MB
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold text-slate-900 shrink-0">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 hover:text-primary shrink-0">
                        Pilih
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* INPUT DETAIL LAGU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Lagu:
            </label>
            <input
              type="text"
              value={audio.title || ''}
              onChange={(e) => handleAudioChange('title', e.target.value)}
              placeholder="Canon in D (Romantic Piano)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Artis / Penyanyi:
            </label>
            <input
              type="text"
              value={audio.artist || ''}
              onChange={(e) => handleAudioChange('artist', e.target.value)}
              placeholder="Johann Pachelbel (Solo Piano)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL / Lokasi File Audio (MP3 / OGG):
            </label>
            <input
              type="text"
              value={audio.externalAudio || audio.url || ''}
              onChange={(e) => {
                handleAudioChange('externalAudio', e.target.value.trim());
                handleAudioChange('url', e.target.value.trim());
              }}
              placeholder="/audio/wedding-song.mp3 atau https://domain.com/musik.mp3"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              File yang Anda unggah otomatis tersimpan sebagai{' '}
              <span className="font-mono text-slate-600 font-semibold">
                /audio/nama-file.mp3
              </span>
              . Anda juga dapat memasukkan tautan langsung MP3 online jika
              diinginkan.
            </p>
          </div>
        </div>
      </div>

      {/* INTEGRASI GOOGLE SHEETS RSVP */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-gold" />
          <span>Integrasi Database RSVP (Google Spreadsheet)</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            URL Web App Google Apps Script (RSVP):
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
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Kosongkan kolom ini jika ingin menggunakan mode penyimpanan demo /
            browser lokal.
          </p>
        </div>
      </div>
    </div>
  );
};
