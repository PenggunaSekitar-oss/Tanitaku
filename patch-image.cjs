const fs = require('fs');

const content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

const imageHelper = `
const getImageForKomoditas = (komoditas: string) => {
  const k = komoditas.toLowerCase();
  if (k.includes('cabai')) return 'https://images.unsplash.com/photo-1588879579089-63ff0d55e2d1?auto=format&fit=crop&q=80&w=400';
  if (k.includes('tomat')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400';
  if (k.includes('bawang')) return 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=400';
  if (k.includes('kubis') || k.includes('kol')) return 'https://images.unsplash.com/photo-1518977822524-732be07d9f78?auto=format&fit=crop&q=80&w=400';
  if (k.includes('sawi') || k.includes('pakcoy') || k.includes('selada') || k.includes('kangkung')) return 'https://images.unsplash.com/photo-1599863809054-d843ff45a16d?auto=format&fit=crop&q=80&w=400';
  if (k.includes('terong')) return 'https://images.unsplash.com/photo-1606558450146-231a4734b0dc?auto=format&fit=crop&q=80&w=400';
  if (k.includes('timun') || k.includes('pare') || k.includes('kacang') || k.includes('buncis')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400';
  if (k.includes('melon') || k.includes('semangka')) return 'https://images.unsplash.com/photo-1587049352847-4d4b12736b45?auto=format&fit=crop&q=80&w=400';
  if (k.includes('jagung')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400';
  return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400';
};
`;

let newContent = content.replace("export function CariBibitView() {", imageHelper + "\nexport function CariBibitView() {");

const oldCardRender = `<div key={idx} className="neo-card-small p-4 bg-surface flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-brutal font-black text-lg text-action uppercase tracking-wider">{item.nama}</h4>
                      <p className="text-xs font-mono text-on-surface-muted mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                    </div>
                    <span className="material-symbols-outlined text-action bg-action/10 p-1.5 rounded-md text-[20px]">
                      local_florist
                    </span>
                  </div>`;

const newCardRender = `<div key={idx} className="neo-card-small p-0 bg-surface flex flex-col overflow-hidden">
                  <img 
                    src={getImageForKomoditas(item.komoditas)} 
                    alt={item.komoditas} 
                    className="w-full h-32 object-cover border-b-2 border-black"
                  />
                  <div className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-brutal font-black text-lg text-action uppercase tracking-wider">{item.nama}</h4>
                        <p className="text-xs font-mono text-on-surface-muted mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                      </div>
                    </div>`;

newContent = newContent.replace(oldCardRender, newCardRender);

// Also we need to close the padding div.
// Original ended with:
//                   <div className="border-t border-outline pt-3 mt-auto">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">Keunggulan Utama:</span>
//                     <p className="text-sm text-on-surface leading-relaxed">
//                       {item.keunggulan}
//                     </p>
//                   </div>
//                 </div>

const oldCardEnd = `</p>
                  </div>
                </div>`;

const newCardEnd = `</p>
                  </div>
                  </div>
                </div>`;

newContent = newContent.replace(oldCardEnd, newCardEnd);

fs.writeFileSync('src/views/CariBibitView.tsx', newContent);
