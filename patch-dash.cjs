const fs = require('fs');
let c = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Dashboard Operasional" subtitle="Pantauan aktivitas, jadwal, dan operasional harian lahan Anda." />`
);
fs.writeFileSync('src/views/DashboardView.tsx', c);
