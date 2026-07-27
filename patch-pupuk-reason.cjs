const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /<div className="p-4 flex flex-col gap-3 flex-1 bg-surface">/,
  `{idx === 0 && (pupuk as any).score >= 15 && (
                <div className="bg-action/10 border-l-4 border-action p-3 m-4 mb-0 rounded-r text-sm">
                  <p className="font-bold text-action mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">psychology</span> Alasan Rekomendasi</p>
                  <p className="text-on-surface-muted text-xs leading-relaxed">
                    Sangat relevan dengan kriteria pencarian usia <b>{searchParams.hst} HST</b>{searchParams.fungsi && <span>, dan sangat efektif untuk target <b>{FUNGSI_OPTIONS.find(f => f.value === searchParams.fungsi)?.label || searchParams.fungsi}</b></span>}. {pupuk.keterangan}
                  </p>
                </div>
              )}
              <div className="p-4 flex flex-col gap-3 flex-1 bg-surface">`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
