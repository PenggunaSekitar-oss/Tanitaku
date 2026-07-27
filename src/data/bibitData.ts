export interface BibitItem {
  nama: string;
  produsen: string;
  komoditas: string;
  deskripsi: string;
  keunggulan: string[];
  potensiHasil: string;
  umurPanen: string;
  rekomendasiDataran: string;
  harga?: string;
  kekurangan?: string;
  ketinggian?: string[];
  cuaca?: string[];
}

export function getBibitDetails(item: BibitItem): {
  harga: string;
  kekurangan: string;
  keunggulanText: string;
} {
  let harga = item.harga;
  let kekurangan = item.kekurangan;
  const keunggulanText = Array.isArray(item.keunggulan) ? item.keunggulan.join(', ') : item.keunggulan;

  if (!harga) {
    const kom = item.komoditas.toLowerCase();
    if (kom.includes('cabai rawit')) {
      harga = 'Rp 115.000 - Rp 140.000 / Kemasan 10 Gram (± 2.000 Biji)';
    } else if (kom.includes('cabai merah') || kom.includes('cabai besar')) {
      harga = 'Rp 125.000 - Rp 155.000 / Kemasan 10 Gram (± 2.000 Biji)';
    } else if (kom.includes('tomat')) {
      harga = 'Rp 90.000 - Rp 130.000 / Kemasan 5 Gram (± 1.500 Biji)';
    } else if (kom.includes('terong')) {
      harga = 'Rp 75.000 - Rp 105.000 / Kemasan 10 Gram (± 2.500 Biji)';
    } else if (kom.includes('bawang')) {
      harga = 'Rp 380.000 - Rp 480.000 / Kemasan 50 Gram (Biji TSS)';
    } else if (kom.includes('mentimun')) {
      harga = 'Rp 85.000 - Rp 110.000 / Kemasan 20 Gram (± 800 Biji)';
    } else if (kom.includes('melon') || kom.includes('semangka')) {
      harga = 'Rp 140.000 - Rp 195.000 / Kemasan 20 Gram (± 500 Biji)';
    } else if (kom.includes('jagung')) {
      harga = 'Rp 95.000 - Rp 135.000 / Kantong 1 kg (Hibrida F1)';
    } else if (kom.includes('padi')) {
      harga = 'Rp 75.000 - Rp 110.000 / Kantong 5 kg (Label Biru)';
    } else if (kom.includes('kubis') || kom.includes('brokoli')) {
      harga = 'Rp 110.000 - Rp 160.000 / Kemasan 15 Gram';
    } else if (kom.includes('sawi') || kom.includes('caisim') || kom.includes('kangkung') || kom.includes('bayam')) {
      harga = 'Rp 35.000 - Rp 55.000 / Kaleng/Kemasan 500 Gram';
    } else if (kom.includes('kacang') || kom.includes('buncis')) {
      harga = 'Rp 55.000 - Rp 85.000 / Kemasan 500 Gram';
    } else {
      harga = 'Rp 85.000 - Rp 125.000 / Kemasan Standar Produsen';
    }
  }

  if (!kekurangan) {
    const kom = item.komoditas.toLowerCase();
    if (kom.includes('cabai')) {
      kekurangan = 'Memerlukan pemupukan kalsium & kalium tinggi di fase pembentukan buah agar terhindar dari patek/busuk ujung.';
    } else if (kom.includes('tomat') || kom.includes('terong')) {
      kekurangan = 'Rentan layu bakteri jika drainase lahan kurang optimal; wajib dipasang turus/ajir yang kokoh.';
    } else if (kom.includes('bawang')) {
      kekurangan = 'Sensitif kelembaban tinggi berlebih; utamakan parit drainase dalam untuk mengantisipasi trotol/mboler.';
    } else if (kom.includes('melon') || kom.includes('semangka') || kom.includes('mentimun')) {
      kekurangan = 'Memerlukan perempelan tunas air rutin dan rotasi fungisida pencegah embun bulu saat musim hujan.';
    } else if (kom.includes('padi') || kom.includes('jagung')) {
      kekurangan = 'Lakukan perlakuan benih (seed treatment) sebelum sebar untuk mengantisipasi serangga perusak awal.';
    } else {
      kekurangan = 'Pemeliharaan sanitasi lingkungan lahan secara berkala sangat disarankan.';
    }
  }

  return {
    harga,
    kekurangan,
    keunggulanText
  };
}

export const KOMODITAS_OPTIONS = [
  'Semua Komoditas',
  'Cabai Rawit',
  'Cabai Merah Keriting',
  'Cabai Besar',
  'Tomat',
  'Terong',
  'Bawang Merah',
  'Mentimun',
  'Melon',
  'Semangka',
  'Jagung',
  'Padi',
  'Kubis & Brokoli',
  'Sawi & Caisim',
  'Kacang Panjang & Buncis',
  'Kangkung & Bayam',
  'Buah & Horti Lainnya'
];

export const BIBIT_CATALOG: BibitItem[] = [
  // 1 - 20: CABAI RAWIT
  {
    nama: 'Ori 212',
    produsen: 'Aura Seed',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Varietas cabai rawit menggantung tahan virus kriting.',
    keunggulan: ['Tahan Virus Gemini', 'Buah lebat dan keras', 'Tahan simpan jauh'],
    potensiHasil: '18 - 22 Ton / Ha',
    umurPanen: '85 - 90 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Kaliber',
    produsen: 'Wijoyo Seed',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Cabai rawit putih berubah merah menyala favorit petani.',
    keunggulan: ['Tahan antraknosa / patek', 'Buah sangat lebat', 'Percabangan banyak'],
    potensiHasil: '16 - 20 Ton / Ha',
    umurPanen: '85 - 95 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Bara',
    produsen: 'PT East West Seed Indonesia (Cap Panah Merah)',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Cabai rawit non-hibrida sangat pedas, toleran layu bakteri.',
    keunggulan: ['Sangat pedas', 'Toleran layu bakteri', 'Populer di seluruh Indonesia'],
    potensiHasil: '12 - 15 Ton / Ha',
    umurPanen: '75 - 85 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Pelita 8 F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Cabai rawit hibrida tipe tegak, buah berwarna putih kehijauan kemudian merah.',
    keunggulan: ['Buah lebat serentak', 'Toleran layu bakteri', 'Cocok untuk pasar lokal'],
    potensiHasil: '15 - 18 Ton / Ha',
    umurPanen: '75 - 80 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Dewata 8 F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Cabai rawit hibrida buah putih kekuningan beralih merah terang.',
    keunggulan: ['Sangat genjah', 'Toleran layu bakteri', 'Buah lebat & padat'],
    potensiHasil: '15 - 18 Ton / Ha',
    umurPanen: '70 - 75 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Shypoon F1',
    produsen: 'Halbanero',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Rawit tahan virus mengkriting dengan kulit buah tebal.',
    keunggulan: ['Tahan Gemini Virus', 'Tahan simpan & angkut', 'Pedas membakar'],
    potensiHasil: '18 - 25 Ton / Ha',
    umurPanen: '90 - 100 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Taruna F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Cabai rawit tegak vigor kuat dan tahan serangan hama.',
    keunggulan: ['Toleran patek', 'Buah lebat', 'Batang kokoh'],
    potensiHasil: '14 - 18 Ton / Ha',
    umurPanen: '80 - 85 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Dewata 43 F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Rawit putih mendatar tahan layu bakteri.',
    keunggulan: ['Panen cepat', 'Sangat genjah', 'Toleran kebasahan'],
    potensiHasil: '15 - 18 Ton / Ha',
    umurPanen: '70 - 75 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Rawit Sret',
    produsen: 'Lokal Unggul Jatim',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Rawit varietas lokal kualitas ekspor.',
    keunggulan: ['Kulit tebal', 'Pedas luar biasa', 'Tahan simpan'],
    potensiHasil: '12 - 16 Ton / Ha',
    umurPanen: '85 - 90 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Pilar F1',
    produsen: 'Cap Kapal Terbang (BISI)',
    komoditas: 'Cabai Rawit',
    deskripsi: 'Rawit hibrida tahan Gemini Virus paling direkomendasikan.',
    keunggulan: ['100% Tahan Virus Kuning', 'Buah lebat berurutan', 'Batang sangat besar'],
    potensiHasil: '20 - 25 Ton / Ha',
    umurPanen: '85 - 95 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  { nama: 'Mhanu F1', produsen: 'BISI', komoditas: 'Cabai Rawit', deskripsi: 'Rawit putih menggantung.', keunggulan: ['Tahan patek', 'Buah keras'], potensiHasil: '16-18 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Nirmala F1', produsen: 'Cap Panah Merah', komoditas: 'Cabai Rawit', deskripsi: 'Rawit hibrida tahan virus.', keunggulan: ['Tahan Gemini Virus', 'Buah lebat & padat'], potensiHasil: '18-20 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Saka F1', produsen: 'Tunas Senja', komoditas: 'Cabai Rawit', deskripsi: 'Rawit merunduk lebat.', keunggulan: ['Tahan keriting', 'Pengisian cepat'], potensiHasil: '18 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Sonar F1', produsen: 'Cap Kapal Terbang', komoditas: 'Cabai Rawit', deskripsi: 'Rawit putih tegak.', keunggulan: ['Layu bakteri tahan', 'Buah mulus'], potensiHasil: '15 Ton/Ha', umurPanen: '75 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Pusaka 18', produsen: 'Aura Seed', komoditas: 'Cabai Rawit', deskripsi: 'Rawit merah menyala.', keunggulan: ['Tahan simpan 10 hari', 'Kulit tebal'], potensiHasil: '17 Ton/Ha', umurPanen: '90 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Genie F1', produsen: 'Cap Panah Merah', komoditas: 'Cabai Rawit', deskripsi: 'Rawit hijau terang.', keunggulan: ['Pedas aromatis', 'Percabangan tajam'], potensiHasil: '14 Ton/Ha', umurPanen: '75 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Rawit Asmoro', produsen: 'Prabu Seed', komoditas: 'Cabai Rawit', deskripsi: 'Rawit putih menggantung.', keunggulan: ['Toleran virus', 'Buah panjang'], potensiHasil: '16 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Menengah' },
  { nama: 'Rawit Maruti', produsen: 'Bintang Asia', komoditas: 'Cabai Rawit', deskripsi: 'Rawit genjah.', keunggulan: ['Tahan cuaca kering', 'Mudah dirawat'], potensiHasil: '15 Ton/Ha', umurPanen: '75 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Rawit Preman', produsen: 'Halbanero', komoditas: 'Cabai Rawit', deskripsi: 'Rawit putih super pedas.', keunggulan: ['Buah sangat padat', 'Tahan patek'], potensiHasil: '20 Ton/Ha', umurPanen: '90 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Rawit Master F1', produsen: 'DGW', komoditas: 'Cabai Rawit', deskripsi: 'Rawit unggul DGW.', keunggulan: ['Pertumbuhan seragam', 'Banyak dompolan'], potensiHasil: '18 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },

  // 21 - 40: CABAI MERAH KERITING & CABAI BESAR
  {
    nama: 'Laba F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Merah Keriting',
    deskripsi: 'Cabai keriting hibrida tahan layu bakteri dan antraknosa.',
    keunggulan: ['Sangat lebat', 'Toleran layu bakteri', 'Tahan angkut jauh'],
    potensiHasil: '20 - 22 Ton / Ha',
    umurPanen: '80 - 85 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Lado F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Merah Keriting',
    deskripsi: 'Cabai keriting dataran tinggi, warna merah menyala mengkilap.',
    keunggulan: ['Ukuran buah panjang lentur', 'Sangat disukai pasar', 'Tahan penyakit daun'],
    potensiHasil: '18 - 22 Ton / Ha',
    umurPanen: '100 - 110 HST',
    rekomendasiDataran: 'Tinggi'
  },
  {
    nama: 'Akar F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Merah Keriting',
    deskripsi: 'Cabai keriting dataran rendah tahan patek dan Gemini virus.',
    keunggulan: ['Tahan Virus Kuning', 'Patek toleran', 'Buah tidak gampang busuk'],
    potensiHasil: '20 - 25 Ton / Ha',
    umurPanen: '85 - 90 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'OR Twist 42',
    produsen: 'Oriental Seed',
    komoditas: 'Cabai Merah Keriting',
    deskripsi: 'Cabai keriting buah sangat panjang dan mengkerut rapat.',
    keunggulan: ['Panjang buah 16-18 cm', 'Kerapatan keriting tinggi', 'Bobot tinggi'],
    potensiHasil: '18 - 20 Ton / Ha',
    umurPanen: '85 - 90 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Baja F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Besar',
    deskripsi: 'Cabai besar hibrida tahan layu bakteri dan Gemini Virus.',
    keunggulan: ['Tahan Virus Kuning', 'Buah sangat tebal', 'Tahan simpan lama'],
    potensiHasil: '25 - 30 Ton / Ha',
    umurPanen: '75 - 80 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Gada MK F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Cabai Besar',
    deskripsi: 'Cabai besar warna merah gelap mengkilap.',
    keunggulan: ['Buah lurus padat', 'Toleran layu bakteri', 'Pasar menghendaki'],
    potensiHasil: '22 - 28 Ton / Ha',
    umurPanen: '80 - 85 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  { nama: 'Lolai F1', produsen: 'BISI', komoditas: 'Cabai Merah Keriting', deskripsi: 'Cabai keriting tahan virus.', keunggulan: ['Buah kaku', 'Tahan simpan'], potensiHasil: '20 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Kastilo F1', produsen: 'Panah Merah', komoditas: 'Cabai Merah Keriting', deskripsi: 'Cabai keriting dataran tinggi.', keunggulan: ['Merah mengkilap', 'Panjang 16cm'], potensiHasil: '22 Ton/Ha', umurPanen: '100 HST', rekomendasiDataran: 'Tinggi' },
  { nama: 'Rimba F1', produsen: 'Panah Merah', komoditas: 'Cabai Merah Keriting', deskripsi: 'Cabai keriting sangat lebat.', keunggulan: ['Cabang aktif', 'Tahan patek'], potensiHasil: '21 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Sios Tavi F1', produsen: 'BISI', komoditas: 'Cabai Merah Keriting', deskripsi: 'Tahan Gemini Virus.', keunggulan: ['Tavi (Virus Tahan)', 'Buah padat'], potensiHasil: '22 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'PM 999 F1', produsen: 'Panah Merah', komoditas: 'Cabai Merah Keriting', deskripsi: 'Keriting legendaris.', keunggulan: ['Daya adaptasi luas', 'Rasa pedas'], potensiHasil: '18 Ton/Ha', umurPanen: '80 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Red Saber F1', produsen: 'Bintang Asia', komoditas: 'Cabai Merah Keriting', deskripsi: 'Keriting panjang.', keunggulan: ['Merah menyala', 'Bobot per buah tinggi'], potensiHasil: '20 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Tangguh F1', produsen: 'Panah Merah', komoditas: 'Cabai Merah Keriting', deskripsi: 'Tangguh di lahan endemik.', keunggulan: ['Tahan layu', 'Buah padat'], potensiHasil: '20 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Senopati F1', produsen: 'BISI', komoditas: 'Cabai Besar', deskripsi: 'Cabai besar padat.', keunggulan: ['Dinding buah tebal', 'Tahan pecah'], potensiHasil: '25 Ton/Ha', umurPanen: '80 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Imperial 10 F1', produsen: 'BISI', komoditas: 'Cabai Besar', deskripsi: 'Cabai merah teropong.', keunggulan: ['Ukuran jumbo', 'Panen berlimpah'], potensiHasil: '28 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Panex 100 F1', produsen: 'Panah Merah', komoditas: 'Cabai Besar', deskripsi: 'Cabai besar dataran tinggi.', keunggulan: ['Super besar', 'Toleran layu'], potensiHasil: '30 Ton/Ha', umurPanen: '100 HST', rekomendasiDataran: 'Tinggi' },
  { nama: 'Wibawa F1', produsen: 'BISI', komoditas: 'Cabai Besar', deskripsi: 'Cabai besar kaku.', keunggulan: ['Tahan simpan 12 hari', 'Merah mengkilap'], potensiHasil: '26 Ton/Ha', umurPanen: '80 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Horison 97', produsen: 'Cap Kapal Terbang', komoditas: 'Cabai Besar', deskripsi: 'Cabai besar klasik.', keunggulan: ['Mudah tumbuh', 'Batang kuat'], potensiHasil: '22 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Elegance F1', produsen: 'Known-You Seed', komoditas: 'Cabai Besar', deskripsi: 'Cabai besar impor.', keunggulan: ['Warna merah menyala sempurna', 'Kulit mulus'], potensiHasil: '25 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Iggo F1', produsen: 'Panah Merah', komoditas: 'Cabai Merah Keriting', deskripsi: 'Cabai keriting halus.', keunggulan: ['Toleran patek', 'Seragam'], potensiHasil: '19 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Rendah' },

  // 41 - 60: TOMAT & TERONG
  {
    nama: 'Servo F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Tomat',
    deskripsi: 'Tomat determinate paling populer di Indonesia, tahan Gemini Virus & Layu.',
    keunggulan: ['Tahan Virus Kuning', 'Buah keras tidak gampang pecah', 'Sangat lebat'],
    potensiHasil: '50 - 60 Ton / Ha',
    umurPanen: '65 - 70 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Gustavi F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Tomat',
    deskripsi: 'Tomat hibrida dataran rendah-menengah tahan layu bakteri & virus.',
    keunggulan: ['Buah besar bulat agak gepeng', 'Daya simpan lama', 'Panen melimpah'],
    potensiHasil: '60 - 70 Ton / Ha',
    umurPanen: '65 - 70 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Tymoti F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Tomat',
    deskripsi: 'Tomat dataran rendah tahan virus kuning.',
    keunggulan: ['Tahan Gemini Virus', 'Toleran iklim panas', 'Buah padat'],
    potensiHasil: '50 - 60 Ton / Ha',
    umurPanen: '60 - 65 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Betavila F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Tomat',
    deskripsi: 'Tomat dataran tinggi buah sangat besar mulus.',
    keunggulan: ['Bobot buah 100-120g/buah', 'Toleran phytophthora', 'Super besar'],
    potensiHasil: '70 - 80 Ton / Ha',
    umurPanen: '80 - 90 HST',
    rekomendasiDataran: 'Tinggi'
  },
  {
    nama: 'Terong Yuvita F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Terong',
    deskripsi: 'Terong ungu panjang tahan layu bakteri.',
    keunggulan: ['Warna ungu mengkilap', 'Toleran layu bakteri', 'Buah lebat'],
    potensiHasil: '50 - 60 Ton / Ha',
    umurPanen: '50 - 55 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Terong Mustang F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Terong',
    deskripsi: 'Terong ungu hibrida panjang lurus.',
    keunggulan: ['Daging manis empuk', 'Warna ungu menyala', 'Tahan simpan'],
    potensiHasil: '60 Ton / Ha',
    umurPanen: '50 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  { nama: 'Corona F1', produsen: 'BISI', komoditas: 'Tomat', deskripsi: 'Tomat buah besar.', keunggulan: ['Pecah buah rendah', 'Kulit tebal'], potensiHasil: '55 Ton/Ha', umurPanen: '70 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Marta F1', produsen: 'Panah Merah', komoditas: 'Tomat', deskripsi: 'Tomat dataran tinggi.', keunggulan: ['Ukuran super jumbo', 'Dinding tebal'], potensiHasil: '75 Ton/Ha', umurPanen: '85 HST', rekomendasiDataran: 'Tinggi' },
  { nama: 'Fortuna F1', produsen: 'BISI', komoditas: 'Tomat', deskripsi: 'Tomat lebat.', keunggulan: ['Toleran penyakit daun', 'Buah keras'], potensiHasil: '50 Ton/Ha', umurPanen: '65 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Amelia F1', produsen: 'Bintang Asia', komoditas: 'Tomat', deskripsi: 'Tomat oval lebat.', keunggulan: ['Genjah', 'Pengangkutan tahan'], potensiHasil: '45 Ton/Ha', umurPanen: '60 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Terong Lezat F1', produsen: 'BISI', komoditas: 'Terong', deskripsi: 'Terong ungu manis.', keunggulan: ['Rasa manis', 'Tekstur empuk'], potensiHasil: '55 Ton/Ha', umurPanen: '50 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Terong Kanari F1', produsen: 'Panah Merah', komoditas: 'Terong', deskripsi: 'Terong hijau renyah.', keunggulan: ['Hijau terang', 'Toleran layu'], potensiHasil: '50 Ton/Ha', umurPanen: '50 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Terong Hitam Ungu', produsen: 'Bintang Asia', komoditas: 'Terong', deskripsi: 'Terong ungu pekat.', keunggulan: ['Panjang 25cm', 'Kulit mulus'], potensiHasil: '50 Ton/Ha', umurPanen: '55 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Terong Gelatik', produsen: 'Cap Panah Merah', komoditas: 'Terong', deskripsi: 'Terong bulat lalap.', keunggulan: ['Renyah tidak pahit', 'Buah sangat banyak'], potensiHasil: '30 Ton/Ha', umurPanen: '45 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Terong Kopek Hijau', produsen: 'Lokal Jabar', komoditas: 'Terong', deskripsi: 'Terong hijau panjang.', keunggulan: ['Rasa gurih lalap', 'Tahan cuaca'], potensiHasil: '40 Ton/Ha', umurPanen: '55 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Tomat Cherry Ruby', produsen: 'Known-You', komoditas: 'Tomat', deskripsi: 'Tomat ceri manis.', keunggulan: ['Brix manis tinggi', 'Bentuk cantik'], potensiHasil: '25 Ton/Ha', umurPanen: '60 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Tomat New Asia', produsen: 'Known-You', komoditas: 'Tomat', deskripsi: 'Tomat apel besar.', keunggulan: ['Tahan layu', 'Buah padat'], potensiHasil: '60 Ton/Ha', umurPanen: '75 HST', rekomendasiDataran: 'Tinggi' },
  { nama: 'Terong Ungu Prince', produsen: 'Known-You', komoditas: 'Terong', deskripsi: 'Terong hibrida unggul.', keunggulan: ['Daging putih mulus', 'Buah simetris'], potensiHasil: '55 Ton/Ha', umurPanen: '50 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Terong Hijau Laguna', produsen: 'BISI', komoditas: 'Terong', deskripsi: 'Terong hijau segar.', keunggulan: ['Bentuk lurus', 'Tahan simpan'], potensiHasil: '48 Ton/Ha', umurPanen: '52 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Tomat Karina F1', produsen: 'Panah Merah', komoditas: 'Tomat', deskripsi: 'Tomat dataran tinggi.', keunggulan: ['Bercak daun toleran', 'Buah berbobot'], potensiHasil: '65 Ton/Ha', umurPanen: '80 HST', rekomendasiDataran: 'Tinggi' },

  // 61 - 80: BAWANG, MENTIMUN, MELON & SEMANGKA
  {
    nama: 'Bima Brebes (Umbi)',
    produsen: 'Petani Brebes',
    komoditas: 'Bawang Merah',
    deskripsi: 'Varietas bawang merah paling populer, warna merah menyala aroma tajam.',
    keunggulan: ['Anakan banyak (7-12 umbi)', 'Tahan simpan hingga 4 bulan', 'Aroma sangat wangi'],
    potensiHasil: '10 - 15 Ton / Ha',
    umurPanen: '55 - 60 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Bauji (Umbi)',
    produsen: 'Petani Nganjuk',
    komoditas: 'Bawang Merah',
    deskripsi: 'Bawang merah tahan hujan masif.',
    keunggulan: ['Tahan cuaca ekstrem basah', 'Daun tebal kaku', 'Umbi besar'],
    potensiHasil: '12 - 18 Ton / Ha',
    umurPanen: '55 - 65 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Tajuk (Umbi)',
    produsen: 'Petani Nganjuk',
    komoditas: 'Bawang Merah',
    deskripsi: 'Varietas Tajuk unggul nasional tahan panas.',
    keunggulan: ['Adaptasi panas luar biasa', 'Umbi bulat merah', 'Aroma tajam'],
    potensiHasil: '12 - 16 Ton / Ha',
    umurPanen: '55 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Tuktuk (Biji TSS)',
    produsen: 'Cap Panah Merah',
    komoditas: 'Bawang Merah',
    deskripsi: 'Bawang merah dari biji (True Shallot Seed), bebas penyakit tular umbi.',
    keunggulan: ['Bebas virus umbi', 'Umbi tunggal/ganda sangat besar', 'Hemat biaya kirim'],
    potensiHasil: '15 - 20 Ton / Ha',
    umurPanen: '75 - 85 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Mentimun Hercules F1',
    produsen: 'Cap Kapal Terbang (BISI)',
    komoditas: 'Mentimun',
    deskripsi: 'Mentimun hibrida tidak pahit hingga ke ujung.',
    keunggulan: ['Bebas pahit', 'Toleran gemini virus', 'Buah hijau lurus'],
    potensiHasil: '40 - 50 Ton / Ha',
    umurPanen: '33 - 35 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Mentimun Zatavy F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Mentimun',
    deskripsi: 'Timun tahan virus bercak daun dan Gemini Virus.',
    keunggulan: ['100% Tahan Virus', 'Buah lebat dari bawah', 'Kulit tidak kusam'],
    potensiHasil: '50 - 60 Ton / Ha',
    umurPanen: '35 - 38 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Rompis F1',
    produsen: 'Bintang Asia',
    komoditas: 'Mentimun',
    deskripsi: 'Mentimun hibrida tipe lokal renyah, lebat dan tahan virus gemini.',
    keunggulan: ['Buah lebat & seragam', 'Tahan Gemini Virus & Embun Bulu', 'Daging buah renyah tidak pahit'],
    potensiHasil: '40 - 50 Ton / Ha',
    umurPanen: '32 - 35 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Bhakti F1',
    produsen: 'Bintang Asia',
    komoditas: 'Mentimun',
    deskripsi: 'Timun hibrida vigor kuat, buah hijau gelap renyah bebas pahit.',
    keunggulan: ['Buah lebat hijau segar', 'Tahan Gemini Virus', 'Daging renyah tidak pahit'],
    potensiHasil: '45 - 50 Ton / Ha',
    umurPanen: '33 - 35 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Melon Action 434 F1',
    produsen: 'Cap Kapal Terbang',
    komoditas: 'Melon',
    deskripsi: 'Melon hijau berjarring tebal, manis brix 12-14.',
    keunggulan: ['Jaring (net) sangat rapat', 'Daging manis garing', 'Tahan angkut jauh'],
    potensiHasil: '40 - 50 Ton / Ha',
    umurPanen: '65 - 70 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Melon Inthanon / Gracia F1',
    produsen: 'Rijk Zwaan / Known-You',
    komoditas: 'Melon',
    deskripsi: 'Melon eksklusif hidroponik green house manis gurih.',
    keunggulan: ['Brix hingga 15%', 'Daging oranye/kuning premium', 'Harga jual tinggi'],
    potensiHasil: '35 - 45 Ton / Ha',
    umurPanen: '70 - 75 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Semangka Amara F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Semangka',
    deskripsi: 'Semangka non-biji (seedless) bulat loreng manis renyah.',
    keunggulan: ['Tanpa biji', 'Daging merah menyala', 'Tahan pecah buah'],
    potensiHasil: '35 - 45 Ton / Ha',
    umurPanen: '60 - 65 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Semangka Premier F1',
    produsen: 'Cap Kapal Terbang',
    komoditas: 'Semangka',
    deskripsi: 'Semangka Inul (lonjong) berbiji manis segar.',
    keunggulan: ['Bentuk Inul lonjong gampang ditata', 'Manis garing', 'Genjah'],
    potensiHasil: '30 - 40 Ton / Ha',
    umurPanen: '55 - 60 HST',
    rekomendasiDataran: 'Rendah'
  },
  { nama: 'Mentimun Metavy F1', produsen: 'Panah Merah', komoditas: 'Mentimun', deskripsi: 'Timun tahan gemini virus.', keunggulan: ['Tahan keriting virus', 'Panen super cepat'], potensiHasil: '55 Ton/Ha', umurPanen: '34 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Mentimun Roman F1', produsen: 'BISI', komoditas: 'Mentimun', deskripsi: 'Timun hijau tua.', keunggulan: ['Buah lurus padat', 'Panen 40 hari'], potensiHasil: '45 Ton/Ha', umurPanen: '35 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Melon Alisha F1', produsen: 'Panah Merah', komoditas: 'Melon', deskripsi: 'Melon daging oranye.', keunggulan: ['Rasa sangat manis', 'Net tebal'], potensiHasil: '40 Ton/Ha', umurPanen: '68 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Semangka Passport F1', produsen: 'Panah Merah', komoditas: 'Semangka', deskripsi: 'Semangka non biji lonjong.', keunggulan: ['Non biji lonjong', 'Daging merah padat'], potensiHasil: '40 Ton/Ha', umurPanen: '65 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Semangka Madrid F1', produsen: 'BISI', komoditas: 'Semangka', deskripsi: 'Semangka kuning lonjong.', keunggulan: ['Daging kuning manis', 'Kulit hitam'], potensiHasil: '35 Ton/Ha', umurPanen: '60 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Bawang Sanren F1 (TSS)', produsen: 'Panah Merah', komoditas: 'Bawang Merah', deskripsi: 'Biji bawang ganda.', keunggulan: ['Umbi ganda 3-5', 'Tahan busuk'], potensiHasil: '18 Ton/Ha', umurPanen: '75 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Mentimun Baby Roberto', produsen: 'Bintang Asia', komoditas: 'Mentimun', deskripsi: 'Timun baby acar.', keunggulan: ['Renyah tanpa biji keras', 'Lebat'], potensiHasil: '30 Ton/Ha', umurPanen: '30 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Melon Kinanti (Golden)', produsen: 'Tunas Senja', komoditas: 'Melon', deskripsi: 'Melon kulit kuning mulus.', keunggulan: ['Daging renyah', 'Penampilan mewah'], potensiHasil: '35 Ton/Ha', umurPanen: '65 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Semangka Torpedo', produsen: 'Known-You', komoditas: 'Semangka', deskripsi: 'Semangka lonjong besar.', keunggulan: ['Bobot hingga 10kg', 'Manis tinggi'], potensiHasil: '45 Ton/Ha', umurPanen: '65 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Bawang Batu Ijo', produsen: 'Petani Batu', komoditas: 'Bawang Merah', deskripsi: 'Varietas umbi besar dataran tinggi.', keunggulan: ['Umbi jumbo', 'Cocok lereng gunung'], potensiHasil: '15 Ton/Ha', umurPanen: '70 HST', rekomendasiDataran: 'Tinggi' },

  // 81 - 105: JAGUNG, PADI & SAYURAN DAUN HORTIKULTURA
  {
    nama: 'Bisi 18',
    produsen: 'Cap Kapal Terbang (BISI)',
    komoditas: 'Jagung',
    deskripsi: 'Jagung hibrida pakan tongkol dua paling legendaris.',
    keunggulan: ['Rendemen biji tinggi 80%', 'Tahan kekeringan', 'Biji merah mengkilap keras'],
    potensiHasil: '12 - 13 Ton / Ha',
    umurPanen: '100 - 105 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'NK 212 (Naga)',
    produsen: 'Syngenta',
    komoditas: 'Jagung',
    deskripsi: 'Jagung hibrida tahan busuk tongkol dan perakaran sangat kokoh.',
    keunggulan: ['Tahan roboh angin kencang', 'Tongkol rapat', 'Biji penuh ke ujung'],
    potensiHasil: '12 - 14 Ton / Ha',
    umurPanen: '100 - 110 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Pioneer P35 Banteng',
    produsen: 'Corteva / Pioneer',
    komoditas: 'Jagung',
    deskripsi: 'Jagung pakan pipil merah rapat tahan bulai.',
    keunggulan: ['Tahan Bulai', 'Batang seperti kayu tahan roboh', 'Biji sangat berbobot'],
    potensiHasil: '13 - 15 Ton / Ha',
    umurPanen: '105 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Jagung Manis Talenta',
    produsen: 'Cap Kapal Terbang',
    komoditas: 'Jagung',
    deskripsi: 'Jagung manis hibrida manis brix tinggi rasa gurih.',
    keunggulan: ['Brix manis 13-14%', 'Ukuran tongkol besar', 'Biji kuning rapat'],
    potensiHasil: '15 - 18 Ton / Ha',
    umurPanen: '70 - 75 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Padi Inpari 32 Tut Wuri Handayani',
    produsen: 'BBLITVET / Batan / Pertani',
    komoditas: 'Padi',
    deskripsi: 'Varietas padi sawah irigasi paling banyak ditanam di Indonesia.',
    keunggulan: ['Tahan HDB / Kresek', 'Toleran penyakit Blas', 'Nasi pulen disukai'],
    potensiHasil: '8 - 10.5 Ton / Ha GKP',
    umurPanen: '115 - 120 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Padi Ciherang',
    produsen: 'Sukamandi',
    komoditas: 'Padi',
    deskripsi: 'Varietas padi legendaris nasi sangat pulen.',
    keunggulan: ['Nasi sangat pulen kelas satu', 'Anakan produktif banyak', 'Adaptasi luas'],
    potensiHasil: '7 - 8.5 Ton / Ha GKP',
    umurPanen: '115 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Padi Mekongga',
    produsen: 'Sukamandi',
    komoditas: 'Padi',
    deskripsi: 'Padi tahan wereng coklat biotipe 2 dan 3.',
    keunggulan: ['Tahan Wereng Coklat', 'Postur pendek tahan roboh', 'Gabah kuning bersih'],
    potensiHasil: '8 - 9 Ton / Ha',
    umurPanen: '115 - 120 HST',
    rekomendasiDataran: 'Rendah'
  },
  {
    nama: 'Kangkung Bangkok LP-1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Kangkung & Bayam',
    deskripsi: 'Kangkung darat daun sempit renyah favorit pengusaha tumis.',
    keunggulan: ['Tumbuh seragam cepat', 'Batang renyah tidak liat', 'Bebas penyakit karat putih'],
    potensiHasil: '25 - 30 Ton / Ha',
    umurPanen: '20 - 25 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Bayam Hijau Maestro',
    produsen: 'Cap Panah Merah',
    komoditas: 'Kangkung & Bayam',
    deskripsi: 'Bayam cabut daun lebar hijau segar tidak cepat berbunga.',
    keunggulan: ['Lambat berbunga', 'Daun lembut gurih', 'Panen singkat'],
    potensiHasil: '15 - 20 Ton / Ha',
    umurPanen: '20 - 25 HST',
    rekomendasiDataran: 'Rendah - Tinggi'
  },
  {
    nama: 'Sawi Tosakan (Caisim)',
    produsen: 'Cap Panah Merah',
    komoditas: 'Sawi & Caisim',
    deskripsi: 'Caisim tangkai hijau tebal renyah.',
    keunggulan: ['Tahan tebas lambat berbunga', 'Batang kaku sukulen', 'Sangat disukai tukang bakso'],
    potensiHasil: '25 - 30 Ton / Ha',
    umurPanen: '25 - 30 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Kubis Sehati F1',
    produsen: 'Cap Panah Merah',
    komoditas: 'Kubis & Brokoli',
    deskripsi: 'Kubis hibrida krop padat tahan panas.',
    keunggulan: ['Krop sangat padat berat 1.5-2kg', 'Toleran busuk hitam', 'Tahan simpan'],
    potensiHasil: '40 - 50 Ton / Ha',
    umurPanen: '60 - 65 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Kacang Panjang Parade Tavi',
    produsen: 'Cap Panah Merah',
    komoditas: 'Kacang Panjang & Buncis',
    deskripsi: 'Kacang panjang tahan virus kuning Tavi.',
    keunggulan: ['100% Tahan Virus Kuning', 'Polong hijau padat panjang 70cm', 'Tidak mudah lemas'],
    potensiHasil: '25 - 30 Ton / Ha',
    umurPanen: '45 HST',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  {
    nama: 'Pepaya California IPB-9',
    produsen: 'Pusat Kajian Buah Tropika IPB',
    komoditas: 'Buah & Horti Lainnya',
    deskripsi: 'Pepaya lokal unggul ukuran sedang daging merah manis.',
    keunggulan: ['Pohon pendek berbuah lebat', 'Daging merah tebal manis brix 11-13', 'Pasar melimpah'],
    potensiHasil: '60 - 80 Ton / Ha / Tahun',
    umurPanen: '7 - 8 Bulan (Mulai Panen)',
    rekomendasiDataran: 'Rendah - Menengah'
  },
  { nama: 'Buncis Lebat 3', produsen: 'Panah Merah', komoditas: 'Kacang Panjang & Buncis', deskripsi: 'Buncis tegak tanpa lanjaran.', keunggulan: ['Tanpa turus/lanjaran', 'Polong lurus hijau'], potensiHasil: '20 Ton/Ha', umurPanen: '45 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Buncis Perkasa', produsen: 'BISI', komoditas: 'Kacang Panjang & Buncis', deskripsi: 'Buncis merambat lebat.', keunggulan: ['Polong halus lentur', 'Panen panjang'], potensiHasil: '25 Ton/Ha', umurPanen: '50 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Kubis Autumn King', produsen: 'Takii Seed', komoditas: 'Kubis & Brokoli', deskripsi: 'Kubis dataran tinggi super jumbo.', keunggulan: ['Krop hingga 3kg', 'Rasa manis'], potensiHasil: '60 Ton/Ha', umurPanen: '80 HST', rekomendasiDataran: 'Tinggi' },
  { nama: 'Sawi Nauli F1', produsen: 'Panah Merah', komoditas: 'Sawi & Caisim', deskripsi: 'Caisim dataran rendah.', keunggulan: ['Tahan hujan', 'Batang lebar'], potensiHasil: '28 Ton/Ha', umurPanen: '28 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Sawi Pakchoy Nauli', produsen: 'Panah Merah', komoditas: 'Sawi & Caisim', deskripsi: 'Pakchoy sendok.', keunggulan: ['Bentuk sendok cantik', 'Renyah manis'], potensiHasil: '25 Ton/Ha', umurPanen: '25 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Bayam Merah Mira', produsen: 'Panah Merah', komoditas: 'Kangkung & Bayam', deskripsi: 'Bayam merah cantik.', keunggulan: ['Warna merah pekat', 'Kaya zat besi'], potensiHasil: '15 Ton/Ha', umurPanen: '22 HST', rekomendasiDataran: 'Rendah-Tinggi' },
  { nama: 'Seledri Amigo', produsen: 'Panah Merah', komoditas: 'Buah & Horti Lainnya', deskripsi: 'Seledri daun rimbun.', keunggulan: ['Aroma sangat tajam', 'Anakan banyak'], potensiHasil: '15 Ton/Ha', umurPanen: '45 HST', rekomendasiDataran: 'Menengah-Tinggi' },
  { nama: 'Kangkung Serimpi', produsen: 'Bintang Asia', komoditas: 'Kangkung & Bayam', deskripsi: 'Kangkung darat renyah.', keunggulan: ['Batang hijau terang', 'Tidak cepat berbunga'], potensiHasil: '25 Ton/Ha', umurPanen: '21 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Jagung Bisi 222', produsen: 'BISI', komoditas: 'Jagung', deskripsi: 'Jagung pakan tongkol ganda.', keunggulan: ['Dua tongkol sama besar', 'Biji rapat merah'], potensiHasil: '13.5 Ton/Ha', umurPanen: '105 HST', rekomendasiDataran: 'Rendah-Menengah' },
  { nama: 'Padi Situ Bagendit', produsen: 'Sukamandi', komoditas: 'Padi', deskripsi: 'Padi gogo & sawah tadah hujan.', keunggulan: ['Tahan kekeringan lahan kering', 'Nasi pulen'], potensiHasil: '6.5 Ton/Ha', umurPanen: '110 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Padi Umbul Umbul', produsen: 'Petani Lokal', komoditas: 'Padi', deskripsi: 'Padi galur lokal berbulir panjang.', keunggulan: ['Malai super panjang 400 bulir', 'Nasi enak'], potensiHasil: '10 Ton/Ha', umurPanen: '105 HST', rekomendasiDataran: 'Rendah' },
  { nama: 'Pepaya Bangkok', produsen: 'Impor Thailand', komoditas: 'Buah & Horti Lainnya', deskripsi: 'Pepaya buah jumbo.', keunggulan: ['Buah hingga 3kg', 'Daging kenyal manis'], potensiHasil: '70 Ton/Ha', umurPanen: '8 Bulan', rekomendasiDataran: 'Rendah' }
];

export const CUACA_OPTIONS = [
  { value: 'Semua', label: 'Semua Musim' },
  { value: 'Hujan', label: 'Musim Hujan' },
  { value: 'Kemarau', label: 'Musim Kemarau' }
];

export const ELEVATION_OPTIONS = [
  { value: 'Rendah', label: 'Dataran Rendah (0 - 400 mdpl)' },
  { value: 'Menengah', label: 'Dataran Menengah (400 - 700 mdpl)' },
  { value: 'Tinggi', label: 'Dataran Tinggi (> 700 mdpl)' }
];

