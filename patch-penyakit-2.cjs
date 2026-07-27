const fs = require('fs');
let content = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

// Update component signature
content = content.replace(
  "export function CariPenyakitView() {",
  "export function CariPenyakitView({ navigate }: { navigate?: (view: string) => void }) {"
);

// Update button
const oldButton = `<div className="bg-primary/10 border border-primary/20 p-2 rounded flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-primary font-bold uppercase">Rekomendasi Cari Obat</span>
                            <span className="text-sm font-bold text-on-surface">Target Hama/Penyakit: {item.sasaranPestisida}</span>
                          </div>
                          <span className="material-symbols-outlined text-primary text-xl">arrow_forward</span>
                        </div>`;

const newButton = `<button 
                          onClick={() => {
                            if (navigate) {
                              localStorage.setItem('targetPestisida', item.sasaranPestisida);
                              navigate('cari-pestisida');
                            }
                          }}
                          className="w-full text-left bg-primary/10 border border-primary/20 p-2 rounded-[8px_3px_8px_3px] flex items-center justify-between hover:bg-primary/20 transition cursor-pointer active:scale-[0.98]"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] text-primary font-bold uppercase">Rekomendasi Cari Obat</span>
                            <span className="text-sm font-bold text-on-surface">Target: {item.sasaranPestisida}</span>
                          </div>
                          <span className="material-symbols-outlined text-primary text-xl">arrow_forward</span>
                        </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/views/CariPenyakitView.tsx', content);
