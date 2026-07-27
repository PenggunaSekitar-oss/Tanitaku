const fs = require('fs');
let code = fs.readFileSync('src/views/CariPestisidaView.tsx', 'utf-8');

code = code.replace(
  /const filtered = PESTISIDA_CATALOG\.filter\(item => item\.sasaran\.includes\(hamaInput\)\);/g,
  `const scored = PESTISIDA_CATALOG.map(item => {
        let score = 0;
        let isMatch = true;
        
        const qHama = hamaInput.trim().toLowerCase();
        if (qHama) {
            const exactSasaranMatch = item.sasaran.some(s => s.toLowerCase() === qHama);
            const partialSasaranMatch = item.sasaran.some(s => s.toLowerCase().includes(qHama));
            
            if (exactSasaranMatch) {
                score += 15;
            } else if (partialSasaranMatch) {
                score += 8;
            } else if (item.nama.toLowerCase().includes(qHama) || item.bahanAktif.toLowerCase().includes(qHama)) {
                score += 5;
            } else {
                isMatch = false;
            }
        }
        
        if (jenisInput) {
            if (item.jenis === jenisInput) {
                score += 10;
            } else {
                isMatch = false;
            }
        }
        
        return { ...item, score, isMatch };
      });
      
      const filtered = scored.filter(i => i.isMatch);
      filtered.sort((a, b) => b.score - a.score);`
);

code = code.replace(
  /\{idx === 0 && \(/g,
  `{idx === 0 && (item as any).score >= 15 && (`
);

fs.writeFileSync('src/views/CariPestisidaView.tsx', code);
