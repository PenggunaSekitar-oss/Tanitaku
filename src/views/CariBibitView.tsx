import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { Select } from '../components/Select';
import { ConfirmModal } from '../components/ConfirmModal';
import { BIBIT_CATALOG as CATALOG, ELEVATION_OPTIONS, CUACA_OPTIONS, BibitItem, getBibitDetails } from '../data/bibitData';

const getIconForKomoditas = (komoditas: string) => {
  const k = komoditas.toLowerCase();
  if (k.includes('cabai')) return 'local_fire_department';
  if (k.includes('tomat') || k.includes('melon') || k.includes('semangka') || k.includes('pepaya')) return 'lens';
  if (k.includes('bawang') || k.includes('jagung')) return 'grass';
  if (k.includes('kubis') || k.includes('kol') || k.includes('sawi') || k.includes('pakcoy') || k.includes('selada') || k.includes('kangkung') || k.includes('bayam')) return 'eco';
  if (k.includes('wortel') || k.includes('kentang')) return 'spa';
  return 'local_florist';
};

export function CariBibitView() {
  const [komoditas, setKomoditas] = useState('');
  const [ketinggian, setKetinggian] = useState('Rendah');
  const [cuaca, setCuaca] = useState('Semua');
  const [hasSearched, setHasSearched] = useState(false);
  const [showRumusGuide, setShowRumusGuide] = useState(false);
  const [results, setResults] = useState<BibitItem[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    setKomoditas('');
    setKetinggian('Rendah');
    setCuaca('Semua');
    setHasSearched(false);
    setResults([]);
    setShowResetConfirm(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
      
      const query = komoditas.trim().toLowerCase();
      
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
        if (ketinggian === 'Rendah') {
          if (dataranStr.includes('rendah')) {
            score += 15;
          } else {
            isMatch = false;
          }
        } else if (ketinggian === 'Menengah') {
          if (dataranStr.includes('menengah') || dataranStr.includes('sedang') || (dataranStr.includes('rendah') && dataranStr.includes('tinggi'))) {
            score += 15;
          } else {
            isMatch = false;
          }
        } else if (ketinggian === 'Tinggi') {
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

        if (cuaca === 'Hujan') {
          // Musim Hujan: Tahan genangan, akar kuat, resisten penyakit jamur/bakteri
          if (combined.includes('layu') || combined.includes('patek') || combined.includes('antraknosa') || combined.includes('hujan') || combined.includes('kebasahan') || combined.includes('busuk') || combined.includes('bakteri') || combined.includes('akar')) {
            score += 10;
          }
        } else if (cuaca === 'Kemarau') {
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

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Referensi Bibit"
        subtitle="Filter katalog varietas berdasarkan ketinggian dan karakter musim yang tercatat. Verifikasi kembali informasi pada label produsen."
      />

      {/* DATABASE READY COUNTER BADGE */}

        <div className="neo-card p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] rounded flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A]">
              travel_explore
            </span>
            <div>
              <span className="font-display font-extrabold text-sm text-[#0A0A0A] block">
                Database Varietas Siap
              </span>
              <span className="text-xs text-[#5C5C5C] font-medium">
                {CATALOG.length} varietas tersedia pada katalog lokal
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#154734] text-white text-xs font-bold rounded border-2 border-[#0A0A0A] font-mono">
            {CATALOG.length} VARIETAS
          </span>
        </div>


      {/* RUMUS REKOMENDASI BIBIT GUIDANCE BANNER */}
      <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" onClick={() => setShowRumusGuide(!showRumusGuide)}>
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <span className="material-symbols-outlined text-2xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A] shrink-0">
              nature_people
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-extrabold text-sm sm:text-base uppercase text-[#0A0A0A] leading-snug">
                Cara kerja filter ketinggian &amp; musim
              </h3>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Kecocokan dihitung dari teks adaptasi ketinggian dan karakter musim pada katalog.
              </p>
            </div>
          </div>
          <button type="button" className="self-end sm:self-auto text-xs font-bold bg-[#E6E6DC] text-[#0A0A0A] border-2 border-[#0A0A0A] px-3 py-1.5 rounded shrink-0 flex items-center gap-1">
            {showRumusGuide ? "Sembunyikan" : "Lihat Rumus"}
            <span className="material-symbols-outlined text-sm">{showRumusGuide ? "expand_less" : "expand_more"}</span>
          </button>
        </div>

        {showRumusGuide && (
          <div className="mt-4 pt-4 border-t-2 border-[#0A0A0A] text-xs text-[#0A0A0A] grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#E6E6DC]/40 p-3.5 rounded border-2 border-[#0A0A0A] space-y-1.5">
              <span className="font-extrabold text-[#154734] block uppercase text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">landscape</span>
                1. Klasifikasi Ketinggian (H)
              </span>
              <ul className="space-y-1 text-[#5C5C5C]">
                <li>• <b className="text-[#0A0A0A]">Dataran Rendah (H &lt; 400 mdpl):</b> Toleran suhu panas &amp; kelembaban tinggi.</li>
                <li>• <b className="text-[#0A0A0A]">Dataran Sedang (400 ≤ H ≤ 700 mdpl):</b> Varietas adaptif intermediate.</li>
                <li>• <b className="text-[#0A0A0A]">Dataran Tinggi (H &gt; 700 mdpl):</b> Toleran suhu dingin &amp; curah hujan tinggi.</li>
              </ul>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3.5 rounded border-2 border-[#0A0A0A] space-y-1.5">
              <span className="font-extrabold text-[#154734] block uppercase text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">thermostat</span>
                2. Penyesuaian Musim (M)
              </span>
              <ul className="space-y-1 text-[#5C5C5C]">
                <li>• <b className="text-[#0A0A0A]">Musim Hujan:</b> Varietas tahan genangan, akar kuat, &amp; resisten penyakit jamur/bakteri (layu/patek).</li>
                <li>• <b className="text-[#0A0A0A]">Musim Kemarau:</b> Varietas berumur genjah (cepat panen) &amp; efisien penggunaan air.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
        <h2 className="font-display font-extrabold uppercase tracking-wider mb-4 text-white bg-[#154734] px-3 py-1 rounded border-2 border-[#0A0A0A] inline-block text-xs">Filter Komoditas &amp; Kondisi Lahan</h2>
        
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
            <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1.5">Topografi / Ketinggian (H)</label>
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
      </div>

      {hasSearched && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2">
            <h3 className="font-display font-extrabold uppercase text-lg text-[#0A0A0A]">Hasil Pencarian</h3>
            <span className="text-xs font-bold text-[#5C5C5C]">{results.length} Varian Ditemukan</span>
          </div>

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
                      <span className="material-symbols-outlined text-white bg-[#0A0A0A] p-2 rounded border border-[#0A0A0A] text-[22px] shrink-0">
                        {getIconForKomoditas(item.komoditas)}
                      </span>
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
            <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FEFEFA] border-2 border-dashed border-[#0A0A0A] rounded">
              <span className="material-symbols-outlined text-4xl text-[#5C5C5C] mb-3">search_off</span>
              <h4 className="font-display font-bold text-base mb-1 text-[#0A0A0A]">Tidak Ada Rekomendasi</h4>
              <p className="text-xs text-[#5C5C5C] max-w-md">
                Maaf, kami belum menemukan data varietas yang cocok untuk kriteria tersebut. Coba ubah komoditas atau kategori ketinggian lahan.
              </p>
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
  );
}
