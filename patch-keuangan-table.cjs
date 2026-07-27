const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

const targetStr = `<span className="text-black font-bold bg-primary px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[3px_3px_0px_0px_#000] inline-block">
                                      {(() => {
                                        const labels = [];
                                        if (k.namaBenih) labels.push(\`Benih: \${k.namaBenih}\`);
                                        if (k.namaPupuk) labels.push(\`Pupuk: \${k.namaPupuk}\`);
                                        if (k.namaPestisida) labels.push(\`Pestisida: \${k.namaPestisida}\`);
                                        if (labels.length === 0 && k.komoditas) labels.push(k.komoditas);
                                        return labels.length > 0 ? labels.join(', ') : 'Operasional';
                                      })()}
                                    </span>`;

const replaceStr = `<span className="font-bold text-on-surface">
                                      {(() => {
                                        const labels = [];
                                        if (k.namaBenih) labels.push(\`Benih: \${k.namaBenih}\`);
                                        if (k.namaPupuk) labels.push(\`Pupuk: \${k.namaPupuk}\`);
                                        if (k.namaPestisida) labels.push(\`Pestisida: \${k.namaPestisida}\`);
                                        if (labels.length === 0 && k.komoditas) labels.push(k.komoditas);
                                        return labels.length > 0 ? labels.join(', ') : 'Operasional';
                                      })()}
                                    </span>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/KeuanganView.tsx', code);
