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
    function handleClickOutside(event: MouseEvent) {
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
    <div className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={ref}>
      <div 
        className={`w-full flex items-center justify-between min-h-[48px] px-4 py-2.5 rounded-[8px_3px_8px_3px] bg-surface-high neo-border-thin ${disabled ? 'pointer-events-none' : 'cursor-pointer hover:bg-surface'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={`text-[15px] font-medium pr-2 ${selectedOption ? "text-on-surface" : "text-on-surface-muted"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-action' : 'text-on-surface-muted'}`}>
          expand_more
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 min-w-[100%] w-max mt-2 bg-surface neo-border  rounded-[8px_3px_8px_3px] max-h-[200px] overflow-y-auto py-1" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>
          {options.length === 0 ? (
            <div className="p-4 text-on-surface-muted text-[15px] text-center">Tidak ada opsi</div>
          ) : (
            options.map((opt) => (
              <div 
                key={opt.value}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-4 ${value === opt.value ? 'bg-action text-on-action font-black' : 'text-on-surface hover:bg-surface-high'}`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                <span className="text-[15px] whitespace-normal break-words">{opt.label}</span>
                {value === opt.value && (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
