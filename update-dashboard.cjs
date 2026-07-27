const fs = require('fs');
const content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

// We need to find the entire block of Rekomendasi Perawatan and remove it.
const startSearch = '{tanaman.length > 0 && (';
const endSearch = ')}</div>';

const startIndex = content.indexOf(startSearch);
let endIndex = content.indexOf(endSearch, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const contentBefore = content.slice(0, startIndex);
  const contentAfter = content.slice(endIndex + 8);

  const importReactIndex = contentBefore.indexOf("import React");
  const importReactLine = contentBefore.slice(importReactIndex, contentBefore.indexOf(";", importReactIndex) + 1);
  const updatedImport = "import React, { useState } from 'react';";
  
  let finalContent = contentBefore.replace(importReactLine, updatedImport);
  
  // Add state to component
  const componentStartIndex = finalContent.indexOf('export function DashboardView');
  const bracketIndex = finalContent.indexOf('{', componentStartIndex);
  
  const stateInsert = `\n  const [showRekomendasi, setShowRekomendasi] = useState(false);\n`;
  finalContent = finalContent.slice(0, bracketIndex + 1) + stateInsert + finalContent.slice(bracketIndex + 1);
  
  const floatingButtonAndModal = `
      {/* Floating Robot Button */}
      {tanaman.length > 0 && (
        <button 
          onClick={() => setShowRekomendasi(true)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full neo-border shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-y-1 bg-action flex items-center justify-center overflow-hidden animate-bounce"
        >
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TaniBot&backgroundColor=0f172a" alt="TaniBot" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Modal Rekomendasi */}
      {showRekomendasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="neo-card flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden bg-surface relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-primary text-black p-4 px-6 border-b-[3px] border-outline shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-high neo-border-thin overflow-hidden hidden md:block">
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TaniBot&backgroundColor=0f172a" alt="TaniBot" className="w-full h-full object-cover" />
                </div>
                <h2 className="font-brutal font-black uppercase tracking-wider text-xl text-black">Rekomendasi Perawatan</h2>
              </div>
              <button onClick={() => setShowRekomendasi(false)} className="p-2 hover:bg-black/10 rounded-sm transition">
                <span className="material-symbols-outlined text-black font-bold text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-6 hide-scrollbar">
              {tanaman.map(t => {
                const hst = calculateHST(t.tanggalTanam);
                const rekomendasi = getRecommendations(hst);
                const fase = determineFaseTanaman(hst);
                const blok = blokLahan.find(b => b.id === t.blokId);
                return (
                  <div key={t.id} className="neo-card-small p-4 md:p-6 bg-surface-high/30 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline pb-4 gap-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-on-surface">{t.komoditas} <span className="text-on-surface-muted text-base font-normal">({t.varietas})</span></h3>
                        <span className="text-sm font-mono text-on-surface-muted">{blok?.nama || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex flex-col">
                          <span className="text-xs text-on-surface-muted font-bold uppercase text-right">Fase</span>
                          <span className="text-sm text-success font-bold uppercase">{fase}</span>
                        </div>
                        <span className="font-display font-bold text-2xl text-black bg-action px-3 py-1 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[3px_3px_0px_0px_#000] inline-block">{hst} <span className="text-sm font-sans font-normal text-black/70">HST</span></span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                      <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
                        <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-success">compost</span> Rekomendasi Pupuk</span>
                        <span className="text-sm font-sans leading-relaxed">{rekomendasi.pupuk}</span>
                      </div>
                      <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
                        <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-danger">pest_control</span> Tindakan Pestisida</span>
                        <span className="text-sm font-sans leading-relaxed">{rekomendasi.pestisida}</span>
                      </div>
                      <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
                        <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">agriculture</span> Langkah Perawatan</span>
                        <span className="text-sm font-sans leading-relaxed">{rekomendasi.perawatan}</span>
                      </div>
                      <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
                        <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-warning">bug_report</span> Antisipasi Hama</span>
                        <span className="text-sm font-sans leading-relaxed">{rekomendasi.hama}</span>
                      </div>
                      <div className="flex flex-col md:col-span-2 gap-2 p-4 bg-action/10 rounded-sm border-l-4 border-action">
                        <span className="text-xs font-bold text-action uppercase flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">lightbulb</span> Tips & Trik TaniBot</span>
                        <span className="text-sm font-sans leading-relaxed text-on-surface font-medium">{rekomendasi.tips}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
  `;

  finalContent = finalContent + floatingButtonAndModal + contentAfter;
  
  fs.writeFileSync('src/views/DashboardView.tsx', finalContent);
  console.log("Success");
} else {
  console.log("Could not find blocks");
}
