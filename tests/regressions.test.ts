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
import { selectNearestForecast } from '../src/components/BmkgWeatherWidget';

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

test('pencarian pestisida tidak memakai fallback produk acak', () => {
  const noMatch = searchPesticides(PESTISIDA_CATALOG, 'Virus Kuning', '');
  assert.equal(noMatch.length, 0);

  const cropOnly = searchPesticides(PESTISIDA_CATALOG, '', 'Apel');
  assert.ok(cropOnly.length < PESTISIDA_CATALOG.length);
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

test('BMKG memilih slot prakiraan terdekat yang belum lewat', () => {
  const now = new Date('2026-07-28T00:00:00Z');
  const selected = selectNearestForecast(
    [[
      { weather_desc: 'Lewat', utc_datetime: '2026-07-27 21:00:00' },
      { weather_desc: 'Nanti', utc_datetime: '2026-07-28 06:00:00' },
    ], [
      { weather_desc: 'Terdekat', utc_datetime: '2026-07-28 03:00:00' },
    ]],
    now,
  );
  assert.equal(selected?.weather_desc, 'Terdekat');
});

test('ikon PWA memiliki signature PNG valid', () => {
  for (const file of ['pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png']) {
    const bytes = readFileSync(resolve(process.cwd(), 'public', file));
    assert.deepEqual(
      [...bytes.subarray(0, 8)],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      `${file} bukan PNG valid`,
    );
  }
});
