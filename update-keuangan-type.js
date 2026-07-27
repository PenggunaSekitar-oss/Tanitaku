import fs from 'fs';

let content = fs.readFileSync('src/context/TaniOpsContext.tsx', 'utf-8');
content = content.replace(/hargaJual: number\s*\n\};/, "hargaJual: number;\n  komoditas?: string;\n};");
fs.writeFileSync('src/context/TaniOpsContext.tsx', content);
