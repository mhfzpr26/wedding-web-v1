import {
  Check,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  MessageSquare,
  RotateCcw,
  Search,
  Send,
  Share2,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const DEFAULT_SAMPLE_GUESTS =
  'Bapak Dr. H. Joko Widodo & Keluarga\nIbu Hj. Aminah\nKevin Pratama & Partner\nKeluarga Besar Bpk. Hendra\nSahabat Kuliah Angkatan 2018';

export const BulkGuestsTab = ({ config, updateWeddingData }) => {
  const [copiedPortal, setCopiedPortal] = useState(false);
  const [rawNames, setRawNames] = useState(() => {
    if (config?.guestNamesRaw && config.guestNamesRaw.trim() !== '') {
      if (!config.guestNamesRaw.includes('Joko Widodo')) {
        return config.guestNamesRaw;
      }
    }
    try {
      const stored = localStorage.getItem('invatera_admin_guest_names');
      if (stored && stored.trim() !== '' && !stored.includes('Joko Widodo')) {
        return stored;
      }
      if (stored?.includes('Joko Widodo')) {
        localStorage.removeItem('invatera_admin_guest_names');
      }
    } catch (_e) {}
    return '';
  });

  const [templateType, setTemplateType] = useState('formal');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedType, setCopiedType] = useState(null); // { index, type: 'link' | 'msg' }

  // Sinkronisasi data jika config diperbarui dari cloud
  useEffect(() => {
    if (config?.guestNamesRaw && config.guestNamesRaw !== rawNames) {
      setRawNames(config.guestNamesRaw);
    }
  }, [config?.guestNamesRaw, rawNames]);

  const handleNamesChange = (val) => {
    setRawNames(val);
    try {
      localStorage.setItem('invatera_admin_guest_names', val);
    } catch (_e) {}
    if (updateWeddingData) {
      updateWeddingData({ guestNamesRaw: val });
    }
  };

  const handleLoadSample = () => {
    handleNamesChange(DEFAULT_SAMPLE_GUESTS);
  };

  const handleClearNames = () => {
    if (window.confirm('Yakin ingin mengosongkan seluruh daftar nama tamu?')) {
      handleNamesChange('');
    }
  };

  const bride = config.bride?.shortName || 'Destia';
  const groom = config.groom?.shortName || 'Raka';
  const date = config.events?.[0]?.dateFormatted || 'Sabtu, 14 November 2026';

  // Parsing daftar nama tamu
  const guestList = rawNames
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  // Filter pencarian
  const filteredGuests = guestList.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Buat link unik per tamu (Pastikan slug /admin tidak terbawa ke link tamu)
  const getGuestUrl = (name) => {
    let cleanPath = window.location.pathname.replace(/\/admin\/?$/i, '') || '';
    if (!cleanPath || cleanPath === '/') {
      cleanPath = '/destia-raka';
    }
    const baseUrl = `${window.location.origin}${cleanPath.replace(/\/+$/, '')}/`;
    return `${baseUrl}?to=${encodeURIComponent(name)}`;
  };

  // Template generator pesan WhatsApp
  const generateMessage = (name) => {
    const url = getGuestUrl(name);

    if (templateType === 'islami') {
      return `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nYth. *${name}*,\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran pernikahan kami:\n\n*The Wedding of ${bride} & ${groom}*\n📅 ${date}\n\nUntuk melihat rincian acara, lokasi, dan konfirmasi kehadiran (RSVP), silakan buka tautan undangan digital berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSalam hangat,\n*${bride} & ${groom}*`;
    }

    if (templateType === 'santai') {
      return `Halo *${name}*! ✨\n\nKabar bahagia untuk kita semua! Kami mengundang kamu untuk hadir dan merayakan momen bahagia pernikahan kami:\n\n*${bride} & ${groom} Wedding Celebration*\n📅 ${date}\n\nYuk buka detail acara & konfirmasi kehadiran kamu lewat tautan undangan ini:\n${url}\n\nKehadiranmu sangat berarti bagi kami! See you there! 🎉\n\nWith love,\n*${bride} & ${groom}*`;
    }

    // Default: Formal
    return `Kepada Yth. Bapak/Ibu/Saudara/i\n*${name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*The Wedding of ${bride} & ${groom}*\n📅 ${date}\n\nDetail lengkap acara dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan resmi berikut:\n${url}\n\nTerima kasih banyak atas perhatian dan doa restunya.\n\nHormat kami yang berbahagia,\n*${bride} & ${groom}*`;
  };

  const handleCopy = (text, index, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType({ index, type });
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendWA = (name) => {
    const text = encodeURIComponent(generateMessage(name));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Unduh daftar tamu dalam format TXT
  const handleDownloadTxt = () => {
    const lines = guestList.map(
      (name, idx) =>
        `${idx + 1}. ${name}\nLink: ${getGuestUrl(name)}\n----------------------------------------\n`,
    );
    const content = `DAFTAR UNDANGAN TAMU PERNIKAHAN: ${bride} & ${groom}\nTotal Tamu: ${guestList.length}\n\n${lines.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Undangan_${bride}_${groom}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Unduh daftar tamu dalam format CSV
  const handleDownloadCsv = () => {
    const rows = [
      ['No', 'Nama Tamu', 'Link Undangan'],
      ...guestList.map((name, idx) => [
        (idx + 1).toString(),
        `"${name.replace(/"/g, '""')}"`,
        getGuestUrl(name),
      ]),
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Undangan_${bride}_${groom}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <span>Kirim Undangan WhatsApp Banyak Tamu</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat ratusan link undangan personal (`?to=...`) secara massal dan
            bagikan ke WhatsApp.
          </p>
        </div>

        {guestList.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Unduh file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Unduh daftar teks untuk panitia"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekspor TXT</span>
            </button>
          </div>
        )}
      </div>

      {/* KARTU MAGIC LINK PORTAL KHUSUS KLIEN */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Portal Khusus Pengantin (Client Magic Link)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Khusus Klien
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Berikan tautan rahasia ini ke pasangan pengantin & panitia
                keluarga. Mereka bisa kirim undangan WhatsApp langsung & pantau
                buku tamu tanpa bisa merusak pengaturan teknis admin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                const clientKey = (
                  config.clientAccessKey || 'destiaraka'
                ).trim();
                const url = `${window.location.origin}/destia-raka/tamu?key=${encodeURIComponent(clientKey)}`;
                navigator.clipboard.writeText(url);
                setCopiedPortal(true);
                setTimeout(() => setCopiedPortal(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPortal ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedPortal ? 'Link Tersalin!' : 'Salin Link Pengantin'}
              </span>
            </button>

            <a
              href={`/destia-raka/tamu?key=${encodeURIComponent((config.clientAccessKey || 'destiaraka').trim())}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Portal</span>
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <span className="text-slate-500 font-medium shrink-0">
              URL Klien:
            </span>
            <code className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-700 font-mono text-[11px] truncate flex-1 select-all">
              {`${typeof window !== 'undefined' ? window.location.origin : ''}/destia-raka/tamu?key=${(config.clientAccessKey || 'destiaraka').trim()}`}
            </code>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-600 font-medium">Kunci Akses:</span>
            <input
              type="text"
              value={config.clientAccessKey || 'destiaraka'}
              onChange={(e) => {
                if (updateWeddingData) {
                  updateWeddingData({
                    clientAccessKey: e.target.value.toLowerCase().trim(),
                  });
                }
              }}
              placeholder="destiaraka"
              className="w-28 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* INPUT DAFTAR NAMA TAMU */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
              {guestList.length} Tamu
            </span>
            <label className="text-xs font-bold text-slate-800">
              Daftar Nama Tamu Undangan
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Isi dengan contoh format"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Contoh Format</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={handleClearNames}
              className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Kosongkan seluruh teks"
            >
              <Trash2 className="w-3 h-3" />
              <span>Kosongkan</span>
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={rawNames}
          onChange={(e) => handleNamesChange(e.target.value)}
          placeholder="Ketik atau paste nama tamu di sini (1 baris per tamu). Contoh:&#10;Bapak Budi & Keluarga&#10;Kak Siska&#10;Teman-teman Kantor"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 resize-y leading-relaxed shadow-2xs"
        />

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>
            *Tiap baris otomatis dibuatkan tautan undangan unik{' '}
            <code>?to=...</code>
          </span>
          <span className="text-emerald-600 font-medium">
            ✓ Tersinkronisasi ke Cloud Database
          </span>
        </div>

        {/* Pilihan Gaya Salam WhatsApp */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-gold" />
            <span>Format Pesan:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'formal', label: 'Formal / Resmi' },
              { id: 'islami', label: 'Islami' },
              { id: 'santai', label: 'Santai / Teman' },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setTemplateType(tmpl.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  templateType === tmpl.id
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DAFTAR TAMU DENGAN AKSI CEPAT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Link & Pesan Siap Kirim
          </h4>

          {/* Kolom Pencarian */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama tamu..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {filteredGuests.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            Tidak ada tamu yang cocok dengan pencarian.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredGuests.map((name, idx) => {
              const url = getGuestUrl(name);
              const message = generateMessage(name);
              const isCopiedLink =
                copiedType?.index === idx && copiedType?.type === 'link';
              const isCopiedMsg =
                copiedType?.index === idx && copiedType?.type === 'msg';

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {name}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5 ml-7">
                      {url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-7 sm:ml-0">
                    {/* Tombol Salin Link */}
                    <button
                      type="button"
                      onClick={() => handleCopy(url, idx, 'link')}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-gold text-slate-700 hover:text-primary text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title="Salin Link Undangan Saja"
                    >
                      {isCopiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    {/* Tombol Salin Pesan Lengkap */}
                    <button
                      type="button"
                      onClick={() => handleCopy(message, idx, 'msg')}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-gold text-slate-700 hover:text-primary text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title="Salin Teks Lengkap + Link"
                    >
                      {isCopiedMsg ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-gold" />
                          <span>Salin Pesan</span>
                        </>
                      )}
                    </button>

                    {/* Tombol Buka WhatsApp */}
                    <button
                      type="button"
                      onClick={() => handleSendWA(name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title="Buka WhatsApp Langsung"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
