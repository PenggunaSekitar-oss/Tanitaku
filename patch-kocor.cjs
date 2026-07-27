const fs = require('fs');
let c = fs.readFileSync('src/views/KocorView.tsx', 'utf-8');
c = c.replace(
  /<div className="flex flex-col gap-1 w-full">[\s\S]*?<\/p>\s*<\/div>/,
  `<PageHeader title="Kalkulator Kocor" subtitle="Hitung kebutuhan dosis pupuk atau pestisida untuk dikocor." />`
);
fs.writeFileSync('src/views/KocorView.tsx', c);
