import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D3D6D1] bg-[#F8F7F2] px-5 py-8 text-center">
      <span className="material-symbols-outlined mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8ECE8] text-[22px] text-[#52665A]">{icon}</span>
      <h3 className="font-display text-base font-semibold text-[#27352D]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[#6C7770]">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#24533F] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1B4031]"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
