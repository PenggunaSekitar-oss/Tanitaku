import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Keuangan, LogAktivitas, BlokLahan, Tanaman } from '../context/TaniOpsContext';
import { getKeuanganRecordDate, matchesReportPeriod } from './reportPeriod';
import { calculateIncludedLogCost } from './finance';

const formatRp = (num: number) => {
  return 'Rp ' + (num || 0).toLocaleString('id-ID');
};

export interface PdfReportOptions {
  periodeLabel: string;
  namaKebun: string;
  managerName: string;
  blokFilterId?: string;
  startDate?: string;
  endDate?: string;
  keuangan: Keuangan[];
  logAktivitas: LogAktivitas[];
  blokLahan: BlokLahan[];
  tanaman: Tanaman[];
}

export function generateOperationalPdfReport(options: PdfReportOptions) {
  const {
    periodeLabel,
    namaKebun,
    managerName,
    blokFilterId,
    startDate,
    endDate,
    keuangan,
    logAktivitas,
    blokLahan,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Filter by block if selected
  const blockFilteredKeuangan = blokFilterId && blokFilterId !== 'semua'
    ? keuangan.filter(k => k.blokId === blokFilterId)
    : keuangan;

  const blockFilteredLog = blokFilterId && blokFilterId !== 'semua'
    ? logAktivitas.filter(l => l.blokId === blokFilterId)
    : logAktivitas;

  const filteredKeuangan = blockFilteredKeuangan.filter((record) =>
    matchesReportPeriod(getKeuanganRecordDate(record), startDate, endDate),
  );
  const filteredLog = blockFilteredLog.filter((record) =>
    matchesReportPeriod(record.tanggal, startDate, endDate),
  );

  // Calculate totals
  let totalBiayaBenih = 0;
  let totalBiayaPupuk = 0;
  let totalBiayaPestisida = 0;
  let totalBiayaTetap = 0;
  let totalBiayaLain = 0;
  let totalBiayaOperasional = 0;
  let totalEstimasiOmzet = 0;

  filteredKeuangan.forEach(k => {
    totalBiayaBenih += k.biayaBenih || 0;
    totalBiayaPupuk += k.biayaPupuk || 0;
    totalBiayaPestisida += k.biayaPestisida || 0;
    totalBiayaTetap += k.biayaTetap || 0;
    totalBiayaLain += k.biayaLain || 0;

    const totalBiayaPlot = (k.biayaTetap || 0) + (k.biayaBenih || 0) + (k.biayaPupuk || 0) + (k.biayaPestisida || 0) + (k.biayaLain || 0);
    totalBiayaOperasional += totalBiayaPlot;

    const omzetPlot = (k.targetHasil || 0) * (k.hargaJual || 0);
    totalEstimasiOmzet += omzetPlot;
  });

  const totalLogCost = calculateIncludedLogCost(filteredLog);
  totalBiayaOperasional += totalLogCost;
  const netProfit = totalEstimasiOmzet - totalBiayaOperasional;
  const roi = totalBiayaOperasional > 0 ? ((netProfit / totalBiayaOperasional) * 100).toFixed(1) : '0';

  // --- KOP SURAT / BRAND HEADER ---
  // Header background bar
  doc.setFillColor(21, 71, 52); // #154734 (TANITA Forest Green)
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('TANITA — COMMAND CENTER PERTANIAN', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Dokumen Laporan Operasional & Keuangan Bulanan', 14, 18);

  // Tanggal Cetak
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Cetak: ${printDate}`, pageWidth - 14, 18, { align: 'right' });

  // --- METADATA SECTION ---
  let currentY = 34;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INFORMASI LAPORAN OPERASIONAL', 14, currentY);

  currentY += 4;
  doc.setLineWidth(0.4);
  doc.setDrawColor(21, 71, 52);
  doc.line(14, currentY, pageWidth - 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  doc.text(`Periode Laporan : ${periodeLabel || 'Bulan Ini'}`, 14, currentY);
  doc.text(`Manajer Kebun   : ${managerName || 'Penanggung Jawab Kebun'}`, 110, currentY);

  currentY += 5;
  const selectedBlokName = blokFilterId && blokFilterId !== 'semua'
    ? (blokLahan.find(b => b.id === blokFilterId)?.nama || 'Blok Terpilih')
    : 'Semua Blok Lahan';
  doc.text(`Unit Lahan      : ${selectedBlokName}`, 14, currentY);
  doc.text(`Nama Usaha Tani : ${namaKebun || 'Kebun TANITA Presisi'}`, 110, currentY);

  // --- RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY) ---
  currentY += 10;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  const colWidth = (pageWidth - 28) / 4;
  
  // Col 1: Total Omzet
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMASI OMZET', 14 + 4, currentY + 6);
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61); // green-700
  doc.text(formatRp(totalEstimasiOmzet), 14 + 4, currentY + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Target Hasil Panen', 14 + 4, currentY + 18);

  // Col 2: Total Biaya Tanam
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('BIAYA OPERASIONAL', 14 + colWidth + 4, currentY + 6);
  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28); // red-700
  doc.text(formatRp(totalBiayaOperasional), 14 + colWidth + 4, currentY + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Input Keuangan + Biaya Log', 14 + colWidth + 4, currentY + 18);

  // Col 3: Profit Netto
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMASI PROFIT NETTO', 14 + (colWidth * 2) + 4, currentY + 6);
  doc.setFontSize(11);
  doc.setTextColor(21, 71, 52);
  doc.text(formatRp(netProfit), 14 + (colWidth * 2) + 4, currentY + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`ROI: ${roi}%`, 14 + (colWidth * 2) + 4, currentY + 18);

  // Col 4: Total Log Aktivitas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('LOG AKTIVITAS & BIAYA', 14 + (colWidth * 3) + 4, currentY + 6);
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`${filteredLog.length} Kegiatan`, 14 + (colWidth * 3) + 4, currentY + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Biaya Log: ${formatRp(totalLogCost)}`, 14 + (colWidth * 3) + 4, currentY + 18);

  currentY += 30;

  // --- TABEL 1: RINCIAN BIAYA & PERENCANAAN KEUANGAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RINCIAN BIAYA ANGGARAN & PROYEKSI PER KOMODITAS', 14, currentY);

  const keuanganRows = filteredKeuangan.map((k, index) => {
    const blok = blokLahan.find(b => b.id === k.blokId);
    const totalPlot = (k.biayaTetap || 0) + (k.biayaBenih || 0) + (k.biayaPupuk || 0) + (k.biayaPestisida || 0) + (k.biayaLain || 0);
    const omzet = (k.targetHasil || 0) * (k.hargaJual || 0);
    const profit = omzet - totalPlot;

    return [
      (index + 1).toString(),
      k.komoditas || 'Umum',
      blok?.nama || 'Semua Blok',
      formatRp(k.biayaBenih || 0),
      formatRp(k.biayaPupuk || 0),
      formatRp(k.biayaPestisida || 0),
      formatRp((k.biayaTetap || 0) + (k.biayaLain || 0)),
      formatRp(totalPlot),
      formatRp(omzet),
      formatRp(profit),
    ];
  });

  // Footer totals row for table 1
  keuanganRows.push([
    '',
    'TOTAL',
    '',
    formatRp(totalBiayaBenih),
    formatRp(totalBiayaPupuk),
    formatRp(totalBiayaPestisida),
      formatRp(totalBiayaTetap + totalBiayaLain + totalLogCost),
    formatRp(totalBiayaOperasional),
    formatRp(totalEstimasiOmzet),
    formatRp(netProfit),
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['No', 'Komoditas', 'Lahan', 'Benih', 'Pupuk', 'Pestisida', 'Lain/Log', 'Total Biaya', 'Est. Omzet', 'Est. Profit']],
    body: keuanganRows,
    theme: 'grid',
    headStyles: {
      fillColor: [21, 71, 52],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 22 },
      2: { cellWidth: 24 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' },
      8: { halign: 'right', textColor: [21, 128, 61] },
      9: { halign: 'right', fontStyle: 'bold', textColor: [21, 71, 52] },
    },
    didParseCell: (data) => {
      if (data.row.index === keuanganRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249];
      }
    },
  });

  // Get Y position after table 1
  // @ts-expect-error - jspdf-autotable extends jsPDF instance
  const finalYTable1 = doc.lastAutoTable.finalY || currentY + 50;

  let logY = finalYTable1 + 10;

  // Check page overflow
  if (logY > pageHeight - 60) {
    doc.addPage();
    logY = 20;
  }

  // --- TABEL 2: LOG & CATATAN AKTIVITAS LAPANGAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. CATATAN RIWAYAT AKTIVITAS LAPANGAN & PEKERJAAN', 14, logY);

  const logRows = filteredLog.map((l, idx) => {
    const blok = blokLahan.find(b => b.id === l.blokId);
    return [
      (idx + 1).toString(),
      l.tanggal || '-',
      blok?.nama || 'Semua Blok',
      l.kategori || 'Kegiatan',
      `${l.deskripsi}\n(Petugas: ${l.petugas || 'Kebun'})`,
      formatRp(l.biaya || 0),
    ];
  });

  logRows.push([
    '',
    '',
    '',
    'TOTAL BIAYA AKTIVITAS',
    '',
    formatRp(totalLogCost),
  ]);

  autoTable(doc, {
    startY: logY + 3,
    head: [['No', 'Tanggal', 'Lahan', 'Kategori', 'Deskripsi Pekerjaan & Petugas', 'Biaya (Rp)']],
    body: logRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 20 },
      2: { cellWidth: 28 },
      3: { fontStyle: 'bold', cellWidth: 32 },
      4: { cellWidth: 'auto' },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 26 },
    },
    didParseCell: (data) => {
      if (data.row.index === logRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249];
      }
    },
  });

  // Get Y position after table 2
  // @ts-expect-error - jspdf-autotable extends jsPDF instance
  const finalYTable2 = doc.lastAutoTable.finalY || logY + 40;

  let sigY = finalYTable2 + 12;
  if (sigY > pageHeight - 45) {
    doc.addPage();
    sigY = 25;
  }

  // --- SIGNATURE & APPROVAL SECTION ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const leftSigX = 25;
  const rightSigX = pageWidth - 65;

  doc.text('Mengetahui / Disetujui,', leftSigX, sigY);
  doc.text('Pakar Agronomi Kebun', leftSigX, sigY + 4);

  doc.text('Dibuat Oleh,', rightSigX, sigY);
  doc.text('Manager Operasional', rightSigX, sigY + 4);

  doc.setFont('helvetica', 'bold');
  doc.text('( ......................................... )', leftSigX, sigY + 22);
  doc.text(`( ${managerName || 'Penanggung Jawab Kebun'} )`, rightSigX, sigY + 22);

  // --- PAGE NUMBERS FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.text('TANITA — Smart Agriculture Command Center', 14, pageHeight - 7);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }

  // Save the PDF file
  const fileName = `Laporan_Operasional_TANITA_${periodeLabel.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
}
