export interface BmkgLocation {
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number | null;
  lat: number | null;
  timezone: string;
}

export interface BmkgForecast {
  forecastAt: string;
  localDatetime: string;
  analysisAt: string | null;
  description: string;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: string;
  windDirectionDegrees: number | null;
  cloudCover: number | null;
  precipitation: number | null;
  visibilityText: string;
}

export interface ParsedBmkgWeather {
  location: BmkgLocation;
  forecasts: BmkgForecast[];
  analysisAt: string | null;
}

export interface WeatherFreshness {
  ageHours: number | null;
  isStale: boolean;
  label: string;
}

export interface WeatherAdvisory {
  level: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  icon: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const asText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback;

const asNumberInRange = (
  value: unknown,
  minimum: number,
  maximum: number,
): number | null => {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) && numberValue >= minimum && numberValue <= maximum
    ? numberValue
    : null;
};

const parseUtcDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  const normalized = trimmed.includes('T')
    ? trimmed
    : trimmed.replace(' ', 'T');
  const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)
    ? normalized
    : `${normalized}Z`;
  const parsed = new Date(withZone);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeTimeZone = (value: unknown): string => {
  const candidate = asText(value);
  try {
    if (candidate) {
      new Intl.DateTimeFormat('id-ID', { timeZone: candidate }).format(new Date());
      return candidate;
    }
  } catch {
    // Continue to the safe Indonesian default below.
  }
  return 'Asia/Jakarta';
};

export const isValidAdm4Code = (value: string): boolean =>
  /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(value.trim());

const forecastCompleteness = (forecast: BmkgForecast): number =>
  [
    forecast.localDatetime,
    forecast.analysisAt,
    forecast.description !== 'Data kondisi tidak tersedia' ? forecast.description : '',
    forecast.temperature,
    forecast.humidity,
    forecast.windSpeed,
    forecast.cloudCover,
    forecast.precipitation,
  ].filter((value) => value !== null && value !== '').length;

export function parseBmkgPayload(payload: unknown): ParsedBmkgWeather | null {
  if (!isRecord(payload) || !isRecord(payload.lokasi) || !Array.isArray(payload.data)) {
    return null;
  }

  const locationPayload = payload.lokasi;
  const adm4 = asText(locationPayload.adm4);
  if (!isValidAdm4Code(adm4)) return null;

  const location: BmkgLocation = {
    adm4,
    provinsi: asText(locationPayload.provinsi, 'Provinsi tidak tersedia'),
    kotkab: asText(locationPayload.kotkab, 'Kabupaten/kota tidak tersedia'),
    kecamatan: asText(locationPayload.kecamatan, 'Kecamatan tidak tersedia'),
    desa: asText(locationPayload.desa, 'Desa/kelurahan tidak tersedia'),
    lon: asNumberInRange(locationPayload.lon, -180, 180),
    lat: asNumberInRange(locationPayload.lat, -90, 90),
    timezone: normalizeTimeZone(locationPayload.timezone),
  };

  const rawForecasts = payload.data.flatMap((dataItem) => {
    if (!isRecord(dataItem) || !Array.isArray(dataItem.cuaca)) return [];
    return dataItem.cuaca.flat(Infinity);
  });

  const forecastByTime = new Map<number, BmkgForecast>();
  for (const rawEntry of rawForecasts) {
    if (!isRecord(rawEntry)) continue;
    const forecastDate =
      parseUtcDate(rawEntry.utc_datetime) ??
      parseUtcDate(rawEntry.datetime);
    if (!forecastDate) continue;

    const analysisDate = parseUtcDate(rawEntry.analysis_date);
    const description = asText(rawEntry.weather_desc, 'Data kondisi tidak tersedia');
    const forecast: BmkgForecast = {
      forecastAt: forecastDate.toISOString(),
      localDatetime: asText(rawEntry.local_datetime),
      analysisAt: analysisDate?.toISOString() ?? null,
      description,
      temperature: asNumberInRange(rawEntry.t, -20, 60),
      humidity: asNumberInRange(rawEntry.hu, 0, 100),
      windSpeed: asNumberInRange(rawEntry.ws, 0, 400),
      windDirection: asText(rawEntry.wd, '—').slice(0, 8),
      windDirectionDegrees: asNumberInRange(rawEntry.wd_deg, 0, 360),
      cloudCover: asNumberInRange(rawEntry.tcc, 0, 100),
      precipitation: asNumberInRange(rawEntry.tp, 0, 1000),
      visibilityText: asText(rawEntry.vs_text, '—').slice(0, 32),
    };
    const forecastTime = forecastDate.getTime();
    const existingForecast = forecastByTime.get(forecastTime);
    if (
      !existingForecast ||
      forecastCompleteness(forecast) > forecastCompleteness(existingForecast)
    ) {
      forecastByTime.set(forecastTime, forecast);
    }
  }

  const forecasts = [...forecastByTime.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, forecast]) => forecast);
  if (forecasts.length === 0) return null;

  const analysisTimes = forecasts
    .map((forecast) => forecast.analysisAt)
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  return {
    location,
    forecasts,
    analysisAt: analysisTimes.length > 0
      ? new Date(Math.max(...analysisTimes)).toISOString()
      : null,
  };
}

export function selectNearestForecast(
  forecasts: BmkgForecast[],
  now = new Date(),
): BmkgForecast | null {
  if (forecasts.length === 0) return null;
  const nowTime = now.getTime();
  if (!Number.isFinite(nowTime)) return null;

  return forecasts
    .filter((forecast) => Number.isFinite(new Date(forecast.forecastAt).getTime()))
    .sort((left, right) => {
      const leftTime = new Date(left.forecastAt).getTime();
      const rightTime = new Date(right.forecastAt).getTime();
      const distanceDifference =
        Math.abs(leftTime - nowTime) - Math.abs(rightTime - nowTime);
      if (distanceDifference !== 0) return distanceDifference;
      return rightTime - leftTime;
    })[0] ?? null;
}

export function getUpcomingForecasts(
  forecasts: BmkgForecast[],
  now = new Date(),
  limit = 6,
): BmkgForecast[] {
  const cutoff = now.getTime() - 90 * 60 * 1000;
  return forecasts
    .filter((forecast) => {
      const forecastTime = new Date(forecast.forecastAt).getTime();
      return Number.isFinite(forecastTime) && forecastTime >= cutoff;
    })
    .sort(
      (left, right) =>
        new Date(left.forecastAt).getTime() - new Date(right.forecastAt).getTime(),
    )
    .slice(0, Math.max(0, limit));
}

export function getWeatherFreshness(
  analysisAt: string | null,
  now = new Date(),
): WeatherFreshness {
  if (!analysisAt) {
    return { ageHours: null, isStale: true, label: 'Waktu analisis tidak tersedia' };
  }

  const analysisTime = new Date(analysisAt).getTime();
  if (!Number.isFinite(analysisTime)) {
    return { ageHours: null, isStale: true, label: 'Waktu analisis tidak valid' };
  }

  const rawAgeHours = (now.getTime() - analysisTime) / 3_600_000;
  if (rawAgeHours < -1) {
    return {
      ageHours: rawAgeHours,
      isStale: true,
      label: 'Waktu analisis berada di masa depan',
    };
  }
  const ageHours = Math.max(0, rawAgeHours);
  if (ageHours > 18) {
    return {
      ageHours,
      isStale: true,
      label: `Data lama · ${Math.round(ageHours)} jam sejak analisis`,
    };
  }
  return {
    ageHours,
    isStale: false,
    label: `Analisis ${Math.max(1, Math.round(ageHours))} jam lalu`,
  };
}

export function getWeatherAdvisories(
  forecasts: BmkgForecast[],
  now = new Date(),
): WeatherAdvisory[] {
  if (forecasts.length === 0) {
    return [{
      level: 'medium',
      title: 'Prakiraan belum tersedia',
      message: 'Jangan gunakan panel cuaca sebagai dasar kerja sampai data BMKG berhasil dimuat.',
      icon: 'cloud_off',
    }];
  }

  const windowEnd = now.getTime() + 6 * 60 * 60 * 1000;
  const relevant = forecasts.filter((forecast) => {
    const forecastTime = new Date(forecast.forecastAt).getTime();
    return forecastTime >= now.getTime() - 90 * 60 * 1000 && forecastTime <= windowEnd;
  });
  const windowForecasts = relevant.length > 0 ? relevant : forecasts.slice(0, 2);

  const hasRain = windowForecasts.some((forecast) =>
    /hujan|petir/i.test(forecast.description) ||
    (forecast.precipitation !== null && forecast.precipitation > 0),
  );
  const maximumWind = Math.max(
    0,
    ...windowForecasts.map((forecast) => forecast.windSpeed ?? 0),
  );
  const maximumHumidity = Math.max(
    0,
    ...windowForecasts.map((forecast) => forecast.humidity ?? 0),
  );
  const maximumTemperature = Math.max(
    -Infinity,
    ...windowForecasts.map((forecast) => forecast.temperature ?? -Infinity),
  );

  const advisories: WeatherAdvisory[] = [];
  if (hasRain) {
    advisories.push({
      level: 'high',
      title: 'Jendela semprot berisiko',
      message: 'Ada hujan pada slot 6 jam ke depan. Tunda aplikasi daun dan periksa drainase sebelum bekerja.',
      icon: 'rainy',
    });
  } else if (maximumWind >= 15) {
    advisories.push({
      level: 'medium',
      title: 'Periksa angin sebelum menyemprot',
      message: `Angin prakiraan mencapai ${maximumWind.toFixed(1)} km/jam. Verifikasi kondisi di lahan untuk mengurangi drift.`,
      icon: 'air',
    });
  } else {
    advisories.push({
      level: 'low',
      title: 'Jendela kerja relatif mendukung',
      message: 'Tidak ada sinyal hujan atau angin kencang pada slot terdekat. Tetap ikuti label produk dan cek kondisi lahan.',
      icon: 'check_circle',
    });
  }

  if (hasRain || maximumHumidity >= 85) {
    advisories.push({
      level: 'medium',
      title: 'Pantau kelembapan kanopi',
      message: 'Kelembapan tinggi atau hujan dapat memperpanjang kebasahan daun. Prioritaskan inspeksi gejala penyakit.',
      icon: 'humidity_high',
    });
  } else if (maximumTemperature >= 33) {
    advisories.push({
      level: 'medium',
      title: 'Cek kebutuhan air',
      message: 'Suhu prakiraan tinggi. Periksa kelembapan tanah pada pagi hari sebelum menambah volume irigasi.',
      icon: 'thermostat',
    });
  } else {
    advisories.push({
      level: 'low',
      title: 'Irigasi berbasis kondisi tanah',
      message: 'Prakiraan cuaca bukan pengganti sensor tanah. Periksa kelembapan media sebelum menyiram.',
      icon: 'water_drop',
    });
  }

  return advisories;
}

export function getWeatherIcon(description: string): string {
  const normalized = description.toLowerCase();
  if (normalized.includes('petir')) return 'thunderstorm';
  if (normalized.includes('hujan')) return 'rainy';
  if (normalized.includes('kabut')) return 'foggy';
  if (normalized.includes('berawan')) return 'cloud';
  if (normalized.includes('cerah')) return 'clear_day';
  return 'partly_cloudy_day';
}

export function getTimeZoneLabel(timeZone: string): string {
  if (timeZone === 'Asia/Jayapura') return 'WIT';
  if (timeZone === 'Asia/Makassar') return 'WITA';
  if (timeZone === 'Asia/Jakarta') return 'WIB';
  return timeZone;
}
