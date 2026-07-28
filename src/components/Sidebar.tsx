import { BrandLockup } from './BrandLockup';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MENU_GROUPS = [
  {
    label: 'Operasional',
    items: [
      { id: 'dashboard', label: 'Ringkasan', icon: 'space_dashboard' },
      { id: 'pemantauan', label: 'Lahan & tanaman', icon: 'potted_plant' },
      { id: 'pemupukan', label: 'Jadwal perawatan', icon: 'event_note' },
      { id: 'kocor', label: 'Kalkulator larutan', icon: 'science' },
      { id: 'log', label: 'Jurnal aktivitas', icon: 'history' },
    ],
  },
  {
    label: 'Referensi',
    items: [
      { id: 'cari-bibit', label: 'Bibit', icon: 'grass' },
      { id: 'cari-pupuk', label: 'Pupuk', icon: 'compost' },
      { id: 'cari-pestisida', label: 'Pestisida', icon: 'pest_control' },
      { id: 'cari-penyakit', label: 'Penyakit', icon: 'microbiology' },
      { id: 'jenis-hama', label: 'Hama', icon: 'bug_report' },
    ],
  },
  {
    label: 'Administrasi',
    items: [
      { id: 'keuangan', label: 'Keuangan', icon: 'account_balance_wallet' },
      { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' },
    ],
  },
];

export function Sidebar({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          className="fixed inset-0 z-40 bg-[#17211C]/35 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-[286px] flex-col border-l border-[#D9D8D1] bg-[#F7F6F1] transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:relative md:inset-y-0 md:left-0 md:right-auto md:w-[248px] md:translate-x-0 md:border-l-0 md:border-r`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#DFDED7] px-5">
          <BrandLockup />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#5F6963] transition hover:bg-[#ECEAE3] md:hidden"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined text-[21px]">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigasi utama">
          {MENU_GROUPS.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-3 text-[11px] font-semibold text-[#7D8680]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.id === currentView;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`group relative flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs font-semibold transition ${
                        isActive
                          ? 'bg-[#E4ECE6] text-[#173F35]'
                          : 'text-[#4F5B54] hover:bg-[#ECEAE3] hover:text-[#1C211D]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <span className="absolute left-0 h-5 w-[3px] rounded-r bg-[#24533F]" />
                      )}
                      <span
                        className={`material-symbols-outlined text-[19px] ${
                          isActive ? 'text-[#24533F]' : 'text-[#78827C] group-hover:text-[#3D5548]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
