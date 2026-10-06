import { supabase } from './supabase';

/**
 * Kompres gambar di sisi klien menggunakan HTML5 Canvas
 * Mengubah foto berukuran besar (3-10 MB) dari kamera HP menjadi ~150-300 KB
 * sehingga undangan tetap super cepat dan hemat penyimpanan.
 */
export async function compressImage(
  file,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82,
) {
  return new Promise((resolve, reject) => {
    // Jika bukan gambar, kembalikan error
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Berkas harus berupa gambar (JPG, PNG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Kalkulasi ukuran baru dengan tetap menjaga rasio aspek
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context tidak tersedia.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke Blob & Base64
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Gagal mengompresi gambar.'));
            }
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            const base64 = dataUrl.split(',')[1];
            resolve({ blob, base64, dataUrl, width, height });
          },
          'image/jpeg',
          quality,
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Unggah foto pernikahan ke Supabase Storage (dengan fallback lokal saat development)
 * @param {File} file - Berkas gambar asli dari input file
 * @param {string} folder - Folder penyimpanan ('gallery' atau 'couple')
 * @returns {Promise<{success: boolean, url: string, source: string, error?: string}>}
 */
export async function uploadWeddingPhoto(file, folder = 'gallery') {
  try {
    if (!file) throw new Error('Berkas foto tidak ditemukan.');

    // 1. Kompres gambar terlebih dahulu
    const { blob, base64 } = await compressImage(file, 1600, 1600, 0.82);

    const ext = 'jpg';
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, '-')
      .replace(/-+/g, '-');
    const fileName = `${Date.now()}-${cleanBase}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // 2. Coba unggah ke Supabase Storage terlebih dahulu (Bucket: wedding-photos)
    let supabaseSuccess = false;
    let publicUrl = '';

    try {
      const { data, error: sbError } = await supabase.storage
        .from('wedding-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!sbError && data) {
        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
          supabaseSuccess = true;
          return {
            success: true,
            url: publicUrl,
            source: 'supabase',
            fileName,
          };
        }
      } else if (sbError) {
        console.warn('Supabase storage upload error:', sbError.message);
      }
    } catch (sbEx) {
      console.warn('Supabase storage network/access warning:', sbEx);
    }

    // 3. Fallback: Unggah ke dev server lokal (/api/upload-photo) jika Supabase belum disiapkan
    if (!supabaseSuccess) {
      try {
        const res = await fetch('/api/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: fileName,
            content: base64,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.url) {
            return {
              success: true,
              url: json.url,
              source: 'local',
              fileName: json.filename,
              notice:
                'Foto tersimpan di penyimpanan lokal. Untuk hosting permanen di Vercel, pastikan bucket "wedding-photos" (Public) sudah dibuat di Supabase.',
            };
          }
        }
      } catch (localErr) {
        console.warn('Local dev API upload error:', localErr);
      }
    }

    throw new Error(
      'Gagal mengunggah foto. Pastikan Anda telah membuat bucket "wedding-photos" dengan akses Public di dashboard Supabase Storage.',
    );
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Terjadi kesalahan saat mengunggah foto.',
    };
  }
}
