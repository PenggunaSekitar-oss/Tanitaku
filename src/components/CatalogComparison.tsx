import React from 'react';

export interface ComparisonItem {
  id: string;
  name: string;
  subtitle?: string;
  values: Record<string, React.ReactNode>;
}

interface CatalogComparisonProps {
  items: ComparisonItem[];
  fields: { key: string; label: string }[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareToggle({
  selected,
  disabled,
  onClick,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors ${
        selected
          ? 'border-[#24533F] bg-[#E8F0EB] text-[#24533F]'
          : 'border-[#D3D6D3] bg-white text-[#536159] hover:border-[#91A399]'
      } disabled:cursor-not-allowed disabled:opacity-45`}
      aria-pressed={selected}
    >
      <span className="material-symbols-outlined text-[16px]">{selected ? 'check' : 'compare_arrows'}</span>
      {selected ? 'Dipilih' : 'Bandingkan'}
    </button>
  );
}

export function CatalogComparison({ items, fields, onRemove, onClear }: CatalogComparisonProps) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#BCCBC2] bg-[#F4F7F4] p-4" aria-label="Perbandingan produk">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-[#233129]">
            Perbandingan produk <span className="text-[#66736B]">({items.length}/3)</span>
          </h3>
          <p className="mt-0.5 text-[11px] text-[#6D7871]">
            Pilih dua atau tiga produk untuk melihat perbedaan utama.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-lg border border-[#D3D8D4] bg-white px-3 py-2 text-[11px] font-semibold text-[#59665F] hover:bg-[#EEEFEA]"
        >
          Kosongkan
        </button>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-[#D7DDD8] bg-white">
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E0E3E0]">
              <th className="w-32 bg-[#F7F7F3] p-3 font-semibold text-[#66716B]">Aspek</th>
              {items.map((item) => (
                <th key={item.id} className="min-w-[190px] p-3 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block font-semibold text-[#223129]">{item.name}</span>
                      {item.subtitle && <span className="mt-0.5 block text-[10px] font-medium text-[#78817B]">{item.subtitle}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded-md p-1 text-[#859089] hover:bg-[#F4ECEA] hover:text-[#9A4438]"
                      aria-label={`Hapus ${item.name} dari perbandingan`}
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key} className="border-b border-[#ECEDE9] last:border-b-0">
                <th className="bg-[#F7F7F3] p-3 align-top font-semibold text-[#5D6962]">{field.label}</th>
                {items.map((item) => (
                  <td key={`${item.id}-${field.key}`} className="p-3 align-top leading-relaxed text-[#344139]">
                    {item.values[field.key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
