const fs = require('fs');

// 1. Update Sidebar
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
if (!sidebar.includes('cari-penyakit')) {
  sidebar = sidebar.replace(
    "{ id: 'cari-pestisida', label: 'Cari Pestisida', subtitle: 'Solusi Hama & Penyakit', icon: 'vaccines' },",
    "{ id: 'cari-pestisida', label: 'Cari Pestisida', subtitle: 'Solusi Hama & Penyakit', icon: 'vaccines' },\n  { id: 'cari-penyakit', label: 'Cari Penyakit', subtitle: 'Identifikasi Penyakit', icon: 'coronavirus' },"
  );
  fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
}

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
if (!app.includes('CariPenyakitView')) {
  app = app.replace(
    "import { CariPestisidaView } from './views/CariPestisidaView';",
    "import { CariPestisidaView } from './views/CariPestisidaView';\nimport { CariPenyakitView } from './views/CariPenyakitView';"
  );
  app = app.replace(
    "case 'cari-pestisida': return <CariPestisidaView />;",
    "case 'cari-pestisida': return <CariPestisidaView />;\n      case 'cari-penyakit': return <CariPenyakitView />;"
  );
  fs.writeFileSync('src/App.tsx', app);
}

