const fs = require('fs');

let pemantauan = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');
pemantauan = pemantauan.replace(/latitude: -6\.200000, longitude: 106\.816666/, '');
pemantauan = pemantauan.replace(/,  \};/g, ' };');
pemantauan = pemantauan.replace(/const initialFormBlok = \{ nama: '', jumlahBedengan: 0, panjangBedengan: 0, lebarBedengan: 1, jarakAntarBedengan: 0\.5, catatan: '',  \};/, 'const initialFormBlok = { nama: \'\', jumlahBedengan: 0, panjangBedengan: 0, lebarBedengan: 1, jarakAntarBedengan: 0.5, catatan: \'\' };');

// Also need to remove the inputs from PemantauanView
const latLongSectionRegex = /<div>\s*<label className="block text-sm font-bold text-on-surface-muted mb-1">Latitude<\/label>\s*<NumberInput[^>]*\/>\s*<\/div>\s*<div>\s*<label className="block text-sm font-bold text-on-surface-muted mb-1">Longitude<\/label>\s*<NumberInput[^>]*\/>\s*<\/div>/g;
pemantauan = pemantauan.replace(latLongSectionRegex, '');

// The grid containing latitude and longitude might be a grid-cols-2. Let's make sure it's clean.
// I'll just check if it's there.
fs.writeFileSync('src/views/PemantauanView.tsx', pemantauan);

let taniops = fs.readFileSync('src/context/TaniOpsContext.tsx', 'utf-8');
taniops = taniops.replace(/ latitude\?: number; longitude\?: number;/, '');
fs.writeFileSync('src/context/TaniOpsContext.tsx', taniops);
