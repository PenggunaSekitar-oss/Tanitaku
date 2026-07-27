const fs = require('fs');
let c = fs.readFileSync('src/views/PemupukanView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Jadwal & Dosis Perawatan" subtitle="Rencanakan dan kelola jadwal pemupukan serta penyemprotan pestisida." />`
);
fs.writeFileSync('src/views/PemupukanView.tsx', c);
