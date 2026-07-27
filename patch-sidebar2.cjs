const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebar = sidebar.replace(
  "{ id: 'jenis-hama', label: 'Ensiklopedia', subtitle: 'Jenis Hama', icon: 'bug_report' },",
  "{ id: 'jenis-hama', label: 'Ensiklopedia', subtitle: 'Jenis Hama', icon: 'bug_report' },\n  { id: 'cari-bibit', label: 'Cari Bibit', subtitle: 'Rekomendasi Varietas', icon: 'travel_explore' },"
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
