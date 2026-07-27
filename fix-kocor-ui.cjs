const fs = require('fs');

const content = `import React, { useState } from "react";
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

  const getEquivalents = (val: number, unit: string) => {
    if (val <= 0) return null;
    if (unit === 'ml') {
      return \`\${(val / 5).toFixed(1).replace(/\\.0$/, '')} sendok teh / \${(val / 15).toFixed(1).replace(/\\.0$/, '')} sendok makan / \${(val / 10).toFixed(1).replace(/\\.0$/, '')} tutup botol\`;
    }
    if (unit === 'gram') {
      return \`\${(val / 5).toFixed(1).replace(/\\.0$/, '')} sendok teh / \${(val / 15).toFixed(1).replace(/\\.0$/, '')} sendok makan\`;
    }
    if (unit === 'liter') {
      return \`\${(val * 1000 / 220).toFixed(1).replace(/\\.0$/, '')} gelas air mineral (220ml) / \${(val / 5).toFixed(1).replace(/\\.0$/, '')} ember kecil (5L)\`;
    }
    return null;
  }

  const equivalents = getEquivalents(hasil, satuan);

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <div className="flex flex-col gap-1 w-full">
        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl text-on-surface">
          Kalkulator Kocor
        </h1>
        <p className="text-on-surface-muted text-sm font-medium">
          Hitung kebutuhan dosis pupuk atau pestisida untuk dikocor.
        </p>
      </div>

      <div className="neo-card flex flex-col p-6 gap-6 max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-muted uppercase tracking-wider">
              Dosis Anjuran
            </label>
            <div className="flex gap-2 sm:gap-4 items-center">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Misal: 2"
                value={dosis}
                onChange={(e) =>
                  setDosis(e.target.value ? parseFloat(e.target.value) : "")
                }
                className="neo-input flex-1 min-w-0 p-2 sm:p-3 font-mono text-base sm:text-lg h-[48px]"
              />
              <span className="font-bold text-on-surface-muted shrink-0">/</span >
              <div className="w-[120px] sm:w-[150px] shrink-0">
                <Select
                  value={satuan}
                  onChange={(val) => setSatuan(val as any)}
                  options={[
                    { value: "ml", label: "Mili (ml)" },
                    { value: "liter", label: "Liter (L)" },
                    { value: "gram", label: "Gram (g)" },
                  ]}
                />
              </div>
              <span className="font-bold text-on-surface-muted hidden sm:inline">Per Liter Air</span>
            </div>
            <span className="text-xs text-on-surface-muted sm:hidden">Per Liter Air</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-muted uppercase tracking-wider">
              Total Volume Air (Liter)
            </label>
            <div className="flex gap-2 sm:gap-4 items-center">
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Misal: 10"
                value={volumeAir}
                onChange={(e) =>
                  setVolumeAir(e.target.value ? parseFloat(e.target.value) : "")
                }
                className="neo-input flex-1 min-w-0 p-2 sm:p-3 font-mono text-base sm:text-lg h-[48px]"
              />
              <div className="w-[120px] sm:w-[150px] shrink-0 flex items-center justify-center">
                <span className="font-bold text-on-surface-muted text-sm sm:text-base">Liter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-outline pt-6 flex flex-col items-center justify-center bg-action/10 rounded-sm border-l-4 border-action p-6">
          <span className="text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
            Total Kebutuhan
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-5xl text-on-surface">
              {hasil > 0 ? hasil.toLocaleString('id-ID') : "0"}
            </span>
            <span className="font-bold text-xl uppercase text-on-surface-muted">
              {satuan}
            </span>
          </div>
          {hasil > 0 && (
            <div className="flex flex-col items-center gap-2 mt-4 w-full">
              <p className="text-on-surface-muted text-sm text-center">
                Campurkan <strong className="text-on-surface">{hasil.toLocaleString('id-ID')} {satuan}</strong> pupuk/pestisida ke dalam <strong className="text-on-surface">{volumeAir} Liter</strong> air.
              </p>
              {equivalents && (
                <div className="bg-surface p-4 border border-outline rounded-[8px_3px_8px_3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] w-full mt-2 neo-border-thin text-center max-w-md mx-auto">
                  <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider flex items-center justify-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-action">info</span>
                    Estimasi Takaran ({satuan})
                  </span>
                  <p className="text-sm font-medium text-on-surface leading-relaxed">
                    Setara dengan: <br/> 
                    <span className="text-primary font-bold">{equivalents}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/views/KocorView.tsx', content);
