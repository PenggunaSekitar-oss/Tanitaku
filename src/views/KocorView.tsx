import { PageHeader } from '../components/PageHeader';
import React, { useState } from "react";
import { Select } from "../components/Select";

export function KocorView() {
  const [dosis, setDosis] = useState<number | "">("");
  const [satuan, setSatuan] = useState<"ml" | "liter" | "gram">("ml");
  const [volumeAir, setVolumeAir] = useState<number | "">("");

  const hitungKocor = () => {
    if (dosis === "" || volumeAir === "") return 0;
    return dosis * volumeAir;
  };

  const hasil = hitungKocor();

  const handleReset = () => {
    setDosis("");
    setVolumeAir("");
    setSatuan("ml");
  };

  const getEquivalents = (val: number, unit: string) => {
    if (val <= 0) return null;
    if (unit === 'ml') {
      const sdt = (val / 5).toFixed(1).replace(/\.0$/, '');
      const sdm = (val / 15).toFixed(1).replace(/\.0$/, '');
      const tutup = (val / 10).toFixed(1).replace(/\.0$/, '');
      return `${sdm} sdm (${sdt} sdt) atau ~${tutup} tutup botol`;
    }
    if (unit === 'gram') {
      return 'Gunakan timbangan digital. Gram tidak boleh dikonversi ke sendok tanpa data densitas produk.';
    }
    if (unit === 'liter') {
      const gelas = (val * 1000 / 220).toFixed(1).replace(/\.0$/, '');
      const ember = (val / 5).toFixed(1).replace(/\.0$/, '');
      return `${gelas} gelas air mineral (220ml) atau ~${ember} ember 5 Liter`;
    }
    return null;
  };

  const equivalents = getEquivalents(hasil, satuan);

  return (
    <div className="flex flex-col min-h-full pb-16 bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#154734] selection:text-white">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden pt-6 pb-6 px-4 sm:px-6 bg-[#FEFEFA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#154734]/15 text-[#154734] border border-[#154734]/30 px-3 py-1 rounded-full">
              Kalkulator Dosis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Kalkulator Kocor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Hitung kebutuhan dosis pupuk &amp; pestisida secara presisi untuk pengocoan tanaman.
          </p>
        </div>
      </div>

      {/* Surface Content */}
      <div className="bg-[#FEFEFA] text-slate-900 p-4 sm:p-6 relative z-10 flex flex-col gap-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Panel Form Input */}
        <div className="lg:col-span-7 neo-card p-4 sm:p-6 bg-surface flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-action text-[22px]">calculate</span>
              <h2 className="font-brutal uppercase text-sm sm:text-base font-bold text-on-surface">
                Parameter Pengocoan
              </h2>
            </div>
            {(dosis !== "" || volumeAir !== "") && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-danger hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Input Dosis Anjuran */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">
                  Dosis Anjuran
                </label>
                <span className="text-[11px] font-mono text-action font-bold bg-action/10 px-2 py-0.5 rounded border border-action/20">
                  Per 1 Liter Air
                </span>
              </div>

              <div className="flex flex-row items-stretch gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="number"
                    min="0"
                    max={satuan === 'liter' ? 1 : 1000}
                    step="0.1"
                    placeholder="Contoh: 2"
                    value={dosis}
                    onChange={(e) =>
                      setDosis(e.target.value ? parseFloat(e.target.value) : "")
                    }
                    className="neo-input w-full p-2.5 sm:p-3 font-mono text-base sm:text-lg h-[48px]"
                  />
                </div>
                
                <div className="w-[120px] sm:w-[140px] shrink-0">
                  <Select
                    value={satuan}
                    onChange={(val) => setSatuan(val as any)}
                    options={[
                      { value: "ml", label: "Mili (ml)" },
                      { value: "gram", label: "Gram (g)" },
                      { value: "liter", label: "Liter (L)" },
                    ]}
                  />
                </div>
              </div>
              <p className="text-[11px] text-on-surface-muted">
                Ikuti dosis pada label produk. Kalkulator hanya mengalikan dosis per liter dengan volume air.
              </p>
            </div>

            {/* Input Total Volume Air */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-xs font-bold text-on-surface-muted uppercase tracking-wider">
                Total Volume Air Yang Disiapkan
              </label>

              <div className="flex flex-row items-stretch gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Contoh: 16"
                    value={volumeAir}
                    onChange={(e) =>
                      setVolumeAir(e.target.value ? parseFloat(e.target.value) : "")
                    }
                    className="neo-input w-full p-2.5 sm:p-3 font-mono text-base sm:text-lg h-[48px]"
                  />
                </div>

                <div className="w-[90px] sm:w-[110px] shrink-0 bg-surface-high neo-border-thin rounded-[8px_3px_8px_3px] flex items-center justify-center font-bold text-xs sm:text-sm text-on-surface">
                  Liter Air
                </div>
              </div>

              {/* Presets Wadah / Tanki */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[11px] text-on-surface-muted font-bold uppercase tracking-wider">
                  Pilih Cepat Kapasitas Wadah:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '1 Tanki (16L)', val: 16 },
                    { label: '1 Tanki (20L)', val: 20 },
                    { label: '100 Liter', val: 100 },
                    { label: '1 Drum (200L)', val: 200 }
                  ].map(p => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setVolumeAir(p.val)}
                      className={`text-xs py-2 px-2 rounded-lg border transition-all text-center font-mono cursor-pointer ${
                        volumeAir === p.val
                          ? 'bg-action text-on-action font-bold border-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-surface-high border-outline text-on-surface hover:bg-surface hover:border-black'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panduan Konversi Takaran */}
          <div className="bg-surface-high/60 p-3 sm:p-4 rounded-xl border border-outline mt-1 text-xs text-on-surface-muted flex flex-col gap-1.5">
            <span className="font-bold text-on-surface uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-action">info</span>
              Panduan Patokan Alat Ukur Lapangan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-sans text-[11px]">
              <div>• 1 Sendok makan (sdm) ≈ 15 ml / 15 gram</div>
              <div>• 1 Sendok teh (sdt) ≈ 5 ml / 5 gram</div>
              <div>• 1 Tutup botol pestisida ≈ 10 - 12 ml</div>
              <div>• 1 Gelas air mineral ≈ 220 ml</div>
            </div>
          </div>
        </div>

        {/* Panel Hasil & Racikan */}
        <div className="lg:col-span-5 neo-card p-4 sm:p-6 bg-surface flex flex-col gap-4 border-2 border-outline shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center gap-2 border-b border-outline pb-3">
            <span className="material-symbols-outlined text-action text-[22px]">science</span>
            <h2 className="font-brutal uppercase text-sm sm:text-base font-bold text-on-surface">
              Hasil Dosis Racikan
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center bg-action/10 rounded-xl border-2 border-outline p-4 sm:p-6 text-center">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
              Total Bahan Dibutuhkan
            </span>
            <div className="flex items-baseline justify-center gap-2 flex-wrap">
              <span className="font-display font-black text-4xl sm:text-5xl text-on-surface">
                {hasil > 0 ? hasil.toLocaleString('id-ID') : "0"}
              </span>
              <span className="font-black text-xl sm:text-2xl uppercase text-action">
                {satuan}
              </span>
            </div>

            {hasil > 0 ? (
              <p className="text-on-surface text-xs sm:text-sm mt-3 leading-relaxed bg-surface/80 p-2.5 rounded-lg border border-outline w-full">
                Campurkan <strong className="font-bold text-on-surface">{hasil.toLocaleString('id-ID')} {satuan}</strong> produk ke dalam <strong className="font-bold text-on-surface">{volumeAir} Liter</strong> air.
              </p>
            ) : (
              <p className="text-on-surface-muted text-xs mt-2">
                Masukkan nilai dosis & volume air di samping/atas untuk melihat hasil.
              </p>
            )}
          </div>

          {hasil > 0 && equivalents && (
            <div className="flex flex-col gap-3 bg-surface-high/40 p-3.5 sm:p-4 rounded-xl border border-outline">
              <div>
                <span className="text-[11px] font-bold text-on-surface-muted uppercase tracking-wider block mb-1">
                  Estimasi Takaran Sendok / Alat Ukur:
                </span>
                <div className="bg-[#154734] text-white font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] inline-block w-full">
                  {equivalents}
                </div>
              </div>

              {typeof dosis === 'number' && dosis > 0 && (
                <div className="border-t border-outline pt-3 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                    Dosis Racikan Per Kapasitas Wadah:
                  </span>
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center bg-surface p-2 rounded border border-outline">
                      <span className="font-medium text-on-surface-muted">1 Tanki Semprot (16L):</span>
                      <strong className="font-mono text-on-surface">{(dosis * 16).toLocaleString('id-ID')} {satuan}</strong>
                    </div>
                    <div className="flex justify-between items-center bg-surface p-2 rounded border border-outline">
                      <span className="font-medium text-on-surface-muted">1 Tanki Semprot (20L):</span>
                      <strong className="font-mono text-on-surface">{(dosis * 20).toLocaleString('id-ID')} {satuan}</strong>
                    </div>
                    <div className="flex justify-between items-center bg-surface p-2 rounded border border-outline">
                      <span className="font-medium text-on-surface-muted">1 Drum Besar (200L):</span>
                      <strong className="font-mono text-on-surface">{(dosis * 200).toLocaleString('id-ID')} {satuan}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
