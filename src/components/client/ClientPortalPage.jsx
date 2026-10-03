import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  KeyRound,
  Lock,
  LogOut,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Share2,
  Tag,
  Trash2,
  Upload,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

// Normalisasi nomor telepon ke format internasional WhatsApp (628...)
function normalizePhone(rawPhone) {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+62')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = `62${cleaned.substring(1)}`;
  } else if (cleaned.startsWith('8')) {
    cleaned = `62${cleaned}`;
  }
  return cleaned;
}

// Styling badge kategori
function getCategoryBadgeClass(category) {
  const lower = (category || '').toLowerCase();
  if (lower.includes('keluarga')) {
    return 'bg-purple-100 text-purple-700 border-purple-200';
  }
  if (lower.includes('sahabat') || lower.includes('teman dekat')) {
    return 'bg-pink-100 text-pink-700 border-pink-200';
  }
  if (
    lower.includes('kantor') ||
    lower.includes('rekan') ||
    lower.includes('kerja')
  ) {
    return 'bg-sky-100 text-sky-700 border-sky-200';
  }
  if (lower.includes('vip') || lower.includes('tokoh')) {
    return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

// Template Pesan Bawaan WhatsApp
function getTemplateDefaultText(type) {
  if (type === 'islami') {
    return (
      `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `Yth. *{nama}*,\n\n` +
      `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran pernikahan kami:\n\n` +
      `*The Wedding of {pengantin}*\n` +
      `📅 {tanggal}\n\n` +
      `Untuk melihat rincian acara, lokasi, dan konfirmasi kehadiran (RSVP), silakan buka tautan undangan digital berikut:\n` +
      `{link}\n\n` +
      `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n` +
      `Wassalamu’alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `Salam hangat,\n*{pengantin}*`
    );
  }
  if (type === 'santai') {
    return (
      `Halo *{nama}*! ✨\n\n` +
      `Kabar bahagia untuk kita semua! Kami mengundang kamu untuk hadir dan merayakan momen bahagia pernikahan kami:\n\n` +
      `*{pengantin} Wedding Celebration*\n` +
      `📅 {tanggal}\n\n` +
      `Yuk buka detail acara & konfirmasi kehadiran kamu lewat tautan undangan ini:\n` +
      `{link}\n\n` +
      `Kehadiranmu sangat berarti bagi kami! Sampai jumpa di hari bahagia kami! 🎉\n\n` +
      `With love,\n*{pengantin}*`
    );
  }
  // Default Formal
  return (
    `Kepada Yth. Bapak/Ibu/Saudara/i\n` +
    `*{nama}*\n\n` +
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n` +
    `*The Wedding of {pengantin}*\n` +
    `📅 {tanggal}\n\n` +
    `Detail lengkap acara dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan resmi berikut:\n` +
    `{link}\n\n` +
    `Terima kasih banyak atas perhatian dan doa restunya.\n\n` +
    `Hormat kami yang berbahagia,\n*{pengantin}*`
  );
}

export const ClientPortalPage = ({ slug = 'destia-raka' }) => {
  const {
    config,
    updateWeddingData,
    saveWeddingConfig,
    wishes,
    isLoadingWishes,
    loadWishes,
  } = useWedding();

  const expectedKey = (config.clientAccessKey || 'destiaraka')
    .toLowerCase()
    .trim();

  // 1. Cek Kredensial / Kunci Akses (dari URL ?key=... atau sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key');
    if (keyParam && keyParam.toLowerCase().trim() === expectedKey) {
      sessionStorage.setItem(`invatera_portal_auth_${slug}`, 'true');
      return true;
    }
    return sessionStorage.getItem(`invatera_portal_auth_${slug}`) === 'true';
  });

  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tab Navigasi Klien: 'whatsapp' atau 'rsvp'
  const [activeTab, setActiveTab] = useState('whatsapp');

  // State Daftar Tamu (Bersih secara default untuk pengantin baru)
  const [rawNames, setRawNames] = useState(() => {
    if (config?.guestNamesRaw && config.guestNamesRaw.trim() !== '') {
      if (!config.guestNamesRaw.includes('Joko Widodo')) {
        return config.guestNamesRaw;
      }
    }
    try {
      const stored = localStorage.getItem(`invatera_guest_names_${slug}`);
      if (stored && stored.trim() !== '' && !stored.includes('Joko Widodo')) {
        return stored;
      }
      if (stored?.includes('Joko Widodo')) {
        localStorage.removeItem(`invatera_guest_names_${slug}`);
      }
    } catch (_e) {}
    return '';
  });

  const [isSavingGuests, setIsSavingGuests] = useState(false);
  const [saveSuccessFeedback, setSaveSuccessFeedback] = useState(false);

  // Quick Add State (Input Tamu Cepat Satuan)
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickCategory, setQuickCategory] = useState('Keluarga');
  const [quickFeedback, setQuickFeedback] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef(null);

  // Status Tamu yang Sudah Terkirim (Tersinkronisasi Cloud & LocalStorage)
  const [sentGuests, setSentGuests] = useState(() => {
    if (Array.isArray(config?.sentGuests)) {
      return config.sentGuests;
    }
    try {
      const stored = localStorage.getItem(`invatera_sent_guests_${slug}`);
      if (stored) return JSON.parse(stored);
    } catch (_e) {}
    return [];
  });

  // Sinkronisasi data daftar tamu dari config cloud saat ada pembaruan dari device lain
  useEffect(() => {
    if (
      config?.guestNamesRaw !== undefined &&
      config.guestNamesRaw !== rawNames
    ) {
      if (!config.guestNamesRaw.includes('Joko Widodo')) {
        setRawNames(config.guestNamesRaw);
      }
    }
  }, [config?.guestNamesRaw, rawNames]);

  // Sinkronisasi live status terkirim dari config cloud (misal saat pasangan kirim dari HP lain)
  useEffect(() => {
    if (Array.isArray(config?.sentGuests)) {
      setSentGuests(config.sentGuests);
    }
  }, [config?.sentGuests]);

  const [templateType, setTemplateType] = useState('formal');
  const [customMessage, setCustomMessage] = useState(() => {
    try {
      const stored = localStorage.getItem(`invatera_custom_msg_${slug}`);
      if (stored && stored.trim() !== '') return stored;
    } catch (_e) {}
    return getTemplateDefaultText('formal');
  });
  const [showPreview, setShowPreview] = useState(true);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unsent' | 'sent'
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [copiedType, setCopiedType] = useState(null);

  const bride = config.bride?.shortName || 'Destia';
  const groom = config.groom?.shortName || 'Raka';
  const eventDate =
    config.events?.[0]?.dateFormatted || 'Sabtu, 7 November 2026';

  // Simpan daftar tamu yang sudah dikirim ke Cloud & LocalStorage
  const toggleSentStatus = (guestId) => {
    setSentGuests((prev) => {
      const next = prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId];
      try {
        localStorage.setItem(
          `invatera_sent_guests_${slug}`,
          JSON.stringify(next),
        );
      } catch (_e) {}

      // Simpan langsung ke Supabase Cloud agar instan tersinkron di HP pasangan & Admin
      if (updateWeddingData) {
        updateWeddingData({ sentGuests: next });
      }
      if (saveWeddingConfig) {
        saveWeddingConfig({ ...config, sentGuests: next });
      }
      return next;
    });
  };

  // Parsing baris teks tamu cerdas (Mendukung Tab Excel \t, Koma ,, Garis |, Titik Koma ;)
  const parsedGuests = useMemo(() => {
    const lines = rawNames.split('\n');
    return lines
      .map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Abaikan baris pertama jika itu adalah nama header file CSV/Excel
        if (
          idx === 0 &&
          (trimmed.toLowerCase().startsWith('nama') ||
            trimmed.toLowerCase().startsWith('name') ||
            trimmed.toLowerCase().startsWith('no,') ||
            trimmed.toLowerCase().startsWith('no\t'))
        ) {
          return null;
        }

        let delimiter = ',';
        if (trimmed.includes('\t')) delimiter = '\t';
        else if (trimmed.includes(';')) delimiter = ';';
        else if (trimmed.includes('|')) delimiter = '|';
        else if (trimmed.includes(',')) delimiter = ',';

        let name = trimmed;
        let phone = '';
        let category = 'Umum';

        if (trimmed.includes(delimiter)) {
          const parts = trimmed.split(delimiter).map((p) => p.trim());
          name = parts[0] || '';

          if (parts.length > 1) {
            const p1Digits = parts[1].replace(/[^0-9+]/g, '');
            if (p1Digits.length >= 7) {
              phone = normalizePhone(parts[1]);
              if (parts[2]) category = parts[2].trim() || 'Umum';
            } else {
              category = parts[1] || 'Umum';
              if (parts[2]) phone = normalizePhone(parts[2]);
            }
          }
        }

        if (!name) return null;

        const id = `guest-${idx}-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        return {
          id,
          name,
          phone,
          category: category || 'Umum',
          raw: trimmed,
          lineIndex: idx,
        };
      })
      .filter(Boolean);
  }, [rawNames]);

  // Daftar Kategori Unik yang Tersedia
  const availableCategories = useMemo(() => {
    const set = new Set([
      'Semua',
      'Keluarga',
      'Sahabat',
      'Teman Kantor',
      'VIP',
      'Umum',
    ]);
    parsedGuests.forEach((g) => {
      if (g.category?.trim()) set.add(g.category.trim());
    });
    return Array.from(set);
  }, [parsedGuests]);

  // Deteksi Tamu Duplikat
  const duplicateGuests = useMemo(() => {
    const nameMap = new Map();
    parsedGuests.forEach((g) => {
      const key = g.name.toLowerCase().trim();
      const list = nameMap.get(key) || [];
      list.push(g);
      nameMap.set(key, list);
    });
    const dupes = [];
    nameMap.forEach((list) => {
      if (list.length > 1) {
        dupes.push({ name: list[0].name, count: list.length });
      }
    });
    return dupes;
  }, [parsedGuests]);

  // Filter tamu berdasarkan status, kategori, dan pencarian teks
  const filteredGuests = useMemo(() => {
    return parsedGuests.filter((guest) => {
      const isSent = sentGuests.includes(guest.id);
      if (statusFilter === 'sent' && !isSent) return false;
      if (statusFilter === 'unsent' && isSent) return false;
      if (
        categoryFilter !== 'Semua' &&
        guest.category.toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }
      if (searchTerm.trim()) {
        const matchName = guest.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchPhone = guest.phone.includes(searchTerm);
        const matchCat = guest.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchName || matchPhone || matchCat;
      }
      return true;
    });
  }, [parsedGuests, sentGuests, statusFilter, categoryFilter, searchTerm]);

  // Statistik Kirim
  const totalGuests = parsedGuests.length;
  const sentCount = parsedGuests.filter((g) =>
    sentGuests.includes(g.id),
  ).length;
  const unsentCount = totalGuests - sentCount;

  // Handler Simpan Nama Tamu ke Cloud Database
  const handleSaveGuests = async () => {
    setIsSavingGuests(true);
    try {
      try {
        localStorage.setItem(`invatera_guest_names_${slug}`, rawNames);
      } catch (_e) {}

      updateWeddingData({ guestNamesRaw: rawNames });
      await saveWeddingConfig({ ...config, guestNamesRaw: rawNames });
      setSaveSuccessFeedback(true);
      setTimeout(() => setSaveSuccessFeedback(false), 3000);
    } catch (_err) {
      alert('Gagal menyimpan ke database cloud.');
    } finally {
      setIsSavingGuests(false);
    }
  };

  // Handler Quick Add Tamu Cepat 1-per-1
  const handleQuickAdd = (e) => {
    e?.preventDefault();
    const trimmedName = quickName.trim();
    if (!trimmedName) return;

    let newLine = trimmedName;
    if (quickPhone.trim()) {
      newLine += `, ${quickPhone.trim()}`;
      if (quickCategory.trim() && quickCategory !== 'Umum') {
        newLine += `, ${quickCategory.trim()}`;
      }
    } else if (quickCategory.trim() && quickCategory !== 'Umum') {
      newLine += `, , ${quickCategory.trim()}`;
    }

    const updated = rawNames.trim()
      ? `${rawNames.trim()}\n${newLine}`
      : newLine;
    setRawNames(updated);
    try {
      localStorage.setItem(`invatera_guest_names_${slug}`, updated);
    } catch (_e) {}
    if (updateWeddingData) {
      updateWeddingData({ guestNamesRaw: updated });
    }
    if (saveWeddingConfig) {
      saveWeddingConfig({ ...config, guestNamesRaw: updated });
    }

    setQuickName('');
    setQuickPhone('');
    setQuickFeedback(true);
    setTimeout(() => setQuickFeedback(false), 2000);
  };

  // Handler Hapus Tamu Satuan dari Daftar
  const handleDeleteGuest = (guest) => {
    if (window.confirm(`Hapus "${guest.name}" dari daftar tamu?`)) {
      const lines = rawNames.split('\n');
      const filtered = lines.filter((_, idx) => idx !== guest.lineIndex);
      const updated = filtered.join('\n');
      setRawNames(updated);
      try {
        localStorage.setItem(`invatera_guest_names_${slug}`, updated);
      } catch (_e) {}
      if (updateWeddingData) {
        updateWeddingData({ guestNamesRaw: updated });
      }
      if (saveWeddingConfig) {
        saveWeddingConfig({ ...config, guestNamesRaw: updated });
      }
    }
  };

  // Download Template CSV/Excel
  const handleDownloadTemplate = () => {
    const csvContent =
      'Nama Tamu,Nomor WhatsApp,Kategori\n' +
      'Bapak Dr. H. Joko Widodo & Keluarga,081234567890,VIP\n' +
      'Keluarga Besar Bpk. Hendra,085712345678,Keluarga\n' +
      'Kevin Pratama & Partner,087812345678,Sahabat\n' +
      'Rekan Kerja Divisi IT,081398765432,Teman Kantor\n' +
      'Ibu Hj. Aminah,081298765432,Keluarga\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Template_Excel_Tamu_${bride}_${groom}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler Unggah File (.csv, .tsv, .txt)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      const shouldAppend =
        rawNames.trim().length > 0 &&
        window.confirm(
          'Gabungkan dengan daftar tamu yang sudah ada?\n\n- Klik "OK" untuk Menggabungkan\n- Klik "Batal" untuk Mengganti semua daftar',
        );

      let newRaw = trimmedContent;
      if (shouldAppend) {
        newRaw = `${rawNames.trim()}\n${trimmedContent}`;
      }

      setRawNames(newRaw);
      try {
        localStorage.setItem(`invatera_guest_names_${slug}`, newRaw);
      } catch (_e) {}
      if (updateWeddingData) {
        updateWeddingData({ guestNamesRaw: newRaw });
      }

      alert('Berhasil mengimpor daftar tamu dari file!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Buat link unik per tamu
  const getGuestUrl = (guestName) => {
    const origin = window.location.origin;
    return `${origin}/${slug}?to=${encodeURIComponent(guestName)}`;
  };

  // Template pesan WhatsApp
  const generateMessage = (guestName) => {
    const url = getGuestUrl(guestName);
    const coupleName = `${bride} & ${groom}`;

    const rawTemplate =
      templateType === 'custom'
        ? customMessage
        : getTemplateDefaultText(templateType);

    return rawTemplate
      .replace(/{nama}/g, guestName)
      .replace(/{link}/g, url)
      .replace(/{pengantin}/g, coupleName)
      .replace(/{tanggal}/g, eventDate);
  };

  // Contoh nama dan pesan untuk kartu pratinjau live
  const sampleGuestName = parsedGuests?.[0]?.name || 'Nama Tamu Undangan';
  const sampleMessageText = generateMessage(sampleGuestName);

  const handleCopy = (text, id, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType({ id, type });
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Kirim WhatsApp (Otomatis tandai status terkirim)
  const handleSendWA = (guest) => {
    if (!sentGuests.includes(guest.id)) {
      toggleSentStatus(guest.id);
    }
    const text = encodeURIComponent(generateMessage(guest.name));
    if (guest.phone) {
      window.open(`https://wa.me/${guest.phone}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  // Ekspor TXT
  const handleDownloadTxt = () => {
    const lines = parsedGuests.map(
      (g, idx) =>
        `${idx + 1}. ${g.name} ${g.phone ? `(${g.phone})` : ''}\nLink: ${getGuestUrl(g.name)}\nStatus: ${
          sentGuests.includes(g.id) ? 'Sudah Dikirim' : 'Belum Dikirim'
        }\n----------------------------------------\n`,
    );
    const content = `DAFTAR TAMU PERNIKAHAN: ${bride} & ${groom}\nTotal Tamu: ${parsedGuests.length}\nSudah Terkirim: ${sentCount}\nBelum Terkirim: ${unsentCount}\n\n${lines.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Tamu_${bride}_${groom}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Ekspor CSV
  const handleDownloadCsv = () => {
    const rows = [
      ['No', 'Nama Tamu', 'Nomor HP', 'Link Undangan', 'Status Pengiriman'],
      ...parsedGuests.map((g, idx) => [
        (idx + 1).toString(),
        `"${g.name.replace(/"/g, '""')}"`,
        g.phone || '-',
        getGuestUrl(g.name),
        sentGuests.includes(g.id) ? 'Terkirim' : 'Belum Dikirim',
      ]),
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Tamu_${bride}_${groom}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (inputKey.toLowerCase().trim() === expectedKey) {
      sessionStorage.setItem(`invatera_portal_auth_${slug}`, 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`invatera_portal_auth_${slug}`);
    setIsAuthenticated(false);
  };

  // -------------------------------------------------------------
  // TAMPILAN LOGIN / GERBANG KUNCI AKSES PENGANTIN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-white font-sans">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              The Wedding of
            </span>
            <h1 className="font-serif text-2xl font-bold text-white mt-1">
              {bride} & {groom}
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Portal Khusus Calon Pengantin & Panitia untuk menyebarkan undangan
              WhatsApp dan memantau buku tamu.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Kunci Akses Pengantin:</span>
              </label>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Masukkan kunci akses (misal: destiaraka)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800 p-2.5 rounded-xl font-medium">
                Kunci akses salah. Silakan periksa kembali tautan atau tanyakan
                kepada admin.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Buka Pengelola Undangan
            </button>
          </form>

          <p className="text-[11px] text-slate-500">
            Powered by <strong>INVATERA</strong> Digital Wedding Platform
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAMPILAN DASHBOARD PENGANTIN (CLIENT PORTAL)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans select-none">
      {/* HEADER PORTAL PENGANTIN */}
      <header className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-serif font-bold text-base shadow-sm">
            {bride.charAt(0)}&{groom.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white tracking-wide">
                {bride} & {groom}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                Portal Pengantin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{eventDate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Lihat Undangan */}
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Buka Undangan</span>
          </a>

          {/* Tombol Keluar */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800 transition-colors cursor-pointer"
            title="Kunci / Keluar"
          >
            <LogOut className="w-3.5 h-3.5 sm:hidden" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER / TAB SWITCHER */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-[61px] z-30 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/10">
              {totalGuests}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rsvp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rsvp'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buku Tamu / RSVP</span>
            {wishes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-bold">
                {wishes.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'whatsapp' && totalGuests > 0 && (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Progress Pengiriman:</span>
            <span className="text-emerald-600 font-bold">
              {sentCount} dari {totalGuests} Terkirim
            </span>
          </div>
        )}
      </div>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
        {/* ======================================================== */}
        {/* TAB 1: KIRIM UNDANGAN WHATSAPP MASSAL                    */}
        {/* ======================================================== */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            {/* KARTU STATISTIK PENGIRIMAN */}
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setStatusFilter('all')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <span className="text-[11px] text-slate-500 font-medium block">
                  Total Tamu
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {totalGuests}
                </span>
              </div>

              <div
                onClick={() => setStatusFilter('unsent')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  statusFilter === 'unsent'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <span className="text-[11px] text-amber-700 font-medium block">
                  Belum Dikirim
                </span>
                <span className="text-xl font-bold text-amber-700">
                  {unsentCount}
                </span>
              </div>

              <div
                onClick={() => setStatusFilter('sent')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  statusFilter === 'sent'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40 shadow-xs'
                    : 'bg-white/70 border-slate-200 hover:bg-white'
                }`}
              >
                <span className="text-[11px] text-emerald-700 font-medium block">
                  Sudah Terkirim
                </span>
                <span className="text-xl font-bold text-emerald-700">
                  {sentCount}
                </span>
              </div>
            </div>

            {/* FORM INPUT DAFTAR NAMA & NOMOR HP TAMU */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>Daftar Nama, No. HP & Kategori Tamu</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format per baris: <code>Nama Tamu, Nomor HP, Kategori</code>{' '}
                    (No. HP & Kategori opsional). Mendukung langsung{' '}
                    <strong>Copy-Paste tabel dari Excel / Google Sheets</strong>
                    !
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Unduh Template Excel */}
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Unduh file template Excel (.csv)"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Template Excel</span>
                  </button>

                  {/* Unggah File CSV/Excel */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.txt,.tsv"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Unggah file data tamu (.csv / .txt)"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unggah File</span>
                  </button>

                  {/* Kosongkan Daftar */}
                  {rawNames.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Yakin ingin mengosongkan seluruh daftar tamu?',
                          )
                        ) {
                          setRawNames('');
                          try {
                            localStorage.removeItem(
                              `invatera_guest_names_${slug}`,
                            );
                          } catch (_e) {}
                          if (updateWeddingData) {
                            updateWeddingData({ guestNamesRaw: '' });
                          }
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Kosongkan seluruh teks daftar tamu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Kosongkan</span>
                    </button>
                  )}

                  {/* Simpan ke Database */}
                  <button
                    type="button"
                    onClick={handleSaveGuests}
                    disabled={isSavingGuests}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSavingGuests ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isSavingGuests ? 'Menyimpan...' : 'Simpan Daftar'}
                    </span>
                  </button>
                </div>
              </div>

              {saveSuccessFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Daftar nama tamu berhasil disimpan permanen ke cloud!
                  </span>
                </div>
              )}

              <textarea
                rows={5}
                value={rawNames}
                onChange={(e) => setRawNames(e.target.value)}
                placeholder="Contoh format:&#10;Bapak Dr. H. Joko Widodo & Keluarga, 08123456789, VIP&#10;Ibu Hj. Aminah, 085712345678, Keluarga&#10;Kevin Pratama & Partner, 087812345678, Sahabat&#10;Rekan Kerja Divisi IT, 081398765432, Teman Kantor"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 resize-y leading-relaxed shadow-2xs"
              />

              {/* Template Style Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    Gaya Bahasa Pesan:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'formal', label: 'Formal / Resmi' },
                      { id: 'islami', label: 'Islami' },
                      { id: 'santai', label: 'Santai' },
                      { id: 'custom', label: 'Kustom / Edit Sendiri' },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setTemplateType(tmpl.id);
                          if (tmpl.id === 'custom') {
                            setIsEditingTemplate(true);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          templateType === tmpl.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tmpl.id === 'custom' && (
                          <Edit3 className="w-3 h-3 text-amber-400" />
                        )}
                        <span>{tmpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV</span>
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor TXT</span>
                  </button>
                </div>
              </div>

              {/* KARTU PRATINJAU GELEMBUNG CHAT WHATSAPP */}
              <div className="mt-3 rounded-2xl border border-emerald-300/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 overflow-hidden shadow-2xs">
                {/* Header Toggle Pratinjau */}
                <div
                  onClick={() => setShowPreview((prev) => !prev)}
                  className="px-4 py-2.5 bg-[#075E54] text-white flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-[#064e46]"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-bold">
                      Pratinjau Pesan WhatsApp (Sesuai yang Diterima Tamu)
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-400 text-slate-950 uppercase tracking-wider">
                      {templateType === 'formal'
                        ? 'Formal'
                        : templateType === 'islami'
                          ? 'Islami'
                          : templateType === 'santai'
                            ? 'Santai'
                            : 'Kustom'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold">
                    <span className="text-[11px] hidden sm:inline">
                      {showPreview ? 'Sembunyikan' : 'Lihat Teks'}
                    </span>
                    {showPreview ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {showPreview && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Gelembung WhatsApp Asli */}
                    <div className="bg-[#EFEAE2] p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex justify-center">
                      <div className="max-w-xl w-full bg-[#DCF8C6] text-slate-900 p-4 rounded-2xl rounded-tr-xs shadow-md border border-emerald-200/80 space-y-2.5">
                        <div className="text-[10px] text-emerald-900/70 font-mono flex items-center justify-between pb-1 border-b border-emerald-300/60">
                          <span>
                            Kepada: <strong>{sampleGuestName}</strong>
                          </span>
                          <span>WhatsApp Messenger</span>
                        </div>

                        {/* Isi Teks */}
                        <div className="whitespace-pre-wrap text-xs text-slate-800 leading-relaxed font-sans select-text">
                          {sampleMessageText}
                        </div>

                        {/* WhatsApp Timestamp & Blue Double Checkmarks */}
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-1">
                          <span>10:45</span>
                          <span className="text-sky-600 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Mode Editor Teks Kustom */}
                    {isEditingTemplate ? (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Kata-kata Pesan Undangan:</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Reset pesan ke teks formal standar?',
                                )
                              ) {
                                const def = getTemplateDefaultText('formal');
                                setCustomMessage(def);
                                try {
                                  localStorage.setItem(
                                    `invatera_custom_msg_${slug}`,
                                    def,
                                  );
                                } catch (_e) {}
                              }
                            }}
                            className="text-[11px] font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset ke Format Standar</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-600">
                          Klik tag di bawah ini untuk menyisipkan data otomatis
                          (nama tamu, tautan link, dll):
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          {[
                            { tag: '{nama}', desc: 'Nama Tamu' },
                            { tag: '{link}', desc: 'Link Undangan' },
                            { tag: '{pengantin}', desc: 'Nama Pasangan' },
                            { tag: '{tanggal}', desc: 'Tanggal Acara' },
                          ].map((item) => (
                            <button
                              key={item.tag}
                              type="button"
                              onClick={() => {
                                setCustomMessage(
                                  (prev) => `${prev} ${item.tag}`,
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-amber-950 font-mono font-bold text-[11px] cursor-pointer shadow-2xs"
                              title={`Sisipkan ${item.desc}`}
                            >
                              + {item.tag}{' '}
                              <span className="font-sans font-normal text-slate-500">
                                ({item.desc})
                              </span>
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={6}
                          value={customMessage}
                          onChange={(e) => {
                            setCustomMessage(e.target.value);
                            try {
                              localStorage.setItem(
                                `invatera_custom_msg_${slug}`,
                                e.target.value,
                              );
                            } catch (_err) {}
                          }}
                          placeholder="Ketik format pesan WhatsApp kustom Anda..."
                          className="w-full p-3 rounded-xl border border-amber-200 bg-white text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed shadow-inner"
                        />

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <p className="text-[10px] text-slate-500 italic">
                            💡 Format teks tebal dapat menggunakan tanda
                            bintang: *tebal*
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsEditingTemplate(false)}
                            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                          >
                            Simpan & Selesai Mengedit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                          Ingin menambahkan catatan khusus seperti{' '}
                          <strong>Dresscode</strong>,{' '}
                          <strong>Jam Akad/Resepsi</strong>, atau{' '}
                          <strong>Lokasi</strong>?
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (templateType !== 'custom') {
                                const currentText =
                                  getTemplateDefaultText(templateType);
                                setCustomMessage(currentText);
                                setTemplateType('custom');
                              }
                              setIsEditingTemplate(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                            <span>Kustomisasi / Edit Teks Pesan</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* QUICK ADD BAR (INPUT TAMU SATUAN CEPAT) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Tambah Tamu Cepat (Satuan)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ketik nama & nomor HP baru secara instan tanpa perlu
                      mencari baris di textarea
                    </p>
                  </div>
                </div>

                {quickFeedback && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Tamu Ditambahkan!
                  </span>
                )}
              </div>

              <form
                onSubmit={handleQuickAdd}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Nama Tamu (misal: Bpk. Hendra & Istri)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      placeholder="No. WhatsApp (misal: 0812...)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs bg-white"
                  >
                    <option value="Keluarga">Keluarga</option>
                    <option value="Teman Kantor">Teman Kantor</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="VIP">VIP</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[34px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    title="Tambahkan ke daftar"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span className="sm:hidden">Tambah</span>
                  </button>
                </div>
              </form>
            </div>

            {/* PERINGATAN TAMU GANDA / DUPLIKAT JIKA ADA */}
            {duplicateGuests.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">
                    Perhatian: Terdeteksi {duplicateGuests.length} Nama Tamu
                    Ganda!
                  </span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {duplicateGuests
                      .slice(0, 4)
                      .map((d) => `"${d.name}" (${d.count}x)`)
                      .join(', ')}
                    {duplicateGuests.length > 4 ? '...' : ''}. Anda dapat
                    menghapus salah satu agar tidak terkirim dobel.
                  </p>
                </div>
              </div>
            )}

            {/* DAFTAR TAMU & AKSI KIRIM LANGSUNG */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Kirim Undangan ({filteredGuests.length} Tamu)
                  </h4>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama, no HP, kategori..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* FILTER KATEGORI TAMU */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
                  <Tag className="w-3 h-3 text-slate-400" />
                  Kategori:
                </span>
                {availableCategories.map((cat) => {
                  const count =
                    cat === 'Semua'
                      ? parsedGuests.length
                      : parsedGuests.filter(
                          (g) => g.category.toLowerCase() === cat.toLowerCase(),
                        ).length;
                  const isSelected =
                    categoryFilter.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        if (templateType !== 'custom') {
                          const lower = cat.toLowerCase();
                          if (
                            lower.includes('sahabat') ||
                            lower.includes('teman dekat') ||
                            lower.includes('circle')
                          ) {
                            setTemplateType('santai');
                          } else if (lower.includes('keluarga')) {
                            setTemplateType('islami');
                          } else if (
                            lower.includes('vip') ||
                            lower.includes('kantor') ||
                            lower.includes('rekan')
                          ) {
                            setTemplateType('formal');
                          }
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {totalGuests === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-50/80 border-2 border-dashed border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Daftar Tamu Masih Kosong
                    </h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                      Mulai tambahkan tamu menggunakan form{' '}
                      <strong>Tambah Tamu Cepat</strong> di atas, tombol{' '}
                      <strong>Unggah File Excel/CSV</strong>, atau ketik
                      langsung di kotak teks daftar tamu.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const sample =
                          'Bapak & Ibu Hendra, 08123456789, Keluarga\n' +
                          'Sahabat Kuliah, 085712345678, Sahabat\n' +
                          'Rekan Kantor, 087812345678, Teman Kantor';
                        setRawNames(sample);
                        try {
                          localStorage.setItem(
                            `invatera_guest_names_${slug}`,
                            sample,
                          );
                        } catch (_e) {}
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Muat Contoh Format
                    </button>
                  </div>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Tidak ada tamu yang cocok dengan filter atau pencarian.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredGuests.map((guest, idx) => {
                    const isSent = sentGuests.includes(guest.id);
                    const messageText = generateMessage(guest.name);
                    const guestUrl = getGuestUrl(guest.name);

                    return (
                      <div
                        key={guest.id || idx}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSent
                            ? 'bg-slate-50/60 border-slate-200 opacity-80'
                            : 'bg-white border-slate-200 shadow-2xs hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Centang Status Terkirim Manual */}
                          <button
                            type="button"
                            onClick={() => toggleSentStatus(guest.id)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 cursor-pointer ${
                              isSent
                                ? 'bg-emerald-500 text-white'
                                : 'border border-slate-300 hover:border-emerald-500 text-transparent'
                            }`}
                            title={
                              isSent
                                ? 'Tandai Belum Dikirim'
                                : 'Tandai Sudah Terkirim'
                            }
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <div className="truncate">
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="text-xs font-bold text-slate-800 truncate">
                                {guest.name}
                              </h5>

                              {/* Badge Kategori */}
                              <span
                                className={`px-2 py-0.2 rounded-full text-[9px] font-semibold border ${getCategoryBadgeClass(
                                  guest.category,
                                )}`}
                              >
                                {guest.category || 'Umum'}
                              </span>

                              {/* Badge Status Kirim */}
                              {isSent ? (
                                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">
                                  Sudah Terkirim
                                </span>
                              ) : (
                                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                                  Belum Dikirim
                                </span>
                              )}
                            </div>

                            {guest.phone ? (
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>+{guest.phone}</span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Tanpa nomor HP (Buka WA Umum)
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(guestUrl, guest.id, 'link')
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="Salin Tautan Undangan"
                          >
                            <Copy className="w-3 h-3" />
                            <span>
                              {copiedType?.id === guest.id &&
                              copiedType?.type === 'link'
                                ? 'Tersalin!'
                                : 'Link'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(messageText, guest.id, 'msg')
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="Salin Pesan Undangan Lengkap"
                          >
                            <Copy className="w-3 h-3" />
                            <span>
                              {copiedType?.id === guest.id &&
                              copiedType?.type === 'msg'
                                ? 'Tersalin!'
                                : 'Pesan'}
                            </span>
                          </button>

                          {/* Tombol Kirim WhatsApp Langsung */}
                          <button
                            type="button"
                            onClick={() => handleSendWA(guest)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                            title={
                              guest.phone
                                ? `Buka chat WhatsApp ke +${guest.phone}`
                                : 'Buka WhatsApp'
                            }
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA</span>
                          </button>

                          {/* Tombol Hapus Tamu Satuan */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus tamu ini dari daftar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BUKU TAMU & RSVP REAL-TIME                        */}
        {/* ======================================================== */}
        {activeTab === 'rsvp' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span>Buku Tamu & Konfirmasi Kehadiran</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau konfirmasi kehadiran dan ucapan doa restu langsung dari
                  tamu undangan.
                </p>
              </div>

              <button
                type="button"
                onClick={loadWishes}
                disabled={isLoadingWishes}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingWishes ? 'animate-spin text-amber-500' : 'text-slate-500'}`}
                />
                <span>Segarkan Data</span>
              </button>
            </div>

            {/* KARTU STATISTIK RINGKAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Total Ucapan
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    {wishes.length}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Konfirmasi Hadir
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {
                      wishes.filter(
                        (w) =>
                          w.attendance === 'hadir' || w.attendance === 'yes',
                      ).length
                    }
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Tidak Hadir
                  </span>
                  <span className="text-lg font-bold text-rose-600">
                    {
                      wishes.filter(
                        (w) =>
                          w.attendance === 'tidak_hadir' ||
                          w.attendance === 'no',
                      ).length
                    }
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    Estimasi Tamu
                  </span>
                  <span className="text-lg font-bold text-sky-600">
                    {wishes.reduce((sum, w) => {
                      if (w.attendance === 'hadir' || w.attendance === 'yes') {
                        return sum + (Number(w.guestsCount) || 1);
                      }
                      return sum;
                    }, 0)}{' '}
                    Pax
                  </span>
                </div>
              </div>
            </div>

            {/* DAFTAR PESAN & UCAPAN TAMU */}
            <div className="space-y-3">
              {isLoadingWishes ? (
                <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    Memuat buku tamu dari database...
                  </p>
                </div>
              ) : wishes.length === 0 ? (
                <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Belum ada ucapan doa yang masuk
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ucapan doa dan konfirmasi kehadiran yang diisi tamu pada
                    halaman undangan akan otomatis muncul di sini.
                  </p>
                </div>
              ) : (
                wishes.map((w, idx) => (
                  <div
                    key={w.id || idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {w.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.attendance === 'hadir' || w.attendance === 'yes'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {w.attendance === 'hadir' || w.attendance === 'yes'
                            ? `Hadir (${w.guestsCount || 1} Pax)`
                            : 'Tidak Hadir'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {w.timestamp || 'Baru saja'}
                      </span>
                    </div>

                    {w.message && (
                      <p className="text-xs text-slate-600 italic whitespace-pre-wrap leading-relaxed pt-1">
                        "{w.message}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
