const fs = require('fs');

// 1. Update Sidebar
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
const oldMenuRegex = /\{ id: 'pemupukan', label: 'Pupuk & Pestisida', icon: 'compost' \},/;
const newMenu = `{ id: 'pemupukan', label: 'Pupuk & Pestisida', icon: 'compost' },
  { id: 'kocor', label: 'Kalkulator Kocor', icon: 'water_drop' },`;
sidebar = sidebar.replace(oldMenuRegex, newMenu);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(
  "import { PemupukanView } from './views/PemupukanView';",
  "import { PemupukanView } from './views/PemupukanView';\nimport { KocorView } from './views/KocorView';"
);

app = app.replace(
  "case 'pemupukan': return <PemupukanView />;",
  "case 'pemupukan': return <PemupukanView />;\n      case 'kocor': return <KocorView />;"
);
fs.writeFileSync('src/App.tsx', app);
