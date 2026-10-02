import { Heart, User } from 'lucide-react';

export const CoupleTab = ({ config, updateSection }) => {
  const bride = config.bride || {};
  const groom = config.groom || {};
  const monogram = config.monogram || {};

  const handleBrideChange = (field, value) => {
    updateSection('bride', { [field]: value });
  };

  const handleGroomChange = (field, value) => {
    updateSection('groom', { [field]: value });
  };

  const handleMonogramChange = (field, value) => {
    updateSection('monogram', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>Informasi Mempelai Pengantin</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur nama lengkap, nama panggilan, orang tua, dan akun media sosial
          kedua mempelai.
        </p>
      </div>

      {/* Grid 2 Kolom: Mempelai Wanita & Mempelai Pria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* KARTU MEMPELAI WANITA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <User className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mempelai Wanita
              </h4>
              <p className="text-[11px] text-slate-400">
                Pihak Pengantin Putri
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap:
            </label>
            <input
              type="text"
              value={bride.fullName || ''}
              onChange={(e) => handleBrideChange('fullName', e.target.value)}
              placeholder="Contoh: Destia Dwi Ramadhani, S.Kom."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Panggilan (Short Name):
            </label>
            <input
              type="text"
              value={bride.shortName || ''}
              onChange={(e) => handleBrideChange('shortName', e.target.value)}
              placeholder="Contoh: Destia"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keluarga / Nama Orang Tua:
            </label>
            <textarea
              rows={2}
              value={bride.parents || ''}
              onChange={(e) => handleBrideChange('parents', e.target.value)}
              placeholder="Contoh: Putri dari Bpk. Ahmad & Ibu Siti"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Link Instagram:
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bride.showInstagram !== false}
                  onChange={(e) =>
                    handleBrideChange('showInstagram', e.target.checked)
                  }
                  className="rounded text-gold focus:ring-gold"
                />
                <span>Tampilkan di Undangan</span>
              </label>
            </div>
            <input
              type="text"
              value={bride.instagram || ''}
              onChange={(e) => handleBrideChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
            {bride.showInstagram === false && (
              <p className="text-[10px] text-amber-600 mt-1 font-medium">
                Tombol Instagram dinonaktifkan (tidak akan muncul di undangan).
              </p>
            )}
          </div>
        </div>

        {/* KARTU MEMPELAI PRIA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <User className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mempelai Pria
              </h4>
              <p className="text-[11px] text-slate-400">
                Pihak Pengantin Putra
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap:
            </label>
            <input
              type="text"
              value={groom.fullName || ''}
              onChange={(e) => handleGroomChange('fullName', e.target.value)}
              placeholder="Contoh: Rakafansa Saputra, S.T."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Panggilan (Short Name):
            </label>
            <input
              type="text"
              value={groom.shortName || ''}
              onChange={(e) => handleGroomChange('shortName', e.target.value)}
              placeholder="Contoh: Raka"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keluarga / Nama Orang Tua:
            </label>
            <textarea
              rows={2}
              value={groom.parents || ''}
              onChange={(e) => handleGroomChange('parents', e.target.value)}
              placeholder="Contoh: Putra dari Bpk. Mashudi & Ibu Lenny"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Link Instagram:
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groom.showInstagram !== false}
                  onChange={(e) =>
                    handleGroomChange('showInstagram', e.target.checked)
                  }
                  className="rounded text-gold focus:ring-gold"
                />
                <span>Tampilkan di Undangan</span>
              </label>
            </div>
            <input
              type="text"
              value={groom.instagram || ''}
              onChange={(e) => handleGroomChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
            {groom.showInstagram === false && (
              <p className="text-[10px] text-amber-600 mt-1 font-medium">
                Tombol Instagram dinonaktifkan (tidak akan muncul di undangan).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PENGATURAN JUDUL & MONOGRAM */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          Tagline & Monogram Inisial
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tagline Undangan:
            </label>
            <input
              type="text"
              value={monogram.tagline || ''}
              onChange={(e) => handleMonogramChange('tagline', e.target.value)}
              placeholder="The Wedding of"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Karakter Pemisah Inisial:
            </label>
            <select
              value={monogram.separator || '&'}
              onChange={(e) => {
                updateSection('monogram', {
                  separator: e.target.value,
                  useCustomInitials: false,
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-gold transition-colors"
            >
              <option value="&">& (Ampersand Klasik)</option>
              <option value="•">• (Titik Bullet Modern)</option>
              <option value="|">| (Garis Vertikal Minimalis)</option>
              <option value="♥">♥ (Hati Romantis)</option>
            </select>
          </div>
        </div>

        {/* Live Preview Monogram Asimetris */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-700">
              Preview Monogram (Asimetris):
            </p>
            <p className="text-[11px] text-slate-500">
              Inisial wanita di atas, simbol pemisah di tengah, inisial pria di
              bawah.
            </p>
          </div>
          <div className="flex items-center justify-center -space-x-1 px-5 py-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="relative -top-2 font-serif text-2xl font-bold text-slate-800">
              {bride.shortName ? bride.shortName.charAt(0).toUpperCase() : 'D'}
            </span>
            <span className="relative inline-flex items-center justify-center px-1.5 text-gold text-xl font-bold">
              {monogram.separator || '&'}
            </span>
            <span className="relative top-2 font-serif text-2xl font-bold text-slate-800">
              {groom.shortName ? groom.shortName.charAt(0).toUpperCase() : 'R'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
