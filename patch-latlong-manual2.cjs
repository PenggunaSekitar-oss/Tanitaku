const fs = require('fs');
let pemantauan = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');

// Use string replacement for initialFormBlok
pemantauan = pemantauan.replace(
  "const initialFormBlok = { nama: '', jumlahBedengan: 0, panjangBedengan: 0, lebarBedengan: 1, jarakAntarBedengan: 0.5, catatan: '', latitude: -6.200000, longitude: 106.816666 };",
  "const initialFormBlok = { nama: '', jumlahBedengan: 0, panjangBedengan: 0, lebarBedengan: 1, jarakAntarBedengan: 0.5, catatan: '' };"
);

const idx = pemantauan.indexOf('Latitude</label>');
if (idx !== -1) {
    const gridDiv = pemantauan.lastIndexOf('<div className="grid grid-cols-2 gap-4">', idx);
    if (gridDiv !== -1) {
        const endGrid = pemantauan.indexOf('<div>\n                <label className="block text-sm font-bold text-on-surface-muted mb-1">Catatan Tambahan</label>', gridDiv);
        
        if (endGrid !== -1) {
            pemantauan = pemantauan.slice(0, gridDiv) + pemantauan.slice(endGrid);
        }
    }
}
fs.writeFileSync('src/views/PemantauanView.tsx', pemantauan);
