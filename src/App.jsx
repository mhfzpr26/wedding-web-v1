import { AdminPage } from './components/admin/AdminPage';
import { useWedding, WeddingProvider } from './context/WeddingContext';
import { getTemplateById } from './templates/registry';

const WeddingAppContent = () => {
  const { isAdminMode, activeTemplateId } = useWedding();

  // Jika URL adalah /admin, tampilkan Halaman Admin Khusus (Standalone Page)
  if (isAdminMode) {
    return <AdminPage />;
  }

  // Jika bukan /admin, tampilkan Website Undangan Pernikahan secara murni
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
