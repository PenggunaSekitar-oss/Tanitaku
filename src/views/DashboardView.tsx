import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from "react";
import { motion, type Variants } from "motion/react";
import { BannerCarousel } from "../components/BannerCarousel";
import { BmkgWeatherWidget } from "../components/BmkgWeatherWidget";
import { GrowthChart } from "../components/GrowthChart";
import { useTaniOps } from "../context/TaniOpsContext";
import {
  calculateHST,
  determineFaseTanaman,
  calculateLuasLahan,
  getRecommendations,
} from "../utils/calculations";
import { formatLocalDate, getNextScheduledDate } from "../utils/localDate";

// Helper for currency formatting
const formatRp = (num: number) => {
  return "Rp " + Math.round(num).toLocaleString("id-ID");
};

// Section Title Component
const SectionTitle = ({ 
  icon, 
  title, 
  subtitle, 
  rightElement 
}: { 
  icon: string; 
  title: string; 
  subtitle: string; 
  rightElement?: React.ReactNode; 
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-2">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#154734]/10 border border-[#154734]/30 text-[#154734] flex items-center justify-center shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-display">{title}</h2>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 font-medium pl-[48px] leading-relaxed">{subtitle}</p>
    </div>
    {rightElement && (
      <div className="pl-[48px] sm:pl-0 shrink-0 self-start sm:self-center">
        {rightElement}
      </div>
    )}
  </div>
);

// Dropdown item per tanaman dengan gaya electric blue glassmorphism
function TanamanCardDropdown({
  item,
  blokLahan,
  updateTanaman,
  navigate,
}: {
  key?: any;
  item: any;
  isFirst: boolean;
  blokLahan: any[];
  updateTanaman: (id: string, data: any) => void;
  navigate: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isPanen = item.status === 'Panen';
  const hst = calculateHST(item.tanggalTanam);
  const fase = isPanen ? 'Sudah Dipanen' : determineFaseTanaman(hst);
  const blok = blokLahan.find((b: any) => b.id === item.blokId);
  const rec = getRecommendations(hst);
  const progressPct = isPanen ? 100 : Math.min(100, Math.round((hst / 90) * 100));

  return (
    <div className={`rounded-2xl bg-[#FEFEFA] text-slate-950 border transition-all duration-200 shadow-sm overflow-hidden ${
      isPanen ? 'border-slate-200 bg-slate-50' : 'border-slate-200/90 hover:border-blue-400 hover:shadow-md'
    }`}>
      {/* Header Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 cursor-pointer select-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/80 transition duration-200"
      >
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-[#154734] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold">
            <span className="material-symbols-outlined text-[22px]">eco</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#154734] text-white px-2.5 py-0.5 rounded-full border border-[#0A0A0A]">
                {blok?.nama || "Unknown Block"}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-900 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {item.metodeTanam}
              </span>
              {isPanen && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#154734] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  PANEN
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-base sm:text-lg text-slate-950 tracking-tight flex items-baseline gap-2 truncate font-display">
              {item.komoditas} <span className="text-xs font-bold text-slate-600 truncate">({item.varietas})</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200/80 shrink-0">
          <div className="text-left sm:text-right">
            {isPanen ? (
              <div className="bg-[#154734] text-white border border-[#154734] font-extrabold text-xs px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                <span className="material-symbols-outlined text-[15px] text-white">check_circle</span>
                PANEN ({hst} HST)
              </div>
            ) : (
              <div className="bg-[#154734] text-white font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-2xs inline-block border border-[#0A0A0A]">
                {hst} <span className="text-[10px] font-bold opacity-90">HST</span> &middot; <span className="text-[10px] font-bold opacity-90">{fase}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition flex items-center justify-center shrink-0 border border-slate-200 cursor-pointer"
            aria-label={isOpen ? "Sembunyikan detail" : "Tampilkan detail"}
          >
            <span className={`material-symbols-outlined text-xl transition-transform duration-300 block ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Dropdown Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-200/80 flex flex-col gap-4 mt-1 animate-in fade-in duration-200">
          <p className="text-xs text-slate-800 font-semibold mt-2">
            Tanam: <b className="text-slate-950 font-extrabold">{item.tanggalTanam}</b> &middot; Populasi: <b className="text-slate-950 font-extrabold">{item.jumlahTanaman.toLocaleString("id-ID")} batang</b>
          </p>

          {/* Progress Line Bar */}
          <div className="flex flex-col gap-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs gap-1">
              <span className="font-extrabold text-slate-950 flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[18px] text-[#154734] shrink-0">
                  {isPanen ? 'task_alt' : 'show_chart'}
                </span>
                <span className="truncate">{isPanen ? 'Panen Selesai (100%)' : `Progres Tumbuh (${progressPct}%)`}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-700 font-extrabold shrink-0">Target ~90 HST</span>
            </div>
            
            <div className="w-full bg-slate-200/90 h-3 rounded-full overflow-hidden p-0.5 relative border border-slate-300/50">
              <div 
                className="h-full rounded-full transition-all duration-500 shadow-2xs bg-[#154734]"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Milestone indicators */}
            <div className="grid grid-cols-5 text-[9px] sm:text-[10px] font-bold text-center text-slate-700 pt-1 leading-tight">
              <span className={`truncate ${!isPanen && hst <= 14 ? 'text-[#154734] font-black underline decoration-[#154734] decoration-2' : ''}`}>Veg Awal</span>
              <span className={`truncate ${!isPanen && hst > 14 && hst <= 35 ? 'text-[#154734] font-black underline decoration-[#154734] decoration-2' : ''}`}>Veg Aktif</span>
              <span className={`truncate ${!isPanen && hst > 35 && hst <= 55 ? 'text-[#154734] font-black underline decoration-[#154734] decoration-2' : ''}`}>Bunga</span>
              <span className={`truncate ${!isPanen && hst > 55 && hst <= 80 ? 'text-[#154734] font-black underline decoration-[#154734] decoration-2' : ''}`}>Buah</span>
              <span className={`truncate ${isPanen || hst > 80 ? 'bg-[#154734] text-white px-1.5 py-0.5 rounded-full font-black' : ''}`}>Panen</span>
            </div>
          </div>

          {/* Rekomendasi Perawatan */}
          {isPanen ? (
            <div className="p-3.5 bg-[#154734]/10 border border-[#154734]/30 rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#154734] text-[22px] shrink-0">check_circle</span>
                <div>
                  <b className="text-[#154734] block font-extrabold">Lahan Selesai Dipanen</b>
                  <span className="text-[11px] text-slate-900 font-bold leading-tight block">Data hasil &amp; proyeksi telah tersimpan.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTanaman(item.id, { status: 'Aktif' });
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#154734] text-white border border-[#0A0A0A] rounded-full shadow-2xs hover:bg-[#0e3023] transition shrink-0 cursor-pointer"
              >
                Aktifkan Kembali
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#154734] text-[20px]">psychology</span>
                  Saran &amp; Rekomendasi Perawatan (Fase {fase} &middot; {hst} HST)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Pupuk */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
                  <span className="font-extrabold text-slate-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-[#154734]">compost</span>
                    Rekomendasi Pupuk
                  </span>
                  <p className="text-[11px] text-slate-950 leading-snug font-bold">{rec.pupuk}</p>
                </div>

                {/* Pestisida */}
                <div className="p-3 bg-rose-50/90 border border-rose-200/90 rounded-xl flex flex-col gap-1">
                  <span className="font-extrabold text-rose-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-rose-800">pest_control</span>
                    Tindakan Pestisida
                  </span>
                  <p className="text-[11px] text-slate-950 leading-snug font-bold">{rec.pestisida}</p>
                </div>

                {/* Langkah Perawatan */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
                  <span className="font-extrabold text-slate-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px] text-[#154734]">agriculture</span>
                    Langkah Perawatan
                  </span>
                  <p className="text-[11px] text-slate-950 leading-snug font-bold">{rec.perawatan}</p>
                </div>

                {/* Antisipasi Hama */}
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl flex flex-col gap-1 justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-slate-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px] text-orange-600">bug_report</span>
                      Antisipasi Hama
                    </span>
                    <p className="text-[11px] text-slate-950 leading-snug font-bold">{rec.hama}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const targetHama = rec.hama.split(',')[0]?.trim() || rec.hama;
                      localStorage.setItem('targetPestisida', targetHama);
                      navigate('cari-pestisida');
                    }}
                    className="mt-2 text-[10px] bg-[#154734] hover:bg-[#0e3023] text-white font-extrabold uppercase px-3.5 py-1.5 rounded-full shadow-2xs transition self-start flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">search</span>
                    Cari Solusi Pestisida
                  </button>
                </div>
              </div>

              {/* Tips Tani */}
              {rec.tips && (
                <div className="p-3 bg-[#154734]/10 border-l-4 border-[#154734] rounded-r-xl text-xs flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#154734] text-[20px] shrink-0 mt-0.5">
                    lightbulb
                  </span>
                  <p className="text-[11px] text-slate-950 font-bold leading-relaxed">
                    <b className="text-[#154734] font-black">Tips Tani:</b> {rec.tips}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600 italic text-[11px] font-medium truncate">
              "{item.catatan || 'Tanpa catatan khusus'}"
            </span>
            <div className="flex items-center gap-2.5 shrink-0 justify-end">
              {!isPanen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTanaman(item.id, { status: 'Panen' });
                  }}
                  className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-[#154734] hover:text-white px-3.5 py-1.5 rounded-full transition flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">task_alt</span>
                  Tandai Panen
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('pemupukan');
                }}
                className="text-[11px] font-bold text-blue-700 hover:text-indigo-800 flex items-center gap-1 py-1 cursor-pointer"
              >
                Jadwalkan Rawat
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton Loading Component
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-busy="true" aria-label="Memuat data dashboard">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 bg-[#FEFEFA]/80 rounded-[20px] border border-blue-100 flex flex-col justify-between gap-3 h-32"
          >
            <div className="flex justify-between items-start">
              <div className="h-3.5 bg-slate-200 rounded w-20"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
            </div>
            <div>
              <div className="h-7 bg-slate-200 rounded w-28 mb-1"></div>
              <div className="h-3 bg-slate-100 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardView({ navigate }: { navigate: (v: string) => void }) {
  const [activeTabBlock, setActiveTabBlock] = useState<string>("semua");
  const [isStatusBlokOpen, setIsStatusBlokOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const { blokLahan, tanaman, updateTanaman, pemupukan, keuangan, logAktivitas } = useTaniOps();

  // Computations
  const tanamanAktif = tanaman.filter(t => t.status !== 'Panen');
  const totalPopulasiAktif = tanamanAktif.reduce((acc, curr) => acc + curr.jumlahTanaman, 0);

  const totalLuasLahan = blokLahan.reduce(
    (acc, blok) =>
      acc +
      calculateLuasLahan(
        blok.jumlahBedengan,
        blok.panjangBedengan,
        blok.lebarBedengan,
        blok.jarakAntarBedengan
      ),
    0
  );

  const kepadatan = totalLuasLahan > 0 ? (totalPopulasiAktif / totalLuasLahan).toFixed(1) : "0";

  const totalBiayaKeuangan = keuangan.reduce(
    (acc, k) =>
      acc +
      ((k.biayaTetap || 0) +
        (k.biayaBenih || 0) +
        (k.biayaPupuk || 0) +
        (k.biayaPestisida || 0) +
        (k.biayaLain || 0)),
    0
  );
  const totalBiayaLog = logAktivitas.reduce((acc, log) => acc + (log.biaya || 0), 0);
  const totalBiaya = totalBiayaKeuangan + totalBiayaLog;

  const totalPendapatan = keuangan.reduce(
    (acc, k) => acc + (k.targetHasil || 0) * (k.hargaJual || 0),
    0
  );

  const laba = totalPendapatan - totalBiaya;
  const roi = totalBiaya > 0 ? ((laba / totalBiaya) * 100).toFixed(1) : "0";
  const biayaPerTanaman = totalPopulasiAktif > 0 ? (totalBiaya / totalPopulasiAktif) : 0;

  // Cost breakdowns
  const totalBiayaBenih = keuangan.reduce((a, k) => a + (k.biayaBenih || 0), 0);
  const totalBiayaPupuk = keuangan.reduce((a, k) => a + (k.biayaPupuk || 0), 0);
  const totalBiayaPestisida = keuangan.reduce((a, k) => a + (k.biayaPestisida || 0), 0);
  const totalBiayaTetap = keuangan.reduce((a, k) => a + (k.biayaTetap || 0), 0);
  const totalBiayaLain = keuangan.reduce((a, k) => a + (k.biayaLain || 0), 0);

  const filteredTanaman = activeTabBlock === "semua" 
    ? tanaman 
    : tanaman.filter(t => t.blokId === activeTabBlock);

  // Data completeness score; this is not a crop-health measurement.
  const calculateDataCompletenessScore = () => {
    if (blokLahan.length === 0 && tanaman.length === 0) return { score: "0.0", label: "BELUM ADA DATA" };

    const validBlocks = blokLahan.filter((block) =>
      block.nama.trim() && calculateLuasLahan(
        block.jumlahBedengan,
        block.panjangBedengan,
        block.lebarBedengan,
        block.jarakAntarBedengan,
        block.luasManualM2,
      ) > 0
    ).length;
    const blockScore = blokLahan.length > 0 ? (validBlocks / blokLahan.length) * 100 : 0;

    const validPlants = tanaman.filter((plant) =>
      plant.komoditas.trim() &&
      plant.tanggalTanam &&
      blokLahan.some((block) => block.id === plant.blokId)
    ).length;
    const cropScore = tanaman.length > 0 ? (validPlants / tanaman.length) * 100 : 0;

    const expectedActivityCount = Math.max(1, blokLahan.length * 2);
    const maintenanceScore = Math.min(100, ((logAktivitas.length + pemupukan.length) / expectedActivityCount) * 100);

    const validFinance = keuangan.filter((record) =>
      record.transactionDate &&
      blokLahan.some((block) => block.id === record.blokId)
    ).length;
    const financialScore = keuangan.length > 0 ? (validFinance / keuangan.length) * 100 : 0;

    const finalVal = (blockScore + cropScore + maintenanceScore + financialScore) / 4;
    const scoreStr = Math.min(100, Math.max(0, finalVal)).toFixed(1);
    
    let label = "LENGKAP";
    const num = parseFloat(scoreStr);
    if (num >= 85) label = "LENGKAP";
    else if (num >= 70) label = "BAIK";
    else if (num >= 50) label = "CUKUP";
    else label = "PERLU DILENGKAPI";

    return { score: scoreStr, label };
  };

  const { score: healthScore, label: healthScoreLabel } = calculateDataCompletenessScore();

  const upcomingPemupukan = [...pemupukan]
    .map((item) => ({
      item,
      nextDate: getNextScheduledDate(item.tanggalAplikasi, item.intervalHari),
    }))
    .sort((a, b) => (a.nextDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.nextDate?.getTime() ?? Number.MAX_SAFE_INTEGER));
  const latestLogs = [...logAktivitas].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal) || b.id.localeCompare(a.id)
  );

  const bentoContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0,
      },
    },
  };

  const bentoItem: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      variants={bentoContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full pb-20"
    >
      {/* Hero Banner Carousel */}
      <motion.div variants={bentoItem} className="w-full">
        <BannerCarousel />
      </motion.div>

      {/* Section 1: Performance Score Gauge & Quick Metrics */}
      <motion.div variants={bentoItem} className="flex flex-col gap-4">
        <SectionTitle 
          icon="analytics" 
          title="Metrik Utama & Performa Lahan" 
          subtitle="Ikhtisar kelengkapan data operasional, populasi aktif, proyeksi margin, luas area tanam, dan catatan perawatan."
        />
        <div 
          className="p-5 sm:p-7 rounded-2xl shadow-md border border-[#004953] flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
          style={{ backgroundColor: '#004953', color: '#FFFFFF' }}
        >

          {/* Skor Performa Lahan */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/15 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-white/80 mb-2">
              Kelengkapan Data Operasional
            </span>
            <div className="relative w-40 h-40 flex items-center justify-center my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="82" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="16" fill="transparent" />
                <circle
                  cx="100" cy="100" r="82" stroke="#FFFFFF" strokeWidth="16" fill="transparent"
                  strokeDasharray="515"
                  strokeDashoffset={515 * (1 - parseFloat(healthScore) / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-display">{healthScore}%</span>
                <span className="text-[10px] font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full mt-1 border border-white/30 backdrop-blur-xs">
                  {healthScoreLabel}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Key Metrics */}
          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex flex-col justify-between min-h-[116px]">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white">grass</span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Populasi Aktif</span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white my-1 font-display">
                {totalPopulasiAktif.toLocaleString("id-ID")}
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">{tanamanAktif.length} Varietas di Lahan</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex flex-col justify-between min-h-[116px]">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white">payments</span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Estimasi Laba</span>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white my-1 font-display">
                {formatRp(laba)}
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">ROI Proyeksi {roi}%</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex flex-col justify-between min-h-[116px]">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white">landscape</span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Luas Bedengan</span>
              </div>
              <div className="flex flex-col my-1">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-display">
                  {totalLuasLahan.toLocaleString("id-ID")} <span className="text-xs font-semibold text-white/80">m²</span>
                </span>
                <span className="text-[11px] font-mono text-white/90 font-medium">
                  ({(totalLuasLahan / 100).toLocaleString("id-ID", { maximumFractionDigits: 2 })} Are / {(totalLuasLahan / 10000).toLocaleString("id-ID", { maximumFractionDigits: 3 })} Ha)
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">Kepadatan {kepadatan} tnm/m²</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex flex-col justify-between min-h-[116px]">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white">event_repeat</span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Agenda Rawat</span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white my-1 font-display">
                {pemupukan.length} <span className="text-xs font-semibold text-white/80">Jadwal</span>
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold truncate">{upcomingPemupukan[0]?.item.jenisPupuk || "Belum ada agenda"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: BMKG Real-Time Weather Widget */}
      <motion.div variants={bentoItem} className="flex flex-col gap-4">
        <SectionTitle 
          icon="partly_cloudy_day" 
          title="Prakiraan Cuaca BMKG & Mikroklimat" 
          subtitle="Pemantauan kondisi curah hujan, suhu udara, dan kelembapan lingkungan real-time untuk menentukan efisiensi waktu pemupukan dan penyiraman."
        />
        <motion.div 
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-2xl border border-slate-200/80 bg-[#FEFEFA] p-1.5 shadow-sm"
        >
          <BmkgWeatherWidget />
        </motion.div>
      </motion.div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Section 3: Pintasan Akses Cepat Fitur */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="grid_view" 
              title="Pintasan Fitur Operasional" 
              subtitle="Pintasan cepat untuk mengakses katalog varietas benih unggul, rekomendasi pupuk, obat pestisida, diagnosa hama, dan kalkulasi kocor."
            />

            <div className="p-5 sm:p-6 bg-[#FEFEFA] rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {[
                  { 
                    id: 'cari-bibit', 
                    title: 'Cari Bibit', 
                    icon: 'grass', 
                    desc: 'Varietas & Kualitas',
                    bgClass: 'bg-[#96D8D0]/20 hover:bg-[#96D8D0]/35 border-[#96D8D0]/80 text-[#060606]',
                    iconBg: 'bg-[#96D8D0] text-[#060606]'
                  },
                  { 
                    id: 'cari-pupuk', 
                    title: 'Cari Pupuk', 
                    icon: 'compost', 
                    desc: 'Formulasi & Dosis',
                    bgClass: 'bg-[#DAF4AA]/25 hover:bg-[#DAF4AA]/45 border-[#DAF4AA]/80 text-[#060606]',
                    iconBg: 'bg-[#DAF4AA] text-[#060606]'
                  },
                  { 
                    id: 'cari-pestisida', 
                    title: 'Cari Pestisida', 
                    icon: 'shield', 
                    desc: 'Obat & Proteksi',
                    bgClass: 'bg-[#BEB9CC]/25 hover:bg-[#BEB9CC]/45 border-[#BEB9CC]/80 text-[#060606]',
                    iconBg: 'bg-[#BEB9CC] text-[#060606]'
                  },
                  { 
                    id: 'cari-penyakit', 
                    title: 'Cari Penyakit', 
                    icon: 'bug_report', 
                    desc: 'Diagnosa Hama',
                    bgClass: 'bg-[#F1B4B9]/25 hover:bg-[#F1B4B9]/45 border-[#F1B4B9]/80 text-[#060606]',
                    iconBg: 'bg-[#F1B4B9] text-[#060606]'
                  },
                  { 
                    id: 'kocor', 
                    title: 'Kocor Pupuk', 
                    icon: 'science', 
                    desc: 'Hitung Dosis Air & Nutrisi',
                    bgClass: 'bg-[#74D1FF]/20 hover:bg-[#74D1FF]/35 border-[#74D1FF]/80 text-[#060606]',
                    iconBg: 'bg-[#74D1FF] text-[#060606]'
                  },
                ].map((item) => {
                  const isKocor = item.id === 'kocor';
                  return (
                    <button 
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`p-3.5 rounded-xl border active:scale-[0.98] transition-all duration-150 flex items-center text-center group cursor-pointer min-h-[104px] justify-center shadow-2xs hover:shadow-md ${item.bgClass} ${
                        isKocor 
                          ? 'col-span-2 sm:col-span-2 lg:col-span-1 flex-col sm:flex-row lg:flex-col sm:text-left lg:text-center gap-2.5 sm:gap-3.5 lg:gap-2' 
                          : 'flex-col text-center gap-2'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-extrabold transition shadow-2xs border border-[#060606]/10 ${item.iconBg}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xs sm:text-sm text-[#060606]">{item.title}</span>
                        <span className="text-[10px] sm:text-[11px] text-[#060606]/70 leading-tight font-medium">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Section 4: Growth Chart Component */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="show_chart" 
              title="Grafik Progres Pertumbuhan Tanaman" 
              subtitle="Visualisasi estimasi HST, fase pertumbuhan vegetatif-generatif, dan proyeksi waktu panen."
            />
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="rounded-2xl border border-slate-200/80 overflow-hidden bg-[#FEFEFA] p-1.5 shadow-sm"
            >
              <GrowthChart tanamanList={tanaman} />
            </motion.div>
          </motion.div>

          {/* Section 5: Status Blok Lahan & Progress Fase */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="forest" 
              title="Pemantauan Blok Lahan & Fase Tanaman" 
              subtitle="Rincian kondisi tiap blok lahan serta perkembangan fase tanaman secara terpadu."
            />
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/90 bg-[#FEFEFA] flex flex-col gap-4 text-slate-950 overflow-hidden relative"
            >
              <div 
                onClick={() => setIsStatusBlokOpen(!isStatusBlokOpen)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none pb-3.5 border-b border-slate-200/80 hover:opacity-95 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#154734] text-white font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-[20px]">forest</span>
                  </div>
                  <span className="font-extrabold text-base sm:text-lg text-slate-950 tracking-tight font-display truncate">
                    Daftar Tanaman Per Blok Lahan
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                  <span className="text-xs font-extrabold bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[15px] text-[#154734]">eco</span>
                    <span>{tanaman.length} Tanaman</span>
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label={isStatusBlokOpen ? "Sembunyikan" : "Tampilkan"}
                  >
                    <span className={`material-symbols-outlined text-xl transition-transform duration-300 block ${isStatusBlokOpen ? 'rotate-180' : 'rotate-0'}`}>
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {isStatusBlokOpen && (
                <div className="pt-2">
                  <div className="flex gap-2 overflow-x-auto max-w-full pb-3 mb-4 border-b border-slate-200/80">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTabBlock("semua"); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                        activeTabBlock === "semua"
                          ? "bg-[#154734] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200"
                      }`}
                    >
                      Semua Blok ({tanaman.length})
                    </button>
                    {blokLahan.map(b => (
                      <button
                        key={b.id}
                        onClick={(e) => { e.stopPropagation(); setActiveTabBlock(b.id); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                          activeTabBlock === b.id
                            ? "bg-[#154734] text-white shadow-2xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200"
                        }`}
                      >
                        {b.nama}
                      </button>
                    ))}
                  </div>

                  {filteredTanaman.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-400">park</span>
                      <p className="text-sm font-bold text-slate-950 font-display">Belum ada tanaman di blok ini</p>
                      <p className="text-xs text-slate-600 max-w-sm font-medium">
                        Tambahkan data tanaman di menu Data Lahan untuk mulai memantau HST dan fase pertumbuhannya.
                      </p>
                      <button
                        onClick={() => navigate('pemantauan')}
                        className="mt-2 text-xs font-extrabold bg-[#154734] hover:bg-[#0e3023] text-white px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
                      >
                        + TAMBAH TANAMAN
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredTanaman.map((item, idx) => (
                        <TanamanCardDropdown
                          key={item.id || idx}
                          item={item}
                          isFirst={idx === 0}
                          blokLahan={blokLahan}
                          updateTanaman={updateTanaman}
                          navigate={navigate}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Section 6: Grid 2 Kolom: Agenda Terdekat & Log Lapangan */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="calendar_month" 
              title="Agenda & Catatan Aktivitas Lapangan" 
              subtitle="Jadwal perawatan tanaman terdekat serta riwayat kerja harian tim di kebun."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Agenda Perawatan Terdekat */}
              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="p-5 sm:p-6 bg-[#FEFEFA] rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/80">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2 font-display">
                      <span className="material-symbols-outlined text-[#154734]">calendar_month</span>
                      Agenda Perawatan
                    </h3>
                    <button
                      onClick={() => navigate("pemupukan")}
                      className="text-xs font-bold bg-[#154734] text-white hover:bg-[#154734] px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer min-h-[34px]"
                    >
                      + TAMBAH
                    </button>
                  </div>

                  {pemupukan.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 font-medium">
                      Belum ada agenda perawatan dijadwalkan
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {upcomingPemupukan.slice(0, 4).map(({ item: p, nextDate }) => {
                        const blok = blokLahan.find((b) => b.id === p.blokId);
                        const isPestisida = p.kategori === "Pestisida";

                        return (
                          <div
                            key={p.id}
                            className="p-3.5 bg-slate-50/60 hover:bg-slate-50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-slate-200/80 transition min-w-0 overflow-hidden"
                          >
                            <div className="flex gap-3 items-start min-w-0 flex-1 w-full sm:w-auto">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                isPestisida ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#154734]/10 text-[#154734] border border-[#154734]/30'
                              }`}>
                                <span className="material-symbols-outlined text-[20px]">
                                  {isPestisida ? 'pest_control' : 'compost'}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-sm text-slate-900 block leading-tight truncate" title={p.jenisPupuk}>
                                  {p.jenisPupuk}
                                </span>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium leading-snug break-words">
                                  Metode: <b className="text-slate-800">{p.metodeAplikasi}</b> &middot; Blok: <b className="text-slate-800">{blok?.nama || "Semua Blok"}</b>
                                </p>
                                <p className="text-[11px] text-[#154734] font-semibold mt-0.5 leading-snug break-words line-clamp-2">
                                  Tujuan: {p.tujuan}
                                </p>
                              </div>
                            </div>

                            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                              <span className="text-xs font-semibold bg-[#154734]/10 text-[#154734] border border-[#154734]/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg inline-block whitespace-nowrap">
                                {nextDate ? formatLocalDate(nextDate) : 'Tanggal tidak valid'}
                              </span>
                              <span className="text-[10px] text-slate-500 block font-medium whitespace-nowrap sm:mt-1">
                                {p.intervalHari > 0 ? `Setiap ${p.intervalHari} Hari` : 'Satu Kali'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("pemupukan")}
                  className="mt-5 text-xs font-semibold text-slate-700 hover:text-[#154734] bg-slate-100 hover:bg-slate-200/70 border border-slate-200 w-full py-2.5 rounded-xl transition text-center cursor-pointer min-h-[40px]"
                >
                  LIHAT SEMUA JADWAL PERAWATAN &rarr;
                </button>
              </motion.div>

              {/* Catatan Aktivitas Lapangan */}
              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="p-5 sm:p-6 bg-[#FEFEFA] rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/80">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2 font-display">
                      <span className="material-symbols-outlined text-[#154734]">history</span>
                      Catatan Lapangan
                    </h3>
                    <button
                      onClick={() => navigate("log")}
                      className="text-xs font-bold bg-[#154734] text-white hover:bg-[#154734] px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer min-h-[34px]"
                    >
                      + CATAT
                    </button>
                  </div>

                  {logAktivitas.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 font-medium">
                      Belum ada riwayat aktivitas dicatat
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {latestLogs.slice(0, 4).map((l) => {
                        const blok = blokLahan.find((b) => b.id === l.blokId);

                        return (
                          <div
                            key={l.id}
                            className="p-3.5 bg-slate-50/60 hover:bg-slate-50 rounded-xl flex flex-col gap-2 border border-slate-200/80 transition min-w-0 overflow-hidden"
                          >
                            <div className="flex justify-between items-center gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-[10px] text-[#154734] font-bold bg-[#154734]/15 px-2.5 py-0.5 rounded-md uppercase shrink-0 whitespace-nowrap">
                                  {l.kategori}
                                </span>
                                <span className="text-xs font-bold text-slate-900 truncate min-w-0 flex-1">
                                  {l.petugas ? `Oleh: ${l.petugas}` : "Petugas Kebun"}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-semibold shrink-0 whitespace-nowrap">
                                {l.tanggal}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-medium break-words line-clamp-3">
                              {l.deskripsi}
                            </p>

                            <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200/60 text-slate-500 font-medium gap-2 min-w-0">
                              <span className="truncate min-w-0 flex-1">Blok: <b className="text-slate-800">{blok?.nama || "Semua Blok"}</b></span>
                              <span className="font-semibold text-red-600 shrink-0 whitespace-nowrap">
                                Biaya: {formatRp(l.biaya || 0)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("log")}
                  className="mt-5 text-xs font-semibold text-slate-700 hover:text-[#154734] bg-slate-100 hover:bg-slate-200/70 border border-slate-200 w-full py-2.5 rounded-xl transition text-center cursor-pointer min-h-[40px]"
                >
                  LIHAT SELURUH LOG AKTIVITAS &rarr;
                </button>
              </motion.div>

            </div>
          </motion.div>

          {/* Section 7: Ringkasan Distribusi Biaya Input Tani */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="pie_chart" 
              title="Analisis Struktur Biaya & Modal" 
              subtitle="Distribusi alokasi anggaran belanja benih, nutrisi, pestisida, dan biaya operasional."
              rightElement={
                <button
                  type="button"
                  onClick={() => navigate('keuangan')}
                  className="text-xs font-bold text-white bg-[#154734] hover:bg-[#0e3023] px-3.5 py-2 rounded-xl transition border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer min-h-[38px] shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px] text-white">account_balance_wallet</span>
                  <span>Laporan Keuangan Lengkap</span>
                </button>
              }
            />
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="p-5 sm:p-6 bg-[#FEFEFA] rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="p-3.5 bg-[#96D8D0]/20 rounded-xl border border-[#96D8D0]/80 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-extrabold text-[#060606]/70 uppercase block mb-1">
                    Benih &amp; Bibit
                  </span>
                  <span className="text-base font-extrabold text-[#060606] block">
                    {formatRp(totalBiayaBenih)}
                  </span>
                  <span className="text-[10px] text-[#060606]/70 font-semibold mt-1 block">
                    {totalBiaya > 0 ? ((totalBiayaBenih / totalBiaya) * 100).toFixed(1) : 0}% dari total
                  </span>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="p-3.5 bg-[#DAF4AA]/25 rounded-xl border border-[#DAF4AA]/80 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-extrabold text-[#060606]/70 uppercase block mb-1">
                    Pupuk &amp; Nutrisi
                  </span>
                  <span className="text-base font-extrabold text-[#060606] block">
                    {formatRp(totalBiayaPupuk)}
                  </span>
                  <span className="text-[10px] text-[#060606]/70 font-semibold mt-1 block">
                    {totalBiaya > 0 ? ((totalBiayaPupuk / totalBiaya) * 100).toFixed(1) : 0}% dari total
                  </span>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="p-3.5 bg-[#BEB9CC]/25 rounded-xl border border-[#BEB9CC]/80 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-extrabold text-[#060606]/70 uppercase block mb-1">
                    Pestisida &amp; Obat
                  </span>
                  <span className="text-base font-extrabold text-[#060606] block">
                    {formatRp(totalBiayaPestisida)}
                  </span>
                  <span className="text-[10px] text-[#060606]/70 font-semibold mt-1 block">
                    {totalBiaya > 0 ? ((totalBiayaPestisida / totalBiaya) * 100).toFixed(1) : 0}% dari total
                  </span>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="p-3.5 bg-[#F1B4B9]/25 rounded-xl border border-[#F1B4B9]/80 shadow-2xs hover:shadow-md transition-all"
                >
                  <span className="text-[10px] font-extrabold text-[#060606]/70 uppercase block mb-1">
                    Biaya Tetap / Tenaga
                  </span>
                  <span className="text-base font-extrabold text-[#060606] block">
                    {formatRp(totalBiayaTetap)}
                  </span>
                  <span className="text-[10px] text-[#060606]/70 font-semibold mt-1 block">
                    {totalBiaya > 0 ? ((totalBiayaTetap / totalBiaya) * 100).toFixed(1) : 0}% dari total
                  </span>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="p-3.5 bg-[#74D1FF]/20 rounded-xl border border-[#74D1FF]/80 shadow-2xs hover:shadow-md transition-all col-span-2 sm:col-span-1"
                >
                  <span className="text-[10px] font-extrabold text-[#060606]/70 uppercase block mb-1">
                    Biaya Operasional Lain
                  </span>
                  <span className="text-base font-extrabold text-[#060606] block">
                    {formatRp(totalBiayaLain)}
                  </span>
                  <span className="text-[10px] text-[#060606]/70 font-semibold mt-1 block">
                    {totalBiaya > 0 ? ((totalBiayaLain / totalBiaya) * 100).toFixed(1) : 0}% dari total
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Section 8: Banner Kontak & Support WhatsApp */}
      <motion.div variants={bentoItem} className="flex flex-col gap-3">
        <SectionTitle 
          icon="support_agent" 
          title="Layanan Dukungan & Konsultasi Agronomi" 
          subtitle="Hubungi tim pakar pertanian untuk konsultasi kendala hama, nutrisi, dan teknik perawatan lahan."
        />
        <div className="flex flex-col gap-4">
          <img 
            src="https://res.cloudinary.com/ddc26noa/image/upload/v1784590990/1784563793022_mnva4t.png" 
            alt="Banner" 
            className="w-full rounded-2xl border border-slate-200/80 shadow-sm object-cover"
          />
          <motion.a 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            href="https://wa.me/qr/MVZDFB2EXFC4K1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center bg-[#154734] hover:bg-[#154734] text-white font-bold py-3.5 px-6 rounded-2xl border border-transparent shadow-sm hover:shadow-md transition-all text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 cursor-pointer min-h-[50px]"
          >
            <span className="material-symbols-outlined text-2xl">chat</span>
            Konsultasi Lahan Via WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}
