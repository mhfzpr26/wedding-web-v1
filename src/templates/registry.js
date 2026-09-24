import TemplateV1FloralArch from './v1-floral-arch';

/**
 * REGISTRY TEMPLATE INVATERA
 * Untuk menambah template baru (misal V2 atau 3D) di masa depan:
 * 1. Buat folder baru di `src/templates/v2-nama-template/`
 * 2. Daftarkan di objek TEMPLATES di bawah ini.
 */
export const TEMPLATES = {
  'v1-floral-arch': {
    id: 'v1-floral-arch',
    name: 'Template V1 - Floral Arch Vector',
    category: 'Vektor Estetik (Tanpa Foto)',
    tag: 'Best Seller',
    description:
      'Konsep kubah vektor floral tanpa foto asli. Ringan, cepat dimuat di HP, dan mendukung 3 palet warna.',
    supportedPresets: ['navy', 'sage', 'rose'],
    component: TemplateV1FloralArch,
  },
  // Template V2 (Mock / Blueprint untuk demonstrasi masa depan di Admin Panel)
  'v2-minimalist-monogram': {
    id: 'v2-minimalist-monogram',
    name: 'Template V2 - Modern Monogram',
    category: 'Typography & Monogram',
    tag: 'Coming Soon',
    description:
      'Desain minimalis modern dengan monogram inisial nama elegan dan tipografi kontemporer.',
    supportedPresets: ['navy', 'sage'],
    component: TemplateV1FloralArch, // fallback to V1 for now
    isPlaceholder: true,
  },
  // Template V3 (Blueprint 3D Experience)
  'v3-3d-envelope': {
    id: 'v3-3d-envelope',
    name: 'Template V3 - 3D Wax Seal Experience',
    category: 'Interactive 3D WebGL',
    tag: 'Premium Tier',
    description:
      'Pengalaman membuka amplop 3D interaktif dengan segel lilin wax seal dan efek tiga dimensi.',
    supportedPresets: ['navy', 'rose'],
    component: TemplateV1FloralArch, // fallback to V1 for now
    isPlaceholder: true,
  },
};

export const getTemplateById = (id) => {
  return TEMPLATES[id] || TEMPLATES['v1-floral-arch'];
};
