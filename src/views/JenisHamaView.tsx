import { PageHeader } from '../components/PageHeader';
import { CatalogMeta } from '../components/CatalogMeta';
import React, { useEffect, useState } from "react";

interface Hama {
  id: number;
  nama: string;
  latin: string;
  gambar: string;
  deskripsi: string;
  tanaman: string[];
  pembasmian: string;
  saranPestisida: string;
}

const auditedImages: Record<number, { src: string; sourceFile: string }> = {
  5: { src: '/hama-audit/thrips-tabaci.jpg', sourceFile: 'Thrips tabaci.jpg' },
  7: { src: '/hama-audit/walang-sangit.jpg', sourceFile: 'Leptocorisa oratorius-Kadavoor-2016-02-07-001.jpg' },
  13: { src: '/hama-audit/oteng-oteng.jpg', sourceFile: '"+arya+" Aulacophora indica - kumbang daun kurkubis - oteng - Pilangsari 2020 - 04.jpg' },
  14: { src: '/hama-audit/bekicot.jpg', sourceFile: 'Achatina fulica (Giant African land snail).jpg' },
  15: { src: '/hama-audit/rayap.jpg', sourceFile: 'CSIRO ScienceImage 3745 Workers of the drywood termite Cryptotermes domesticus.jpg' },
  16: { src: '/hama-audit/nematoda-bintil-akar.jpg', sourceFile: 'Tomato (Solanum lycopersicum)- Root knot nematodes - 27421750599.jpg' },
  20: { src: '/hama-audit/kutu-putih.jpg', sourceFile: 'Planococcus citri from CSIRO.jpg' },
  23: { src: '/hama-audit/ulat-bawang.png', sourceFile: 'Spodoptera exigua.png' },
  24: { src: '/hama-audit/semut-api.jpg', sourceFile: 'Solenopsis invicta - fire ant worker.jpg' },
  26: { src: '/hama-audit/ulat-api.jpg', sourceFile: 'Setora nitens.jpg' },
  28: { src: '/hama-audit/ulat-grayak-jagung.jpg', sourceFile: 'Spodoptera frugiperda caterpillar01.jpg' },
  32: { src: '/hama-audit/bubuk-jagung.jpg', sourceFile: 'Maize Weevil - Sitophilus zeamais.jpg' },
  40: { src: '/hama-audit/burung-pipit.jpg', sourceFile: 'The Scaly-breasted Munia knows exactly where the best seeds are.jpg' },
  47: { src: '/hama-audit/penggerek-batang-jagung.jpg', sourceFile: 'O furnacalis 2.JPG' },
  49: { src: '/hama-audit/babi-hutan.jpg', sourceFile: 'Wild boar (Sus scrofa).jpg' },
  50: { src: '/hama-audit/monyet-ekor-panjang.jpg', sourceFile: 'Macaca fascicularis, Ubud Monkey Forest, Bali, 20220822 1053 0059.jpg' },
};

const auditedImage = (id: number) => auditedImages[id]?.src ?? '';

const dataHama: Hama[] = [
  {
    id: 1,
    nama: "Ulat Grayak",
    latin: "Spodoptera litura",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Spodoptera_litura_%2824045593674%29.jpg/500px-Spodoptera_litura_%2824045593674%29.jpg",
    deskripsi: "Hama pemakan daun yang sangat rakus. Serangannya biasanya terjadi pada malam hari, sedangkan siang hari ulat bersembunyi di dalam tanah atau di balik daun.",
    tanaman: ["Cabai", "Tomat", "Bawang Merah", "Kubis", "Kedelai", "Jagung"],
    pembasmian: "Pengendalian mekanis dengan mengambil dan memusnahkan telur dan ulat. Penggunaan pestisida nabati dari ekstrak daun mimba atau brotowali juga cukup efektif.",
    saranPestisida: "Gunakan insektisida berbahan aktif sipermetrin, deltametrin, atau klorpirifos."
  },
  {
    id: 2,
    nama: "Kutu Daun",
    latin: "Aphids",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Aphids_September_2008-1.jpg/400px-Aphids_September_2008-1.jpg",
    deskripsi: "Kutu kecil berukuran 1-2 mm, berwarna hijau, hitam, atau kuning. Kutu daun mengisap cairan tanaman sehingga daun mengeriting, tumbuh kerdil, dan menularkan virus.",
    tanaman: ["Cabai", "Tomat", "Kacang Panjang", "Terong", "Sawi"],
    pembasmian: "Gunakan musuh alami seperti kumbang kepik (ladybug). Cairan sabun cuci piring (ringan) yang dicampur air juga bisa digunakan sebagai alternatif ramah lingkungan.",
    saranPestisida: "Semprot dengan insektisida berbahan aktif abamektin, imidakloprid, atau dimetoat."
  },
  {
    id: 3,
    nama: "Kutu Kebul",
    latin: "Bemisia tabaci",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Bemisia_tabaci_from_USDA_1.jpg/500px-Bemisia_tabaci_from_USDA_1.jpg",
    deskripsi: "Serangga kecil berwarna putih yang bersembunyi di bawah permukaan daun. Merupakan vektor utama penyebaran virus kuning (geminivirus).",
    tanaman: ["Cabai", "Tomat", "Terong", "Mentimun", "Kacang Panjang"],
    pembasmian: "Gunakan perangkap lekat kuning (yellow sticky trap) di sekitar lahan dan jaga kebersihan gulma.",
    saranPestisida: "Aplikasikan insektisida berbahan aktif imidakloprid, tiametoksam, atau abamektin."
  },
  {
    id: 4,
    nama: "Lalat Buah",
    latin: "Bactrocera spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bactrocera_dorsalis.jpg/500px-Bactrocera_dorsalis.jpg",
    deskripsi: "Lalat dewasa menyuntikkan telur ke dalam buah. Larva (berupa belatung) akan menetas dan memakan daging buah dari dalam sehingga buah busuk dan rontok.",
    tanaman: ["Mangga", "Cabai", "Tomat", "Belimbing", "Jambu Air", "Jeruk"],
    pembasmian: "Gunakan perangkap atraktan metil eugenol (untuk lalat jantan). Lakukan pembungkusan buah sejak dini. Kumpulkan buah yang busuk/jatuh lalu musnahkan.",
    saranPestisida: "Dapat menggunakan insektisida berbahan aktif dimetoat atau fention yang dicampur dengan atraktan protein."
  },
  {
    id: 5,
    nama: "Thrips",
    latin: "Thrips spp. (contoh: Thrips tabaci)",
    gambar: auditedImage(5),
    deskripsi: "Serangga berukuran sangat kecil. Menyerang dengan cara menggaruk dan mengisap cairan daun, menyebabkan daun mengeriting ke atas, berwarna keperakan, dan bunga rontok.",
    tanaman: ["Cabai", "Tomat", "Bawang Merah", "Semangka", "Melon"],
    pembasmian: "Pasang perangkap lekat kuning atau biru. Jaga kelembapan tanah dan sanitasi kebun secara rutin.",
    saranPestisida: "Gunakan insektisida berbahan aktif abamektin, fipronil, atau klorfenapir."
  },
  {
    id: 6,
    nama: "Wereng Coklat",
    latin: "Nilaparvata lugens",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Nilaparvata_lugens_from_CSIRO.jpg",
    deskripsi: "Hama utama pada tanaman padi yang mengisap cairan batang, menyebabkan tanaman menguning, kering, dan mati (hopperburn).",
    tanaman: ["Padi"],
    pembasmian: "Gunakan varietas padi tahan wereng. Terapkan sistem tanam jajar legowo dan pelihara musuh alami seperti laba-laba.",
    saranPestisida: "Insektisida berbahan aktif imidakloprid, buprofezin, atau pimetrozin."
  },
  {
    id: 7,
    nama: "Walang Sangit",
    latin: "Leptocorisa oratorius",
    gambar: auditedImage(7),
    deskripsi: "Hama yang mengeluarkan bau menyengat khas saat diganggu. Menyerang bulir padi muda yang sedang masak susu sehingga gabah menjadi hampa atau berwarna coklat.",
    tanaman: ["Padi"],
    pembasmian: "Kumpulkan walang sangit secara manual pada pagi hari. Gunakan umpan bau-bauan seperti daging busuk atau bangkai keong mas.",
    saranPestisida: "Insektisida berbahan aktif BPMC, fipronil, atau metomil."
  },
  {
    id: 8,
    nama: "Penggerek Batang",
    latin: "Scirpophaga incertulas",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Scirpophaga_incertulas_female_moth.png/500px-Scirpophaga_incertulas_female_moth.png",
    deskripsi: "Fase larva masuk ke dalam batang padi dan memutus jaringan, menyebabkan pucuk layu (sundep) pada fase vegetatif dan malai hampa (beluk) pada fase generatif.",
    tanaman: ["Padi"],
    pembasmian: "Pemotongan pangkal jerami saat panen, penggenangan sawah, dan rotasi tanaman.",
    saranPestisida: "Insektisida sistemik berbahan aktif karbofuran, klorantraniliprol, atau dimehipo."
  },
  {
    id: 9,
    nama: "Tungau Merah",
    latin: "Tetranychus spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tetranychus-urticae.jpg/500px-Tetranychus-urticae.jpg",
    deskripsi: "Bukan serangga melainkan kerabat laba-laba. Ukuran sangat kecil, bersembunyi di bawah daun, menyebabkan daun melengkung ke bawah, menebal, dan berwarna tembaga.",
    tanaman: ["Cabai", "Tomat", "Mentimun", "Singkong", "Jeruk"],
    pembasmian: "Lakukan penyiraman yang cukup karena tungau menyukai kondisi kering dan panas.",
    saranPestisida: "Akarisida (bukan insektisida biasa) berbahan aktif abamektin, piridaben, atau propargit."
  },
  {
    id: 10,
    nama: "Ulat Tanah",
    latin: "Agrotis ipsilon",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Agrotis_ipsilon_aneituma.jpg/500px-Agrotis_ipsilon_aneituma.jpg",
    deskripsi: "Ulat berwarna coklat tua hingga hitam yang hidup di dalam tanah. Memotong pangkal batang tanaman muda yang baru dipindah tanam pada malam hari.",
    tanaman: ["Cabai", "Tomat", "Kubis", "Bawang Merah", "Jagung"],
    pembasmian: "Pembersihan lahan dari sisa tanaman sebelumnya. Mencari ulat di sekitar pangkal batang tanaman yang terpotong pada pagi hari.",
    saranPestisida: "Insektisida tabur (butiran/granul) berbahan aktif karbofuran atau klorpirifos di sekitar lubang tanam."
  },
  {
    id: 11,
    nama: "Kepik Hijau",
    latin: "Nezara viridula",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Nezara_viridula_MHNT_verte.jpg/500px-Nezara_viridula_MHNT_verte.jpg",
    deskripsi: "Kepik yang menghisap cairan polong atau buah. Meninggalkan bekas tusukan hitam pada polong kacang-kacangan atau buah.",
    tanaman: ["Kacang Panjang", "Kedelai", "Buncis"],
    pembasmian: "Pengumpulan secara manual dan menjaga kebersihan gulma.",
    saranPestisida: "Insektisida deltametrin atau sipermetrin."
  },
  {
    id: 12,
    nama: "Orong-Orong",
    latin: "Gryllotalpa sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gryllotalpa_gryllotalpa_MHNT.jpg/500px-Gryllotalpa_gryllotalpa_MHNT.jpg",
    deskripsi: "Serangga tanah (anjing tanah) yang suka memakan akar dan pangkal batang tanaman muda di lahan basah/sawah.",
    tanaman: ["Padi", "Bibit Sayuran"],
    pembasmian: "Penggenangan lahan, pemasangan umpan beracun.",
    saranPestisida: "Insektisida tabur karbofuran."
  },
  {
    id: 13,
    nama: "Oteng-Oteng",
    latin: "Aulacophora indica",
    gambar: auditedImage(13),
    deskripsi: "Kumbang daun berwarna jingga yang membuat lubang pada daun tanaman labu-labuan. Jangan tertukar dengan Epilachna, kumbang koksi pemakan daun.",
    tanaman: ["Mentimun", "Kacang", "Terong"],
    pembasmian: "Pungut hama secara manual pagi/sore hari.",
    saranPestisida: "Insektisida kontak (Sipermetrin)."
  },
  {
    id: 14,
    nama: "Siput Babi / Bekicot",
    latin: "Achatina fulica",
    gambar: auditedImage(14),
    deskripsi: "Makan daun dan batang muda, meninggalkan bekas lendir mengkilap di pagi hari.",
    tanaman: ["Bibit Sayuran", "Kubis", "Sawi"],
    pembasmian: "Tabur abu kayu atau garam di sekeliling bedengan.",
    saranPestisida: "Moluskisida tabur (Metaldehida)."
  },
  {
    id: 15,
    nama: "Rayap",
    latin: "Termitoidae (contoh: Cryptotermes domesticus)",
    gambar: auditedImage(15),
    deskripsi: "Hama tanah yang memakan material kayu, juga bisa menyerang perakaran tanaman kayu-kayuan dan stek.",
    tanaman: ["Singkong", "Karet", "Kopi", "Cengkeh"],
    pembasmian: "Menghancurkan sarang, memastikan tidak ada sisa kayu mati di lahan.",
    saranPestisida: "Insektisida fipronil atau klorpirifos (kocor)."
  },
  {
    id: 16,
    nama: "Nematoda Bintil Akar",
    latin: "Meloidogyne spp. (contoh gejala M. incognita)",
    gambar: auditedImage(16),
    deskripsi: "Cacing mikroskopis di dalam tanah yang menyerang akar sehingga membengkak/bintil-bintil. Tanaman kerdil dan layu siang hari.",
    tanaman: ["Tomat", "Cabai", "Mentimun", "Seledri"],
    pembasmian: "Rotasi tanaman dengan Tagetes (Bunga Kenikir/Marigold).",
    saranPestisida: "Nematisida karbofuran atau etoprofos."
  },
  {
    id: 17,
    nama: "Lalat Pengorok Daun",
    latin: "Liriomyza spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Liriomyza_pusilla_03.jpg/500px-Liriomyza_pusilla_03.jpg",
    deskripsi: "Lalat kecil yang menyuntikkan telur ke dalam daun. Larvanya memakan mesofil daun membentuk guratan putih berliku-liku.",
    tanaman: ["Bawang Merah", "Tomat", "Kentang"],
    pembasmian: "Gunakan perangkap lekat kuning. Bersihkan daun yang terserang.",
    saranPestisida: "Insektisida abamektin atau siromazin."
  },
  {
    id: 18,
    nama: "Ulat Jengkal",
    latin: "Chrysodeixis chalcites",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Chrysodeixis_chalcites%2C_a%2C_Pretoria.jpg/500px-Chrysodeixis_chalcites%2C_a%2C_Pretoria.jpg",
    deskripsi: "Ulat hijau pucat yang berjalan dengan cara melengkungkan (menjengkal) tubuhnya. Memakan daun hingga bolong besar.",
    tanaman: ["Kacang Panjang", "Kedelai", "Sawi"],
    pembasmian: "Kumpulkan ulat secara mekanis.",
    saranPestisida: "Insektisida deltametrin atau profenofos."
  },
  {
    id: 19,
    nama: "Ulat Penggulung Daun",
    latin: "Omiodes indicata (sin. Lamprosema indicata)",
    gambar: "",
    deskripsi: "Ulat yang merekatkan daun menggunakan benang sutra untuk bersembunyi di dalamnya sambil memakan daun.",
    tanaman: ["Kacang Hijau", "Kedelai"],
    pembasmian: "Pijit daun yang menggulung untuk mematikan ulat di dalamnya.",
    saranPestisida: "Insektisida sistemik klorantraniliprol atau dimehipo."
  },
  {
    id: 20,
    nama: "Kutu Putih (Mealybug)",
    latin: "Pseudococcidae (contoh: Planococcus citri)",
    gambar: auditedImage(20),
    deskripsi: "Serangga penghisap cairan berselimut lilin putih bertepung. Menyebabkan pertumbuhan kerdil dan muncul jamur jelaga hitam.",
    tanaman: ["Pepaya", "Singkong", "Jambu", "Mangga"],
    pembasmian: "Semprot dengan campuran air sabun pencuci piring dan sedikit minyak nabati untuk merontokkan lilin pelindungnya.",
    saranPestisida: "Insektisida imidakloprid atau klorpirifos (tambahkan perekat/perata)."
  },
  {
    id: 21,
    nama: "Belalang Kayu",
    latin: "Valanga nigricornis",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Malaysian_Locust_%28Valanga_nigricornis%29_%2823220865943%29.jpg/500px-Malaysian_Locust_%28Valanga_nigricornis%29_%2823220865943%29.jpg",
    deskripsi: "Belalang besar yang memakan daun dengan porsi besar, menyebabkan defoliasi pada daun tua dan muda.",
    tanaman: ["Jagung", "Pisang", "Padi", "Kelapa"],
    pembasmian: "Tangkapan manual pada malam/pagi hari, atau tebang ranting tempat mereka bertelur.",
    saranPestisida: "Insektisida kontak (Sipermetrin/Deltametrin)."
  },
  {
    id: 22,
    nama: "Ulat Plutella",
    latin: "Plutella xylostella",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Plutella_xylostella_%2814135631564%29.jpg/500px-Plutella_xylostella_%2814135631564%29.jpg",
    deskripsi: "Ulat hijau kecil yang melubangi daun kubis-kubisan, menyisakan lapisan epidermis tipis (daun tampak transparan).",
    tanaman: ["Kubis", "Sawi", "Brokoli"],
    pembasmian: "Rotasi tanaman dan penanaman tumpangsari (misal dengan tomat) untuk menolak hama.",
    saranPestisida: "Insektisida klorfenapir atau biopestisida Bacillus thuringiensis (Bt)."
  },
  {
    id: 23,
    nama: "Ulat Bawang",
    latin: "Spodoptera exigua",
    gambar: auditedImage(23),
    deskripsi: "Ulat memakan daun bawang dari dalam tabung daun, sehingga daun terlihat putih transparan dan kempes.",
    tanaman: ["Bawang Merah", "Bawang Putih", "Bawang Daun"],
    pembasmian: "Membuang kelompok telur yang biasanya ada di ujung daun.",
    saranPestisida: "Insektisida metomil atau klorantraniliprol."
  },
  {
    id: 24,
    nama: "Semut Api",
    latin: "Solenopsis spp. (contoh: S. invicta)",
    gambar: auditedImage(24),
    deskripsi: "Bersimbiosis dengan kutu daun, melindungi kutu dari predator dan memakan ekskresinya (embun madu). Gigitannya perih.",
    tanaman: ["Cabai", "Tomat", "Tanaman Buah"],
    pembasmian: "Gunakan umpan gula dicampur boraks.",
    saranPestisida: "Insektisida fipronil atau klorpirifos (kocor sarang)."
  },
  {
    id: 25,
    nama: "Lalat Ganjur",
    latin: "Orseolia oryzae",
    gambar: "",
    deskripsi: "Larva lalat menyerang titik tumbuh padi, menyebabkan daun menggulung seperti pipa buntu (puru/ganjur) dan tidak keluar malai.",
    tanaman: ["Padi"],
    pembasmian: "Pemupukan K berimbang dan tidak terlalu banyak Nitrogen.",
    saranPestisida: "Insektisida sistemik butiran (Karbofuran/Fipronil) saat sebar benih."
  },
  {
    id: 26,
    nama: "Ulat Api",
    latin: "Setora nitens",
    gambar: auditedImage(26),
    deskripsi: "Ulat berbulu menyengat yang menyerang kelapa sawit dan tanaman perkebunan lain, menghabiskan daun kelapa dari bawah ke atas.",
    tanaman: ["Kelapa Sawit", "Kelapa"],
    pembasmian: "Penggunaan jamur Cordyceps atau virus ulat api.",
    saranPestisida: "Insektisida deltametrin."
  },
  {
    id: 27,
    nama: "Kutu Sisik",
    latin: "Lepidosaphes beckii",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/6/65/Lepidosaphes_beckii_%28purple_scale%29.jpg",
    deskripsi: "Hama yang menempel erat pada kulit batang/daun dan tertutup lapisan seperti sisik/perisai keras. Menyedot nutrisi tanaman.",
    tanaman: ["Jeruk", "Kopi", "Cengkeh"],
    pembasmian: "Sikat bagian yang terserang. Pangkas dahan yang rimbun.",
    saranPestisida: "Insektisida + White Oil (Minyak Putih) agar menembus perisai."
  },
  {
    id: 28,
    nama: "Ulat Grayak Jagung",
    latin: "Spodoptera frugiperda",
    gambar: auditedImage(28),
    deskripsi: "Fall Armyworm, ulat invansif baru yang sangat merusak tanaman jagung, bersembunyi di pucuk daun (titik tumbuh).",
    tanaman: ["Jagung"],
    pembasmian: "Tanam serempak. Tumpangsari dengan legum.",
    saranPestisida: "Insektisida emamektin benzoat atau klorantraniliprol, semprot tepat di pucuk."
  },
  {
    id: 29,
    nama: "Kumbang Badak",
    latin: "Oryctes rhinoceros",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Oryctes_rhinoceros_male.jpg/500px-Oryctes_rhinoceros_male.jpg",
    deskripsi: "Menyerang titik tumbuh kelapa dan sawit muda, membuat daun baru yang tumbuh terpotong berbentuk huruf V.",
    tanaman: ["Kelapa", "Kelapa Sawit"],
    pembasmian: "Kumpulkan kumbang manual dari titik tumbuh, gunakan jamur Metarhizium anisopliae di tempat tumpukan bahan organik.",
    saranPestisida: "Karbofuran tabur di pucuk tanaman muda."
  },
  {
    id: 30,
    nama: "Tikus Sawah",
    latin: "Rattus argentiventer",
    gambar: "",
    deskripsi: "Hama pengerat yang memotong batang padi, menyebabkan kerusakan masif dan gagal panen secara cepat.",
    tanaman: ["Padi"],
    pembasmian: "Gropyokan, penggunaan burung hantu (Tyto alba), pemasangan TBS (Trap Barrier System).",
    saranPestisida: "Rodentisida (Racun Tikus) seperti Brodifakum."
  },
  {
    id: 31,
    nama: "Kutu Loncat",
    latin: "Heteropsylla cubana",
    gambar: "",
    deskripsi: "Serangga kecil yang meloncat saat didekati, sering menyerang lamtoro, jeruk, cengkeh. Pucuk daun keriting dan gosong.",
    tanaman: ["Lamtoro", "Jeruk", "Kopi"],
    pembasmian: "Memelihara musuh alami seperti kumbang kubah.",
    saranPestisida: "Insektisida imidakloprid."
  },
  {
    id: 32,
    nama: "Gusung / Bubuk Jagung",
    latin: "Sitophilus zeamais",
    gambar: auditedImage(32),
    deskripsi: "Kumbang kecil bermoncong panjang yang melubangi biji jagung dan beras di tempat penyimpanan (gudang).",
    tanaman: ["Jagung (Gudang)", "Beras"],
    pembasmian: "Jemur biji sampai kadar air rendah (<12%), simpan di wadah kedap udara.",
    saranPestisida: "Fumigasi menggunakan Fosfin (Alumunium Fosfida)."
  },
  {
    id: 33,
    nama: "Lalat Bibit",
    latin: "Atherigona sp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Atherigonareversura.png/500px-Atherigonareversura.png",
    deskripsi: "Lalat kecil bertelur di batang jagung muda. Larvanya memakan jaringan batang membuat titik tumbuh membusuk kekuningan.",
    tanaman: ["Jagung (fase V1-V3)"],
    pembasmian: "Menanam benih jagung dengan serempak.",
    saranPestisida: "Perlakuan benih (Seed treatment) dengan insektisida tiametoksam."
  },
  {
    id: 34,
    nama: "Keong Mas",
    latin: "Pomacea canaliculata",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pomacea_canaliculata1.jpg/500px-Pomacea_canaliculata1.jpg",
    deskripsi: "Memotong bibit padi muda (umur <30 hst). Berkembang biak sangat cepat dengan telur berwarna merah muda cerah di batang/pematang.",
    tanaman: ["Padi"],
    pembasmian: "Pungut telur merah dan keong mas secara manual. Pasang saringan pada saluran air masuk.",
    saranPestisida: "Moluskisida berbahan aktif niklosamida."
  },
  {
    id: 35,
    nama: "Penggerek Batang Cengkeh",
    latin: "Nothopeus sp.",
    gambar: "",
    deskripsi: "Larva serangga masuk ke batang cengkeh, membuat lubang yang mengeluarkan serbuk gergaji/cairan. Batang mudah patah.",
    tanaman: ["Cengkeh"],
    pembasmian: "Tutup lubang gerek dengan pasak kayu.",
    saranPestisida: "Injeksi insektisida (klorpirifos/fipronil) ke dalam lubang lalu ditutup."
  },
  {
    id: 36,
    nama: "Penggerek Buah Kakao",
    latin: "Conopomorpha cramerella (PBK)",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Conopomorpha_cramerella_BMNH%28E%29_1412164.jpg/500px-Conopomorpha_cramerella_BMNH%28E%29_1412164.jpg",
    deskripsi: "Larva memakan biji kakao di dalam buah, menyebabkan buah matang tidak merata dan biji saling melekat (susah dikeluarkan).",
    tanaman: ["Kakao"],
    pembasmian: "Selubungi buah (kondomisasi), panen sering, pemangkasan bentuk.",
    saranPestisida: "Penyemprotan insektisida kontak (Deltametrin) bergilir."
  },
  {
    id: 37,
    nama: "Helopeltis",
    latin: "Helopeltis antonii",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/4/40/Helopeltis_antonii.jpg",
    deskripsi: "Kepik penghisap yang menimbulkan bercak-bercak hitam cekung (nekrotik) pada daun pucuk, buah kakao, teh, dan jambu mete.",
    tanaman: ["Kakao", "Teh", "Jambu Mete"],
    pembasmian: "Pemangkasan tajuk agar tidak terlalu rimbun.",
    saranPestisida: "Insektisida profenofos atau sipermetrin."
  },
  {
    id: 38,
    nama: "Kumbang Moncong Kelapa",
    latin: "Rhynchophorus ferrugineus",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rhynchophorus_ferrugineus_MHNT.jpg/500px-Rhynchophorus_ferrugineus_MHNT.jpg",
    deskripsi: "Kumbang merah penggerek pucuk kelapa. Larvanya memakan jaringan tajuk dan batang menyebabkan tajuk patah tak berdaya.",
    tanaman: ["Kelapa"],
    pembasmian: "Membersihkan luka pada batang dan memusnahkan sisa tanaman kelapa busuk.",
    saranPestisida: "Karbofuran yang diletakkan di pangkal pelepah."
  },
  {
    id: 39,
    nama: "Kutu Perisai",
    latin: "Diaspididae (contoh: Lepidosaphes beckii)",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/6/65/Lepidosaphes_beckii_%28purple_scale%29.jpg",
    deskripsi: "Hama yang dilindungi perisai tipis, menghisap cairan batang dan daun jeruk. Sering bersimbiosis dengan semut.",
    tanaman: ["Jeruk", "Apel", "Kopi"],
    pembasmian: "Gosok batang dengan sikat.",
    saranPestisida: "Semprot dengan insektisida imidakloprid + perekat (minyak mineral)."
  },
  {
    id: 40,
    nama: "Burung Pipit",
    latin: "Lonchura spp. (contoh: L. punctulata)",
    gambar: auditedImage(40),
    deskripsi: "Memakan bulir padi menjelang masa panen dalam jumlah koloni besar.",
    tanaman: ["Padi", "Sorgum"],
    pembasmian: "Gunakan orang-orangan sawah, jaring penutup, atau pita mengkilap.",
    saranPestisida: "Gunakan bahan kimia penolak (Repellent) non-toksik."
  },
  {
    id: 41,
    nama: "Tungau Kuning",
    latin: "Polyphagotarsonemus latus",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Polyphagotarsonemus_latus%2C_USDA_BARC.jpg/500px-Polyphagotarsonemus_latus%2C_USDA_BARC.jpg",
    deskripsi: "Tungau berukuran sangat mikroskopis yang membuat daun muda menjadi kaku, melengkung ke atas, menyempit, dan seperti tembaga.",
    tanaman: ["Cabai", "Tomat"],
    pembasmian: "Penyiraman kebun secara menyeluruh, membersihkan gulma yang kering.",
    saranPestisida: "Akarisida berbahan aktif abamektin."
  },
  {
    id: 42,
    nama: "Ulat Daun Pisang",
    latin: "Erionota thrax",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Erionota_thrax1.jpg/500px-Erionota_thrax1.jpg",
    deskripsi: "Ulat hijau besar yang menggulung daun pisang menjadi bentuk tabung khas. Ulat dilapisi semacam serbuk putih.",
    tanaman: ["Pisang"],
    pembasmian: "Menggunting dan membakar daun pisang yang menggulung.",
    saranPestisida: "Biasanya cukup pengendalian mekanis, jarang butuh pestisida kimia."
  },
  {
    id: 43,
    nama: "Lalat Bawang",
    latin: "Delia antiqua",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Delia_antiqua_maggots_at_Allium_porrum_%2C_uienvlieg_maden_op_prei.jpg/500px-Delia_antiqua_maggots_at_Allium_porrum_%2C_uienvlieg_maden_op_prei.jpg",
    deskripsi: "Belatung merusak umbi dan akar bawang, tanaman menjadi layu kekuningan, umbi membusuk.",
    tanaman: ["Bawang Merah"],
    pembasmian: "Penyiapan lahan yang matang dan pemupukan yang seimbang.",
    saranPestisida: "Insektisida sistemik granula (tabur)."
  },
  {
    id: 44,
    nama: "Ngengat Umbi Kentang",
    latin: "Phthorimaea operculella",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Phthorimaea_operculella_dorsal.jpg/500px-Phthorimaea_operculella_dorsal.jpg",
    deskripsi: "Larva melubangi umbi kentang baik di lahan maupun di gudang penyimpanan. Umbi rusak dan tidak bernilai jual.",
    tanaman: ["Kentang"],
    pembasmian: "Simpan umbi di tempat yang sejuk dan terlindung dari ngengat.",
    saranPestisida: "Insektisida spinosad."
  },
  {
    id: 45,
    nama: "Kutu Darah / Kutu Putih Kopi",
    latin: "Planococcus citri",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Planococcus_citri_2.jpg/500px-Planococcus_citri_2.jpg",
    deskripsi: "Menempel di tandan buah dan daun kopi. Mengisap cairan dan menimbulkan cendawan jelaga hitam. Jika dipencet mengeluarkan cairan merah (darah).",
    tanaman: ["Kopi", "Kakao", "Jeruk"],
    pembasmian: "Pangkas rimbun kopi, jaga naungan agar cukup cahaya masuk.",
    saranPestisida: "Insektisida sistemik imidakloprid."
  },
  {
    id: 46,
    nama: "Ulat Krop Kubis",
    latin: "Crocidolomia pavonana",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/6/62/Crocidolomia_pavonana_%28ento-csiro-au%29.jpg",
    deskripsi: "Ulat yang menyerang titik tumbuh (krop) kubis. Memakan habis titik tumbuh sebelum sempat membentuk bulatan krop.",
    tanaman: ["Kubis", "Brokoli"],
    pembasmian: "Pengambilan kelompok telur secara rutin.",
    saranPestisida: "Insektisida klorantraniliprol atau profenofos."
  },
  {
    id: 47,
    nama: "Ulat Penggerek Batang Jagung",
    latin: "Ostrinia furnacalis",
    gambar: auditedImage(47),
    deskripsi: "Masuk memakan batang dan tongkol jagung. Batang mudah patah dan tongkol tidak terisi sempurna.",
    tanaman: ["Jagung"],
    pembasmian: "Musnahkan sisa panen jagung.",
    saranPestisida: "Insektisida butiran melalui pucuk tanaman muda."
  },
  {
    id: 48,
    nama: "Kepik Coklat",
    latin: "Riptortus linearis",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Riptortus_linearis_01756.jpg/500px-Riptortus_linearis_01756.jpg",
    deskripsi: "Kepik berbadan ramping, coklat kekuningan. Menyerang polong kedelai/kacang-kacangan menyebabkannya hampa.",
    tanaman: ["Kedelai", "Kacang Hijau"],
    pembasmian: "Pembersihan gulma inang.",
    saranPestisida: "Insektisida BPMC atau deltametrin."
  },
  {
    id: 49,
    nama: "Babi Hutan",
    latin: "Sus scrofa",
    gambar: auditedImage(49),
    deskripsi: "Hama mamalia yang memakan dan membongkar perakaran umbi-umbian (singkong), jagung, kacang.",
    tanaman: ["Singkong", "Kacang Tanah", "Padi"],
    pembasmian: "Pemagaran dengan seng atau kawat. Perburuan masal.",
    saranPestisida: "-"
  },
  {
    id: 50,
    nama: "Kera / Monyet",
    latin: "Macaca spp. (contoh: M. fascicularis)",
    gambar: auditedImage(50),
    deskripsi: "Merusak dan memakan buah, tongkol jagung, padi di ladang yang berbatasan dengan hutan.",
    tanaman: ["Jagung", "Pisang", "Kakao"],
    pembasmian: "Penjagaan, pemasangan jaring, penggunaan petasan/suara.",
    saranPestisida: "-"
  }
];

const groupExampleIds = new Set([2, 4, 5, 9, 12, 15, 17, 20, 24, 33, 39, 40, 50]);

function getImageStatus(hama: Hama) {
  if (!hama.gambar) return 'Foto tervalidasi belum tersedia';
  if (hama.id === 16 || hama.id === 47) return 'Gejala serangan terverifikasi';
  if (groupExampleIds.has(hama.id)) return 'Contoh genus atau famili';
  return 'Spesies terverifikasi';
}

function getCommonsSource(hama: Hama) {
  const audited = auditedImages[hama.id];
  if (audited) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(audited.sourceFile)}`;
  }
  if (!hama.gambar) return '';
  try {
    const url = new URL(hama.gambar);
    const parts = url.pathname.split('/').filter(Boolean);
    const rawName = parts.includes('thumb')
      ? parts.at(-2) ?? ''
      : parts.at(-1) ?? '';
    return rawName
      ? `https://commons.wikimedia.org/wiki/File:${rawName}`
      : 'https://commons.wikimedia.org/';
  } catch {
    return '';
  }
}

function getChemicalGuidance(hama: Hama) {
  if (hama.saranPestisida.trim() === '-') {
    return 'Tidak ada referensi kimia pada katalog. Utamakan identifikasi dan pengendalian non-kimia yang sesuai kondisi lahan.';
  }

  return `Jika pengendalian kimia memang diperlukan, cari produk berdasarkan target “${hama.nama}”, lalu pastikan tanaman, sasaran, dosis, metode aplikasi, interval, masa tunggu, dan status pendaftaran sesuai label kemasan.`;
}

const ImageWithFallback = ({ src, alt, className, fallbackClassName = "w-full h-full" }: { src: string, alt: string, className: string, fallbackClassName?: string }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(Boolean(src));

  useEffect(() => {
    setError(false);
    setLoading(Boolean(src));
  }, [src]);
  
  if (!src || error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-surface-high p-2 text-center font-bold leading-tight text-on-surface-muted ${fallbackClassName}`}>
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">image_not_supported</span>
        <span>Belum terverifikasi</span>
      </div>
    );
  }
  
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && (
        <div
          role="status"
          aria-label={`Memuat gambar ${alt}`}
          className="absolute inset-0 flex items-center justify-center bg-[#EAE9E3]"
        >
          <span className="material-symbols-outlined animate-spin text-[22px] text-[#24533F]" aria-hidden="true">
            progress_activity
          </span>
        </div>
      )}
    </>
  );
};

export function JenisHamaView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filterCrops = ["Semua", "Cabai", "Padi", "Tomat", "Bawang Merah", "Jagung", "Kubis", "Terong"];

  const filteredHama = dataHama.filter((hama) => {
    const matchesSearch = 
      hama.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hama.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hama.tanaman.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCrop = selectedCrop === "Semua" || hama.tanaman.includes(selectedCrop);

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Jenis & Hama Tanaman"
        subtitle="Referensi hama, gejala serangan, tanaman inang, dan opsi pengendalian untuk pemeriksaan awal."
        action={<CatalogMeta count={dataHama.length} unit="jenis hama" />}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-5">

        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Cari nama hama, latin, atau tanaman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 sm:p-3 pl-9 pr-9 text-xs sm:text-sm bg-white border-2 border-[#0A0A0A] rounded focus:outline-none font-sans"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5C5C5C] text-[18px]">
              search
            </span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C5C5C] hover:text-[#0A0A0A] p-1"
                title="Hapus pencarian"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div
            role="status"
            aria-live="polite"
            className="text-xs font-mono font-bold text-[#0A0A0A] flex items-center gap-1.5 self-end sm:self-center shrink-0 bg-[#E6E6DC] px-2.5 py-1.5 rounded border border-[#0A0A0A]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#154734]">bug_report</span>
            <span>{filteredHama.length} Hama Terdata</span>
          </div>
        </div>

        {/* Horizontal Crop Filter Chips for Mobile & Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 hide-scrollbar -mx-1 px-1">
          <span className="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">filter_alt</span> Filter:
          </span>
          {filterCrops.map((crop) => {
            const isActive = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-2.5 py-1 text-xs font-bold rounded border transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? "bg-[#154734] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A]" 
                    : "bg-[#E6E6DC] text-[#0A0A0A] border border-[#0A0A0A] hover:bg-[#d0d0c4]"
                }`}
              >
                {crop}
              </button>
            );
          })}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-1">
          {filteredHama.length > 0 ? (
            filteredHama.map((hama) => {
              const isExpanded = expandedId === hama.id;
              return (
                <div 
                  key={hama.id} 
                  className={`bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded overflow-hidden transition-all duration-200 flex flex-col ${
                    isExpanded ? "ring-2 ring-[#154734]" : ""
                  }`}
                >
                  {/* Card Main Header (Click to Expand) */}
                  <button
                    type="button"
                    className="group flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-[#E6E6DC]/40 sm:p-4"
                    onClick={() => setExpandedId(isExpanded ? null : hama.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`hama-detail-${hama.id}`}
                  >
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded overflow-hidden border-2 border-[#0A0A0A] shrink-0 bg-[#E6E6DC] relative">
                      <ImageWithFallback 
                        src={hama.gambar} 
                        alt={hama.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        fallbackClassName="w-full h-full text-[9px]"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-extrabold text-sm sm:text-base text-[#0A0A0A] truncate group-hover:text-[#154734] transition-colors">
                          {hama.nama}
                        </h3>
                      </div>
                      <span className="text-[11px] sm:text-xs font-mono italic text-[#5C5C5C] truncate block mb-1.5">
                        {hama.latin}
                      </span>
                      
                      {/* Crops Preview Tags */}
                      <div className="flex flex-wrap gap-1 items-center">
                        {hama.tanaman.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-[#E6E6DC] text-[10px] font-bold text-[#0A0A0A] rounded border border-[#0A0A0A]">
                            {t}
                          </span>
                        ))}
                        {hama.tanaman.length > 2 && (
                          <span className="text-[10px] font-bold text-[#5C5C5C]">
                            +{hama.tanaman.length - 2} lagi
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className={`w-8 h-8 rounded bg-[#E6E6DC] border border-[#0A0A0A] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 bg-[#154734] text-white" : "text-[#0A0A0A]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        expand_more
                      </span>
                    </span>
                  </button>

                  {/* Card Accordion Body */}
                  <div 
                    id={`hama-detail-${hama.id}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? "grid-rows-[1fr] opacity-100 border-t-2 border-[#0A0A0A]" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden bg-[#E6E6DC]/20">
                      <div className="p-3.5 sm:p-4 flex flex-col gap-3.5">
                        {/* Detail Image */}
                        <div>
                          <div className="relative h-36 w-full overflow-hidden rounded border-2 border-[#0A0A0A] bg-[#E6E6DC] sm:h-44">
                            <ImageWithFallback 
                              src={hama.gambar} 
                              alt={hama.nama} 
                              className="w-full h-full object-cover" 
                              fallbackClassName="h-full w-full text-xs"
                            />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              hama.gambar ? 'text-[#24533F]' : 'text-[#6A645C]'
                            }`}>
                              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                                {hama.gambar ? 'verified' : 'image_not_supported'}
                              </span>
                              {getImageStatus(hama)}
                            </span>
                            {hama.gambar && (
                              <a
                                href={getCommonsSource(hama)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-[#24533F] underline decoration-[#9FA9A2] underline-offset-2 hover:text-[#183D2D]"
                              >
                                Sumber gambar
                                <span className="sr-only"> {hama.nama} di Wikimedia Commons</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Deskripsi Gejala */}
                        <div className="bg-[#FEFEFA] p-3 rounded border border-[#0A0A0A] flex flex-col gap-1">
                          <span className="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-[#154734]">info</span>
                            Deskripsi &amp; Gejala
                          </span>
                          <p className="text-xs sm:text-sm font-sans text-[#0A0A0A] leading-relaxed">
                            {hama.deskripsi}
                          </p>
                        </div>

                        {/* Pengendalian Non-Kimia */}
                        <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A] flex flex-col gap-1">
                          <span className="text-[11px] font-bold text-[#154734] uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px]">eco</span>
                            Pencegahan &amp; Non-Kimia (Organik)
                          </span>
                          <p className="text-xs sm:text-sm font-sans text-[#0A0A0A] leading-relaxed">
                            {hama.pembasmian}
                          </p>
                        </div>
                        
                        {/* Panduan Pestisida */}
                        <div className="bg-[#154734]/10 p-3 rounded border-2 border-[#0A0A0A] flex flex-col gap-1">
                          <span className="text-[11px] font-extrabold text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-[#154734]">pest_control</span>
                            Verifikasi Pengendalian Kimia
                          </span>
                          <p className="text-xs sm:text-sm font-sans text-[#0A0A0A] leading-relaxed font-medium">
                            {getChemicalGuidance(hama)}
                          </p>
                        </div>

                        {/* Target Tanaman Inang */}
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-1.5 block">
                            Tanaman Inang / Target Serangan:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {hama.tanaman.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-[#E6E6DC] border border-[#0A0A0A] text-[11px] font-bold text-[#0A0A0A] rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center text-[#5C5C5C] md:col-span-2 lg:col-span-3 flex flex-col items-center gap-2 bg-[#FEFEFA] rounded border-2 border-dashed border-[#0A0A0A]">
              <span className="material-symbols-outlined text-4xl text-[#5C5C5C]">search_off</span>
              <p className="text-sm font-medium">Tidak ada jenis hama yang cocok dengan kata kunci atau filter tanaman ini.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCrop("Semua"); }}
                className="mt-2 px-3 py-1.5 bg-[#154734] text-white text-xs font-bold rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A]"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
