interface BreadcrumbsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const VIEW_PATHS: Record<string, { section: string; label: string }> = {
  dashboard: { section: 'Ruang kerja', label: 'Ringkasan kebun' },
  pemantauan: { section: 'Operasional', label: 'Lahan & tanaman' },
  pemupukan: { section: 'Operasional', label: 'Jadwal perawatan' },
  kocor: { section: 'Operasional', label: 'Kalkulator larutan' },
  'jenis-hama': { section: 'Referensi', label: 'Jenis hama' },
  'cari-bibit': { section: 'Referensi', label: 'Bibit' },
  'cari-pupuk': { section: 'Referensi', label: 'Pupuk' },
  'cari-pestisida': { section: 'Referensi', label: 'Pestisida' },
  'cari-penyakit': { section: 'Referensi', label: 'Penyakit tanaman' },
  keuangan: { section: 'Administrasi', label: 'Keuangan' },
  log: { section: 'Operasional', label: 'Jurnal aktivitas' },
  pengaturan: { section: 'Administrasi', label: 'Pengaturan' },
};

export function Breadcrumbs({ currentView, onNavigate }: BreadcrumbsProps) {
  const path = VIEW_PATHS[currentView] ?? { section: 'Ruang kerja', label: 'Ringkasan kebun' };
  if (currentView === 'dashboard') return null;

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-[11px] font-medium text-[#78817B]" aria-label="Breadcrumb">
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="rounded-md px-1 py-1 text-[#59675F] transition-colors hover:text-[#24533F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#759381]/40"
      >
        Dashboard
      </button>
      <span className="material-symbols-outlined text-[14px] text-[#A1A7A2]" aria-hidden="true">
        chevron_right
      </span>
      <span>{path.section}</span>
      <span className="material-symbols-outlined text-[14px] text-[#A1A7A2]" aria-hidden="true">
        chevron_right
      </span>
      <span className="truncate font-semibold text-[#26342C]" aria-current="page">
        {path.label}
      </span>
    </nav>
  );
}
