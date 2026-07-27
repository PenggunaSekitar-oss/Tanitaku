const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /const \[tanamanInput, setTanamanInput\] = useState\(''\);/,
  `const [tanamanInput, setTanamanInput] = useState('');\n  const [fungsiInput, setFungsiInput] = useState('');`
);

code = code.replace(
  /const \[searchParams, setSearchParams\] = useState\(\{ tanaman: '', hst: -1 \}\);/,
  `const [searchParams, setSearchParams] = useState({ tanaman: '', hst: -1, fungsi: '' });\n\n  const FUNGSI_OPTIONS = [\n    { value: '', label: 'Semua Fungsi' },\n    { value: 'daun', label: 'Daun (Pertumbuhan)' },\n    { value: 'akar', label: 'Akar (Awal Tanam)' },\n    { value: 'batang', label: 'Batang (Pertumbuhan)' },\n    { value: 'bunga', label: 'Bunga (Pembuahan)' },\n    { value: 'buah', label: 'Buah (Pembuahan/Pembesaran)' }\n  ];`
);

code = code.replace(
  /setSearchParams\(\{ tanaman: tanamanInput, hst: parseInt\(hstInput, 10\) \}\);/,
  `setSearchParams({ tanaman: tanamanInput, hst: parseInt(hstInput, 10), fungsi: fungsiInput });`
);

code = code.replace(
  /setSearchParams\(\{ tanaman: '', hst: -1 \}\);/,
  `setFungsiInput('');\n    setSearchParams({ tanaman: '', hst: -1, fungsi: '' });`
);

code = code.replace(
  /return searchParams\.hst >= p\.minHst && searchParams\.hst <= p\.maxHst;/,
  `let matchHst = searchParams.hst >= p.minHst && searchParams.hst <= p.maxHst;\n      let matchFungsi = true;\n      if (searchParams.fungsi) {\n        const f = searchParams.fungsi;\n        const ket = p.keterangan.toLowerCase();\n        if (f === 'daun') {\n          matchFungsi = ket.includes('daun') || p.fase.includes('Vegetatif') || p.fase.includes('Semua Fase');\n        } else if (f === 'akar') {\n          matchFungsi = ket.includes('akar') || p.fase.includes('Dasar') || p.fase.includes('Vegetatif Awal') || p.fase.includes('Semua Fase');\n        } else if (f === 'batang') {\n          matchFungsi = ket.includes('batang') || p.fase.includes('Vegetatif') || p.fase.includes('Semua Fase');\n        } else if (f === 'bunga') {\n          matchFungsi = ket.includes('bunga') || p.fase.includes('Generatif Awal') || p.fase.includes('Generatif') || p.fase.includes('Semua Fase');\n        } else if (f === 'buah') {\n          matchFungsi = ket.includes('buah') || p.fase.includes('Generatif') || p.fase.includes('Semua Fase');\n        }\n      }\n      return matchHst && matchFungsi;`
);

code = code.replace(
  /<div className="w-full md:w-48">\n\s*<label className="block text-sm font-bold text-on-surface-muted mb-1">Umur HST<\/label>/,
  `<div className="w-full md:w-48">\n          <label className="block text-sm font-bold text-on-surface-muted mb-1">Fungsi Pupuk</label>\n          <div className="relative">\n            <select \n              value={fungsiInput}\n              onChange={(e) => setFungsiInput(e.target.value)}\n              className="w-full bg-surface-high neo-border-thin px-4 py-3 text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-2 focus:ring-action transition-all appearance-none cursor-pointer"\n            >\n              {FUNGSI_OPTIONS.map(opt => (\n                <option key={opt.value} value={opt.value}>{opt.label}</option>\n              ))}\n            </select>\n            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none">expand_more</span>\n          </div>\n        </div>\n        <div className="w-full md:w-32">\n          <label className="block text-sm font-bold text-on-surface-muted mb-1">Umur HST</label>`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
