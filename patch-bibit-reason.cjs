const fs = require('fs');
let code = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

code = code.replace(
  /<div className="flex justify-between items-start">/,
  `{idx === 0 && (item as any).score >= 15 && (
                    <div className="bg-action/10 border-l-4 border-action p-3 mb-3 rounded-r text-sm">
                      <p className="font-bold text-action mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">psychology</span> Alasan Rekomendasi</p>
                      <p className="text-on-surface-muted text-xs leading-relaxed">
                        Bibit ini sangat direkomendasikan karena kecocokannya dengan komoditas <b>{item.komoditas}</b> di <b>dataran {item.ketinggian.join(', ')}</b>. 
                        Dengan potensi hasil mencapai <b>{item.potensiHasil}</b>, bibit ini unggul karena: <i>{item.keunggulan.toLowerCase()}</i>
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-start">`
);

fs.writeFileSync('src/views/CariBibitView.tsx', code);
