const fs = require('fs');

// CariBibitView
let bibit = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');
bibit = bibit.replace(
  "const [hasSearched, setHasSearched] = useState(false);",
  "const [hasSearched, setHasSearched] = useState(false);\n  const [isSearching, setIsSearching] = useState(false);"
);
bibit = bibit.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{[\s\S]*?setResults\(filtered\);\n  \};/,
  `const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setHasSearched(true);
      
      const query = komoditas.trim().toLowerCase();
      
      const filtered = CATALOG.filter(item => {
        const matchesKomoditas = query ? item.komoditas.toLowerCase().includes(query) : true;
        const matchesKetinggian = item.ketinggian.includes(ketinggian);
        const matchesCuaca = cuaca === 'Semua' ? true : item.cuaca.includes(cuaca);
        
        return matchesKomoditas && matchesKetinggian && matchesCuaca;
      });
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };`
);
bibit = bibit.replace(
  /<button type="submit" className="flex-1 bg-action text-on-action font-bold min-h-\[56px\] rounded-\[16px\] hover:opacity-90 transition shadow-\[3px_3px_0px_0px_#000\] active:shadow-\[1px_1px_0px_0px_#000\] active:translate-y-\[2px\] active:translate-x-\[2px\]">[\s\S]*?<\/button>/,
  `<button type="submit" disabled={isSearching} className="flex-1 bg-action text-on-action font-bold min-h-[56px] rounded-[16px] hover:opacity-90 transition shadow-[3px_3px_0px_0px_#000] active:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] disabled:opacity-70 flex items-center justify-center gap-2">
              {isSearching ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
              {isSearching ? "MEMPROSES..." : "CARI REKOMENDASI"}
            </button>`
);
fs.writeFileSync('src/views/CariBibitView.tsx', bibit);

// CariPenyakitView
let penyakit = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');
penyakit = penyakit.replace(
  "const [hasSearched, setHasSearched] = useState(false);",
  "const [hasSearched, setHasSearched] = useState(false);\n  const [isSearching, setIsSearching] = useState(false);"
);
penyakit = penyakit.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{[\s\S]*?setResults\(filtered\);\n  \};/,
  `const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setHasSearched(true);
      
      let filtered = PENYAKIT_CATALOG;

      if (tanamanInput !== 'Semua') {
        filtered = filtered.filter(item => item.tanaman.some(t => t === tanamanInput || t.includes(tanamanInput)));
      }

      if (penyakitInput) {
        filtered = filtered.filter(item => item.nama === penyakitInput);
      }

      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };`
);
penyakit = penyakit.replace(
  /<button type="submit" className="flex-1 bg-action text-on-action font-bold min-h-\[48px\] rounded-\[8px_3px_8px_3px\] hover:opacity-90 transition neo-shadow-sm active:shadow-\[0px_0px_0px_0px_#000\] active:translate-y-\[3px\] active:translate-x-\[3px\] neo-border-thin">[\s\S]*?<\/button>/,
  `<button type="submit" disabled={isSearching} className="flex-1 bg-action text-on-action font-bold min-h-[48px] rounded-[8px_3px_8px_3px] hover:opacity-90 transition neo-shadow-sm active:shadow-[0px_0px_0px_0px_#000] active:translate-y-[3px] active:translate-x-[3px] neo-border-thin disabled:opacity-70 flex items-center justify-center gap-2">
              {isSearching ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
              {isSearching ? "MEMPROSES..." : "IDENTIFIKASI"}
            </button>`
);
fs.writeFileSync('src/views/CariPenyakitView.tsx', penyakit);

// CariPestisidaView
let pestisida = fs.readFileSync('src/views/CariPestisidaView.tsx', 'utf-8');
pestisida = pestisida.replace(
  "const [hasSearched, setHasSearched] = useState(false);",
  "const [hasSearched, setHasSearched] = useState(false);\n  const [isSearching, setIsSearching] = useState(false);"
);
pestisida = pestisida.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{[\s\S]*?setResults\(filtered\);\n  \};/,
  `const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setHasSearched(true);
      
      if (!hamaInput) {
        setResults(PESTISIDA_CATALOG);
        setIsSearching(false);
        return;
      }

      const filtered = PESTISIDA_CATALOG.filter(item => item.sasaran.includes(hamaInput));
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };`
);
pestisida = pestisida.replace(
  /<button type="submit" className="flex-1 md:w-48 bg-action text-on-action font-bold min-h-\[48px\] px-6 rounded-\[8px_3px_8px_3px\] hover:opacity-90 transition neo-shadow-sm active:shadow-\[0px_0px_0px_0px_#000\] active:translate-y-\[3px\] active:translate-x-\[3px\] neo-border-thin">[\s\S]*?<\/button>/,
  `<button type="submit" disabled={isSearching} className="flex-1 md:w-48 bg-action text-on-action font-bold min-h-[48px] px-6 rounded-[8px_3px_8px_3px] hover:opacity-90 transition neo-shadow-sm active:shadow-[0px_0px_0px_0px_#000] active:translate-y-[3px] active:translate-x-[3px] neo-border-thin disabled:opacity-70 flex items-center justify-center gap-2">
              {isSearching ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
              {isSearching ? "MEMPROSES..." : "CARI"}
            </button>`
);
fs.writeFileSync('src/views/CariPestisidaView.tsx', pestisida);

