const fs = require('fs');
let code = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

code = code.replace(
  /<div className="p-4 flex flex-col gap-4 w-full sm:w-2\/3">/,
  `<div className="p-4 flex flex-col gap-4 w-full sm:w-2/3">
                    {idx === 0 && (item as any).score >= 10 && (
                      <div className="bg-action/10 border-l-4 border-action p-3 rounded-r text-sm -mt-2">
                        <p className="font-bold text-action mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">psychology</span> Alasan Relevansi</p>
                        <p className="text-on-surface-muted text-xs leading-relaxed">
                          Sangat relevan karena penyakit <b>{item.nama}</b> merupakan masalah umum dan kritikal pada tanaman <b>{tanamanInput !== 'Semua' ? tanamanInput : item.tanaman[0]}</b>. Segera atasi menggunakan solusi yang disarankan.
                        </p>
                      </div>
                    )}`
);

fs.writeFileSync('src/views/CariPenyakitView.tsx', code);
