import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PintasanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const PINTASAN_FITUR_ALL = [
  { 
    id: 'cari-bibit', 
    title: 'Cari Bibit', 
    icon: 'grass', 
    desc: 'Rekomendasi Varietas & Benih', 
    category: 'Katalog',
    bgClass: 'bg-[#96D8D0]/20 hover:bg-[#96D8D0]/35 border-[#96D8D0]/80',
    iconBg: 'bg-[#96D8D0] text-[#060606]'
  },
  { 
    id: 'cari-pupuk', 
    title: 'Cari Pupuk', 
    icon: 'compost', 
    desc: 'Formulasi & Dosis Nutrisi', 
    category: 'Katalog',
    bgClass: 'bg-[#DAF4AA]/25 hover:bg-[#DAF4AA]/45 border-[#DAF4AA]/80',
    iconBg: 'bg-[#DAF4AA] text-[#060606]'
  },
  { 
    id: 'cari-pestisida', 
    title: 'Cari Pestisida', 
    icon: 'shield', 
    desc: 'Obat & Proteksi Tanaman', 
    category: 'Katalog',
    bgClass: 'bg-[#BEB9CC]/25 hover:bg-[#BEB9CC]/45 border-[#BEB9CC]/80',
    iconBg: 'bg-[#BEB9CC] text-[#060606]'
  },
  { 
    id: 'cari-penyakit', 
    title: 'Cari Penyakit', 
    icon: 'bug_report', 
    desc: 'Diagnosa Hama & Penyakit', 
    category: 'Katalog',
    bgClass: 'bg-[#F1B4B9]/25 hover:bg-[#F1B4B9]/45 border-[#F1B4B9]/80',
    iconBg: 'bg-[#F1B4B9] text-[#060606]'
  },
  { 
    id: 'kocor', 
    title: 'Kocor Pupuk', 
    icon: 'science', 
    desc: 'Kalkulator Dosis Air & Nutrisi', 
    category: 'Perawatan',
    bgClass: 'bg-[#74D1FF]/20 hover:bg-[#74D1FF]/35 border-[#74D1FF]/80',
    iconBg: 'bg-[#74D1FF] text-[#060606]'
  },
];

export function PintasanModal({ isOpen, onClose, onNavigate, currentView }: PintasanModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal / Bottom Sheet Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#FEFEFA] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 max-h-[88vh] flex flex-col z-10 overflow-hidden"
        >
          {/* Handlebar for mobile dragging hint */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-[#FEFEFA] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#154734] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#154734]/20">
                <span className="material-symbols-outlined text-[22px]">grid_view</span>
              </div>
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Pintasan Fitur Operasional
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Akses cepat seluruh modul budidaya, nutrisi, hama &amp; keuangan TANITA
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Tutup Pintasan"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body / Grid */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PINTASAN_FITUR_ALL.map((item) => {
                const isActive = currentView === item.id;
                const isKocor = item.id === 'kocor';
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col items-start text-left gap-2 group cursor-pointer relative ${
                      isKocor ? 'col-span-2 sm:col-span-2' : ''
                    } ${
                      isActive
                        ? `${item.bgClass} ring-2 ring-[#060606]`
                        : `${item.bgClass} shadow-2xs hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-extrabold transition border border-[#060606]/10 shadow-2xs ${item.iconBg}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      {isActive && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#060606] bg-[#060606]/10 px-2 py-0.5 rounded-md border border-[#060606]/20">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-extrabold text-xs sm:text-sm block font-display leading-tight text-[#060606]">
                        {item.title}
                      </span>
                      <span className="text-[10px] leading-tight block mt-1 font-medium text-[#060606]/75">
                        {item.desc}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 text-slate-600 text-xs font-medium flex items-center justify-between gap-2 shrink-0">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="material-symbols-outlined text-[16px] text-[#154734]">verified</span>
              5 Pintasan Fitur Utama
            </span>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-2xs cursor-pointer min-h-[34px]"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
