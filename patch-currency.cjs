const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

code = code.replace(
  "const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);",
  "const formatCurrency = (val: number) => val < 0 ? '-Rp ' + Math.abs(val).toLocaleString('id-ID') : 'Rp ' + val.toLocaleString('id-ID');"
);

fs.writeFileSync('src/views/KeuanganView.tsx', code);
