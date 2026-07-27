const fs = require('fs');

let bibit = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

const moreVarieties = `
  // CABAI RAWIT MERAH TAMBAHAN
  { komoditas: 'Cabai Rawit Merah', nama: 'Sret', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat lebat, tahan layu fusarium, pedas menyengat.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Pilar F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Toleran virus kuning, sangat genjah, tahan rontok bunga.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Mhanu F1', produsen: 'Mutiara Bumi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe buah menggantung, produksi tinggi, warna merah menyala.' },

  // CABAI MERAH KERITING TAMBAHAN
  { komoditas: 'Cabai Merah Keriting', nama: 'Iggo', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran penyakit layu bakteri dan antraknosa (patek).' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Tangguh F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan patek (antraknosa), daya simpan kuat, tahan jarak jauh.' },
  
  // CABAI BESAR TAMBAHAN
  { komoditas: 'Cabai Merah Besar', nama: 'Horison 97 F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran buah sangat besar dan seragam, daging buah keras.' },

  // SAYURAN DAUN TAMBAHAN
  { komoditas: 'Bayam Cabut', nama: 'Maestro', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Daun hijau cerah tanpa bintik merah, lambat berbunga, genjah.' },
  { komoditas: 'Bayam Merah', nama: 'Clara', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Daun merah merata, rasa tidak berserat, tinggi antosianin.' },
  { komoditas: 'Bayam', nama: 'Baret Merah', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna merah hati terang, vigor tegak, genjah.' },
  
  // KACANG-KACANGAN TAMBAHAN
  { komoditas: 'Edamame', nama: 'Ryokko', produsen: 'Takii Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Polong besar, isi 3 per polong, rasa manis khas edamame.' },
  { komoditas: 'Kacang Tanah', nama: 'Kelinci', produsen: 'Lokal', ketinggian: ['Rendah'], keunggulan: 'Polong besar, biji bernas, toleran penyakit karat daun.' },
  { komoditas: 'Kacang Merah', nama: 'Red Kidney', produsen: 'Known-You Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Hasil tinggi, adaptasi baik di dataran tinggi, biji besar.' },

  // BUAH-BUAHAN TAMBAHAN
  { komoditas: 'Pepaya', nama: 'California', produsen: 'Lokal/IPB', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah ukuran pas untuk konsumsi, daging manis, warna merah cerah.' },
  { komoditas: 'Pepaya', nama: 'Red Lady F1', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus ring spot (PRSV), buah lonjong besar, produktif.' },
  
  // UMBI-UMBIAN
  { komoditas: 'Wortel', nama: 'Kuroda', produsen: 'Takii Seed', ketinggian: ['Tinggi'], keunggulan: 'Umbi panjang dan lurus, warna oranye kemerahan tajam, tidak berkayu.' },
  { komoditas: 'Wortel', nama: 'Gundaling', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Cocok di dataran sangat tinggi, daya simpan tinggi, ujung umbi tumpul.' },
  { komoditas: 'Kentang', nama: 'Granola', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Varietas kentang sayur paling populer, umbi oval kuning, hasil stabil.' },
  { komoditas: 'Kentang', nama: 'Atlantik', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Kentang khusus industri (keripik), kandungan air rendah, umbi bulat.' }
`;

bibit = bibit.replace(
  '];',
  moreVarieties + '\n];'
);

fs.writeFileSync('src/views/CariBibitView.tsx', bibit);
