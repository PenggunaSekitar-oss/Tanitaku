import { useMemo, useState } from 'react';
import { BlokLahan, Pemupukan } from '../context/TaniOpsContext';
import { formatLocalDate } from '../utils/localDate';
import { getScheduleOccurrences } from '../utils/schedule';
import { HelpTip } from './HelpTip';

interface GardenCalendarProps {
  schedules: Pemupukan[];
  blocks: BlokLahan[];
  onEdit: (schedule: Pemupukan) => void;
  readOnly?: boolean;
}

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function GardenCalendar({ schedules, blocks, onEdit, readOnly = false }: GardenCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const days = useMemo(() => {
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const mondayOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1 - mondayOffset);
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridEnd.getDate() + 41);

    const eventsByDate = new Map<string, Pemupukan[]>();
    schedules.forEach((schedule) => {
      getScheduleOccurrences(schedule.tanggalAplikasi, schedule.intervalHari, gridStart, gridEnd)
        .forEach((date) => {
          const key = formatLocalDate(date);
          const existing = eventsByDate.get(key) ?? [];
          existing.push(schedule);
          eventsByDate.set(key, existing);
        });
    });

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = formatLocalDate(date);
      return {
        key,
        date,
        inMonth: date.getMonth() === cursor.getMonth(),
        events: eventsByDate.get(key) ?? [],
      };
    });
  }, [cursor, schedules]);

  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(cursor);
  const todayKey = formatLocalDate();

  return (
    <section className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center">
            <h2 className="font-display text-base font-semibold text-[#26352D]">Kalender kegiatan</h2>
            <HelpTip
              label="Jadwal berulang"
              text="Jadwal dengan interval otomatis ditampilkan kembali pada tanggal berikutnya. Kalender ini tidak menandai pekerjaan selesai; gunakan jurnal aktivitas untuk realisasi."
            />
          </div>
          <p className="mt-1 text-[11px] text-[#6D7771]">Pupuk dan pestisida dalam tampilan bulanan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5D5CE] bg-white text-[#526159] hover:bg-[#F0EFE9]"
            aria-label="Bulan sebelumnya"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
            }}
            className="min-h-9 rounded-lg border border-[#D5D5CE] bg-white px-3 text-xs font-semibold text-[#435148] hover:bg-[#F0EFE9]"
          >
            Hari ini
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5D5CE] bg-white text-[#526159] hover:bg-[#F0EFE9]"
            aria-label="Bulan berikutnya"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-y border-[#E2E0D9] py-2.5">
        <strong className="text-sm capitalize text-[#2A3830]">{monthLabel}</strong>
        <div className="flex items-center gap-3 text-[10px] font-medium text-[#69746D]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3D7457]" /> Pupuk</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#B65B4A]" /> Pestisida</span>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#69746D] sm:hidden">
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">swipe</span>
        Geser ke samping untuk melihat seluruh kalender.
      </p>
      <div className="mt-2 overflow-x-auto sm:mt-3" aria-label="Kalender bulanan, dapat digeser secara horizontal">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 py-1.5 text-center text-[10px] font-semibold text-[#78817B]">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-[#DDDCD5] bg-[#DDDCD5] gap-px">
            {days.map((day) => (
              <div
                key={day.key}
                className={`min-h-[92px] bg-white p-2 ${day.inMonth ? '' : 'bg-[#F6F5F0] text-[#A1A7A2]'}`}
              >
                <time
                  dateTime={day.key}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                    day.key === todayKey ? 'bg-[#24533F] text-white' : ''
                  }`}
                >
                  {day.date.getDate()}
                </time>
                <div className="mt-1 space-y-1">
                  {day.events.slice(0, 2).map((schedule) => {
                    const block = blocks.find((item) => item.id === schedule.blokId);
                    const pesticide = schedule.kategori === 'Pestisida';
                    return (
                      <button
                        key={`${day.key}-${schedule.id}`}
                        type="button"
                        onClick={() => onEdit(schedule)}
                        disabled={readOnly}
                        title={`${schedule.jenisPupuk} · ${block?.nama ?? 'Lahan'}`}
                        className={`block w-full truncate rounded-md border-l-2 px-1.5 py-1 text-left text-[10px] font-semibold disabled:cursor-default ${
                          pesticide
                            ? 'border-[#B65B4A] bg-[#FAEFEC] text-[#7A352B]'
                            : 'border-[#3D7457] bg-[#EDF4EF] text-[#2B5A41]'
                        }`}
                      >
                        {schedule.jenisPupuk}
                      </button>
                    );
                  })}
                  {day.events.length > 2 && (
                    <span className="block px-1 text-[9px] font-medium text-[#737D77]">+{day.events.length - 2} lainnya</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
