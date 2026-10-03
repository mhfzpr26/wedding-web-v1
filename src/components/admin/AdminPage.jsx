import {
  BookOpen,
  Calendar,
  Check,
  Download,
  ExternalLink,
  Gift,
  Heart,
  LogOut,
  MessageSquare,
  Palette,
  RotateCcw,
  Save,
  Share2,
  Smartphone,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { AdminLogin } from './AdminLogin';
import { LivePreviewModal } from './LivePreviewModal';
import { AudioThemeTab } from './tabs/AudioThemeTab';
import { BulkGuestsTab } from './tabs/BulkGuestsTab';
import { CoupleTab } from './tabs/CoupleTab';
import { EventsTab } from './tabs/EventsTab';
import { GiftsTab } from './tabs/GiftsTab';
import { GreetingsTab } from './tabs/GreetingsTab';
import { StoriesTab } from './tabs/StoriesTab';
import { WishesTab } from './tabs/WishesTab';

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('invatera_admin_auth') === 'true',
  );

  const {
    config,
    updateWeddingData,
    updateSection,
    saveWeddingConfig,
    downloadConfigFile,
    resetWeddingData,
    isDirty,
    activeColorPreset,
    setActiveColorPreset,
    wishes,
  } = useWedding();

  const [activeTab, setActiveTab] = useState('couple');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const importFileRef = useRef(null);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('invatera_admin_auth');
    setIsAuthenticated(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveWeddingConfig();
      setToastMessage(
        result.savedToCloud
          ? '✓ Tersimpan ke Cloud Database (Sinkron di semua HP & Laptop)!'
          : result.savedToFile
            ? '✓ Tersimpan permanen ke file fisik weddingConfig.js!'
            : '✓ Tersimpan aman di browser lokal!',
      );
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      setToastMessage('Gagal menyimpan data.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportConfigFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;

        let parsed;
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(text);
        } else {
          // Format .js: ambil bagian objek konfigurasi setelah "weddingConfig ="
          const jsonMatch = text.match(
            /weddingConfig\s*=\s*(\{[\s\S]*\});?\s*$/,
          );
          if (jsonMatch?.[1]) {
            parsed = JSON.parse(jsonMatch[1]);
          } else {
            parsed = JSON.parse(text);
          }
        }

        if (parsed && typeof parsed === 'object') {
          updateWeddingData(parsed);
          setToastMessage(
            '✓ Konfigurasi berhasil dipulihkan dari file cadangan!',
          );
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err) {
        console.error('Gagal membaca file cadangan:', err);
        setToastMessage('Format file tidak valid atau rusak.');
        setTimeout(() => setToastMessage(null), 3000);
      } finally {
        if (importFileRef.current) importFileRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleOpenPreview = () => {
    let cleanPath = window.location.pathname.replace(/\/admin\/?$/i, '') || '';
    if (!cleanPath || cleanPath === '/') {
      cleanPath = '/destia-raka';
    }
    const previewUrl = `${window.location.origin}${cleanPath.replace(/\/+$/, '')}/`;
    window.open(previewUrl, '_blank');
  };

  const navItems = [
    { id: 'couple', label: 'Mempelai', icon: Heart, badge: null },
    {
      id: 'events',
      label: 'Acara & Waktu',
      icon: Calendar,
      badge: config.events?.length || 2,
    },
    { id: 'greetings', label: 'Salam & Penutup', icon: BookOpen, badge: null },
    {
      id: 'gifts',
      label: 'Amplop Digital',
      icon: Gift,
      badge: config.gift?.enabled ? 'Aktif' : 'Off',
    },
    {
      id: 'stories',
      label: 'Kisah Cinta',
      icon: Sparkles,
      badge: config.storiesEnabled ? 'Aktif' : 'Off',
    },
    { id: 'whatsapp', label: 'Kirim WA Tamu', icon: Share2, badge: 'Massal' },
    {
      id: 'wishes',
      label: 'Doa & Ucapan',
      icon: MessageSquare,
      badge: wishes?.length > 0 ? wishes.length : null,
    },
    { id: 'theme', label: 'Tema & Musik', icon: Palette, badge: null },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR (STANDALONE TOP NAVIGATION) */}
      <header className="px-5 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-gold inline-block shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xs tracking-wider uppercase text-white">
                INVATERA ADMIN STUDIO
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gold text-primary">
                Standalone Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Pusat Pengaturan Lengkap Konten & Tamu Undangan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Simpan */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-[11px] font-semibold text-slate-300 border border-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>{isDirty ? 'Belum disimpan' : 'Semua tersimpan'}</span>
          </div>

          {/* Tombol Simpan Perubahan */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isDirty
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-primary hover:brightness-105 border border-white/40 ring-2 ring-gold/40 animate-pulse'
                : 'bg-gold hover:bg-gold-light text-primary'
            }`}
            title="Simpan perubahan permanen ke file proyek src/config/weddingConfig.js"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>

          {/* Tombol Unduh Config */}
          <button
            type="button"
            onClick={downloadConfigFile}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Unduh file weddingConfig.js sebagai cadangan"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Tombol Pulihkan Config dari File Cadangan */}
          <input
            ref={importFileRef}
            type="file"
            accept=".js,.json"
            onChange={handleImportConfigFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => importFileRef.current?.click()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Pulihkan konfigurasi dari file cadangan (.js / .json)"
          >
            <UploadCloud className="w-4 h-4" />
          </button>

          {/* Tombol Simulator Layar HP (Live Preview) */}
          <button
            type="button"
            onClick={() => setIsLivePreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Buka Simulator Layar Ponsel Langsung"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Pratinjau HP</span>
          </button>

          {/* Tombol Buka Undangan di Tab Baru */}
          <button
            type="button"
            onClick={handleOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-xs font-bold border border-gold/40 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Buka Halaman Undangan di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Buka Undangan</span>
          </button>

          {/* Tombol Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white text-xs font-semibold border border-red-500/40 shadow-xs transition-colors cursor-pointer"
            title="Keluar dari Admin Studio"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* BODY WORKSPACE (SIDEBAR + MAIN CONTENT AREA) */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION TABS */}
        <aside className="w-52 sm:w-60 bg-slate-950/50 border-r border-slate-800 p-3.5 flex flex-col justify-between overflow-y-auto shrink-0">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1 block">
              Menu Pengaturan
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md border border-gold/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-gold' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        isActive
                          ? 'bg-gold/20 text-gold-light'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reset Data Default Button */}
          <div className="pt-3 border-t border-slate-800">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ke Default</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-center space-y-1.5">
                <p className="text-[10px] text-rose-300 font-semibold leading-tight">
                  Kembalikan semua ke data awal?
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      resetWeddingData();
                      setShowResetConfirm(false);
                      setToastMessage('Data berhasil di-reset ke default!');
                      setTimeout(() => setToastMessage(null), 2500);
                    }}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[10px] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN TAB CONTENT DISPLAY */}
        <main className="flex-1 overflow-y-auto bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'couple' && (
              <CoupleTab config={config} updateSection={updateSection} />
            )}
            {activeTab === 'events' && (
              <EventsTab
                config={config}
                updateWeddingData={updateWeddingData}
              />
            )}
            {activeTab === 'greetings' && (
              <GreetingsTab config={config} updateSection={updateSection} />
            )}
            {activeTab === 'gifts' && (
              <GiftsTab config={config} updateSection={updateSection} />
            )}
            {activeTab === 'stories' && (
              <StoriesTab
                config={config}
                updateWeddingData={updateWeddingData}
              />
            )}
            {activeTab === 'whatsapp' && (
              <BulkGuestsTab
                config={config}
                updateWeddingData={updateWeddingData}
              />
            )}
            {activeTab === 'wishes' && <WishesTab />}
            {activeTab === 'theme' && (
              <AudioThemeTab
                config={config}
                updateSection={updateSection}
                activeColorPreset={activeColorPreset}
                setActiveColorPreset={setActiveColorPreset}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODAL SIMULATOR LAYAR HP (LIVE PREVIEW) */}
      <LivePreviewModal
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
      />
    </div>
  );
};
