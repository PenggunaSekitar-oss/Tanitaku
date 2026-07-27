const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

const targetStr = `<span className="text-white font-bold bg-primary px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[3px_3px_0px_0px_#000] inline-block">
                                      {[
                                        k.komoditas ? \`Panen: \${k.komoditas}\` : null,
                                        k.namaBenih ? \`Benih: \${k.namaBenih}\` : null,
                                        k.namaPupuk ? \`Pupuk: \${k.namaPupuk}\` : null,
                                        k.namaPestisida ? \`Pestisida: \${k.namaPestisida}\` : null,
                                        (!k.komoditas && !k.namaBenih && !k.namaPupuk && !k.namaPestisida) ? 'Operasional' : null
                                      ].filter(Boolean).join(', ')}
                                    </span>`;

const replaceStr = `<span className="text-white font-bold bg-primary px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[3px_3px_0px_0px_#000] inline-block">
                                      {(() => {
                                        const labels = [];
                                        if (k.namaBenih) labels.push(\`Benih: \${k.namaBenih}\`);
                                        if (k.namaPupuk) labels.push(\`Pupuk: \${k.namaPupuk}\`);
                                        if (k.namaPestisida) labels.push(\`Pestisida: \${k.namaPestisida}\`);
                                        if (labels.length === 0 && k.komoditas) labels.push(k.komoditas);
                                        if (labels.length > 0 && k.targetHasil > 0) labels.push(k.komoditas);
                                        return labels.length > 0 ? labels.join(', ') : 'Operasional';
                                      })()}
                                    </span>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/KeuanganView.tsx', code);
