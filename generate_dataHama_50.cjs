const fs = require('fs');
let content = fs.readFileSync('src/views/JenisHamaView.tsx', 'utf-8');

const newData = `const dataHama = [
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
    tanaman: ["Cabai", "Tomat", "Bawang Merah", "Semangka", "Melon"],
    pembasmian: "Pasang perangkap lekat kuning atau biru. Jaga kelembapan tanah dan sanitasi kebun secara rutin.",
    saranPestisida: "Gunakan insektisida berbahan aktif abamektin, fipronil, atau klorfenapir."
  },
  {
    id: 6,
    nama: "Wereng Coklat",
    latin: "Nilaparvata lugens",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Hama utama pada tanaman padi yang mengisap cairan batang, menyebabkan tanaman menguning, kering, dan mati (hopperburn).",
    tanaman: ["Padi"],
    pembasmian: "Gunakan varietas padi tahan wereng. Terapkan sistem tanam jajar legowo dan pelihara musuh alami seperti laba-laba.",
    saranPestisida: "Insektisida berbahan aktif imidakloprid, buprofezin, atau pimetrozin."
  },
  {
    id: 7,
    nama: "Walang Sangit",
    latin: "Leptocorisa oratoria",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Hama yang mengeluarkan bau menyengat khas saat diganggu. Menyerang bulir padi muda yang sedang masak susu sehingga gabah menjadi hampa atau berwarna coklat.",
    tanaman: ["Padi"],
    pembasmian: "Kumpulkan walang sangit secara manual pada pagi hari. Gunakan umpan bau-bauan seperti daging busuk atau bangkai keong mas.",
    saranPestisida: "Insektisida berbahan aktif BPMC, fipronil, atau metomil."
  },
  {
    id: 8,
    nama: "Penggerek Batang",
    latin: "Scirpophaga incertulas",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Fase larva masuk ke dalam batang padi dan memutus jaringan, menyebabkan pucuk layu (sundep) pada fase vegetatif dan malai hampa (beluk) pada fase generatif.",
    tanaman: ["Padi"],
    pembasmian: "Pemotongan pangkal jerami saat panen, penggenangan sawah, dan rotasi tanaman.",
    saranPestisida: "Insektisida sistemik berbahan aktif karbofuran, klorantraniliprol, atau dimehipo."
  },
  {
    id: 9,
    nama: "Tungau Merah",
    latin: "Tetranychus spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Bukan serangga melainkan kerabat laba-laba. Ukuran sangat kecil, bersembunyi di bawah daun, menyebabkan daun melengkung ke bawah, menebal, dan berwarna tembaga.",
    tanaman: ["Cabai", "Tomat", "Mentimun", "Singkong", "Jeruk"],
    pembasmian: "Lakukan penyiraman yang cukup karena tungau menyukai kondisi kering dan panas.",
    saranPestisida: "Akarisida (bukan insektisida biasa) berbahan aktif abamektin, piridaben, atau propargit."
  },
  {
    id: 10,
    nama: "Ulat Tanah",
    latin: "Agrotis ipsilon",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat berwarna coklat tua hingga hitam yang hidup di dalam tanah. Memotong pangkal batang tanaman muda yang baru dipindah tanam pada malam hari.",
    tanaman: ["Cabai", "Tomat", "Kubis", "Bawang Merah", "Jagung"],
    pembasmian: "Pembersihan lahan dari sisa tanaman sebelumnya. Mencari ulat di sekitar pangkal batang tanaman yang terpotong pada pagi hari.",
    saranPestisida: "Insektisida tabur (butiran/granul) berbahan aktif karbofuran atau klorpirifos di sekitar lubang tanam."
  },
  {
    id: 11,
    nama: "Kepik Hijau",
    latin: "Nezara viridula",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Kepik yang menghisap cairan polong atau buah. Meninggalkan bekas tusukan hitam pada polong kacang-kacangan atau buah.",
    tanaman: ["Kacang Panjang", "Kedelai", "Buncis"],
    pembasmian: "Pengumpulan secara manual dan menjaga kebersihan gulma.",
    saranPestisida: "Insektisida deltametrin atau sipermetrin."
  },
  {
    id: 12,
    nama: "Orong-Orong",
    latin: "Gryllotalpa sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Serangga tanah (anjing tanah) yang suka memakan akar dan pangkal batang tanaman muda di lahan basah/sawah.",
    tanaman: ["Padi", "Bibit Sayuran"],
    pembasmian: "Penggenangan lahan, pemasangan umpan beracun.",
    saranPestisida: "Insektisida tabur karbofuran."
  },
  {
    id: 13,
    nama: "Oteng-Oteng",
    latin: "Epilachna sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Kumbang daun (kepik kepik) berwarna oranye berbintik hitam. Memakan daun secara tidak beraturan menyisakan tulang daun.",
    tanaman: ["Mentimun", "Kacang", "Terong"],
    pembasmian: "Pungut hama secara manual pagi/sore hari.",
    saranPestisida: "Insektisida kontak (Sipermetrin)."
  },
  {
    id: 14,
    nama: "Siput Babi / Bekicot",
    latin: "Achatina fulica",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Makan daun dan batang muda, meninggalkan bekas lendir mengkilap di pagi hari.",
    tanaman: ["Bibit Sayuran", "Kubis", "Sawi"],
    pembasmian: "Tabur abu kayu atau garam di sekeliling bedengan.",
    saranPestisida: "Moluskisida tabur (Metaldehida)."
  },
  {
    id: 15,
    nama: "Rayap",
    latin: "Isoptera",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Hama tanah yang memakan material kayu, juga bisa menyerang perakaran tanaman kayu-kayuan dan stek.",
    tanaman: ["Singkong", "Karet", "Kopi", "Cengkeh"],
    pembasmian: "Menghancurkan sarang, memastikan tidak ada sisa kayu mati di lahan.",
    saranPestisida: "Insektisida fipronil atau klorpirifos (kocor)."
  },
  {
    id: 16,
    nama: "Nematoda Bintil Akar",
    latin: "Meloidogyne spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Root-knot_nematode.jpg/960px-Root-knot_nematode.jpg",
    deskripsi: "Cacing mikroskopis di dalam tanah yang menyerang akar sehingga membengkak/bintil-bintil. Tanaman kerdil dan layu siang hari.",
    tanaman: ["Tomat", "Cabai", "Mentimun", "Seledri"],
    pembasmian: "Rotasi tanaman dengan Tagetes (Bunga Kenikir/Marigold).",
    saranPestisida: "Nematisida karbofuran atau etoprofos."
  },
  {
    id: 17,
    nama: "Lalat Pengorok Daun",
    latin: "Liriomyza spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Lalat kecil yang menyuntikkan telur ke dalam daun. Larvanya memakan mesofil daun membentuk guratan putih berliku-liku.",
    tanaman: ["Bawang Merah", "Tomat", "Kentang"],
    pembasmian: "Gunakan perangkap lekat kuning. Bersihkan daun yang terserang.",
    saranPestisida: "Insektisida abamektin atau siromazin."
  },
  {
    id: 18,
    nama: "Ulat Jengkal",
    latin: "Chrysodeixis chalcites",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat hijau pucat yang berjalan dengan cara melengkungkan (menjengkal) tubuhnya. Memakan daun hingga bolong besar.",
    tanaman: ["Kacang Panjang", "Kedelai", "Sawi"],
    pembasmian: "Kumpulkan ulat secara mekanis.",
    saranPestisida: "Insektisida deltametrin atau profenofos."
  },
  {
    id: 19,
    nama: "Ulat Penggulung Daun",
    latin: "Lamprosema indicate",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat yang merekatkan daun menggunakan benang sutra untuk bersembunyi di dalamnya sambil memakan daun.",
    tanaman: ["Kacang Hijau", "Kedelai"],
    pembasmian: "Pijit daun yang menggulung untuk mematikan ulat di dalamnya.",
    saranPestisida: "Insektisida sistemik klorantraniliprol atau dimehipo."
  },
  {
    id: 20,
    nama: "Kutu Putih (Mealybug)",
    latin: "Pseudococcidae",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Serangga penghisap cairan berselimut lilin putih bertepung. Menyebabkan pertumbuhan kerdil dan muncul jamur jelaga hitam.",
    tanaman: ["Pepaya", "Singkong", "Jambu", "Mangga"],
    pembasmian: "Semprot dengan campuran air sabun pencuci piring dan sedikit minyak nabati untuk merontokkan lilin pelindungnya.",
    saranPestisida: "Insektisida imidakloprid atau klorpirifos (tambahkan perekat/perata)."
  },
  {
    id: 21,
    nama: "Belalang Kayu",
    latin: "Valanga nigricornis",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Belalang besar yang memakan daun dengan porsi besar, menyebabkan defoliasi pada daun tua dan muda.",
    tanaman: ["Jagung", "Pisang", "Padi", "Kelapa"],
    pembasmian: "Tangkapan manual pada malam/pagi hari, atau tebang ranting tempat mereka bertelur.",
    saranPestisida: "Insektisida kontak (Sipermetrin/Deltametrin)."
  },
  {
    id: 22,
    nama: "Ulat Plutella",
    latin: "Plutella xylostella",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat hijau kecil yang melubangi daun kubis-kubisan, menyisakan lapisan epidermis tipis (daun tampak transparan).",
    tanaman: ["Kubis", "Sawi", "Brokoli"],
    pembasmian: "Rotasi tanaman dan penanaman tumpangsari (misal dengan tomat) untuk menolak hama.",
    saranPestisida: "Insektisida klorfenapir atau biopestisida Bacillus thuringiensis (Bt)."
  },
  {
    id: 23,
    nama: "Ulat Bawang",
    latin: "Spodoptera exigua",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat memakan daun bawang dari dalam tabung daun, sehingga daun terlihat putih transparan dan kempes.",
    tanaman: ["Bawang Merah", "Bawang Putih", "Bawang Daun"],
    pembasmian: "Membuang kelompok telur yang biasanya ada di ujung daun.",
    saranPestisida: "Insektisida metomil atau klorantraniliprol."
  },
  {
    id: 24,
    nama: "Semut Api",
    latin: "Solenopsis invicta",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Bersimbiosis dengan kutu daun, melindungi kutu dari predator dan memakan ekskresinya (embun madu). Gigitannya perih.",
    tanaman: ["Cabai", "Tomat", "Tanaman Buah"],
    pembasmian: "Gunakan umpan gula dicampur boraks.",
    saranPestisida: "Insektisida fipronil atau klorpirifos (kocor sarang)."
  },
  {
    id: 25,
    nama: "Lalat Ganjur",
    latin: "Orseolia oryzae",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Larva lalat menyerang titik tumbuh padi, menyebabkan daun menggulung seperti pipa buntu (puru/ganjur) dan tidak keluar malai.",
    tanaman: ["Padi"],
    pembasmian: "Pemupukan K berimbang dan tidak terlalu banyak Nitrogen.",
    saranPestisida: "Insektisida sistemik butiran (Karbofuran/Fipronil) saat sebar benih."
  },
  {
    id: 26,
    nama: "Ulat Api",
    latin: "Setora nitens",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat berbulu menyengat yang menyerang kelapa sawit dan tanaman perkebunan lain, menghabiskan daun kelapa dari bawah ke atas.",
    tanaman: ["Kelapa Sawit", "Kelapa"],
    pembasmian: "Penggunaan jamur Cordyceps atau virus ulat api.",
    saranPestisida: "Insektisida deltametrin."
  },
  {
    id: 27,
    nama: "Kutu Sisik",
    latin: "Lepidosaphes beckii",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Hama yang menempel erat pada kulit batang/daun dan tertutup lapisan seperti sisik/perisai keras. Menyedot nutrisi tanaman.",
    tanaman: ["Jeruk", "Kopi", "Cengkeh"],
    pembasmian: "Sikat bagian yang terserang. Pangkas dahan yang rimbun.",
    saranPestisida: "Insektisida + White Oil (Minyak Putih) agar menembus perisai."
  },
  {
    id: 28,
    nama: "Ulat Grayak Jagung",
    latin: "Spodoptera frugiperda (FAW)",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Fall Armyworm, ulat invansif baru yang sangat merusak tanaman jagung, bersembunyi di pucuk daun (titik tumbuh).",
    tanaman: ["Jagung"],
    pembasmian: "Tanam serempak. Tumpangsari dengan legum.",
    saranPestisida: "Insektisida emamektin benzoat atau klorantraniliprol, semprot tepat di pucuk."
  },
  {
    id: 29,
    nama: "Kumbang Badak",
    latin: "Oryctes rhinoceros",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Menyerang titik tumbuh kelapa dan sawit muda, membuat daun baru yang tumbuh terpotong berbentuk huruf V.",
    tanaman: ["Kelapa", "Kelapa Sawit"],
    pembasmian: "Kumpulkan kumbang manual dari titik tumbuh, gunakan jamur Metarhizium anisopliae di tempat tumpukan bahan organik.",
    saranPestisida: "Karbofuran tabur di pucuk tanaman muda."
  },
  {
    id: 30,
    nama: "Tikus Sawah",
    latin: "Rattus argentiventer",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Hama pengerat yang memotong batang padi, menyebabkan kerusakan masif dan gagal panen secara cepat.",
    tanaman: ["Padi"],
    pembasmian: "Gropyokan, penggunaan burung hantu (Tyto alba), pemasangan TBS (Trap Barrier System).",
    saranPestisida: "Rodentisida (Racun Tikus) seperti Brodifakum."
  },
  {
    id: 31,
    nama: "Kutu Loncat",
    latin: "Heteropsylla cubana",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Serangga kecil yang meloncat saat didekati, sering menyerang lamtoro, jeruk, cengkeh. Pucuk daun keriting dan gosong.",
    tanaman: ["Lamtoro", "Jeruk", "Kopi"],
    pembasmian: "Memelihara musuh alami seperti kumbang kubah.",
    saranPestisida: "Insektisida imidakloprid."
  },
  {
    id: 32,
    nama: "Gusung / Bubuk Jagung",
    latin: "Sitophilus zeamais",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Kumbang kecil bermoncong panjang yang melubangi biji jagung dan beras di tempat penyimpanan (gudang).",
    tanaman: ["Jagung (Gudang)", "Beras"],
    pembasmian: "Jemur biji sampai kadar air rendah (<12%), simpan di wadah kedap udara.",
    saranPestisida: "Fumigasi menggunakan Fosfin (Alumunium Fosfida)."
  },
  {
    id: 33,
    nama: "Lalat Bibit",
    latin: "Atherigona sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Lalat kecil bertelur di batang jagung muda. Larvanya memakan jaringan batang membuat titik tumbuh membusuk kekuningan.",
    tanaman: ["Jagung (fase V1-V3)"],
    pembasmian: "Menanam benih jagung dengan serempak.",
    saranPestisida: "Perlakuan benih (Seed treatment) dengan insektisida tiametoksam."
  },
  {
    id: 34,
    nama: "Keong Mas",
    latin: "Pomacea canaliculata",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Memotong bibit padi muda (umur <30 hst). Berkembang biak sangat cepat dengan telur berwarna merah muda cerah di batang/pematang.",
    tanaman: ["Padi"],
    pembasmian: "Pungut telur merah dan keong mas secara manual. Pasang saringan pada saluran air masuk.",
    saranPestisida: "Moluskisida berbahan aktif niklosamida."
  },
  {
    id: 35,
    nama: "Penggerek Batang Cengkeh",
    latin: "Nothopeus sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Larva serangga masuk ke batang cengkeh, membuat lubang yang mengeluarkan serbuk gergaji/cairan. Batang mudah patah.",
    tanaman: ["Cengkeh"],
    pembasmian: "Tutup lubang gerek dengan pasak kayu.",
    saranPestisida: "Injeksi insektisida (klorpirifos/fipronil) ke dalam lubang lalu ditutup."
  },
  {
    id: 36,
    nama: "Penggerek Buah Kakao",
    latin: "Conopomorpha cramerella (PBK)",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Larva memakan biji kakao di dalam buah, menyebabkan buah matang tidak merata dan biji saling melekat (susah dikeluarkan).",
    tanaman: ["Kakao"],
    pembasmian: "Selubungi buah (kondomisasi), panen sering, pemangkasan bentuk.",
    saranPestisida: "Penyemprotan insektisida kontak (Deltametrin) bergilir."
  },
  {
    id: 37,
    nama: "Helopeltis",
    latin: "Helopeltis antonii",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Kepik penghisap yang menimbulkan bercak-bercak hitam cekung (nekrotik) pada daun pucuk, buah kakao, teh, dan jambu mete.",
    tanaman: ["Kakao", "Teh", "Jambu Mete"],
    pembasmian: "Pemangkasan tajuk agar tidak terlalu rimbun.",
    saranPestisida: "Insektisida profenofos atau sipermetrin."
  },
  {
    id: 38,
    nama: "Kumbang Moncong Kelapa",
    latin: "Rhynchophorus ferrugineus",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Kumbang merah penggerek pucuk kelapa. Larvanya memakan jaringan tajuk dan batang menyebabkan tajuk patah tak berdaya.",
    tanaman: ["Kelapa"],
    pembasmian: "Membersihkan luka pada batang dan memusnahkan sisa tanaman kelapa busuk.",
    saranPestisida: "Karbofuran yang diletakkan di pangkal pelepah."
  },
  {
    id: 39,
    nama: "Kutu Perisai",
    latin: "Diaspididae",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Hama yang dilindungi perisai tipis, menghisap cairan batang dan daun jeruk. Sering bersimbiosis dengan semut.",
    tanaman: ["Jeruk", "Apel", "Kopi"],
    pembasmian: "Gosok batang dengan sikat.",
    saranPestisida: "Semprot dengan insektisida imidakloprid + perekat (minyak mineral)."
  },
  {
    id: 40,
    nama: "Burung Pipit",
    latin: "Lonchura sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Memakan bulir padi menjelang masa panen dalam jumlah koloni besar.",
    tanaman: ["Padi", "Sorgum"],
    pembasmian: "Gunakan orang-orangan sawah, jaring penutup, atau pita mengkilap.",
    saranPestisida: "Gunakan bahan kimia penolak (Repellent) non-toksik."
  },
  {
    id: 41,
    nama: "Tungau Kuning",
    latin: "Polyphagotarsonemus latus",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Tungau berukuran sangat mikroskopis yang membuat daun muda menjadi kaku, melengkung ke atas, menyempit, dan seperti tembaga.",
    tanaman: ["Cabai", "Tomat"],
    pembasmian: "Penyiraman kebun secara menyeluruh, membersihkan gulma yang kering.",
    saranPestisida: "Akarisida berbahan aktif abamektin."
  },
  {
    id: 42,
    nama: "Ulat Daun Pisang",
    latin: "Erionota thrax",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat hijau besar yang menggulung daun pisang menjadi bentuk tabung khas. Ulat dilapisi semacam serbuk putih.",
    tanaman: ["Pisang"],
    pembasmian: "Menggunting dan membakar daun pisang yang menggulung.",
    saranPestisida: "Biasanya cukup pengendalian mekanis, jarang butuh pestisida kimia."
  },
  {
    id: 43,
    nama: "Lalat Bawang",
    latin: "Delia antiqua",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Belatung merusak umbi dan akar bawang, tanaman menjadi layu kekuningan, umbi membusuk.",
    tanaman: ["Bawang Merah"],
    pembasmian: "Penyiapan lahan yang matang dan pemupukan yang seimbang.",
    saranPestisida: "Insektisida sistemik granula (tabur)."
  },
  {
    id: 44,
    nama: "Ngengat Umbi Kentang",
    latin: "Phthorimaea operculella",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Larva melubangi umbi kentang baik di lahan maupun di gudang penyimpanan. Umbi rusak dan tidak bernilai jual.",
    tanaman: ["Kentang"],
    pembasmian: "Simpan umbi di tempat yang sejuk dan terlindung dari ngengat.",
    saranPestisida: "Insektisida spinosad."
  },
  {
    id: 45,
    nama: "Kutu Darah / Kutu Putih Kopi",
    latin: "Planococcus citri",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Thrips_tabaci.jpg/960px-Thrips_tabaci.jpg",
    deskripsi: "Menempel di tandan buah dan daun kopi. Mengisap cairan dan menimbulkan cendawan jelaga hitam. Jika dipencet mengeluarkan cairan merah (darah).",
    tanaman: ["Kopi", "Kakao", "Jeruk"],
    pembasmian: "Pangkas rimbun kopi, jaga naungan agar cukup cahaya masuk.",
    saranPestisida: "Insektisida sistemik imidakloprid."
  },
  {
    id: 46,
    nama: "Ulat Krop Kubis",
    latin: "Crocidolomia pavonana",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Ulat yang menyerang titik tumbuh (krop) kubis. Memakan habis titik tumbuh sebelum sempat membentuk bulatan krop.",
    tanaman: ["Kubis", "Brokoli"],
    pembasmian: "Pengambilan kelompok telur secara rutin.",
    saranPestisida: "Insektisida klorantraniliprol atau profenofos."
  },
  {
    id: 47,
    nama: "Ulat Penggerek Batang Jagung",
    latin: "Ostrinia furnacalis",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Spodoptera_litura_01.jpg/960px-Spodoptera_litura_01.jpg",
    deskripsi: "Masuk memakan batang dan tongkol jagung. Batang mudah patah dan tongkol tidak terisi sempurna.",
    tanaman: ["Jagung"],
    pembasmian: "Musnahkan sisa panen jagung.",
    saranPestisida: "Insektisida butiran melalui pucuk tanaman muda."
  },
  {
    id: 48,
    nama: "Kepik Coklat",
    latin: "Riptortus linearis",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Kepik berbadan ramping, coklat kekuningan. Menyerang polong kedelai/kacang-kacangan menyebabkannya hampa.",
    tanaman: ["Kedelai", "Kacang Hijau"],
    pembasmian: "Pembersihan gulma inang.",
    saranPestisida: "Insektisida BPMC atau deltametrin."
  },
  {
    id: 49,
    nama: "Babi Hutan",
    latin: "Sus scrofa",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Hama mamalia yang memakan dan membongkar perakaran umbi-umbian (singkong), jagung, kacang.",
    tanaman: ["Singkong", "Kacang Tanah", "Padi"],
    pembasmian: "Pemagaran dengan seng atau kawat. Perburuan masal.",
    saranPestisida: "-"
  },
  {
    id: 50,
    nama: "Kera / Monyet",
    latin: "Macaca sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/960px-Bactrocera_dorsalis.jpg",
    deskripsi: "Merusak dan memakan buah, tongkol jagung, padi di ladang yang berbatasan dengan hutan.",
    tanaman: ["Jagung", "Pisang", "Kakao"],
    pembasmian: "Penjagaan, pemasangan jaring, penggunaan petasan/suara.",
    saranPestisida: "-"
  }
];`;

let startIdx = content.indexOf('const dataHama = [');
let endIdx = content.indexOf('];', startIdx) + 2;

content = content.substring(0, startIdx) + newData + content.substring(endIdx);

fs.writeFileSync('src/views/JenisHamaView.tsx', content);
