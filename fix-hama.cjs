const fs = require('fs');

const content = `import React, { useState } from "react";

const dataHama = [
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
  }
];

export function JenisHamaView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredHama = dataHama.filter((hama) =>
    hama.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hama.tanaman.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <div className="flex flex-col gap-1 w-full">
        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl text-on-surface">
          Jenis Hama
        </h1>
        <p className="text-on-surface-muted text-sm font-medium">
          Ensiklopedia hama pertanian di Indonesia beserta cara pembasmiannya.
        </p>
      </div>

      <div className="neo-card p-4 md:p-6 bg-surface-high">
        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Cari hama atau nama tanaman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neo-input w-full p-3 pl-10 font-sans text-[15px]"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted">
            search
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHama.length > 0 ? (
            filteredHama.map((hama) => (
              <div 
                key={hama.id} 
                className="bg-surface border border-outline rounded-[8px_3px_8px_3px] shadow-[3px_3px_0px_0px_#000] overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-action/5 group"
                  onClick={() => setExpandedId(expandedId === hama.id ? null : hama.id)}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline shrink-0 bg-surface-high">
                    <img src={hama.gambar} alt={hama.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-on-surface truncate group-hover:text-primary transition-colors">
                      {hama.nama}
                    </h3>
                    <span className="text-xs font-mono italic text-on-surface-muted truncate block">
                      {hama.latin}
                    </span>
                  </div>
                  <span className={\`material-symbols-outlined transition-transform duration-300 \${expandedId === hama.id ? 'rotate-180 text-action' : 'text-on-surface-muted'}\`}>
                    expand_more
                  </span>
                </div>

                <div className={\`grid transition-all duration-300 ease-in-out \${expandedId === hama.id ? "grid-rows-[1fr] opacity-100 border-t border-outline" : "grid-rows-[0fr] opacity-0"}\`}>
                  <div className="overflow-hidden">
                    <div className="p-4 flex flex-col gap-4">
                      <div className="w-full h-40 md:h-48 overflow-hidden rounded-sm border border-outline mb-2">
                        <img src={hama.gambar} alt={hama.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      <div>
                        <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-1 block">Deskripsi</span>
                        <p className="text-sm font-sans text-on-surface leading-relaxed">
                          {hama.deskripsi}
                        </p>
                      </div>

                      <div className="bg-surface-high p-3 rounded-sm border border-outline">
                        <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
                          Cara Pencegahan & Non-Kimia
                        </span>
                        <p className="text-sm font-sans text-on-surface leading-relaxed font-medium">
                          {hama.pembasmian}
                        </p>
                      </div>
                      
                      <div className="bg-action/10 p-3 rounded-sm border-l-4 border-action">
                        <span className="text-xs font-bold text-action uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">pest_control</span>
                          Saran Pestisida (Kimiawi)
                        </span>
                        <p className="text-sm font-sans text-on-surface leading-relaxed font-medium">
                          {hama.saranPestisida}
                        </p>
                      </div>

                      <div className="mt-2">
                        <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-2 block">Juga ditemukan di:</span>
                        <div className="flex flex-wrap gap-2">
                          {hama.tanaman.map((t) => (
                            <span key={t} className="px-2 py-1 bg-surface-high border border-outline text-xs font-bold text-on-surface rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-on-surface-muted md:col-span-2">
              Hama tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/views/JenisHamaView.tsx', content);
