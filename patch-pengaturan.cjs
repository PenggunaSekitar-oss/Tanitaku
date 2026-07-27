const fs = require('fs');
let c = fs.readFileSync('src/views/PengaturanView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Pengaturan Sistem" subtitle="Konfigurasi notifikasi, tema, dan ekspor/impor data aplikasi." />`
);
fs.writeFileSync('src/views/PengaturanView.tsx', c);
