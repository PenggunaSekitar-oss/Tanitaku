const fs = require('fs');

let bibit = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

bibit = bibit.replace(
  "{ komoditas: 'Kangkung', nama: 'Serimpi', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Vigor kuat, tahan bercak daun, panen serempak.' }\n  // CABAI RAWIT MERAH TAMBAHAN",
  "{ komoditas: 'Kangkung', nama: 'Serimpi', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Vigor kuat, tahan bercak daun, panen serempak.' },\n  // CABAI RAWIT MERAH TAMBAHAN"
);

fs.writeFileSync('src/views/CariBibitView.tsx', bibit);
