const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /export function CariPupukView\(\) \{[\s\S]*?return \(/m,
  `export function CariPupukView() {
  const [tanamanInput, setTanamanInput] = useState('');
  const [hstInput, setHstInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({ tanaman: '', hst: -1 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanamanInput || !hstInput) return;
    setSearchParams({ tanaman: tanamanInput, hst: parseInt(hstInput, 10) });
    setHasSearched(true);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setTanamanInput('');
    setHstInput('');
    setSearchParams({ tanaman: '', hst: -1 });
  };

  const filteredPupuk = useMemo(() => {
    if (!hasSearched) return [];
    return PUPUK_DB.filter(p => {
      return searchParams.hst >= p.minHst && searchParams.hst <= p.maxHst;
    });
  }, [hasSearched, searchParams]);

  return (`
);

code = code.replace(
  /<div className="neo-card p-4 flex flex-col md:flex-row gap-4 items-end bg-surface">[\s\S]*?<\/div>\s*<\/div>\s*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">[\s\S]*?\{filteredPupuk\.length === 0 \? \(/m,
  `<form onSubmit={handleSearch} className="neo-card p-6 flex flex-col md:flex-row gap-4 items-end bg-surface">
        <div className="w-full md:flex-1">
          <label className="block text-sm font-bold text-on-surface-muted mb-1">Jenis Tanaman</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted">grass</span>
            <input 
              type="text" 
              value={tanamanInput}
              onChange={(e) => setTanamanInput(e.target.value)}
              required
              className="w-full bg-surface-high neo-border-thin pl-12 pr-4 py-3 text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-2 focus:ring-action transition-all"
              placeholder="Contoh: Sawi, Cabai, Tomat..."
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-bold text-on-surface-muted mb-1">Umur HST</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted text-lg">calendar_today</span>
            <input 
              type="number" 
              value={hstInput}
              onChange={(e) => setHstInput(e.target.value)}
              required
              min="0"
              className="w-full bg-surface-high neo-border-thin pl-12 pr-4 py-3 text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-2 focus:ring-action transition-all"
              placeholder="Contoh: 6"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full md:w-auto min-h-[48px] bg-action text-on-action font-bold px-6 py-3 rounded-[8px_3px_8px_3px] neo-border-thin shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          Cari Pupuk
        </button>
      </form>

      {hasSearched && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-xl text-on-surface">
            Rekomendasi untuk <span className="text-action capitalize">{searchParams.tanaman}</span> umur <span className="bg-primary text-white px-2 py-0.5 rounded neo-border-thin">{searchParams.hst} HST</span>
          </h2>
          <button onClick={resetSearch} className="text-sm font-bold text-danger hover:underline">
            Reset Pencarian
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!hasSearched ? (
          <div className="col-span-full neo-card p-12 text-center flex flex-col items-center gap-4 border-dashed bg-surface/50">
            <span className="material-symbols-outlined text-6xl text-on-surface-muted/50">compost</span>
            <p className="text-on-surface-muted font-bold text-xl">Mulai Pencarian Pupuk</p>
            <p className="text-sm text-on-surface-muted/70 max-w-md">Masukkan jenis tanaman dan umur HST (Hari Setelah Tanam) untuk melihat rekomendasi pupuk yang paling cocok untuk fase pertumbuhan saat ini.</p>
          </div>
        ) : filteredPupuk.length === 0 ? (`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
