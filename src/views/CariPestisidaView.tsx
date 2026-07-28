import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { Select } from '../components/Select';
import { TanamanSelect } from '../components/TanamanSelect';
import { ConfirmModal } from '../components/ConfirmModal';
import { PESTISIDA_CATALOG, HAMA_OPTIONS, PestisidaItem } from '../data/pestisidaData';
import { searchPesticides } from '../utils/pesticideSearch';

export function CariPestisidaView() {
  const [hamaInput, setHamaInput] = useState('');
  const [tanamanInput, setTanamanInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof PESTISIDA_CATALOG>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRumusGuide, setShowRumusGuide] = useState(false);
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
    const targetHama = localStorage.getItem('targetPestisida');
    const targetTanaman = localStorage.getItem('targetTanaman');

    let initialHama = targetHama || '';
    let initialTanaman = targetTanaman || '';

    if (targetHama) setHamaInput(targetHama);
    if (targetTanaman) setTanamanInput(targetTanaman);

    if (initialHama || initialTanaman) {
      setHasSearched(true);
      performSearch(initialHama, initialTanaman);
      setFeedbackToast({
        message: `Memuat otomatis kriteria dari diagnosa: ${initialHama ? `Hama "${initialHama}"` : ''} ${initialTanaman ? `Tanaman "${initialTanaman}"` : ''}`,
        type: 'success'
      });

      localStorage.removeItem('targetPestisida');
      localStorage.removeItem('targetTanaman');
    }
  }, []);

  const performSearch = (hamaVal: string, tanamanVal: string) => {
    const matches = searchPesticides(PESTISIDA_CATALOG, hamaVal, tanamanVal);
    setResults(matches);
    return matches.length;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      setHasSearched(true);
      const resultCount = performSearch(hamaInput, tanamanInput);
      setIsSearching(false);

      let msg = 'Menampilkan seluruh database pestisida.';
      if (resultCount === 0) {
        setFeedbackToast({
          message: 'Tidak ada produk yang cocok. Periksa ejaan dan verifikasi label produk; aplikasi tidak akan menampilkan produk pengganti yang tidak relevan.',
          type: 'error',
        });
        return;
      } else if (hamaInput && tanamanInput) {
        msg = `Ditemukan ${resultCount} produk yang cocok untuk target ${hamaInput} pada ${tanamanInput}.`;
      } else if (hamaInput) {
        msg = `Ditemukan ${resultCount} produk yang cocok untuk target ${hamaInput}.`;
      } else if (tanamanInput) {
        msg = `Ditemukan ${resultCount} produk yang secara eksplisit mencantumkan ${tanamanInput}.`;
      }
      setFeedbackToast({ message: msg, type: 'success' });
    }, 600);
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
        subtitle="Rekomendasi obat pertanian tepat sasaran berdasarkan Hama Target & Jenis Tanaman dengan Prinsip 5 Tepat."
      />

      <div className="w-full flex flex-col gap-6">
        {/* FEEDBACK TOAST NOTIFICATION FOR USER ACTIONS */}
        {feedbackToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-[calc(100vw-2rem)] mx-auto pointer-events-auto animate-in slide-in-from-top-3 duration-200">
            <div className={`p-3.5 rounded-xl border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] flex items-center justify-between gap-3 ${
              feedbackToast.type === 'success'
                ? 'bg-[#154734] text-white font-bold'
                : feedbackToast.type === 'error'
                  ? 'bg-[#C43C2C] text-white font-bold'
                  : 'bg-[#FFFFFF] text-[#0A0A0A] font-bold'
            }`}>
              <div className="flex items-center justify-center gap-2 min-w-0 flex-1 text-center">
                <span className="material-symbols-outlined text-xl shrink-0">
                  {feedbackToast.type === 'success' ? 'check_circle' : feedbackToast.type === 'error' ? 'error' : 'info'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-center">{feedbackToast.message}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setFeedbackToast(null)}
                className="p-1 rounded hover:bg-black/10 shrink-0 cursor-pointer flex items-center justify-center"
                title="Tutup Notifikasi"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>
        )}


      {/* DATABASE READY COUNTER BADGE */}
      <div className="p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A]">
            database
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm uppercase text-[#0A0A0A]">
                DATABASE ACTIVE
              </span>
              <span className="text-[10px] font-bold uppercase bg-[#154734] text-white px-2 py-0.5 rounded border border-[#0A0A0A]">
                {PESTISIDA_CATALOG.length}+ Data Ready
              </span>
            </div>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              {PESTISIDA_CATALOG.length} jenis obat pertanian (Insektisida, Fungisida, Herbisida, Nematisida, ZPT) aktif di database.
            </p>
          </div>
        </div>
      </div>

      {/* RUMUS REKOMENDASI GUIDANCE BANNER */}
      <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" onClick={() => setShowRumusGuide(!showRumusGuide)}>
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <span className="material-symbols-outlined text-2xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A] shrink-0">
              calculate
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-extrabold text-sm sm:text-base uppercase text-[#0A0A0A] leading-snug">
                Rumus Mencari Pestisida "REKOMENDASI" (Prinsip 5 Tepat)
              </h3>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Aturan standar PHT (Pengendalian Hama Terpadu) untuk hasil pembasmian optimal.
              </p>
            </div>
          </div>
          <button type="button" className="self-end sm:self-auto text-xs font-bold bg-[#E6E6DC] text-[#0A0A0A] border-2 border-[#0A0A0A] px-3 py-1.5 rounded shrink-0 flex items-center gap-1">
            {showRumusGuide ? "Sembunyikan" : "Lihat Rumus"}
            <span className="material-symbols-outlined text-sm">{showRumusGuide ? "expand_less" : "expand_more"}</span>
          </button>
        </div>

        {showRumusGuide && (
          <div className="mt-4 pt-4 border-t-2 border-[#0A0A0A] text-xs text-[#0A0A0A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">1. Tepat Sasaran</span>
              <span className="text-[#5C5C5C]">Identifikasi jenis OPT &amp; Tanaman Budidaya secara akurat.</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">2. Tepat Jenis</span>
              <span className="text-[#5C5C5C]">Gunakan Bahan Aktif spesifik yang terbukti ampuh melumpuhkan target.</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">3. Tepat Dosis</span>
              <span className="text-[#5C5C5C]">Gunakan konsentrasi larutan pas (ml/L) sesuai anjuran label.</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">4. Tepat Waktu</span>
              <span className="text-[#5C5C5C]">Aplikasi saat stadia hama paling rentan (pagi/sore jam aktif).</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">5. Tepat Cara</span>
              <span className="text-[#5C5C5C]">Teknik semprot merata (permukaan bawah daun / kocor tanah).</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
        <h2 className="font-display font-extrabold uppercase tracking-wider mb-4 text-white bg-[#154734] px-3 py-1 rounded border-2 border-[#0A0A0A] inline-block text-xs">
          Filter Target Hama &amp; Jenis Tanaman
        </h2>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Hama / Penyakit Target */}
            <div className="flex flex-col w-full">
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5 flex items-center justify-between">
                <span>1. Pilih Hama / Penyakit Target</span>
                {hamaInput && <span className="text-xs text-[#154734] font-extrabold">✔ Terpilih</span>}
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
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5 flex items-center justify-between">
                <span>2. Jenis Tanaman (100 Tanaman / Input Manual)</span>
                {tanamanInput && <span className="text-xs text-[#154734] font-extrabold">✔ Terpilih</span>}
              </label>
              <TanamanSelect 
                value={tanamanInput}
                onChange={(val) => setTanamanInput(val)}
                placeholder="-- Pilih dari 100 Tanaman / Ketik Manual --"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2 border-t-2 border-[#0A0A0A]">
            <button type="submit" disabled={isSearching} className="w-full sm:w-64 bg-[#154734] text-white font-extrabold min-h-[48px] px-6 rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#0e3023] transition disabled:opacity-70 flex items-center justify-center gap-2">
              {isSearching ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-lg">search</span>}
              {isSearching ? "MEMPROSES..." : "CARI REKOMENDASI PESTISIDA"}
            </button>
            <button type="button" onClick={() => setShowResetConfirm(true)} className="w-full sm:w-32 bg-[#E6E6DC] border-2 border-[#0A0A0A] text-[#0A0A0A] font-extrabold min-h-[48px] px-4 rounded hover:bg-[#d0d0c4] transition">
              RESET
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-[#0A0A0A] pb-2">
            <div>
              <h3 className="font-display font-extrabold uppercase text-lg text-[#0A0A0A]">Hasil Rekomendasi Pestisida</h3>
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
            <span className="text-xs font-bold bg-white text-[#0A0A0A] px-3 py-1.5 rounded border-2 border-[#0A0A0A]">
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
                <p className="text-xs text-[#5C5C5C] mt-1">Belum ada data pestisida yang cocok untuk kombinasi kriteria tersebut.</p>
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
