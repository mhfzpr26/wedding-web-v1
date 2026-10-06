import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { weddingConfig } from '../config/weddingConfig';
import { isGroupGuest, rsvpService } from '../services/rsvpService';
import { supabase } from '../services/supabase';

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  // Parsing Query Parameters
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [hasCustomGuest, setHasCustomGuest] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isClientPortalMode, setIsClientPortalMode] = useState(false);
  const [clientSlug, setClientSlug] = useState('destia-raka');

  // Status Undangan & Audio
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // State Konfigurasi Pernikahan (Bisa diedit dinamis oleh Admin & tersimpan di LocalStorage)
  const [weddingData, setWeddingData] = useState(() => {
    try {
      const saved = localStorage.getItem('invatera_wedding_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...weddingConfig,
          ...parsed,
          closing: { ...weddingConfig.closing, ...(parsed.closing || {}) },
          groom: {
            ...weddingConfig.groom,
            ...(parsed.groom || {}),
            showInstagram:
              parsed.groom?.showInstagram !== undefined
                ? parsed.groom.showInstagram
                : true,
          },
          bride: {
            ...weddingConfig.bride,
            ...(parsed.bride || {}),
            showInstagram:
              parsed.bride?.showInstagram !== undefined
                ? parsed.bride.showInstagram
                : true,
          },
          couple: {
            ...weddingConfig.couple,
            ...(parsed.couple || {}),
          },
          quote: {
            ...weddingConfig.quote,
            ...(parsed.quote || {}),
            bismillah:
              parsed.quote?.bismillah ||
              (parsed.greeting?.bismillah &&
              parsed.greeting.bismillah !== 'Bismillahirrohmaanirrohiim'
                ? parsed.greeting.bismillah
                : weddingConfig.quote.bismillah),
          },
          greeting: { ...weddingConfig.greeting, ...(parsed.greeting || {}) },
          brand: { ...weddingConfig.brand, ...(parsed.brand || {}) },
          theme: { ...weddingConfig.theme, ...(parsed.theme || {}) },
          monogram: {
            ...weddingConfig.monogram,
            ...(parsed.monogram || {}),
            useCustomInitials: false,
          },
          audio: (() => {
            const a = {
              ...weddingConfig.audio,
              ...(parsed.audio || {}),
              enabled:
                parsed.audio?.enabled !== undefined
                  ? parsed.audio.enabled
                  : true,
            };
            // Bersihkan URL lama yang sudah 404 dari cache
            if (
              a.externalAudio?.includes('freemusicarchive.org') ||
              a.url?.includes('freemusicarchive.org') ||
              a.url?.includes('rain_heavy.ogg')
            ) {
              a.url = weddingConfig.audio.url;
              a.externalAudio = weddingConfig.audio.externalAudio;
              a.title = weddingConfig.audio.title;
              a.artist = weddingConfig.audio.artist;
            }
            return a;
          })(),
          integration: {
            ...weddingConfig.integration,
            ...(parsed.integration || {}),
          },
          gift: {
            ...weddingConfig.gift,
            ...(parsed.gift || {}),
            accounts: parsed.gift?.accounts || weddingConfig.gift.accounts,
            physicalGift: {
              ...weddingConfig.gift.physicalGift,
              ...(parsed.gift?.physicalGift || {}),
            },
          },
          events: parsed.events || weddingConfig.events,
          stories: parsed.stories || weddingConfig.stories,
          gallery: {
            ...weddingConfig.gallery,
            ...(parsed.gallery || {}),
            video: {
              ...weddingConfig.gallery?.video,
              ...(parsed.gallery?.video || {}),
            },
            photos:
              parsed.gallery?.photos || weddingConfig.gallery?.photos || [],
          },
        };
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage:', e);
    }
    return weddingConfig;
  });

  const [isDirty, setIsDirty] = useState(false);

  // Template & Preset Warna Dinamis
  const [activeTemplateId, setActiveTemplateId] = useState(
    weddingData.theme?.templateId || 'v1-floral-arch',
  );
  const [activeColorPreset, setActiveColorPreset] = useState(
    weddingData.theme?.colorPreset || 'navy',
  );
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Helper untuk update data konfigurasi di state
  const updateWeddingData = (updater) => {
    setWeddingData((prev) => {
      const next =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setIsDirty(true);
      try {
        localStorage.setItem('invatera_wedding_config', JSON.stringify(next));
      } catch (err) {
        console.warn('Gagal menyimpan ke localStorage:', err);
      }
      return next;
    });
  };

  const updateSection = (sectionKey, newValues) => {
    updateWeddingData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...newValues,
      },
    }));
  };

  // Simpan data permanen (ke Supabase Cloud, LocalStorage & File Fisik)
  const saveWeddingConfig = async (customData) => {
    const dataToSave = customData || weddingData;

    // 1. Simpan ke Supabase Cloud (PostgreSQL)
    let savedToCloud = false;
    let savedToFile = false;
    let message = 'Perubahan berhasil disimpan ke browser lokal!';

    try {
      const { error: cloudErr } = await supabase.from('wedding_configs').upsert(
        {
          slug: 'destia-raka',
          config: dataToSave,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      );

      if (!cloudErr) {
        savedToCloud = true;
        message =
          '✓ Tersimpan ke Cloud Database (Sinkron di semua HP & Laptop)!';
      } else {
        console.warn('Supabase cloud error:', cloudErr.message);
      }
    } catch (cloudException) {
      console.warn('Gagal koneksi ke cloud Supabase:', cloudException);
    }

    // 2. Simpan ke localStorage sebagai cadangan offline
    try {
      localStorage.setItem(
        'invatera_wedding_config',
        JSON.stringify(dataToSave),
      );
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 3. Kirim ke Vite Server untuk menimpa file src/config/weddingConfig.js jika running dev server
    try {
      const res = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const json = await res.json();
        savedToFile = true;
        if (!savedToCloud) {
          message =
            json.message || 'Berhasil disimpan permanen ke file proyek!';
        }
      }
    } catch (err) {
      console.info(
        'Mode standalone/preview (tanpa Vite API server), tersimpan di browser:',
        err,
      );
    }

    setIsDirty(false);
    return { success: true, savedToCloud, savedToFile, message };
  };

  // Unduh file weddingConfig.js sebagai cadangan
  const downloadConfigFile = () => {
    const fileContent = `/**\n * =======================================================================\n * INVATERA - WEDDING CONFIGURATION (SINGLE SOURCE OF TRUTH)\n * =======================================================================\n * File ini diunduh dari Admin Studio.\n */\n\nexport const weddingConfig = ${JSON.stringify(weddingData, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weddingConfig.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetWeddingData = () => {
    localStorage.removeItem('invatera_wedding_config');
    setWeddingData(weddingConfig);
    setIsDirty(false);
    if (weddingConfig.theme?.colorPreset) {
      setActiveColorPreset(weddingConfig.theme.colorPreset);
    }
  };

  // Data RSVP & Buku Tamu
  const [wishes, setWishes] = useState([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [existingConfirmation, setExistingConfirmation] = useState(null);

  // Inisialisasi parameter URL saat pertama kali dimuat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');

    if (toParam && toParam.trim() !== '') {
      const decoded = decodeURIComponent(toParam.replace(/\+/g, ' ')).trim();
      setGuestName(decoded);
      setHasCustomGuest(true);

      // 1. Cek apakah tamu ini sudah konfirmasi sebelumnya di browser lokal
      // Untuk undangan grup/keluarga, jangan auto-lock link agar anggota lain tetap bisa mengisi
      if (!isGroupGuest(decoded)) {
        const confirmed = rsvpService.hasGuestConfirmed(decoded);
        if (confirmed) {
          setExistingConfirmation(confirmed);
        }

        // 2. Cek juga ke cloud Supabase agar status RSVP perorangan sinkron di HP & Laptop mana pun
        rsvpService
          .checkGuestConfirmedCloud(decoded, 'destia-raka')
          .then((cloudConf) => {
            if (cloudConf) {
              setExistingConfirmation(cloudConf);
              rsvpService.saveGuestConfirmedLocally(decoded, cloudConf);
            }
          });
      }
    }

    // Deteksi route /admin murni (Canonical: selalu di /admin tanpa slug pasangan)
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    if (path !== '/admin' && path.endsWith('/admin')) {
      window.location.replace('/admin');
      return;
    }
    const isAdminSlug = path === '/admin';

    if (isAdminSlug) {
      setIsAdminMode(true);
      setIsAdminPanelOpen(true);
      setIsClientPortalMode(false);
    } else {
      setIsAdminMode(false);
      setIsAdminPanelOpen(false);

      // Deteksi route portal pengantin: misal /destia-raka/tamu atau /tamu
      const isPortal = path.endsWith('/tamu') || path === '/tamu';
      if (isPortal) {
        setIsClientPortalMode(true);
        const parts = path.replace(/^\/+/, '').split('/');
        if (parts[0] && parts[0] !== 'tamu') {
          setClientSlug(parts[0]);
        } else {
          setClientSlug('destia-raka');
        }
      } else {
        setIsClientPortalMode(false);
      }
    }
  }, []);

  // Sinkronisasi data dari Supabase Cloud saat pertama kali dimuat & Realtime Listener
  useEffect(() => {
    let isMounted = true;
    const targetSlug = clientSlug || 'destia-raka';

    const loadCloudConfig = async () => {
      try {
        const { data } = await supabase
          .from('wedding_configs')
          .select('config')
          .eq('slug', targetSlug)
          .single();

        if (isMounted && data?.config) {
          setWeddingData((prev) => ({
            ...prev,
            ...data.config,
          }));
          if (data.config.theme?.colorPreset) {
            setActiveColorPreset(data.config.theme.colorPreset);
          }
        }
      } catch (err) {
        console.info(
          'Gagal memuat config cloud (menggunakan data lokal):',
          err,
        );
      }
    };

    loadCloudConfig();

    // Supabase Realtime Listener untuk sinkronisasi live antar HP Pria, HP Wanita & Admin Laptop
    const configChannel = supabase
      .channel(`realtime-config-${targetSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wedding_configs',
          filter: `slug=eq.${targetSlug}`,
        },
        (payload) => {
          if (payload.new?.config && isMounted) {
            setWeddingData((prev) => ({
              ...prev,
              ...payload.new.config,
            }));
            if (payload.new.config.theme?.colorPreset) {
              setActiveColorPreset(payload.new.config.theme.colorPreset);
            }
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(configChannel);
    };
  }, [clientSlug]);

  // Sinkronisasi navigasi history browser (tombol back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (path !== '/admin' && path.endsWith('/admin')) {
        window.location.replace('/admin');
        return;
      }
      const isAdminSlug = path === '/admin';
      if (isAdminSlug) {
        setIsAdminMode(true);
        setIsAdminPanelOpen(true);
        setIsClientPortalMode(false);
      } else {
        setIsAdminMode(false);
        setIsAdminPanelOpen(false);

        const isPortal = path.endsWith('/tamu') || path === '/tamu';
        if (isPortal) {
          setIsClientPortalMode(true);
          const parts = path.replace(/^\/+/, '').split('/');
          if (parts[0] && parts[0] !== 'tamu') {
            setClientSlug(parts[0]);
          } else {
            setClientSlug('destia-raka');
          }
        } else {
          setIsClientPortalMode(false);
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update atribut data-theme di elemen <html> saat palet warna berganti
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeColorPreset);
  }, [activeColorPreset]);

  // Load daftar ucapan
  const loadWishes = useCallback(async () => {
    setIsLoadingWishes(true);
    try {
      const data = await rsvpService.getWishes(
        weddingData.integration?.googleAppsScriptUrl,
        clientSlug || 'destia-raka',
      );
      setWishes(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setIsLoadingWishes(false);
    }
  }, [weddingData.integration?.googleAppsScriptUrl, clientSlug]);

  useEffect(() => {
    loadWishes();

    // Supabase Realtime Listener: Buku Tamu & Ucapan Langsung Muncul Live di Semua HP
    const targetSlug = clientSlug || 'destia-raka';
    const wishesChannel = supabase
      .channel(`realtime-wishes-${targetSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wedding_wishes',
          filter: `wedding_slug=eq.${targetSlug}`,
        },
        () => {
          loadWishes();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(wishesChannel);
    };
  }, [loadWishes, clientSlug]);

  // Handler Buka Undangan & Autoplay Audio
  const openInvitation = () => {
    setIsOpened(true);
    // Jalankan musik jika audio element tersedia dan musik diaktifkan
    if (weddingData.audio?.enabled !== false && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Browser memblokir autoplay audio otomatis:', err);
          setIsPlaying(false);
        });
    }
  };

  // Toggle Play / Pause Audio
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Tidak dapat memutar audio:', err));
    }
  };

  // Submit RSVP
  const submitRSVP = async (data) => {
    const finalName = data.name?.trim() || guestName;
    const result = await rsvpService.submitRSVP(
      {
        name: finalName,
        attendance: data.attendance,
        guestsCount: data.guestsCount,
        message: data.message,
      },
      weddingData.integration?.googleAppsScriptUrl,
    );

    setExistingConfirmation({
      name: finalName,
      attendance: data.attendance,
      guestsCount: data.guestsCount,
      message: data.message,
    });

    // Refresh daftar ucapan
    await loadWishes();
    return result;
  };

  const deleteWish = async (wishId) => {
    const res = await rsvpService.deleteWish(wishId);
    await loadWishes();
    return res;
  };

  const clearAllWishes = async () => {
    const res = await rsvpService.clearAllWishes();
    await loadWishes();
    return res;
  };

  // Bersihkan data dummy ucapan lawas di browser jika tersisa
  useEffect(() => {
    try {
      const stored = localStorage.getItem('invatera_wedding_wishes_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter(
          (w) => !w.id?.toString().startsWith('wish-'),
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem(
            'invatera_wedding_wishes_v1',
            JSON.stringify(filtered),
          );
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <WeddingContext.Provider
      value={{
        config: weddingData,
        updateWeddingData,
        updateSection,
        saveWeddingConfig,
        downloadConfigFile,
        resetWeddingData,
        isDirty,
        guestName,
        hasCustomGuest,
        isAdminMode,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isOpened,
        setIsOpened,
        openInvitation,
        isPlaying,
        toggleMusic,
        activeTemplateId,
        setActiveTemplateId,
        activeColorPreset,
        setActiveColorPreset,
        wishes,
        isLoadingWishes,
        loadWishes,
        existingConfirmation,
        submitRSVP,
        deleteWish,
        clearAllWishes,
        isClientPortalMode,
        clientSlug,
        setIsClientPortalMode,
      }}
    >
      {children}
      {/* Hidden Global Audio Element (Hanya aktif di luar Admin & Portal Mode jika musik diaktifkan) */}
      {!isAdminMode &&
        !isClientPortalMode &&
        weddingData.audio?.enabled !== false && (
          <audio
            ref={audioRef}
            src={
              weddingData.audio?.externalAudio ||
              weddingData.audio?.url ||
              weddingConfig.audio.externalAudio ||
              '/audio/wedding-song.mp3'
            }
            preload="auto"
            loop
          />
        )}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
