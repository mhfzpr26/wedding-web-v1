import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { weddingConfig } from '../config/weddingConfig';
import { rsvpService } from '../services/rsvpService';

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  // Parsing Query Parameters
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [hasCustomGuest, setHasCustomGuest] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

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
        // Validasi sinkronisasi: jika versi berbeda atau nama mempelai di konfigurasi kode
        // berbeda dengan yang tersimpan di localStorage browser, bersihkan cache lama agar data baru aktif
        const isStale =
          !parsed.version ||
          parsed.version !== weddingConfig.version ||
          parsed.groom?.fullName !== weddingConfig.groom?.fullName ||
          parsed.bride?.fullName !== weddingConfig.bride?.fullName;

        if (isStale) {
          localStorage.removeItem('invatera_wedding_config');
          return weddingConfig;
        }

        return {
          ...weddingConfig,
          ...parsed,
          monogram: { ...weddingConfig.monogram, ...(parsed.monogram || {}) },
          groom: { ...weddingConfig.groom, ...(parsed.groom || {}) },
          bride: { ...weddingConfig.bride, ...(parsed.bride || {}) },
          quote: { ...weddingConfig.quote, ...(parsed.quote || {}) },
          greeting: { ...weddingConfig.greeting, ...(parsed.greeting || {}) },
          brand: { ...weddingConfig.brand, ...(parsed.brand || {}) },
          theme: { ...weddingConfig.theme, ...(parsed.theme || {}) },
          audio: { ...weddingConfig.audio, ...(parsed.audio || {}) },
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
        };
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage:', e);
    }
    return weddingConfig;
  });

  // Template & Preset Warna Dinamis
  const [activeTemplateId, setActiveTemplateId] = useState(
    weddingData.theme?.templateId || 'v1-floral-arch',
  );
  const [activeColorPreset, setActiveColorPreset] = useState(
    weddingData.theme?.colorPreset || 'navy',
  );
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Helper untuk update data konfigurasi
  const updateWeddingData = (updater) => {
    setWeddingData((prev) => {
      const next =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      const toSave = { ...next, version: weddingConfig.version };
      try {
        localStorage.setItem('invatera_wedding_config', JSON.stringify(toSave));
      } catch (err) {
        console.warn('Gagal menyimpan ke localStorage:', err);
      }
      return toSave;
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

  const resetWeddingData = () => {
    localStorage.removeItem('invatera_wedding_config');
    setWeddingData(weddingConfig);
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

      // Cek apakah tamu ini sudah konfirmasi sebelumnya
      const confirmed = rsvpService.hasGuestConfirmed(decoded);
      if (confirmed) {
        setExistingConfirmation(confirmed);
      }
    }

    // Deteksi route /admin murni
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const isAdminSlug = path === '/admin' || path.endsWith('/admin');

    if (isAdminSlug) {
      setIsAdminMode(true);
      setIsAdminPanelOpen(true); // Otomatis langsung buka Admin Drawer saat buka /admin
    } else {
      setIsAdminMode(false);
      setIsAdminPanelOpen(false);
    }
  }, []);

  // Sinkronisasi navigasi history browser (tombol back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const isAdminSlug = path === '/admin' || path.endsWith('/admin');
      if (isAdminSlug) {
        setIsAdminMode(true);
        setIsAdminPanelOpen(true);
      } else {
        setIsAdminMode(false);
        setIsAdminPanelOpen(false);
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
      );
      setWishes(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setIsLoadingWishes(false);
    }
  }, [weddingData.integration?.googleAppsScriptUrl]);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  // Handler Buka Undangan & Autoplay Audio
  const openInvitation = () => {
    setIsOpened(true);
    // Jalankan musik jika audio element tersedia
    if (audioRef.current) {
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
    const result = await rsvpService.submitRSVP(
      {
        name: guestName,
        attendance: data.attendance,
        guestsCount: data.guestsCount,
        message: data.message,
      },
      weddingData.integration?.googleAppsScriptUrl,
    );

    setExistingConfirmation({
      name: guestName,
      attendance: data.attendance,
      guestsCount: data.guestsCount,
      message: data.message,
    });

    // Refresh daftar ucapan
    await loadWishes();
    return result;
  };

  return (
    <WeddingContext.Provider
      value={{
        config: weddingData,
        updateWeddingData,
        updateSection,
        resetWeddingData,
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
      }}
    >
      {children}
      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        src={
          weddingData.audio?.externalAudio || weddingConfig.audio.externalAudio
        }
        preload="auto"
        loop
      />
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
