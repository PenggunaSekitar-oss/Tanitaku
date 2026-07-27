import React from 'react';

const MENU = [
  { id: 'dashboard', label: 'Dashboard', subtitle: 'Ringkasan Lahan', icon: 'dashboard' },
  { id: 'pemantauan', label: 'Pemantauan', subtitle: 'Cek Kondisi', icon: 'psychiatry' },
  { id: 'pemupukan', label: 'Perawatan', subtitle: 'Pupuk & Hama', icon: 'compost' },
  { id: 'kocor', label: 'Kalkulator', subtitle: 'Hitung Dosis Kocor', icon: 'water_drop' },
  { id: 'jenis-hama', label: 'Ensiklopedia', subtitle: 'Jenis Hama', icon: 'bug_report' },
  { id: 'cari-bibit', label: 'Cari Bibit', subtitle: 'Rekomendasi Varietas', icon: 'travel_explore' },
  { id: 'cari-pupuk', label: 'Cari Pupuk', subtitle: 'Rekomendasi Nutrisi', icon: 'eco' },
  { id: 'cari-pestisida', label: 'Cari Pestisida', subtitle: 'Solusi Hama & Penyakit', icon: 'vaccines' },
  { id: 'cari-penyakit', label: 'Cari Penyakit', subtitle: 'Identifikasi Penyakit', icon: 'coronavirus' },
  { id: 'keuangan', label: 'Keuangan', subtitle: 'Biaya & Profit', icon: 'payments' },
  { id: 'log', label: 'Log Aktivitas', subtitle: 'Riwayat Tani', icon: 'history' },
  { id: 'pengaturan', label: 'Pengaturan', subtitle: 'Sistem', icon: 'settings' },
];

export function Sidebar({ currentView, onNavigate, isOpen, onClose }: any) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden" onClick={onClose} />}
      
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 sm:w-80 h-full bg-[#FEFEFA] border-l border-slate-200/80 shadow-2xl transform transition-transform duration-200 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:inset-y-0 md:left-0 md:right-auto md:w-64 md:h-auto md:translate-x-0 md:border-r md:border-l-0 md:shadow-none`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/80 bg-[#FEFEFA]">
          <div className="flex items-center py-1">
            <img 
              src="https://res.cloudinary.com/ddc26noa/image/upload/v1784860433/5199_1_j0xnzq.png" 
              alt="TANITA Logo" 
              className="h-10 w-auto object-contain shrink-0 max-w-[160px]" 
            />
          </div>
          <button onClick={onClose} className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <nav className="space-y-1 px-3">
            {MENU.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[46px] text-left transition-all duration-150 rounded-xl cursor-pointer ${
                    isActive 
                      ? 'bg-[#154734] text-white font-semibold shadow-sm shadow-[#154734]/20' 
                      : 'bg-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <span className={`material-symbols-outlined shrink-0 text-[20px] ${isActive ? 'text-white' : 'text-[#154734]'}`}>
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs font-bold font-display">{item.label}</span>
                    <span className={`text-[10px] uppercase tracking-wider truncate font-medium ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 text-slate-700 font-medium flex items-center justify-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[18px] text-[#154734] shrink-0">eco</span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-center text-slate-600">
            TANITA &mdash; TANAM. PANTAU. PANEN.
          </div>
        </div>
      </aside>
    </>
  );
}

