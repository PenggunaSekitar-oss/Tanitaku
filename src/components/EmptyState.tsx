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
    <div className="flex flex-col items-center justify-center p-12 text-center border border-outline border-dashed bg-surface-high rounded-sm">
      <span className="material-symbols-outlined text-5xl text-on-surface-muted mb-4">{icon}</span>
      <h3 className="font-display font-semibold text-lg text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-muted max-w-sm mb-6 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-action text-on-action px-6 h-[48px] rounded-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          <span className="material-symbols-outlined">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
