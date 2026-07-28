import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { Select } from '../components/Select';
import { TanamanSelect } from '../components/TanamanSelect';
import { ConfirmModal } from '../components/ConfirmModal';
import { CatalogMeta } from '../components/CatalogMeta';
import { InlineNotice } from '../components/InlineNotice';
import { PESTISIDA_CATALOG, HAMA_OPTIONS, PestisidaItem } from '../data/pestisidaData';
import { searchPesticides } from '../utils/pesticideSearch';

export function CariPestisidaView() {
  const [hamaInput, setHamaInput] = useState('');
  const [tanamanInput, setTanamanInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<typeof PESTISIDA_CATALOG>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

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
    const matches = searchPesticides(PESTISIDA_CATALOG, hamaVal, tanamanVal);
    setResults(matches);
    return matches.length;
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

    let msg = 'Menampilkan seluruh katalog pestisida.';
    if (resultCount === 0) {
      setFeedbackToast({
        message: 'Tidak ada produk yang cocok. Periksa ejaan dan verifikasi label produk; aplikasi tidak akan menampilkan produk pengganti yang tidak relevan.',
        type: 'error',
      });
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
    setFeedbackToast({ message: 'Filter pencarian pestisida & tanaman berhasil direset.', type: 'info' });
  };

  const getIconForJenis = (jenis: string) => {
    const j = jenis.toLowerCase();
    if (j.includes('insektisida')) return 'bug_report';
    if (j.includes('fungisida')) return 'coronavirus';
    if (j.includes('bakterisida')) return 'microbiology';
    if (j.includes('moluskisida') || j.includes('nematisida')) return 'pest_control';
    return 'science';
  };

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
                      <span className="material-symbols-outlined text-white bg-[#0A0A0A] p-2 rounded border border-[#0A0A0A] text-[22px] shrink-0">
                        {getIconForJenis(item.jenis)}
                      </span>
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
                        
                        <div className="bg-[#8A9A5B] border border-[#0A0A0A] p-2.5 rounded flex flex-col gap-1 text-white shadow-2xs">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-white">sell</span>
                            Harga Per Item / Botol (Pasaran Bebas)
                          </span>
                          <span className="text-sm font-black text-white">{item.harga}</span>
                        </div>
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
            <div className="p-12 bg-[#FEFEFA] border-2 border-dashed border-[#0A0A0A] text-center flex flex-col items-center justify-center gap-4 rounded">
              <span className="material-symbols-outlined text-5xl text-[#5C5C5C]">search_off</span>
              <div>
                <p className="text-base font-bold text-[#0A0A0A]">Tidak ada pestisida ditemukan</p>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  Belum ada produk dengan sasaran yang cocok untuk hama atau penyakit tersebut.
                </p>
              </div>
            </div>
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
