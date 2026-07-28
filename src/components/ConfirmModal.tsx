import React, { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning' | 'success';
  icon?: string;
}

export function ConfirmModal({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel, 
  title = "Konfirmasi Tindakan",
  confirmText = "HAPUS", 
  cancelText = "BATAL",
  confirmVariant = 'danger',
  icon
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getConfirmBtnClass = () => {
    switch (confirmVariant) {
      case 'primary':
      case 'success':
        return 'bg-[#24533F] hover:bg-[#1B4031] text-white';
      case 'warning':
        return 'bg-[#A56E24] hover:bg-[#87591D] text-white';
      case 'danger':
      default:
        return 'bg-[#A34335] hover:bg-[#87362C] text-white';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17211C]/55 p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm rounded-[18px] border border-[#D8D5CC] bg-[#FBFAF6] p-6 shadow-[0_20px_60px_rgba(15,25,20,0.18)] animate-in zoom-in-95 duration-150">
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <span className="material-symbols-outlined flex size-9 items-center justify-center rounded-xl bg-[#E7EDE9] text-[19px] text-[#24533F]">
              {icon}
            </span>
          )}
          <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-[#1B2721]">
            {title}
          </h3>
        </div>
        <p className="mb-6 whitespace-pre-line text-xs font-medium leading-relaxed text-[#626D66] sm:text-sm">{message}</p>
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <button 
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-[#CBC9C1] bg-white px-4 py-2.5 text-xs font-semibold text-[#4F5B54] transition hover:bg-[#F1F0EB] sm:text-sm"
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${getConfirmBtnClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
