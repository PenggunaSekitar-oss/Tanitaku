const fs = require('fs');
let code = fs.readFileSync('src/context/TaniOpsContext.tsx', 'utf-8');

code = code.replace(
  "jumlahTanaman: number;\n  catatan: string; \n};",
  "jumlahTanaman: number;\n  catatan: string;\n  status?: 'Aktif' | 'Panen';\n};"
);

fs.writeFileSync('src/context/TaniOpsContext.tsx', code);
