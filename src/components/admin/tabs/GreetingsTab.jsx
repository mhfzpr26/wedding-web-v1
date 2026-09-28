import { BookOpen, Sparkles } from 'lucide-react';

export const GreetingsTab = ({ config, updateSection }) => {
  const greeting = config.greeting || {};
  const quote = config.quote || {};

  const handleGreetingChange = (field, value) => {
    updateSection('greeting', { [field]: value });
  };

  const handleQuoteChange = (field, value) => {
    updateSection('quote', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span>Salam, Sambutan & Kutipan Ayat</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Sesuaikan teks bismillah, salam pembuka, dan ayat suci / kata mutiara
          pernikahan.
        </p>
      </div>

      {/* SAMBUTAN & SALAM */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>Salam & Paragraf Pembuka</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bismillah / Teks Pembuka Teratas:
          </label>
          <input
            type="text"
            value={greeting.bismillah || ''}
            onChange={(e) => handleGreetingChange('bismillah', e.target.value)}
            placeholder="Bismillahirrohmaanirrohiim (Kosongkan jika tidak diperlukan)"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors font-serif italic"
          />
        </div>

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

      {/* KUTIPAN / AYAT SUCI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-gold" />
          <span>Ayat Suci / Kutipan Indah</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teks Kaligrafi / Arab:
          </label>
          <textarea
            rows={2}
            dir="rtl"
            value={quote.arabic || ''}
            onChange={(e) => handleQuoteChange('arabic', e.target.value)}
            placeholder="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-base font-['Amiri',_serif] text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Arti / Terjemahan Kutipan:
          </label>
          <textarea
            rows={3}
            value={quote.translation || ''}
            onChange={(e) => handleQuoteChange('translation', e.target.value)}
            placeholder="Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed"
          />
        </div>

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
    </div>
  );
};
