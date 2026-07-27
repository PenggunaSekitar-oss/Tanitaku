const fs = require('fs');
let c = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Biaya & Profitabilitas" subtitle="Hitung estimasi pengeluaran, BEP, serta prediksi laba/rugi hasil panen." />`
);
fs.writeFileSync('src/views/KeuanganView.tsx', c);
