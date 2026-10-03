import { weddingConfig } from '../config/weddingConfig';
import { supabase } from './supabase';

const LOCAL_STORAGE_WISHES_KEY = 'invatera_wedding_wishes_v1';
const LOCAL_STORAGE_CONFIRMED_PREFIX = 'invatera_guest_confirmed_';

function formatTimestamp(isoString) {
  if (!isoString) return 'Baru saja';
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Baru saja';
  }
}

export const rsvpService = {
  /**
   * Cek apakah tamu tertentu sudah pernah mengirim RSVP di browser ini
   */
  hasGuestConfirmed(guestName) {
    if (!guestName) return false;
    const cleanKey =
      LOCAL_STORAGE_CONFIRMED_PREFIX + guestName.trim().toLowerCase();
    const stored = localStorage.getItem(cleanKey);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Simpan konfirmasi tamu secara lokal untuk mencegah pengiriman ganda
   */
  saveGuestConfirmedLocally(guestName, payload) {
    if (!guestName) return;
    const cleanKey =
      LOCAL_STORAGE_CONFIRMED_PREFIX + guestName.trim().toLowerCase();
    localStorage.setItem(cleanKey, JSON.stringify(payload));
  },

  /**
   * Dapatkan daftar ucapan (dari Supabase PostgreSQL, Google Sheets, atau LocalStorage)
   */
  async getWishes(customScriptUrl, slug = 'destia-raka') {
    // 1. Coba ambil dari Supabase PostgreSQL
    try {
      const { data, error } = await supabase
        .from('wedding_wishes')
        .select('*')
        .eq('wedding_slug', slug)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((w) => ({
          id: w.id,
          name: w.name,
          attendance: w.attendance,
          guestsCount: w.guests_count || 1,
          message: w.message,
          timestamp: formatTimestamp(w.created_at),
        }));
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase wishes load fallback:', err);
    }

    // 2. Jika Supabase kosong/belum ada tabel, coba Google Apps Script jika terpasang
    const scriptUrl =
      customScriptUrl !== undefined
        ? customScriptUrl
        : weddingConfig.integration?.googleAppsScriptUrl;

    if (scriptUrl?.startsWith('http')) {
      try {
        const response = await fetch(scriptUrl, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.status === 'success' && Array.isArray(data.wishes)) {
            return data.wishes;
          }
        }
      } catch (err) {
        console.warn('Google Sheets offline, fallback ke data lokal:', err);
      }
    }

    // 3. Fallback: ambil dari LocalStorage + initialWishes
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      const parsedLocal = localData ? JSON.parse(localData) : [];
      return [...parsedLocal, ...weddingConfig.initialWishes];
    } catch {
      return weddingConfig.initialWishes;
    }
  },

  /**
   * Kirim konfirmasi kehadiran & ucapan ke Supabase Cloud
   */
  async submitRSVP(payload, customScriptUrl, slug = 'destia-raka') {
    const newWish = {
      id: `local-${Date.now()}`,
      name: payload.name,
      attendance: payload.attendance,
      guestsCount: payload.guestsCount,
      message: payload.message,
      timestamp: 'Baru saja',
    };

    // 1. Simpan tanda konfirmasi tamu ke LocalStorage
    this.saveGuestConfirmedLocally(payload.name, payload);

    // 2. Simpan ucapan ke list lokal (Optimistic UI)
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newWish);
      localStorage.setItem(LOCAL_STORAGE_WISHES_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Gagal menyimpan ke LocalStorage:', err);
    }

    // 3. Kirim ke Supabase Cloud PostgreSQL
    try {
      await supabase.from('wedding_wishes').insert([
        {
          wedding_slug: slug,
          name: payload.name,
          attendance: payload.attendance,
          guests_count: payload.guestsCount,
          message: payload.message,
        },
      ]);
    } catch (cloudErr) {
      console.warn(
        'Gagal kirim ke Supabase, data tetap aman di lokal:',
        cloudErr,
      );
    }

    // 4. Jika ada endpoint Google Sheets opsional
    const scriptUrl =
      customScriptUrl !== undefined
        ? customScriptUrl
        : weddingConfig.integration?.googleAppsScriptUrl;

    if (scriptUrl?.startsWith('http')) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        console.warn(
          'Pengiriman background ke Google Sheets gagal:',
          networkErr,
        );
      }
    }

    return { success: true };
  },
};
