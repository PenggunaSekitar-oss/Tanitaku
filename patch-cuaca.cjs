const fs = require('fs');

let content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

// Replace the Image Helper with Icon Helper
const iconHelper = `
const getIconForKomoditas = (komoditas: string) => {
  const k = komoditas.toLowerCase();
  if (k.includes('cabai')) return 'local_fire_department';
  if (k.includes('tomat') || k.includes('melon') || k.includes('semangka') || k.includes('pepaya')) return 'lens';
  if (k.includes('bawang') || k.includes('jagung')) return 'grass';
  if (k.includes('kubis') || k.includes('kol') || k.includes('sawi') || k.includes('pakcoy') || k.includes('selada') || k.includes('kangkung') || k.includes('bayam')) return 'eco';
  if (k.includes('wortel') || k.includes('kentang')) return 'spa';
  return 'local_florist';
};
`;

content = content.replace(/const getImageForKomoditas = \([\s\S]*?\};\n/, iconHelper);

// Update CATALOG with cuaca property. We'll do a simple regex replace to add cuaca based on keywords in keunggulan, or default to both.
content = content.replace(/\{ komoditas: (.*?), nama: (.*?), produsen: (.*?), ketinggian: (.*?), keunggulan: (.*?), kekurangan: (.*?) \}/g, (match, kom, nama, prod, ket, keu, kek) => {
  let cuaca = "['Hujan', 'Kemarau']";
  const text = (keu + " " + kek).toLowerCase();
  if (text.includes('kemarau') && !text.includes('hujan')) {
    cuaca = "['Kemarau']";
  } else if (text.includes('hujan') && !text.includes('kemarau')) {
    cuaca = "['Hujan']";
  }
  return `{ komoditas: ${kom}, nama: ${nama}, produsen: ${prod}, ketinggian: ${ket}, cuaca: ${cuaca}, keunggulan: ${keu}, kekurangan: ${kek} }`;
});

// Update the imports and component state
content = content.replace("const ELEVATION_OPTIONS = [", `const CUACA_OPTIONS = [
  { value: 'Semua', label: 'Semua Musim' },
  { value: 'Hujan', label: 'Musim Hujan' },
  { value: 'Kemarau', label: 'Musim Kemarau' }
];

const ELEVATION_OPTIONS = [`);

content = content.replace("const [ketinggian, setKetinggian] = useState('Rendah');", "const [ketinggian, setKetinggian] = useState('Rendah');\n  const [cuaca, setCuaca] = useState('Semua');");

content = content.replace(
  "const matchesKetinggian = item.ketinggian.includes(ketinggian);",
  "const matchesKetinggian = item.ketinggian.includes(ketinggian);\n      const matchesCuaca = cuaca === 'Semua' ? true : item.cuaca.includes(cuaca);"
);

content = content.replace(
  "return matchesKomoditas && matchesKetinggian;",
  "return matchesKomoditas && matchesKetinggian && matchesCuaca;"
);

// Add reset handler
const resetHandler = `
  const handleReset = () => {
    setLokasi('');
    setKomoditas('');
    setKetinggian('Rendah');
    setCuaca('Semua');
    setHasSearched(false);
    setResults([]);
  };
`;

content = content.replace("const handleSearch = (e: React.FormEvent) => {", resetHandler + "\n  const handleSearch = (e: React.FormEvent) => {");

// Update the Form to include cuaca dropdown and reset button
const oldFormFields = `<div className="flex flex-col">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Topografi / Ketinggian</label>
            <Select 
              options={ELEVATION_OPTIONS} 
              value={ketinggian} 
              onChange={(val) => setKetinggian(val)} 
              className="w-full"
            />
          </div>
          <div className="md:col-span-3 pt-2">
            <button type="submit" className="w-full bg-action text-black font-bold min-h-[56px] rounded-[16px] hover:opacity-90 transition shadow-lg shadow-action/20">
              CARI REKOMENDASI BIBIT
            </button>
          </div>`;

const newFormFields = `<div className="flex flex-col">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Topografi / Ketinggian</label>
            <Select 
              options={ELEVATION_OPTIONS} 
              value={ketinggian} 
              onChange={(val) => setKetinggian(val)} 
              className="w-full"
            />
          </div>
          <div className="flex flex-col md:col-span-3 lg:col-span-1">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Kondisi Cuaca</label>
            <Select 
              options={CUACA_OPTIONS} 
              value={cuaca} 
              onChange={(val) => setCuaca(val)} 
              className="w-full"
            />
          </div>
          <div className="md:col-span-3 lg:col-span-4 pt-2 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 bg-action text-black font-bold min-h-[56px] rounded-[16px] hover:opacity-90 transition shadow-[3px_3px_0px_0px_#000] active:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px]">
              CARI REKOMENDASI
            </button>
            <button type="button" onClick={handleReset} className="sm:w-32 bg-surface-high border-2 border-outline text-on-surface font-bold min-h-[56px] rounded-[16px] hover:bg-surface transition">
              RESET
            </button>
          </div>`;

// Note: Need to change grid cols to 4 if we want them in one row or keep it 3.
// Currently it is `<form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">`
content = content.replace('className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"', 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start"');

content = content.replace(oldFormFields, newFormFields);

// Remove image in the results render, add icon
const oldCardRender = `<div key={idx} className="neo-card-small p-0 bg-surface flex flex-col overflow-hidden">
                  <img 
                    src={getImageForKomoditas(item.komoditas)} 
                    alt={item.komoditas} 
                    className="w-full h-32 object-cover border-b-2 border-black"
                  />
                  <div className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-brutal font-black text-lg text-action uppercase tracking-wider">{item.nama}</h4>
                        <p className="text-xs font-mono text-on-surface-muted mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                      </div>
                    </div>`;

const newCardRender = `<div key={idx} className="neo-card-small p-4 bg-surface flex flex-col gap-3 h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-brutal font-black text-lg text-action uppercase tracking-wider">{item.nama}</h4>
                      <p className="text-xs font-mono text-on-surface-muted mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                    </div>
                    <span className="material-symbols-outlined text-action bg-action/10 p-2 rounded-lg text-[24px]">
                      {getIconForKomoditas(item.komoditas)}
                    </span>
                  </div>`;
                  
content = content.replace(oldCardRender, newCardRender);

// Need to fix the closing tags since we removed `<div className="p-4 flex flex-col gap-3 h-full">`
const oldCardEnd = `</p>
                    </div>
                  </div>
                  </div>
                </div>`;
const newCardEnd = `</p>
                    </div>
                  </div>
                </div>`;
                
content = content.replace(oldCardEnd, newCardEnd);

fs.writeFileSync('src/views/CariBibitView.tsx', content);
