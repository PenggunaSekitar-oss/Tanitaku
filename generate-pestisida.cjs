const fs = require('fs');

// 1. Update Sidebar
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
if (!sidebar.includes('cari-pestisida')) {
  sidebar = sidebar.replace(
    "{ id: 'cari-bibit', label: 'Cari Bibit', subtitle: 'Rekomendasi Varietas', icon: 'travel_explore' },",
    "{ id: 'cari-bibit', label: 'Cari Bibit', subtitle: 'Rekomendasi Varietas', icon: 'travel_explore' },\n  { id: 'cari-pestisida', label: 'Cari Pestisida', subtitle: 'Solusi Hama & Penyakit', icon: 'vaccines' },"
  );
  fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
}

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
if (!app.includes('CariPestisidaView')) {
  app = app.replace(
    "import { CariBibitView } from './views/CariBibitView';",
    "import { CariBibitView } from './views/CariBibitView';\nimport { CariPestisidaView } from './views/CariPestisidaView';"
  );
  app = app.replace(
    "case 'cari-bibit': return <CariBibitView />;",
    "case 'cari-bibit': return <CariBibitView />;\n      case 'cari-pestisida': return <CariPestisidaView />;"
  );
  fs.writeFileSync('src/App.tsx', app);
}

