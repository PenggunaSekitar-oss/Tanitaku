import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Tanaman } from '../context/TaniOpsContext';
import { calculateHST, determineFaseTanaman } from '../utils/calculations';

interface GrowthChartProps {
  tanamanList: Tanaman[];
}

// Data benchmark standar pertumbuhan per rentang HST (0 - 90 hari)
const BENCHMARK_GROWTH_DATA = [
  { hst: 0, targetPct: 0, targetHstLabel: '0 HST', fase: 'Semaian/Tanam', deskripsi: 'Pindah Tanam & Penyesuaian Akar' },
  { hst: 10, targetPct: 12, targetHstLabel: '10 HST', fase: 'Veg. Awal', deskripsi: 'Akar Mulai Aktif & Daun Baru' },
  { hst: 20, targetPct: 25, targetHstLabel: '20 HST', fase: 'Veg. Aktif', deskripsi: 'Percabangan V & Pertumbuhan Tajuk' },
  { hst: 30, targetPct: 40, targetHstLabel: '30 HST', fase: 'Veg. Aktif', deskripsi: 'Pembentukan Batang Utama & Ranting' },
  { hst: 40, targetPct: 55, targetHstLabel: '40 HST', fase: 'Pembungaan', deskripsi: 'Inisiasi Bunga & Bakal Buah Pertama' },
  { hst: 50, targetPct: 70, targetHstLabel: '50 HST', fase: 'Pembuahan', deskripsi: 'Pembentukan & Pengisian Daging Buah' },
  { hst: 60, targetPct: 82, targetHstLabel: '60 HST', fase: 'Pembuahan', deskripsi: 'Pembesaran Buah Maksimal' },
  { hst: 75, targetPct: 92, targetHstLabel: '75 HST', fase: 'Pematangan', deskripsi: 'Perubahan Warna Buah & Pematangan' },
  { hst: 90, targetPct: 100, targetHstLabel: '90 HST', fase: 'Panen', deskripsi: 'Puncak Panen / Petik Perdana' }
];

export function GrowthChart({ tanamanList }: GrowthChartProps) {
  const [selectedCropId, setSelectedCropId] = useState<string>('semua');

  // Filter active plants
  const activeTanaman = tanamanList.filter(t => t.status !== 'Panen');

  // Generate chart data merged with actual plant HSTs
  const currentPlant = activeTanaman.find(t => t.id === selectedCropId) || activeTanaman[0];

  // Map benchmark with current plant progress points
  const chartData = BENCHMARK_GROWTH_DATA.map(item => {
    const dataPoint: any = {
      hst: item.hst,
      targetPct: item.targetPct,
      fase: item.fase,
      deskripsi: item.deskripsi
    };

    // Calculate actual percentage for active plants
    activeTanaman.forEach(t => {
      const actualHst = calculateHST(t.tanggalTanam);
      // Map plant actual progress point
      if (item.hst <= Math.min(90, Math.max(0, actualHst))) {
        // Linear interpolation of target to reflect current growth progression
        const calcPct = Math.min(100, Math.round((item.hst / 90) * 100));
        dataPoint[t.komoditas] = calcPct;
      }
    });

    return dataPoint;
  });

  // Calculate stats for current active plant selection
  const actualHstCurrent = currentPlant ? calculateHST(currentPlant.tanggalTanam) : 0;
  const currentFase = currentPlant ? determineFaseTanaman(actualHstCurrent) : 'Vegetatif';
  const progressPctCurrent = Math.min(100, Math.round((actualHstCurrent / 90) * 100));
  const targetPctAtHst = Math.min(100, Math.round((actualHstCurrent / 90) * 100));
  const variance = progressPctCurrent - targetPctAtHst;

  return (
    <div className="neo-card p-3.5 sm:p-5 md:p-6 bg-surface flex flex-col gap-4 sm:gap-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden max-w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-outline pb-4 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-action text-on-action px-2 py-0.5 rounded neo-border-thin shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
              RECHARTS ANALYTICS
            </span>
            <span className="text-[11px] text-on-surface-muted font-mono truncate">Real-Time vs Target Benchmark</span>
          </div>
          <h3 className="font-brutal font-black text-base sm:text-lg md:text-xl text-on-surface uppercase tracking-wider flex items-center gap-2 break-words">
            <span className="material-symbols-outlined text-action shrink-0">show_chart</span>
            <span className="break-words">Grafik Progres Pertumbuhan Tanaman</span>
          </h3>
          <p className="text-xs text-on-surface-muted mt-0.5 break-words">
            Membandingkan laju perkembangan umur tanaman (HST) terhadap kurva target rata-rata standar.
          </p>
        </div>

        {/* Commodity Selector Pill Buttons */}
        {activeTanaman.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCropId('semua')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border-2 border-black ${
                selectedCropId === 'semua'
                  ? 'bg-action text-on-action shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-surface-high hover:bg-surface text-on-surface'
              }`}
            >
              Semua Tanaman ({activeTanaman.length})
            </button>
            {activeTanaman.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => setSelectedCropId(t.id)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border-2 border-black ${
                  selectedCropId === t.id
                    ? 'bg-action text-on-action shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-surface-high hover:bg-surface text-on-surface'
                }`}
              >
                {t.komoditas} ({calculateHST(t.tanggalTanam)} HST)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Highlights / Quick Metrics Cards */}
      {currentPlant && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-surface-high rounded-xl border border-outline flex flex-col justify-between min-w-0">
            <span className="text-[10px] font-bold text-on-surface-muted uppercase truncate">Tanaman Terpilih</span>
            <span className="font-bold text-xs sm:text-sm text-on-surface truncate mt-1">
              {currentPlant.komoditas}
            </span>
            <span className="text-[10px] text-action font-mono mt-0.5 truncate">Varietas {currentPlant.varietas}</span>
          </div>

          <div className="p-2 sm:p-3 bg-surface-high rounded-xl border border-outline flex flex-col justify-between min-w-0">
            <span className="text-[10px] font-bold text-on-surface-muted uppercase truncate">Umur Saat Ini</span>
            <span className="font-display font-black text-base sm:text-lg text-on-surface mt-1 truncate">
              {actualHstCurrent} <span className="text-xs font-normal">HST</span>
            </span>
            <span className="text-[10px] text-success font-bold mt-0.5 truncate">{currentFase}</span>
          </div>

          <div className="p-2 sm:p-3 bg-surface-high rounded-xl border border-outline flex flex-col justify-between min-w-0">
            <span className="text-[10px] font-bold text-on-surface-muted uppercase truncate">Progres Target</span>
            <span className="font-display font-black text-base sm:text-lg text-primary mt-1 truncate">
              {progressPctCurrent}%
            </span>
            <span className="text-[10px] text-on-surface-muted font-mono mt-0.5 truncate">Target ~90 HST</span>
          </div>

          <div className="p-2 sm:p-3 bg-surface-high rounded-xl border border-outline flex flex-col justify-between min-w-0">
            <span className="text-[10px] font-bold text-on-surface-muted uppercase truncate">Status vs Target</span>
            <div className="flex items-center gap-1 mt-1 min-w-0">
              <span className={`material-symbols-outlined text-base sm:text-lg shrink-0 ${variance >= 0 ? 'text-success' : 'text-danger'}`}>
                {variance >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <span className="font-bold text-xs sm:text-sm text-on-surface truncate">
                {variance >= 0 ? 'Sesuai Target' : 'Perlu Pacuan'}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-muted mt-0.5 truncate">
              {variance >= 0 ? 'Pertumbuhan Normal' : 'Aplikasi Pupuk Kocor'}
            </span>
          </div>
        </div>
      )}

      {/* Main Recharts Container */}
      <div className="w-full h-[260px] sm:h-[320px] bg-surface-high/30 p-1 sm:p-3 rounded-xl border-2 border-black relative min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 25, right: 10, bottom: 5, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-on-surface-muted)" opacity={0.2} />
            <XAxis 
              dataKey="hst" 
              unit=" HST" 
              tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--color-on-surface)' }}
            />
            <YAxis 
              unit="%" 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--color-on-surface)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}
            />

            {/* Target Area Fill */}
            <Area
              type="monotone"
              dataKey="targetPct"
              name="Target Benchmark Rata-rata"
              fill="var(--color-primary)"
              fillOpacity={0.15}
              stroke="var(--color-primary)"
              strokeWidth={3}
              strokeDasharray="4 4"
            />

            {/* Active Plant Lines */}
            {activeTanaman.map((t, idx) => {
              if (selectedCropId !== 'semua' && t.id !== selectedCropId) return null;
              const colors = ['#22c55e', '#ef4444', '#a855f7', '#f97316'];
              const strokeColor = colors[idx % colors.length];

              return (
                <Line
                  key={t.id}
                  type="monotone"
                  dataKey={t.komoditas}
                  name={`Aktual: ${t.komoditas}`}
                  stroke={strokeColor}
                  strokeWidth={4}
                  dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: strokeColor }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                />
              );
            })}

            {/* Reference Line for Current HST */}
            {currentPlant && (
              <ReferenceLine
                x={Math.min(90, actualHstCurrent)}
                stroke="var(--color-danger)"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `Hari Ini (${actualHstCurrent} HST)`,
                  fill: 'var(--color-danger)',
                  fontSize: 10,
                  fontWeight: 800,
                  position: 'top'
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Phase Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1 border-t border-outline min-w-0">
        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-surface-high rounded-xl border border-outline min-w-0">
          <span className="w-3.5 h-3.5 rounded-full bg-[#154734] shrink-0"></span>
          <div className="min-w-0 flex-1">
            <b className="block text-on-surface font-bold text-xs truncate">0 - 14 HST</b>
            <span className="text-[10px] text-on-surface-muted truncate block">Vegetatif Awal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-surface-high rounded-xl border border-outline min-w-0">
          <span className="w-3.5 h-3.5 rounded-full bg-[#154734] shrink-0"></span>
          <div className="min-w-0 flex-1">
            <b className="block text-on-surface font-bold text-xs truncate">15 - 35 HST</b>
            <span className="text-[10px] text-on-surface-muted truncate block">Vegetatif Aktif</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-surface-high rounded-xl border border-outline min-w-0">
          <span className="w-3.5 h-3.5 rounded-full bg-[#154734] shrink-0"></span>
          <div className="min-w-0 flex-1">
            <b className="block text-on-surface font-bold text-xs truncate">36 - 55 HST</b>
            <span className="text-[10px] text-on-surface-muted truncate block">Pembungaan</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-surface-high rounded-xl border border-outline min-w-0">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shrink-0"></span>
          <div className="min-w-0 flex-1">
            <b className="block text-on-surface font-bold text-xs truncate">56 - 90 HST</b>
            <span className="text-[10px] text-on-surface-muted truncate block">Pembuahan & Panen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip component for Recharts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="neo-card p-3 bg-surface border-2 border-black shadow-[4px_4px_0px_0px_#000] text-xs max-w-xs z-50">
        <div className="flex justify-between items-center border-b border-outline pb-1 mb-2">
          <span className="font-black text-sm text-on-surface">{label} HST</span>
          <span className="text-[10px] font-bold bg-action text-on-action px-2 py-0.5 rounded">
            {data.fase}
          </span>
        </div>

        <p className="text-[11px] text-on-surface-muted mb-2 font-medium">
          {data.deskripsi}
        </p>

        <div className="flex flex-col gap-1">
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5" style={{ color: p.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                {p.name}:
              </span>
              <span className="font-mono text-on-surface">{p.value}% Target</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
