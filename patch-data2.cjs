const fs = require('fs');

let content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

const currentRender = '<div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">';

const newRender = `
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="bg-surface-high p-2 border border-outline rounded-[4px_2px_4px_2px] flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-muted">Umur Panen</span>
                      <span className="text-sm font-bold text-on-surface">{item.umurPanen}</span>
                    </div>
                    <div className="bg-surface-high p-2 border border-outline rounded-[4px_2px_4px_2px] flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-muted">Potensi Hasil</span>
                      <span className="text-sm font-bold text-on-surface">{item.potensiHasil}</span>
                    </div>
                    <div className="col-span-2 bg-action/10 p-2 border border-action/20 rounded-[4px_2px_4px_2px] flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-action">Estimasi Harga</span>
                      <span className="text-sm font-bold text-on-surface">{item.harga}</span>
                    </div>
                  </div>

                  <div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">`;
                  
content = content.replace(currentRender, newRender);
fs.writeFileSync('src/views/CariBibitView.tsx', content);
