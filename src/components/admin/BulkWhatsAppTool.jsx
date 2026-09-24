import { Check, Copy, Send, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';

export const BulkWhatsAppTool = () => {
  const { config } = useWedding();

  const [rawNames, setRawNames] = useState(
    'Bapak Dr. H. Joko Widodo & Keluarga\nIbu Hj. Aminah\nKevin Pratama & Partner\nKeluarga Besar Bpk. Hendra',
  );
  const [templateType, setTemplateType] = useState('formal');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Parsing daftar nama tamu dari baris-baris teks
  const guestList = rawNames
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  // Buat link unik per tamu
  const getGuestUrl = (name) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?to=${encodeURIComponent(name)}`;
  };

  // Format pesan WhatsApp
  const generateMessage = (name) => {
    const url = getGuestUrl(name);
    const groom = config.groom.shortName;
    const bride = config.bride.shortName;
    const date = config.events[0]?.dateFormatted;

    if (templateType === 'islami') {
      return `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nYth. ${name},\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami:\n\n*The Wedding of ${groom} & ${bride}*\n📅 ${date}\n\nUntuk informasi acara, lokasi, dan konfirmasi kehadiran, silakan buka tautan undangan digital berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.\n\nSalam hangat,\n*${groom} & ${bride}*`;
    }

    if (templateType === 'santai') {
      return `Halo ${name}! ✨\n\nKabar bahagia untuk kita semua! Kami bermaksud mengundang kamu untuk hadir dan merayakan hari bahagia pernikahan kami:\n\n*${groom} & ${bride} Wedding Celebration*\n📅 ${date}\n\nYuk intip detail acara & konfirmasi kehadiran kamu lewat link undangan di bawah ini:\n${url}\n\nKehadiranmu sangat berarti bagi kami! See you there! 🎉\n\nWith love,\n*${groom} & ${bride}*`;
    }

    // Default: Formal
    return `Kepada Yth. Bapak/Ibu/Saudara/i\n*${name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n*The Wedding of ${groom} & ${bride}*\n📅 ${date}\n\nDetail lengkap acara dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan resmi berikut:\n${url}\n\nTerima kasih banyak atas perhatian dan doa restunya.\n\nHormat kami yang berbahagia,\n*${groom} & ${bride}*`;
  };

  const handleCopyMessage = (name, index) => {
    const text = generateMessage(name);
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpenWhatsApp = (name) => {
    const text = encodeURIComponent(generateMessage(name));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-gold" />
          <span>Generator Link WhatsApp Massal</span>
        </h4>
        <p className="text-[11px] text-muted mt-0.5">
          Tempelkan (paste) daftar nama tamu (1 nama per baris). Sistem akan
          membuatkan link personal `?to=...` dan teks WA resmi secara otomatis.
        </p>
      </div>

      {/* Pilihan Gaya Teks Pesan */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted">Format Salam:</span>
        <div className="flex items-center gap-1.5">
          {['formal', 'islami', 'santai'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTemplateType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                templateType === type
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-muted hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Input Daftar Nama Massal */}
      <div>
        <label className="block text-xs font-semibold text-primary mb-1">
          Daftar Nama Tamu ({guestList.length} Tamu Terdeteksi):
        </label>
        <textarea
          rows={4}
          value={rawNames}
          onChange={(e) => setRawNames(e.target.value)}
          placeholder="Tuliskan nama tamu, pisahkan tiap nama dengan Enter..."
          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-primary outline-none focus:border-gold resize-y"
        />
      </div>

      {/* Tabel / List Tamu Hasil Generate */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {guestList.map((name, index) => (
          <div
            key={index}
            className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-primary truncate">{name}</p>
              <p className="text-[10px] text-muted truncate font-mono">
                {getGuestUrl(name)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Tombol Salin Pesan */}
              <button
                type="button"
                onClick={() => handleCopyMessage(name, index)}
                title="Salin Pesan WA Lengkap"
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  copiedIndex === index
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {copiedIndex === index ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Tombol Kirim Langsung ke WA */}
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(name)}
                title="Kirim ke WhatsApp"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Kirim WA</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
