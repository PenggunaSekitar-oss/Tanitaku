export interface Pupuk {
  id: string;
  nama: string;
  kategori: string;
  bentuk: string;
  kandungan: string;
  fase: string[];
  minHst: number;
  maxHst: number;
  dosis: string;
  keterangan: string;
  keunggulan?: string;
  kekurangan?: string;
  hargaNonSubsidi?: string;
  hargaSubsidi?: string;
}

export function getPupukPrices(pupuk: Pupuk): { nonSubsidi: string; subsidi?: string } {
  if (pupuk.hargaNonSubsidi) {
    return { nonSubsidi: pupuk.hargaNonSubsidi, subsidi: pupuk.hargaSubsidi };
  }
  
  const name = pupuk.nama.toLowerCase();
  
  if (name.includes('urea')) {
    return {
      nonSubsidi: 'Rp 9.500 - Rp 11.000 / kg (Rp 420.000 / Sak 50kg)',
      subsidi: 'Rp 2.250 / kg (Rp 112.500 / Sak 50kg)'
    };
  }
  if (name.includes('phonska')) {
    return {
      nonSubsidi: 'Rp 10.500 - Rp 12.000 / kg (Rp 480.000 / Sak 50kg)',
      subsidi: 'Rp 2.300 / kg (Rp 115.000 / Sak 50kg)'
    };
  }
  if (name.includes('za')) {
    return {
      nonSubsidi: 'Rp 7.000 - Rp 8.500 / kg (Rp 320.000 / Sak 50kg)',
      subsidi: 'Rp 1.700 / kg (Rp 85.000 / Sak 50kg)'
    };
  }
  if (name.includes('sp-36') || name.includes('sp-26') || name.includes('tsp')) {
    return {
      nonSubsidi: 'Rp 9.000 - Rp 11.000 / kg (Rp 380.000 - Rp 450.000 / Sak 50kg)',
      subsidi: 'Rp 2.000 / kg (Rp 100.000 / Sak 50kg)'
    };
  }
  if (name.includes('kcl') || name.includes('mop')) {
    return {
      nonSubsidi: 'Rp 12.500 - Rp 15.000 / kg (Rp 550.000 - Rp 650.000 / Sak 50kg)'
    };
  }
  if (name.includes('mutiara 16-16-16') || name.includes('yaramila') || name.includes('npk pak tani') || name.includes('npk tawon') || name.includes('npk 16-16-16')) {
    return {
      nonSubsidi: 'Rp 17.500 - Rp 20.000 / kg (Rp 850.000 - Rp 950.000 / Sak 50kg)'
    };
  }
  if (name.includes('kno3')) {
    return {
      nonSubsidi: 'Rp 45.000 - Rp 65.000 / kg'
    };
  }
  if (name.includes('mkp')) {
    return {
      nonSubsidi: 'Rp 55.000 - Rp 68.000 / kg'
    };
  }
  if (name.includes('ultradap') || name.includes('map')) {
    return {
      nonSubsidi: 'Rp 48.000 - Rp 58.000 / kg'
    };
  }
  if (name.includes('gandasil') || name.includes('sampurna') || name.includes('mamigro')) {
    return {
      nonSubsidi: 'Rp 30.000 - Rp 38.000 / 500gr'
    };
  }
  if (name.includes('growmore')) {
    return {
      nonSubsidi: 'Rp 60.000 - Rp 75.000 / 500gr'
    };
  }
  if (name.includes('dolomit') || name.includes('kaptan')) {
    return {
      nonSubsidi: 'Rp 1.000 - Rp 1.800 / kg (Rp 35.000 - Rp 50.000 / Sak 50kg)'
    };
  }
  if (name.includes('kalsium') || name.includes('calcinit') || name.includes('cng') || name.includes('calnit')) {
    return {
      nonSubsidi: 'Rp 18.000 - Rp 35.000 / kg'
    };
  }
  if (pupuk.kategori === 'Organik' || name.includes('poc') || name.includes('em4') || name.includes('biotogrow')) {
    return {
      nonSubsidi: 'Rp 25.000 - Rp 75.000 / Botol 1 Liter'
    };
  }
  if (name.includes('kandang') || name.includes('guano') || name.includes('kascing')) {
    return {
      nonSubsidi: 'Rp 1.500 - Rp 3.000 / kg (Rp 25.000 - Rp 45.000 / Karung 25kg)'
    };
  }

  if (pupuk.kategori === 'Majemuk') {
    return {
      nonSubsidi: 'Rp 14.000 - Rp 18.000 / kg (Rp 600.000 - Rp 780.000 / Sak 50kg)'
    };
  }
  return {
    nonSubsidi: 'Rp 12.000 - Rp 25.000 / kg'
  };
}

export function getPupukDetails(pupuk: Pupuk): {
  keunggulan: string;
  kekurangan: string;
  hargaNonSubsidi: string;
  hargaSubsidi?: string;
} {
  const prices = getPupukPrices(pupuk);
  
  let keunggulan = pupuk.keunggulan;
  let kekurangan = pupuk.kekurangan;

  if (!keunggulan || !kekurangan) {
    const name = pupuk.nama.toLowerCase();
    const kategori = pupuk.kategori.toLowerCase();

    if (name.includes('urea')) {
      keunggulan = keunggulan || 'Kandungan Nitrogen 46% sangat tinggi, cepat diserap akar, mempercepat pembentukan tunas baru & hijau daun.';
      kekurangan = kekurangan || 'Sifat higroskopis tinggi (mudah menguap jika terlalu panas/pagi hari) & berisiko membakar akar jika dosis berlebihan.';
    } else if (name.includes('za')) {
      keunggulan = keunggulan || 'Mengandung Nitrogen 21% & Sulfur 24% murni untuk tingkatkan aroma, ketahanan penyakit, dan rasa pedas/gurih.';
      kekurangan = kekurangan || 'Penggunaan terus-menerus tanpa dolomit dapat memicu pengasaman pH tanah.';
    } else if (name.includes('sp-36') || name.includes('sp-26') || name.includes('tsp') || name.includes('amophos') || name.includes('rock phosphate')) {
      keunggulan = keunggulan || 'Fosfat tinggi merangsang pertumbuhan akar serabut yang lebat, memperkuat batang, & pembentukan bakal bunga.';
      kekurangan = kekurangan || 'Kelarutan agak lambat di tanah netral/alkali, sebaiknya diaplikasikan sebagai pupuk dasar sebelum tanam.';
    } else if (name.includes('kcl') || name.includes('mop')) {
      keunggulan = keunggulan || 'Kalium 60% mempertebal dinding sel, menambah bobot & tonase panen, serta tingkatkan daya simpan buah/umbi.';
      kekurangan = kekurangan || 'Kandungan klorida agak tinggi pada varietas sensitif klor; perlu pengocoran bertahap.';
    } else if (name.includes('mutiara') || name.includes('phonska') || name.includes('npk')) {
      keunggulan = keunggulan || 'Formula NPK terpadu & praktis, mencegah defisiensi nutrisi makro secara menyeluruh dari vegetatif hingga generatif.';
      kekurangan = kekurangan || 'Harga non-subsidi relatif lebih tinggi dibanding pupuk tunggal pasaran.';
    } else if (name.includes('kno3')) {
      keunggulan = keunggulan || 'Kombinasi Nitrogen Nitrat & Kalium murni tanpa klorida, cepat diserap, memicu pengisian buah & umbi manis super.';
      kekurangan = kekurangan || 'Harga tergolong premium; disarankan untuk fase generatif/pembesaran buah kocor.';
    } else if (name.includes('mkp')) {
      keunggulan = keunggulan || 'Fosfat 52% & Kalium 34% 100% water soluble (larut air sempurna), mencegah rontok bunga & meningkatkan kemanisan.';
      kekurangan = kekurangan || 'Harga tinggi dan tidak mengandung Nitrogen, khusus untuk pembuahan matang.';
    } else if (name.includes('ultradap') || name.includes('map')) {
      keunggulan = keunggulan || 'Kandungan Fosfat 60% sangat tinggi larut air, terbaik untuk starter akar vegetatif & inisiasi bunga lebat.';
      kekurangan = kekurangan || 'Gunakan sesuai dosis agar tanah tidak terlalu dingin/asam pada musim hujan.';
    } else if (name.includes('dolomit') || name.includes('kaptan')) {
      keunggulan = keunggulan || 'Menaikkan pH tanah asam dengan efektif, menetralkan racun Al/Fe, serta menyuplai Kalsium & Magnesium alami.';
      kekurangan = kekurangan || 'Reaksi bertahap (membutuhkan waktu 1-2 minggu terurai di tanah sebelum penanaman).';
    } else if (name.includes('gandasil') || name.includes('growmore') || name.includes('mamigro')) {
      keunggulan = keunggulan || 'Dilengkapi unsur hara mikro lengkap (Fe, B, Zn, Cu, Mn), diserap 100% via stomata daun.';
      kekurangan = kekurangan || 'Tidak bisa menggantikan pupuk makro tanah sepenuhnya, merupakan pupuk pendamping.';
    } else if (kategori.includes('organik') || name.includes('poc') || name.includes('kandang') || name.includes('em4')) {
      keunggulan = keunggulan || 'Memperbaiki struktur fisik & biologi tanah, meningkatkan kapasitas simpan air & populasi mikroba baik.';
      kekurangan = kekurangan || 'Kandungan NPK tergolong rendah sehingga butuh volume lumayan banyak.';
    } else {
      keunggulan = keunggulan || 'Meningkatkan produktivitas & kesehatan fisiologis tanaman secara bertahap.';
      kekurangan = kekurangan || 'Perhatikan dosis & fase aplikasi agar penyerapan hara optimal.';
    }
  }

  return {
    keunggulan,
    kekurangan,
    hargaNonSubsidi: prices.nonSubsidi,
    hargaSubsidi: prices.subsidi
  };
}

export const PUPUK_DB: Pupuk[] = [
  // 1 - 20: PUPUK MAKRO TUNGGAL
  { id: '1', nama: 'Urea Subsidized / Non-Subsidi', kategori: 'Tunggal', bentuk: 'Prill/Granul', kandungan: 'Nitrogen (N) 46%', fase: ['Vegetatif'], minHst: 7, maxHst: 40, dosis: '2-5 g / tanaman', keterangan: 'Memicu pertumbuhan daun, batang, dan hijau daun dengan sangat cepat.' },
  { id: '2', nama: 'ZA (Zwavelzure Ammoniak)', kategori: 'Tunggal', bentuk: 'Kristal', kandungan: 'Nitrogen 21%, Sulfur 24%', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '3-5 g / tanaman', keterangan: 'Sumber N dan Sulfur (S), sangat baik untuk tanaman bawang, kubis, dan cabai.' },
  { id: '3', nama: 'SP-36', kategori: 'Tunggal', bentuk: 'Granul', kandungan: 'Fosfat (P2O5) 36%', fase: ['Dasar', 'Vegetatif Awal'], minHst: 0, maxHst: 20, dosis: '10-20 g / m2', keterangan: 'Memacu pertumbuhan akar dan pembentukan bakal bunga.' },
  { id: '4', nama: 'TSP (Triple Super Phosphate)', kategori: 'Tunggal', bentuk: 'Granul', kandungan: 'Fosfat (P2O5) 46%', fase: ['Dasar', 'Vegetatif Awal'], minHst: 0, maxHst: 20, dosis: '10-15 g / m2', keterangan: 'Pupuk dasar pembentuk perakaran kuat dan tebal.' },
  { id: '5', nama: 'KCl (MOP - Muriate of Potash)', kategori: 'Tunggal', bentuk: 'Kristal/Granul', kandungan: 'Kalium (K2O) 60%', fase: ['Generatif'], minHst: 30, maxHst: 90, dosis: '3-6 g / tanaman', keterangan: 'Meningkatkan bobot, warna merah, rasa manis, dan daya tahan penyakit.' },
  { id: '6', nama: 'KCl Mahkota Kanada', kategori: 'Tunggal', bentuk: 'Kristal Merah', kandungan: 'Kalium (K2O) 60%', fase: ['Generatif'], minHst: 35, maxHst: 90, dosis: '3-5 g / tanaman', keterangan: 'Kalium murni kualitas impor Kanada.' },
  { id: '7', nama: 'KCL Jerman K+S', kategori: 'Tunggal', bentuk: 'Serbuk Putih/Kristal', kandungan: 'Kalium (K2O) 60% Water Soluble', fase: ['Generatif'], minHst: 30, maxHst: 90, dosis: '2-4 g / L air', keterangan: 'Bebas klorida tinggi, sangat aman untuk kocor.' },
  { id: '8', nama: 'SP-26 Petro', kategori: 'Tunggal', bentuk: 'Granul', kandungan: 'Fosfat (P2O5) 26%, Sulfur 5%', fase: ['Dasar'], minHst: 0, maxHst: 20, dosis: '15-20 g / m2', keterangan: 'Pengganti SP-36 dengan ketersediaan sulfur.' },
  { id: '9', nama: 'Amophos (Ammonium Phosphate)', kategori: 'Tunggal', bentuk: 'Granul', kandungan: 'N 11%, P 52%', fase: ['Dasar', 'Vegetatif Awal'], minHst: 0, maxHst: 25, dosis: '5-10 g / m2', keterangan: 'Pupuk starter pembentuk akar super.' },
  { id: '10', nama: 'Sulfat Membal (S) Petro', kategori: 'Tunggal', bentuk: 'Kristal', kandungan: 'Sulfur 90%', fase: ['Dasar', 'Vegetatif'], minHst: 0, maxHst: 30, dosis: '2-3 g / m2', keterangan: 'Menurunkan pH tanah alkali dan menyuplai sulfur.' },
  { id: '11', nama: 'Kieserite (Magnesium Sulfat)', kategori: 'Tunggal', bentuk: 'Granul/Kristal', kandungan: 'Mg 27%, S 22%', fase: ['Vegetatif'], minHst: 15, maxHst: 50, dosis: 'Kocor 2-4 g/L', keterangan: 'Atasi daun menguning karena kurang magnesium (klorosis).' },
  { id: '12', nama: 'Pupuk Rock Phosphate (RP)', kategori: 'Tunggal', bentuk: 'Tepung/Granul', kandungan: 'Fosfat Alami 28%', fase: ['Dasar'], minHst: -10, maxHst: 0, dosis: '20-30 g / m2', keterangan: 'Fosfat alam lepas lambat (slow release) untuk olah tanah.' },
  { id: '13', nama: 'Dolomit (Kapur Pertanian)', kategori: 'Tunggal', bentuk: 'Tepung', kandungan: 'CaO 30%, MgO 18%', fase: ['Dasar'], minHst: -15, maxHst: -1, dosis: '50-100 g / m2', keterangan: 'Menaikkan pH tanah asam dan memberikan nutrisi Kalsium & Magnesium.' },
  { id: '14', nama: 'Pupuk Kaptan (Kapur Carbonat)', kategori: 'Tunggal', bentuk: 'Tepung', kandungan: 'CaCO3 90%', fase: ['Dasar'], minHst: -15, maxHst: -1, dosis: '50-100 g / m2', keterangan: 'Menetralisir keasaman tanah bekas hujan asam.' },
  { id: '15', nama: 'Urea Pink Daun Buah Non-Subsidi', kategori: 'Tunggal', bentuk: 'Prill', kandungan: 'Nitrogen 46%', fase: ['Vegetatif'], minHst: 7, maxHst: 40, dosis: '3-5 g / tanaman', keterangan: 'Urea kualitas ekspor bebas gumpal.' },
  { id: '16', nama: 'Urea Granul Pupuk Kaltim', kategori: 'Tunggal', bentuk: 'Granul Besar', kandungan: 'Nitrogen 46%', fase: ['Vegetatif'], minHst: 7, maxHst: 40, dosis: '3-5 g / tanaman', keterangan: 'Bentuk granul besar tidak mudah hanyut hujan.' },
  { id: '17', nama: 'ZA Plus Petrokimia', kategori: 'Tunggal', bentuk: 'Kristal', kandungan: 'N 21%, S 24%, Zinc 1000 ppm', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '3-5 g / tanaman', keterangan: 'ZA dilengkapi mikronutrien Zinc peningkat imun.' },
  { id: '18', nama: 'Pupuk Belirang Murni', kategori: 'Tunggal', bentuk: 'Tepung', kandungan: 'Sulfur 99%', fase: ['Dasar'], minHst: -10, maxHst: 0, dosis: '2-3 g / m2', keterangan: 'Mengobati tanah asam dan pengusir jamur tanah.' },
  { id: '19', nama: 'Batu Fosfat Madura', kategori: 'Tunggal', bentuk: 'Serbuk', kandungan: 'P2O5 20-25%', fase: ['Dasar'], minHst: -15, maxHst: 0, dosis: '30 g / m2', keterangan: 'Fosfat lokal ramah lingkungan.' },
  { id: '20', nama: 'Pupuk Kalsium Karbonat Murni', kategori: 'Tunggal', bentuk: 'Tepung Mikro', kandungan: 'Kalsium 98%', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: '2-3 g / L air', keterangan: 'Penyemprotan dan pengocoran kalsium cepat.' },

  // 21 - 55: NPK MAJEMUK & BOOSTER
  { id: '21', nama: 'NPK Mutiara 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor 5g/tanaman', keterangan: 'Pupuk seimbang andalan untuk segala fase tanaman.' },
  { id: '22', nama: 'NPK Phonska 15-10-12', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'N 15%, P 10%, K 12%', fase: ['Dasar', 'Vegetatif'], minHst: 0, maxHst: 50, dosis: 'Tebar dasar / Kocor', keterangan: 'Pupuk subsidi populer untuk tanaman pangan dan hortikultura.' },
  { id: '23', nama: 'NPK Phonska Plus 15-15-15 + Zn', kategori: 'Majemuk', bentuk: 'Granul White', kandungan: 'N 15%, P 15%, K 15%, Zinc', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: 'Tebar/Kocor 5g/tanaman', keterangan: 'NPK non-subsidi Petrokimia plus Zinc.' },
  { id: '24', nama: 'NPK Grower 15-09-20', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 15%, P 9%, K 20%', fase: ['Generatif'], minHst: 40, maxHst: 90, dosis: 'Tebar/Kocor 5g', keterangan: 'Fokus untuk pembesaran buah (kalium tinggi).' },
  { id: '25', nama: 'YaraMila Winner 15-09-20', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 15%, P 9%, K 20%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: 'Tebar 5-10g', keterangan: 'Berkualitas tinggi untuk fase pembuahan.' },
  { id: '26', nama: 'YaraMila Unik 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Mudah larut, nutrisi seimbang untuk masa awal hingga panen.' },
  { id: '27', nama: 'NPK Pak Tani 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Alternatif NPK 16-16-16 asal Rusia/Eropa.' },
  { id: '28', nama: 'NPK Tawon 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Kualitas prill bagus, cepat diserap tanaman.' },
  { id: '29', nama: 'NPK Pelangi 16-16-16', kategori: 'Majemuk', bentuk: 'Granul/Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Produksi Kaltim, cukup populer.' },
  { id: '30', nama: 'NPK Mahkota 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Pilihan ekonomis pupuk seimbang.' },
  { id: '31', nama: 'KNO3 Merah CPN', kategori: 'Majemuk', bentuk: 'Kristal Prill', kandungan: 'N 15%, K2O 14%, Na 18%', fase: ['Vegetatif', 'Generatif Awal'], minHst: 15, maxHst: 50, dosis: '2-3 g / L air', keterangan: 'Cocok untuk masa pertumbuhan awal hingga menjelang bunga.' },
  { id: '32', nama: 'KNO3 Putih (PN Prill Pak Tani)', kategori: 'Majemuk', bentuk: 'Kristal Prill', kandungan: 'N 13%, K2O 45%', fase: ['Generatif'], minHst: 45, maxHst: 100, dosis: '2-5 g / L air', keterangan: 'Mencegah kerontokan bunga dan memaksimalkan pengisian buah.' },
  { id: '33', nama: 'MKP (Mono Kalium Phosphate)', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'P2O5 52%, K2O 34%', fase: ['Generatif'], minHst: 35, maxHst: 80, dosis: '2-4 g / L air', keterangan: 'Merangsang pembungaan dan mencegah bunga rontok, bebas Nitrogen.' },
  { id: '34', nama: 'MAP (Mono Ammonium Phosphate)', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'N 12%, P2O5 61%', fase: ['Vegetatif', 'Generatif Awal'], minHst: 10, maxHst: 40, dosis: '2-4 g / L air', keterangan: 'Memacu perakaran dan tunas baru dengan sangat cepat.' },
  { id: '35', nama: 'Ultradap Pak Tani', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'N 12%, P2O5 60%', fase: ['Vegetatif Awal', 'Generatif Awal'], minHst: 7, maxHst: 45, dosis: '2-4 g / L air', keterangan: 'Fosfat larut air tinggi untuk merangsang akar dan bunga.' },
  { id: '36', nama: 'DGW NPK Compaction 15-15-15', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'N 15%, P 15%, K 15% TE', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'NPK kompak dari DGW.' },
  { id: '37', nama: 'DGW NPK Booster 12-6-22', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'N 12%, P 6%, K 22% TE', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Booster pembuahan buah tebal.' },
  { id: '38', nama: 'Fertiphos Pak Tani', kategori: 'Majemuk / Tunggal', bentuk: 'Granul', kandungan: 'P2O5 20%, Ca 20%, Mg 3%', fase: ['Dasar'], minHst: 0, maxHst: 20, dosis: 'Tebar dasar', keterangan: 'Pengganti SP-36 kaya Kalsium & Magnesium.' },
  { id: '39', nama: 'NPK Kebomas 12-12-17-2', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'N 12%, P 12%, K 17%, Mg 2%', fase: ['Generatif'], minHst: 35, maxHst: 90, dosis: 'Tebar/Kocor', keterangan: 'NPK pembuahan lengkap Magnesium.' },
  { id: '40', nama: 'NPK Jaring Mas 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16%', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'NPK ekonomis.' },
  { id: '41', nama: 'NPK Kujang 15-15-15', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'N 15%, P 15%, K 15%', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'NPK buatan Pupuk Kujang.' },
  { id: '42', nama: 'NPK Bunga Buah Tawon 12-12-24', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 12%, P 12%, K 24%', fase: ['Generatif'], minHst: 45, maxHst: 100, dosis: 'Tebar/Kocor', keterangan: 'Khusus memaksimalkan bobot panen.' },
  { id: '43', nama: 'NPK Mutiara Palma 13-08-27', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 13%, P 8%, K 27% + TE', fase: ['Generatif'], minHst: 50, maxHst: 120, dosis: 'Tebar/Kocor', keterangan: 'NPK Kalium super tinggi.' },
  { id: '44', nama: 'NPK Fertila 10-20-30', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'N 10%, P 20%, K 30%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '2-4 g / L', keterangan: 'Pupuk kocor pengisi buah cepat.' },
  { id: '45', nama: 'NPK Hydroponik AB Mix Vegetables', kategori: 'Majemuk Hydro', bentuk: 'Pekatan Cair', kandungan: 'Nutrisi A & B Lengkap', fase: ['Semua Fase'], minHst: 0, maxHst: 60, dosis: '5 ml A + 5 ml B / L', keterangan: 'Nutrisi siap pakai hidroponik & kocor halus.' },
  { id: '46', nama: 'NPK Hydroponik AB Mix Buah', kategori: 'Majemuk Hydro', bentuk: 'Pekatan Cair', kandungan: 'Nutrisi A & B Kalium Tinggi', fase: ['Generatif'], minHst: 30, maxHst: 100, dosis: '5 ml A + 5 ml B / L', keterangan: 'Khusus cabai, tomat, melon hidroponik.' },
  { id: '47', nama: 'NPK Pelangi Jos 16-16-16', kategori: 'Majemuk', bentuk: 'Granul', kandungan: 'NPK 16-16-16 + Hayati', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: 'Tebar dasar/kocor', keterangan: 'NPK plus mikroba hayati pelarut hara.' },
  { id: '48', nama: 'KNO3 Putih Crystalline SQM', kategori: 'Majemuk', bentuk: 'Serbuk Putih', kandungan: 'N 13.7%, K2O 45.5%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '2-4 g / L', keterangan: 'KNO3 murni Chile 100% larut air.' },
  { id: '49', nama: 'KNO3 Merah Crystalline SQM', kategori: 'Majemuk', bentuk: 'Serbuk Merah', kandungan: 'N 15%, K2O 15%', fase: ['Vegetatif'], minHst: 10, maxHst: 45, dosis: '2-4 g / L', keterangan: 'Pertumbuhan cepat tanpa klorida.' },
  { id: '50', nama: 'NPK Mutiara NPK 15-09-20 Grower', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 15%, P 9%, K 20% + TE', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '5 g / tanaman', keterangan: 'NPK Mutiara kemasan kuning khusus buah.' },
  { id: '51', nama: 'NPK Pak Tani 13-06-27', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 13%, P 6%, K 27%', fase: ['Generatif Akhir'], minHst: 50, maxHst: 100, dosis: 'Tebar/kocor', keterangan: 'Penaik bobot akhir.' },
  { id: '52', nama: 'NPK Gold DGW 16-16-16', kategori: 'Majemuk', bentuk: 'Prill', kandungan: 'N 16%, P 16%, K 16% + Boron', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: 'Tebar/kocor', keterangan: 'NPK DGW kualitas ekstra.' },
  { id: '53', nama: 'MKP Meroke', kategori: 'Majemuk', bentuk: 'Kristal Putih', kandungan: 'P2O5 52%, K2O 34%', fase: ['Generatif'], minHst: 30, maxHst: 80, dosis: '2-4 g / L', keterangan: 'MKP murni pelindung pembungaan.' },
  { id: '54', nama: 'MAP Meroke', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'N 12%, P2O5 61%', fase: ['Vegetatif Awal'], minHst: 10, maxHst: 40, dosis: '2-3 g / L', keterangan: 'Pelebat akar dan perangsang tunas.' },
  { id: '55', nama: 'SOP / ZK Meroke (Kalium Sulfat)', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'K2O 50%, S 17%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '2-4 g / L', keterangan: 'Kalium sulfat bebas klorida untuk tembakau & horti.' },

  // 56 - 75: PUPUK DAUN & ZPT NUTRISI
  { id: '56', nama: 'GANDASIL D', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 20%, P 15%, K 15% + Mikro', fase: ['Vegetatif'], minHst: 7, maxHst: 45, dosis: '1-3 g / L air (Semprot)', keterangan: 'Pupuk daun legendaris untuk memacu pertumbuhan vegetatif.' },
  { id: '57', nama: 'GANDASIL B', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 6%, P 20%, K 30% + Mikro', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '1-3 g / L air (Semprot)', keterangan: 'Pupuk daun untuk pembentukan bunga dan buah.' },
  { id: '58', nama: 'Bayfolan', kategori: 'Pupuk Daun', bentuk: 'Cair', kandungan: 'N 11%, P 8%, K 6%', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '2 ml / L air (Semprot)', keterangan: 'Pupuk daun cair Bayer untuk memulihkan tanaman stres.' },
  { id: '59', nama: 'Atonik 6.0 L', kategori: 'ZPT / Daun', bentuk: 'Cair', kandungan: 'Natrium orto-nitrofenol', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: '1-2 ml / L air', keterangan: 'ZPT penumbuh dan pemulih sel tanaman.' },
  { id: '60', nama: 'Dekamon 22.43 L', kategori: 'ZPT / Daun', bentuk: 'Cair', kandungan: 'Natrium 2,4 dinitrofenol', fase: ['Semua Fase'], minHst: 7, maxHst: 100, dosis: '1-2 ml / L air', keterangan: 'ZPT mempercepat pemulihan tanaman.' },
  { id: '61', nama: 'Growmore 32-10-10', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 32%, P 10%, K 10%', fase: ['Vegetatif'], minHst: 7, maxHst: 35, dosis: '1-2 g / L air (Semprot)', keterangan: 'Tinggi Nitrogen untuk pacu tunas baru.' },
  { id: '62', nama: 'Growmore 10-55-10', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 10%, P 55%, K 10%', fase: ['Generatif Awal'], minHst: 30, maxHst: 60, dosis: '1-2 g / L air (Semprot)', keterangan: 'Tinggi Fosfat, starter bunga andalan.' },
  { id: '63', nama: 'Growmore 6-30-30', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 6%, P 30%, K 30%', fase: ['Generatif'], minHst: 45, maxHst: 100, dosis: '1-2 g / L air (Semprot)', keterangan: 'Fokus kualitas buah.' },
  { id: '64', nama: 'Growmore 20-20-20', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 20%, P 20%, K 20%', fase: ['Semua Fase'], minHst: 10, maxHst: 100, dosis: '1-2 g / L air (Semprot)', keterangan: 'Pupuk daun seimbang USA.' },
  { id: '65', nama: 'Sampurna D', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 28%, P 11%, K 11%', fase: ['Vegetatif'], minHst: 7, maxHst: 40, dosis: '2-3 g / L air (Semprot)', keterangan: 'Alternatif murah untuk pacu daun.' },
  { id: '66', nama: 'Sampurna B', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 16%, P 30%, K 19%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '2-3 g / L air (Semprot)', keterangan: 'Alternatif murah pacu bunga buah.' },
  { id: '67', nama: 'Mestigrow Vegetatif', kategori: 'Pupuk Daun', bentuk: 'Cair', kandungan: 'Makro Mikro Lengkap', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '2 ml / L', keterangan: 'Menyuburkan tanaman.' },
  { id: '68', nama: 'Mamigro 25-6-6 Vegetatif', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 25%, P 6%, K 6%', fase: ['Vegetatif'], minHst: 7, maxHst: 35, dosis: '1.5 - 2 g / L', keterangan: 'Pupuk daun pertumbuhan cepat.' },
  { id: '69', nama: 'Mamigro 12-27-23 Generatif', kategori: 'Pupuk Daun', bentuk: 'Serbuk', kandungan: 'N 12%, P 27%, K 23%', fase: ['Generatif'], minHst: 40, maxHst: 100, dosis: '1.5 - 2 g / L', keterangan: 'Pupuk daun pembuahan lebat.' },
  { id: '70', nama: 'Ambition Bayer', kategori: 'ZPT & Asam Amino', bentuk: 'Cair Red', kandungan: 'Asam Amino 46.9%, Asam Fulvat', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: '2-3 ml / L', keterangan: 'Anti-stres cuaca ekstrem, meningkatkan efisiensi serap pupuk.' },
  { id: '71', nama: 'Neo Kristalon Hijau 18-18-18', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 18%, P 18%, K 18% + TE', fase: ['Semua Fase'], minHst: 10, maxHst: 80, dosis: '1-2 g / L', keterangan: 'Seimbang produk Yara.' },
  { id: '72', nama: 'Neo Kristalon Merah 12-12-36', kategori: 'Pupuk Daun', bentuk: 'Kristal', kandungan: 'N 12%, P 12%, K 36% + TE', fase: ['Generatif'], minHst: 45, maxHst: 100, dosis: '1-2 g / L', keterangan: 'Kalium daun sangat tinggi.' },
  { id: '73', nama: 'GreenGuard Bio-Nutrisi', kategori: 'Pupuk Daun', bentuk: 'Cair', kandungan: 'Unsur Makro & Mikro Chelated', fase: ['Semua Fase'], minHst: 10, maxHst: 90, dosis: '2 ml / L', keterangan: 'Membuat daun tebal mengkilap.' },
  { id: '74', nama: 'VitaFlora Pemacu Bunga', kategori: 'Pupuk Daun', bentuk: 'Cair', kandungan: 'Fosfat & Kalium Cair', fase: ['Generatif Awal'], minHst: 30, maxHst: 70, dosis: '2 ml / L', keterangan: 'Merangsang keluarnya dompolan bunga.' },
  { id: '75', nama: 'Fitoflex DGW', kategori: 'Pupuk Daun Mikro', bentuk: 'Sachet Powder', kandungan: 'Fe, Mn, Zn, B, Cu, Mo Chelated', fase: ['Semua Fase'], minHst: 10, maxHst: 90, dosis: '1 sachet / 16L tangki', keterangan: 'Mikro lengkap pencegah daun kuning.' },

  // 76 - 90: KALSIUM, MAGNESIUM & UNSUR MIKRO
  { id: '76', nama: 'Calcium (Kalsium) Super Nitrat', kategori: 'Tunggal', bentuk: 'Serbuk/Cair', kandungan: 'CaCO3 / Kalsium tinggi', fase: ['Generatif', 'Vegetatif Akhir'], minHst: 30, maxHst: 100, dosis: '2-3 g / L', keterangan: 'Mencegah rontok bunga, patek, layu, dan busuk ujung buah (blossom end rot).' },
  { id: '77', nama: 'Calcinit (YaraLiva)', kategori: 'Majemuk', bentuk: 'Prill/Kristal', kandungan: 'N 15.5%, Ca 26%', fase: ['Vegetatif', 'Generatif'], minHst: 20, maxHst: 90, dosis: '2-5 g / L air (Kocor)', keterangan: 'Kalsium Nitrat cepat larut, atasi kekurangan kalsium secara cepat.' },
  { id: '78', nama: 'CNG (Calcium Nitrate Pak Tani)', kategori: 'Majemuk', bentuk: 'Kristal', kandungan: 'N 15%, Ca 26%', fase: ['Vegetatif', 'Generatif'], minHst: 20, maxHst: 90, dosis: '2-5 g / L air', keterangan: 'Mirip Calcinit, merek Pak Tani/Tawon.' },
  { id: '79', nama: 'Boron (Borate 48% / Fertibor)', kategori: 'Mikro', bentuk: 'Serbuk/Granul', kandungan: 'Boron 48%', fase: ['Vegetatif Akhir', 'Generatif'], minHst: 30, maxHst: 70, dosis: '1 g / L air', keterangan: 'Mencegah buah pecah-pecah, kaku, dan batang retak.' },
  { id: '80', nama: 'Meroke FLEX-G', kategori: 'Mikro Majemuk', bentuk: 'Serbuk', kandungan: 'Mikro lengkap Chelated', fase: ['Semua Fase'], minHst: 10, maxHst: 90, dosis: '0.5 - 1 g / L', keterangan: 'Kombinasi mikro lengkap untuk hidroponik dan semprot daun.' },
  { id: '81', nama: 'Meroke VITAFLEX', kategori: 'Mikro Majemuk', bentuk: 'Serbuk', kandungan: 'Mikro Chelated tinggi', fase: ['Semua Fase'], minHst: 10, maxHst: 90, dosis: '0.5 g / L', keterangan: 'Kualitas premium.' },
  { id: '82', nama: 'Meroke CALNIT', kategori: 'Mikro Kalsium', bentuk: 'Kristal Putih', kandungan: 'N 15.5%, CaO 26%', fase: ['Generatif'], minHst: 20, maxHst: 90, dosis: '2-4 g / L', keterangan: 'Kalsium nitrat kocor instan.' },
  { id: '83', nama: 'Zintrac 700 Yara', kategori: 'Mikro Zinc', bentuk: 'Cair Kental', kandungan: 'Zinc (Zn) 700 g/l', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '0.5 - 1 ml / L', keterangan: 'Formulasi zinc kental pencegah daun kerdil memendek.' },
  { id: '84', nama: 'Kalsium Manohara Plus Humat', kategori: 'Mikro Kalsium', bentuk: 'Tepung Putih', kandungan: 'CaCO3 90%, Asam Humat 5%', fase: ['Semua Fase'], minHst: 15, maxHst: 90, dosis: '2-3 g / L', keterangan: 'Kalsium plus pembenah tanah asam humat.' },
  { id: '85', nama: 'Cal-Ha Kalsium Asam Humat', kategori: 'Mikro Kalsium', bentuk: 'Tepung', kandungan: 'Kalsium + Asam Humat + Unsur Mikro', fase: ['Semua Fase'], minHst: 15, maxHst: 90, dosis: '2 g / L', keterangan: 'Menjaga kekuatan dinding sel tanaman.' },
  { id: '86', nama: 'Kalsium Cap Tawon', kategori: 'Mikro Kalsium', bentuk: 'Tepung', kandungan: 'Kalsium 80%, Boron 2%', fase: ['Generatif'], minHst: 30, maxHst: 90, dosis: '2 g / L', keterangan: 'Kalsium boron ekonomis.' },
  { id: '87', nama: 'Kalsium Super Cap Mahkota', kategori: 'Mikro Kalsium', bentuk: 'Tepung', kandungan: 'CaCO3 95%, Boron 1%', fase: ['Generatif'], minHst: 30, maxHst: 90, dosis: '2 g / L', keterangan: 'Melindungi kulit buah dari patek.' },
  { id: '88', nama: 'MgSO4 Magnesium Sulfat Meroke', kategori: 'Tunggal Mikro', bentuk: 'Kristal', kandungan: 'MgO 16%, S 13%', fase: ['Vegetatif'], minHst: 15, maxHst: 50, dosis: '2-4 g / L', keterangan: 'Pupuk kocor daun hijau mengkilap.' },
  { id: '89', nama: 'Librel Fe-Lo (Besi Chelated)', kategori: 'Mikro Iron', bentuk: 'Kristal Merah', kandungan: 'Iron Fe-EDTA 13%', fase: ['Vegetatif'], minHst: 10, maxHst: 40, dosis: '0.5 g / L', keterangan: 'Mengobati klorosis pucuk pucat.' },
  { id: '90', nama: 'Kamasil (Kalium Silika)', kategori: 'Tunggal', bentuk: 'Cair', kandungan: 'Kalium & Silika Cair', fase: ['Vegetatif Akhir', 'Generatif'], minHst: 30, maxHst: 90, dosis: '1-2 ml / L', keterangan: 'Menguatkan dinding sel kulit tanaman agar tidak mudah ditembus ulat & jamur.' },

  // 91 - 105: ORGANIK, HAYATI, ASAM HUMAT & ASAM AMINO
  { id: '91', nama: 'Pupuk Organik Cair (POC) NASA', kategori: 'Organik', bentuk: 'Cair', kandungan: 'Unsur Makro Mikro Organik', fase: ['Semua Fase'], minHst: 0, maxHst: 100, dosis: '3 ml / L air', keterangan: 'POC legendaris.' },
  { id: '92', nama: 'Hormonik NASA', kategori: 'ZPT / Organik', bentuk: 'Cair', kandungan: 'Hormon organik Auksin, Giberelin, Sitokinin', fase: ['Semua Fase'], minHst: 7, maxHst: 90, dosis: '1-2 ml / L air', keterangan: 'Campuran pendamping POC NASA.' },
  { id: '93', nama: 'Supernasa', kategori: 'Organik Dasar', bentuk: 'Serbuk', kandungan: 'Asam Humat, Makro Mikro', fase: ['Dasar', 'Vegetatif Awal'], minHst: 0, maxHst: 20, dosis: 'Sesuai anjuran', keterangan: 'Perbaikan unsur hara tanah (Soil Conditioner).' },
  { id: '94', nama: 'EM4 Pertanian (Kuning)', kategori: 'Hayati', bentuk: 'Cair', kandungan: 'Bakteri Fermentasi Lactobacillus, Yeast', fase: ['Dasar', 'Dekomposer'], minHst: -10, maxHst: 0, dosis: '10 ml / L air', keterangan: 'Bakteri pelarut fosfat dan pengurai kompos.' },
  { id: '95', nama: 'BiotoGrow Gold', kategori: 'Organik Hayati', bentuk: 'Cair', kandungan: 'Asam amino + Mikroba Komplit', fase: ['Semua Fase'], minHst: 10, maxHst: 100, dosis: '2-3 ml / L', keterangan: 'POC Kaya nutrisi dan mikroba baik.' },
  { id: '96', nama: 'Power Humate (Asam Humat 85%)', kategori: 'Pembenah Tanah', bentuk: 'Tepung Hitam', kandungan: 'Humic Acid 85%, Fulvic Acid 10%', fase: ['Dasar', 'Kocor'], minHst: -10, maxHst: 60, dosis: '1-2 g / L kocor', keterangan: 'Memperbaiki struktur tanah rusak, mengikat air dan kation nutrisi.' },
  { id: '97', nama: 'Black Gold Humic Acid', kategori: 'Pembenah Tanah', bentuk: 'Granul Hitam', kandungan: 'Asam Humat 70%', fase: ['Dasar'], minHst: -10, maxHst: 0, dosis: '5-10 g / m2', keterangan: 'Granul pembenah tanah lambat urai.' },
  { id: '98', nama: 'Petro Biofertil', kategori: 'Hayati', bentuk: 'Granul', kandungan: 'Mikroba Pelarut P & K, Penambat N', fase: ['Dasar'], minHst: -5, maxHst: 15, dosis: 'Tebar bersama dasar', keterangan: 'Pupuk hayati granul dari Petrokimia.' },
  { id: '99', nama: 'Pupuk Kandang Sapi Matang Fermentasi', kategori: 'Organik Dasar', bentuk: 'Padat', kandungan: 'Unsur Organik Lengkap', fase: ['Dasar'], minHst: -15, maxHst: -1, dosis: '10-20 Ton / Ha', keterangan: 'Meningkatkan KTK tanah dan kegemburan.' },
  { id: '100', nama: 'Pupuk Kandang Kambing/Domba Fermentasi', kategori: 'Organik Dasar', bentuk: 'Padat Granul/Halus', kandungan: 'N, P, K Organik Tinggi', fase: ['Dasar'], minHst: -15, maxHst: -1, dosis: '5-10 Ton / Ha', keterangan: 'Dingin dan kaya hara fosfat.' },
  { id: '101', nama: 'Pupuk Kandang Ayam Fermentasi', kategori: 'Organik Dasar', bentuk: 'Padat', kandungan: 'Nitrogen Organik Sangat Tinggi', fase: ['Dasar'], minHst: -20, maxHst: -5, dosis: '3-5 Ton / Ha', keterangan: 'Sangat subur namun wajib difermentasi matang agar tanah tidak panas.' },
  { id: '102', nama: 'Guano Kotoran Kelelawar Murni', kategori: 'Organik', bentuk: 'Serbuk', kandungan: 'Fosfat Organik 15-20%, Kalsium', fase: ['Dasar', 'Generatif'], minHst: 0, maxHst: 50, dosis: 'Tebar di bedengan 20g/m2', keterangan: 'Pupuk organik kotoran kelelawar, sangat bagus untuk bunga & buah.' },
  { id: '103', nama: 'Kascing (Bekas Cacing)', kategori: 'Organik Premium', bentuk: 'Serbuk Halus', kandungan: 'Humus Cacing, Hormon Alami', fase: ['Dasar', 'Semai'], minHst: -10, maxHst: 30, dosis: 'Campuran media semai 1:3', keterangan: 'Media semai dan pupuk organik paling halus aman untuk akar muda.' },
  { id: '104', nama: 'Primarin Asam Amino Cair', kategori: 'Organik Nutrisi', bentuk: 'Cair', kandungan: '18 Jenis Asam Amino Murni', fase: ['Semua Fase'], minHst: 10, maxHst: 90, dosis: '1-2 ml / L', keterangan: 'Mempercepat pemulihan dari serangan hama/stres panas.' },
  { id: '105', nama: 'POC Urin Kelinci Fermentasi', kategori: 'Organik Cair', bentuk: 'Cair', kandungan: 'N Organik Tinggi, ZPT Alami', fase: ['Vegetatif'], minHst: 7, maxHst: 45, dosis: '10 ml / L air', keterangan: 'Pupuk organik cair melebatkan daun dan tunas.' }
];
