import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Select } from '../components/Select';
import { CatalogMeta } from '../components/CatalogMeta';
import {
  PUPUK_DB,
  Pupuk,
  getPupukDetails,
  getNormalizedPupukCategory,
  getPupukMarketMetadata,
} from '../data/pupukData';
import { CatalogHistory } from '../components/CatalogHistory';
import { CatalogComparison, CompareToggle, ComparisonItem } from '../components/CatalogComparison';
import { EmptyState } from '../components/EmptyState';
import { HelpTip } from '../components/HelpTip';
import { MarketPriceCard } from '../components/MarketPriceCard';
import { marketAvailabilityRank } from '../data/marketMetadata';
import {
  CatalogHistoryEntry,
  readCatalogHistory,
  upsertCatalogHistory,
  writeCatalogHistory,
} from '../utils/catalogHistory';

type PupukFilters = { tanaman: string; hst: string; fungsi: string };
const HISTORY_KEY = 'tanita_history_pupuk';

export function CariPupukView() {
  const [tanamanInput, setTanamanInput] = useState('');
  const [fungsiInput, setFungsiInput] = useState('');
  const [hstInput, setHstInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({ tanaman: '', hst: -1, fungsi: '' });
  const [history, setHistory] = useState<CatalogHistoryEntry<PupukFilters>[]>(() =>
    readCatalogHistory<PupukFilters>(HISTORY_KEY),
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const FUNGSI_OPTIONS = [
    { value: '', label: 'Semua Fungsi' },
    { value: 'daun', label: 'Daun (Pertumbuhan)' },
    { value: 'akar', label: 'Akar (Awal Tanam)' },
    { value: 'batang', label: 'Batang (Pertumbuhan)' },
    { value: 'bunga', label: 'Bunga (Pembuahan)' },
    { value: 'buah', label: 'Buah (Pembuahan/Pembesaran)' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanamanInput || !hstInput) return;
    
    setSearchParams({ tanaman: tanamanInput, hst: parseInt(hstInput, 10), fungsi: fungsiInput });
    setHasSearched(true);
    const filters = { tanaman: tanamanInput, hst: hstInput, fungsi: fungsiInput };
    setHistory((current) => {
      const next = upsertCatalogHistory(
        current,
        filters,
        `${tanamanInput} · ${hstInput} HST${fungsiInput ? ` · ${fungsiInput}` : ''}`,
      );
      writeCatalogHistory(HISTORY_KEY, next);
      return next;
    });
  };

  const handleHistorySelect = (entry: CatalogHistoryEntry<PupukFilters>) => {
    setTanamanInput(entry.filters.tanaman);
    setHstInput(entry.filters.hst);
    setFungsiInput(entry.filters.fungsi);
    setSearchParams({
      tanaman: entry.filters.tanaman,
      hst: Number.parseInt(entry.filters.hst, 10) || 0,
      fungsi: entry.filters.fungsi,
    });
    setHasSearched(true);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setTanamanInput('');
    setHstInput('');
    setFungsiInput('');
    setSearchParams({ tanaman: '', hst: -1, fungsi: '' });
    setCompareIds([]);
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
    .map((id) => PUPUK_DB.find((item) => item.id === id))
    .filter((item): item is Pupuk => Boolean(item))
    .map((item) => {
      const details = getPupukDetails(item);
      return {
        id: item.id,
        name: item.nama,
        subtitle: item.kategori,
        values: {
          content: item.kandungan,
          phase: `${item.fase.join(', ')} · ${item.minHst}–${item.maxHst} HST`,
          dose: item.dosis,
          form: item.bentuk,
          price: details.hargaNonSubsidi,
        },
      };
    });

  const filteredPupuk = useMemo(() => {
    if (!hasSearched) return [];
    const scored = PUPUK_DB.map(p => {
      let score = 0;
      let isMatch = true;
      score += marketAvailabilityRank(getPupukMarketMetadata(p).availability) * 2;

      // Filter by HST
      if (searchParams.hst >= p.minHst && searchParams.hst <= p.maxHst) {
        score += 10;
        const midPoint = (p.minHst + p.maxHst) / 2;
        const distance = Math.abs(searchParams.hst - midPoint);
        const maxDistance = (p.maxHst - p.minHst) / 2 || 1;
        score += (5 * Math.max(0, 1 - distance / maxDistance));
      } else {
        isMatch = false;
      }

      // Filter by Fungsi
      if (searchParams.fungsi) {
        const f = searchParams.fungsi;
        const ket = p.keterangan.toLowerCase();
        let matchFungsi = false;
        
        if (f === 'daun') {
          if (ket.includes('daun') || p.fase.includes('Vegetatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'akar') {
          if (ket.includes('akar') || p.fase.includes('Dasar') || p.fase.includes('Vegetatif Awal')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'batang') {
          if (ket.includes('batang') || p.fase.includes('Vegetatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'bunga') {
          if (ket.includes('bunga') || p.fase.includes('Generatif Awal') || p.fase.includes('Generatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        } else if (f === 'buah') {
          if (ket.includes('buah') || p.fase.includes('Generatif')) { matchFungsi = true; score += 10; }
          else if (p.fase.includes('Semua Fase')) { matchFungsi = true; score += 5; }
        }

        if (!matchFungsi) {
           isMatch = false;
        }
      }

      // Nama tanaman dipakai sebagai konteks tampilan. Katalog belum memiliki
      // relasi komoditas eksplisit, jadi aplikasi tidak berpura-pura memfilter
      // kompatibilitas tanaman yang tidak tersedia di data.

      return { ...p, score, isMatch };
    });

    const filtered = scored.filter(p => p.isMatch);
    filtered.sort((a, b) => b.score - a.score);
    return filtered;
  }, [hasSearched, searchParams]);

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Cari Pupuk & Nutrisi"
        subtitle="Penyaringan pupuk berdasarkan organ sasaran dan umur HST; nama tanaman digunakan sebagai konteks, bukan filter kompatibilitas."
        action={<CatalogMeta count={PUPUK_DB.length} unit="produk" />}
      />

      <form onSubmit={handleSearch} className="flex flex-col items-end gap-4 rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-6 md:flex-row">
        <div className="w-full md:flex-1">
          <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1">Nama Tanaman (Konteks)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C5C]">grass</span>
            <input 
              type="text" 
              value={tanamanInput}
              onChange={(e) => setTanamanInput(e.target.value)}
              required
              className="w-full bg-white border-2 border-[#0A0A0A] pl-12 pr-4 py-3 text-sm text-[#0A0A0A] rounded focus:outline-none"
              placeholder="Contoh: Sawi, Cabai, Tomat..."
            />
          </div>
          <span className="mt-1 block text-[10px] text-[#5C5C5C]">Hasil utama difilter oleh HST dan fungsi pupuk.</span>
        </div>
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1">Fungsi Pupuk</label>
          <Select 
            value={fungsiInput}
            onChange={setFungsiInput}
            options={FUNGSI_OPTIONS}
            placeholder="Semua Fungsi"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1">
            Umur HST
            <HelpTip label="HST" text="Hari Setelah Tanam dihitung sejak tanggal tanam. Filter ini hanya mencocokkan rentang fase yang tercatat di katalog." />
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C5C] text-lg">calendar_today</span>
            <input 
              type="number" 
              value={hstInput}
              onChange={(e) => setHstInput(e.target.value)}
              required
              min="0"
              className="w-full bg-white border-2 border-[#0A0A0A] pl-12 pr-4 py-3 text-sm text-[#0A0A0A] rounded focus:outline-none"
              placeholder="Contoh: 6"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full md:w-auto min-h-[48px] bg-[#154734] text-white font-extrabold px-6 py-3 rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#0e3023] transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          Cari pupuk
        </button>
      </form>

      <CatalogHistory
        entries={history}
        onSelect={handleHistorySelect}
        onClear={() => {
          setHistory([]);
          writeCatalogHistory(HISTORY_KEY, []);
        }}
      />

      {hasSearched && (
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2">
          <h2 className="font-display font-extrabold text-lg uppercase text-[#0A0A0A]">
            Pupuk untuk fase <span className="bg-[#154734] text-white font-bold px-2 py-0.5 rounded border border-[#0A0A0A]">{searchParams.hst} HST</span>
            <span className="text-[#154734] capitalize"> · konteks {searchParams.tanaman}</span>
          </h2>
          <button onClick={resetSearch} className="text-xs font-bold text-[#C43C2C] hover:underline uppercase">
            Reset Pencarian
          </button>
        </div>
      )}

      <CatalogComparison
        items={comparisonItems}
        fields={[
          { key: 'content', label: 'Kandungan' },
          { key: 'phase', label: 'Fase penggunaan' },
          { key: 'dose', label: 'Dosis katalog' },
          { key: 'form', label: 'Bentuk' },
          { key: 'price', label: 'Kisaran harga' },
        ]}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!hasSearched ? (
          <div className="col-span-full">
            <EmptyState icon="compost" title="Belum ada pencarian" message="Masukkan tanaman dan HST untuk melihat pupuk yang sesuai dengan fase katalog." />
          </div>
        ) : filteredPupuk.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon="search_off" title="Belum ada hasil yang cocok" message="Ubah umur HST atau fungsi pupuk, lalu jalankan pencarian kembali." />
          </div>
        ) : (
          filteredPupuk.map((pupuk, idx) => (
            <div key={pupuk.id} className="bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col relative">
              {idx === 0 && (pupuk as any).score >= 15 && (
                <div className="absolute -top-3 -right-2 bg-[#154734] text-white font-extrabold text-[10px] px-3 py-1 rounded border border-[#0A0A0A] z-10 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  HASIL FILTER TERATAS
                </div>
              )}
              <div className="p-4 border-b-2 border-[#0A0A0A] flex justify-between items-start bg-[#154734] text-white font-normal rounded-t">
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-lg text-white uppercase">{pupuk.nama}</h3>
                  <span className="text-[10px] bg-[#0A0A0A] text-white font-bold px-2 py-0.5 rounded border border-[#0A0A0A] uppercase mt-1 inline-block">{pupuk.kategori}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] uppercase font-bold bg-[#E6E6DC] text-[#0A0A0A] px-2 py-1 rounded border border-[#0A0A0A]">
                    {pupuk.minHst} - {pupuk.maxHst} HST
                  </span>
                  <CompareToggle
                    selected={compareIds.includes(pupuk.id)}
                    disabled={compareIds.length >= 3}
                    onClick={() => toggleCompare(pupuk.id)}
                  />
                </div>
              </div>
              {idx === 0 && (pupuk as any).score >= 15 && (
                <div className="bg-[#E6E6DC]/50 border-l-4 border-[#154734] p-3 m-4 mb-0 rounded text-xs border-y border-r border-[#0A0A0A]">
                  <p className="font-bold text-[#154734] mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">filter_alt</span> Alasan Hasil Filter</p>
                  <p className="text-[#5C5C5C] text-xs leading-relaxed">
                    Rentang katalog mencakup usia <b>{searchParams.hst} HST</b>{searchParams.fungsi && <span> dan deskripsinya berkaitan dengan fungsi <b>{FUNGSI_OPTIONS.find(f => f.value === searchParams.fungsi)?.label || searchParams.fungsi}</b></span>}. Ini belum membuktikan kecocokan untuk komoditas tertentu. {pupuk.keterangan}
                  </p>
                </div>
              )}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Penerapan Rumus Pemupukan Presisi */}
                <div className="bg-[#E6E6DC]/40 p-3 border border-[#0A0A0A] rounded text-xs space-y-2">
                  <div className="font-extrabold text-[#154734] uppercase text-[11px] pb-1.5 border-b border-[#0A0A0A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Ringkasan filter &amp; verifikasi
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">🎯 Konteks tanaman: </span>
                    <span className="text-[#5C5C5C] font-medium">
                      {searchParams.tanaman
                        ? `${searchParams.tanaman}; kompatibilitas wajib diverifikasi dari label dan kebutuhan hara.`
                        : 'Belum ada konteks komoditas.'}
                    </span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">🧪 Kandungan: </span>
                    <span className="text-[#5C5C5C] font-medium">{pupuk.nama} ({pupuk.kandungan}); sesuaikan dengan analisis tanah atau media.</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">⚖️ Dosis referensi: </span>
                    <span className="text-[#5C5C5C] font-medium">{pupuk.dosis}; label produk dan rekomendasi setempat tetap menjadi acuan.</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">⏱️ Rentang katalog: </span>
                    <span className="text-[#5C5C5C] font-medium">Fase {pupuk.fase.join(', ')} ({pupuk.minHst}–{pupuk.maxHst} HST); konfirmasi fase aktual tanaman.</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">💦 Cara aplikasi: </span>
                    <span className="text-[#5C5C5C] font-medium">Ikuti metode, pelarutan, kompatibilitas campuran, dan batas aplikasi pada label produk.</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Kandungan Utama</span>
                  <div className="font-mono text-xs text-[#0A0A0A] font-bold">{pupuk.kandungan}</div>
                  <span className="mt-2 inline-flex rounded-full border border-[#B8B5AC] bg-white px-2 py-1 text-[10px] font-bold text-[#3F5147]">
                    {getNormalizedPupukCategory(pupuk)}
                  </span>
                </div>

                {/* Harga Non-Subsidi Section */}
                {(() => {
                  const details = getPupukDetails(pupuk);
                  return (
                    <>
                      <MarketPriceCard
                        catalog="pupuk"
                        itemId={pupuk.id}
                        metadata={getPupukMarketMetadata(pupuk)}
                        subsidizedPrice={details.hargaSubsidi}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Bentuk</span>
                          <span className="text-xs text-[#0A0A0A] font-semibold">{pupuk.bentuk}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Fase Tanaman</span>
                          <span className="text-xs text-[#0A0A0A] font-semibold">{pupuk.fase.join(', ')}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Referensi dosis katalog — verifikasi label</span>
                        <div className="text-xs text-[#0A0A0A] p-2.5 bg-white rounded border border-[#0A0A0A] font-mono font-bold">{pupuk.dosis}</div>
                      </div>

                      {/* Keunggulan & Kekurangan Sections */}
                      <div className="border-t-2 border-[#0A0A0A] pt-3 mt-auto flex flex-col gap-2.5">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#154734] block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Keunggulan Utama
                          </span>
                          <p className="text-xs text-[#0A0A0A] leading-relaxed font-medium">
                            {details.keunggulan}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#C43C2C] block mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">warning</span>
                            Kekurangan / Catatan Pemakaian
                          </span>
                          <p className="text-xs text-[#5C5C5C] leading-relaxed font-medium">
                            {details.kekurangan}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="pt-2 border-t border-[#0A0A0A] border-dashed">
                  <p className="text-xs text-[#5C5C5C] italic leading-relaxed">
                    "{pupuk.keterangan}"
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
