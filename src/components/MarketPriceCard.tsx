import { useEffect, useState } from 'react';
import { MarketCatalog, MarketMetadata } from '../data/marketMetadata';
import {
  readMarketPrice,
  removeMarketPrice,
  saveMarketPrice,
} from '../utils/marketPrice';
import { formatLocalDate } from '../utils/localDate';
import { IS_DEMO_MODE } from '../config/runtime';

interface MarketPriceCardProps {
  catalog: MarketCatalog;
  itemId: string;
  metadata: MarketMetadata;
  subsidizedPrice?: string;
}

const today = () => formatLocalDate(new Date());

export function MarketPriceCard({
  catalog,
  itemId,
  metadata,
  subsidizedPrice,
}: MarketPriceCardProps) {
  const [current, setCurrent] = useState(() => readMarketPrice(catalog, itemId, metadata));
  const [editing, setEditing] = useState(false);
  const [draftPrice, setDraftPrice] = useState(current.price);
  const [draftRegion, setDraftRegion] = useState(current.region);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const next = readMarketPrice(catalog, itemId, metadata);
    setCurrent(next);
    setDraftPrice(next.price);
    setDraftRegion(next.region);
    setEditing(false);
    setFeedback(null);
  }, [catalog, itemId]);

  const handleSave = () => {
    if (!draftPrice.trim() || !draftRegion.trim()) return;
    const override = {
      price: draftPrice,
      region: draftRegion,
      observedAt: today(),
    };
    if (saveMarketPrice(catalog, itemId, override)) {
      setCurrent({ ...metadata, ...override, source: 'Catatan pengguna' });
      setEditing(false);
      setFeedback({ tone: 'success', message: 'Harga lokal berhasil disimpan di perangkat ini.' });
      return;
    }
    setFeedback({
      tone: 'error',
      message: 'Harga belum tersimpan. Periksa izin penyimpanan browser lalu coba lagi.',
    });
  };

  const handleReset = () => {
    if (!removeMarketPrice(catalog, itemId)) {
      setFeedback({
        tone: 'error',
        message: 'Catatan belum dapat dihapus. Periksa izin penyimpanan browser.',
      });
      return;
    }
    setCurrent(metadata);
    setDraftPrice(metadata.price);
    setDraftRegion(metadata.region);
    setEditing(false);
    setFeedback({ tone: 'success', message: 'Catatan harga lokal telah dihapus.' });
  };

  return (
    <div className="rounded-xl border border-[#C9C6BC] bg-[#F5F3EC] p-3 text-[#26352D]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#5C675F]">
            Kisaran harga · bukan indikator keamanan
          </p>
          <p className="mt-1 text-sm font-extrabold leading-snug">{current.price}</p>
        </div>
        <span className="rounded-full border border-[#A9B4AC] bg-white px-2 py-1 text-[10px] font-bold text-[#365444]">
          Indikasi: {current.availability}
        </span>
      </div>

      <div className="mt-2 grid gap-1 text-[11px] text-[#59635D] sm:grid-cols-2">
        <span>Wilayah: <b className="text-[#35453C]">{current.region}</b></span>
        <span>Kemasan umum: <b className="text-[#35453C]">{current.commonPack}</b></span>
        <span>Diperbarui: <b className="text-[#35453C]">{current.observedAt}</b></span>
        <span>Kanal: <b className="text-[#35453C]">{current.channels.join(' · ')}</b></span>
      </div>
      {current.source === 'Estimasi katalog' && (
        <p className="mt-2 rounded-lg border border-[#D8D5CC] bg-white p-2 text-[10px] leading-relaxed text-[#69716B]">
          Ketersediaan dan harga adalah referensi statis, bukan stok marketplace real-time. Periksa toko atau marketplace sebelum membeli.
        </p>
      )}

      {subsidizedPrice && (
        <p className="mt-2 border-t border-[#D8D5CC] pt-2 text-[11px] text-[#59635D]">
          Referensi harga subsidi: <b className="text-[#35453C]">{subsidizedPrice}</b>. Ketersediaan mengikuti ketentuan penyaluran setempat.
        </p>
      )}

      {!IS_DEMO_MODE && (editing ? (
        <div className="mt-3 grid gap-2 border-t border-[#D8D5CC] pt-3">
          <label className="text-[11px] font-bold text-[#45534B]">
            Harga/kemasan di lokasi Anda
            <input
              value={draftPrice}
              onChange={(event) => setDraftPrice(event.target.value)}
              className="mt-1 min-h-10 w-full rounded-lg border border-[#A9A69E] bg-white px-3 text-sm font-medium outline-none focus:border-[#24533F]"
              placeholder="Contoh: Rp 50.000 / 500 g"
            />
          </label>
          <label className="text-[11px] font-bold text-[#45534B]">
            Wilayah atau nama toko
            <input
              value={draftRegion}
              onChange={(event) => setDraftRegion(event.target.value)}
              className="mt-1 min-h-10 w-full rounded-lg border border-[#A9A69E] bg-white px-3 text-sm font-medium outline-none focus:border-[#24533F]"
              placeholder="Contoh: Denpasar · toko tani setempat"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!draftPrice.trim() || !draftRegion.trim()}
              className="min-h-9 rounded-lg bg-[#24533F] px-3 text-xs font-bold text-white disabled:opacity-40"
            >
              Simpan harga lokal
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-9 rounded-lg border border-[#A9A69E] bg-white px-3 text-xs font-bold"
            >
              Batal
            </button>
            {current.source === 'Catatan pengguna' && (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-9 rounded-lg px-3 text-xs font-bold text-[#9A382F]"
              >
                Hapus catatan
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setFeedback(null);
            setEditing(true);
          }}
          className="mt-3 min-h-9 rounded-lg border border-[#9FA9A2] bg-white px-3 text-xs font-bold text-[#24533F] hover:bg-[#EEF1ED]"
        >
          Perbarui harga lokal
        </button>
      ))}
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-2 flex items-start gap-1.5 text-[11px] font-semibold ${
            feedback.tone === 'success' ? 'text-[#24533F]' : 'text-[#9A382F]'
          }`}
        >
          <span className="material-symbols-outlined mt-px text-[15px]" aria-hidden="true">
            {feedback.tone === 'success' ? 'check_circle' : 'error'}
          </span>
          {feedback.message}
        </p>
      )}
    </div>
  );
}
