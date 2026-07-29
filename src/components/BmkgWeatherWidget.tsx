import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { INDONESIA_REGIONS, BMKGRegion } from '../data/indonesiaRegions';
import {
  BmkgForecast,
  ParsedBmkgWeather,
  getTimeZoneLabel,
  getUpcomingForecasts,
  getWeatherAdvisories,
  getWeatherFreshness,
  getWeatherIcon,
  isValidAdm4Code,
  parseBmkgPayload,
  selectNearestForecast,
} from '../utils/weather';
import { WeatherSkeleton } from './Skeleton';
import { HelpTip } from './HelpTip';

const BMKG_REGIONS = INDONESIA_REGIONS;
const DEFAULT_ADM4 = '73.04.01.1001';
const CACHE_PREFIX = 'tanita_bmkg_v3_';
const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;

export { INDONESIA_REGIONS as BMKG_REGIONS };
export type { BMKGRegion };

interface WeatherState extends ParsedBmkgWeather {
  code: string;
  fetchedAt: string;
  fromCache: boolean;
}

interface CachedWeather {
  payload: unknown;
  fetchedAt: string;
}

const getSavedRegionCode = (): string => {
  try {
    const saved = localStorage.getItem('bmkg_selected_region')?.trim() ?? '';
    return isValidAdm4Code(saved) ? saved : DEFAULT_ADM4;
  } catch {
    return DEFAULT_ADM4;
  }
};

const getCachedWeather = (code: string): WeatherState | null => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${code}`);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Partial<CachedWeather>;
    if (typeof cached.fetchedAt !== 'string') return null;
    const parsed = parseBmkgPayload(cached.payload);
    if (!parsed || parsed.location.adm4 !== code) return null;

    const cacheAge = Date.now() - new Date(cached.fetchedAt).getTime();
    if (!Number.isFinite(cacheAge) || cacheAge > 72 * 60 * 60 * 1000) return null;
    return { ...parsed, code, fetchedAt: cached.fetchedAt, fromCache: true };
  } catch {
    return null;
  }
};

const saveCachedWeather = (code: string, payload: unknown, fetchedAt: string) => {
  try {
    const cached: CachedWeather = { payload, fetchedAt };
    localStorage.setItem(`${CACHE_PREFIX}${code}`, JSON.stringify(cached));
  } catch {
    // Weather still works without a local cache.
  }
};

const formatForecastTime = (forecast: BmkgForecast, timeZone: string): string => {
  const date = new Date(forecast.forecastAt);
  if (Number.isNaN(date.getTime())) return forecast.localDatetime || 'Waktu tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date);
};

const formatDateTime = (value: string, timeZone: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date);
};

const advisoryTone: Record<string, string> = {
  high: 'border-[#B84A3A] bg-[#FFF4F1] text-[#6D241B]',
  medium: 'border-[#C58A3A] bg-[#FFF8E8] text-[#654819]',
  low: 'border-[#9DB3A6] bg-[#F1F6F2] text-[#244536]',
};

export function BmkgWeatherWidget() {
  const [selectedCode, setSelectedCode] = useState(getSavedRegionCode);
  const [customCode, setCustomCode] = useState('');
  const [data, setData] = useState<WeatherState | null>(() =>
    getCachedWeather(getSavedRegionCode()),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedRegion = BMKG_REGIONS.find((region) => region.code === selectedCode);

  const fetchBmkgData = useCallback(async (code: string) => {
    if (!isValidAdm4Code(code)) {
      setError('Kode ADM4 harus mengikuti format 00.00.00.0000.');
      setLoading(false);
      return;
    }

    const cached = getCachedWeather(code);
    if (cached) setData(cached);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(code)}`,
        { signal: controller.signal, cache: 'no-store' },
      );
      if (!response.ok) {
        throw new Error(`BMKG merespons HTTP ${response.status}`);
      }

      const payload: unknown = await response.json();
      const parsed = parseBmkgPayload(payload);
      if (!parsed || parsed.location.adm4 !== code) {
        throw new Error('Struktur data BMKG tidak lengkap untuk kode tersebut');
      }

      const fetchedAt = new Date().toISOString();
      saveCachedWeather(code, payload, fetchedAt);
      setData({ ...parsed, code, fetchedAt, fromCache: false });
    } catch (requestError) {
      if (controller.signal.aborted && abortControllerRef.current !== controller) return;
      const fallback = getCachedWeather(code);
      if (fallback) {
        setData(fallback);
        setError('Koneksi BMKG terganggu. Menampilkan salinan terakhir yang tersimpan.');
      } else {
        setData(null);
        setError(
          controller.signal.aborted
            ? 'Permintaan BMKG melewati batas waktu. Coba muat ulang.'
            : requestError instanceof Error
              ? `${requestError.message}. Periksa kode wilayah atau coba lagi.`
              : 'Data BMKG tidak dapat dimuat saat ini.',
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bmkg_selected_region', selectedCode);
    } catch {
      // The forecast remains usable when browser storage is unavailable.
    }
    void fetchBmkgData(selectedCode);

    const refreshTimer = window.setInterval(
      () => void fetchBmkgData(selectedCode),
      REFRESH_INTERVAL_MS,
    );
    const refreshWhenOnline = () => void fetchBmkgData(selectedCode);
    window.addEventListener('online', refreshWhenOnline);

    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('online', refreshWhenOnline);
      const activeController = abortControllerRef.current;
      abortControllerRef.current = null;
      activeController?.abort();
    };
  }, [fetchBmkgData, selectedCode]);

  const currentForecast = useMemo(
    () => selectNearestForecast(data?.forecasts ?? []),
    [data],
  );
  const timeline = useMemo(
    () => getUpcomingForecasts(data?.forecasts ?? [], new Date(), 6),
    [data],
  );
  const advisories = useMemo(
    () => getWeatherAdvisories(data?.forecasts ?? [], new Date(), data?.analysisAt),
    [data],
  );
  const freshness = getWeatherFreshness(data?.analysisAt ?? null);
  const timeZone = data?.location.timezone ?? 'Asia/Makassar';
  const timeZoneLabel = getTimeZoneLabel(timeZone);
  const forecastCoverage = useMemo(() => {
    if (!data?.forecasts.length) return '—';
    const first = data.forecasts[0];
    const last = data.forecasts[data.forecasts.length - 1];
    if (!first || !last) return '—';
    return `${formatDateTime(first.forecastAt, timeZone)}–${formatDateTime(last.forecastAt, timeZone)} ${timeZoneLabel}`;
  }, [data, timeZone, timeZoneLabel]);
  const rainWindow = useMemo(() => {
    const rainy = timeline.find((forecast) =>
      /hujan|petir/i.test(forecast.description) ||
      (forecast.precipitation !== null && forecast.precipitation > 0),
    );
    return rainy ? `${formatForecastTime(rainy, timeZone)} ${timeZoneLabel}` : null;
  }, [timeline, timeZone, timeZoneLabel]);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('id-ID');
  const filteredRegions = BMKG_REGIONS.filter((region) =>
    !normalizedQuery ||
    region.name.toLocaleLowerCase('id-ID').includes(normalizedQuery) ||
    region.provinsi.toLocaleLowerCase('id-ID').includes(normalizedQuery) ||
    region.code.includes(normalizedQuery),
  ).slice(0, 60);

  const applyCustomCode = () => {
    const normalized = customCode.trim();
    if (!isValidAdm4Code(normalized)) {
      setError('Kode ADM4 harus mengikuti format 00.00.00.0000.');
      return;
    }
    setSelectedCode(normalized);
    setCustomCode('');
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <section
      data-testid="weather-widget"
      className="overflow-visible rounded-[20px] border border-[#D8D5CC] bg-[#FBFAF6] text-[#1C211D] shadow-[0_12px_32px_rgba(28,33,29,0.07)]"
      aria-busy={loading}
    >
      <div className="flex flex-col gap-4 border-b border-[#D8D5CC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A665E]">
            <span className="material-symbols-outlined text-[17px] text-[#24533F]">verified</span>
            Data prakiraan resmi BMKG
            <HelpTip
              label="Prakiraan BMKG"
              text="Ini adalah prakiraan model per tiga jam, bukan pengamatan real-time. Waktu analisis dan waktu pengambilan ditampilkan agar umur data dapat diperiksa."
            />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#69736D]">
            Per 3 jam · horizon 3 hari · bukan pengamatan cuaca real-time
          </p>
        </div>

        <div ref={dropdownRef} className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[#C9C8C0] bg-white px-3.5 text-left text-xs font-semibold text-[#263029] transition hover:border-[#759381] focus:outline-none focus:ring-2 focus:ring-[#759381]/30 sm:w-[300px]"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="min-w-0">
              <span className="block truncate font-bold text-[#1C211D]">
                {data?.location
                  ? `${data.location.desa}, ${data.location.kecamatan}`
                  : selectedRegion?.name ?? `ADM4 ${selectedCode}`}
              </span>
              <span className="block truncate text-[10px] font-medium text-[#737B76]">
                {data?.location.kotkab ?? selectedRegion?.provinsi ?? selectedCode}
              </span>
            </span>
            <span className="material-symbols-outlined text-[19px] text-[#506158]">
              {isDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[430px] w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[#C9C8C0] bg-white p-3 shadow-[0_18px_48px_rgba(28,33,29,0.16)] sm:w-[380px]">
              <label className="relative block">
                <span className="sr-only">Cari titik referensi wilayah</span>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#7B837E]">
                  search
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari kabupaten, provinsi, atau kode"
                  className="w-full rounded-xl border border-[#D8D5CC] bg-[#F7F6F1] py-2.5 pl-9 pr-3 text-xs font-medium outline-none focus:border-[#759381]"
                  autoFocus
                />
              </label>

              <div className="max-h-56 overflow-y-auto pr-1" role="listbox">
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => {
                    const isSelected = region.code === selectedCode;
                    return (
                      <button
                        key={region.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedCode(region.code);
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className={`mb-1 flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                          isSelected
                            ? 'border-[#759381] bg-[#EDF3EE]'
                            : 'border-transparent hover:border-[#E1E0D9] hover:bg-[#F7F6F1]'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-[#1C211D]">
                            {region.name}
                          </span>
                          <span className="block truncate text-[10px] text-[#737B76]">
                            {region.provinsi} · {region.code}
                          </span>
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px] text-[#24533F]">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-3 py-5 text-center text-xs text-[#737B76]">
                    Titik referensi tidak ditemukan.
                  </p>
                )}
              </div>

              <div className="border-t border-[#E1E0D9] pt-3">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#657068]">
                  Kode desa/kelurahan (ADM4)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customCode}
                    onChange={(event) => setCustomCode(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        applyCustomCode();
                      }
                    }}
                    placeholder="73.04.01.1001"
                    className="min-w-0 flex-1 rounded-lg border border-[#D8D5CC] px-3 py-2 text-xs font-mono outline-none focus:border-[#759381]"
                  />
                  <button
                    type="button"
                    onClick={applyCustomCode}
                    className="rounded-lg bg-[#24533F] px-4 text-xs font-bold text-white transition hover:bg-[#183C2D]"
                  >
                    Terapkan
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#7A817C]">
                  Nama yang tampil setelah dimuat selalu mengikuti lokasi persis dari respons BMKG.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && !data && <WeatherSkeleton />}

      <div className={`${loading && !data ? 'hidden' : 'grid'} gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]`}>
        <div className="rounded-2xl bg-[#173F35] p-5 text-white sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-[#214D41]">
                <span className="material-symbols-outlined text-[34px] text-[#E7C987]">
                  {currentForecast ? getWeatherIcon(currentForecast.description) : 'cloud_off'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                  Slot prakiraan terdekat
                </p>
                <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <strong className="font-display text-4xl font-semibold tracking-[-0.04em]">
                    {currentForecast?.temperature != null
                      ? `${currentForecast.temperature}°`
                      : '—'}
                  </strong>
                  <span className="pb-1 text-sm font-semibold text-[#F4E8C9]">
                    {currentForecast?.description ?? (loading ? 'Memuat prakiraan…' : 'Tidak tersedia')}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-white/70">
                  {data?.location
                    ? `${data.location.desa} · ${data.location.kecamatan} · ${data.location.kotkab}`
                    : selectedRegion?.name ?? selectedCode}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void fetchBmkgData(selectedCode)}
              disabled={loading}
              className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/25 px-3 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[17px] ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              {loading ? 'Memperbarui' : 'Perbarui'}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 sm:grid-cols-4">
            {[
              ['humidity_percentage', 'Kelembapan', currentForecast?.humidity != null ? `${currentForecast.humidity}%` : '—'],
              ['air', 'Angin', currentForecast?.windSpeed != null ? `${currentForecast.windSpeed.toFixed(1)} km/j` : '—'],
              ['rainy', 'Curah hujan', currentForecast?.precipitation != null ? `${currentForecast.precipitation.toFixed(1)} mm` : '—'],
              ['filter_drama', 'Tutupan awan', currentForecast?.cloudCover != null ? `${currentForecast.cloudCover}%` : '—'],
            ].map(([icon, label, value]) => (
              <div key={label} className="bg-[#173F35] p-3">
                <span className="material-symbols-outlined text-[17px] text-[#D8C28E]">{icon}</span>
                <span className="mt-2 block text-[10px] font-medium text-white/60">{label}</span>
                <strong className="mt-0.5 block text-xs font-bold text-white">{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/65">
            <span>
              Slot: {currentForecast ? formatForecastTime(currentForecast, timeZone) : '—'} {timeZoneLabel}
            </span>
            <span>
              Arah angin: {currentForecast?.windDirection ?? '—'}
            </span>
            <span>
              Jarak pandang: {currentForecast?.visibilityText ?? '—'}
            </span>
          </div>
        </div>

        <aside className="rounded-2xl border border-[#D8D5CC] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6A746E]">
                Kualitas data
              </p>
              <h3 className="mt-1 text-base font-bold text-[#1C211D]">
                {freshness.isStale ? 'Perlu diperbarui' : 'Data masih relevan'}
              </h3>
            </div>
            <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${freshness.isStale ? 'bg-[#B84A3A]' : 'bg-[#3D7457]'}`} />
          </div>

          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between gap-3 border-b border-[#ECEAE3] pb-2">
              <dt className="text-[#737B76]">Analisis model</dt>
              <dd className="text-right font-semibold text-[#263029]">
                {data?.analysisAt ? `${formatDateTime(data.analysisAt, timeZone)} ${timeZoneLabel}` : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[#ECEAE3] pb-2">
              <dt className="text-[#737B76]">Diambil aplikasi</dt>
              <dd className="text-right font-semibold text-[#263029]">
                {data?.fetchedAt ? `${formatDateTime(data.fetchedAt, timeZone)} ${timeZoneLabel}` : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[#ECEAE3] pb-2">
              <dt className="text-[#737B76]">Status</dt>
              <dd className="text-right font-semibold text-[#263029]">
                {data?.fromCache ? 'Salinan tersimpan' : freshness.label}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[#ECEAE3] pb-2">
              <dt className="text-[#737B76]">Cakupan prakiraan</dt>
              <dd className="max-w-[190px] text-right font-semibold leading-relaxed text-[#263029]">
                {forecastCoverage}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#737B76]">Koordinat BMKG</dt>
              <dd className="text-right font-mono text-[10px] font-semibold text-[#263029]">
                {data?.location.lat != null && data.location.lon != null
                  ? `${data.location.lat.toFixed(4)}, ${data.location.lon.toFixed(4)}`
                  : '—'}
              </dd>
            </div>
          </dl>

          <a
            href="https://data.bmkg.go.id/prakiraan-cuaca/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-[#24533F] underline decoration-[#A9BBAF] underline-offset-4"
          >
            Metodologi dan sumber BMKG
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </aside>
      </div>

      {timeline.length > 0 && (
        <div className="border-t border-[#D8D5CC] px-4 py-4 sm:px-6">
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#1C211D]">18 jam ke depan</h3>
              <p className="mt-0.5 text-[10px] text-[#737B76]">
                Geser mendatar untuk melihat enam slot · {rainWindow ? `hujan terdekat ${rainWindow}` : 'belum ada sinyal hujan pada slot ini'}
              </p>
            </div>
            <span className="text-[10px] font-semibold text-[#737B76]">{timeZoneLabel}</span>
          </div>
          <div className="hide-scrollbar flex snap-x gap-2 overflow-x-auto pb-1">
            {timeline.map((forecast) => (
              <article
                key={forecast.forecastAt}
                className="min-w-[148px] snap-start rounded-xl border border-[#DEDCD4] bg-white px-3 py-2.5 sm:min-w-[168px] xl:min-w-0 xl:flex-1"
              >
                <time className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F7872]">
                  {formatForecastTime(forecast, timeZone)}
                </time>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="material-symbols-outlined text-[22px] text-[#24533F]">
                    {getWeatherIcon(forecast.description)}
                  </span>
                  <strong className="text-lg font-semibold text-[#1C211D]">
                    {forecast.temperature !== null ? `${forecast.temperature}°` : '—'}
                  </strong>
                </div>
                <p className="mt-1.5 truncate text-[10px] font-semibold leading-4 text-[#4F5B54]" title={forecast.description}>
                  {forecast.description}
                </p>
                <p className="mt-1 text-[9px] text-[#7A817C]">
                  Hujan {forecast.precipitation !== null ? `${forecast.precipitation.toFixed(1)} mm` : '—'}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {!loading && advisories.length > 0 && (
        <div className="border-t border-[#D8D5CC] px-4 py-5 sm:px-6">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#1C211D]">Catatan keputusan lapangan</h3>
            <p className="mt-0.5 text-[10px] leading-relaxed text-[#737B76]">
              Interpretasi TANITA dari slot 6 jam ke depan{rainWindow ? `; hujan terdekat ${rainWindow}` : ''}. Konfirmasi dengan kondisi lahan dan label produk.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {advisories.map((advisory) => (
              <article
                key={advisory.title}
                className={`flex gap-3 rounded-xl border-l-4 p-3.5 ${advisoryTone[advisory.level]}`}
              >
                <span className="material-symbols-outlined mt-0.5 text-[20px]">{advisory.icon}</span>
                <div>
                  <h4 className="text-xs font-bold">{advisory.title}</h4>
                  <p className="mt-1 text-[10px] font-medium leading-relaxed opacity-85">
                    {advisory.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="border-t border-[#E7C6BE] bg-[#FFF6F3] px-4 py-3 text-xs font-medium text-[#7B2F24] sm:px-6">
          <span className="inline-flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px]">info</span>
            {error}
          </span>
        </div>
      )}
    </section>
  );
}
