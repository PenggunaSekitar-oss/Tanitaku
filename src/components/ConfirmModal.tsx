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
        return 'bg-[#154734] hover:bg-[#0d3124] text-white';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-black font-black';
      case 'danger':
      default:
        return 'bg-danger hover:bg-danger/90 text-white';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface neo-border shadow-[6px_6px_0px_0px_#000] rounded-2xl p-6 w-full max-w-sm relative animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 mb-3">
          {icon && (
            <span className="material-symbols-outlined text-lg text-white bg-[#154734] p-1 rounded neo-border-thin">
              {icon}
            </span>
          )}
          <h3 className="text-sm font-display font-black text-white bg-[#154734] px-3 py-1 rounded-md neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <p className="text-on-surface text-xs sm:text-sm mb-6 leading-relaxed font-semibold whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-on-surface-muted hover:text-on-surface transition rounded-xl border-2 border-black hover:bg-surface-high cursor-pointer"
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition shadow-[2px_2px_0px_0px_#000] border-2 border-black cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${getConfirmBtnClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
