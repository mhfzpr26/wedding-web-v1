import { weddingConfig } from '../config/weddingConfig';

const LOCAL_STORAGE_WISHES_KEY = 'invatera_wedding_wishes_v1';
const LOCAL_STORAGE_CONFIRMED_PREFIX = 'invatera_guest_confirmed_';

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
   * Dapatkan daftar ucapan (dari Google Sheets atau LocalStorage fallback)
   */
  async getWishes() {
    const scriptUrl = weddingConfig.integration?.googleAppsScriptUrl;

    // Jika ada URL Google Apps Script yang valid
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

    // Fallback: ambil dari LocalStorage + initialWishes
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      const parsedLocal = localData ? JSON.parse(localData) : [];
      return [...parsedLocal, ...weddingConfig.initialWishes];
    } catch {
      return weddingConfig.initialWishes;
    }
  },

  /**
   * Kirim konfirmasi kehadiran & ucapan
   */
  async submitRSVP(payload) {
    const scriptUrl = weddingConfig.integration?.googleAppsScriptUrl;
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

    // 2. Simpan ucapan ke list lokal agar langsung terlihat di buku tamu (Optimistic UI)
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newWish);
      localStorage.setItem(LOCAL_STORAGE_WISHES_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Gagal menyimpan ke LocalStorage:', err);
    }

    // 3. Jika ada endpoint Google Sheets, kirim via HTTP POST
    if (scriptUrl?.startsWith('http')) {
      try {
        // Menggunakan mode POST
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script standard CORS handling
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        console.warn(
          'Pengiriman background ke Google Sheets gagal, data tetap aman di lokal:',
          networkErr,
        );
      }
    }

    return {
      status: 'success',
      data: newWish,
    };
  },
};
