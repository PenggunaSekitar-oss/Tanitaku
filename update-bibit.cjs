const fs = require('fs');

const content = `import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { Select } from '../components/Select';

const CATALOG = [
  // CABAI RAWIT MERAH
  { komoditas: 'Cabai Rawit Merah', nama: 'Ori 212', produsen: 'Aura Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan virus kuning, buah lebat, sangat disukai petani untuk musim kemarau maupun hujan.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Kaliber', produsen: 'Jogja Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Buah keras, tahan simpan dan angkut, warna merah cerah mengkilap, tahan rontok.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Bara', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tingkat kepedasan sangat tinggi, adaptasi luas di dataran rendah, buah tipe merunduk.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Pelita 8 F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Produktivitas tinggi, bisa dipanen hijau maupun merah, toleran layu bakteri.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Rompis F1', produsen: 'Mutiara Bumi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan antraknosa (patek), genjah, hasil per tanaman sangat tinggi.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Shypoon', produsen: 'Halbanero', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Ukuran buah panjang dan besar, bobot berat, vigor tanaman kuat.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Taruna', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Rawit tipe tegak, sangat pedas, toleran layu dan penyakit daun.' },
  { komoditas: 'Cabai Rawit Merah', nama: 'Dewata 43 F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Umur panen genjah (65 HST), warna buah kuning kehijauan lalu merah cerah.' },

  // CABAI MERAH KERITING
  { komoditas: 'Cabai Merah Keriting', nama: 'Laba F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran buah seragam, tahan layu bakteri, umur panen genjah.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Lado F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah merah menyala, potensi hasil sangat tinggi, toleran kemarau.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Akar', produsen: 'Mutiara Bumi', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan cuaca ekstrem, sangat tahan penyakit antraknosa (patek).' },
  { komoditas: 'Cabai Merah Keriting', nama: 'OR Twist 42', produsen: 'Oriental Seed', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Adaptasi sangat luas, buah keriting sempurna, disukai pasar tradisional.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Lolai F1', produsen: 'Bintang Asia', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan virus, buah lebat, panjang buah seragam hingga pucuk.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Kastilo F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran layu bakteri dan busuk batang, umur genjah, hasil tinggi.' },
  { komoditas: 'Cabai Merah Keriting', nama: 'Rempak F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan Gemini Virus, panjang buah 15-17 cm, tekstur buah padat.' },

  // CABAI MERAH BESAR
  { komoditas: 'Cabai Merah Besar', nama: 'Baja F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah berukuran besar dan bobot, tahan angkut jarak jauh.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Gada F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Permukaan buah mulus mengkilap, cocok ditanam di musim hujan.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Imperial 10 F1', produsen: 'Bisi', ketinggian: ['Tinggi'], keunggulan: 'Khusus untuk dataran tinggi, buah tebal dan sangat keras, tahan Phytophthora.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Columbus', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat panjang (17 cm), toleran layu fusarium.' },
  { komoditas: 'Cabai Merah Besar', nama: 'Elegance F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah merah gelap saat masak, bobot buah tinggi, daya simpan lama.' },

  // TOMAT
  { komoditas: 'Tomat', nama: 'Servo F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah keras, potensi panen tinggi di dataran rendah.' },
  { komoditas: 'Tomat', nama: 'Gustavi F1', produsen: 'Panah Merah', ketinggian: ['Menengah'], keunggulan: 'Tahan layu fusarium, warna buah merah cerah, tipe buah lonjong (apel).' },
  { komoditas: 'Tomat', nama: 'Marta F1', produsen: 'Panah Merah', ketinggian: ['Tinggi'], keunggulan: 'Tipe indeterminate, bisa dipanen berkali-kali, buah besar cocok untuk pasar supermarket.' },
  { komoditas: 'Tomat', nama: 'Betavila F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran layu bakteri, pembentukan buah mudah meskipun di musim hujan.' },
  { komoditas: 'Tomat', nama: 'TM Marvel', produsen: 'Tani Murni', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tahan serangan virus keriting, buah sangat tebal, tahan transportasi jarak jauh.' },
  { komoditas: 'Tomat', nama: 'Corona', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Umur panen genjah, kulit buah tebal, tidak mudah pecah.' },

  // BAWANG MERAH
  { komoditas: 'Bawang Merah', nama: 'Bima Brebes', produsen: 'Lokal', ketinggian: ['Rendah'], keunggulan: 'Warna umbi merah tua, aroma tajam, umur simpan lama (mencapai 6 bulan).' },
  { komoditas: 'Bawang Merah', nama: 'Tajuk', produsen: 'Lokal Nganjuk', ketinggian: ['Rendah'], keunggulan: 'Sangat cocok untuk musim kemarau, anakan banyak (6-10 per umbi), wangi khas.' },
  { komoditas: 'Bawang Merah', nama: 'Maserati F1', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Dari biji (TSS), hasil umbi sangat besar (jumbo), tahan penyakit bercak ungu (Alternaria).' },
  { komoditas: 'Bawang Merah', nama: 'Sanren F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Biji (TSS), adaptasi sangat baik di musim hujan, bentuk umbi bulat keras.' },
  { komoditas: 'Bawang Merah', nama: 'Tuk-tuk', produsen: 'Panah Merah', ketinggian: ['Rendah'], keunggulan: 'Biji (TSS), cocok ditanam di musim kemarau, toleran busuk pangkal.' },
  { komoditas: 'Bawang Merah', nama: 'Bauji', produsen: 'Lokal Nganjuk', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan curah hujan tinggi, cocok ditanam pada musim hujan (off-season).' },

  // BAWANG DAUN (DAUN BAWANG)
  { komoditas: 'Bawang Daun', nama: 'Fragrant', produsen: 'Known-You Seed', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Aroma wangi kuat, pertumbuhan cepat, anakan banyak.' },
  { komoditas: 'Bawang Daun', nama: 'Gita', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Batang semu putih panjang, toleran penyakit karat daun.' },

  // KUBIS / KOL
  { komoditas: 'Kubis', nama: 'Green Nova F1', produsen: 'Takii Seed', ketinggian: ['Tinggi'], keunggulan: 'Krop bulat pipih, sangat padat, tahan busuk hitam (Black Rot).' },
  { komoditas: 'Kubis', nama: 'Sehati F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kubis adaptasi dataran rendah, krop padat, tahan cuaca panas.' },
  { komoditas: 'Kubis', nama: 'KK Cross F1', produsen: 'Takii Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kubis dataran rendah-menengah terpopuler, umur genjah (60 HST).' },
  { komoditas: 'Kubis', nama: 'Grand 11', produsen: 'Known-You Seed', ketinggian: ['Tinggi'], keunggulan: 'Krop sangat besar, toleran akar gada.' },

  // SAWI / CAISIM
  { komoditas: 'Sawi / Caisim', nama: 'Tosakan', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun lebar, warna hijau cerah, lambat berbunga, renyah.' },
  { komoditas: 'Sawi / Caisim', nama: 'Shinta', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Batang tegak, daun hijau muda, genjah (panen 25-30 HST).' },
  { komoditas: 'Sawi / Caisim', nama: 'Dora', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Pertumbuhan seragam, daun tebal, tahan transportasi.' },
  
  // PAKCOY
  { komoditas: 'Pakcoy', nama: 'Nauli F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Batang besar (sendok), hijau cerah, tahan suhu panas.' },
  { komoditas: 'Pakcoy', nama: 'White Pakcoy', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Batang pangkal putih, rasa sangat renyah dan tidak berserat.' },

  // SELADA
  { komoditas: 'Selada', nama: 'Grand Rapids', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Bentuk daun keriting (loose leaf), tahan panas, cocok untuk hidroponik.' },
  { komoditas: 'Selada', nama: 'Kriebo', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Selada keriting dengan pertumbuhan kompak, sangat tahan penyakit tip burn.' },
  { komoditas: 'Selada', nama: 'New Grand', produsen: 'Tani Murni', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun lebar keriting, hijau segar, panen umur 30 HST.' },

  // TERONG
  { komoditas: 'Terong Ungu', nama: 'Yuvita F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah ungu mengkilap, tahan layu bakteri, umur panen genjah.' },
  { komoditas: 'Terong Ungu', nama: 'Mustang F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah sangat panjang (20-25 cm), keras, cocok untuk pasar jarak jauh.' },
  { komoditas: 'Terong Ungu', nama: 'Lezata F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah lebat, warna ungu gelap mengkilap, toleran gemini virus.' },
  { komoditas: 'Terong Hijau', nama: 'Milan F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Terong hijau panjang, daging buah empuk manis, produksi tinggi.' },
  { komoditas: 'Terong Hijau', nama: 'Hitavi F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Terong hijau panjang, toleran layu bakteri dan virus kuning.' },
  { komoditas: 'Terong Bulat (Lalap)', nama: 'Kenari', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Bentuk buah bulat, hijau dengan lorek putih, tekstur renyah manis.' },

  // TIMUN
  { komoditas: 'Timun', nama: 'Zatavy F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tahan gemini virus, buah hijau gelap, renyah, lebat (tidak ada buah abnormal).' },
  { komoditas: 'Timun', nama: 'Ethana F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran kresek daun (Downy Mildew), genjah, hasil tinggi.' },
  { komoditas: 'Timun', nama: 'Harmoni F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Bentuk buah lurus, pangkal tidak pahit, vigor tanaman kuat.' },
  { komoditas: 'Timun', nama: 'Wulan F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Mentimun tipe lalap, buah kecil-sedang, sangat genjah dan lebat.' },

  // PARE
  { komoditas: 'Pare', nama: 'Lipan F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Warna buah hijau segar, tipe lilin, rasa pahit pas, tahan antraknosa.' },
  { komoditas: 'Pare', nama: 'Raden F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Buah panjang (25-30 cm), bobot buah tinggi, produksi melimpah.' },

  // KACANG PANJANG
  { komoditas: 'Kacang Panjang', nama: 'Kanton Tavi', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus kuning (MYMIV), buah polong hijau tua mengkilap, tahan simpan.' },
  { komoditas: 'Kacang Panjang', nama: 'Parade Tavi', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Polong sangat panjang (70-80 cm), tahan virus, polong tidak mudah kempes.' },
  { komoditas: 'Kacang Panjang', nama: 'Pertiwi', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Panen genjah (40 HST), buah lebat memanjang.' },

  // BUNCIS
  { komoditas: 'Buncis', nama: 'Lebat-3', produsen: 'Panah Merah', ketinggian: ['Menengah', 'Tinggi'], keunggulan: 'Tipe merambat, polong bulat, tidak berserat, hasil panen tinggi.' },
  { komoditas: 'Buncis', nama: 'Perkasa', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe tegak (tidak butuh lanjaran), cocok di dataran rendah, polong pipih.' },
  { komoditas: 'Buncis', nama: 'Maxpro', produsen: 'Panah Merah', ketinggian: ['Tinggi'], keunggulan: 'Tipe merambat, polong hijau terang, sangat renyah, tahan karat daun.' },

  // MELON
  { komoditas: 'Melon', nama: 'Alina F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daging buah orange, manis (Brix 12-14), net tebal, tahan gemini virus.' },
  { komoditas: 'Melon', nama: 'Action 434', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daging buah hijau kekuningan, net rapat dan tebal, tahan layu fusarium.' },
  { komoditas: 'Melon', nama: 'Pertiwi F1', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Pertumbuhan kuat, buah besar (2-3 kg), manis, net terbentuk awal.' },
  { komoditas: 'Melon (Golden)', nama: 'Apollo', produsen: 'Known-You Seed', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Kulit kuning mulus (tanpa net), daging buah renyah, manis (Brix 15).' },

  // SEMANGKA
  { komoditas: 'Semangka (Non Biji)', nama: 'Amara F1', produsen: 'Panah Merah', ketinggian: ['Rendah'], keunggulan: 'Semangka tanpa biji (seedless), buah sangat besar (7-9 kg), kulit tebal tahan pecah.' },
  { komoditas: 'Semangka (Non Biji)', nama: 'Seri F1', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Bentuk bulat, daging buah merah tua, manis (Brix 12), adaptasi kemarau sangat baik.' },
  { komoditas: 'Semangka (Berbiji)', nama: 'Madrid F1', produsen: 'Bisi', ketinggian: ['Rendah'], keunggulan: 'Tipe inul (lonjong), warna kulit lorek gelap, daging kuning cerah, sangat manis.' },
  { komoditas: 'Semangka (Berbiji)', nama: 'Bintang', produsen: 'Bintang Asia', ketinggian: ['Rendah'], keunggulan: 'Buah lonjong merah, tahan penyakit kresek.' },

  // JAGUNG MANIS
  { komoditas: 'Jagung ManIS', nama: 'Bonanza F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah', 'Tinggi'], keunggulan: 'Tongkol besar, rasa sangat manis (Brix 13), biji kuning cerah, tahan bulai.' },
  { komoditas: 'Jagung Manis', nama: 'Secada F1', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Toleran virus bulai, umur genjah (70 HST), ujung tongkol tertutup rapat.' },
  { komoditas: 'Jagung Manis', nama: 'Exotic', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Rasa sangat manis, warna biji kuning mengkilap, tahan simpan.' },
  { komoditas: 'Jagung Manis', nama: 'Jambore', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Ukuran tongkol super besar, baris biji lurus dan padat.' },

  // KANGKUNG
  { komoditas: 'Kangkung', nama: 'Salina', produsen: 'Panah Merah', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Tipe cabut, batang renyah, daun hijau terang, genjah (20-25 HST).' },
  { komoditas: 'Kangkung', nama: 'Bika', produsen: 'Bisi', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Daun tidak mudah menguning, batang besar dan lunak.' },
  { komoditas: 'Kangkung', nama: 'Serimpi', produsen: 'Bintang Asia', ketinggian: ['Rendah', 'Menengah'], keunggulan: 'Vigor kuat, tahan bercak daun, panen serempak.' }
];

const ELEVATION_OPTIONS = [
  { value: 'Rendah', label: 'Dataran Rendah (0 - 400 mdpl)' },
  { value: 'Menengah', label: 'Dataran Menengah (400 - 700 mdpl)' },
  { value: 'Tinggi', label: 'Dataran Tinggi (> 700 mdpl)' }
];

export function CariBibitView() {
  const [lokasi, setLokasi] = useState('');
  const [komoditas, setKomoditas] = useState('');
  const [ketinggian, setKetinggian] = useState('Rendah');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<typeof CATALOG>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Normalize user search
    const query = komoditas.trim().toLowerCase();
    
    // Filter
    const filtered = CATALOG.filter(item => {
      // Check if comidity matches (partial match)
      const matchesKomoditas = query ? item.komoditas.toLowerCase().includes(query) : true;
      // Check if elevation matches
      const matchesKetinggian = item.ketinggian.includes(ketinggian);
      
      return matchesKomoditas && matchesKetinggian;
    });
    
    setResults(filtered);
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <PageHeader 
        title="Cari Bibit" 
        subtitle="Temukan rekomendasi jenis atau varietas bibit yang cocok sesuai dengan lokasi dan iklim lahan Anda." 
      />
      
      <div className="neo-card p-4 sm:p-6 bg-surface-high border-action">
        <h2 className="font-brutal font-black uppercase tracking-wider mb-4 text-black bg-primary px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[3px_3px_0px_0px_#000] inline-block">Filter Lokasi & Komoditas</h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Lokasi Daerah (Cth: Jeneponto)</label>
            <input 
              type="text" 
              value={lokasi} 
              onChange={e => setLokasi(e.target.value)} 
              className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[12px_4px_12px_4px] shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:shadow-[1px_1px_0px_0px_#000] focus:translate-y-[2px] focus:translate-x-[2px] transition-all duration-200" 
              placeholder="Masukkan nama daerah..." 
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Komoditas (Cth: Cabai Rawit)</label>
            <input 
              type="text" 
              value={komoditas} 
              onChange={e => setKomoditas(e.target.value)} 
              className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[12px_4px_12px_4px] shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:shadow-[1px_1px_0px_0px_#000] focus:translate-y-[2px] focus:translate-x-[2px] transition-all duration-200" 
              placeholder="Mau tanam apa?" 
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-on-surface-muted mb-1.5">Topografi / Ketinggian</label>
            <Select 
              options={ELEVATION_OPTIONS} 
              value={ketinggian} 
              onChange={(val) => setKetinggian(val)} 
              className="w-full"
            />
          </div>
          <div className="md:col-span-3 pt-2">
            <button type="submit" className="w-full bg-action text-black font-bold min-h-[56px] rounded-[16px] hover:opacity-90 transition shadow-lg shadow-action/20">
              CARI REKOMENDASI BIBIT
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-brutal font-black uppercase text-xl text-on-surface">Hasil Pencarian</h3>
            <span className="text-sm font-bold text-on-surface-muted">{results.length} Varian Ditemukan</span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item, idx) => (
                <div key={idx} className="neo-card-small p-4 bg-surface flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-brutal font-black text-lg text-action uppercase tracking-wider">{item.nama}</h4>
                      <p className="text-xs font-mono text-on-surface-muted mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                    </div>
                    <span className="material-symbols-outlined text-action bg-action/10 p-1.5 rounded-md text-[20px]">
                      local_florist
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.ketinggian.map(k => (
                      <span key={k} className="text-[9px] font-bold uppercase tracking-wider bg-surface-high border border-outline px-1.5 py-0.5 rounded-sm text-on-surface-muted">
                        Dataran {k}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-outline pt-3 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">Keunggulan Utama:</span>
                    <p className="text-sm text-on-surface leading-relaxed">
                      {item.keunggulan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-high neo-border-thin rounded-[16px_8px_16px_8px] border-dashed">
              <span className="material-symbols-outlined text-4xl text-on-surface-muted mb-3">search_off</span>
              <h4 className="font-brutal font-bold text-lg mb-1">Tidak Ada Rekomendasi</h4>
              <p className="text-sm text-on-surface-muted max-w-md">
                Maaf, kami belum menemukan data varietas yang cocok untuk kriteria tersebut. Coba ubah komoditas atau kategori ketinggian lahan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
`
fs.writeFileSync('src/views/CariBibitView.tsx', content);
