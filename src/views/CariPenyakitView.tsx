import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { Select } from '../components/Select';
import { ConfirmModal } from '../components/ConfirmModal';
import { CatalogMeta } from '../components/CatalogMeta';
import { PENYAKIT_DB as PENYAKIT_CATALOG, TANAMAN_OPTIONS, PENYAKIT_OPTIONS, Penyakit } from '../data/penyakitData';

export function CariPenyakitView({ navigate }: { navigate?: (view: string) => void }) {
  const [penyakitInput, setPenyakitInput] = useState('');
  const [tanamanInput, setTanamanInput] = useState('Semua');
  const [kategoriInput, setKategoriInput] = useState('Semua');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Penyakit[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
      
      const scored = PENYAKIT_CATALOG.map(item => {
        let score = 0;
        let isMatch = true;
        
        const qPenyakit = penyakitInput.trim().toLowerCase();
        if (qPenyakit) {
            if (item.nama.toLowerCase() === qPenyakit) {
                score += 15;
            } else if (item.nama.toLowerCase().includes(qPenyakit) || item.gejala.toLowerCase().includes(qPenyakit)) {
                score += 8;
            } else {
                isMatch = false;
            }
        }
        
        if (tanamanInput !== 'Semua') {
            if (item.tanaman.some(t => t === tanamanInput || t.includes(tanamanInput))) {
                score += 10;
            } else {
                isMatch = false;
            }
        }

        if (kategoriInput !== 'Semua') {
            if (item.kategori.toLowerCase() === kategoriInput.toLowerCase()) {
                score += 5;
            } else {
                isMatch = false;
            }
        }
        
        return { ...item, score, isMatch };
      });
      
      let filtered = scored.filter(i => i.isMatch);
      filtered.sort((a, b) => b.score - a.score);

    setResults(filtered);
  };

  const availablePenyakit = tanamanInput === 'Semua' 
    ? PENYAKIT_CATALOG 
    : PENYAKIT_CATALOG.filter(item => item.tanaman.some(t => t === tanamanInput || t.includes(tanamanInput)));

  const dynamicPenyakitOptions = [
    { value: '', label: '-- Semua / Pilih Penyakit --' },
    ...availablePenyakit.map(p => ({
      value: p.nama,
      label: p.nama
    }))
  ];

  const handleReset = () => {
    setPenyakitInput('');
    setTanamanInput('Semua');
    setKategoriInput('Semua');
    setHasSearched(false);
    setResults([]);
    setShowResetConfirm(false);
  };

  const getIconForKategori = (kategori: string) => {
    const k = kategori.toLowerCase();
    if (k.includes('jamur')) return 'coronavirus';
    if (k.includes('bakteri')) return 'microbiology';
    if (k.includes('virus')) return 'pest_control';
    if (k.includes('nematoda')) return 'bug_report';
    return 'science';
  };

  const extractSearchKeyword = (item: Penyakit) => {
    // Clean up species names in parentheses like "(Spodoptera litura)"
    const nameWithoutParens = item.nama.replace(/\(.*?\)/g, '').trim();
    return nameWithoutParens || item.nama;
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Referensi Penyakit Tanaman"
        subtitle="Cari kecocokan nama dan gejala pada katalog hama, jamur, bakteri, atau virus. Hasil bukan diagnosis lapangan."
        action={<CatalogMeta count={PENYAKIT_CATALOG.length} unit="referensi" />}
      />

      <div className="flex w-full flex-col gap-5">
      <section className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-[#26352D]">
          Filter hama dan penyakit
        </h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col w-full">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Jenis Tanaman Inang</label>
            <Select 
              options={TANAMAN_OPTIONS} 
              value={tanamanInput} 
              onChange={(val) => { setTanamanInput(val); setPenyakitInput(''); }} 
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Kategori Organisme</label>
            <Select 
              options={PENYAKIT_OPTIONS} 
              value={kategoriInput} 
              onChange={(val) => setKategoriInput(val)} 
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Nama Hama / Penyakit Spesifik</label>
            <Select 
              options={dynamicPenyakitOptions} 
              value={penyakitInput} 
              onChange={(val) => setPenyakitInput(val)} 
              placeholder="-- Semua Hama &amp; Penyakit --"
              className="w-full"
            />
          </div>
          <div className="md:col-span-3 pt-2 border-t-2 border-[#0A0A0A] flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 bg-[#154734] text-white font-extrabold min-h-[48px] rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#0e3023] transition flex items-center justify-center gap-2">
              Cari referensi
            </button>
            <button type="button" onClick={() => setShowResetConfirm(true)} className="sm:w-32 bg-[#E6E6DC] border-2 border-[#0A0A0A] text-[#0A0A0A] font-extrabold min-h-[48px] rounded hover:bg-[#d0d0c4] transition">
              RESET
            </button>
          </div>
        </form>
      </section>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2">
            <h3 className="font-display font-extrabold uppercase text-lg text-[#0A0A0A]">Hasil Identifikasi</h3>
            <span className="text-xs font-bold bg-white text-[#0A0A0A] px-3 py-1.5 rounded border-2 border-[#0A0A0A]">{results.length} Referensi Ditemukan</span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((item, idx) => {
                const targetKeyword = extractSearchKeyword(item);
                return (
                  <div key={item.id || idx} className="bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col h-full relative overflow-hidden">
                    {idx === 0 && (item as any).score >= 10 && (
                      <div className="absolute -top-3 -right-2 bg-[#154734] text-white font-extrabold text-[10px] px-3 py-1 rounded border border-[#0A0A0A] z-10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        KECOCOKAN FILTER TERTINGGI
                      </div>
                    )}
                    
                    <div className="p-4 border-b-2 border-[#0A0A0A] flex justify-between items-start bg-[#154734] text-white rounded-t gap-2">
                      <div className="flex-1">
                        <h3 className="font-display font-extrabold text-lg text-white uppercase leading-snug">{item.nama}</h3>
                        <p className="text-xs font-mono text-white/80 mt-1">
                          Penyebab: <span className="italic font-bold text-white">{item.penyebab}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0A] text-white px-2.5 py-1 rounded border border-[#0A0A0A] inline-flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[14px]">{getIconForKategori(item.kategori)}</span>
                        {item.kategori}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tanaman.map(t => (
                          <span key={t} className="text-[11px] font-bold uppercase tracking-wider bg-[#E6E6DC] border border-[#0A0A0A] px-2.5 py-1 rounded text-[#0A0A0A]">
                            Inang: {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="bg-[#E6E6DC]/40 p-3 rounded border border-[#0A0A0A]">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#154734] block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">search</span>
                            Ciri-Ciri &amp; Gejala Lapangan
                          </span>
                          <p className="text-xs text-[#0A0A0A] leading-relaxed font-medium">{item.gejala}</p>
                        </div>

                        <div className="bg-[#E6E6DC]/40 border border-[#0A0A0A] p-3 rounded flex flex-col gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] block flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">medication</span>
                            Penanganan Kimia / Bakterisida / Fungisida
                          </span>
                          <p className="text-xs text-[#0A0A0A] font-semibold leading-relaxed">{item.kimia}</p>
                          
                          <button 
                            type="button"
                            onClick={() => {
                              localStorage.setItem('targetPestisida', targetKeyword);
                              if (tanamanInput && tanamanInput !== 'Semua') {
                                localStorage.setItem('targetTanaman', tanamanInput);
                              }
                              if (navigate) {
                                navigate('cari-pestisida');
                              }
                            }}
                            className="w-full text-left bg-[#FEFEFA] hover:bg-[#E6E6DC]/60 border-2 border-[#0A0A0A] p-3 rounded flex items-center justify-between transition cursor-pointer shadow-[2px_2px_0px_0px_#0A0A0A]"
                          >
                            <div className="flex flex-col">
                              <span className="text-[11px] text-[#154734] font-extrabold uppercase tracking-wider">CARI OBAT DI KATALOG PESTISIDA</span>
                              <span className="text-xs font-bold text-[#0A0A0A]">
                                Filter Target: "{targetKeyword}" {tanamanInput !== 'Semua' ? `(${tanamanInput})` : ''}
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-[#154734] text-xl font-bold">arrow_forward</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-[#E6E6DC]/40 p-3 rounded border border-[#0A0A0A]">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#154734] block mb-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">eco</span>
                              Penanganan Organik
                            </span>
                            <p className="text-xs text-[#0A0A0A] leading-relaxed">{item.organik}</p>
                          </div>
                          <div className="bg-[#E6E6DC]/40 p-3 rounded border border-[#0A0A0A]">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#154734] block mb-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">shield</span>
                              Tindakan Pencegahan
                            </span>
                            <p className="text-xs text-[#0A0A0A] leading-relaxed">{item.pencegahan}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 bg-[#FEFEFA] border-2 border-dashed border-[#0A0A0A] text-center flex flex-col items-center justify-center gap-4 rounded">
              <span className="material-symbols-outlined text-5xl text-[#5C5C5C]">search_off</span>
              <div>
                <p className="text-base font-bold text-[#0A0A0A]">Tidak ada referensi ditemukan</p>
                <p className="text-xs text-[#5C5C5C] mt-1">Coba ubah filter tanaman atau kategori organisme.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal 
        isOpen={showResetConfirm}
        message="Apakah Anda yakin ingin mereset hasil pencarian?"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
        confirmText="YA, RESET"
        cancelText="TIDAK"
      />
      </div>
    </div>
  );
}
