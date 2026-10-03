import { AdminPage } from './components/admin/AdminPage';
import { ClientPortalPage } from './components/client/ClientPortalPage';
import { useWedding, WeddingProvider } from './context/WeddingContext';
import { getTemplateById } from './templates/registry';

const WeddingAppContent = () => {
  const { isAdminMode, isClientPortalMode, clientSlug, activeTemplateId } =
    useWedding();

  // Jika URL adalah /admin, tampilkan Halaman Admin Studio
  if (isAdminMode) {
    return <AdminPage />;
  }

  // Jika URL adalah /:slug/tamu atau /tamu, tampilkan Portal Khusus Pasangan Pengantin
  if (isClientPortalMode) {
    return <ClientPortalPage slug={clientSlug} />;
  }

  // Jika bukan /admin & bukan portal tamu, tampilkan Website Undangan Pernikahan
  const ActiveTemplateComponent = getTemplateById(activeTemplateId).component;
  return <ActiveTemplateComponent />;
};

export default function App() {
  return (
    <WeddingProvider>
      <WeddingAppContent />
    </WeddingProvider>
  );
}
