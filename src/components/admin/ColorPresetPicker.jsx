import { Check, Copy, Palette } from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { COLOR_PRESETS } from '../../templates/v1-floral-arch/presets';

export const ColorPresetPicker = () => {
  const { activeColorPreset, setActiveColorPreset } = useWedding();
  const [copied, setCopied] = useState(false);

  const copyConfigSnippet = (presetId) => {
    const code = `// Salin baris ini ke src/config/weddingConfig.js:\ncolorPreset: "${presetId}",`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-gold" />
          <span>Palet Warna Aktif (Real-time Preview)</span>
        </h4>
        <p className="text-[11px] text-muted mt-0.5">
          Klik untuk langsung melihat perubahan warna di seluruh halaman web
          tanpa reload.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {COLOR_PRESETS.map((preset) => {
          const isActive = activeColorPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setActiveColorPreset(preset.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                isActive
                  ? 'bg-base-surface border-gold shadow-sm ring-1 ring-gold'
                  : 'bg-white border-slate-200 hover:border-gold/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Lingkaran Swatch Warna */}
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span
                    className="inline-block w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: preset.previewHex }}
                  />
                  <span
                    className="inline-block w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: preset.accentHex }}
                  />
                  <span
                    className="inline-block w-6 h-6 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: preset.goldHex }}
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-primary">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-muted">{preset.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    <Check className="w-3 h-3" />
                    <span>Aktif</span>
                  </span>
                )}
                <button
                  type="button"
                  title="Salin untuk weddingConfig.js"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyConfigSnippet(preset.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-muted hover:text-primary transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {copied && (
        <p className="text-center text-[10px] text-emerald-600 font-medium">
          ✓ Kode konfigurasi berhasil disalin ke clipboard!
        </p>
      )}
    </div>
  );
};
