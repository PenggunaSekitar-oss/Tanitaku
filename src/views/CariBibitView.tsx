import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { Select } from '../components/Select';
import { ConfirmModal } from '../components/ConfirmModal';
import { CatalogMeta } from '../components/CatalogMeta';
import { BIBIT_CATALOG as CATALOG, ELEVATION_OPTIONS, CUACA_OPTIONS, BibitItem, getBibitDetails } from '../data/bibitData';
import { CatalogHistory } from '../components/CatalogHistory';
import { CatalogComparison, CompareToggle, ComparisonItem } from '../components/CatalogComparison';
import { EmptyState } from '../components/EmptyState';
import { HelpTip } from '../components/HelpTip';
import {
  CatalogHistoryEntry,
  readCatalogHistory,
  upsertCatalogHistory,
  writeCatalogHistory,
} from '../utils/catalogHistory';

type BibitFilters = { komoditas: string; ketinggian: string; cuaca: string };
const HISTORY_KEY = 'tanita_history_bibit';

export function CariBibitView() {
  const [komoditas, setKomoditas] = useState('');
  const [ketinggian, setKetinggian] = useState('Rendah');
  const [cuaca, setCuaca] = useState('Semua');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<BibitItem[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [history, setHistory] = useState<CatalogHistoryEntry<BibitFilters>[]>(() =>
    readCatalogHistory<BibitFilters>(HISTORY_KEY),
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const handleReset = () => {
    setKomoditas('');
    setKetinggian('Rendah');
    setCuaca('Semua');
    setHasSearched(false);
    setResults([]);
    setShowResetConfirm(false);
    setCompareIds([]);
  };

  const performSearch = (
    komoditasValue: string,
    ketinggianValue: string,
    cuacaValue: string,
  ) => {
    setHasSearched(true);
      
      const query = komoditasValue.trim().toLowerCase();
      
      const scored = CATALOG.map(item => {
        let score = 0;
        let isMatch = true;
        
        // Match Komoditas / Nama
        if (query) {
          const itemKom = item.komoditas.toLowerCase();
          const itemNama = item.nama.toLowerCase();
          if (itemKom === query || itemNama === query) {
            score += 20;
          } else if (itemKom.includes(query) || itemNama.includes(query)) {
            score += 10;
          } else {
            isMatch = false;
          }
        }
        
        // 1. Ketinggian (H)
        const dataranStr = (item.rekomendasiDataran || (item.ketinggian ? item.ketinggian.join(' ') : '')).toLowerCase();
        if (ketinggianValue === 'Rendah') {
          if (dataranStr.includes('rendah')) {
            score += 15;
          } else {
            isMatch = false;
          }
        } else if (ketinggianValue === 'Menengah') {
          if (dataranStr.includes('menengah') || dataranStr.includes('sedang') || (dataranStr.includes('rendah') && dataranStr.includes('tinggi'))) {
            score += 15;
          } else {
            isMatch = false;
          }
        } else if (ketinggianValue === 'Tinggi') {
          if (dataranStr.includes('tinggi')) {
            score += 15;
          } else {
            isMatch = false;
          }
        }
        
        // 2. Musim (M)
        const keunggulanStr = (Array.isArray(item.keunggulan) ? item.keunggulan.join(' ') : item.keunggulan || '').toLowerCase();
        const deskripsiStr = (item.deskripsi || '').toLowerCase();
        const combined = `${keunggulanStr} ${deskripsiStr}`;

        if (cuacaValue === 'Hujan') {
          // Musim Hujan: Tahan genangan, akar kuat, resisten penyakit jamur/bakteri
          if (combined.includes('layu') || combined.includes('patek') || combined.includes('antraknosa') || combined.includes('hujan') || combined.includes('kebasahan') || combined.includes('busuk') || combined.includes('bakteri') || combined.includes('akar')) {
            score += 10;
          }
        } else if (cuacaValue === 'Kemarau') {
          // Musim Kemarau: Genjah (cepat panen) & efisien penggunaan air
          if (combined.includes('genjah') || combined.includes('cepat') || combined.includes('kering') || combined.includes('panas') || combined.includes('kekeringan') || combined.includes('air')) {
            score += 10;
          }
        }

        return { ...item, score, isMatch };
      });
      
      const filtered = scored.filter(i => i.isMatch);
      filtered.sort((a, b) => b.score - a.score);
    setResults(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(komoditas, ketinggian, cuaca);
    const filters = { komoditas, ketinggian, cuaca };
    setHistory((current) => {
      const next = upsertCatalogHistory(
        current,
        filters,
        `${komoditas || 'Semua komoditas'} · ${ketinggian} · ${cuaca}`,
      );
      writeCatalogHistory(HISTORY_KEY, next);
      return next;
    });
  };

  const handleHistorySelect = (entry: CatalogHistoryEntry<BibitFilters>) => {
    setKomoditas(entry.filters.komoditas);
    setKetinggian(entry.filters.ketinggian);
    setCuaca(entry.filters.cuaca);
    performSearch(entry.filters.komoditas, entry.filters.ketinggian, entry.filters.cuaca);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : current,
    );
  };

  const comparisonItems: ComparisonItem[] = compareIds
    .map((id) => CATALOG.find((item) => item.nama === id))
    .filter((item): item is BibitItem => Boolean(item))
    .map((item) => {
      const details = getBibitDetails(item);
      return {
        id: item.nama,
        name: item.nama,
        subtitle: `${item.komoditas} · ${item.produsen}`,
        values: {
          elevation: item.rekomendasiDataran || item.ketinggian?.join(', '),
          harvest: item.umurPanen,
          yield: item.potensiHasil,
          strength: details.keunggulanText,
          price: details.harga,
        },
      };
    });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Referensi Bibit"
        subtitle="Filter katalog varietas berdasarkan ketinggian dan karakter musim yang tercatat. Verifikasi kembali informasi pada label produsen."
        action={<CatalogMeta count={CATALOG.length} unit="varietas" />}
      />

      <CatalogHistory
        entries={history}
        onSelect={handleHistorySelect}
        onClear={() => {
          setHistory([]);
          writeCatalogHistory(HISTORY_KEY, []);
        }}
      />

      <section className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-[#26352D]">Filter komoditas dan kondisi lahan</h2>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Komoditas (Cth: Cabai Rawit)</label>
            <input 
              type="text" 
              value={komoditas} 
              onChange={e => setKomoditas(e.target.value)} 
              className="w-full bg-white border-2 border-[#0A0A0A] px-4 py-2.5 min-h-[48px] text-sm text-[#0A0A0A] rounded focus:outline-none" 
              placeholder="Mau tanam apa?" 
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">
              Topografi / Ketinggian
              <HelpTip label="Ketinggian lahan" text="Rentang dataran mengikuti keterangan adaptasi varietas di katalog. Kondisi mikroklimat lahan tetap perlu diperiksa." />
            </label>
            <Select 
              options={ELEVATION_OPTIONS} 
              value={ketinggian} 
              onChange={(val) => setKetinggian(val)} 
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Kondisi Musim (M)</label>
            <Select 
              options={CUACA_OPTIONS} 
              value={cuaca} 
              onChange={(val) => setCuaca(val)} 
              className="w-full"
            />
          </div>
          <div className="md:col-span-3 pt-2 flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 bg-[#154734] text-white font-extrabold min-h-[52px] rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#0e3023] transition flex items-center justify-center gap-2">
              Cari bibit
            </button>
            <button type="button" onClick={() => setShowResetConfirm(true)} className="sm:w-32 bg-[#E6E6DC] border-2 border-[#0A0A0A] text-[#0A0A0A] font-extrabold min-h-[52px] rounded hover:bg-[#d0d0c4] transition">
              RESET
            </button>
          </div>
        </form>
      </section>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2">
            <h3 className="font-display font-extrabold uppercase text-lg text-[#0A0A0A]">Hasil Pencarian</h3>
            <span className="text-xs font-bold text-[#5C5C5C]">{results.length} Varian Ditemukan</span>
          </div>

          <CatalogComparison
            items={comparisonItems}
            fields={[
              { key: 'elevation', label: 'Adaptasi dataran' },
              { key: 'harvest', label: 'Umur panen' },
              { key: 'yield', label: 'Potensi hasil' },
              { key: 'strength', label: 'Keunggulan' },
              { key: 'price', label: 'Kisaran harga' },
            ]}
            onRemove={toggleCompare}
            onClear={() => setCompareIds([])}
          />

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item, idx) => {
                const details = getBibitDetails(item);
                return (
                  <div key={idx} className="bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col h-full relative overflow-hidden">
                    {idx === 0 && (item as any).score >= 15 && (
                      <div className="absolute -top-3 -right-2 bg-[#154734] text-white font-extrabold text-[10px] px-3 py-1 rounded border border-[#0A0A0A] z-10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        KECOCOKAN FILTER TERTINGGI
                      </div>
                    )}
                    
                    <div className="p-4 border-b-2 border-[#0A0A0A] flex justify-between items-start bg-[#154734] text-white rounded-t gap-2">
                      <div className="flex-1">
                        <h3 className="font-display font-extrabold text-lg text-white uppercase leading-snug">{item.nama}</h3>
                        <p className="text-xs font-mono text-white/80 mt-0.5">{item.komoditas} &middot; {item.produsen}</p>
                      </div>
                      <CompareToggle
                        selected={compareIds.includes(item.nama)}
                        disabled={compareIds.length >= 3}
                        onClick={() => toggleCompare(item.nama)}
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {idx === 0 && (item as any).score >= 15 && (
                        <div className="bg-[#E6E6DC]/50 border-l-4 border-[#154734] p-3 mb-1 rounded text-xs border-y border-r border-[#0A0A0A]">
                          <p className="font-bold text-[#154734] mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">filter_alt</span> Alasan kecocokan filter</p>
                          <p className="text-[#5C5C5C] text-xs leading-relaxed">
                            Katalog mencantumkan <b>{item.komoditas}</b> untuk <b>{item.rekomendasiDataran || (item.ketinggian ? item.ketinggian.join(', ') : '')}</b>.
                            Potensi hasil yang tertulis: <b>{item.potensiHasil}</b>. Klaim produsen tetap perlu diverifikasi: <i>{details.keunggulanText}</i>.
                          </p>
                        </div>
                      )}

                      {/* Penerapan Rumus Rekomendasi Bibit */}
                      <div className="bg-[#E6E6DC]/40 p-3 border border-[#0A0A0A] rounded text-xs space-y-2">
                        <div className="font-extrabold text-[#154734] uppercase text-[11px] pb-1.5 border-b border-[#0A0A0A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Penerapan Rumus Rekomendasi
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">🏔️ Ketinggian (H): </span>
                          <span className="text-[#5C5C5C] font-medium">
                            {ketinggian === 'Rendah' ? 'Dataran Rendah (H < 400 mdpl) — Toleran suhu panas & kelembaban tinggi' :
                             ketinggian === 'Menengah' ? 'Dataran Sedang (400 ≤ H ≤ 700 mdpl) — Varietas adaptif intermediate' :
                             'Dataran Tinggi (H > 700 mdpl) — Toleran suhu dingin & curah hujan tinggi'}
                          </span>
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">🌤️ Musim (M): </span>
                          <span className="text-[#5C5C5C] font-medium">
                            {cuaca === 'Hujan' ? 'Musim Hujan — Tahan genangan, akar kuat & resisten penyakit jamur/bakteri' :
                             cuaca === 'Kemarau' ? 'Musim Kemarau — Berumur genjah (cepat panen) & efisien penggunaan air' :
                             'Adaptif Sepanjang Musim (Hujan & Kemarau)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 my-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E6E6DC] border border-[#0A0A0A] px-2 py-0.5 rounded text-[#0A0A0A]">
                          Adaptasi: {item.rekomendasiDataran || (item.ketinggian ? item.ketinggian.join(', ') : '')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
                        <div className="bg-[#FEFEFA] p-2 border border-[#0A0A0A] rounded flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#5C5C5C]">Umur Panen</span>
                          <span className="text-xs font-bold text-[#0A0A0A]">{item.umurPanen}</span>
                        </div>
                        <div className="bg-[#FEFEFA] p-2 border border-[#0A0A0A] rounded flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#5C5C5C]">Potensi Hasil</span>
                          <span className="text-xs font-bold text-[#0A0A0A]">{item.potensiHasil}</span>
                        </div>
                        
                        {/* Harga Kemasan Section */}
                        <div className="col-span-2 bg-[#8A9A5B] border border-[#0A0A0A] p-2.5 rounded flex flex-col gap-1 text-white shadow-2xs">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-white">sell</span>
                            Harga Per Kemasan (Pasaran Bebas)
                          </span>
                          <span className="text-sm font-black text-white">{details.harga}</span>
                        </div>
                      </div>

                      <div className="border-t-2 border-[#0A0A0A] pt-3 mt-auto flex flex-col gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#154734] block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> 
                            Keunggulan Utama
                          </span>
                          <p className="text-xs text-[#0A0A0A] leading-relaxed font-medium">{details.keunggulanText}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C43C2C] block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">warning</span> 
                            Catatan Pemeliharaan / Kerentanan
                          </span>
                          <p className="text-xs text-[#0A0A0A] leading-relaxed font-medium">{details.kekurangan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="search_off"
              title="Belum ada varietas yang cocok"
              message="Ubah komoditas, ketinggian, atau kondisi musim lalu coba kembali."
            />
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
  );
}
