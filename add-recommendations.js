const fs = require('fs');
const content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

const insertionPoint = content.lastIndexOf('</div>\n    </div>\n  );');

const recommendationCode = `
      {tanaman.length > 0 && (
        <div className="neo-card flex flex-col relative overflow-hidden mb-6">
          <div className="flex justify-between items-center bg-primary text-black p-4 px-6 border-b-[3px] border-outline">
            <h2 className="font-brutal font-black uppercase tracking-wider text-xl text-black">Rekomendasi Perawatan</h2>
            <span className="material-symbols-outlined text-black font-bold">tips_and_updates</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {tanaman.map(t => {
              const hst = calculateHST(t.tanggalTanam);
              const rekomendasi = getRecommendations(hst);
              const fase = determineFaseTanaman(hst);
              const blok = blokLahan.find(b => b.id === t.blokId);
              return (
                <div key={t.id} className="neo-card-small p-4 bg-surface-high/30 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-outline pb-2">
                    <div>
                      <h3 className="font-display font-bold text-lg">{t.komoditas} <span className="text-on-surface-muted text-sm font-normal">({t.varietas})</span></h3>
                      <span className="text-xs font-mono text-on-surface-muted">{blok?.nama || 'Unknown'}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-display font-bold text-xl text-black bg-action px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000] inline-block">{hst} <span className="text-sm font-sans font-normal text-on-surface-muted">HST</span></span>
                      <span className="text-xs text-success font-bold mt-1 uppercase">{fase}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">compost</span> Pupuk</span>
                      <span className="text-sm font-sans">{rekomendasi.pupuk}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">pest_control</span> Pestisida</span>
                      <span className="text-sm font-sans">{rekomendasi.pestisida}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">agriculture</span> Perawatan</span>
                      <span className="text-sm font-sans">{rekomendasi.perawatan}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bug_report</span> Potensi Hama</span>
                      <span className="text-sm font-sans">{rekomendasi.hama}</span>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <span className="text-xs font-bold text-action uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lightbulb</span> Tips & Trik</span>
                      <span className="text-sm font-sans bg-action/10 p-2 rounded-sm border-l-2 border-action">{rekomendasi.tips}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}`;

const newContent = content.slice(0, insertionPoint) + recommendationCode + content.slice(insertionPoint);
fs.writeFileSync('src/views/DashboardView.tsx', newContent);
