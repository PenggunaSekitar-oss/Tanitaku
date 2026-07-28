import { addLocalDays, differenceInCalendarDays, parseLocalDate } from './localDate';

export function getScheduleOccurrences(
  startDateValue: string,
  intervalDays: number,
  rangeStart: Date,
  rangeEnd: Date,
): Date[] {
  const startDate = parseLocalDate(startDateValue);
  if (!startDate || rangeStart > rangeEnd) return [];
  const normalizedStart = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const normalizedEnd = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());

  if (!Number.isFinite(intervalDays) || intervalDays <= 0) {
    return startDate >= normalizedStart && startDate <= normalizedEnd ? [startDate] : [];
  }

  const elapsed = differenceInCalendarDays(normalizedStart, startDate);
  const firstStep = elapsed <= 0 ? 0 : Math.ceil(elapsed / intervalDays);
  const occurrences: Date[] = [];
  let occurrence = addLocalDays(startDate, firstStep * intervalDays);
  while (occurrence <= normalizedEnd && occurrences.length < 64) {
    if (occurrence >= normalizedStart) occurrences.push(occurrence);
    occurrence = addLocalDays(occurrence, intervalDays);
  }
  return occurrences;
}
