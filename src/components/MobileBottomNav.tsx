import React from 'react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSidebar: () => void;
  onOpenPintasan?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'pemantauan', label: 'Lahan', icon: 'psychiatry' },
  { id: 'pemupukan', label: 'Perawatan', icon: 'compost' },
  { id: 'keuangan', label: 'Keuangan', icon: 'payments' },
];

export function MobileBottomNav({ currentView, onNavigate, onOpenSidebar, onOpenPintasan }: MobileBottomNavProps) {
  const handlePintasanClick = onOpenPintasan || onOpenSidebar;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FEFEFA]/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-1.5 shadow-lg shadow-slate-200/50 flex items-center justify-around gap-1 selection:bg-[#154734] selection:text-white">
      {NAV_ITEMS.map((item) => {
        const isActive = currentView === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[46px] cursor-pointer ${
              isActive
                ? 'bg-[#154734] text-white font-bold shadow-xs shadow-[#154734]/20'
                : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#154734]'}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-display font-semibold uppercase tracking-wider leading-none mt-0.5 ${isActive ? 'text-white' : 'text-slate-700'}`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}

      {/* Button Pintasan Fitur Operasional */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handlePintasanClick}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[46px] cursor-pointer text-slate-700 hover:bg-[#154734]/10 hover:text-[#154734]"
        title="Pintasan Fitur Operasional"
      >
        <span className="material-symbols-outlined text-[20px] text-[#154734] font-bold">
          grid_view
        </span>
        <span className="text-[10px] font-display font-bold uppercase tracking-wider leading-none mt-0.5 text-slate-800">
          Pintasan
        </span>
      </motion.button>
    </nav>
  );
}
