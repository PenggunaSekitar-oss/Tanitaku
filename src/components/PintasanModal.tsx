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
    desc: 'Katalog varietas & benih',
    category: 'Katalog',
  },
  { 
    id: 'cari-pupuk', 
    title: 'Cari Pupuk', 
    icon: 'compost', 
    desc: 'Katalog formulasi & dosis',
    category: 'Katalog',
  },
  { 
    id: 'cari-pestisida', 
    title: 'Cari Pestisida', 
    icon: 'shield', 
    desc: 'Katalog proteksi tanaman',
    category: 'Katalog',
  },
  { 
    id: 'cari-penyakit', 
    title: 'Cari Penyakit', 
    icon: 'bug_report', 
    desc: 'Referensi hama & penyakit',
    category: 'Katalog',
  },
  { 
    id: 'kocor', 
    title: 'Kocor Pupuk', 
    icon: 'science', 
    desc: 'Kalkulator air & nutrisi',
    category: 'Perawatan',
  },
];

export function PintasanModal({ isOpen, onClose, onNavigate, currentView }: PintasanModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#17211C]/55"
        />

        {/* Modal / Bottom Sheet Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[22px] border border-[#D8D5CC] bg-[#FBFAF6] shadow-[0_20px_60px_rgba(15,25,20,0.18)] sm:rounded-[22px]"
        >
          {/* Handlebar for mobile dragging hint */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-[#FEFEFA] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7EDE9] text-[#24533F]">
                <span className="material-symbols-outlined text-[22px]">grid_view</span>
              </div>
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Pintasan Fitur Operasional
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Buka alat referensi dan perhitungan tanpa kembali ke dashboard
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
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`group relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition ${
                      isKocor ? 'col-span-2 sm:col-span-2' : ''
                    } ${
                      isActive
                        ? 'border-[#557362] bg-[#E7EEE9] ring-1 ring-[#557362]'
                        : 'border-[#D8D5CC] bg-[#F8F7F2] hover:border-[#9EAAA2] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9D4CD] bg-[#E9EFEB] text-[#24533F] transition">
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{item.icon}</span>
                      </div>
                      {isActive && (
                        <span className="rounded-md bg-[#24533F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="block font-display text-xs font-semibold leading-tight text-[#233129] sm:text-sm">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[10px] font-medium leading-tight text-[#707A73]">
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
      )}
    </AnimatePresence>
  );
}
