import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parseLocalizedNumberInput } from '../src/utils/numberInput';
import {
  formatLocalDate,
  getNextScheduledDate,
} from '../src/utils/localDate';
import { searchPesticides } from '../src/utils/pesticideSearch';
import { PESTISIDA_CATALOG } from '../src/data/pestisidaData';
import {
  buildReportPeriodOptions,
  matchesReportPeriod,
} from '../src/utils/reportPeriod';
import { createCsv } from '../src/utils/csv';
import {
  getWeatherAdvisories,
  getWeatherFreshness,
  parseBmkgPayload,
  selectNearestForecast,
} from '../src/utils/weather';
import {
  calculateActualFertilizerDose,
  calculateEffectiveLuasLahan,
  calculateHST,
  calculateLuasLahan,
} from '../src/utils/calculations';
import { getScheduleOccurrences } from '../src/utils/schedule';
import { upsertCatalogHistory } from '../src/utils/catalogHistory';
import {
  HAMA_DB,
  PENYAKIT_ONLY_DB,
  PENYAKIT_OPTIONS,
} from '../src/data/penyakitData';
import {
  PUPUK_DB,
  getNormalizedPupukCategory,
  getPupukMarketMetadata,
} from '../src/data/pupukData';
import {
  BIBIT_CATALOG,
  getBibitMarketMetadata,
} from '../src/data/bibitData';

test('input desimal menerima titik dan koma tanpa mengubah besaran', () => {
  assert.equal(parseLocalizedNumberInput('0.5', true).value, 0.5);
  assert.equal(parseLocalizedNumberInput('1,5', true).value, 1.5);
  assert.equal(parseLocalizedNumberInput('12.75', true).value, 12.75);
  assert.equal(parseLocalizedNumberInput('1.234,56', true).value, 1234.56);
  assert.equal(parseLocalizedNumberInput('1,234.56', true).value, 1234.56);
});

test('input bilangan bulat tetap mendukung pemisah ribuan Indonesia', () => {
  const result = parseLocalizedNumberInput('1.250.000', false);
  assert.equal(result.value, 1_250_000);
  assert.equal(result.displayValue, '1.250.000');
});

test('tanggal kalender memakai WITA, bukan tanggal UTC', () => {
  const earlyMorningWita = new Date('2026-07-27T23:30:00Z');
  assert.equal(formatLocalDate(earlyMorningWita), '2026-07-28');
});

test('jadwal berulang menghitung occurrence berikutnya', () => {
  const next = getNextScheduledDate('2026-07-01', 7, new Date(2026, 6, 16));
  assert.equal(next && formatLocalDate(next), '2026-07-22');

  const oneTime = getNextScheduledDate('2026-07-01', 0, new Date(2026, 6, 16));
  assert.equal(oneTime && formatLocalDate(oneTime), '2026-07-01');
});

test('kalender membatasi occurrence jadwal ke rentang yang tampil', () => {
  const occurrences = getScheduleOccurrences(
    '2026-07-01',
    7,
    new Date(2026, 6, 10),
    new Date(2026, 6, 31),
  );
  assert.deepEqual(occurrences.map(formatLocalDate), [
    '2026-07-15',
    '2026-07-22',
    '2026-07-29',
  ]);

  const oneTimeOutsideRange = getScheduleOccurrences(
    '2026-07-01',
    0,
    new Date(2026, 6, 10),
    new Date(2026, 6, 31),
  );
  assert.deepEqual(oneTimeOutsideRange, []);
});

test('riwayat katalog mendeduplikasi filter terbaru dan membatasi delapan item', () => {
  let history: ReturnType<typeof upsertCatalogHistory<{ query: string }>> = [];
  for (let index = 0; index < 10; index += 1) {
    history = upsertCatalogHistory(
      history,
      { query: `produk-${index}` },
      `Produk ${index}`,
      new Date(2026, 6, 28, 10, index),
    );
  }
  assert.equal(history.length, 8);
  assert.equal(history[0]?.filters.query, 'produk-9');

  history = upsertCatalogHistory(
    history,
    { query: 'produk-5' },
    'Produk 5 terbaru',
    new Date(2026, 6, 28, 11, 0),
  );
  assert.equal(history.length, 8);
  assert.equal(history[0]?.summary, 'Produk 5 terbaru');
  assert.equal(history.filter((entry) => entry.filters.query === 'produk-5').length, 1);
});

test('pencarian pestisida memakai target dan tidak gugur ketika tanaman diisi', () => {
  const noMatch = searchPesticides(PESTISIDA_CATALOG, 'Virus Kuning', '');
  assert.equal(noMatch.length, 0);

  const targetOnly = searchPesticides(PESTISIDA_CATALOG, 'Ulat Grayak', '');
  const withCropContext = searchPesticides(PESTISIDA_CATALOG, 'Ulat Grayak', 'Cabai');
  assert.ok(targetOnly.length > 0);
  assert.deepEqual(
    new Set(withCropContext.map((item) => item.nama)),
    new Set(targetOnly.map((item) => item.nama)),
  );

  const cropOnly = searchPesticides(PESTISIDA_CATALOG, '', 'Apel');
  assert.equal(cropOnly.length, 0);
});

test('katalog penyakit terpisah dari hama dan memuat gangguan non-infeksi', () => {
  assert.ok(HAMA_DB.length > 0);
  assert.ok(PENYAKIT_ONLY_DB.length > 0);
  assert.ok(HAMA_DB.every((item) => item.kategori === 'Hama'));
  assert.ok(PENYAKIT_ONLY_DB.every((item) => item.kategori !== 'Hama'));
  assert.ok(PENYAKIT_ONLY_DB.some((item) => item.kategori === 'Fisiologis'));
  assert.ok(PENYAKIT_ONLY_DB.some((item) => item.kategori === 'Defisiensi'));
  assert.equal(PENYAKIT_OPTIONS.some((option) => option.value === 'Hama'), false);
});

test('metadata pasar memuat kanal, wilayah, dan kemasan tanpa menjadi status keamanan', () => {
  const pupuk = PUPUK_DB.find((item) => item.nama.toLowerCase().includes('urea'));
  const bibit = BIBIT_CATALOG.find((item) => item.nama === 'Anjasmoro');
  assert.ok(pupuk);
  assert.ok(bibit);

  const pupukMeta = getPupukMarketMetadata(pupuk);
  const bibitMeta = getBibitMarketMetadata(bibit);
  assert.deepEqual(pupukMeta.channels, ['Marketplace', 'Toko tani']);
  assert.equal(pupukMeta.region, 'Referensi nasional');
  assert.ok(pupukMeta.commonPack.length > 0);
  assert.equal(bibitMeta.availability, 'Cukup mudah');
  assert.equal(getNormalizedPupukCategory(pupuk), 'Anorganik tunggal');
});

test('periode laporan dibentuk dinamis dan memfilter tanggal', () => {
  const options = buildReportPeriodOptions(new Date(2026, 6, 28));
  const currentMonth = options[0];
  assert.ok(currentMonth);
  assert.equal(currentMonth.label, 'Juli 2026 (Bulan Berjalan)');
  assert.equal(currentMonth.startDate, '2026-07-01');
  assert.equal(currentMonth.endDate, '2026-07-31');
  assert.equal(matchesReportPeriod('2026-07-15', currentMonth.startDate, currentMonth.endDate), true);
  assert.equal(matchesReportPeriod('2026-06-30', currentMonth.startDate, currentMonth.endDate), false);
});

test('CSV meng-escape quote, newline, dan formula spreadsheet', () => {
  const csv = createCsv(['Deskripsi'], [['=HYPERLINK("https://example.test")'], ['baris\nbaru']]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /"'=HYPERLINK\(""https:\/\/example\.test""\)"/);
  assert.match(csv, /"baris\nbaru"/);
});

test('BMKG memvalidasi, mengurutkan, dan mendeduplikasi slot prakiraan', () => {
  const parsed = parseBmkgPayload({
    lokasi: {
      adm4: '73.04.01.1001',
      provinsi: 'Sulawesi Selatan',
      kotkab: 'Jeneponto',
      kecamatan: 'Bangkala',
      desa: 'Benteng',
      lat: -5.57,
      lon: 119.55,
      timezone: 'Asia/Makassar',
    },
    data: [{
      cuaca: [[
        {
          utc_datetime: '2026-07-28 06:00:00',
          local_datetime: '2026-07-28 14:00:00',
          analysis_date: '2026-07-27T12:00:00',
          weather_desc: 'Hujan Ringan',
          t: 29,
          hu: 82,
          ws: 8,
          tp: 0.7,
          tcc: 90,
        },
        {
          utc_datetime: '2026-07-28 03:00:00',
          local_datetime: '2026-07-28 11:00:00',
          analysis_date: '2026-07-27T12:00:00',
          weather_desc: 'Cerah',
          t: 31,
          hu: 60,
          ws: 5,
          tp: 0,
          tcc: 10,
        },
        {
          utc_datetime: '2026-07-28 03:00:00',
          weather_desc: 'Duplikat',
          hu: 999,
        },
      ]],
    }],
  });

  assert.ok(parsed);
  assert.equal(parsed.location.desa, 'Benteng');
  assert.equal(parsed.forecasts.length, 2);
  assert.equal(parsed.forecasts[0]?.description, 'Cerah');
  assert.equal(parsed.forecasts[0]?.humidity, 60);
  assert.equal(parsed.forecasts[1]?.precipitation, 0.7);
});

test('BMKG memilih slot yang paling dekat dengan waktu saat ini', () => {
  const now = new Date('2026-07-28T00:00:00Z');
  const selected = selectNearestForecast(
    [
      { forecastAt: '2026-07-27T21:00:00.000Z', description: 'Lewat' },
      { forecastAt: '2026-07-28T06:00:00.000Z', description: 'Nanti' },
      { forecastAt: '2026-07-28T03:00:00.000Z', description: 'Terdekat' },
    ].map((forecast) => ({
      ...forecast,
      localDatetime: '',
      analysisAt: null,
      temperature: null,
      humidity: null,
      windSpeed: null,
      windDirection: '—',
      windDirectionDegrees: null,
      cloudCover: null,
      precipitation: null,
      visibilityText: '—',
    })),
    now,
  );
  assert.equal(selected?.description, 'Terdekat');
});

test('BMKG menandai data lama dan advisori memakai beberapa slot', () => {
  const now = new Date('2026-07-28T12:00:00Z');
  const freshness = getWeatherFreshness('2026-07-27T12:00:00.000Z', now);
  assert.equal(freshness.isStale, true);

  const advisories = getWeatherAdvisories([
    {
      forecastAt: '2026-07-28T13:00:00.000Z',
      localDatetime: '',
      analysisAt: null,
      description: 'Hujan Ringan',
      temperature: 29,
      humidity: 88,
      windSpeed: 9,
      windDirection: 'E',
      windDirectionDegrees: 90,
      cloudCover: 90,
      precipitation: 0.8,
      visibilityText: '< 10 km',
    },
  ], now);
  assert.equal(advisories[0]?.level, 'high');
  assert.match(advisories[0]?.message ?? '', /Tunda aplikasi daun/);
});

test('BMKG tidak memberi sinyal cuaca aman ketika data kosong', () => {
  const advisories = getWeatherAdvisories([]);
  assert.equal(advisories[0]?.title, 'Prakiraan belum tersedia');
  assert.match(advisories[0]?.message ?? '', /Jangan gunakan/);
});

test('perhitungan budidaya menolak tanggal dan besaran tidak valid', () => {
  assert.equal(calculateHST('2026-02-30', new Date(2026, 2, 2)), 0);
  assert.equal(calculateHST('2026-02-28', new Date(2026, 2, 2)), 2);
  assert.equal(calculateActualFertilizerDose(-20, 1_000), 0);
  assert.equal(calculateActualFertilizerDose(100, 1_000), 10);
  assert.equal(calculateLuasLahan(10, 20, 1, -0.5), 200);
  assert.equal(calculateLuasLahan(10, 20, 1, 0.5, 125), 125);
  assert.equal(calculateEffectiveLuasLahan(10, 20, 1, 0.5, 1_000, 80), 800);
  assert.equal(calculateEffectiveLuasLahan(10, 20, 1, 0.5, 1_000, 120), 1_000);
});

test('ikon PWA memiliki signature PNG valid', () => {
  for (const file of ['pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png', 'apple-touch-icon.png']) {
    const bytes = readFileSync(resolve(process.cwd(), 'public', file));
    assert.deepEqual(
      [...bytes.subarray(0, 8)],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      `${file} bukan PNG valid`,
    );
  }
});

test('UI mempertahankan logo TANITA dan menghapus label promosi berulang', () => {
  const brand = readFileSync(
    resolve(process.cwd(), 'src/components/BrandLockup.tsx'),
    'utf8',
  );
  const banner = readFileSync(
    resolve(process.cwd(), 'src/components/BannerCarousel.tsx'),
    'utf8',
  );
  const localOfficialLogo = '/tanita-logo-official.png';
  const logoBytes = readFileSync(resolve(process.cwd(), 'public', 'tanita-logo-official.png'));

  assert.ok(brand.includes(localOfficialLogo));
  assert.deepEqual(
    [...logoBytes.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  );
  assert.doesNotMatch(brand, /tanita-icon/);
  assert.doesNotMatch(
    banner,
    /Data tersimpan lokal|Sumber cuaca BMKG|Tanpa data contoh/,
  );
});

test('timeline cuaca ringkas dan PWA memakai background terang', () => {
  const weatherWidget = readFileSync(resolve('src/components/BmkgWeatherWidget.tsx'), 'utf8');
  const viteConfig = readFileSync(resolve('vite.config.ts'), 'utf8');
  const html = readFileSync(resolve('index.html'), 'utf8');

  assert.match(weatherWidget, /hide-scrollbar flex snap-x/);
  assert.doesNotMatch(weatherWidget, /grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6/);
  assert.match(viteConfig, /background_color: '#F1F0EB'/);
  assert.match(viteConfig, /pwa-maskable-512x512\.png/);
  assert.match(html, /theme-color" content="#F1F0EB"/);
  assert.doesNotMatch(html, /black-translucent/);
});

test('ikon konteks pupuk tetap terikat pada bidang input di desktop', () => {
  const view = readFileSync(resolve('src/views/CariPupukView.tsx'), 'utf8');
  assert.match(
    view,
    /placeholder="Contoh: Sawi, Cabai, Tomat\.\.\."\s*\/>\s*<\/div>\s*<span[^>]*>Hasil utama difilter/,
  );
});

test('interaksi tombol memiliki hover, tekan, fokus, dan status nonaktif global', () => {
  const styles = readFileSync(resolve('src/index.css'), 'utf8');
  assert.match(styles, /button:not\(:disabled\).*:hover/);
  assert.match(styles, /button:not\(:disabled\).*:active/);
  assert.match(styles, /scale: 0\.98/);
  assert.match(styles, /button:focus-visible/);
  assert.match(styles, /button:disabled,[\s\S]*opacity: 0\.55/);
});

test('katalog hama tidak memakai lagi foto spesies yang salah dan menampilkan audit gambar', () => {
  const view = readFileSync(resolve('src/views/JenisHamaView.tsx'), 'utf8');
  for (const wrongImage of [
    'Spodoptera_mauritia_mauritia',
    'Sitophilus.granarius',
    'Brown_rat_%28Rattus_norvegicus',
    'Giant_tiger_land_snail',
    'Setora_cupreiplaga',
    'Epilachna_tredecimnotata',
    'Nacoleia_semicostalis',
  ]) {
    assert.doesNotMatch(view, new RegExp(wrongImage));
  }
  assert.match(view, /Spodoptera frugiperda caterpillar01\.jpg/);
  assert.match(view, /Spodoptera exigua\.png/);
  assert.match(view, /Maize Weevil - Sitophilus zeamais\.jpg/);
  assert.match(view, /Foto tervalidasi belum tersedia/);
  assert.match(view, /Sumber gambar/);
  assert.match(view, /aria-label=\{`Memuat gambar \$\{alt\}`\}/);
});
