import React from 'react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'pemantauan', label: 'Lahan', icon: 'psychiatry' },
  { id: 'pemupukan', label: 'Perawatan', icon: 'compost' },
  { id: 'keuangan', label: 'Keuangan', icon: 'payments' },
];

export function MobileBottomNav({ currentView, onNavigate }: MobileBottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around gap-1 border-t border-[#D9D8D1] bg-[#FBFAF6] px-2 py-1.5 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = currentView === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate(item.id)}
            className={`flex min-h-[48px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg px-1 py-1.5 transition ${
              isActive
                ? 'bg-[#E2EBE4] font-bold text-[#173F35]'
                : 'text-[#69736D] hover:bg-[#F0EEE8] hover:text-[#27332C]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#24533F]' : 'text-[#69736D]'}`}>
              {item.icon}
            </span>
            <span className="mt-0.5 text-[11px] font-semibold leading-none">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
