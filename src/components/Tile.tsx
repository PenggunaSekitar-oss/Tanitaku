import React from 'react';

export function Tile({ title, icon, children }: any) {
  return (
    <div className="bg-surface border border-outline rounded-sm p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-sm tracking-wider text-white font-extrabold bg-[#154734] px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block uppercase">{title}</h3>
        <span className="material-symbols-outlined text-white font-bold bg-[#154734] px-2 py-0.5 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block">{icon}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
