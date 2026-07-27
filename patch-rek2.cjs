const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

code = code.replace(
  "function RekomendasiTanamanItem({ t, blokLahan, navigate }: any) {",
  "function RekomendasiTanamanItem({ t, blokLahan, navigate, onClose }: any) {"
);

code = code.replace(
  "if (navigate) navigate('cari-pestisida');",
  "if (onClose) onClose();\n                if (navigate) navigate('cari-pestisida');"
);

code = code.replace(
  /<RekomendasiTanamanItem key=\{t\.id\} t=\{t\} blokLahan=\{blokLahan\} navigate=\{navigate\} \/>/g,
  `<RekomendasiTanamanItem key={t.id} t={t} blokLahan={blokLahan} navigate={navigate} onClose={() => setShowRekomendasi(false)} />`
);

fs.writeFileSync('src/views/DashboardView.tsx', code);
