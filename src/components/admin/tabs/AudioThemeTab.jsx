import { Database, Music, Palette } from 'lucide-react';

export const AudioThemeTab = ({
  config,
  updateSection,
  activeColorPreset,
  setActiveColorPreset,
}) => {
  const audio = config.audio || {};
  const integration = config.integration || {};

  const handleAudioChange = (field, value) => {
    updateSection('audio', { [field]: value });
  };

  const handleIntegrationChange = (field, value) => {
    updateSection('integration', { [field]: value });
  };

  const colorPresets = [
    {
      id: 'navy',
      name: 'Royal Midnight Navy',
      description: 'Biru navy agung dipadu aksen emas mewah klasik',
      primaryBg: '#13255A',
      goldBg: '#D4AF37',
    },
    {
      id: 'sage',
      name: 'Botanical Sage Garden',
      description: 'Nuansa hijau sage lembut alami nan menenangkan',
      primaryBg: '#2D4A3E',
      goldBg: '#C2A649',
    },
    {
      id: 'rose',
      name: 'Champagne Rose Blush',
      description: 'Keanggunan rona mawar lembut dan romantis',
      primaryBg: '#5A2D3C',
      goldBg: '#D8A47F',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Tema Tampilan, Musik & Database</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih palet warna nuansa undangan, lagu latar belakang, serta
          integrasi Google Sheets.
        </p>
      </div>

      {/* PILIHAN PALET WARNA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-gold" />
          <span>Preset Warna Undangan</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setActiveColorPreset(preset.id);
                updateSection('theme', { colorPreset: preset.id });
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeColorPreset === preset.id
                  ? 'border-gold bg-gold/5 ring-2 ring-gold/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs inline-block"
                  style={{ backgroundColor: preset.primaryBg }}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs inline-block -ml-2"
                  style={{ backgroundColor: preset.goldBg }}
                />
                <span className="text-xs font-bold text-slate-800 ml-1">
                  {preset.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* MUSIK LATAR BELAKANG */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-gold" />
          <span>Musik Latar Belakang (Background Audio)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Lagu:
            </label>
            <input
              type="text"
              value={audio.title || ''}
              onChange={(e) => handleAudioChange('title', e.target.value)}
              placeholder="A Thousand Years (Piano Cover)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Artis / Penyanyi:
            </label>
            <input
              type="text"
              value={audio.artist || ''}
              onChange={(e) => handleAudioChange('artist', e.target.value)}
              placeholder="Wedding Melodies"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL File Audio MP3 / OGG:
            </label>
            <input
              type="text"
              value={audio.externalAudio || audio.url || ''}
              onChange={(e) => {
                handleAudioChange('externalAudio', e.target.value);
                handleAudioChange('url', e.target.value);
              }}
              placeholder="https://domain.com/musik-pernikahan.mp3"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Masukkan tautan langsung (.mp3 atau stream) yang dapat diputar di
              browser.
            </p>
          </div>
        </div>
      </div>

      {/* INTEGRASI GOOGLE SHEETS RSVP */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-gold" />
          <span>Integrasi Database RSVP (Google Spreadsheet)</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            URL Web App Google Apps Script (RSVP):
          </label>
          <input
            type="text"
            value={integration.googleAppsScriptUrl || ''}
            onChange={(e) =>
              handleIntegrationChange(
                'googleAppsScriptUrl',
                e.target.value.trim(),
              )
            }
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-gold transition-colors"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Kosongkan kolom ini jika ingin menggunakan mode penyimpanan demo /
            browser lokal.
          </p>
        </div>
      </div>
    </div>
  );
};
