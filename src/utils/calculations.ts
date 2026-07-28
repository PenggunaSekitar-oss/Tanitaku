import { differenceInCalendarDays, parseLocalDate } from './localDate';

const asNonNegativeNumber = (value: number): number =>
  Number.isFinite(value) && value > 0 ? value : 0;

export function calculateHST(tanggalTanam: string, referenceDate = new Date()): number {
  const plantDate = parseLocalDate(tanggalTanam);
  if (!plantDate || Number.isNaN(referenceDate.getTime())) return 0;
  return Math.max(0, differenceInCalendarDays(referenceDate, plantDate));
}

/**
 * Tahap ini hanya pengelompokan umur operasional generik. Fase biologis yang
 * sebenarnya tetap perlu disesuaikan dengan komoditas, varietas, dan observasi.
 */
export function determineFaseTanaman(hst: number): string {
  const safeHst = asNonNegativeNumber(hst);
  if (safeHst === 0) return 'Hari Tanam';
  if (safeHst <= 14) return 'Awal Pertumbuhan';
  if (safeHst <= 35) return 'Pertumbuhan Aktif';
  if (safeHst <= 55) return 'Transisi Generatif';
  if (safeHst <= 80) return 'Pembentukan Hasil';
  return 'Menjelang Panen';
}

export function calculateActualFertilizerDose(dosisPerHa: number, luasM2: number): number {
  return asNonNegativeNumber(dosisPerHa) * (asNonNegativeNumber(luasM2) / 10_000);
}

export function calculateLuasLahan(
  jumlahBedengan: number,
  panjangBedengan: number,
  lebarBedengan: number,
  jarakAntarBedengan: number,
  luasManualM2?: number,
): number {
  const manualArea = asNonNegativeNumber(luasManualM2 ?? 0);
  if (manualArea > 0) return manualArea;

  return (
    asNonNegativeNumber(jumlahBedengan) *
    asNonNegativeNumber(panjangBedengan) *
    (asNonNegativeNumber(lebarBedengan) + asNonNegativeNumber(jarakAntarBedengan))
  );
}

export function calculateEffectiveLuasLahan(
  jumlahBedengan: number,
  panjangBedengan: number,
  lebarBedengan: number,
  jarakAntarBedengan: number,
  luasManualM2?: number,
  efisiensiPersen = 100,
): number {
  const grossArea = calculateLuasLahan(
    jumlahBedengan,
    panjangBedengan,
    lebarBedengan,
    jarakAntarBedengan,
    luasManualM2,
  );
  const safeEfficiency = Number.isFinite(efisiensiPersen)
    ? Math.min(100, Math.max(0, efisiensiPersen))
    : 100;
  return grossArea * (safeEfficiency / 100);
}

export function getRecommendations(hst: number): {
  pupuk: string;
  pestisida: string;
  perawatan: string;
  hama: string;
  tips: string;
} {
  const safeHst = asNonNegativeNumber(hst);

  if (safeHst === 0) {
    return {
      pupuk: 'Verifikasi kebutuhan pupuk dasar sesuai hasil analisis tanah dan komoditas',
      pestisida: 'Amati hama tanah; gunakan pengendalian hanya berdasarkan temuan lapangan',
      perawatan: 'Periksa adaptasi tanaman dan kecukupan air awal',
      hama: 'Hama tanah dan kerusakan bibit',
      tips: 'Jaga kelembapan media tanpa menimbulkan genangan',
    };
  }
  if (safeHst <= 14) {
    return {
      pupuk: 'Evaluasi kebutuhan nutrisi awal berdasarkan komoditas dan kondisi tanaman',
      pestisida: 'Lakukan pengamatan rutin; ikuti label bila tindakan pengendalian diperlukan',
      perawatan: 'Penyulaman, penyiangan awal, dan pemeriksaan drainase',
      hama: 'Ulat tanah, kutu daun, siput',
      tips: 'Bandingkan pertumbuhan antarpetak dan dokumentasikan gejala yang tidak seragam',
    };
  }
  if (safeHst <= 35) {
    return {
      pupuk: 'Tinjau rencana pupuk susulan terhadap respons pertumbuhan dan analisis tanah',
      pestisida: 'Tentukan tindakan dari hasil monitoring, bukan jadwal semprot otomatis',
      perawatan: 'Penyiangan lanjutan dan perbaikan area dengan pertumbuhan tertinggal',
      hama: 'Ulat, thrips, tungau',
      tips: 'Catat intensitas serangan dan ambang tindakan sebelum memilih pengendalian',
    };
  }
  if (safeHst <= 55) {
    return {
      pupuk: 'Sesuaikan dukungan nutrisi fase generatif dengan komoditas dan hasil observasi',
      pestisida: 'Pantau bunga, daun, dan kelembapan; patuhi label serta interval aplikasi',
      perawatan: 'Periksa penopang tanaman, sirkulasi udara, dan sanitasi petak',
      hama: 'Kutu kebul dan hama awal pembentukan hasil',
      tips: 'Umur tanam bukan satu-satunya penentu fase; konfirmasi kondisi aktual tanaman',
    };
  }
  if (safeHst <= 80) {
    return {
      pupuk: 'Evaluasi kebutuhan nutrisi pembentukan hasil sesuai komoditas dan target panen',
      pestisida: 'Gunakan pengendalian spesifik hanya setelah identifikasi organisme pengganggu',
      perawatan: 'Sanitasi kebun dan singkirkan bagian sakit sesuai prosedur',
      hama: 'Hama buah atau hasil dan penyakit terkait kelembapan',
      tips: 'Periksa masa tunggu produk sebelum panen dan simpan catatan setiap aplikasi',
    };
  }
  return {
    pupuk: 'Tinjau kembali kebutuhan input menjelang panen bersama petugas budidaya',
    pestisida: 'Hindari aplikasi tanpa verifikasi masa tunggu dan ketentuan label',
    perawatan: 'Validasi kematangan, jadwal panen, sortasi, dan kesiapan penyimpanan',
    hama: 'Hama hasil, tikus, dan burung',
    tips: 'Tentukan waktu panen dari kematangan aktual, cuaca, dan tujuan pasar',
  };
}
