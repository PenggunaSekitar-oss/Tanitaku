import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoOperationalData } from '../src/data/demoOperationalData';

test('dataset demo lengkap dan seluruh relasinya valid', () => {
  const data = createDemoOperationalData();

  assert.ok(data.blokLahan.length >= 4);
  assert.ok(data.tanaman.length >= 4);
  assert.ok(data.logAktivitas.length >= 6);
  assert.ok(data.pemupukan.length >= 5);
  assert.ok(data.keuangan.length >= 4);

  const blockIds = new Set(data.blokLahan.map((item) => item.id));
  const plantIds = new Set(data.tanaman.map((item) => item.id));
  assert.equal(blockIds.size, data.blokLahan.length);
  assert.equal(plantIds.size, data.tanaman.length);

  for (const item of data.tanaman) assert.ok(blockIds.has(item.blokId));
  for (const item of data.logAktivitas) assert.ok(blockIds.has(item.blokId));
  for (const item of data.pemupukan) assert.ok(blockIds.has(item.blokId));
  for (const item of data.keuangan) {
    assert.ok(blockIds.has(item.blokId));
    if (item.tanamanId) assert.ok(plantIds.has(item.tanamanId));
  }
});

test('dataset demo mencakup status dan agenda yang diperlukan untuk eksplorasi', () => {
  const data = createDemoOperationalData();
  assert.ok(data.tanaman.some((item) => item.status === 'Aktif'));
  assert.ok(data.tanaman.some((item) => item.status === 'Panen'));
  assert.ok(data.pemupukan.some((item) => item.kategori === 'Pupuk'));
  assert.ok(data.pemupukan.some((item) => item.kategori === 'Pestisida'));
  assert.ok(data.logAktivitas.some((item) => item.biayaSudahDiKeuangan === true));
  assert.ok(data.logAktivitas.some((item) => item.biayaSudahDiKeuangan !== true));
  assert.ok(data.pemupukan.every((item) => item.dosisPerHektar > 0));
});
