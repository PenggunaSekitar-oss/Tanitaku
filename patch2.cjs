const fs = require('fs');

function patchFile(file, oldStr, newStr) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content);
}

patchFile('src/views/KeuanganView.tsx',
  '<h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Biaya & Profitabilitas</h1>\n      </div>',
  '<h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Biaya & Profitabilitas</h1>\n        <p className="text-on-surface-muted text-sm font-medium">Hitung estimasi pengeluaran, BEP, serta prediksi laba/rugi hasil panen.</p>\n      </div>'
);

patchFile('src/views/PengaturanView.tsx',
  '<h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pengaturan Sistem</h1>\n      </div>',
  '<h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Pengaturan Sistem</h1>\n        <p className="text-on-surface-muted text-sm font-medium">Konfigurasi notifikasi, tema, dan ekspor/impor data aplikasi.</p>\n      </div>'
);

patchFile('src/views/LogAktivitasView.tsx',
  '<div className="flex items-center gap-4">\n        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Log Aktivitas Operasional</h1>\n        <div className="flex-1 min-w-0" />\n        <button onClick={handleExportCSV}',
  '<div className="flex flex-col gap-1 w-full">\n        <div className="flex items-center justify-between w-full">\n          <h1 className="font-brutal font-black uppercase tracking-wider text-3xl">Log Aktivitas Operasional</h1>\n          <button onClick={handleExportCSV}'
);

let log = fs.readFileSync('src/views/LogAktivitasView.tsx', 'utf-8');
log = log.replace(
  '          <button onClick={handleExportCSV} disabled={logAktivitas.length === 0} className="flex items-center gap-2 px-4 py-2 border border-outline rounded-sm hover:bg-surface-high disabled:opacity-50 transition">\n            <span className="material-symbols-outlined text-[18px]">download</span>\n            <span className="font-bold text-sm hidden sm:inline">Export CSV</span>\n          </button>\n      </div>',
  '          <button onClick={handleExportCSV} disabled={logAktivitas.length === 0} className="flex items-center gap-2 px-4 py-2 border border-outline rounded-[8px_3px_8px_3px] hover:bg-surface-high disabled:opacity-50 transition shrink-0">\n            <span className="material-symbols-outlined text-[18px]">download</span>\n            <span className="font-bold text-sm hidden sm:inline">Export CSV</span>\n          </button>\n        </div>\n        <p className="text-on-surface-muted text-sm font-medium">Riwayat semua aktivitas yang telah dilakukan pada lahan Anda.</p>\n      </div>'
);
fs.writeFileSync('src/views/LogAktivitasView.tsx', log);

