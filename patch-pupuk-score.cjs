const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /return PUPUK_DB\.filter\(p => \{[\s\S]*?\}\);/g,
  `const scored = PUPUK_DB.map(p => {
      let score = 0;
      let isMatch = true;

      // Filter by HST
      if (searchParams.hst >= p.minHst && searchParams.hst <= p.maxHst) {
        score += 10;
        const midPoint = (p.minHst + p.maxHst) / 2;
        const distance = Math.abs(searchParams.hst - midPoint);
        const maxDistance = (p.maxHst - p.minHst) / 2 || 1;
        score += (5 * Math.max(0, 1 - distance / maxDistance));
      } else {
        isMatch = false;
      }

      // Filter by Fungsi
      if (searchParams.fungsi) {
        const f = searchParams.fungsi;
        const ket = p.keterangan.toLowerCase();
        let matchFungsi = false;
        
        if (f === 'daun') {
          if (ket.includes('daun') || p.fase.includes('Vegetatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'akar') {
          if (ket.includes('akar') || p.fase.includes('Dasar') || p.fase.includes('Vegetatif Awal')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'batang') {
          if (ket.includes('batang') || p.fase.includes('Vegetatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'bunga') {
          if (ket.includes('bunga') || p.fase.includes('Generatif Awal') || p.fase.includes('Generatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'buah') {
          if (ket.includes('buah') || p.fase.includes('Generatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        }

        if (!matchFungsi) {
           isMatch = false;
        }
      }

      if (searchParams.tanaman) {
         if (p.keterangan.toLowerCase().includes(searchParams.tanaman.toLowerCase())) {
             score += 5;
         }
      }

      return { ...p, score, isMatch };
    });

    const filtered = scored.filter(p => p.isMatch);
    filtered.sort((a, b) => b.score - a.score);
    return filtered;`
);

code = code.replace(
  /\{idx === 0 && \(/g,
  `{idx === 0 && (pupuk as any).score >= 15 && (`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
