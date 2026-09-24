import {
  Check,
  Copy,
  Database,
  FileText,
  Palette,
  Share2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { BulkWhatsAppTool } from './BulkWhatsAppTool';
import { ColorPresetPicker } from './ColorPresetPicker';
import { ContentEditor } from './ContentEditor';
import { TemplateSelector } from './TemplateSelector';

export const AdminDrawer = () => {
  const { config, isAdminPanelOpen, setIsAdminPanelOpen } = useWedding();
  const [activeTab, setActiveTab] = useState('content');
  const [scriptCopied, setScriptCopied] = useState(false);

  if (!isAdminPanelOpen) return null;

  const isSheetConnected = Boolean(config.integration?.googleAppsScriptUrl);

  const copyScriptTutorial = () => {
    const text = `Petunjuk Google Apps Script INVATERA:\n1. Buka Google Sheet klien Anda\n2. Extensions > Apps Script\n3. Salin kode dari file docs/GoogleAppsScript_Template.js\n4. Deploy > New Deployment > Web app > Access: Anyone\n5. Masukkan URL ke weddingConfig.js`;
    navigator.clipboard.writeText(text);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header Admin Drawer */}
        <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-light">
          <div className="flex items-center gap-2.5">
            <img
              src={config.brand.logo}
              alt={config.brand.name}
              className="h-7 w-auto object-contain bg-white rounded p-0.5"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-wider uppercase">
                  {config.brand.name} ADMIN STUDIO
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gold text-primary">
                  Agency Live
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Kelola Semua Konten & Tampilan Undangan Klien
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'content'
                ? 'border-gold text-primary bg-white font-bold'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            <FileText className="w-4 h-4 text-gold" />
            <span>Konten Undangan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'design'
                ? 'border-gold text-primary bg-white font-bold'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            <Palette className="w-4 h-4 text-secondary" />
            <span>Warna & Desain</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'whatsapp'
                ? 'border-gold text-primary bg-white font-bold'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>WA Tamu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'database'
                ? 'border-gold text-primary bg-white font-bold'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Integrasi Sheet</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* TAB 0: KONTEN LENGKAP UNDANGAN (BARU) */}
          {activeTab === 'content' && (
            <div>
              <ContentEditor />
            </div>
          )}

          {/* TAB 1: DESAIN & WARNA */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <ColorPresetPicker />
              <div className="border-t border-slate-200 pt-5">
                <TemplateSelector />
              </div>
            </div>
          )}

          {/* TAB 2: GENERATOR WA TAMU */}
          {activeTab === 'whatsapp' && (
            <div>
              <BulkWhatsAppTool />
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS & DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Status Penyimpanan RSVP</span>
                </h4>
                <p className="text-[11px] text-muted mt-0.5">
                  Setiap klien memiliki 1 Google Sheet privat untuk menampung
                  kehadiran dan ucapan.
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isSheetConnected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">
                    {isSheetConnected
                      ? '✓ Terhubung ke Google Sheets'
                      : '⚡ Mode Pitching / Demo (LocalStorage)'}
                  </p>
                  <p className="text-[11px] opacity-85 mt-0.5">
                    {isSheetConnected
                      ? 'Data RSVP langsung tersinkronisasi ke Google Drive klien.'
                      : 'Data tersimpan di browser lokal. Web tetap berfungsi penuh untuk demo ke calon klien.'}
                  </p>
                </div>
              </div>

              {/* Petunjuk Setup */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <p className="font-bold text-primary">
                  Langkah Setup Google Sheets Baru (2 Menit):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-muted leading-relaxed">
                  <li>Buat Google Spreadsheet baru di Google Drive Anda.</li>
                  <li>
                    Buka <strong>Extensions &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Salin kode skrip dari file{' '}
                    <code className="bg-slate-200 px-1 rounded text-primary">
                      docs/GoogleAppsScript_Template.js
                    </code>
                    .
                  </li>
                  <li>
                    Klik{' '}
                    <strong>Deploy &gt; New Deployment &gt; Web app</strong>.
                    Atur akses: <em>"Anyone"</em>.
                  </li>
                  <li>
                    Salin URL Web App dan tempelkan ke{' '}
                    <code className="bg-slate-200 px-1 rounded text-primary">
                      weddingConfig.js
                    </code>
                    .
                  </li>
                </ol>

                <button
                  type="button"
                  onClick={copyScriptTutorial}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-primary hover:bg-slate-100 transition-colors"
                >
                  {scriptCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Panduan Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted" />
                      <span>Salin Panduan Singkat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Admin Drawer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-muted">
          <span>{config.brand.name} Agency Studio • Tip: Buka dengan URL </span>
          <code className="text-primary font-bold">?admin=true</code>
        </div>
      </div>
    </div>
  );
};
