import { PageHeader } from '../components/PageHeader';
import React, { useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";
import { BannerCarousel } from "../components/BannerCarousel";
import { BmkgWeatherWidget } from "../components/BmkgWeatherWidget";
import { GrowthChart } from "../components/GrowthChart";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { useTaniOps, type BlokLahan, type Tanaman } from "../context/TaniOpsContext";
import {
  calculateHST,
  determineFaseTanaman,
  calculateLuasLahan,
  getRecommendations,
} from "../utils/calculations";
import { formatLocalDate, getScheduleReminderState } from "../utils/localDate";
import { calculateIncludedLogCost } from "../utils/finance";
import { FirstRunChecklist } from "../components/FirstRunChecklist";

// Helper for currency formatting
const formatRp = (num: number) => {
  return "Rp " + Math.round(num).toLocaleString("id-ID");
};

// Section Title Component
const SectionTitle = ({ 
  title, 
  subtitle, 
  rightElement 
}: { 
  icon?: string;
  title: string; 
  subtitle: string; 
  rightElement?: React.ReactNode; 
}) => (
  <div className="mb-1 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
    <div className="max-w-3xl">
      <h2 className="font-display text-lg font-semibold tracking-[-0.025em] text-[#1B2922] sm:text-xl">{title}</h2>
      <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#6B756E] sm:text-sm">{subtitle}</p>
    </div>
    {rightElement && (
      <div className="shrink-0 self-start sm:self-end">
        {rightElement}
      </div>
    )}
  </div>
);

// Expandable operational snapshot for each crop record
function TanamanCardDropdown({
  item,
  blokLahan,
  updateTanaman,
  isReadOnly,
  navigate,
}: {
  item: Tanaman;
  blokLahan: BlokLahan[];
  updateTanaman: (id: string, data: Partial<Tanaman>) => void;
  isReadOnly: boolean;
  navigate: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isPanen = item.status === 'Panen';
  const hst = calculateHST(item.tanggalTanam);
  const fase = isPanen ? 'Sudah Dipanen' : determineFaseTanaman(hst);
  const blok = blokLahan.find((b) => b.id === item.blokId);
  const rec = getRecommendations(hst);

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

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#D8D5CC] bg-[#F8F7F2] sm:grid-cols-3">
            {[
              ['Tanggal tanam', item.tanggalTanam || 'Belum dicatat'],
              ['Umur tercatat', `${hst} HST`],
              ['Kelompok umur', fase],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-3.5 ${
                  index > 0 ? 'border-l border-[#E2DFD7]' : ''
                } ${index === 2 ? 'col-span-2 border-l-0 border-t sm:col-span-1 sm:border-l sm:border-t-0' : ''}`}
              >
                <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[#7A837D]">
                  {label}
                </span>
                <strong className="mt-1 block text-xs font-semibold text-[#26352D]">{value}</strong>
              </div>
            ))}
          </div>

          {/* Rekomendasi Perawatan */}
          {isPanen ? (
            <div className="p-3.5 bg-[#154734]/10 border border-[#154734]/30 rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#154734] text-[22px] shrink-0">check_circle</span>
                <div>
                  <b className="text-[#154734] block font-extrabold">Lahan Selesai Dipanen</b>
                  <span className="text-[11px] text-slate-900 font-bold leading-tight block">Status panen tersimpan pada catatan tanaman.</span>
                </div>
              </div>
              {!isReadOnly && <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTanaman(item.id, { status: 'Aktif' });
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#154734] text-white border border-[#0A0A0A] rounded-full shadow-2xs hover:bg-[#0e3023] transition shrink-0 cursor-pointer"
              >
                Aktifkan Kembali
              </button>}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#154734] text-[20px]">psychology</span>
                  Checklist verifikasi lapangan ({hst} HST)
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
                    Monitoring perlindungan
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
                      try {
                        localStorage.setItem('targetPestisida', targetHama);
                      } catch {
                        // Continue to the catalog when browser storage is unavailable.
                      }
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
              {!isPanen && !isReadOnly && (
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

export function DashboardView({ navigate }: { navigate: (v: string) => void }) {
  const [activeTabBlock, setActiveTabBlock] = useState<string>("semua");
  const [isStatusBlokOpen, setIsStatusBlokOpen] = useState<boolean>(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(() => {
    try {
      return localStorage.getItem('tanita_first_run_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const { isReadOnly, blokLahan, tanaman, updateTanaman, pemupukan, keuangan, logAktivitas } = useTaniOps();
  const onboardingSteps = [
    {
      id: 'blok',
      title: 'Tambahkan blok lahan',
      description: 'Catat luas melalui bedengan, Are, atau hektare.',
      completed: blokLahan.length > 0,
      actionLabel: 'Tambah blok',
      onAction: () => navigate('pemantauan'),
    },
    {
      id: 'tanaman',
      title: 'Catat tanaman',
      description: 'Hubungkan komoditas dan tanggal tanam ke blok.',
      completed: tanaman.length > 0,
      actionLabel: 'Tambah tanaman',
      onAction: () => navigate('pemantauan:tanaman'),
    },
    {
      id: 'jadwal',
      title: 'Buat jadwal perawatan',
      description: 'Simpan pupuk atau pestisida beserta takarannya.',
      completed: pemupukan.length > 0,
      actionLabel: 'Buat jadwal',
      onAction: () => navigate('pemupukan'),
    },
  ];
  const onboardingComplete = onboardingSteps.every((step) => step.completed);
  const hasOperationalData =
    blokLahan.length > 0 ||
    tanaman.length > 0 ||
    pemupukan.length > 0 ||
    keuangan.length > 0 ||
    logAktivitas.length > 0;
  const showOnboarding =
    !isReadOnly &&
    !onboardingComplete &&
    (!isOnboardingDismissed || !hasOperationalData);

  const dismissOnboarding = () => {
    setIsOnboardingDismissed(true);
    try {
      localStorage.setItem('tanita_first_run_dismissed', 'true');
    } catch {
      // Dismissal can remain session-only when storage is unavailable.
    }
  };

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
        blok.jarakAntarBedengan,
        blok.luasManualM2,
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
  const totalBiayaLog = calculateIncludedLogCost(logAktivitas);
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

    const maintenanceScore =
      (logAktivitas.length > 0 ? 50 : 0) +
      (pemupukan.length > 0 ? 50 : 0);

    const validFinance = keuangan.filter((record) =>
      record.transactionDate &&
      blokLahan.some((block) => block.id === record.blokId)
    ).length;
    const financialScore = keuangan.length > 0 ? (validFinance / keuangan.length) * 100 : 0;

    const finalVal = (blockScore + cropScore + maintenanceScore + financialScore) / 4;
    const scoreStr = Math.min(100, Math.max(0, finalVal)).toFixed(1);
    
    let label = "Lengkap";
    const num = parseFloat(scoreStr);
    if (num >= 85) label = "Lengkap";
    else if (num >= 70) label = "Baik";
    else if (num >= 50) label = "Cukup";
    else label = "Perlu dilengkapi";

    return { score: scoreStr, label };
  };

  const { score: healthScore, label: healthScoreLabel } = useMemo(
    () => calculateDataCompletenessScore(),
    [blokLahan, tanaman, keuangan, logAktivitas, pemupukan]
  );

  const upcomingPemupukan = [...pemupukan]
    .map((item) => {
      const reminder = getScheduleReminderState(
        item.tanggalAplikasi,
        item.intervalHari,
        item.completedDates,
      );
      return {
        item,
        nextDate: reminder.occurrenceDate,
        reminder,
      };
    })
    .filter(({ reminder }) => reminder.status !== 'completed')
    .sort((a, b) => (a.nextDate?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.nextDate?.getTime() ?? Number.MAX_SAFE_INTEGER));
  const latestLogs = [...logAktivitas].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal) || b.id.localeCompare(a.id)
  );

  const bentoContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const bentoItem: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
    show: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.52,
        ease: [0.16, 1, 0.3, 1],
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
      {showOnboarding && (
        <motion.div variants={bentoItem}>
          <FirstRunChecklist
            steps={onboardingSteps}
            onDismiss={hasOperationalData ? dismissOnboarding : undefined}
          />
        </motion.div>
      )}

      {/* Hero Banner Carousel */}
      {hasOperationalData && (
        <motion.div variants={bentoItem} className="w-full">
          <BannerCarousel />
        </motion.div>
      )}

      {/* Section 1: Performance Score Gauge & Quick Metrics */}
      {hasOperationalData && <motion.div variants={bentoItem} className="flex flex-col gap-4">
        <SectionTitle 
          icon="analytics" 
          title="Kelengkapan Catatan & Ringkasan Operasional"
          subtitle="Kelengkapan menilai blok, tanaman, aktivitas, dan keuangan dengan bobot setara. Estimasi laba memakai target hasil × harga jual dikurangi seluruh biaya tercatat; ROI adalah laba dibandingkan biaya."
        />
        <div 
          className="flex flex-col items-center gap-6 rounded-2xl border border-[#345749] p-5 sm:p-7 lg:flex-row lg:gap-8"
          style={{ backgroundColor: '#173F35', color: '#FFFFFF' }}
        >

          {/* Data completeness, not an agronomic performance score */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/15 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
              Kelengkapan catatan
            </span>
            <strong className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
              <AnimatedNumber
                value={Number(healthScore)}
                formatter={(value) => `${Math.round(value)}%`}
              />
            </strong>
            <span className="mt-2 text-xs font-semibold text-[#DDE9E2]">{healthScoreLabel}</span>
            <p className="mt-3 max-w-[210px] text-[10px] font-medium leading-relaxed text-white/60">
              Empat bagian dinilai setara: blok, tanaman, aktivitas, dan catatan keuangan.
            </p>
          </div>

          {/* 4 Key Metrics */}
          <div className="motion-stagger grid w-full flex-1 grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/15 flex flex-col justify-between min-h-[116px]">
              <span className="text-xs font-semibold text-white/75">Populasi aktif</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white my-1 font-display">
                <AnimatedNumber value={totalPopulasiAktif} />
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">{tanamanAktif.length} Varietas di Lahan</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 flex flex-col justify-between min-h-[116px]">
              <span className="text-xs font-semibold text-white/75">Estimasi laba (proyeksi)</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white my-1 font-display">
                <AnimatedNumber value={laba} formatter={formatRp} />
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">ROI Proyeksi {roi}%</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 flex flex-col justify-between min-h-[116px]">
              <span className="text-xs font-semibold text-white/75">Luas bedengan</span>
              <div className="flex flex-col my-1">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-display">
                  <AnimatedNumber value={totalLuasLahan} /> <span className="text-xs font-semibold text-white/80">m²</span>
                </span>
                <span className="text-[11px] font-mono text-white/90 font-medium">
                  ({(totalLuasLahan / 100).toLocaleString("id-ID", { maximumFractionDigits: 2 })} Are / {(totalLuasLahan / 10000).toLocaleString("id-ID", { maximumFractionDigits: 3 })} Ha)
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold">Kepadatan {kepadatan} tnm/m²</span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/15 flex flex-col justify-between min-h-[116px]">
              <span className="text-xs font-semibold text-white/75">Agenda perawatan</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white my-1 font-display">
                <AnimatedNumber value={pemupukan.length} /> <span className="text-xs font-semibold text-white/80">Jadwal</span>
              </span>
              <span className="text-[11px] sm:text-xs text-white/80 font-semibold truncate">{upcomingPemupukan[0]?.item.jenisPupuk || "Belum ada agenda"}</span>
            </div>
          </div>
        </div>
      </motion.div>}

      {/* Section 2: BMKG forecast */}
      <motion.div variants={bentoItem} className="flex flex-col gap-4">
        <SectionTitle 
          icon="partly_cloudy_day" 
          title="Prakiraan Cuaca BMKG"
          subtitle="Prakiraan resmi per tiga jam sebagai bahan pertimbangan kerja lapangan. Kondisi mikroklimat kebun tetap perlu diperiksa langsung."
        />
        <div>
          <BmkgWeatherWidget />
        </div>
      </motion.div>

          {/* Section 3: Pintasan Akses Cepat Fitur */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="grid_view" 
              title="Pintasan Fitur Operasional" 
              subtitle="Buka katalog bibit, pupuk, pestisida, referensi penyakit, atau kalkulator larutan."
            />

            <div className="p-5 sm:p-6 bg-[#FEFEFA] rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="motion-stagger grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
                {[
                  { 
                    id: 'cari-bibit', 
                    title: 'Cari Bibit', 
                    icon: 'grass', 
                    desc: 'Varietas & kualitas',
                  },
                  { 
                    id: 'cari-pupuk', 
                    title: 'Cari Pupuk', 
                    icon: 'compost', 
                    desc: 'Formulasi & dosis',
                  },
                  { 
                    id: 'cari-pestisida', 
                    title: 'Cari Pestisida', 
                    icon: 'shield', 
                    desc: 'Produk & proteksi',
                  },
                  { 
                    id: 'cari-penyakit', 
                    title: 'Cari Penyakit', 
                    icon: 'bug_report', 
                    desc: 'Identifikasi gejala',
                  },
                  { 
                    id: 'kocor', 
                    title: 'Kocor Pupuk', 
                    icon: 'science', 
                    desc: 'Hitung air & nutrisi',
                  },
                ].map((item) => {
                  const isKocor = item.id === 'kocor';
                  return (
                    <button 
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`group flex min-h-[104px] cursor-pointer items-center justify-center rounded-xl border border-[#D8D5CC] bg-[#F8F7F2] p-3.5 text-center transition hover:border-[#8EA397] hover:bg-white active:scale-[0.99] ${
                        isKocor 
                          ? 'col-span-2 sm:col-span-2 lg:col-span-1 flex-col sm:flex-row lg:flex-col sm:text-left lg:text-center gap-2.5 sm:gap-3.5 lg:gap-2' 
                          : 'flex-col text-center gap-2'
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D4CD] bg-[#E9EFEB] text-[#24533F] transition group-hover:bg-[#DCE8E0]">
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{item.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#202B25] sm:text-sm">{item.title}</span>
                        <span className="text-[10px] font-medium leading-tight text-[#737B75] sm:text-[11px]">{item.desc}</span>
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
              title="Sebaran Umur Tanaman Aktif"
              subtitle="Perbandingan HST berdasarkan tanggal tanam yang tercatat, tanpa asumsi fase atau target panen generik."
            />
            <div>
              <GrowthChart tanamanList={tanaman} />
            </div>
          </motion.div>

          {/* Section 5: Status Blok Lahan & Progress Fase */}
          <motion.div variants={bentoItem} className="flex flex-col gap-4">
            <SectionTitle 
              icon="forest" 
              title="Pemantauan Blok & Umur Tanaman"
              subtitle="Rincian tanaman pada tiap blok berdasarkan catatan tanggal tanam dan status operasional."
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
                        Tambahkan data tanaman di menu Data Lahan untuk mulai memantau umur dan statusnya.
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
                          blokLahan={blokLahan}
                          updateTanaman={updateTanaman}
                          isReadOnly={isReadOnly}
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
                      {upcomingPemupukan.slice(0, 4).map(({ item: p, nextDate, reminder }) => {
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
                                {reminder.status === 'overdue'
                                  ? `Terlewat ${Math.abs(reminder.diffDays ?? 0)} hari`
                                  : reminder.status === 'due'
                                    ? 'Jadwal hari ini'
                                    : p.intervalHari > 0
                                      ? `Setiap ${p.intervalHari} hari`
                                      : 'Satu kali'}
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
            <div className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {[
                  ['Benih & bibit', totalBiayaBenih],
                  ['Pupuk & nutrisi', totalBiayaPupuk],
                  ['Proteksi tanaman', totalBiayaPestisida],
                  ['Biaya tetap / tenaga', totalBiayaTetap],
                  ['Operasional lain', totalBiayaLain],
                ].map(([label, value], index) => {
                  const numericValue = Number(value);
                  const percentage = totalBiaya > 0
                    ? ((numericValue / totalBiaya) * 100).toFixed(1)
                    : '0';
                  return (
                    <div
                      key={label}
                      className={`rounded-xl border border-[#D8D5CC] bg-[#F8F7F2] p-3.5 ${
                        index === 4 ? 'col-span-2 sm:col-span-1' : ''
                      }`}
                    >
                      <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-[#747D77]">
                        {label}
                      </span>
                      <span className="block text-sm font-semibold text-[#243129] sm:text-base">
                        {formatRp(numericValue)}
                      </span>
                      <span className="mt-1 block text-[10px] font-medium text-[#747D77]">
                        {percentage}% dari total
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
      {/* Section 8: Banner Kontak & Support WhatsApp */}
      <motion.div variants={bentoItem} className="flex flex-col gap-3">
        <SectionTitle 
          icon="support_agent" 
          title="Bantuan Penggunaan TANITA"
          subtitle="Hubungi pengelola aplikasi untuk pertanyaan akses, pencatatan data, atau penggunaan fitur."
        />
        <div className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[22px] text-[#24533F]" aria-hidden="true">support_agent</span>
              <div>
                <h3 className="font-display text-sm font-semibold text-[#243129]">Bantuan melalui WhatsApp</h3>
                <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-[#6F7872]">
                  Untuk keputusan agronomi, tetap konsultasikan kondisi lapangan dengan penyuluh atau tenaga yang kompeten.
                </p>
              </div>
            </div>
          <a
            href="https://wa.me/qr/MVZDFB2EXFC4K1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#24533F] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#1B4031] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[19px]">chat</span>
            Hubungi pengelola
          </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
