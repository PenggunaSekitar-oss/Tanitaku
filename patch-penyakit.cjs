const fs = require('fs');
let code = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

code = code.replace(
  /\{results\.map\(\(item, idx\) => \(\n\s*<div key=\{idx\} className="neo-card-small p-0 bg-surface flex flex-col sm:flex-row overflow-hidden relative">/,
  `{results.map((item, idx) => (\n                <div key={idx} className="neo-card-small p-0 bg-surface flex flex-col sm:flex-row overflow-hidden relative">\n                  {idx === 0 && (\n                    <div className="absolute top-3 left-3 sm:left-auto sm:right-3 bg-action text-on-action font-black text-[10px] px-3 py-1 rounded-full neo-border-thin shadow-[2px_2px_0px_0px_#000] z-20 flex items-center gap-1">\n                      <span className="material-symbols-outlined text-[14px]">star</span>\n                      REKOMENDASI UTAMA\n                    </div>\n                  )}`
);

fs.writeFileSync('src/views/CariPenyakitView.tsx', code);
