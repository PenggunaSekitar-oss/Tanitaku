const fs = require('fs');
let code = fs.readFileSync('src/views/CariPupukView.tsx', 'utf-8');

code = code.replace(
  /filteredPupuk\.map\(pupuk => \(\n\s*<div key=\{pupuk\.id\} className="neo-card flex flex-col hover:-translate-y-1 transition-transform duration-200">/,
  `filteredPupuk.map((pupuk, idx) => (\n            <div key={pupuk.id} className="neo-card flex flex-col hover:-translate-y-1 transition-transform duration-200 relative">\n              {idx === 0 && (\n                <div className="absolute -top-3 -right-3 bg-action text-on-action font-black text-[10px] px-3 py-1 rounded-full neo-border-thin shadow-[2px_2px_0px_0px_#000] z-10 flex items-center gap-1">\n                  <span className="material-symbols-outlined text-[14px]">star</span>\n                  REKOMENDASI UTAMA\n                </div>\n              )}`
);

fs.writeFileSync('src/views/CariPupukView.tsx', code);
