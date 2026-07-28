import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Accordion({ title, icon, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle }: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#D8D5CC] bg-[#F8F7F2] transition">
      <button 
        type="button" 
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white"
      >
        <h3 className="inline-flex items-center gap-2 font-display text-sm font-semibold text-[#26352D]">
          {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
          {title}
        </h3>
        <span className={`material-symbols-outlined text-[20px] text-on-surface-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="border-t border-[#DEDCD4] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
