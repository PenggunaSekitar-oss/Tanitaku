import { useEffect, useMemo, useState } from 'react';

type SyncState = 'saved' | 'saving' | 'offline' | 'error';

const getInitialState = (): { state: SyncState; savedAt: string | null } => {
  const online = typeof navigator === 'undefined' ? true : navigator.onLine;
  let savedAt: string | null = null;
  try {
    savedAt = localStorage.getItem('tanita_last_saved_at');
  } catch {
    // The status remains useful even when browser storage is unavailable.
  }
  return { state: online ? 'saved' : 'offline', savedAt };
};

const formatRelativeTime = (value: string | null, now: number): string => {
  if (!value) return 'Siap menyimpan';
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return 'Tersimpan';
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 15) return 'Baru tersimpan';
  if (seconds < 60) return `Tersimpan ${seconds} dtk lalu`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Tersimpan ${minutes} mnt lalu`;
  return `Tersimpan ${Math.round(minutes / 60)} jam lalu`;
};

export function SyncStatus() {
  const initial = useMemo(getInitialState, []);
  const [state, setState] = useState<SyncState>(initial.state);
  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const onOnline = () => setState('saved');
    const onOffline = () => setState('offline');
    const onSaving = () => setState(navigator.onLine ? 'saving' : 'offline');
    const onSaved = (event: Event) => {
      const detail = (event as CustomEvent<{ savedAt?: string }>).detail;
      setSavedAt(detail?.savedAt ?? new Date().toISOString());
      setState(navigator.onLine ? 'saved' : 'offline');
    };
    const onError = () => setState('error');

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('taniops-storage-saving', onSaving);
    window.addEventListener('taniops-storage-saved', onSaved);
    window.addEventListener('taniops-storage-error', onError);
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('taniops-storage-saving', onSaving);
      window.removeEventListener('taniops-storage-saved', onSaved);
      window.removeEventListener('taniops-storage-error', onError);
      window.clearInterval(timer);
    };
  }, []);

  const copy = {
    saved: formatRelativeTime(savedAt, now),
    saving: 'Menyimpan…',
    offline: 'Offline · tersimpan di perangkat',
    error: 'Perubahan belum tersimpan',
  }[state];

  const dotClass = {
    saved: 'bg-[#3D7457]',
    saving: 'bg-[#C28A37]',
    offline: 'bg-[#7A837D]',
    error: 'bg-[#B84A3A]',
  }[state];

  return (
    <div
      className="hidden min-h-9 items-center gap-2 rounded-lg border border-[#DDDAD2] bg-[#F7F6F1] px-3 text-[11px] font-medium text-[#616C65] sm:flex"
      role="status"
      aria-live="polite"
      title={savedAt ? `Penyimpanan terakhir: ${new Date(savedAt).toLocaleString('id-ID')}` : copy}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
      <span className="whitespace-nowrap">{copy}</span>
    </div>
  );
}
