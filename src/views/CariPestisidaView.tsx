import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { Select } from '../components/Select';
import { TanamanSelect } from '../components/TanamanSelect';
import { ConfirmModal } from '../components/ConfirmModal';
import { CatalogMeta } from '../components/CatalogMeta';
import { InlineNotice } from '../components/InlineNotice';
import { CatalogHistory } from '../components/CatalogHistory';
import { CatalogComparison, CompareToggle, ComparisonItem } from '../components/CatalogComparison';
import { EmptyState } from '../components/EmptyState';
import {
  PESTISIDA_CATALOG,
  HAMA_OPTIONS,
  PestisidaItem,
  getPestisidaMarketMetadata,
} from '../data/pestisidaData';
import { MarketPriceCard } from '../components/MarketPriceCard';
import { marketAvailabilityRank } from '../data/marketMetadata';
import { searchPesticides } from '../utils/pesticideSearch';
import {
  CatalogHistoryEntry,
  readCatalogHistory,
  upsertCatalogHistory,
  writeCatalogHistory,
} from '../utils/catalogHistory';

type PestisidaFilters = { hama: string; tanaman: string };
const HISTORY_KEY = 'tanita_history_pestisida';

export function CariPestisidaView() {
  const [hamaInput, setHamaInput] = useState('');
  const [tanamanInput, setTanamanInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<typeof PESTISIDA_CATALOG>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [history, setHistory] = useState<CatalogHistoryEntry<PestisidaFilters>[]>(() =>
    readCatalogHistory<PestisidaFilters>(HISTORY_KEY),
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (feedbackToast) {
      const timer = setTimeout(() => {
        setFeedbackToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [feedbackToast]);

  useEffect(() => {
    let targetHama: string | null = null;
    let targetTanaman: string | null = null;
    try {
      targetHama = localStorage.getItem('targetPestisida');
      targetTanaman = localStorage.getItem('targetTanaman');
    } catch {
      return;
    }

    const initialHama = targetHama || '';
    const initialTanaman = targetTanaman || '';

    if (targetHama) setHamaInput(targetHama);
    if (targetTanaman) setTanamanInput(targetTanaman);

    if (initialHama || initialTanaman) {
      setHasSearched(true);
      performSearch(initialHama, initialTanaman);
      setFeedbackToast({
        message: `Memuat otomatis kriteria dari diagnosa: ${initialHama ? `Hama "${initialHama}"` : ''} ${initialTanaman ? `Tanaman "${initialTanaman}"` : ''}`,
        type: 'success'
      });

      try {
        localStorage.removeItem('targetPestisida');
        localStorage.removeItem('targetTanaman');
      } catch {
        // Search results are already loaded, so cleanup failure is non-blocking.
      }
    }
  }, []);

  const performSearch = (hamaVal: string, tanamanVal: string) => {
    const matches = searchPesticides(PESTISIDA_CATALOG, hamaVal, tanamanVal)
      .sort((a, b) =>
        marketAvailabilityRank(getPestisidaMarketMetadata(b).availability) -
        marketAvailabilityRank(getPestisidaMarketMetadata(a).availability),
      );
    setResults(matches);
    return matches.length;
  };

  const saveSearch = (hamaVal: string, tanamanVal: string) => {
    const filters = { hama: hamaVal, tanaman: tanamanVal };
    const summary = [hamaVal || 'Semua target', tanamanVal ? `pada ${tanamanVal}` : '']
      .filter(Boolean)
      .join(' ');
    setHistory((current) => {
      const next = upsertCatalogHistory(current, filters, summary);
      writeCatalogHistory(HISTORY_KEY, next);
      return next;
    });
  };

  const handleHistorySelect = (entry: CatalogHistoryEntry<PestisidaFilters>) => {
    setHamaInput(entry.filters.hama);
    setTanamanInput(entry.filters.tanaman);
    setHasSearched(true);
    performSearch(entry.filters.hama, entry.filters.tanaman);
    setFeedbackToast(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hamaInput.trim()) {
      setHasSearched(false);
      setResults([]);
      setFeedbackToast({
        message: 'Pilih hama atau penyakit target terlebih dahulu. Nama tanaman saja belum cukup untuk menentukan pestisida.',
        type: 'info',
      });
      return;
    }

    setHasSearched(true);
    const resultCount = performSearch(hamaInput, tanamanInput);
    saveSearch(hamaInput, tanamanInput);

    let msg = 'Menampilkan seluruh katalog pestisida.';
    if (resultCount === 0) {
      setFeedbackToast(null);
      return;
    } else if (hamaInput && tanamanInput) {
      msg = `Ditemukan ${resultCount} produk dengan sasaran ${hamaInput}. ${tanamanInput} dipakai sebagai konteks; pastikan tanaman tersebut tercantum pada label produk.`;
    } else if (hamaInput) {
      msg = `Ditemukan ${resultCount} produk yang cocok untuk target ${hamaInput}.`;
    }
    setFeedbackToast({ message: msg, type: 'success' });
  };

  const handleReset = () => {
    setHamaInput('');
    setTanamanInput('');
    setHasSearched(false);
    setResults([]);
    setShowResetConfirm(false);
    setCompareIds([]);
    setFeedbackToast({ message: 'Filter pencarian pestisida & tanaman berhasil direset.', type: 'info' });
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
    .map((id) => PESTISIDA_CATALOG.find((item) => item.nama === id))
    .filter((item): item is PestisidaItem => Boolean(item))
    .map((item) => ({
      id: item.nama,
      name: item.nama,
      subtitle: item.jenis,
      values: {
        active: item.bahanAktif,
        target: item.sasaran.join(', '),
        dose: item.dosis,
        price: item.harga,
        note: item.kekurangan,
      },
    }));

  // Helper untuk menyesuaikan petunjuk penggunaan produk dengan target pencarian.
  const getRumus5Tepat = (hama: string, tanaman: string, item: PestisidaItem) => {
    const h = hama.toLowerCase();
    let sasaranLabel = hama || 'Hama / Penyakit Target';
    if (tanaman) {
      sasaranLabel += ` pada Tanaman ${tanaman}`;
    }

    let tepatSasaran = sasaranLabel;
    let tepatWaktu = 'Awal muncul gejala / populasi ambang batas';
    let tepatCara = tanaman ? `Semprot kabut merata di permukaan daun & bagian tanaman ${tanaman}` : 'Semprot kabut merata di permukaan daun';

    if (h.includes('ulat grayak') || h.includes('spodoptera')) {
      tepatSasaran = `Ulat Grayak (${hama || 'Spodoptera'}) pada tanaman ${tanaman || 'Pertanian'}`;
      tepatWaktu = 'Sore jam 16.00 - 18.00 / Malam hari saat ulat keluar makan';
      tepatCara = tanaman ? `Semprot kabut tekanan tinggi fokus ke pucuk dan lipatan daun ${tanaman}` : 'Semprot kabut tekanan tinggi fokus ke pucuk dan lipatan daun';
    } else if (h.includes('kutu kebul') || h.includes('thrips') || h.includes('kutu daun')) {
      tepatSasaran = `${hama || 'Kutu/Thrips'} (Hama penusuk-penghisap) pada tanaman ${tanaman || 'Pertanian'}`;
      tepatWaktu = 'Pagi jam 06.00 - 09.00 sebelum serangga aktif terbang tinggi';
      tepatCara = tanaman ? `Semprot merata di permukaan BAWAH daun ${tanaman} (tempat serangga bersarang)` : 'Semprot merata di permukaan BAWAH daun (tempat bersarang)';
    } else if (h.includes('patek') || h.includes('antraknosa') || h.includes('busuk') || h.includes('bercak')) {
      tepatSasaran = `Jamur Patogen (${hama || 'Antraknosa/Patek'}) pada tanaman ${tanaman || 'Pertanian'}`;
      tepatWaktu = 'Pencegahan sebelum hujan / saat kelembaban udara tinggi';
      tepatCara = `Semprot merata ke seluruh kanopi ${tanaman || 'tanaman'}, campurkan perekat di musim hujan`;
    } else if (h.includes('layu bakteri') || h.includes('bakteri')) {
      tepatSasaran = `Bakteri Tanaman (${hama || 'Layu Bakteri'}) pada tanaman ${tanaman || 'Pertanian'}`;
      tepatWaktu = 'Pencegahan dini saat persiapan lahan & awal tanam';
      tepatCara = `Kocor larutan ke perakaran ${tanaman || 'tanaman'} dan semprot pangkal batang`;
    } else if (h.includes('tungau')) {
      tepatSasaran = `Tungau Merah/Kuning (Akarisida) pada tanaman ${tanaman || 'Pertanian'}`;
      tepatWaktu = 'Saat terlihat gejala daun melengkung ke bawah seperti mangkok';
      tepatCara = `Semprot dari arah bawah daun ${tanaman || ''} dengan nozzle halus`;
    }

    return {
      tepatSasaran,
      tepatJenis: `${item.jenis} dengan bahan aktif ${item.bahanAktif}. Cocokkan kembali sasaran dan izin penggunaan pada label produk.`,
      tepatDosis: item.dosis,
      tepatWaktu,
      tepatCara
    };
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Cari Pestisida & Perlindungan"
        subtitle="Penyaringan katalog berdasarkan hama atau penyakit target. Tanaman dipakai sebagai konteks dan tetap harus dicocokkan dengan label produk."
        action={<CatalogMeta count={PESTISIDA_CATALOG.length} unit="produk" />}
      />

      <div className="flex w-full flex-col gap-5">
        {feedbackToast && (
          <InlineNotice
            message={feedbackToast.message}
            type={feedbackToast.type}
            onClose={() => setFeedbackToast(null)}
          />
        )}

      <CatalogHistory
        entries={history}
        onSelect={handleHistorySelect}
        onClear={() => {
          setHistory([]);
          writeCatalogHistory(HISTORY_KEY, []);
        }}
      />

      <section className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-[#26352D]">
          Filter pencarian
        </h2>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Hama / Penyakit Target */}
            <div className="flex flex-col w-full">
              <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#59645D]">
                <span>Hama atau penyakit target</span>
                {hamaInput && <span className="text-[11px] text-[#24533F]">Terpilih</span>}
              </label>
              <Select 
                options={HAMA_OPTIONS} 
                value={hamaInput} 
                onChange={(val) => setHamaInput(val)} 
                placeholder="-- Pilih Jenis Hama / Penyakit --"
                className="w-full"
              />
            </div>

            {/* Field 2: Jenis Tanaman */}
            <div className="flex flex-col w-full">
              <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#59645D]">
                <span>Jenis tanaman <span className="font-normal text-[#7A837D]">(opsional)</span></span>
                {tanamanInput && <span className="text-[11px] text-[#24533F]">Terpilih</span>}
              </label>
              <TanamanSelect 
                value={tanamanInput}
                onChange={(val) => setTanamanInput(val)}
                placeholder="-- Pilih tanaman untuk konteks penggunaan --"
                className="w-full"
              />
              <p className="mt-1.5 text-[11px] font-medium text-[#68716C]">
                Katalog belum menyimpan daftar izin tanaman per produk; periksa kembali tanaman sasaran pada label kemasan.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 border-t border-[#E1DED6] pt-4 sm:flex-row">
            <button type="submit" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#24533F] px-6 text-sm font-semibold text-white transition hover:bg-[#1B4031] sm:w-52">
              Cari pestisida
            </button>
            <button type="button" onClick={() => setShowResetConfirm(true)} className="min-h-11 w-full rounded-xl border border-[#D8D5CC] bg-white px-4 text-sm font-semibold text-[#46524B] transition hover:bg-[#F0EEE8] sm:w-28">
              Reset
            </button>
          </div>
        </form>
      </section>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8D5CC] pb-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#26352D]">Hasil referensi pestisida</h3>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {hamaInput && (
                  <span className="text-xs font-bold bg-[#154734] text-white px-2.5 py-1 rounded border border-[#0A0A0A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">bug_report</span>
                    <span>Kategori: Hama</span>
                    <span>&middot;</span>
                    <strong className="underline">{hamaInput}</strong>
                  </span>
                )}
                {tanamanInput && (
                  <span className="text-xs font-bold bg-[#E6E6DC] text-[#0A0A0A] px-2.5 py-1 rounded border border-[#0A0A0A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">potted_plant</span>
                    <span>Tanaman:</span>
                    <strong className="underline">{tanamanInput}</strong>
                  </span>
                )}
              </div>
            </div>
            <span className="rounded-lg border border-[#D8D5CC] bg-white px-3 py-1.5 text-xs font-semibold text-[#46524B]">
              {results.length} Pestisida Ditemukan
            </span>
          </div>

          <CatalogComparison
            items={comparisonItems}
            fields={[
              { key: 'active', label: 'Bahan aktif' },
              { key: 'target', label: 'Sasaran katalog' },
              { key: 'dose', label: 'Dosis label' },
              { key: 'price', label: 'Kisaran harga' },
              { key: 'note', label: 'Catatan' },
            ]}
            onRemove={toggleCompare}
            onClear={() => setCompareIds([])}
          />

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item, idx) => {
                const rumus = getRumus5Tepat(hamaInput, tanamanInput, item);

                return (
                  <div key={idx} className="bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col h-full relative overflow-hidden">
                    <div className="p-4 border-b-2 border-[#0A0A0A] flex justify-between items-start bg-[#154734] text-white rounded-t gap-2">
                      <div className="flex-1">
                        <h3 className="font-display font-extrabold text-lg text-white uppercase leading-snug">{item.nama}</h3>
                        <p className="text-xs font-mono text-white/80 mt-0.5">{item.jenis} &middot; {item.bahanAktif}</p>
                      </div>
                      <CompareToggle
                        selected={compareIds.includes(item.nama)}
                        disabled={compareIds.length >= 3}
                        onClick={() => toggleCompare(item.nama)}
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {/* Penerapan Rumus Rekomendasi Box */}
                      <div className="bg-[#E6E6DC]/40 p-3 border border-[#0A0A0A] rounded text-xs space-y-2">
                        <div className="font-extrabold text-[#154734] uppercase text-[11px] pb-1.5 border-b border-[#0A0A0A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          Penerapan Rumus Rekomendasi 5 Tepat
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">🎯 Tepat Sasaran: </span>
                          <span className="text-[#5C5C5C] font-medium">{rumus.tepatSasaran}</span>
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">🧪 Tepat Jenis: </span>
                          <span className="text-[#5C5C5C] font-medium">{rumus.tepatJenis}</span>
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">⚖️ Tepat Dosis: </span>
                          <span className="text-[#5C5C5C] font-medium">{rumus.tepatDosis}</span>
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">⏱️ Tepat Waktu: </span>
                          <span className="text-[#5C5C5C] font-medium">{rumus.tepatWaktu}</span>
                        </div>
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#0A0A0A]">💦 Tepat Cara: </span>
                          <span className="text-[#5C5C5C] font-medium">{rumus.tepatCara}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-1">
                        {item.sasaran.map(s => (
                          <span key={s} className="text-[9px] font-bold uppercase tracking-wider bg-[#E6E6DC] border border-[#0A0A0A] px-1.5 py-0.5 rounded text-[#0A0A0A]">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 gap-2 my-1">
                        <div className="bg-[#FEFEFA] p-2 border border-[#0A0A0A] rounded flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#5C5C5C]">Dosis Aplikasi Rekomendasi</span>
                          <span className="text-xs font-bold font-mono text-[#0A0A0A]">{item.dosis}</span>
                        </div>
                        
                        <MarketPriceCard
                          catalog="pestisida"
                          itemId={`${item.nama}:${item.bahanAktif}`}
                          metadata={getPestisidaMarketMetadata(item)}
                        />
                        <p className="rounded border-l-4 border-[#B77A34] bg-[#FBF5E9] p-2.5 text-[11px] leading-relaxed text-[#5E4B33]">
                          Ketersediaan di toko tidak berarti produk cocok atau aman. Cocokkan tanaman, sasaran, dosis, masa tunggu, dan status pendaftaran pada label sebelum membeli.
                        </p>
                      </div>

                      <div className="border-t-2 border-[#0A0A0A] pt-2 mt-auto flex flex-col gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#154734] block mb-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> 
                            Keunggulan Utama
                          </span>
                          <p className="text-xs text-[#0A0A0A] leading-relaxed font-medium">{item.kemampuan}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C43C2C] block mb-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">warning</span> 
                            Kekurangan / Catatan Pemakaian
                          </span>
                          <p className="text-xs text-[#5C5C5C] leading-relaxed font-medium">{item.kekurangan}</p>
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
              title="Belum ada hasil yang cocok"
              message="Ubah target pencarian atau pilih salah satu pencarian terakhir."
            />
          )}
        </div>
      )}
      <ConfirmModal 
        isOpen={showResetConfirm}
        message="Apakah Anda yakin ingin mereset hasil pencarian pestisida & tanaman?"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
        confirmText="YA, RESET"
        cancelText="TIDAK"
      />
      </div>
    </div>
  );
}
