const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

const targetStr = `                                        if (labels.length === 0 && k.komoditas) labels.push(k.komoditas);
                                        if (labels.length > 0 && k.targetHasil > 0) labels.push(k.komoditas);
                                        return labels.length > 0 ? labels.join(', ') : 'Operasional';`;

const replaceStr = `                                        if (labels.length === 0 && k.komoditas) labels.push(k.komoditas);
                                        return labels.length > 0 ? labels.join(', ') : 'Operasional';`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/views/KeuanganView.tsx', code);
