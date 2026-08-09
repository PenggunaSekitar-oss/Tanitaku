import { motion } from 'motion/react';
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
          className="fixed inset-0 z-40 bg-[#0B2019]/55 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`tanita-sidebar fixed inset-y-0 right-0 z-50 flex h-full w-[286px] flex-col border-l border-white/10 bg-[#12382D] text-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:relative md:inset-y-0 md:left-0 md:right-auto md:w-[264px] md:translate-x-0 md:border-l-0 md:border-r md:border-white/10`}
      >
        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <BrandLockup inverse descriptor />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined text-[21px]">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navigasi utama">
          {MENU_GROUPS.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#91A99F]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.id === currentView;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`group relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-semibold transition ${
                        isActive
                          ? 'bg-[#F0EEDF] text-[#15392F] shadow-[0_5px_18px_rgba(5,21,16,0.16)]'
                          : 'text-[#C3D1CB] hover:bg-white/[0.07] hover:text-white'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-rail"
                          className="absolute left-0 h-5 w-[3px] rounded-r bg-[#C76942]"
                          transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                        />
                      )}
                      <motion.span
                        animate={{ x: isActive ? 1 : 0, scale: isActive ? 1.04 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`material-symbols-outlined text-[19px] ${
                          isActive ? 'text-[#24533F]' : 'text-[#8FABA0] group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="truncate">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-5 py-5">
          <div className="flex items-center gap-3 text-[#AFC1B9]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
              <span className="material-symbols-outlined text-[18px]">hard_drive</span>
            </span>
            <div>
              <p className="text-[11px] font-semibold text-white/90">Penyimpanan lokal</p>
              <p className="mt-0.5 text-[10px] font-medium text-white/45">Data tetap di perangkat</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
