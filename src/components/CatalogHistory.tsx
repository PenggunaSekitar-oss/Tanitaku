import { CatalogHistoryEntry } from '../utils/catalogHistory';

interface CatalogHistoryProps<TFilters extends Record<string, string>> {
  entries: CatalogHistoryEntry<TFilters>[];
  onSelect: (entry: CatalogHistoryEntry<TFilters>) => void;
  onClear: () => void;
}

const formatHistoryTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function CatalogHistory<TFilters extends Record<string, string>>({
  entries,
  onSelect,
  onClear,
}: CatalogHistoryProps<TFilters>) {
  if (entries.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#DDDAD2] bg-white px-4 py-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold text-[#2D3A33]">Pencarian terakhir</h2>
          <p className="mt-0.5 text-[11px] text-[#758079]">Pilih untuk menjalankan kembali filter.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#7A4B43] transition-colors hover:bg-[#FBF1EE]"
        >
          Bersihkan
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry)}
            className="min-w-[190px] max-w-[250px] rounded-xl border border-[#DDDAD2] bg-[#F8F7F2] px-3 py-2 text-left transition-colors hover:border-[#9CAB9F] hover:bg-[#F1F5F2]"
          >
            <span className="block truncate text-xs font-semibold text-[#2A3830]">{entry.summary}</span>
            <span className="mt-1 block text-[10px] font-medium text-[#7A837D]">{formatHistoryTime(entry.createdAt)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
