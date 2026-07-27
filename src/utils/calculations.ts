export function calculateHST(tanggalTanam: string): number {
  if (!tanggalTanam) return 0;
  const parts = tanggalTanam.split('-');
  if (parts.length !== 3) return 0;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return 0;

  // Use local midnight to avoid timezone conversion offsets
  const plantDate = new Date(year, month, day);
  plantDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - plantDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  return Math.max(0, diffDays);
}

export function determineFaseTanaman(hst: number): string {
  if (hst === 0) return "Belum Tanam";
  if (hst <= 14) return "Vegetatif Awal";
  if (hst <= 35) return "Vegetatif Aktif";
  if (hst <= 55) return "Pembungaan";
  if (hst <= 80) return "Pembuahan";
  return "Pematangan / Panen";
}

export function calculateActualFertilizerDose(dosisPerHa: number, luasM2: number): number {
  return dosisPerHa * (luasM2 / 10000);
}

export function calculateLuasLahan(
  jumlahBedengan: number, 
  panjangBedengan: number, 
  lebarBedengan: number, 
  jarakAntarBedengan: number,
  luasManualM2?: number
): number {
  if (luasManualM2 && luasManualM2 > 0) return luasManualM2;
  return jumlahBedengan * panjangBedengan * (lebarBedengan + jarakAntarBedengan);
}

export function getRecommendations(hst: number): { pupuk: string; pestisida: string; perawatan: string; hama: string; tips: string } {
  if (hst === 0) {
    return {
      pupuk: "Pupuk dasar (Organik/Kompos, SP-36)",
      pestisida: "Insektisida preventif untuk hama tanah",
      perawatan: "Persiapan lahan dan pembuatan bedengan",
      hama: "Uret, Orong-orong, Semut",
      tips: "Pastikan kelembapan tanah cukup sebelum tanam"
    };
  }
  if (hst <= 14) {
    return {
      pupuk: "Pupuk susulan I (Urea/N tinggi) untuk pertumbuhan awal",
      pestisida: "Fungisida preventif, Insektisida sistemik jika ada gejala",
      perawatan: "Penyulaman (ganti tanaman mati), penyiangan gulma awal",
      hama: "Ulat tanah, Kutu daun (Aphids), Siput",
      tips: "Jaga kelembapan, jangan sampai kering atau terlalu basah"
    };
  }
  if (hst <= 35) {
    return {
      pupuk: "Pupuk susulan II (NPK seimbang)",
      pestisida: "Fungisida & Insektisida kontak/sistemik sesuai monitoring",
      perawatan: "Penyiangan lanjutan, pembubunan (menaikkan tanah)",
      hama: "Ulat grayak, Thrips, Tungau",
      tips: "Monitor intensif serangan hama karena ini fase pertumbuhan kritis"
    };
  }
  if (hst <= 55) {
    return {
      pupuk: "Pupuk susulan III (Tinggi P dan K, kurangi N)",
      pestisida: "Fungisida untuk cegah rontok bunga, Insektisida",
      perawatan: "Pengikatan tanaman/pemasangan ajir, pemangkasan tunas air",
      hama: "Kutu kebul, Lalat buah awal",
      tips: "Fokus pada pembentukan bunga yang sempurna dan cegah kerontokan"
    };
  }
  if (hst <= 80) {
    return {
      pupuk: "Pupuk Kalsium (Ca) dan Kalium (K) untuk kualitas buah",
      pestisida: "Fungisida buah, Insektisida spesifik ulat buah/lalat buah",
      perawatan: "Sanitasi kebun, pembuangan daun tua/sakit",
      hama: "Lalat buah, Ulat penggerek buah",
      tips: "Hentikan pupuk N. Jaga sirkulasi udara di sekitar buah"
    };
  }
  return {
    pupuk: "Hentikan pemupukan kimia",
    pestisida: "Hentikan penyemprotan kimia (perhatikan masa jeda panen)",
    perawatan: "Persiapan panen, sortasi di lahan",
    hama: "Lalat buah, Tikus, Burung",
    tips: "Panen di pagi atau sore hari untuk menjaga kesegaran hasil panen"
  };
}
