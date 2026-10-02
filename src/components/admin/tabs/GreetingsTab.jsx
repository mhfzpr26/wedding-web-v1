import { BookOpen, HeartHandshake, Sparkles } from 'lucide-react';

export const GreetingsTab = ({ config, updateSection }) => {
  const greeting = config.greeting || {};
  const quote = config.quote || {};
  const closing = config.closing || {};

  const handleGreetingChange = (field, value) => {
    updateSection('greeting', { [field]: value });
  };

  const handleQuoteChange = (field, value) => {
    updateSection('quote', { [field]: value });
  };

  const handleClosingChange = (field, value) => {
    updateSection('closing', { [field]: value });
  };

  // Handler khusus untuk sinkronisasi bismillah
  const handleBismillahChange = (value) => {
    updateSection('quote', { bismillah: value });
    updateSection('greeting', { bismillah: value });
  };

  const currentBismillah =
    quote.bismillah || greeting.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span>Ayat Suci, Salam & Penutup (Footer)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Sesuaikan teks bismillah Arab, ayat suci Al-Qur'an, salam pembuka, dan
          ucapan terima kasih penutup.
        </p>
      </div>

      {/* KUTIPAN / AYAT SUCI (DISATUKAN DENGAN BISMILLAH ARAB) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-gold" />
          <span>Ayat Suci / Kutipan Al-Qur'an</span>
        </h4>

        {/* BISMILLAH KALIGRAFI ARAB */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Kalimat Bismillah (Teks Arab / Kaligrafi):
            </label>
            <button
              type="button"
              onClick={() => handleBismillahChange('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')}
              className="text-[11px] font-medium text-gold hover:text-gold-dark transition-colors cursor-pointer"
            >
              Gunakan Tulisan Arab Standar
            </button>
          </div>
          <input
            type="text"
            dir="rtl"
            value={currentBismillah}
            onChange={(e) => handleBismillahChange(e.target.value)}
            placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-lg font-['Amiri',_serif] text-slate-800 focus:outline-none focus:border-gold transition-colors bg-slate-50/50 hover:bg-white text-center"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Teks bismillah akan ditampilkan persis di atas ayat suci dengan gaya
            kaligrafi emas yang anggun.
          </p>
        </div>

        {/* TEKS KALIGRAFI AYAT ARAB */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teks Ayat / Kaligrafi Al-Qur'an (Arab):
          </label>
          <textarea
            rows={3}
            dir="rtl"
            value={quote.arabic || ''}
            onChange={(e) => handleQuoteChange('arabic', e.target.value)}
            placeholder="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-lg font-['Amiri',_serif] text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-[2.2] text-center"
          />
        </div>

        {/* TERJEMAHAN AYAT */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Arti / Terjemahan Ayat:
          </label>
          <textarea
            rows={3}
            value={quote.translation || ''}
            onChange={(e) => handleQuoteChange('translation', e.target.value)}
            placeholder="Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed italic"
          />
        </div>

        {/* SUMBER AYAT */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sumber / Penulis Kutipan:
          </label>
          <input
            type="text"
            value={quote.source || ''}
            onChange={(e) => handleQuoteChange('source', e.target.value)}
            placeholder="Contoh: QS. Ar-Rum: 21"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* SALAM & SAMBUTAN MEMPELAI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>Salam & Paragraf Sambutan</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Salam Pembuka:
          </label>
          <input
            type="text"
            value={greeting.salam || ''}
            onChange={(e) => handleGreetingChange('salam', e.target.value)}
            placeholder="Assalamu’alaikum Warahmatullahi Wabarakatuh"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Paragraf Sambutan:
          </label>
          <textarea
            rows={3}
            value={greeting.introText || ''}
            onChange={(e) => handleGreetingChange('introText', e.target.value)}
            placeholder="Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* BAGIAN PENUTUP & UCAPAN TERIMA KASIH (FOOTER) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-gold" />
          <span>Teks Penutup & Ucapan Terima Kasih (Footer)</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kalimat Ucapan Terima Kasih:
          </label>
          <textarea
            rows={3}
            value={
              closing.thankYouText !== undefined
                ? closing.thankYouText
                : 'Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih yang sebesar-besarnya.'
            }
            onChange={(e) =>
              handleClosingChange('thankYouText', e.target.value)
            }
            placeholder="Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Label Penutup:
            </label>
            <input
              type="text"
              value={
                closing.closingSalutation !== undefined
                  ? closing.closingSalutation
                  : 'Kami yang berbahagia,'
              }
              onChange={(e) =>
                handleClosingChange('closingSalutation', e.target.value)
              }
              placeholder="Contoh: Kami yang berbahagia,"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kustomisasi Nama Penutup (Opsional):
            </label>
            <input
              type="text"
              value={closing.customNames || ''}
              onChange={(e) =>
                handleClosingChange('customNames', e.target.value)
              }
              placeholder={`Otomatis "${config.bride?.shortName || 'Destia'} & ${config.groom?.shortName || 'Raka'}"`}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Kosongkan jika ingin otomatis menggunakan nama kedua mempelai.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Teks Sub-footer / Nama Acara Bawah:
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={closing.showSubfooter !== false}
                  onChange={(e) =>
                    handleClosingChange('showSubfooter', e.target.checked)
                  }
                  className="rounded text-gold focus:ring-gold"
                />
                <span>Tampilkan Sub-footer</span>
              </label>
            </div>
            <input
              type="text"
              value={
                closing.subfooterText !== undefined
                  ? closing.subfooterText
                  : `The Wedding of ${config.bride?.shortName || 'Destia'} & ${config.groom?.shortName || 'Raka'}`
              }
              onChange={(e) =>
                handleClosingChange('subfooterText', e.target.value)
              }
              placeholder="The Wedding of Destia & Raka"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
