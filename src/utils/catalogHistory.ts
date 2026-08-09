import { IS_DEMO_MODE } from '../config/runtime';

export interface CatalogHistoryEntry<TFilters extends Record<string, string>> {
  id: string;
  summary: string;
  filters: TFilters;
  createdAt: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function readCatalogHistory<TFilters extends Record<string, string>>(
  key: string,
): CatalogHistoryEntry<TFilters>[] {
  if (IS_DEMO_MODE) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is CatalogHistoryEntry<TFilters> =>
      isRecord(entry) &&
      typeof entry.id === 'string' &&
      typeof entry.summary === 'string' &&
      typeof entry.createdAt === 'string' &&
      isRecord(entry.filters),
    ).slice(0, 8);
  } catch {
    return [];
  }
}

export function writeCatalogHistory<TFilters extends Record<string, string>>(
  key: string,
  entries: CatalogHistoryEntry<TFilters>[],
): void {
  if (IS_DEMO_MODE) return;
  try {
    localStorage.setItem(key, JSON.stringify(entries.slice(0, 8)));
  } catch {
    // Search remains functional even when history cannot be persisted.
  }
}

export function upsertCatalogHistory<TFilters extends Record<string, string>>(
  current: CatalogHistoryEntry<TFilters>[],
  filters: TFilters,
  summary: string,
  now = new Date(),
): CatalogHistoryEntry<TFilters>[] {
  const signature = JSON.stringify(filters);
  const next = current.filter((entry) => JSON.stringify(entry.filters) !== signature);
  next.unshift({
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    summary,
    filters,
    createdAt: now.toISOString(),
  });
  return next.slice(0, 8);
}
