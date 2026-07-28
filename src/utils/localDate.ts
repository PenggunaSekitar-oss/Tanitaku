const pad2 = (value: number) => String(value).padStart(2, '0');

export function formatLocalDate(date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

export function addLocalDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function differenceInCalendarDays(later: Date, earlier: Date): number {
  const laterUtc = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
  const earlierUtc = Date.UTC(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  return Math.round((laterUtc - earlierUtc) / 86_400_000);
}

export function getNextScheduledDate(
  startDateValue: string,
  intervalDays: number,
  referenceDate = new Date(),
): Date | null {
  const startDate = parseLocalDate(startDateValue);
  if (!startDate) return null;
  if (!Number.isFinite(intervalDays) || intervalDays <= 0) return startDate;

  const elapsedDays = differenceInCalendarDays(referenceDate, startDate);
  if (elapsedDays <= 0) return startDate;

  const completedIntervals = Math.ceil(elapsedDays / intervalDays);
  return addLocalDays(startDate, completedIntervals * intervalDays);
}

export function isDateInRange(value: string, startDate?: string, endDate?: string): boolean {
  if (!value) return false;
  if (startDate && value < startDate) return false;
  if (endDate && value > endDate) return false;
  return true;
}
