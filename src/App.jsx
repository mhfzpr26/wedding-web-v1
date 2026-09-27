import { AdminDrawer } from './components/admin/AdminDrawer';
import { useWedding, WeddingProvider } from './context/WeddingContext';
import { getTemplateById } from './templates/registry';

const WeddingAppContent = () => {
  const { activeTemplateId } = useWedding();

  // Ambil komponen template aktif dari Registry
  const ActiveTemplateComponent = getTemplateById(activeTemplateId).component;

  return (
    <div className="relative min-h-screen">
      {/* Render Template Aktif */}
      <ActiveTemplateComponent />

      {/* Panel Kontrol Admin (Hanya tampil saat URL /admin dibuka) */}
      <AdminDrawer />
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
