import { formatLocalDate, isDateInRange } from './localDate';
import type { Keuangan } from '../context/TaniOpsContext';

export interface ReportPeriodOption {
  value: string;
  label: string;
  startDate?: string;
  endDate?: string;
}
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const endOfMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0);

export function buildReportPeriodOptions(referenceDate = new Date()): ReportPeriodOption[] {
  const options: ReportPeriodOption[] = [];

  for (let offset = 0; offset < 12; offset += 1) {
    const monthDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - offset, 1);
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const startDate = formatLocalDate(monthDate);
    const endDate = formatLocalDate(endOfMonth(year, monthIndex));
    options.push({
      value: `month:${year}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: `${MONTH_NAMES[monthIndex]} ${year}${offset === 0 ? ' (Bulan Berjalan)' : ''}`,
      startDate,
      endDate,
    });
  }

  const quarter = Math.floor(referenceDate.getMonth() / 3) + 1;
  const quarterStartMonth = (quarter - 1) * 3;
  const quarterYear = referenceDate.getFullYear();
  options.push({
    value: `quarter:${quarterYear}-Q${quarter}`,
    label: `Triwulan ${quarter} (Q${quarter} ${quarterYear})`,
    startDate: formatLocalDate(new Date(quarterYear, quarterStartMonth, 1)),
    endDate: formatLocalDate(endOfMonth(quarterYear, quarterStartMonth + 2)),
  });
  options.push({
    value: 'all',
    label: 'Semua Periode Tanam',
  });

  return options;
}

export function getKeuanganRecordDate(record: Keuangan): string {
  return (
    record.transactionDate ||
    record.tanggalPembelianPestisida ||
    record.tanggalPembelianPupuk ||
    record.tanggalPembelianBenih ||
    ''
  );
}

export function matchesReportPeriod(
  value: string,
  startDate?: string,
  endDate?: string,
): boolean {
  if (!startDate && !endDate) return true;
  return isDateInRange(value, startDate, endDate);
}
