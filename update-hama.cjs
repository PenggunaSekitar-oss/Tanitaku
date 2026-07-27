const fs = require('fs');

let content = fs.readFileSync('src/views/JenisHamaView.tsx', 'utf-8');

const newDataHama = `const dataHama = [
  {
    id: 1,
    nama: "Ulat Grayak",
    latin: "Spodoptera litura",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Spodoptera_litura_%2824045593674%29.jpg/1280px-Spodoptera_litura_%2824045593674%29.jpg",
    deskripsi: "Hama pemakan daun yang sangat rakus. Serangannya biasanya terjadi pada malam hari, sedangkan siang hari ulat bersembunyi di dalam tanah atau di balik daun.",
    tanaman: ["Cabai", "Tomat", "Bawang Merah", "Kubis", "Kedelai", "Jagung"],
    pembasmian: "Pengendalian mekanis dengan mengambil dan memusnahkan telur dan ulat. Penggunaan pestisida nabati dari ekstrak daun mimba atau brotowali juga cukup efektif.",
    saranPestisida: "Gunakan insektisida berbahan aktif sipermetrin, deltametrin, atau klorpirifos."
  },
  {
    id: 2,
    nama: "Kutu Daun",
    latin: "Aphids",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Aphids_September_2008-1.jpg/1280px-Aphids_September_2008-1.jpg",
    deskripsi: "Kutu kecil berukuran 1-2 mm, berwarna hijau, hitam, atau kuning. Kutu daun mengisap cairan tanaman sehingga daun mengeriting, tumbuh kerdil, dan menularkan virus.",
    tanaman: ["Cabai", "Tomat", "Kacang Panjang", "Terong", "Sawi"],
    pembasmian: "Gunakan musuh alami seperti kumbang kepik (ladybug). Cairan sabun cuci piring (ringan) yang dicampur air juga bisa digunakan sebagai alternatif ramah lingkungan.",
    saranPestisida: "Semprot dengan insektisida berbahan aktif abamektin, imidakloprid, atau dimetoat."
  },
  {
    id: 3,
    nama: "Kutu Kebul",
    latin: "Bemisia tabaci",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Silverleaf_whitefly.jpg",
    deskripsi: "Serangga kecil berwarna putih yang bersembunyi di bawah permukaan daun. Merupakan vektor utama penyebaran virus kuning (geminivirus).",
    tanaman: ["Cabai", "Tomat", "Terong", "Mentimun", "Kacang Panjang"],
    pembasmian: "Gunakan perangkap lekat kuning (yellow sticky trap) di sekitar lahan dan jaga kebersihan gulma.",
    saranPestisida: "Aplikasikan insektisida berbahan aktif imidakloprid, tiametoksam, atau abamektin."
  },
  {
    id: 4,
    nama: "Lalat Buah",
    latin: "Bactrocera spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bactrocera_dorsalis.jpg/1280px-Bactrocera_dorsalis.jpg",
    deskripsi: "Lalat dewasa menyuntikkan telur ke dalam buah. Larva (berupa belatung) akan menetas dan memakan daging buah dari dalam sehingga buah busuk dan rontok.",
    tanaman: ["Mangga", "Cabai", "Tomat", "Belimbing", "Jambu Air", "Jeruk"],
    pembasmian: "Gunakan perangkap atraktan metil eugenol (untuk lalat jantan). Lakukan pembungkusan buah sejak dini. Kumpulkan buah yang busuk/jatuh lalu musnahkan.",
    saranPestisida: "Dapat menggunakan insektisida berbahan aktif dimetoat atau fention yang dicampur dengan atraktan protein."
  },
  {
    id: 5,
    nama: "Thrips",
    latin: "Thrips spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Thysanoptera.jpg",
    deskripsi: "Serangga berukuran sangat kecil. Menyerang dengan cara menggaruk dan mengisap cairan daun, menyebabkan daun mengeriting ke atas, berwarna keperakan, dan bunga rontok.",
    tanaman: ["Cabai", "Bawang Merah", "Tomat", "Semangka", "Kacang Panjang"],
    pembasmian: "Pengaturan jarak tanam agar tidak terlalu rapat. Bisa juga menggunakan mulsa perak untuk memantulkan cahaya agar hama enggan datang.",
    saranPestisida: "Lakukan penyemprotan insektisida dengan bahan aktif abamektin, fipronil, atau karbosulfan."
  },
  {
    id: 6,
    nama: "Tungau Merah",
    latin: "Tetranychus spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tetranychus_urticae_%284883560779%29.jpg/1280px-Tetranychus_urticae_%284883560779%29.jpg",
    deskripsi: "Hama yang sangat kecil berwarna kemerahan. Biasanya menyerang di musim kemarau, menyebabkan daun bercak kuning, kusam, melengkung ke bawah, dan rontok.",
    tanaman: ["Cabai", "Tomat", "Singkong", "Jeruk", "Apel"],
    pembasmian: "Jaga kelembapan area tanam karena tungau menyukai kondisi kering. Bersihkan daun yang terserang parah.",
    saranPestisida: "Gunakan akarisida (bukan insektisida biasa) berbahan aktif abamektin, dikofol, atau propargit."
  },
  {
    id: 7,
    nama: "Penggerek Batang Padi",
    latin: "Scirpophaga innotata",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/2/24/Scirpophaga_innotata_%28ento-csiro-au%29.jpg",
    deskripsi: "Larva ulat masuk ke dalam batang padi dan merusak jaringan pembuluh. Menyebabkan gejala 'sundep' (pada tanaman muda) dan 'beluk' (malai hampa berwarna putih).",
    tanaman: ["Padi"],
    pembasmian: "Pengaturan pola tanam serentak. Penggunaan varietas tahan dan pengaturan pengairan yang baik.",
    saranPestisida: "Secara kimiawi, bisa menggunakan insektisida berbahan aktif karbofuran, fipronil, atau dimehipo."
  },
  {
    id: 8,
    nama: "Wereng Coklat",
    latin: "Nilaparvata lugens",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Nilaparvata_lugens_439632934.jpg/1280px-Nilaparvata_lugens_439632934.jpg",
    deskripsi: "Hama pengisap cairan batang padi yang berkembang biak dengan cepat. Mengakibatkan tanaman padi menguning, mengering, dan mati seperti terbakar (hopperburn).",
    tanaman: ["Padi"],
    pembasmian: "Gunakan varietas tahan wereng (VUTW). Jaga jarak tanam dengan pola jajar legowo.",
    saranPestisida: "Gunakan insektisida berbahan aktif buprofezin, imidakloprid, atau fipronil jika populasi mencapai ambang batas."
  },
  {
    id: 9,
    nama: "Keong Mas",
    latin: "Pomacea canaliculata",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pomacea_canaliculata1.jpg/1280px-Pomacea_canaliculata1.jpg",
    deskripsi: "Hama rakus yang memakan batang padi muda (baru tanam). Telurnya berwarna merah muda bergerombol di batang padi atau rumput.",
    tanaman: ["Padi"],
    pembasmian: "Pungut keong dan telurnya secara manual. Pasang saringan pada saluran masuk air lahan.",
    saranPestisida: "Gunakan moluskisida berbahan aktif niklosamida atau saponin jika serangan meluas."
  },
  {
    id: 10,
    nama: "Walang Sangit",
    latin: "Leptocorisa oratorius",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Alydidae_at_Kadavoor.jpg/960px-Alydidae_at_Kadavoor.jpg",
    deskripsi: "Serangga berbau menyengat yang mengisap cairan bulir padi saat fase masak susu, menyebabkan bulir padi menjadi hampa atau berwarna kehitaman.",
    tanaman: ["Padi"],
    pembasmian: "Kendalikan gulma di sekitar lahan karena merupakan inang alternatif. Gunakan umpan bau-bauan seperti bangkai kepiting atau keong.",
    saranPestisida: "Jika parah, semprotkan insektisida berbahan aktif BPMC, MIPC, atau fipronil."
  },
  {
    id: 11,
    nama: "Tikus Sawah",
    latin: "Rattus argentiventer",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Field_rats_infesting_rice_plants_%2811058917815%29.jpg/960px-Field_rats_infesting_rice_plants_%2811058917815%29.jpg",
    deskripsi: "Hama vertebrata yang sangat merugikan, merusak tanaman padi pada semua fase pertumbuhan. Memiliki kemampuan berkembang biak dengan cepat.",
    tanaman: ["Padi", "Jagung", "Kedelai", "Kacang Hijau"],
    pembasmian: "Gropyokan bersama (memburu tikus), sanitasi lingkungan (membersihkan semak), menggunakan musuh alami (burung hantu), dan memasang TBS (Trap Barrier System).",
    saranPestisida: "Gunakan rodentisida (racun tikus) berbahan aktif kumatetralil atau brodifakum sebagai umpan beracun."
  },
  {
    id: 12,
    nama: "Kepik Hijau",
    latin: "Nezara viridula",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Nezara_viridula_MHNT_verte.jpg/1280px-Nezara_viridula_MHNT_verte.jpg",
    deskripsi: "Serangga berbentuk perisai berwarna hijau. Mengisap cairan polong dan buah, menyebabkan biji menjadi kempis, keriput, atau berbintik hitam.",
    tanaman: ["Kedelai", "Kacang Hijau", "Kacang Panjang", "Padi"],
    pembasmian: "Kumpulkan telur dan nimfa secara mekanis. Tanam tanaman perangkap seperti sesbania di sekitar lahan.",
    saranPestisida: "Semprotkan insektisida berbahan aktif deltametrin, sipermetrin, atau klorpirifos jika populasi tinggi."
  },
  {
    id: 13,
    nama: "Ulat Tanah",
    latin: "Agrotis ipsilon",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Agrotis_ipsilon_aneituma.jpg",
    deskripsi: "Ulat berwarna coklat kehitaman. Aktif di malam hari memotong pangkal batang tanaman muda yang baru dipindah tanam, sehingga tanaman rebah dan mati.",
    tanaman: ["Tomat", "Cabai", "Kubis", "Bawang Merah", "Tembakau", "Kentang"],
    pembasmian: "Cari ulat di sekitar tanaman yang terpotong pada pagi hari lalu musnahkan. Jaga kebersihan lahan dari sisa-sisa tanaman sebelumnya.",
    saranPestisida: "Aplikasikan insektisida butiran berbahan aktif karbofuran di sekitar pangkal tanaman atau semprot dengan klorpirifos."
  },
  {
    id: 14,
    nama: "Burung Pipit",
    latin: "Lonchura leucogastroides",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Javan_Munia_0A2A7009.jpg/1280px-Javan_Munia_0A2A7009.jpg",
    deskripsi: "Burung kecil pemakan biji-bijian. Biasanya hidup berkelompok dan menyerang malai padi pada fase masak susu hingga panen, menyebabkan bulir padi rontok.",
    tanaman: ["Padi", "Sorgum"],
    pembasmian: "Gunakan alat penakut burung (orang-orangan sawah, pita kaset, jaring). Patroli secara rutin pada pagi dan sore hari.",
    saranPestisida: "Tidak ada pestisida yang dianjurkan (dilarang meracuni burung). Pengendalian hanya bersifat mengusir/menghalau secara fisik."
  },
  {
    id: 15,
    nama: "Kutu Putih",
    latin: "Pseudococcus spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mealybugs_on_flower_stem%2C_Yogyakarta%2C_2014-10-31.jpg/1280px-Mealybugs_on_flower_stem%2C_Yogyakarta%2C_2014-10-31.jpg",
    deskripsi: "Serangga penghisap getah yang tubuhnya dilapisi lapisan lilin putih (seperti serbuk). Sering berkoloni di batang, daun, atau buah, dan memicu tumbuhnya embun jelaga hitam.",
    tanaman: ["Pepaya", "Singkong", "Jeruk", "Kopi", "Mangga", "Kacang-kacangan"],
    pembasmian: "Potong dan bakar bagian tanaman yang terserang parah. Kendalikan semut yang sering menjadi agen penyebar kutu putih. Cuci dengan air sabun bertekanan.",
    saranPestisida: "Gunakan insektisida sistemik berbahan aktif imidakloprid, tiametoksam, atau penyemprotan dengan minyak putih (white oil)."
  },
  {
    id: 16,
    nama: "Ulat Bawang",
    latin: "Spodoptera exigua",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Spodoptera_exigua1.jpg/1280px-Spodoptera_exigua1.jpg",
    deskripsi: "Larva ulat masuk ke dalam rongga daun bawang dan memakan daging daun dari dalam, sehingga daun menyisakan kulit luar yang tipis dan berwarna putih tembus pandang.",
    tanaman: ["Bawang Merah", "Bawang Putih", "Bawang Daun"],
    pembasmian: "Potong daun yang memperlihatkan gejala serangan lalu musnahkan ulat di dalamnya. Gunakan kelambu kasa atau lampu perangkap (light trap).",
    saranPestisida: "Semprotkan insektisida berbahan aktif metomil, klorantraniliprol, atau lufenuron secara rotasi untuk menghindari resistensi."
  }
];`;

content = content.replace(/const dataHama = \[[\s\S]*?\];/, newDataHama);

fs.writeFileSync('src/views/JenisHamaView.tsx', content);
