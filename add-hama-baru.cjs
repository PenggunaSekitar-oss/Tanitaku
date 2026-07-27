const fs = require('fs');

let content = fs.readFileSync('src/views/JenisHamaView.tsx', 'utf-8');

const newData = `  {
    id: 17,
    nama: "Ulat Tritip",
    latin: "Plutella xylostella",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Plutella.xylostella.7383.jpg/1280px-Plutella.xylostella.7383.jpg",
    deskripsi: "Ngengat kecil (Diamondback moth) yang larvanya memakan daun bagian bawah sehingga menyisakan epidermis atas yang terlihat seperti bercak jendela transparan. Sering merusak tanaman famili Brassicaceae (sawi, kubis).",
    tanaman: ["Sawi", "Kubis", "Brokoli", "Lobak"],
    pembasmian: "Menanam tanaman perangkap seperti tumpang sari dengan tomat. Penggunaan musuh alami parasitoid Diadegma semiclausum.",
    saranPestisida: "Gunakan insektisida biologi Bacillus thuringiensis atau insektisida kimia berbahan aktif klorantraniliprol atau spinetoram."
  },
  {
    id: 18,
    nama: "Ulat Krop",
    latin: "Crocidolomia pavonana",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/6/62/Crocidolomia_pavonana_%28ento-csiro-au%29.jpg",
    deskripsi: "Ulat ini sering merusak titik tumbuh (krop) pada kubis-kubisan dan memakan daun dari bagian tengah. Sering bersembunyi di dalam krop sambil meninggalkan kotoran.",
    tanaman: ["Sawi", "Kubis", "Brokoli"],
    pembasmian: "Kumpulkan kelompok telur atau ulat muda secara manual sebelum menyebar. Lakukan rotasi tanaman dengan tanaman bukan sefamili.",
    saranPestisida: "Semprotkan insektisida berbahan aktif profenofos, sipermetrin, atau fipronil pada saat ulat masih pada instar awal (kecil)."
  },
  {
    id: 19,
    nama: "Tungau Kuning",
    latin: "Polyphagotarsonemus latus",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Polyphagotarsonemus_latus%2C_USDA_BARC.jpg/1280px-Polyphagotarsonemus_latus%2C_USDA_BARC.jpg",
    deskripsi: "Sangat kecil dan sulit dilihat mata telanjang. Menyerang pucuk dan daun muda cabai, membuat daun menebal, kaku, dan melengkung ke atas (keriting) menyerupai bentuk sendok.",
    tanaman: ["Cabai", "Tomat", "Terong", "Kacang Panjang"],
    pembasmian: "Menjaga kelembapan lahan dan sanitasi gulma di sekitar area tanaman yang bisa menjadi sarang tungau.",
    saranPestisida: "Aplikasikan akarisida berbahan aktif abamektin, piridaben, atau dikofol."
  },
  {
    id: 20,
    nama: "Lalat Pengorok Daun",
    latin: "Liriomyza spp.",
    gambar: "https://upload.wikimedia.org/wikipedia/commons/3/33/Cameraria_ohridella_150893811.jpg",
    deskripsi: "Lalat betina menusuk daun untuk bertelur. Larva yang menetas akan mengorok jaringan di dalam daun, meninggalkan jejak alur berkelok-kelok berwarna putih (terowongan korokan).",
    tanaman: ["Bawang Merah", "Cabai", "Tomat", "Kentang", "Sawi", "Kacang-kacangan"],
    pembasmian: "Pasang perangkap lekat kuning. Musnahkan daun yang menunjukkan gejala korokan parah untuk memutus siklus hidupnya.",
    saranPestisida: "Semprot insektisida yang bersifat sistemik/translaminar berbahan aktif abamektin, dimehipo, atau siromazin."
  }
];`;

content = content.replace(/\];\s*export function JenisHamaView/, ",\n" + newData + "\n\nexport function JenisHamaView");
fs.writeFileSync('src/views/JenisHamaView.tsx', content);
