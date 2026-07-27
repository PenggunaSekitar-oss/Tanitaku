const fs = require('fs');

function addImport(file) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('PageHeader')) {
    content = content.replace("import React", "import { PageHeader } from '../components/PageHeader';\nimport React");
    fs.writeFileSync(file, content);
  }
}

const files = [
  'src/views/DashboardView.tsx',
  'src/views/PemantauanView.tsx',
  'src/views/PemupukanView.tsx',
  'src/views/KocorView.tsx',
  'src/views/JenisHamaView.tsx',
  'src/views/KeuanganView.tsx',
  'src/views/LogAktivitasView.tsx',
  'src/views/PengaturanView.tsx'
];

files.forEach(addImport);
