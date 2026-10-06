import {
  Camera,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  UploadCloud,
  Video,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadWeddingPhoto } from '../../../services/storageService';

const PRESET_SAMPLE_PHOTOS = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    caption: 'Momen Bahagia Bersama',
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    caption: 'Langkah Menuju Hari Bahagia',
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    caption: 'Janji Suci Selamanya',
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
    caption: 'Dua Hati Satu Tujuan',
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    caption: 'Kasih & Sayang Abadi',
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
    caption: 'Menatap Masa Depan',
  },
];

export const GalleryTab = ({ config, updateSection }) => {
  const gallery = config.gallery || {
    enabled: true,
    video: { enabled: true, title: '', url: '' },
    photos: [],
  };

  const isGalleryEnabled = gallery.enabled !== false;
  const video = gallery.video || { enabled: true, title: '', url: '' };
  const photos = Array.isArray(gallery.photos) ? gallery.photos : [];

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [swappingIndex, setSwappingIndex] = useState(null);
  const [galleryError, setGalleryError] = useState('');
  const batchInputRef = useRef(null);

  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setGalleryError('');
    setUploadProgress({ current: 0, total: files.length });

    const newUploadedPhotos = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        const res = await uploadWeddingPhoto(files[i], 'gallery');
        if (res.success && res.url) {
          newUploadedPhotos.push({
            id: `photo-${Date.now()}-${i}`,
            url: res.url,
            caption: 'Momen Indah Bersama',
          });
        }
      }

      if (newUploadedPhotos.length > 0) {
        updateSection('gallery', {
          ...gallery,
          photos: [...photos, ...newUploadedPhotos],
        });
      }
    } catch (err) {
      setGalleryError(
        err.message || 'Sebagian atau semua foto gagal diunggah.',
      );
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (batchInputRef.current) batchInputRef.current.value = '';
    }
  };

  const handleSwapPhoto = async (index, file) => {
    if (!file) return;
    setSwappingIndex(index);
    setGalleryError('');
    try {
      const res = await uploadWeddingPhoto(file, 'gallery');
      if (res.success && res.url) {
        const updated = [...photos];
        updated[index] = { ...updated[index], url: res.url };
        updateSection('gallery', {
          ...gallery,
          photos: updated,
        });
      } else {
        throw new Error(res.error || 'Gagal mengganti foto.');
      }
    } catch (err) {
      setGalleryError(err.message || 'Gagal mengganti foto.');
    } finally {
      setSwappingIndex(null);
    }
  };

  const handleToggleGallery = (enabled) => {
    updateSection('gallery', {
      ...gallery,
      enabled,
    });
  };

  const handleToggleVideo = (enabled) => {
    updateSection('gallery', {
      ...gallery,
      video: {
        ...video,
        enabled,
      },
    });
  };

  const handleVideoChange = (field, value) => {
    updateSection('gallery', {
      ...gallery,
      video: {
        ...video,
        [field]: value,
      },
    });
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Momen Indah Bersama',
    };
    updateSection('gallery', {
      ...gallery,
      photos: [...photos, newPhoto],
    });
  };

  const handleDeletePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    updateSection('gallery', {
      ...gallery,
      photos: updated,
    });
  };

  const handlePhotoChange = (index, field, value) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('gallery', {
      ...gallery,
      photos: updated,
    });
  };

  const handleLoadSamplePhotos = () => {
    updateSection('gallery', {
      ...gallery,
      photos: PRESET_SAMPLE_PHOTOS,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER TAB DENGAN MASTER SAKLAR ON/OFF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>Galeri Foto & Video Prewedding</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pajang video teaser dan foto-foto kebersamaan Anda dalam galeri
            elegan berfitur pembesar (lightbox).
          </p>
        </div>

        {/* Master Saklar Aktifkan/Nonaktifkan Seksi Galeri */}
        <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <input
            type="checkbox"
            checked={isGalleryEnabled}
            onChange={(e) => handleToggleGallery(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
          />
          <span className="text-xs font-bold text-slate-700">
            {isGalleryEnabled ? 'Seksi Galeri Aktif' : 'Seksi Galeri Nonaktif'}
          </span>
        </label>
      </div>

      {isGalleryEnabled && (
        <>
          {/* PENGATURAN VIDEO PREWEDDING */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <Video className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Video Prewedding / Teaser
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Mendukung tautan YouTube (Watch, Share, atau Shorts)
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={video.enabled !== false}
                  onChange={(e) => handleToggleVideo(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Tampilkan Video</span>
              </label>
            </div>

            {video.enabled !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Video:
                  </label>
                  <input
                    type="text"
                    value={video.title || ''}
                    onChange={(e) => handleVideoChange('title', e.target.value)}
                    placeholder="Contoh: Prewedding Teaser Destia & Raka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tautan Video YouTube:
                  </label>
                  <input
                    type="text"
                    value={video.url || ''}
                    onChange={(e) =>
                      handleVideoChange('url', e.target.value.trim())
                    }
                    placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bisa berupa video prewedding, ucapan terima kasih, atau
                    dokumentasi lamaran.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PENGATURAN FOTO PREWEDDING */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Foto Prewedding ({photos.length} Foto)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Foto akan ditata rapi dalam grid dan bisa diklik untuk
                    memperbesar (lightbox)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={batchInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBatchUpload}
                  className="hidden"
                  id="batch-upload-gallery"
                  disabled={isUploading}
                />

                <label
                  htmlFor="batch-upload-gallery"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isUploading
                      ? 'bg-amber-300 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        Mengunggah ({uploadProgress.current}/
                        {uploadProgress.total})...
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Foto (HP/Laptop)</span>
                    </>
                  )}
                </label>

                <button
                  type="button"
                  onClick={handleLoadSamplePhotos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Muat Contoh</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  title="Tambah baris foto dengan link URL manual"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah URL</span>
                </button>
              </div>
            </div>

            {galleryError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {galleryError}
              </div>
            )}

            {photos.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Belum ada foto yang ditambahkan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik tombol "Upload Foto (HP/Laptop)" di atas untuk memilih
                  foto langsung dari perangkat Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {photos.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 flex items-start gap-3.5 hover:border-slate-300 transition-all shadow-2xs"
                  >
                    {/* Thumbnail Preview & Ganti Foto */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative group">
                        <img
                          src={item.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          title="Buka Foto Asli"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        {swappingIndex === index && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          </div>
                        )}
                      </div>

                      <label className="inline-flex items-center gap-1 text-[10px] text-amber-600 hover:text-amber-700 font-semibold mt-1 cursor-pointer">
                        <Camera className="w-3 h-3" />
                        <span>Ganti</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleSwapPhoto(index, e.target.files?.[0])
                          }
                          disabled={swappingIndex !== null}
                        />
                      </label>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                          Tautan URL Foto #{index + 1}:
                        </label>
                        <input
                          type="text"
                          value={item.url || ''}
                          onChange={(e) =>
                            handlePhotoChange(index, 'url', e.target.value)
                          }
                          placeholder="https://domain.com/foto.jpg"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                          Keterangan / Caption Foto:
                        </label>
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) =>
                            handlePhotoChange(index, 'caption', e.target.value)
                          }
                          placeholder="Misal: Langkah Menuju Hari Bahagia"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Hapus Foto Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
