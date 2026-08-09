import React, { useState, useRef, useEffect } from 'react';
import { TANAMAN_OPTIONS, TANAMAN_CATEGORIES, TanamanOption } from '../data/tanamanData';

interface TanamanSelectProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function TanamanSelect({ value, onChange, placeholder = '-- Pilih / Ketik Nama Tanaman --', className = '' }: TanamanSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Sync search term if value is custom or selected
  const selectedObj = TANAMAN_OPTIONS.find(t => t.value.toLowerCase() === value.toLowerCase() || t.label.toLowerCase() === value.toLowerCase());

  const filteredOptions = TANAMAN_OPTIONS.filter(item => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.value.toLowerCase().includes(q) ||
      item.latin.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q)
    );
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCustomInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        onChange(searchTerm.trim());
        setIsOpen(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Input Display Trigger */}
      <div 
        className="w-full flex items-center justify-between min-h-[48px] px-3.5 py-2 rounded-[8px_3px_8px_3px] bg-surface-high neo-border-thin cursor-pointer hover:bg-surface transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((open) => !open);
          } else if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
            potted_plant
          </span>
          <div className="min-w-0 flex-1 truncate">
            {value ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-bold text-on-surface truncate">{selectedObj ? selectedObj.label : value}</span>
                {selectedObj && (
                  <span className="text-xs italic text-on-surface-muted truncate">({selectedObj.latin})</span>
                )}
                {!selectedObj && (
                  <span className="text-[10px] font-black uppercase bg-[#154734] text-white px-1.5 py-0.5 rounded border border-[#0A0A0A]">
                    Custom
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[15px] text-on-surface-muted font-medium">{placeholder}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearchTerm('');
              }}
              className="p-1 hover:bg-surface rounded-full text-on-surface-muted hover:text-rose-500 transition-colors"
              title="Hapus pilihan"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isOpen ? 'rotate-180 text-action' : 'text-on-surface-muted'}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-surface neo-border rounded-[8px_3px_8px_3px] shadow-xl overflow-hidden max-h-[360px] flex flex-col">
          {/* Search Box & Manual Input */}
          <div className="p-2.5 bg-surface-high border-b border-outline flex flex-col gap-2">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-muted text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleCustomInputSubmit}
                placeholder="Cari dari 100 tanaman atau ketik nama baru..."
                className="w-full bg-surface text-on-surface text-xs font-bold pl-9 pr-8 py-2 rounded neo-border-thin focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 text-on-surface-muted hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Custom Input Badge Option if query entered */}
            {searchTerm.trim() && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className="w-full text-left p-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/50 text-xs font-bold text-on-surface flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-sm text-black">edit_note</span>
                  <span className="truncate">Gunakan Nama Custom: "<span className="underline font-black">{searchTerm.trim()}</span>"</span>
                </div>
                <span className="text-[10px] uppercase font-black bg-[#154734] text-white px-2 py-0.5 rounded neo-border-thin shrink-0">
                  PILIH CUSTOM
                </span>
              </button>
            )}
          </div>

          {/* Categorized Options List */}
          <div role="listbox" className="overflow-y-auto flex-1 p-1.5 space-y-3 text-xs" style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-on-surface-muted">
                <span className="material-symbols-outlined text-3xl block mb-1">eco</span>
                <p className="font-semibold text-xs">Tanaman tidak ditemukan di database 100 populer.</p>
                <p className="text-[11px] mt-1">Ketik di atas lalu tekan Enter atau klik "PILIH CUSTOM" untuk menggunakan nama tanaman Anda sendiri.</p>
              </div>
            ) : (
              TANAMAN_CATEGORIES.map(cat => {
                const itemsInCat = filteredOptions.filter(o => o.kategori === cat);
                if (itemsInCat.length === 0) return null;

                return (
                  <div key={cat} className="flex flex-col gap-1">
                    <div className="sticky top-0 bg-surface-high/95 backdrop-blur border-y border-outline/40 px-2.5 py-1 text-[11px] font-black uppercase text-on-surface-muted tracking-wider flex items-center justify-between">
                      <span>{cat}</span>
                      <span className="text-[10px] bg-surface px-1.5 py-0.2 rounded border border-outline/50">{itemsInCat.length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                      {itemsInCat.map(opt => {
                        const isSelected = value.toLowerCase() === opt.value.toLowerCase() || value.toLowerCase() === opt.label.toLowerCase();
                        return (
                          <div
                            key={opt.value}
                            onClick={() => handleSelect(opt.label)}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleSelect(opt.label);
                              }
                            }}
                            className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between gap-2 border ${
                              isSelected
                                ? 'bg-primary/20 border-primary font-black text-on-surface'
                                : 'bg-surface hover:bg-surface-high border-outline/30 text-on-surface'
                            }`}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs text-on-surface truncate">{opt.label}</span>
                              <span className="text-[10px] italic text-on-surface-muted truncate">{opt.latin}</span>
                            </div>
                            {isSelected && (
                              <span className="material-symbols-outlined text-sm text-primary shrink-0">check_circle</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
