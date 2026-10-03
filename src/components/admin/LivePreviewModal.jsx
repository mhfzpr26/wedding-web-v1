import { ExternalLink, RefreshCw, Smartphone, X } from 'lucide-react';
import { useState } from 'react';

export const LivePreviewModal = ({ isOpen, onClose }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open('/destia-raka', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* KARTU MODAL UTAMA DENGAN FRAME IPHONE */}
      <div className="relative w-full max-w-[420px] max-h-[95vh] flex flex-col items-center">
        {/* TOP CONTROLS BAR DI ATAS HP */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl mb-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Simulator Layar Ponsel</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Muat Ulang Pratinjau"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={handleOpenExternal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Buka di Tab Baru Penuh"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors cursor-pointer ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FRAME SMARTPHONE MODERN */}
        <div className="relative w-full aspect-[9/19] max-h-[82vh] bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
          {/* SPEAKER / DYNAMIC ISLAND NOTCH */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20 flex items-center justify-center gap-2 border border-slate-800 pointer-events-none shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-slate-800 inline-block" />
          </div>

          {/* INDIKATOR LOADING */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 text-white rounded-[36px]">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
              <p className="text-xs font-semibold text-slate-300">
                Memuat Pratinjau Undangan...
              </p>
            </div>
          )}

          {/* CONTAINER IFRAME UNDANGAN */}
          <div className="w-full h-full rounded-[34px] overflow-hidden bg-white shadow-inner relative">
            <iframe
              key={iframeKey}
              src={`/destia-raka?preview=true&reload=${iframeKey}`}
              title="Pratinjau Undangan Digital"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 select-auto"
            />
          </div>

          {/* HOME BAR IPHONE DI BAGIAN BAWAH */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full z-20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
