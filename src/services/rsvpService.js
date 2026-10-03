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

/**
 * Deteksi apakah nama tamu tergolong undangan grup, keluarga besar, atau komunitas
 */
export function isGroupGuest(name) {
  if (!name || name === 'Tamu Undangan') return false;
  const lower = name.toLowerCase();
  const groupKeywords = [
    'keluarga',
    'sahabat',
    'teman',
    'rekan',
    'divisi',
    'alumni',
    'grup',
    'group',
    'angkatan',
    'komunitas',
    'tim ',
    'team',
    'bani ',
    'trah ',
    'all ',
    'warga ',
    'rt ',
    'rw ',
    'partner',
    'rombongan',
    'panitia',
    'kel.',
    'kel ',
  ];
  return groupKeywords.some((kw) => lower.includes(kw));
}

/**
 * Pisahkan nama personal dan nama grup jika tersimpan dalam format 'Nama (Grup)'
 */
export function parseDisplayName(fullName) {
  if (!fullName) return { personName: 'Tamu Undangan', groupBadge: null };
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      personName: match[1].trim(),
      groupBadge: match[2].trim(),
    };
  }
  const dotMatch = fullName.match(/^(.*?)\s*•\s*(.*?)$/);
  if (dotMatch) {
    return {
      personName: dotMatch[1].trim(),
      groupBadge: dotMatch[2].trim(),
    };
  }
  return {
    personName: fullName,
    groupBadge: null,
  };
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
   * Cek ke Supabase Cloud apakah tamu ini sudah pernah RSVP di perangkat mana pun
   */
  async checkGuestConfirmedCloud(guestName, slug = 'destia-raka') {
    if (!guestName || guestName === 'Tamu Undangan') return null;
    try {
      const { data, error } = await supabase
        .from('wedding_wishes')
        .select('*')
        .eq('wedding_slug', slug)
        .ilike('name', guestName.trim())
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && Array.isArray(data) && data.length > 0) {
        const found = data[0];
        return {
          name: found.name,
          attendance: found.attendance,
          guestsCount: found.guests_count || 1,
          message: found.message,
        };
      }
    } catch (err) {
      console.warn('Gagal cek konfirmasi cloud:', err);
    }
    return null;
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

      if (!error && Array.isArray(data)) {
        return data.map((w) => ({
          id: w.id,
          name: w.name,
          attendance: w.attendance,
          guestsCount: w.guests_count || 1,
          message: w.message,
          timestamp: formatTimestamp(w.created_at),
        }));
      }
    } catch (err) {
      console.warn('Supabase wishes load fallback:', err);
    }

    // 2. Jika Supabase offline/error, coba Google Apps Script jika terpasang
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

    // 3. Fallback jika offline: ambil dari LocalStorage (bersihkan mock data)
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      const parsedLocal = localData ? JSON.parse(localData) : [];
      return parsedLocal.filter((w) => !w.id?.toString().startsWith('wish-'));
    } catch {
      return [];
    }
  },

  /**
   * Bersihkan semua ucapan dari Supabase dan LocalStorage
   */
  async clearAllWishes(slug = 'destia-raka') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_WISHES_KEY);
    } catch (err) {
      console.warn('Gagal menghapus wishes lokal:', err);
    }

    try {
      const { error } = await supabase
        .from('wedding_wishes')
        .delete()
        .eq('wedding_slug', slug);
      if (error) {
        console.warn('Gagal menghapus wishes Supabase:', error.message);
      }
    } catch (cloudErr) {
      console.warn('Gagal koneksi hapus Supabase:', cloudErr);
    }
  },

  /**
   * Hapus satu ucapan spesifik berdasarkan id
   */
  async deleteWish(wishId, slug = 'destia-raka') {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
      if (existing) {
        const list = JSON.parse(existing);
        const filtered = list.filter((w) => w.id !== wishId);
        localStorage.setItem(
          LOCAL_STORAGE_WISHES_KEY,
          JSON.stringify(filtered),
        );
      }
    } catch (err) {
      console.warn('Gagal menghapus wish lokal:', err);
    }

    try {
      if (typeof wishId === 'number' || !Number.isNaN(Number(wishId))) {
        await supabase
          .from('wedding_wishes')
          .delete()
          .eq('id', Number(wishId))
          .eq('wedding_slug', slug);
      }
    } catch (cloudErr) {
      console.warn('Gagal hapus dari Supabase:', cloudErr);
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
