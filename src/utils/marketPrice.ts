import { MarketCatalog, MarketMetadata } from '../data/marketMetadata';

export interface MarketPriceOverride {
  price: string;
  region: string;
  observedAt: string;
}

const STORAGE_KEY = 'tanita_market_price_overrides_v1';

function readAll(): Record<string, MarketPriceOverride> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function createKey(catalog: MarketCatalog, itemId: string): string {
  return `${catalog}:${itemId.trim().toLowerCase()}`;
}

export function readMarketPrice(
  catalog: MarketCatalog,
  itemId: string,
  fallback: MarketMetadata,
): MarketMetadata {
  const saved = readAll()[createKey(catalog, itemId)];
  if (!saved) return fallback;
  return {
    ...fallback,
    ...saved,
    source: 'Catatan pengguna',
  };
}

export function saveMarketPrice(
  catalog: MarketCatalog,
  itemId: string,
  value: MarketPriceOverride,
): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const next = readAll();
    next[createKey(catalog, itemId)] = {
      price: value.price.trim(),
      region: value.region.trim(),
      observedAt: value.observedAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable in private browsing; the UI still keeps session state.
  }
}

export function removeMarketPrice(catalog: MarketCatalog, itemId: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const next = readAll();
    delete next[createKey(catalog, itemId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Resetting the in-memory UI remains safe if persistent storage is unavailable.
  }
}
