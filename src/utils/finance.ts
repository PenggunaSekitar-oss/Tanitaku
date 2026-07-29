import type { LogAktivitas } from '../context/TaniOpsContext';

export function shouldIncludeLogCost(log: LogAktivitas): boolean {
  return (log.biaya || 0) > 0 && log.biayaSudahDiKeuangan !== true;
}

export function calculateIncludedLogCost(logs: LogAktivitas[]): number {
  return logs.reduce(
    (total, log) => total + (shouldIncludeLogCost(log) ? log.biaya || 0 : 0),
    0,
  );
}
