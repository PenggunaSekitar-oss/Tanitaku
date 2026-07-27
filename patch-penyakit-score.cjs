const fs = require('fs');
let code = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

code = code.replace(
  /let filtered = PENYAKIT_CATALOG;\n\s*if \(tanamanInput !== 'Semua'\) \{\n\s*filtered = filtered\.filter\(item => item\.tanaman\.some\(t => t === tanamanInput \|\| t\.includes\(tanamanInput\)\)\);\n\s*\}\n\s*if \(penyakitInput\) \{\n\s*filtered = filtered\.filter\(item => item\.nama === penyakitInput\);\n\s*\}/g,
  `const scored = PENYAKIT_CATALOG.map(item => {
        let score = 0;
        let isMatch = true;
        
        const qPenyakit = penyakitInput.trim().toLowerCase();
        if (qPenyakit) {
            if (item.nama.toLowerCase() === qPenyakit) {
                score += 15;
            } else if (item.nama.toLowerCase().includes(qPenyakit)) {
                score += 8;
            } else {
                isMatch = false;
            }
        }
        
        if (tanamanInput !== 'Semua') {
            if (item.tanaman.some(t => t === tanamanInput || t.includes(tanamanInput))) {
                score += 10;
            } else {
                isMatch = false;
            }
        }
        
        return { ...item, score, isMatch };
      });
      
      let filtered = scored.filter(i => i.isMatch);
      filtered.sort((a, b) => b.score - a.score);`
);

code = code.replace(
  /\{idx === 0 && \(/g,
  `{idx === 0 && (item as any).score >= 10 && (`
);

fs.writeFileSync('src/views/CariPenyakitView.tsx', code);
