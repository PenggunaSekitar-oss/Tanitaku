import React from 'react';

export function Tile({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[#D8D5CC] bg-[#FBFAF6] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-[#26352D]">{title}</h3>
        <span className="material-symbols-outlined text-[20px] text-[#24533F]" aria-hidden="true">{icon}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
