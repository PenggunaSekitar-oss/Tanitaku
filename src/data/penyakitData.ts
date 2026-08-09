export interface Penyakit {
  id: string;
  nama: string;
  kategori: string; // 'Hama' | 'Jamur' | 'Bakteri' | 'Virus' | 'Nematoda'
  tanaman: string[];
  gejala: string;
  penyebab: string;
  kimia: string;
  organik: string;
  pencegahan: string;
  namaIlmiah?: string;
  bagianTerdampak?: string[];
  kondisiPemicu?: string[];
  diagnosisPembanding?: string[];
  tindakanAwal?: string;
  tingkatRisiko?: 'Rendah' | 'Sedang' | 'Tinggi';
  sumberStatus?: 'Referensi lapangan' | 'Perlu konfirmasi ahli';
}

export interface DiagnosisMetadata {
  bagianTerdampak: string[];
  kondisiPemicu: string[];
  diagnosisPembanding: string[];
  tindakanAwal: string;
  tingkatRisiko: 'Rendah' | 'Sedang' | 'Tinggi';
  sumberStatus: 'Referensi lapangan' | 'Perlu konfirmasi ahli';
}

export function getDiagnosisMetadata(item: Penyakit): DiagnosisMetadata {
  const text = `${item.nama} ${item.gejala} ${item.penyebab}`.toLowerCase();
  const bagianTerdampak = item.bagianTerdampak || [
    ...(text.includes('akar') ? ['Akar'] : []),
    ...(text.includes('batang') ? ['Batang'] : []),
    ...(text.includes('daun') ? ['Daun'] : []),
    ...(text.includes('buah') ? ['Buah'] : []),
    ...(text.includes('umbi') ? ['Umbi'] : []),
  ];

  return {
    bagianTerdampak: bagianTerdampak.length ? bagianTerdampak : ['Bagian tanaman sesuai gejala'],
    kondisiPemicu: item.kondisiPemicu || ['Periksa kelembapan, drainase, cuaca, dan riwayat lahan'],
    diagnosisPembanding: item.diagnosisPembanding || [
      'Kekurangan hara',
      'Kerusakan akar atau air',
      'Gangguan lain dengan gejala serupa',
    ],
    tindakanAwal: item.tindakanAwal || 'Foto gejala, periksa bagian bawah daun dan akar, lalu pisahkan tanaman bergejala sebelum memilih perlakuan.',
    tingkatRisiko: item.tingkatRisiko || (item.kategori === 'Virus' || item.kategori === 'Bakteri' ? 'Tinggi' : 'Sedang'),
    sumberStatus: item.sumberStatus || 'Perlu konfirmasi ahli',
  };
}

export const TANAMAN_OPTIONS = [
  { value: 'Semua', label: 'Semua Tanaman' },
  { value: 'Cabai', label: 'Cabai (Rawit/Merah/Besar)' },
  { value: 'Tomat', label: 'Tomat' },
  { value: 'Terong', label: 'Terong' },
  { value: 'Bawang Merah', label: 'Bawang Merah / Putih' },
  { value: 'Kubis', label: 'Kubis, Sawi, Brokoli (Brassicaceae)' },
  { value: 'Kacang', label: 'Kacang-kacangan (Panjang/Buncis/Kedelai)' },
  { value: 'Mentimun', label: 'Mentimun & Melon & Semangka' },
  { value: 'Kangkung', label: 'Kangkung & Bayam & Selada' },
  { value: 'Kentang', label: 'Kentang' },
  { value: 'Jagung', label: 'Jagung & Jagung Manis' },
  { value: 'Padi', label: 'Padi' },
  { value: 'Pepaya', label: 'Pepaya' },
  { value: 'Pisang', label: 'Pisang' },
  { value: 'Mangga', label: 'Mangga & Jeruk' },
  { value: 'Perkebunan', label: 'Kopi, Kakao, Karet, Sawit' }
];

export const PENYAKIT_OPTIONS = [
  { value: 'Semua', label: 'Semua Kategori Penyakit' },
  { value: 'Nematoda', label: 'Nematoda' },
  { value: 'Jamur', label: 'Penyakit Jamur / Fungi' },
  { value: 'Bakteri', label: 'Penyakit Bakteri' },
  { value: 'Virus', label: 'Penyakit Virus' },
  { value: 'Fisiologis', label: 'Gangguan Fisiologis' },
  { value: 'Defisiensi', label: 'Defisiensi Hara' }
];

export const PENYAKIT_DB: Penyakit[] = [
  // 1 - 45: HAMA SERANGGA & TIKUS/NEMATODA
  {
    id: 'h1',
    nama: 'Ulat Grayak (Spodoptera litura / frugiperda)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Jagung', 'Kacang'],
    gejala: 'Daun berlubang besar-besar, tersisa tulang daun, titik tumbuh rusak dipangkas ulat.',
    penyebab: 'Larva ngengat Spodoptera yang aktif makan malam hari.',
    kimia: 'Prevathon 50SC (Klorantraniliprol), Vayego, Curacron, Metindo, Coragen.',
    organik: 'Semprot larutan bio-insektisida Beauveria bassiana / Bacillus thuringiensis (Bt) atau Neem Oil.',
    pencegahan: 'Pasang perangkap lampu (light trap) dan periksa kelompok telur ulat di balik daun.'
  },
  {
    id: 'h2',
    nama: 'Kutu Kebul (Bemisia tabaci)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Mentimun', 'Pepaya'],
    gejala: 'Daun mengkriting, muncul jelaga hitam, membawa dan menularkan virus kuning (Gemini Virus).',
    penyebab: 'Serangga kecil putih penusuk-penghisap cairan sel daun.',
    kimia: 'Movento Energy, Sivanto Prime, Confidor, Pegasus 500SC, Alika.',
    organik: 'Semprot ekstrak daun mimba / tembakau dicampur sedikit sabun cuci piring.',
    pencegahan: 'Gunakan mulsa perak yang memantulkan sinar matahari untuk menolak kutu.'
  },
  {
    id: 'h3',
    nama: 'Thrips (Thrips parvispinus)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Terong', 'Kacang'],
    gejala: 'Bawah daun berwarna keperakan / coklat perunggu, tepi daun menggulung ke atas seperti mangkok.',
    penyebab: 'Hama Thrips berukuran sangat kecil yang menggesek dan mengisap cairan daun muda.',
    kimia: 'Demolish 18EC (Abamektin), Pegasus, Starkle 20SG, Confidor.',
    organik: 'Pemasangan perangkap pelekat warna kuning (yellow sticky trap) secara merata.',
    pencegahan: 'Jaga kelembapan tanah, hindari kekeringan ekstrem yang disukai thrips.'
  },
  {
    id: 'h4',
    nama: 'Tungau Merah / Kuning (Polyphagotarsonemus latus)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Perkebunan'],
    gejala: 'Pucuk daun menggulung melengkung ke bawah, tebal, kaku, memecah kecoklatan.',
    penyebab: 'Akarina tungau mikro di bawah daun.',
    kimia: 'Samite 135EC (Piridaben), Demolish, AgriMec, Pegasus 500SC.',
    organik: 'Semprot sulfur/belerang cair atau minyak nabati.',
    pencegahan: 'Pangkas daun tua yang terinfeksi dan bakar.'
  },
  {
    id: 'h5',
    nama: 'Lalat Buah (Bactrocera dorsalis)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Mentimun', 'Mangga', 'Pepaya'],
    gejala: 'Bintik hitam kecil pada kulit buah, buah membusuk dari dalam dan rontok berisi belatung.',
    penyebab: 'Lalat betina menyuntikkan telur ke dalam daging buah.',
    kimia: 'Buldok, Kanon 400EC, Decis, Umpan Petrogenol / Meil Eugenol.',
    organik: 'Perangkap Petrogenol dalam botol bekas dan pembungkusan buah.',
    pencegahan: 'Kumpulkan semua buah rontok lalu kubur dalam tanah minimum 50 cm.'
  },
  {
    id: 'h6',
    nama: 'Ulat Tanah (Agrotis ipsilon)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Jagung', 'Kubis'],
    gejala: 'Batang bibit muda terpotong rebah di dekat permukaan tanah pada pagi hari.',
    penyebab: 'Ulat kehitaman yang bersembunyi di dalam tanah saat siang.',
    kimia: 'Furadan 3GR / Curaterr tabur lubang, Dursban, Marshal 200EC.',
    organik: 'Aplikasi agen hayati Metarhizium anisopliae ke tanah.',
    pencegahan: 'Olah tanah sempurna dan biarkan terkena sinar matahari 1-2 minggu.'
  },
  {
    id: 'h7',
    nama: 'Pengorok Daun (Liriomyza huidobrensis)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Kentang', 'Kacang'],
    gejala: 'Garis-garis putih berkelok-kelok seperti peta pada permukaan daun.',
    penyebab: 'Larva lalat Liriomyza yang memakan jaringan mesofil di dalam daun.',
    kimia: 'Trigard 75WP (Siromazin), Demolish 18EC, Spontan.',
    organik: 'Pemasangan sticky trap warna kuning konsisten.',
    pencegahan: 'Rotasi tanaman non-inang.'
  },
  {
    id: 'h8',
    nama: 'Wereng Coklat (Nilaparvata lugens)',
    kategori: 'Hama',
    tanaman: ['Padi'],
    gejala: 'Tanaman padi menguning mengering seperti terbakar (hopperburn) melingkar di tengah sawah.',
    penyebab: 'Serangga wereng yang mengisap batang padi.',
    kimia: 'Applaud, Confidor, Dharmabas 500EC, Dantos 50WG, Starkle.',
    organik: 'Penyemprotan jamur Beauveria bassiana.',
    pencegahan: 'Tanam serempak dan kelola pengairan selang-seling (intermittent).'
  },
  {
    id: 'h9',
    nama: 'Walang Sangit (Leptocorisa oratorius)',
    kategori: 'Hama',
    tanaman: ['Padi'],
    gejala: 'Bulir padi menjadi hampa / mengapur dan berwarna coklat kehitaman.',
    penyebab: 'Kepik walang sangit mengisap cairan susu bulir padi muda.',
    kimia: 'Alika 247ZC, Matador, Decis, Dharmabas.',
    organik: 'Umpan bangkai keong / terasi yang digantung di pematang.',
    pencegahan: 'Bersihkan gulma di pematang sawah.'
  },
  {
    id: 'h10',
    nama: 'Kutu Daun (Aphids / Myzus persicae)',
    kategori: 'Hama',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Kubis', 'Kacang'],
    gejala: 'Daun mengerut membelok, pucuk kerdil, keluar embun madu manis yang mengundang semut.',
    penyebab: 'Kutu hijau / hitam berkelompok di bawah daun.',
    kimia: 'Confidor 200SL, Winder, Bamex, Pegasus.',
    organik: 'Semprotan sabun potash / minyak mimba.',
    pencegahan: 'Kendalikan semut di sekitar pangkal batang.'
  },
  {
    id: 'h11',
    nama: 'Ulat Plutella (Plutella xylostella)',
    kategori: 'Hama',
    tanaman: ['Kubis'],
    gejala: 'Daun kubis berlubang bercak putih tembus pandang seperti jendela.',
    penyebab: 'Larva hijau kecil yang sangat aktif jika disentuh.',
    kimia: 'Fastac, Prevathon, Curacron.',
    organik: 'Aplikasi bakteri Bacillus thuringiensis (Bt).',
    pencegahan: 'Tumpang sari kubis dengan tomat atau daun bawang.'
  },
  {
    id: 'h12',
    nama: 'Orong-Orong / Anjing Tanah (Gryllotalpa)',
    kategori: 'Hama',
    tanaman: ['Padi', 'Cabai', 'Bawang Merah'],
    gejala: 'Akar bibit putus terangkat, terdapat lorong-lorong kecil di tanah.',
    penyebab: 'Serangga penggali tanah.',
    kimia: 'Regent 50SC, Furadan 3GR, Marshal.',
    organik: 'Umpan dedak dicampur sedikit insektisida/organik.',
    pencegahan: 'Penggenangan lahan sementara saat olah tanah.'
  },
  {
    id: 'h13',
    nama: 'Oteng-oteng / Kumbang Daun (Epilachna)',
    kategori: 'Hama',
    tanaman: ['Terong', 'Mentimun'],
    gejala: 'Daun tersisa tulang-tulang seperti kain kasa.',
    penyebab: 'Kumbang kecil berwarna oranye berbintik hitam.',
    kimia: 'Decis, Curacron, Matador.',
    organik: 'Kutip kumbang secara manual pada pagi hari.',
    pencegahan: 'Sanitasi sisa tanaman sebelumnya.'
  },
  {
    id: 'h14',
    nama: 'Siput Babi / Keong Mas (Pomacea canaliculata)',
    kategori: 'Hama',
    tanaman: ['Padi', 'Kubis', 'Kangkung'],
    gejala: 'Batang bibit muda putus dimakan habis.',
    penyebab: 'Siput air berukuran besar.',
    kimia: 'Siputox 83PB, Metadex 99, Metaldehida.',
    organik: 'Pungut keong mas dan telur merahnya secara manual.',
    pencegahan: 'Pasang saringan di pintu masuk air irigasi.'
  },
  {
    id: 'h15',
    nama: 'Nematoda Bintil Akar (Meloidogyne spp.)',
    kategori: 'Nematoda',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Kacang'],
    gejala: 'Tanaman kerdil layu siang hari, jika dicabut akar bengkak bintil-bintil abnormal.',
    penyebab: 'Cacing mikroskopis penyerang jaringan akar.',
    kimia: 'Furadan 3GR, Curaterr 3GR, Rugby.',
    organik: 'Aplikasi jamur nematisida Paecilomyces lilacinus / kotoran ayam fermentasi.',
    pencegahan: 'Tanam bunga Marigold (Tagetes) sebagai penolak nematoda.'
  },
  {
    id: 'h16',
    nama: 'Kutu Putih / Mealybug (Pseudococcus)',
    kategori: 'Hama',
    tanaman: ['Pepaya', 'Cabai', 'Perkebunan'],
    gejala: 'Lapisan kapas putih tebal pada ketiak daun dan buah, buah mengkerut.',
    penyebab: 'Kutu berselubung lilin putih.',
    kimia: 'Movento Energy, Pegasus, Tokuthion.',
    organik: 'Semprot larutan deterjen cair + minyak mimba.',
    pencegahan: 'Pangkas cabang yang terlalu rimbun.'
  },
  {
    id: 'h17',
    nama: 'Ulat Penggerek Batang Padi (Sundep / Beluk)',
    kategori: 'Hama',
    tanaman: ['Padi'],
    gejala: 'Pucuk mati mengering (sundep) pada fase vegetatif, malai hampa putih (beluk) pada fase generatif.',
    penyebab: 'Larva ngengat Scirpophaga yang menggerogoti bagian dalam batang padi.',
    kimia: 'Spontan 400SL, Prevathon, Coragen, Regent 50SC.',
    organik: 'Pemasangan light trap untuk menangkap ngengat dewasa.',
    pencegahan: 'Tanam serempak dan tunggul padi dirabuk/ditenggelamkan.'
  },
  {
    id: 'h18',
    nama: 'Tikus Sawah (Rattus argentiventer)',
    kategori: 'Hama',
    tanaman: ['Padi', 'Jagung'],
    gejala: 'Batang tanaman terpotong miring rapi dalam radius luas dalam semalam.',
    penyebab: 'Hama mamalia tikus.',
    kimia: 'Klerat 0.005BB, Petrokum, Ratikus.',
    organik: 'Gropyokan, pengasapan sarang dengan belerang, dan konservasi burung hantu (Tyto alba).',
    pencegahan: 'Bersihkan pematang sawah agar tidak jadi sarang.'
  },
  {
    id: 'h19',
    nama: 'Ulat Tongkol Jagung (Helicoverpa armigera)',
    kategori: 'Hama',
    tanaman: ['Jagung', 'Tomat'],
    gejala: 'Ujung tongkol jagung bolong berisi kotoran ulat, biji jagung habis dimakan.',
    penyebab: 'Ulat penggerek tongkol.',
    kimia: 'Prevathon, Coragen, Curacron.',
    organik: 'Oleskan minyak goreng pada rambut jagung.',
    pencegahan: 'Tanam jagung varietas tahan.'
  },
  {
    id: 'h20',
    nama: 'Ulat Grayak Frugiperda / FAW (Spodoptera frugiperda)',
    kategori: 'Hama',
    tanaman: ['Jagung'],
    gejala: 'Pupus daun jagung hancur penuh kotoran serbuk gergaji.',
    penyebab: 'Ulat grayak tentara asal Amerika.',
    kimia: 'Vayego 200SC, Prevathon, Coragen.',
    organik: 'Taburkan abu gosok / pasir halus ke pupus daun.',
    pencegahan: 'Monitoring dini sejak jagung umur 10 HST.'
  },
  { id: 'h21', nama: 'Kepik Hijau (Nezara viridula)', kategori: 'Hama', tanaman: ['Kacang', 'Cabai', 'Padi'], gejala: 'Polong/buah kempes bercak coklat.', penyebab: 'Kepik hijau mengisap polong.', kimia: 'Alika, Matador, Buldok.', organik: 'Perangkap ekstrak herbal.', pencegahan: 'Kebersihan gulma.' },
  { id: 'h22', nama: 'Lalat Ganjur (Orseolia oryzae)', kategori: 'Hama', tanaman: ['Padi'], gejala: 'Daun padi mengulur berbentuk seperti daun bawang.', penyebab: 'Larva lalat ganjur.', kimia: 'Spontan, Regent.', organik: 'Konservasi musuh alami.', pencegahan: 'Tanam serempak.' },
  { id: 'h23', nama: 'Ulat Penggulung Daun (Cnaphalocrocis)', kategori: 'Hama', tanaman: ['Padi', 'Kacang'], gejala: 'Daun menggulung membujur berisi ulat.', penyebab: 'Larva penggulung daun.', kimia: 'Prevathon, Curacron.', organik: 'Aplikasi Bt.', pencegahan: 'Atur jarak tanam.' },
  { id: 'h24', nama: 'Kutu Sisik (Coccus viridis)', kategori: 'Hama', tanaman: ['Perkebunan', 'Mangga'], gejala: 'Bercak tempel coklat kaku di bawah daun.', penyebab: 'Serangga sisik.', kimia: 'Tokuthion, Movento.', organik: 'Semprot deterjen cair.', pencegahan: 'Pemangkasan bentuk.' },
  { id: 'h25', nama: 'Kumbang Tanduk (Oryctes rhinoceros)', kategori: 'Hama', tanaman: ['Perkebunan'], gejala: 'Daun kelapa/sawit berlubang huruf V.', penyebab: 'Kumbang tanduk.', kimia: 'Marshal tabur.', organik: 'Perangkap feromon.', pencegahan: 'Sanitasi batangan kayu lapuk.' },
  { id: 'h26', nama: 'Penggerek Buah Kakao (PBK)', kategori: 'Hama', tanaman: ['Perkebunan'], gejala: 'Buah kakao berbunyi kocak, biji lengket hitam.', penyebab: 'Larva Conopomorpha.', kimia: 'Matador, Decis.', organik: 'Penyelubungan buah (kondonisasi).', pencegahan: 'Panen sering.' },
  { id: 'h27', nama: 'Penggerek Buah Kopi (PBKo)', kategori: 'Hama', tanaman: ['Perkebunan'], gejala: 'Buah kopi berlubang di bagian ujung.', penyebab: 'Kumbang Hypothenemus.', kimia: 'Curacron.', organik: 'Jamur Beauveria bassiana.', pencegahan: 'Petik bubuk (sanitasi).' },
  { id: 'h28', nama: 'Ulat Api (Setothosea asigna)', kategori: 'Hama', tanaman: ['Perkebunan'], gejala: 'Daun sawit habis dimakan cepat.', penyebab: 'Ulat berbulu gatal.', kimia: 'Decis, Matador.', organik: 'Injeksi batang Bt.', pencegahan: 'Kembangkan predator Eocanthecona.' },
  { id: 'h29', nama: 'Ulat Jengkal (Hyposidra)', kategori: 'Hama', tanaman: ['Kacang', 'Cabai'], gejala: 'Daun habis dikerogoti dari pinggir.', penyebab: 'Ulat melengkung jengkal.', kimia: 'Curacron, Decis.', organik: 'Aplikasi Bt.', pencegahan: 'Olah tanah.' },
  { id: 'h30', nama: 'Belalang Kayu (Valanga nigricornis)', kategori: 'Hama', tanaman: ['Jagung', 'Padi', 'Perkebunan'], gejala: 'Daun robek bergerigi kasar.', penyebab: 'Belalang besar.', kimia: 'Fastac, Matador.', organik: 'Tangkap manual.', pencegahan: 'Sanitasi semak.' },

  // 31 - 105: PENYAKIT (JAMUR, BAKTERI, VIRUS)
  {
    id: 'p1',
    nama: 'Antraknosa / Patek (Colletotrichum capsici)',
    kategori: 'Jamur',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Mangga', 'Kacang'],
    gejala: 'Bercak melingkar cekung warna coklat kehitaman dengan bintik spora oranye pada buah.',
    penyebab: 'Jamur Colletotrichum yang berkembang cepat pada suhu panas basah.',
    kimia: 'Amistar Top, Score 250EC, Nativo, Octave 50WP, Antracol, Dithane M-45.',
    organik: 'Semprot ekstraksi kunyit / lengkuas + Trichoderma kocor akar.',
    pencegahan: 'Gunakan benih bebas patek dan imbangi pupuk Kalium & Kalsium.'
  },
  {
    id: 'p2',
    nama: 'Layu Fusarium (Fusarium oxysporum)',
    kategori: 'Jamur',
    tanaman: ['Cabai', 'Tomat', 'Bawang Merah', 'Pisang', 'Mentimun'],
    gejala: 'Tanaman layu permanen dimulai dari daun bawah menguning, pembuluh batang bagian dalam berwarna coklat.',
    penyebab: 'Jamur Fusarium penyerang pembuluh xilem lewat luka akar.',
    kimia: 'Topsin-M 70WP, Taft 75WP, Benlox, Delsene kocor akar.',
    organik: 'Aplikasi Trichoderma harzianum dan Gliocladium ke lubang tanam sejak awal.',
    pencegahan: 'Tingkatkan pH tanah dengan Dolomit (pH minimal 6.5).'
  },
  {
    id: 'p3',
    nama: 'Layu Bakteri (Ralstonia solanacearum)',
    kategori: 'Bakteri',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Pisang'],
    gejala: 'Tanaman layu mendadak saat daun masih hijau segar. Jika batang dipotong celup air bening keluar lendir putih (eksudat).',
    penyebab: 'Bakteri Ralstonia solanacearum di dalam tanah.',
    kimia: 'Agrept 20WP, Plantomycin, Kuproxat 345SC, Nordox 56WP.',
    organik: 'Kocor agen hayati Pseudomonas fluorescens / Bacillus subtilis.',
    pencegahan: 'Hindari perlukaan akar saat penyiangan dan gunakan mulsa.'
  },
  {
    id: 'p4',
    nama: 'Busuk Daun / Lanas (Phytophthora infestans)',
    kategori: 'Jamur',
    tanaman: ['Tomat', 'Cabai', 'Kentang'],
    gejala: 'Bercak basah keabu-abuan melebar cepat di daun, seperti tersiram air panas, berbau busuk.',
    penyebab: 'Jamur air Phytophthora di musim hujan kabut.',
    kimia: 'Revus 250SC, Acrobat 50WP, Ridomil Gold, Trivia 73WP.',
    organik: 'Semprotan larutan tembaga organik / pupuk kalsium tinggi.',
    pencegahan: 'Perlebar jarak tanam dan pangkas daun bagian bawah.'
  },
  {
    id: 'p5',
    nama: 'Virus Kuning / Gemini Virus',
    kategori: 'Virus',
    tanaman: ['Cabai', 'Tomat'],
    gejala: 'Daun menebal, cekung, berwarna kuning cerah merata, tanaman kerdil tidak berbuah.',
    penyebab: 'Gemini Virus yang ditularkan oleh vektor Kutu Kebul (Bemisia tabaci).',
    kimia: 'Tidak ada obat kimia untuk virus. Basmi vektornya (Kutu Kebul) dengan Movento / Confidor.',
    organik: 'Semprot pupuk organik cair + ZPT asam amino untuk tingkatkan imunitas.',
    pencegahan: 'Tanam varietas toleran (misal: Sios Tavi, Servo, Pilar F1).'
  },
  {
    id: 'p6',
    nama: 'Bercak Ungu / Trotol (Alternaria porri)',
    kategori: 'Jamur',
    tanaman: ['Bawang Merah'],
    gejala: 'Bercak melekuk ke dalam berwarna keunguan pada daun bawang, daun patah layu.',
    penyebab: 'Jamur Alternaria porri.',
    kimia: 'Rovral 50WP, Score 250EC, Amistar Top, Daconil 75WP.',
    organik: 'Penyemprotan larutan pembenah tanaman Trichoderma.',
    pencegahan: 'Hindari penyiraman sore hari yang menyebabkan daun basah semalaman.'
  },
  {
    id: 'p7',
    nama: 'Pucuk Pucat / Mboler (Fusarium oxysporum f.sp. cepae)',
    kategori: 'Jamur',
    tanaman: ['Bawang Merah'],
    gejala: 'Daun bawang memuntir memutar, pucuk pucat menguning, umbi membusuk.',
    penyebab: 'Jamur Fusarium spesialis bawang.',
    kimia: 'Topsin-M, Delsene kocor akar.',
    organik: 'Rendam bibit umbi dalam Trichoderma sebelum tanam.',
    pencegahan: 'Gunakan bibit umbi yang benar-benar sehat.'
  },
  {
    id: 'p8',
    nama: 'Akar Gada (Plasmodiophora brassicae)',
    kategori: 'Jamur',
    tanaman: ['Kubis'],
    gejala: 'Akar membengkak menyerupai gada/gumpalan, tanaman layu siang hari.',
    penyebab: 'Protozoa tanah pada pH asam.',
    kimia: 'Taft 75WP kocor, Nebijin.',
    organik: 'Aplikasi kapur dolomit dosis tinggi (2-3 ton/ha).',
    pencegahan: 'Naikkan pH tanah di atas 7.0.'
  },
  {
    id: 'p9',
    nama: 'Bulai Jagung (Peronosclerospora maydis)',
    kategori: 'Jamur',
    tanaman: ['Jagung'],
    gejala: 'Daun sejajar tulang berwarna putih kekuningan, tanaman kerdil tak bertongkol.',
    penyebab: 'Cendawan penyebab bulai.',
    kimia: 'Insure Max / Ridomil untuk perlakuan benih sebelum tanam.',
    organik: 'Cabut dan bakar tanaman bulai seawal mungkin.',
    pencegahan: 'Gunakan benih hibrida berlapisan fungsional bulai.'
  },
  {
    id: 'p10',
    nama: 'Blas Padi / Potong Leher (Pyricularia oryzae)',
    kategori: 'Jamur',
    tanaman: ['Padi'],
    gejala: 'Bercak belah ketupat di daun, leher malai membusuk patah (potong leher).',
    penyebab: 'Jamur Pyricularia.',
    kimia: 'Filia 525SE, Amistar Top, Seltima 100CS.',
    organik: 'Semprot larutan silika cair (Kamasil).',
    pencegahan: 'Hindari penggunaan pupuk Nitrogen (Urea) berlebihan.'
  },
  { id: 'p11', nama: 'Hawar Daun Bakteri / Kresek (Xanthomonas oryzae)', kategori: 'Bakteri', tanaman: ['Padi'], gejala: 'Garis kebasahan di tepi daun menjadi kuning mengering.', penyebab: 'Bakteri Xanthomonas.', kimia: 'Kuproxat 345SC, Agrept.', organik: 'Semprotan Pseudomonas fluorescens.', pencegahan: 'Gunakan pupuk K cukup.' },
  { id: 'p12', nama: 'Hawar Pelepah Padi (Rhizoctonia solani)', kategori: 'Jamur', tanaman: ['Padi'], gejala: 'Bercak keabu-abuan bergaris coklat di pelepah.', penyebab: 'Jamur Rhizoctonia.', kimia: 'Anvil 50SC, Score 250EC.', organik: 'Atur kelembapan rumpun.', pencegahan: 'Jarak tanam Legowo.' },
  { id: 'p13', nama: 'Penyakit Tungro', kategori: 'Virus', tanaman: ['Padi'], gejala: 'Daun menguning oranye dari pucuk, kerdil.', penyebab: 'Virus ditularkan Wereng Hijau.', kimia: 'Kendalikan Wereng Hijau dengan Confidor.', organik: 'Tanam serempak.', pencegahan: 'Varietas tahan tungro.' },
  { id: 'p14', nama: 'Embun Tepung (Powdery Mildew)', kategori: 'Jamur', tanaman: ['Mentimun', 'Cabai', 'Mangga'], gejala: 'Lapisan bedak putih halus di atas permukaan daun.', penyebab: 'Jamur Oidium.', kimia: 'Nativo 75WG, Score, Anvil.', organik: 'Semprotan susu cair / baking soda.', pencegahan: 'Sirkulasi udara lancar.' },
  { id: 'p15', nama: 'Embun Bulu (Downy Mildew)', kategori: 'Jamur', tanaman: ['Mentimun', 'Jagung'], gejala: 'Bercak kuning bersudut dibatasi urat daun, bawah daun berbulu abu-abu.', penyebab: 'Pseudoperonospora.', kimia: 'Revus, Acrobat, Dithane.', organik: 'Tembaga cair.', pencegahan: 'Pengairan tidak tergenang.' },
  { id: 'p16', nama: 'Busuk Lunak Bakteri (Pectobacterium / Erwinia)', kategori: 'Bakteri', tanaman: ['Kubis', 'Bawang Merah', 'Tomat', 'Cabai', 'Kentang'], gejala: 'Jaringan tanaman membubur basah berbau busuk sangat menyengat, melunak menjadi cairan berlendir.', penyebab: 'Bakteri Pectobacterium carotovorum / Erwinia carotovora.', kimia: 'TIDAK ADA OBAT KIMIA KURATIF (Jaringan busuk tidak dapat disembuhkan). Aplikasi Bakterisida (Agrept 20WP, Kuproxat, Plantomycin) HANYA berfungsi sebagai pelindung/sanitasi untuk membatasi penularan ke tanaman sehat.', organik: 'Cabut & musnahkan segera tanaman sakit. Kocor agen hayati Pseudomonas fluorescens / Bacillus subtilis.', pencegahan: 'Hindari perlukaan mekanis saat penyiangan, semprot Kalsium murni untuk pertebal dinding sel, dan perbaiki drainase lahan.' },
  { id: 'p17', nama: 'Rebah Semai (Damping Off)', kategori: 'Jamur', tanaman: ['Cabai', 'Tomat', 'Terong'], gejala: 'Batang semai muda menggenting busuk di permukaan tanah lalu roboh.', penyebab: 'Jamur Pythium / Rhizoctonia.', kimia: 'Previcur N, Starmyl 25WP.', organik: 'Kocor Trichoderma pada media semai.', pencegahan: 'Media semai steril & tidak becek.' },
  { id: 'p18', nama: 'Karat Daun (Puccinia)', kategori: 'Jamur', tanaman: ['Jagung', 'Kacang'], gejala: 'Bintik-bintik bisul coklat kemerahan di daun.', penyebab: 'Jamur Puccinia.', kimia: 'Anvil 50SC, Score 250EC.', organik: 'Baking soda.', pencegahan: 'Rotasi tanaman.' },
  { id: 'p19', nama: 'Virus Mosaik (TMV / CMV)', kategori: 'Virus', tanaman: ['Cabai', 'Tomat', 'Mentimun'], gejala: 'Daun belang-belang hijau muda dan tua, kerut kaku.', penyebab: 'Tobacco Mosaic Virus.', kimia: 'Basmi kutu daun vektor virus.', organik: 'Susu segar / POC.', pencegahan: 'Sanitasi perokok di kebun.' },
  { id: 'p20', nama: 'Kanker Bakteri Jeruk (Citrus Canker)', kategori: 'Bakteri', tanaman: ['Mangga'], gejala: 'Bercak gabus kasar melingkar melotot di buah & daun.', penyebab: 'Xanthomonas citri.', kimia: 'Nordox 56WP, Copcide.', organik: 'Tembaga cair.', pencegahan: 'Pangkas bagian sakit.' },
  { id: 'p21', nama: 'Penyakit Darah Pisang (Blood Disease)', kategori: 'Bakteri', tanaman: ['Pisang'], gejala: 'Buah pisang busuk hitam mengeluarkan cairan merah darah.', penyebab: 'Ralstonia solanacearum phylotype IV.', kimia: 'Suntik batang bakterisida.', organik: 'Bongkar dan bakar rumpun.', pencegahan: 'Bungkus jantung pisang.' },
  { id: 'p22', nama: 'Sigatoka Pisang (Mycosphaerella)', kategori: 'Jamur', tanaman: ['Pisang'], gejala: 'Garis-garis kuning membujur menjadi coklat kering di daun pisang.', penyebab: 'Jamur Sigatoka.', kimia: 'Score 250EC, Dithane.', organik: 'Pangkas daun sakit.', pencegahan: 'Drainase kebun baik.' },
  { id: 'p23', nama: 'Busuk Pangkal Batang Sawit (Ganoderma)', kategori: 'Jamur', tanaman: ['Perkebunan'], gejala: 'Daun menguning tombak tak membuka, muncul jamur papan di pangkal.', penyebab: 'Ganoderma boninense.', kimia: 'Trikoderma dosis tinggi.', organik: 'Trichoderma harzianum.', pencegahan: 'Bongkar tunggul tua.' },
  { id: 'p24', nama: 'VSD Kakao (Vascular Streak Dieback)', kategori: 'Jamur', tanaman: ['Perkebunan'], gejala: 'Daun menguning bercak hijau membesar, ranting mati pucuk.', penyebab: 'Oncobasidium theobromae.', kimia: 'Score 250EC.', organik: 'Pangkas ranting terinfeksi.', pencegahan: 'Tanam klon tahan VSD.' },
  { id: 'p25', nama: 'Karat Putih Chrysanthemum', kategori: 'Jamur', tanaman: ['Perkebunan'], gejala: 'Bintil-bintil putih mengkilap di bawah daun.', penyebab: 'Puccinia horiana.', kimia: 'Nativo 75WG, Amistar.', organik: 'Baking soda.', pencegahan: 'Rumah lindung teratur.' },
  { id: 'p26', nama: 'Busuk Buah Kakao (Phytophthora palmivora)', kategori: 'Jamur', tanaman: ['Perkebunan'], gejala: 'Buah kakao coklat kehitaman dari pangkal basah.', penyebab: 'Phytophthora.', kimia: 'Nordox 56WP, Ridomil.', organik: 'Penyelubungan buah.', pencegahan: 'Pangkas bentuk rimbun.' },
  { id: 'p27', nama: 'Karat Daun Kopi (Hemileia vastatrix)', kategori: 'Jamur', tanaman: ['Perkebunan'], gejala: 'Bercak oranye bertepung di bawah daun kopi.', penyebab: 'Hemileia.', kimia: 'Anvil 50SC, Amistar.', organik: 'Tembaga cair.', pencegahan: 'Tanam arabika varietas tahan.' },
  { id: 'p28', nama: 'Embun Jelaga (Capnodium)', kategori: 'Jamur', tanaman: ['Mangga'], gejala: 'Lapisan jelaga hitam menutup permukaan daun.', penyebab: 'Jamur yang tumbuh dari kotoran kutu.', kimia: 'Basmi kutu daun & semprot pencuci jelaga.', organik: 'Air sabun hangat.', pencegahan: 'Kendalikan kutu putih.' },
  { id: 'p29', nama: 'Kerdil Pisang (Bunchy Top)', kategori: 'Virus', tanaman: ['Pisang'], gejala: 'Daun pisang kerdil sempit tegak mengelompok di pucuk.', penyebab: 'Banana Bunchy Top Virus (BBTV).', kimia: 'Kendalikan Kutu Daun Pentalonia.', organik: 'Cabut dan musnahkan rumpun.', pencegahan: 'Bibit kultur jaringan.' },
  { id: 'p30', nama: 'Jamur Upas (Corticium salmonicolor)', kategori: 'Jamur', tanaman: ['Perkebunan', 'Mangga'], gejala: 'Kerak merah jambu (pink) di kulit cabang hingga mengelupas.', penyebab: 'Corticium.', kimia: 'Nordox 56WP oles.', organik: 'Bubur kalifornia.', pencegahan: 'Pangkas cabang bersinggungan.' },
  {
    id: 'fisiologis-1',
    nama: 'Busuk Ujung Buah (Blossom-end Rot)',
    kategori: 'Fisiologis',
    tanaman: ['Cabai', 'Tomat', 'Terong'],
    gejala: 'Bercak cekung kecokelatan muncul dari ujung buah lalu menghitam; jaringan tidak menunjukkan pola sebaran infeksi.',
    penyebab: 'Gangguan distribusi kalsium ke buah, sering terkait suplai air yang tidak stabil atau kerusakan akar.',
    kimia: 'Bukan penyakit menular. Jangan memilih fungisida hanya dari gejala ini; koreksi air dan hara berdasarkan kondisi lahan.',
    organik: 'Jaga kelembapan tanah stabil dengan mulsa dan bahan organik matang.',
    pencegahan: 'Hindari siklus sangat kering lalu sangat basah dan pemupukan nitrogen berlebihan.',
    bagianTerdampak: ['Buah'],
    kondisiPemicu: ['Irigasi tidak stabil', 'Akar terganggu', 'Salinitas atau nitrogen berlebih'],
    diagnosisPembanding: ['Antraknosa pada buah', 'Luka matahari', 'Busuk buah bakteri'],
    tindakanAwal: 'Belah beberapa buah, cek pola bercak dari ujung buah, lalu evaluasi kelembapan dan kondisi akar.',
    tingkatRisiko: 'Sedang',
    sumberStatus: 'Referensi lapangan'
  },
  {
    id: 'fisiologis-2',
    nama: 'Luka Terbakar Matahari (Sunscald)',
    kategori: 'Fisiologis',
    tanaman: ['Cabai', 'Tomat', 'Mangga'],
    gejala: 'Bercak pucat atau putih kecokelatan pada sisi buah yang terpapar langsung, kemudian jaringan mengering.',
    penyebab: 'Paparan panas dan radiasi tinggi setelah buah kehilangan naungan daun.',
    kimia: 'Tidak memerlukan pestisida. Lindungi buah dan pulihkan kanopi secara bertahap.',
    organik: 'Gunakan naungan ringan atau pertahankan kanopi sehat.',
    pencegahan: 'Hindari pemangkasan berat menjelang cuaca sangat panas.',
    bagianTerdampak: ['Buah'],
    kondisiPemicu: ['Cuaca sangat panas', 'Kanopi terbuka', 'Pemangkasan berat'],
    diagnosisPembanding: ['Busuk ujung buah', 'Antraknosa', 'Luka mekanis'],
    tindakanAwal: 'Amati posisi bercak terhadap arah matahari dan pastikan tidak ada tanda infeksi menyebar.',
    tingkatRisiko: 'Rendah',
    sumberStatus: 'Referensi lapangan'
  },
  {
    id: 'defisiensi-1',
    nama: 'Defisiensi Nitrogen',
    kategori: 'Defisiensi',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Jagung', 'Padi', 'Kacang'],
    gejala: 'Daun tua menguning relatif merata, pertumbuhan lambat, dan tanaman tampak pucat.',
    penyebab: 'Pasokan atau serapan nitrogen tidak mencukupi; akar, pH, dan kehilangan hara perlu diperiksa.',
    kimia: 'Konfirmasi lewat riwayat pemupukan atau uji tanah/daun sebelum menambah pupuk nitrogen.',
    organik: 'Gunakan sumber organik matang sesuai analisis kebutuhan lahan.',
    pencegahan: 'Bagi aplikasi nitrogen dan sesuaikan dengan fase serta potensi kehilangan.',
    bagianTerdampak: ['Daun tua', 'Seluruh tajuk'],
    kondisiPemicu: ['Tanah miskin bahan organik', 'Pencucian hara', 'Akar tidak sehat'],
    diagnosisPembanding: ['Genangan akar', 'Defisiensi sulfur', 'Penyakit pembuluh'],
    tindakanAwal: 'Bandingkan daun tua dan muda, cek akar serta riwayat pupuk, lalu lakukan uji tanah bila memungkinkan.',
    tingkatRisiko: 'Sedang',
    sumberStatus: 'Referensi lapangan'
  },
  {
    id: 'defisiensi-2',
    nama: 'Defisiensi Kalium',
    kategori: 'Defisiensi',
    tanaman: ['Cabai', 'Tomat', 'Jagung', 'Padi', 'Kacang'],
    gejala: 'Tepi daun tua menguning lalu mengering seperti terbakar; pengisian buah atau biji dapat terganggu.',
    penyebab: 'Serapan kalium rendah atau tidak seimbang dengan unsur lain.',
    kimia: 'Koreksi sumber kalium berdasarkan analisis tanah dan kebutuhan komoditas, bukan dari warna daun saja.',
    organik: 'Perbaiki bahan organik dan kesehatan akar; kandungan hara bahan organik tetap perlu diketahui.',
    pencegahan: 'Pertahankan keseimbangan hara dan kelembapan tanah.',
    bagianTerdampak: ['Tepi daun tua', 'Buah atau biji'],
    kondisiPemicu: ['Tanah berpasir', 'Pencucian hara', 'Keseimbangan kation terganggu'],
    diagnosisPembanding: ['Daun terbakar garam', 'Kekeringan', 'Penyakit bercak daun'],
    tindakanAwal: 'Periksa pola simetris pada daun tua dan cek salinitas serta riwayat pemupukan.',
    tingkatRisiko: 'Sedang',
    sumberStatus: 'Referensi lapangan'
  },
  {
    id: 'defisiensi-3',
    nama: 'Defisiensi Magnesium',
    kategori: 'Defisiensi',
    tanaman: ['Cabai', 'Tomat', 'Jagung', 'Kacang', 'Perkebunan'],
    gejala: 'Jaringan di antara tulang daun tua menguning sementara tulang daun tetap lebih hijau.',
    penyebab: 'Magnesium kurang tersedia atau serapannya terganggu oleh ketidakseimbangan kalium/kalsium dan pH.',
    kimia: 'Konfirmasi pH dan analisis hara sebelum koreksi magnesium.',
    organik: 'Perbaiki pH dan bahan organik sesuai hasil analisis tanah.',
    pencegahan: 'Hindari pemupukan satu unsur berlebihan dan pantau pH.',
    bagianTerdampak: ['Daun tua'],
    kondisiPemicu: ['Tanah masam', 'Kalium berlebih', 'Pencucian hara'],
    diagnosisPembanding: ['Defisiensi besi pada daun muda', 'Virus mosaik', 'Kerusakan akar'],
    tindakanAwal: 'Pastikan gejala mulai dari daun tua dan cek pH sebelum menambah unsur.',
    tingkatRisiko: 'Sedang',
    sumberStatus: 'Referensi lapangan'
  },
  {
    id: 'defisiensi-4',
    nama: 'Defisiensi Besi',
    kategori: 'Defisiensi',
    tanaman: ['Cabai', 'Tomat', 'Terong', 'Kacang', 'Perkebunan'],
    gejala: 'Daun muda menguning di antara tulang daun, sedangkan tulang daun tetap hijau.',
    penyebab: 'Besi tidak tersedia bagi akar, sering terkait pH terlalu tinggi atau akar terganggu.',
    kimia: 'Periksa pH media/tanah dan kesehatan akar sebelum menggunakan sumber besi.',
    organik: 'Tambahkan bahan organik matang secara bertahap bila sesuai hasil pemeriksaan tanah.',
    pencegahan: 'Jaga pH sesuai kebutuhan komoditas dan drainase akar.',
    bagianTerdampak: ['Daun muda'],
    kondisiPemicu: ['pH tinggi', 'Akar tergenang', 'Media terlalu berkapur'],
    diagnosisPembanding: ['Defisiensi magnesium', 'Defisiensi sulfur', 'Kerusakan herbisida'],
    tindakanAwal: 'Bandingkan daun termuda dan daun tua, lalu ukur pH media atau tanah.',
    tingkatRisiko: 'Sedang',
    sumberStatus: 'Referensi lapangan'
  }
];

export const HAMA_DB = PENYAKIT_DB.filter((item) => item.kategori === 'Hama');
export const PENYAKIT_ONLY_DB = PENYAKIT_DB.filter((item) => item.kategori !== 'Hama');
