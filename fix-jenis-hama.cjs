const fs = require('fs');

// 1. Update Sidebar
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
const oldMenuRegex = /\{ id: 'kocor', label: 'Kalkulator Kocor', icon: 'water_drop' \},/;
const newMenu = `{ id: 'kocor', label: 'Kalkulator Kocor', icon: 'water_drop' },
  { id: 'jenis-hama', label: 'Jenis Hama', icon: 'bug_report' },`;
sidebar = sidebar.replace(oldMenuRegex, newMenu);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(
  "import { KocorView } from './views/KocorView';",
  "import { KocorView } from './views/KocorView';\nimport { JenisHamaView } from './views/JenisHamaView';"
);

app = app.replace(
  "case 'kocor': return <KocorView />;",
  "case 'kocor': return <KocorView />;\n      case 'jenis-hama': return <JenisHamaView />;"
);
fs.writeFileSync('src/App.tsx', app);
