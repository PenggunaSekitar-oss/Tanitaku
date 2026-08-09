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

export type ScheduleReminderStatus = 'upcoming' | 'due' | 'overdue' | 'completed' | 'none';

export interface ScheduleReminderState {
  occurrenceDate: Date | null;
  nextDate: Date | null;
  diffDays: number | null;
  status: ScheduleReminderStatus;
}

export function getScheduleReminderState(
  startDateValue: string,
  intervalDays: number,
  completedDates: string[] = [],
  referenceDate = new Date(),
): ScheduleReminderState {
  const startDate = parseLocalDate(startDateValue);
  if (!startDate || Number.isNaN(referenceDate.getTime())) {
    return { occurrenceDate: null, nextDate: null, diffDays: null, status: 'none' };
  }

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const completed = new Set(completedDates.filter((value) => parseLocalDate(value) !== null));
  const interval = Number.isFinite(intervalDays) ? Math.floor(intervalDays) : 0;
  const startDiff = differenceInCalendarDays(startDate, today);

  if (startDiff > 0) {
    return {
      occurrenceDate: startDate,
      nextDate: startDate,
      diffDays: startDiff,
      status: 'upcoming',
    };
  }

  if (interval <= 0) {
    const key = formatLocalDate(startDate);
    if (completed.has(key)) {
      return {
        occurrenceDate: startDate,
        nextDate: null,
        diffDays: differenceInCalendarDays(startDate, today),
        status: 'completed',
      };
    }
    const diffDays = differenceInCalendarDays(startDate, today);
    return {
      occurrenceDate: startDate,
      nextDate: null,
      diffDays,
      status: diffDays === 0 ? 'due' : 'overdue',
    };
  }

  const elapsedDays = Math.max(0, differenceInCalendarDays(today, startDate));
  const elapsedIntervals = Math.floor(elapsedDays / interval);

  for (let i = elapsedIntervals; i >= 0; i--) {
    const occurrence = addLocalDays(startDate, i * interval);
    const key = formatLocalDate(occurrence);
    if (!completed.has(key)) {
      const diffDays = differenceInCalendarDays(occurrence, today);
      return {
        occurrenceDate: occurrence,
        nextDate: addLocalDays(occurrence, interval),
        diffDays,
        status: diffDays === 0 ? 'due' : 'overdue',
      };
    }
  }

  const nextDate = addLocalDays(startDate, (elapsedIntervals + 1) * interval);
  return {
    occurrenceDate: nextDate,
    nextDate,
    diffDays: differenceInCalendarDays(nextDate, today),
    status: 'upcoming',
  };
}

export function isDateInRange(value: string, startDate?: string, endDate?: string): boolean {
  if (!value) return false;
  if (startDate && value < startDate) return false;
  if (endDate && value > endDate) return false;
  return true;
}
