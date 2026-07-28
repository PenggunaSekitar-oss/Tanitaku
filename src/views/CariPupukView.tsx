import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Select } from '../components/Select';
import { PUPUK_DB, Pupuk, getPupukDetails } from '../data/pupukData';

export function CariPupukView() {
  const [tanamanInput, setTanamanInput] = useState('');
  const [fungsiInput, setFungsiInput] = useState('');
  const [hstInput, setHstInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showRumusGuide, setShowRumusGuide] = useState(false);
  const [searchParams, setSearchParams] = useState({ tanaman: '', hst: -1, fungsi: '' });

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
  };

  const resetSearch = () => {
    setHasSearched(false);
    setTanamanInput('');
    setHstInput('');
    setFungsiInput('');
    setSearchParams({ tanaman: '', hst: -1, fungsi: '' });
  };

  const filteredPupuk = useMemo(() => {
    if (!hasSearched) return [];
    const scored = PUPUK_DB.map(p => {
      let score = 0;
      let isMatch = true;

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
      />

      {/* DATABASE READY COUNTER BADGE */}

        <div className="neo-card p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] rounded flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A]">
              eco
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm uppercase text-[#0A0A0A]">
                  KATALOG LOKAL
                </span>
                <span className="text-[10px] font-bold uppercase bg-[#154734] text-white px-2 py-0.5 rounded border border-[#0A0A0A]">
                  {PUPUK_DB.length}+ Data Ready
                </span>
              </div>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Formulasi nutrisi lengkap untuk seluruh fase pertumbuhan tanaman
              </p>
            </div>
          </div>
        </div>


      {/* RUMUS REKOMENDASI PEMUPUKAN GUIDANCE BANNER */}
      <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" onClick={() => setShowRumusGuide(!showRumusGuide)}>
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <span className="material-symbols-outlined text-2xl text-white bg-[#154734] p-2 rounded border-2 border-[#0A0A0A] shrink-0">
              compost
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-extrabold text-sm sm:text-base uppercase text-[#0A0A0A] leading-snug">
                Checklist penggunaan pupuk (prinsip 5 tepat)
              </h3>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Panduan umum untuk memeriksa sasaran, jenis, dosis, waktu, dan cara aplikasi.
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
              <span className="text-[#5C5C5C]">Sesuaikan organ target (Akar, Daun, Batang, Bunga, atau Buah).</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">2. Tepat Jenis</span>
              <span className="text-[#5C5C5C]">Gunakan jenis pupuk (Tinggi N untuk Vegetatif, Tinggi P &amp; K untuk Generatif).</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">3. Tepat Dosis</span>
              <span className="text-[#5C5C5C]">Gunakan dosis takaran gram/batang atau gr/L air secara terukur.</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">4. Tepat Waktu</span>
              <span className="text-[#5C5C5C]">Sesuaikan dengan rentang HST (Hari Setelah Tanam) spesifik.</span>
            </div>
            <div className="bg-[#E6E6DC]/40 p-3 rounded border-2 border-[#0A0A0A]">
              <span className="font-extrabold text-[#154734] block uppercase mb-1">5. Tepat Cara</span>
              <span className="text-[#5C5C5C]">Metode pengaplikasian (Kocor air, Tabur sekeliling tajuk, atau Semprot foliar).</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="p-6 flex flex-col md:flex-row gap-4 items-end bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
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
            <span className="text-[10px] text-[#5C5C5C] mt-1 block">Hasil utama difilter oleh HST dan fungsi pupuk.</span>
          </div>
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
          <label className="block text-xs font-bold text-[#5C5C5C] uppercase mb-1">Umur HST</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!hasSearched ? (
          <div className="col-span-full p-12 text-center flex flex-col items-center gap-4 bg-[#FEFEFA] border-2 border-dashed border-[#0A0A0A] rounded">
            <span className="material-symbols-outlined text-5xl text-[#5C5C5C]">compost</span>
            <p className="text-[#0A0A0A] font-extrabold text-lg uppercase">Mulai Pencarian Pupuk</p>
            <p className="text-xs text-[#5C5C5C] max-w-md">Masukkan konteks tanaman dan HST untuk memfilter rentang umur pada katalog pupuk.</p>
          </div>
        ) : filteredPupuk.length === 0 ? (
          <div className="col-span-full p-12 text-center flex flex-col items-center gap-4 bg-[#FEFEFA] border-2 border-dashed border-[#0A0A0A] rounded">
            <span className="material-symbols-outlined text-4xl text-[#5C5C5C]">compost</span>
            <p className="text-[#0A0A0A] font-extrabold text-base">Pupuk tidak ditemukan.</p>
            <p className="text-xs text-[#5C5C5C]">Coba gunakan kata kunci atau filter HST yang berbeda.</p>
          </div>
        ) : (
          filteredPupuk.map((pupuk, idx) => (
            <div key={pupuk.id} className="bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col relative">
              {idx === 0 && (pupuk as any).score >= 15 && (
                <div className="absolute -top-3 -right-2 bg-[#154734] text-white font-extrabold text-[10px] px-3 py-1 rounded border border-[#0A0A0A] z-10 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  KECOCOKAN FILTER TERTINGGI
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
                </div>
              </div>
              {idx === 0 && (pupuk as any).score >= 15 && (
                <div className="bg-[#E6E6DC]/50 border-l-4 border-[#154734] p-3 m-4 mb-0 rounded text-xs border-y border-r border-[#0A0A0A]">
                  <p className="font-bold text-[#154734] mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">psychology</span> Alasan Rekomendasi</p>
                  <p className="text-[#5C5C5C] text-xs leading-relaxed">
                    Sangat relevan dengan kriteria pencarian usia <b>{searchParams.hst} HST</b>{searchParams.fungsi && <span>, dan sangat efektif untuk target <b>{FUNGSI_OPTIONS.find(f => f.value === searchParams.fungsi)?.label || searchParams.fungsi}</b></span>}. {pupuk.keterangan}
                  </p>
                </div>
              )}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Penerapan Rumus Pemupukan Presisi */}
                <div className="bg-[#E6E6DC]/40 p-3 border border-[#0A0A0A] rounded text-xs space-y-2">
                  <div className="font-extrabold text-[#154734] uppercase text-[11px] pb-1.5 border-b border-[#0A0A0A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Penerapan Rumus Rekomendasi
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">🎯 Tepat Sasaran: </span>
                    <span className="text-[#5C5C5C] font-medium">
                      {searchParams.tanaman ? `Tanaman ${searchParams.tanaman} (${searchParams.fungsi ? FUNGSI_OPTIONS.find(f => f.value === searchParams.fungsi)?.label : 'Pertumbuhan & Hasil'})` : `Organ ${pupuk.fase.join(' / ')}`}
                    </span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">🧪 Tepat Jenis: </span>
                    <span className="text-[#5C5C5C] font-medium">{pupuk.nama} ({pupuk.kandungan})</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">⚖️ Tepat Dosis: </span>
                    <span className="text-[#5C5C5C] font-medium">{pupuk.dosis}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">⏱️ Tepat Waktu: </span>
                    <span className="text-[#5C5C5C] font-medium">Fase {pupuk.fase.join(', ')} ({pupuk.minHst} - {pupuk.maxHst} HST)</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A]">💦 Tepat Cara: </span>
                    <span className="text-[#5C5C5C] font-medium">{pupuk.bentuk.toLowerCase().includes('cair') ? 'Semprot foliar daun / kocor akar' : 'Tabur melingkar sekeliling tajuk / Kocor air'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Kandungan Utama</span>
                  <div className="font-mono text-xs text-[#0A0A0A] font-bold">{pupuk.kandungan}</div>
                </div>

                {/* Harga Non-Subsidi Section */}
                {(() => {
                  const details = getPupukDetails(pupuk);
                  return (
                    <>
                      <div className="bg-[#8A9A5B] border border-[#0A0A0A] p-3 rounded flex flex-col gap-2 text-white shadow-2xs">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-white">storefront</span>
                            Harga Non-Subsidi (Pasaran Bebas)
                          </span>
                        </div>
                        <div className="text-sm font-black text-white">
                          {details.hargaNonSubsidi}
                        </div>
                        {details.hargaSubsidi ? (
                          <div className="text-xs text-white pt-2 border-t border-white/30 flex flex-wrap justify-between items-center gap-1.5">
                            <span className="font-semibold text-white/90">Perbandingan HET Subsidi:</span>
                            <span className="font-bold text-[#0A0A0A] bg-white px-2 py-0.5 rounded border border-[#0A0A0A]">{details.hargaSubsidi}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-white/90 italic">
                            *Produk non-subsidi pasaran bebas, dapat dibeli tanpa quota KTP.
                          </div>
                        )}
                      </div>

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
                        <span className="text-[10px] font-bold text-[#5C5C5C] uppercase block mb-1">Dosis Aplikasi Rekomendasi</span>
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
