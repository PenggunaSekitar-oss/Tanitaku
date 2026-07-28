interface CatalogMetaProps {
  count: number;
  unit: string;
}

const DATA_VERSION = '28 Juli 2026';

export function CatalogMeta({ count, unit }: CatalogMetaProps) {
  return (
    <div className="min-w-[220px] rounded-xl border border-[#D8D5CC] bg-[#F8F7F2] px-4 py-3 text-left sm:text-right">
      <p className="text-sm font-semibold text-[#26352D]">
        {count.toLocaleString('id-ID')} {unit}
      </p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-[#6D766F]">
        Snapshot katalog TANITA · {DATA_VERSION}
      </p>
      <p className="text-[11px] leading-relaxed text-[#6D766F]">
        Bukan registrasi resmi; cocokkan dengan label produk
      </p>
    </div>
  );
}
