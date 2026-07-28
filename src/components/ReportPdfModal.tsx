import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { generateOperationalPdfReport } from '../utils/pdfGenerator';
import { Select } from './Select';
import {
  buildReportPeriodOptions,
  getKeuanganRecordDate,
  matchesReportPeriod,
  type ReportPeriodOption,
} from '../utils/reportPeriod';

interface ReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPdfModal({ isOpen, onClose }: ReportPdfModalProps) {
  const { keuangan, logAktivitas, blokLahan, tanaman } = useTaniOps();
  const { showToast } = useToast();

  const periodeOptions = buildReportPeriodOptions();
  const fallbackPeriod: ReportPeriodOption = { value: 'all', label: 'Semua Periode Tanam' };
  const [periode, setPeriode] = useState<string>(periodeOptions[0]?.value ?? 'all');
  const [selectedBlokId, setSelectedBlokId] = useState<string>('semua');
  const [namaKebun, setNamaKebun] = useState<string>(() => localStorage.getItem('tanita_farm_name') || 'Kebun Presisi TANITA');
  const [managerName, setManagerName] = useState<string>(() => localStorage.getItem('tanita_manager_name') || 'Muh Amin Arsyad');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const blokOptions = [
    { value: 'semua', label: 'Semua Blok Lahan Kebun' },
    ...blokLahan.map((b) => ({ value: b.id, label: b.nama })),
  ];

  const handleDownload = () => {
    try {
      setIsGenerating(true);
      
      // Save updated names to local storage for convenience
      localStorage.setItem('tanita_farm_name', namaKebun);
      localStorage.setItem('tanita_manager_name', managerName);

      const selectedPeriod = periodeOptions.find((option) => option.value === periode) || periodeOptions[0] || fallbackPeriod;
      generateOperationalPdfReport({
        periodeLabel: selectedPeriod.label.replace(' (Bulan Berjalan)', ''),
        namaKebun,
        managerName,
        blokFilterId: selectedBlokId,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
        keuangan,
        logAktivitas,
        blokLahan,
        tanaman,
      });

      showToast('Laporan PDF operasional bulanan berhasil diunduh', 'success');
      onClose();
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Gagal mengunduh laporan PDF. Silakan coba lagi.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPeriod = periodeOptions.find((option) => option.value === periode) || periodeOptions[0] || fallbackPeriod;
  const filteredLogCount = logAktivitas.filter((record) =>
    (selectedBlokId === 'semua' || record.blokId === selectedBlokId) &&
    matchesReportPeriod(record.tanggal, selectedPeriod.startDate, selectedPeriod.endDate)
  ).length;

  const filteredKeuanganCount = keuangan.filter((record) =>
    (selectedBlokId === 'semua' || record.blokId === selectedBlokId) &&
    matchesReportPeriod(getKeuanganRecordDate(record), selectedPeriod.startDate, selectedPeriod.endDate)
  ).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#FEFEFA] border-2 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl w-full max-w-lg p-5 sm:p-6 my-auto overflow-hidden flex flex-col gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Modal */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#154734] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-slate-950 uppercase tracking-tight">
                  Cetak Laporan PDF Bulanan
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Ringkasan Keuangan & Log Aktivitas Lapangan TANITA
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 p-1 rounded-lg transition"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Form Options */}
          <div className="flex flex-col gap-4 text-xs">
            {/* Periode Laporan */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#154734]">calendar_month</span>
                Periode Laporan Bulanan
              </label>
              <Select
                options={periodeOptions}
                value={periode}
                onChange={setPeriode}
              />
            </div>

            {/* Filter Lahan */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#154734]">grid_view</span>
                Filter Unit Lahan / Blok
              </label>
              <Select
                options={blokOptions}
                value={selectedBlokId}
                onChange={setSelectedBlokId}
              />
            </div>

            {/* Nama Kebun & Manager */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-900 uppercase tracking-wider">
                  Nama Usaha Tani / Kebun
                </label>
                <input
                  type="text"
                  value={namaKebun}
                  onChange={(e) => setNamaKebun(e.target.value)}
                  placeholder="Contoh: Kebun TANITA Presisi"
                  className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-900 uppercase tracking-wider">
                  Manager / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Contoh: Muh Amin Arsyad"
                  className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Data Preview Badge Card */}
            <div className="p-3.5 bg-[#154734]/5 border-2 border-[#154734]/30 rounded-xl flex items-center justify-between text-xs font-semibold text-[#154734]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">analytics</span>
                <span>Cakupan Laporan Terpilih:</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <span className="bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm">
                  {filteredKeuanganCount} Plot Keuangan
                </span>
                <span className="bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm">
                  {filteredLogCount} Log Aktivitas
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-black bg-white text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl border-2 border-black bg-[#154734] hover:bg-[#0d3124] text-white font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>{isGenerating ? 'Memproses PDF...' : 'Unduh Laporan PDF'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
