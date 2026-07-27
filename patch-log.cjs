const fs = require('fs');
let c = fs.readFileSync('src/views/LogAktivitasView.tsx', 'utf-8');

// Replace the old header with PageHeader and action
c = c.replace(
  /<div className="flex items-center justify-between">\s*<h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Log Aktivitas Operasional<\/h1>\s*<button onClick={handleExportCSV} disabled={logAktivitas.length === 0} className="flex items-center gap-2 px-4 py-2 border border-outline rounded-sm hover:bg-surface-high disabled:opacity-50 transition">\s*<span className="material-symbols-outlined text-sm">download<\/span>\s*<span className="text-sm font-bold">EXPORT CSV<\/span>\s*<\/button>\s*<\/div>/,
  `<PageHeader 
        title="Log Aktivitas Operasional" 
        subtitle="Riwayat semua aktivitas yang telah dilakukan pada lahan Anda." 
        action={
          <button onClick={handleExportCSV} disabled={logAktivitas.length === 0} className="flex items-center gap-2 px-4 py-2 border border-outline rounded-[8px_3px_8px_3px] hover:bg-surface-high disabled:opacity-50 transition">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="font-bold text-sm hidden sm:inline">Export CSV</span>
          </button>
        }
      />`
);

fs.writeFileSync('src/views/LogAktivitasView.tsx', c);
