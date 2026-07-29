import { useEffect, useState } from 'react';
import { IS_DEMO_MODE } from '../config/runtime';

const UPDATE_READY_KEY = 'tanita_pwa_update_ready';

export function PwaUpdatePrompt() {
  const [updateReady, setUpdateReady] = useState(() => {
    try {
      return sessionStorage.getItem(UPDATE_READY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleUpdateReady = () => setUpdateReady(true);
    window.addEventListener('tanita-pwa-update-ready', handleUpdateReady);
    return () => window.removeEventListener('tanita-pwa-update-ready', handleUpdateReady);
  }, []);

  if (!updateReady) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 z-[10000] mx-auto max-w-md rounded-2xl border border-[#C8C5BC] bg-[#FBFAF6] p-4 text-[#1B2721] shadow-[0_18px_55px_rgba(20,31,25,0.22)] md:bottom-5"
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined mt-0.5 text-[21px] text-[#24533F]" aria-hidden="true">
          system_update
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">Pembaruan TANITA tersedia</h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#69716B]">
            {IS_DEMO_MODE
              ? 'Muat ulang untuk menggunakan versi terbaru ruang demo.'
              : 'Simpan formulir yang sedang dikerjakan sebelum memuat versi baru.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem(UPDATE_READY_KEY);
                } catch {
                  // The update can still proceed without session storage.
                }
                window.dispatchEvent(new Event('tanita-apply-pwa-update'));
              }}
              className="min-h-9 rounded-lg bg-[#24533F] px-3 text-xs font-bold text-white transition hover:bg-[#1B4031]"
            >
              Muat versi baru
            </button>
            <button
              type="button"
              onClick={() => setUpdateReady(false)}
              className="min-h-9 rounded-lg border border-[#BFC4BE] bg-white px-3 text-xs font-bold text-[#34423A] transition hover:bg-[#F1F0EA]"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
