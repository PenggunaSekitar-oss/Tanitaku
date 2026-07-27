const fs = require('fs');

let content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

// We will replace the CATALOG array with a new one that has 'kekurangan' and 'gambar' property for each item.
const newCatalogData = `
const CATALOG = [
  // CABAI RAWIT MERAH
  { komoditas: 'Cabai Rawit Merah', nama: 'Ori 212', produsen: 'Aura Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan virus kuning, buah lebat, sangat disukai petani untuk musim kemarau maupun hujan.', kekurangan: 'Ukuran buah relatif lebih kecil dibandingkan varietas hibrida lainnya.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Kaliber', produsen: 'Jogja Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Buah keras, tahan simpan dan angkut, warna merah cerah mengkilap, tahan rontok.', kekurangan: 'Kurang tahan terhadap curah hujan ekstrem, rentan antraknosa jika drainase buruk.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Bara', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tingkat kepedasan sangat tinggi, adaptasi luas di dataran rendah, buah tipe merunduk.', kekurangan: 'Umur panen sedikit lebih lambat, buah rentan rontok saat kemarau panjang tanpa penyiraman.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Pelita 8 F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Produktivitas tinggi, bisa dipanen hijau maupun merah, toleran layu bakteri.', kekurangan: 'Kebutuhan pupuk dasar cukup tinggi untuk mencapai potensi maksimal.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Rompis F1', produsen: 'Mutiara Bumi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan antraknosa (patek), genjah, hasil per tanaman sangat tinggi.', kekurangan: 'Cabang kurang kokoh, butuh lanjaran ekstra kuat.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Shypoon', produsen: 'Halbanero', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Ukuran buah panjang dan besar, bobot berat, vigor tanaman kuat.', kekurangan: 'Sangat rentan terhadap layu fusarium pada musim hujan.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Taruna', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Rawit tipe tegak, sangat pedas, toleran layu dan penyakit daun.', kekurangan: 'Buah tegak rentan masuknya air hujan sehingga mudah busuk.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Dewata 43 F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Umur panen genjah (65 HST), warna buah kuning kehijauan lalu merah cerah.', kekurangan: 'Ukuran buah mengecil di masa panen akhir.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Sret', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat lebat, tahan layu fusarium, pedas menyengat.', kekurangan: 'Perlu pewiwillan intensif di awal masa tanam.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Pilar F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Toleran virus kuning, sangat genjah, tahan rontok bunga.', kekurangan: 'Warna buah sedikit kusam jika kurang unsur Kalium.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Mhanu F1', produsen: 'Mutiara Bumi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe buah menggantung, produksi tinggi, warna merah menyala.', kekurangan: 'Daya simpan kurang lama, cepat mengkerut setelah dipetik.' },

  // CABAI MERAH KERITING
  { komoditas: 'Cabai Merah Keriting', nama: 'Laba F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran buah seragam, tahan layu bakteri, umur panen genjah.', kekurangan: 'Panjang buah berkurang pada dataran yang terlalu tinggi.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Lado F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah merah menyala, potensi hasil sangat tinggi, toleran kemarau.', kekurangan: 'Rentan keriting daun jika terserang thrips.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Akar', produsen: 'Mutiara Bumi', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan cuaca ekstrem, sangat tahan penyakit antraknosa (patek).', kekurangan: 'Pertumbuhan awal agak lambat.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'OR Twist 42', produsen: 'Oriental Seed', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Adaptasi sangat luas, buah keriting sempurna, disukai pasar tradisional.', kekurangan: 'Sangat membutuhkan suplai kalsium agar ujung buah tidak busuk.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Lolai F1', produsen: 'Bintang Asia', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan virus, buah lebat, panjang buah seragam hingga pucuk.', kekurangan: 'Kurang tahan genangan air.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Kastilo F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran layu bakteri dan busuk batang, umur genjah, hasil tinggi.', kekurangan: 'Bobot per buah lebih ringan dibanding kompetitor.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Rempak F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan Gemini Virus, panjang buah 15-17 cm, tekstur buah padat.', kekurangan: 'Banyak tunas air yang tumbuh, butuh tenaga kerja lebih untuk merempel.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Iggo', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran penyakit layu bakteri dan antraknosa (patek).', kekurangan: 'Warna merah buah agak telat merata.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Tangguh F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan patek (antraknosa), daya simpan kuat, tahan jarak jauh.', kekurangan: 'Ukuran buah sedikit lebih pendek.' },

  // CABAI MERAH BESAR
  { komoditas: 'Cabai Merah Besar', nama: 'Baja F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah berukuran besar dan bobot, tahan angkut jarak jauh.', kekurangan: 'Kebutuhan unsur hara makro sangat tinggi.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Gada F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Permukaan buah mulus mengkilap, cocok ditanam di musim hujan.', kekurangan: 'Rentan pecah buah jika asupan air tidak stabil.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Imperial 10 F1', produsen: 'Bisi', ketinggian: ['Tinggi'], keunggulan: 'Khusus untuk dataran tinggi, buah tebal dan sangat keras, tahan Phytophthora.', kekurangan: 'Kurang beradaptasi di dataran rendah.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Columbus', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat panjang (17 cm), toleran layu fusarium.', kekurangan: 'Buah mudah melengkung jika kekurangan kalsium.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Elegance F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah merah gelap saat masak, bobot buah tinggi, daya simpan lama.', kekurangan: 'Daun sangat rimbun, rentan hama jika jarang disemprot.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Horison 97 F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran buah sangat besar dan seragam, daging buah keras.', kekurangan: 'Tidak disarankan ditanam berdekatan dengan varietas lain untuk mencegah silang sari tak terduga.' },

  // TOMAT
  { komoditas: 'Tomat', nama: 'Servo F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah keras, potensi panen tinggi di dataran rendah.', kekurangan: 'Ujung buah mudah membusuk (blossom end rot) jika cuaca terlalu panas tanpa air.' },
  { komoditas: 'Tomat', nama: 'Gustavi F1', produsen: 'Panah Merah', ketinggian: ['Menengah'], keunggulan: 'Tahan layu fusarium, warna buah merah cerah, tipe buah lonjong (apel).', kekurangan: 'Mudah pecah buah (cracking) saat curah hujan mendadak tinggi.' },
  { komoditas: 'Tomat', nama: 'Marta F1', produsen: 'Panah Merah', ketinggian: ['Tinggi'], keunggulan: 'Tipe indeterminate, bisa dipanen berkali-kali, buah besar cocok untuk pasar supermarket.', kekurangan: 'Butuh ajir yang sangat tinggi dan kuat.' },
  { komoditas: 'Tomat', nama: 'Betavila F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran layu bakteri, pembentukan buah mudah meskipun di musim hujan.', kekurangan: 'Bobot per buah rata-rata lebih kecil.' },
  { komoditas: 'Tomat', nama: 'TM Marvel', produsen: 'Tani Murni', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan serangan virus keriting, buah sangat tebal, tahan transportasi jarak jauh.', kekurangan: 'Kulit buah terlalu tebal bagi sebagian selera konsumen.' },
  { komoditas: 'Tomat', nama: 'Corona', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Umur panen genjah, kulit buah tebal, tidak mudah pecah.', kekurangan: 'Rentan layu fusarium di tanah bekas tanaman sejenis.' },

  // BAWANG MERAH
  { komoditas: 'Bawang Merah', nama: 'Bima Brebes', produsen: 'Lokal', ketinggian: ['Rendah'], keunggulan: 'Warna umbi merah tua, aroma tajam, umur simpan lama (mencapai 6 bulan).', kekurangan: 'Rentan penyakit trotol (Alternaria porri).' },
  { komoditas: 'Bawang Merah', nama: 'Tajuk', produsen: 'Lokal Nganjuk', ketinggian: ['Rendah'], keunggulan: 'Sangat cocok untuk musim kemarau, anakan banyak (6-10 per umbi), wangi khas.', kekurangan: 'Hasil kurang maksimal jika ditanam di musim hujan.' },
  { komoditas: 'Bawang Merah', nama: 'Maserati F1', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Dari biji (TSS), hasil umbi sangat besar (jumbo), tahan penyakit bercak ungu (Alternaria).', kekurangan: 'Fase semai biji (TSS) sangat butuh perawatan intensif.' },
  { komoditas: 'Bawang Merah', nama: 'Sanren F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Biji (TSS), adaptasi sangat baik di musim hujan, bentuk umbi bulat keras.', kekurangan: 'Penyemaian bibit dari biji memakan waktu lebih lama dari umbi.' },
  { komoditas: 'Bawang Merah', nama: 'Tuk-tuk', produsen: 'Panah Merah', ketinggian: ['Rendah'], keunggulan: 'Biji (TSS), cocok ditanam di musim kemarau, toleran busuk pangkal.', kekurangan: 'Ukuran umbi agak tidak seragam jika jarak tanam terlalu rapat.' },
  { komoditas: 'Bawang Merah', nama: 'Bauji', produsen: 'Lokal Nganjuk', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan curah hujan tinggi, cocok ditanam pada musim hujan (off-season).', kekurangan: 'Warna umbi agak pucat (kurang merah gelap).' },

  // BAWANG DAUN (DAUN BAWANG)
  { komoditas: 'Bawang Daun', nama: 'Fragrant', produsen: 'Known-You Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Aroma wangi kuat, pertumbuhan cepat, anakan banyak.', kekurangan: 'Batang semu relatif lebih pendek.' },
  { komoditas: 'Bawang Daun', nama: 'Gita', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Batang semu putih panjang, toleran penyakit karat daun.', kekurangan: 'Agak rentan terhadap busuk pangkal daun pada curah hujan sangat tinggi.' },

  // KUBIS / KOL
  { komoditas: 'Kubis', nama: 'Green Nova F1', produsen: 'Takii Seed', ketinggian: ['Tinggi'], keunggulan: 'Krop bulat pipih, sangat padat, tahan busuk hitam (Black Rot).', kekurangan: 'Hanya bisa membentuk krop dengan baik di dataran tinggi yang dingin.' },
  { komoditas: 'Kubis', nama: 'Sehati F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kubis adaptasi dataran rendah, krop padat, tahan cuaca panas.', kekurangan: 'Krop lebih kecil dibanding varietas khusus dataran tinggi.' },
  { komoditas: 'Kubis', nama: 'KK Cross F1', produsen: 'Takii Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kubis dataran rendah-menengah terpopuler, umur genjah (60 HST).', kekurangan: 'Rentan pecah krop jika panen terlambat.' },
  { komoditas: 'Kubis', nama: 'Grand 11', produsen: 'Known-You Seed', ketinggian: ['Tinggi'], keunggulan: 'Krop sangat besar, toleran akar gada.', kekurangan: 'Masa tanam hingga panen cukup lama.' },

  // SAWI / CAISIM
  { komoditas: 'Sawi / Caisim', nama: 'Tosakan', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun lebar, warna hijau cerah, lambat berbunga, renyah.', kekurangan: 'Sangat disukai ulat daun (Plutella).' },
  { komoditas: 'Sawi / Caisim', nama: 'Shinta', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Batang tegak, daun hijau muda, genjah (panen 25-30 HST).', kekurangan: 'Cepat berbunga jika kurang air.' },
  { komoditas: 'Sawi / Caisim', nama: 'Dora', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Pertumbuhan seragam, daun tebal, tahan transportasi.', kekurangan: 'Tekstur agak sedikit alot jika telat panen.' },
  
  // PAKCOY
  { komoditas: 'Pakcoy', nama: 'Nauli F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Batang besar (sendok), hijau cerah, tahan suhu panas.', kekurangan: 'Mudah terserang kutu daun.' },
  { komoditas: 'Pakcoy', nama: 'White Pakcoy', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Batang pangkal putih, rasa sangat renyah dan tidak berserat.', kekurangan: 'Kurang toleran curah hujan tinggi, pangkal gampang busuk.' },

  // SELADA
  { komoditas: 'Selada', nama: 'Grand Rapids', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Bentuk daun keriting (loose leaf), tahan panas, cocok untuk hidroponik.', kekurangan: 'Daun cepat menguning dan pahit jika suhu instalasi terlalu panas.' },
  { komoditas: 'Selada', nama: 'Kriebo', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Selada keriting dengan pertumbuhan kompak, sangat tahan penyakit tip burn.', kekurangan: 'Pertumbuhan lebih lambat di dataran rendah.' },
  { komoditas: 'Selada', nama: 'New Grand', produsen: 'Tani Murni', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun lebar keriting, hijau segar, panen umur 30 HST.', kekurangan: 'Tidak tahan simpan lama setelah dipanen.' },

  // TERONG
  { komoditas: 'Terong Ungu', nama: 'Yuvita F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah ungu mengkilap, tahan layu bakteri, umur panen genjah.', kekurangan: 'Ujung buah gampang menguning jika telat panen.' },
  { komoditas: 'Terong Ungu', nama: 'Mustang F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat panjang (20-25 cm), keras, cocok untuk pasar jarak jauh.', kekurangan: 'Membutuhkan penopang yang kuat agar tanaman tidak roboh.' },
  { komoditas: 'Terong Ungu', nama: 'Lezata F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah lebat, warna ungu gelap mengkilap, toleran gemini virus.', kekurangan: 'Bentuk buah sering membengkok jika populasi terlalu padat.' },
  { komoditas: 'Terong Hijau', nama: 'Milan F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Terong hijau panjang, daging buah empuk manis, produksi tinggi.', kekurangan: 'Warna buah mudah memudar jika tertutup kanopi rapat.' },
  { komoditas: 'Terong Hijau', nama: 'Hitavi F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Terong hijau panjang, toleran layu bakteri dan virus kuning.', kekurangan: 'Kulit buah sedikit keras.' },
  { komoditas: 'Terong Bulat (Lalap)', nama: 'Kenari', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Bentuk buah bulat, hijau dengan lorek putih, tekstur renyah manis.', kekurangan: 'Sangat disukai lalat buah.' },

  // TIMUN
  { komoditas: 'Timun', nama: 'Zatavy F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah hijau gelap, renyah, lebat (tidak ada buah abnormal).', kekurangan: 'Rentan hama oteng-oteng.' },
  { komoditas: 'Timun', nama: 'Ethana F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran kresek daun (Downy Mildew), genjah, hasil tinggi.', kekurangan: 'Sering muncul rasa pahit jika kekeringan.' },
  { komoditas: 'Timun', nama: 'Harmoni F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Bentuk buah lurus, pangkal tidak pahit, vigor tanaman kuat.', kekurangan: 'Usia produksi agak pendek.' },
  { komoditas: 'Timun', nama: 'Wulan F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Mentimun tipe lalap, buah kecil-sedang, sangat genjah dan lebat.', kekurangan: 'Ukuran buah terlalu kecil untuk pasar timun sayur.' },

  // PARE
  { komoditas: 'Pare', nama: 'Lipan F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah hijau segar, tipe lilin, rasa pahit pas, tahan antraknosa.', kekurangan: 'Perlu lanjaran yang ekstensif dan kuat.' },
  { komoditas: 'Pare', nama: 'Raden F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah panjang (25-30 cm), bobot buah tinggi, produksi melimpah.', kekurangan: 'Buah di pangkal kadang bentuknya tidak beraturan.' },

  // KACANG PANJANG
  { komoditas: 'Kacang Panjang', nama: 'Kanton Tavi', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus kuning (MYMIV), buah polong hijau tua mengkilap, tahan simpan.', kekurangan: 'Hama penggerek polong sering menyerang saat pembungaan.' },
  { komoditas: 'Kacang Panjang', nama: 'Parade Tavi', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Polong sangat panjang (70-80 cm), tahan virus, polong tidak mudah kempes.', kekurangan: 'Ujung polong menyentuh tanah jika lanjaran kurang tinggi.' },
  { komoditas: 'Kacang Panjang', nama: 'Pertiwi', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Panen genjah (40 HST), buah lebat memanjang.', kekurangan: 'Kurang tahan layu bakteri.' },

  // BUNCIS
  { komoditas: 'Buncis', nama: 'Lebat-3', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tipe merambat, polong bulat, tidak berserat, hasil panen tinggi.', kekurangan: 'Hanya adaptif maksimal di dataran tinggi.' },
  { komoditas: 'Buncis', nama: 'Perkasa', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe tegak (tidak butuh lanjaran), cocok di dataran rendah, polong pipih.', kekurangan: 'Masa panen lebih singkat dibanding tipe merambat.' },
  { komoditas: 'Buncis', nama: 'Maxpro', produsen: 'Panah Merah', ketinggian: ['Tinggi'], keunggulan: 'Tipe merambat, polong hijau terang, sangat renyah, tahan karat daun.', kekurangan: 'Rentan penyakit busuk lunak pada musim penghujan.' },

  // MELON
  { komoditas: 'Melon', nama: 'Alina F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daging buah orange, manis (Brix 12-14), net tebal, tahan gemini virus.', kekurangan: 'Butuh kalsium tinggi agar net terbentuk sempurna dan tidak pecah.' },
  { komoditas: 'Melon', nama: 'Action 434', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daging buah hijau kekuningan, net rapat dan tebal, tahan layu fusarium.', kekurangan: 'Rentan hama kutu kebul penyebab embun jelaga.' },
  { komoditas: 'Melon', nama: 'Pertiwi F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Pertumbuhan kuat, buah besar (2-3 kg), manis, net terbentuk awal.', kekurangan: 'Ukuran terlalu besar untuk preferensi pasar tertentu.' },
  { komoditas: 'Melon (Golden)', nama: 'Apollo', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kulit kuning mulus (tanpa net), daging buah renyah, manis (Brix 15).', kekurangan: 'Sangat rentan lalat buah dan pecah kulit buah.' },

  // SEMANGKA
  { komoditas: 'Semangka (Non Biji)', nama: 'Amara F1', produsen: 'Panah Merah', ketinggian: ['Rendah'], keunggulan: 'Semangka tanpa biji (seedless), buah sangat besar (7-9 kg), kulit tebal tahan pecah.', kekurangan: 'Butuh pejantan (semangka berbiji) untuk proses penyerbukan buatan.' },
  { komoditas: 'Semangka (Non Biji)', nama: 'Seri F1', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Bentuk bulat, daging buah merah tua, manis (Brix 12), adaptasi kemarau sangat baik.', kekurangan: 'Warna kulit mudah kusam jika sering basah terkena hujan.' },
  { komoditas: 'Semangka (Berbiji)', nama: 'Madrid F1', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Tipe inul (lonjong), warna kulit lorek gelap, daging kuning cerah, sangat manis.', kekurangan: 'Ukurannya relatif lebih kecil dibandingkan semangka bulat.' },
  { komoditas: 'Semangka (Berbiji)', nama: 'Bintang', produsen: 'Bintang Asia', ketinggian: ['Rendah'], keunggulan: 'Buah lonjong merah, tahan penyakit kresek.', kekurangan: 'Rentan layu fusarium di lahan terus-menerus.' },

  // JAGUNG MANIS
  { komoditas: 'Jagung Manis', nama: 'Bonanza F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Tongkol besar, rasa sangat manis (Brix 13), biji kuning cerah, tahan bulai.', kekurangan: 'Kurang tahan rebah saat angin kencang di dataran tinggi.' },
  { komoditas: 'Jagung Manis', nama: 'Secada F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus bulai, umur genjah (70 HST), ujung tongkol tertutup rapat.', kekurangan: 'Ukuran tongkol agak lebih ramping.' },
  { komoditas: 'Jagung Manis', nama: 'Exotic', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Rasa sangat manis, warna biji kuning mengkilap, tahan simpan.', kekurangan: 'Sering diserang ulat grayak (FAW).' },
  { komoditas: 'Jagung Manis', nama: 'Jambore', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran tongkol super besar, baris biji lurus dan padat.', kekurangan: 'Kemanisan akan menurun drastis jika telat panen 2-3 hari.' },

  // KANGKUNG
  { komoditas: 'Kangkung', nama: 'Salina', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe cabut, batang renyah, daun hijau terang, genjah (20-25 HST).', kekurangan: 'Cepat berbunga jika kekeringan.' },
  { komoditas: 'Kangkung', nama: 'Bika', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun tidak mudah menguning, batang besar dan lunak.', kekurangan: 'Butuh pemupukan N yang tinggi agar tetap hijau gelap.' },
  { komoditas: 'Kangkung', nama: 'Serimpi', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Vigor kuat, tahan bercak daun, panen serempak.', kekurangan: 'Batang mudah keropos di umur tua.' },

  // SAYURAN DAUN TAMBAHAN
  { komoditas: 'Bayam Cabut', nama: 'Maestro', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Daun hijau cerah tanpa bintik merah, lambat berbunga, genjah.', kekurangan: 'Rentan penyakit rebah semai (dumping off).' },
  { komoditas: 'Bayam Merah', nama: 'Clara', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Daun merah merata, rasa tidak berserat, tinggi antosianin.', kekurangan: 'Ukuran daun sedikit lebih kecil dari bayam hijau.' },
  { komoditas: 'Bayam', nama: 'Baret Merah', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna merah hati terang, vigor tegak, genjah.', kekurangan: 'Mudah luntur warna merahnya saat dimasak kelamaan.' },
  
  // KACANG-KACANGAN TAMBAHAN
  { komoditas: 'Edamame', nama: 'Ryokko', produsen: 'Takii Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Polong besar, isi 3 per polong, rasa manis khas edamame.', kekurangan: 'Sangat disukai ulat penggerek polong.' },
  { komoditas: 'Kacang Tanah', nama: 'Kelinci', produsen: 'Lokal', ketinggian: ['Rendah'], keunggulan: 'Polong besar, biji bernas, toleran penyakit karat daun.', kekurangan: 'Umur panen cukup lama (100-110 HST).' },
  { komoditas: 'Kacang Merah', nama: 'Red Kidney', produsen: 'Known-You Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Hasil tinggi, adaptasi baik di dataran tinggi, biji besar.', kekurangan: 'Kurang adaptif di dataran rendah yang panas.' },

  // BUAH-BUAHAN TAMBAHAN
  { komoditas: 'Pepaya', nama: 'California', produsen: 'Lokal/IPB', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah ukuran pas untuk konsumsi, daging manis, warna merah cerah.', kekurangan: 'Sangat rentan penyakit kutu putih dan virus ringspot.' },
  { komoditas: 'Pepaya', nama: 'Red Lady F1', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus ring spot (PRSV), buah lonjong besar, produktif.', kekurangan: 'Buah kadang terlalu besar untuk pasar modern.' },
  
  // UMBI-UMBIAN
  { komoditas: 'Wortel', nama: 'Kuroda', produsen: 'Takii Seed', ketinggian: ['Tinggi'], keunggulan: 'Umbi panjang dan lurus, warna oranye kemerahan tajam, tidak berkayu.', kekurangan: 'Bentuk umbi membengkok jika tanah berbatu/keras.' },
  { komoditas: 'Wortel', nama: 'Gundaling', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Cocok di dataran sangat tinggi, daya simpan tinggi, ujung umbi tumpul.', kekurangan: 'Kulit umbi agak tebal.' },
  { komoditas: 'Kentang', nama: 'Granola', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Varietas kentang sayur paling populer, umbi oval kuning, hasil stabil.', kekurangan: 'Sangat rentan busuk daun (Phytophthora infestans).' },
  { komoditas: 'Kentang', nama: 'Atlantik', produsen: 'Lokal', ketinggian: ['Tinggi'], keunggulan: 'Kentang khusus industri (keripik), kandungan air rendah, umbi bulat.', kekurangan: 'Mudah pecah (hollow heart) jika cuaca fluktuatif ekstrem.' }
];
`;

const regex = /const CATALOG = \[[\s\S]*?\];/;
content = content.replace(regex, newCatalogData);


const newImageHelper = `
const getImageForKomoditas = (komoditas: string) => {
  const k = komoditas.toLowerCase();
  
  // We use high-quality REAL photos of the produce itself for better context.
  if (k.includes('cabai rawit')) return 'https://images.unsplash.com/photo-1596647285649-e58f0d869cb3?auto=format&fit=crop&q=80&w=600';
  if (k.includes('cabai merah')) return 'https://images.unsplash.com/photo-1588879579089-63ff0d55e2d1?auto=format&fit=crop&q=80&w=600';
  if (k.includes('tomat')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600';
  if (k.includes('bawang merah')) return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=600';
  if (k.includes('bawang daun')) return 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=600';
  if (k.includes('kubis') || k.includes('kol')) return 'https://images.unsplash.com/photo-1518977822524-732be07d9f78?auto=format&fit=crop&q=80&w=600';
  if (k.includes('sawi') || k.includes('pakcoy')) return 'https://images.unsplash.com/photo-1599863809054-d843ff45a16d?auto=format&fit=crop&q=80&w=600';
  if (k.includes('selada')) return 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=600';
  if (k.includes('kangkung')) return 'https://images.unsplash.com/photo-1583002622765-b1a13462ea18?auto=format&fit=crop&q=80&w=600';
  if (k.includes('bayam')) return 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=600';
  if (k.includes('terong ungu')) return 'https://images.unsplash.com/photo-1606558450146-231a4734b0dc?auto=format&fit=crop&q=80&w=600';
  if (k.includes('terong hijau') || k.includes('terong bulat')) return 'https://images.unsplash.com/photo-1582283921852-5a242c1613bc?auto=format&fit=crop&q=80&w=600';
  if (k.includes('timun')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600';
  if (k.includes('pare')) return 'https://images.unsplash.com/photo-1593165225381-80517865f377?auto=format&fit=crop&q=80&w=600';
  if (k.includes('kacang panjang') || k.includes('buncis') || k.includes('edamame') || k.includes('kacang')) return 'https://images.unsplash.com/photo-1593108605510-18eaf341ee4e?auto=format&fit=crop&q=80&w=600';
  if (k.includes('melon')) return 'https://images.unsplash.com/photo-1587049352847-4d4b12736b45?auto=format&fit=crop&q=80&w=600';
  if (k.includes('semangka')) return 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&q=80&w=600';
  if (k.includes('jagung')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600';
  if (k.includes('pepaya')) return 'https://images.unsplash.com/photo-1517282009859-f000eca3bca2?auto=format&fit=crop&q=80&w=600';
  if (k.includes('wortel')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600';
  if (k.includes('kentang')) return 'https://images.unsplash.com/photo-1518977672859-67d10e05697d?auto=format&fit=crop&q=80&w=600';
  
  // Default image
  return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600';
};
`;

const oldImageHelperRegex = /const getImageForKomoditas = \([\s\S]*?\};/;
content = content.replace(oldImageHelperRegex, newImageHelper.trim());

// Render kekurangan.
const renderKekurangan = `
                  <div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-action block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Keunggulan Utama</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.keunggulan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-danger block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> Kekurangan / Tantangan</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.kekurangan}</p>
                    </div>
                  </div>
`;

// Current string to replace
const currentRender = `                  <div className="border-t border-outline pt-3 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">Keunggulan Utama:</span>
                    <p className="text-sm text-on-surface leading-relaxed">
                      {item.keunggulan}
                    </p>
                  </div>`;
                  
content = content.replace(currentRender, renderKekurangan.trim());

fs.writeFileSync('src/views/CariBibitView.tsx', content);
