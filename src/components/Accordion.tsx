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
    <div className="bg-surface-high neo-border-thin rounded-[16px_8px_16px_8px] flex flex-col transition-all">
      <button 
        type="button" 
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-high transition-colors"
      >
        <h3 className="text-sm font-brutal uppercase text-white font-extrabold bg-[#154734] px-2.5 py-1 rounded-[6px_2px_6px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-flex tracking-wider items-center gap-2">
          {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
          {title}
        </h3>
        <span className={`material-symbols-outlined text-[20px] text-on-surface-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 pt-4 border-t-2 border-black">
          {children}
        </div>
      </div>
    </div>
  );
}