import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export function Select({ options, value, onChange, placeholder = 'Pilih...', className = '', required, disabled, error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref]);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative min-w-0 max-w-full ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={ref}>
      <button
        type="button"
        className={`flex min-h-[48px] w-full min-w-0 max-w-full items-center justify-between rounded-xl border border-[#CBC8BF] bg-white px-3 py-2.5 text-left sm:px-4 ${disabled ? 'pointer-events-none' : 'cursor-pointer hover:border-[#9AA69E]'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <span className={`min-w-0 truncate pr-2 text-[15px] font-medium ${selectedOption ? "text-on-surface" : "text-on-surface-muted"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-action' : 'text-on-surface-muted'}`}>
          expand_more
        </span>
      </button>

      {isOpen && !disabled && (
        <div role="listbox" className="absolute left-0 z-50 mt-2 max-h-[200px] w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto rounded-xl border border-[#D8D5CC] bg-[#FBFAF6] py-1 shadow-[0_12px_30px_rgba(24,35,29,0.12)]" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>
          {options.length === 0 ? (
            <div className="p-4 text-on-surface-muted text-[15px] text-center">Tidak ada opsi</div>
          ) : (
            options.map((opt, index) => (
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                key={`${opt.value}-${index}`}
                className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 px-3 py-3 text-left transition-colors sm:px-4 ${value === opt.value ? 'bg-[#E4ECE7] font-semibold text-[#214433]' : 'text-on-surface hover:bg-surface-high'}`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                <span className="min-w-0 whitespace-normal break-words text-[15px]">{opt.label}</span>
                {value === opt.value && (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
