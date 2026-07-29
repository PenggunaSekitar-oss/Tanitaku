import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17211C]/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative w-full max-w-sm rounded-[18px] border border-[#D8D5CC] bg-[#FBFAF6] p-6 shadow-[0_20px_60px_rgba(15,25,20,0.18)]"
            initial={{ opacity: 0, y: 18, scale: 0.97, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(2px)' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-center gap-3">
              {icon && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 24 }}
                  className="material-symbols-outlined flex size-9 items-center justify-center rounded-xl bg-[#E7EDE9] text-[19px] text-[#24533F]"
                >
                  {icon}
                </motion.span>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
