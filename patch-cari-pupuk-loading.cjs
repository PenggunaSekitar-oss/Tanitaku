const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /const \[hasSearched, setHasSearched\] = useState\(false\);/,
  `const [hasSearched, setHasSearched] = useState(false);\n  const [isSearching, setIsSearching] = useState(false);`
);

code = code.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{[\s\S]*?setHasSearched\(true\);\n  \};/,
  `const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanamanInput || !hstInput) return;
    
    setIsSearching(true);
    setHasSearched(false);
    
    setTimeout(() => {
      setSearchParams({ tanaman: tanamanInput, hst: parseInt(hstInput, 10), fungsi: fungsiInput });
      setHasSearched(true);
      setIsSearching(false);
    }, 600);
  };`
);

code = code.replace(
  /<button \n          type="submit"\n          className="w-full md:w-auto min-h-\[48px\] bg-action text-on-action font-bold px-6 py-3 rounded-\[8px_3px_8px_3px\] neo-border-thin shadow-\[3px_3px_0px_0px_#000\] hover:-translate-y-0\.5 hover:shadow-\[4px_4px_0px_0px_#000\] transition-all flex items-center justify-center gap-2"\n        >\n          <span className="material-symbols-outlined text-lg">search<\/span>\n          Cari Pupuk\n        <\/button>/,
  `<button 
          type="submit"
          disabled={isSearching}
          className="w-full md:w-auto min-h-[48px] bg-action text-on-action font-bold px-6 py-3 rounded-[8px_3px_8px_3px] neo-border-thin shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_#000] disabled:cursor-not-allowed"
        >
          {isSearching ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : <span className="material-symbols-outlined text-lg">search</span>}
          {isSearching ? "MEMPROSES..." : "CARI PUPUK"}
        </button>`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
