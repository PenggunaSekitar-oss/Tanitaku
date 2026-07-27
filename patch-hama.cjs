const fs = require('fs');
let c = fs.readFileSync('src/views/JenisHamaView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Jenis Hama" subtitle="Ensiklopedia hama pertanian di Indonesia beserta cara pembasmiannya." />`
);
fs.writeFileSync('src/views/JenisHamaView.tsx', c);
