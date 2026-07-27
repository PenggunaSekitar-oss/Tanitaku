const fs = require('fs');

function patchFile(file, oldStr, newStr) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content);
}

// PemantauanView
patchFile('src/views/PemantauanView.tsx',
  '<div className="flex items-center justify-between">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pemantauan Lahan & Tanaman</h1>',
  '<div className="flex flex-col gap-1 w-full">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pemantauan Lahan & Tanaman</h1>'
);

// PemupukanView
patchFile('src/views/PemupukanView.tsx',
  '<div className="flex items-center justify-between">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Jadwal & Dosis Perawatan</h1>',
  '<div className="flex flex-col gap-1 w-full">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Jadwal & Dosis Perawatan</h1>'
);

// KeuanganView
patchFile('src/views/KeuanganView.tsx',
  '<div className="flex items-center justify-between">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Biaya & Profitabilitas</h1>',
  '<div className="flex flex-col gap-1 w-full">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Biaya & Profitabilitas</h1>'
);

// PengaturanView
patchFile('src/views/PengaturanView.tsx',
  '<div className="flex items-center justify-between">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pengaturan Sistem</h1>',
  '<div className="flex flex-col gap-1 w-full">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pengaturan Sistem</h1>'
);

// Sidebar height
patchFile('src/components/Sidebar.tsx',
  'h-[50vh]',
  'h-[75vh]'
);

