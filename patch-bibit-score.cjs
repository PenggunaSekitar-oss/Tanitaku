const fs = require('fs');
let code = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

code = code.replace(
  /const filtered = CATALOG\.filter\(item => \{[\s\S]*?\}\);/g,
  `const scored = CATALOG.map(item => {
        let score = 0;
        let isMatch = true;
        
        const qKomoditas = query.trim().toLowerCase();
        if (qKomoditas) {
            if (item.komoditas.toLowerCase() === qKomoditas || item.nama.toLowerCase() === qKomoditas) {
                score += 15;
            } else if (item.komoditas.toLowerCase().includes(qKomoditas) || item.nama.toLowerCase().includes(qKomoditas)) {
                score += 8;
            } else {
                isMatch = false;
            }
        }
        
        if (ketinggian) {
            if (item.ketinggian.includes(ketinggian)) {
                score += 10;
                // If it's specifically bred for this height (only 1 height supported), give higher score
                if (item.ketinggian.length === 1) score += 5;
            } else {
                isMatch = false;
            }
        }
        
        if (cuaca !== 'Semua') {
            if (item.cuaca.includes(cuaca)) {
                score += 5;
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

fs.writeFileSync('src/views/CariBibitView.tsx', code);
