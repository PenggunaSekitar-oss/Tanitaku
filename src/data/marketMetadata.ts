export type MarketAvailability = 'Mudah ditemukan' | 'Cukup mudah' | 'Toko khusus';
export type MarketCatalog = 'bibit' | 'pupuk' | 'pestisida';

export interface MarketMetadata {
  availability: MarketAvailability;
  channels: string[];
  commonPack: string;
  price: string;
  region: string;
  observedAt: string;
  source: 'Estimasi katalog' | 'Label produk' | 'Catatan pengguna';
}

const COMMON_TERMS = [
  'urea',
  'phonska',
  'sp-36',
  'za ',
  'kcl',
  'npk',
  'dolomit',
  'antracol',
  'dithane',
  'score',
  'decis',
  'regent',
  'confidor',
  'abamektin',
  'bisi',
  'panah merah',
  'padi',
  'jagung',
  'cabai',
  'tomat',
  'kangkung',
  'bayam',
  'sawi',
];

export function inferMarketAvailability(name: string): MarketAvailability {
  const normalized = name.toLowerCase();
  return COMMON_TERMS.some((term) => normalized.includes(term))
    ? 'Mudah ditemukan'
    : 'Cukup mudah';
}

export function marketAvailabilityRank(value: MarketAvailability): number {
  if (value === 'Mudah ditemukan') return 2;
  if (value === 'Cukup mudah') return 1;
  return 0;
}

export function inferCommonPack(catalog: MarketCatalog, price: string): string {
  const explicitPack = price.match(/\/\s*([^()]+)(?:\s*\(|$)/)?.[1]?.trim();
  if (explicitPack) return explicitPack;
  if (catalog === 'bibit') return 'Kemasan produsen';
  if (catalog === 'pestisida') return 'Botol atau sachet';
  return 'Kilogram atau sak';
}

export function buildMarketMetadata(
  catalog: MarketCatalog,
  name: string,
  price: string,
): MarketMetadata {
  return {
    availability: inferMarketAvailability(name),
    channels: ['Marketplace', 'Toko tani'],
    commonPack: inferCommonPack(catalog, price),
    price,
    region: 'Referensi nasional',
    observedAt: 'Referensi statis · verifikasi hari ini',
    source: 'Estimasi katalog',
  };
}
