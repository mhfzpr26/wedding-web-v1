import { Sliders } from 'lucide-react';
import { AdminDrawer } from './components/admin/AdminDrawer';
import { useWedding, WeddingProvider } from './context/WeddingContext';
import { getTemplateById } from './templates/registry';

const WeddingAppContent = () => {
  const { activeTemplateId, setIsAdminPanelOpen, isAdminMode } = useWedding();

  // Ambil komponen template aktif dari Registry
  const ActiveTemplateComponent = getTemplateById(activeTemplateId).component;

  return (
    <div className="relative min-h-screen">
      {/* Render Template Aktif */}
      <ActiveTemplateComponent />

      {/* Panel Kontrol Admin (Drawer) */}
      <AdminDrawer />

      {/* Floating Shortcut Admin Button (Hanya jika admin mode diaktifkan via ?admin=true atau tombol khusus) */}
      {isAdminMode && (
        <button
          onClick={() => setIsAdminPanelOpen(true)}
          title="Buka Admin Control Panel"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-primary/95 text-white text-xs font-semibold shadow-luxury backdrop-blur-md border border-gold/40 hover:bg-primary-light transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Sliders className="w-4 h-4 text-gold" />
          <span className="hidden sm:inline">Admin Studio</span>
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <WeddingProvider>
      <WeddingAppContent />
    </WeddingProvider>
  );
}
