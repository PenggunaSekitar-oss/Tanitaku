import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { IS_DEMO_MODE } from '../config/runtime';
import { createDemoOperationalData } from '../data/demoOperationalData';
import { useToast } from './ToastContext';

export type BlokLahan = { 
  id: string; 
  nama: string; 
  jumlahBedengan: number; 
  panjangBedengan: number; 
  lebarBedengan: number; 
  jarakAntarBedengan: number; 
  catatan: string; 
  tipeInput?: 'bedengan' | 'are' | 'hektar';
  luasManualM2?: number;
  luasAre?: number;
  luasHektar?: number;
  efisiensiLahan?: number;
};
export type Tanaman = { 
  id: string; 
  blokId: string; 
  komoditas: string; 
  varietas: string; 
  tanggalTanam: string; 
  metodeTanam: string; 
  barisTanaman: number;
  jarakTanam: number;
  jarakBaris: number;
  jumlahTanaman: number;
  catatan: string;
  status?: 'Aktif' | 'Panen';
};
export type LogAktivitas = {
  id: string;
  tanggal: string;
  blokId: string;
  kategori: string;
  deskripsi: string;
  biaya: number;
  petugas: string;
  biayaSudahDiKeuangan?: boolean;
};
export type Pemupukan = {
  id: string;
  blokId: string;
  kategori: string;
  jenisPupuk: string;
  metodeAplikasi: string;
  satuanDosis: string;
  tujuan: string;
  dosisPerHektar: number;
  literAirPerHektar?: number;
  inputBasis?: 'blok' | 'bedengan' | 'hektar';
  dosisInput?: number;
  airInput?: number;
  tanggalAplikasi: string;
  intervalHari: number;
  catatan: string;
  completedDates?: string[];
};
export type Keuangan = { 
  id: string; 
  blokId: string; 
  tanamanId?: string;
  transactionDate?: string;
  biayaTetap: number; 
  namaBenih?: string; 
  jumlahBenih?: number; 
  satuanBenih?: string; 
  hargaBenih?: number; 
  tanggalPembelianBenih?: string; 
  biayaBenih: number; 
  namaPupuk?: string;
  jumlahPupuk?: number;
  satuanPupuk?: string;
  hargaPupuk?: number;
  tanggalPembelianPupuk?: string;
  biayaPupuk: number; 
  namaPestisida?: string;
  jumlahPestisida?: number;
  satuanPestisida?: string;
  hargaPestisida?: number;
  tanggalPembelianPestisida?: string;
  biayaPestisida: number; 
  biayaLain: number; 
  targetHasil: number; 
  satuanHasil?: string; 
  hargaJual: number;
  komoditas?: string;
};

interface State {
  blokLahan: BlokLahan[];
  tanaman: Tanaman[];
  logAktivitas: LogAktivitas[];
  pemupukan: Pemupukan[];
  keuangan: Keuangan[];
}

export interface RestoreResult {
  success: boolean;
  message: string;
}

interface TaniOpsContextType extends State {
  isReadOnly: boolean;
  addBlokLahan: (b: Omit<BlokLahan, 'id'>) => void;
  updateBlokLahan: (id: string, b: Omit<Partial<BlokLahan>, 'id'>) => void;
  deleteBlokLahan: (id: string) => void;
  addTanaman: (t: Omit<Tanaman, 'id'>) => void;
  updateTanaman: (id: string, t: Omit<Partial<Tanaman>, 'id'>) => void;
  deleteTanaman: (id: string) => void;
  addLogAktivitas: (l: Omit<LogAktivitas, 'id'>) => void;
  updateLogAktivitas: (id: string, l: Omit<Partial<LogAktivitas>, 'id'>) => void;
  deleteLogAktivitas: (id: string) => void;
  addPemupukan: (p: Omit<Pemupukan, 'id'>) => void;
  updatePemupukan: (id: string, p: Omit<Partial<Pemupukan>, 'id'>) => void;
  deletePemupukan: (id: string) => void;
  addKeuangan: (k: Omit<Keuangan, 'id'>) => void;
  updateKeuangan: (id: string, k: Omit<Partial<Keuangan>, 'id'>) => void;
  deleteKeuangan: (id: string) => void;
  clearAllData: () => void;
  loadDemoData: () => void;
  createBackup: () => string;
  restoreBackup: (payload: string) => RestoreResult;
}

const TaniOpsContext = createContext<TaniOpsContextType | undefined>(undefined);
const DEMO_DATA = createDemoOperationalData();

const DEFAULT_BLOK_LAHAN: BlokLahan[] = [];
const DEFAULT_TANAMAN: Tanaman[] = [];
const DEFAULT_LOG: LogAktivitas[] = [];
const DEFAULT_PEMUPUKAN: Pemupukan[] = [];
const DEFAULT_KEUANGAN: Keuangan[] = [];
const BACKUP_PREFERENCE_KEYS = [
  'tanita_farm_name',
  'tanita_manager_name',
  'tanita_notify_crop_status',
  'tanita_notify_fertilizer',
  'bmkg_selected_region',
  'tanita_market_price_overrides_v1',
  'tanita_notifications_history',
  'tanita_history_bibit',
  'tanita_history_pupuk',
  'tanita_history_pestisida',
  'tanita_history_penyakit',
] as const;

export function TaniOpsProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const backupInvalidPayload = (key: string, payload: string) => {
    try {
      localStorage.setItem(`taniops_recovery_${key}_${Date.now()}`, payload);
    } catch (error) {
      console.error(`Gagal mencadangkan data rusak untuk ${key}`, error);
    }
  };

  const safeGetArray = <T,>(
    key: string,
    normalize: (item: unknown) => T | null,
  ): T[] => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(key);
      if (!saved) return [];
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        backupInvalidPayload(key, saved);
        return [];
      }

      const validItems = parsed
        .map(normalize)
        .filter((item): item is T => item !== null);
      if (validItems.length !== parsed.length) backupInvalidPayload(key, saved);
      return validItems;
    } catch (error) {
      if (saved) backupInvalidPayload(key, saved);
      console.error(`Gagal membaca ${key} dari penyimpanan browser`, error);
      return [];
    }
  };

  const safeSetItem = (key: string, value: unknown): boolean => {
    try {
      window.dispatchEvent(new CustomEvent('taniops-storage-saving', { detail: { key } }));
      localStorage.setItem(key, JSON.stringify(value));
      const savedAt = new Date().toISOString();
      localStorage.setItem('tanita_last_saved_at', savedAt);
      window.dispatchEvent(new CustomEvent('taniops-storage-saved', { detail: { key, savedAt } }));
      return true;
    } catch (e) {
      console.error(`Gagal menyimpan ${key} ke penyimpanan browser`, e);
      window.dispatchEvent(new CustomEvent('taniops-storage-error', { detail: { key } }));
      return false;
    }
  };

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;
  const asText = (value: unknown): string =>
    typeof value === 'string' ? value : '';
  const asNumber = (value: unknown): number => {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const hasIdentity = (item: Record<string, unknown>): boolean =>
    typeof item.id === 'string' && item.id.trim().length > 0;
  const hasBlockIdentity = (item: Record<string, unknown>): boolean =>
    hasIdentity(item) && typeof item.blokId === 'string' && item.blokId.trim().length > 0;

  const normalizeBlokLahan = (value: unknown): BlokLahan | null => {
    if (!isRecord(value) || !hasIdentity(value)) return null;
    const tipeInput =
      value.tipeInput === 'bedengan' || value.tipeInput === 'are' || value.tipeInput === 'hektar'
        ? value.tipeInput
        : undefined;
    return {
      id: (value.id as string).trim(),
      nama: asText(value.nama),
      jumlahBedengan: asNumber(value.jumlahBedengan),
      panjangBedengan: asNumber(value.panjangBedengan),
      lebarBedengan: asNumber(value.lebarBedengan),
      jarakAntarBedengan: asNumber(value.jarakAntarBedengan),
      catatan: asText(value.catatan),
      tipeInput,
      luasManualM2: value.luasManualM2 == null ? undefined : asNumber(value.luasManualM2),
      luasAre: value.luasAre == null ? undefined : asNumber(value.luasAre),
      luasHektar: value.luasHektar == null ? undefined : asNumber(value.luasHektar),
      efisiensiLahan: value.efisiensiLahan == null ? undefined : asNumber(value.efisiensiLahan),
    };
  };

  const normalizeTanaman = (value: unknown): Tanaman | null => {
    if (!isRecord(value) || !hasBlockIdentity(value)) return null;
    return {
      id: value.id as string,
      blokId: value.blokId as string,
      komoditas: asText(value.komoditas),
      varietas: asText(value.varietas),
      tanggalTanam: asText(value.tanggalTanam),
      metodeTanam: asText(value.metodeTanam),
      barisTanaman: asNumber(value.barisTanaman),
      jarakTanam: asNumber(value.jarakTanam),
      jarakBaris: value.jarakBaris == null
        ? asNumber(value.jarakTanam)
        : asNumber(value.jarakBaris),
      jumlahTanaman: asNumber(value.jumlahTanaman),
      catatan: asText(value.catatan),
      status: value.status === 'Panen' ? 'Panen' : 'Aktif',
    };
  };

  const normalizeLogAktivitas = (value: unknown): LogAktivitas | null => {
    if (!isRecord(value) || !hasBlockIdentity(value)) return null;
    return {
      id: value.id as string,
      blokId: value.blokId as string,
      tanggal: asText(value.tanggal),
      kategori: asText(value.kategori),
      deskripsi: asText(value.deskripsi),
      biaya: asNumber(value.biaya),
      petugas: asText(value.petugas),
      biayaSudahDiKeuangan: value.biayaSudahDiKeuangan === true,
    };
  };

  const normalizePemupukan = (value: unknown): Pemupukan | null => {
    if (!isRecord(value) || !hasBlockIdentity(value)) return null;
    return {
      id: value.id as string,
      blokId: value.blokId as string,
      kategori: asText(value.kategori),
      jenisPupuk: asText(value.jenisPupuk),
      metodeAplikasi: asText(value.metodeAplikasi),
      satuanDosis: asText(value.satuanDosis),
      tujuan: asText(value.tujuan),
      dosisPerHektar: asNumber(value.dosisPerHektar),
      literAirPerHektar:
        value.literAirPerHektar == null ? undefined : asNumber(value.literAirPerHektar),
      inputBasis:
        value.inputBasis === 'blok' ||
        value.inputBasis === 'bedengan' ||
        value.inputBasis === 'hektar'
          ? value.inputBasis
          : undefined,
      dosisInput: value.dosisInput == null ? undefined : asNumber(value.dosisInput),
      airInput: value.airInput == null ? undefined : asNumber(value.airInput),
      tanggalAplikasi: asText(value.tanggalAplikasi),
      intervalHari: asNumber(value.intervalHari),
      catatan: asText(value.catatan),
      completedDates: Array.isArray(value.completedDates)
        ? [...new Set(value.completedDates.filter((date): date is string => typeof date === 'string'))]
        : [],
    };
  };

  const normalizeKeuangan = (value: unknown): Keuangan | null => {
    if (!isRecord(value) || !hasBlockIdentity(value)) return null;
    const optionalText = (key: string) =>
      value[key] == null ? undefined : asText(value[key]);
    const optionalNumber = (key: string) =>
      value[key] == null ? undefined : asNumber(value[key]);
    return {
      id: value.id as string,
      blokId: value.blokId as string,
      tanamanId: optionalText('tanamanId'),
      transactionDate: optionalText('transactionDate'),
      biayaTetap: asNumber(value.biayaTetap),
      namaBenih: optionalText('namaBenih'),
      jumlahBenih: optionalNumber('jumlahBenih'),
      satuanBenih: optionalText('satuanBenih'),
      hargaBenih: optionalNumber('hargaBenih'),
      tanggalPembelianBenih: optionalText('tanggalPembelianBenih'),
      biayaBenih: asNumber(value.biayaBenih),
      namaPupuk: optionalText('namaPupuk'),
      jumlahPupuk: optionalNumber('jumlahPupuk'),
      satuanPupuk: optionalText('satuanPupuk'),
      hargaPupuk: optionalNumber('hargaPupuk'),
      tanggalPembelianPupuk: optionalText('tanggalPembelianPupuk'),
      biayaPupuk: asNumber(value.biayaPupuk),
      namaPestisida: optionalText('namaPestisida'),
      jumlahPestisida: optionalNumber('jumlahPestisida'),
      satuanPestisida: optionalText('satuanPestisida'),
      hargaPestisida: optionalNumber('hargaPestisida'),
      tanggalPembelianPestisida: optionalText('tanggalPembelianPestisida'),
      biayaPestisida: asNumber(value.biayaPestisida),
      biayaLain: asNumber(value.biayaLain),
      targetHasil: asNumber(value.targetHasil),
      satuanHasil: optionalText('satuanHasil'),
      hargaJual: asNumber(value.hargaJual),
      komoditas: optionalText('komoditas'),
    };
  };

  const [blokLahan, setBlokLahan] = useState<BlokLahan[]>(() => {
    if (IS_DEMO_MODE) return DEMO_DATA.blokLahan;
    const raw = safeGetArray<BlokLahan>('taniops_blokLahan', normalizeBlokLahan);
    return raw.filter((item) => !item.id.includes('demo'));
  });
  const [tanaman, setTanaman] = useState<Tanaman[]>(() => {
    if (IS_DEMO_MODE) return DEMO_DATA.tanaman;
    const raw = safeGetArray<Tanaman>('taniops_tanaman', normalizeTanaman);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(() => {
    if (IS_DEMO_MODE) return DEMO_DATA.logAktivitas;
    const raw = safeGetArray<LogAktivitas>('taniops_logAktivitas', normalizeLogAktivitas);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [pemupukan, setPemupukan] = useState<Pemupukan[]>(() => {
    if (IS_DEMO_MODE) return DEMO_DATA.pemupukan;
    const raw = safeGetArray<Pemupukan>('taniops_pemupukan', normalizePemupukan);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [keuangan, setKeuangan] = useState<Keuangan[]>(() => {
    if (IS_DEMO_MODE) return DEMO_DATA.keuangan;
    const raw = safeGetArray<Keuangan>('taniops_keuangan', normalizeKeuangan);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    const handleStorageError = () => {
      showToast('Penyimpanan browser penuh atau diblokir. Perubahan terbaru mungkin belum tersimpan.', 'error');
    };
    window.addEventListener('taniops-storage-error', handleStorageError);
    return () => window.removeEventListener('taniops-storage-error', handleStorageError);
  }, [showToast]);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    const parseExternalArray = <T,>(
      rawValue: string | null,
      normalize: (item: unknown) => T | null,
    ): T[] | null => {
      if (rawValue === null) return [];
      try {
        const parsed: unknown = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) return null;
        const normalized = parsed
          .map(normalize)
          .filter((item): item is T => item !== null);
        return normalized.length === parsed.length ? normalized : null;
      } catch {
        return null;
      }
    };

    const handleExternalStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith('taniops_')) return;
      let applied = false;
      if (event.key === 'taniops_blokLahan') {
        const next = parseExternalArray(event.newValue, normalizeBlokLahan);
        if (next) {
          setBlokLahan(next);
          applied = true;
        }
      } else if (event.key === 'taniops_tanaman') {
        const next = parseExternalArray(event.newValue, normalizeTanaman);
        if (next) {
          setTanaman(next);
          applied = true;
        }
      } else if (event.key === 'taniops_logAktivitas') {
        const next = parseExternalArray(event.newValue, normalizeLogAktivitas);
        if (next) {
          setLogAktivitas(next);
          applied = true;
        }
      } else if (event.key === 'taniops_pemupukan') {
        const next = parseExternalArray(event.newValue, normalizePemupukan);
        if (next) {
          setPemupukan(next);
          applied = true;
        }
      } else if (event.key === 'taniops_keuangan') {
        const next = parseExternalArray(event.newValue, normalizeKeuangan);
        if (next) {
          setKeuangan(next);
          applied = true;
        }
      }

      if (applied) {
        window.dispatchEvent(new CustomEvent('taniops-storage-synced'));
      }
    };

    window.addEventListener('storage', handleExternalStorage);
    return () => window.removeEventListener('storage', handleExternalStorage);
  }, []);

  const loadDemoData = () => {
    if (IS_DEMO_MODE) {
      setBlokLahan(DEMO_DATA.blokLahan);
      setTanaman(DEMO_DATA.tanaman);
      setLogAktivitas(DEMO_DATA.logAktivitas);
      setPemupukan(DEMO_DATA.pemupukan);
      setKeuangan(DEMO_DATA.keuangan);
      return;
    }
    showToast('Mode demo tidak tersedia di aplikasi produksi. Data Anda tetap aman.', 'info');
  };

  const clearAllData = () => {
    if (IS_DEMO_MODE) {
      showToast('Mode demo hanya dapat dilihat. Data contoh tidak dapat dihapus.', 'info');
      return;
    }
    localStorage.removeItem('taniops_initialized');
    safeSetItem('taniops_blokLahan', []);
    safeSetItem('taniops_tanaman', []);
    safeSetItem('taniops_logAktivitas', []);
    safeSetItem('taniops_pemupukan', []);
    safeSetItem('taniops_keuangan', []);
    setBlokLahan([]);
    setTanaman([]);
    setLogAktivitas([]);
    setPemupukan([]);
    setKeuangan([]);
  };

  // Mark the editable app as initialized. Demo builds never touch operational storage.
  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_initialized', true);
    safeSetItem('taniops_schema_version', 3);
  }, []);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_blokLahan', blokLahan);
  }, [blokLahan]);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_tanaman', tanaman);
  }, [tanaman]);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_logAktivitas', logAktivitas);
  }, [logAktivitas]);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_pemupukan', pemupukan);
  }, [pemupukan]);

  React.useEffect(() => {
    if (IS_DEMO_MODE) return;
    safeSetItem('taniops_keuangan', keuangan);
  }, [keuangan]);

  const generateId = () =>
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const rejectDemoMutation = useCallback((): boolean => {
    if (!IS_DEMO_MODE) return false;
    showToast('Mode demo hanya dapat dilihat. Perubahan tidak disimpan.', 'info');
    return true;
  }, [IS_DEMO_MODE, showToast]);

  const addBlokLahan = useCallback((b: Omit<BlokLahan, 'id'>) => {
    if (rejectDemoMutation()) return;
    setBlokLahan(prev => [...prev, { ...b, id: generateId() }]);
  }, [rejectDemoMutation]);
  const updateBlokLahan = useCallback((id: string, b: Omit<Partial<BlokLahan>, 'id'>) => {
    if (rejectDemoMutation()) return;
    setBlokLahan(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
  }, [rejectDemoMutation]);
  const deleteBlokLahan = useCallback((id: string) => {
    if (rejectDemoMutation()) return;
    setBlokLahan(prev => prev.filter(item => item.id !== id));
    setTanaman(prev => prev.filter(item => item.blokId !== id));
    setLogAktivitas(prev => prev.filter(item => item.blokId !== id));
    setPemupukan(prev => prev.filter(item => item.blokId !== id));
    setKeuangan(prev => prev.filter(item => item.blokId !== id));
  }, [rejectDemoMutation]);

  const addTanaman = useCallback((t: Omit<Tanaman, 'id'>) => {
    if (rejectDemoMutation()) return;
    setTanaman(prev => [...prev, { ...t, id: generateId() }]);
  }, [rejectDemoMutation]);
  const updateTanaman = useCallback((id: string, t: Omit<Partial<Tanaman>, 'id'>) => {
    if (rejectDemoMutation()) return;
    setTanaman(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  }, [rejectDemoMutation]);
  const deleteTanaman = useCallback((id: string) => {
    if (rejectDemoMutation()) return;
    setTanaman(prev => prev.filter(item => item.id !== id));
    setKeuangan(prev => prev.map(item =>
      item.tanamanId === id ? { ...item, tanamanId: undefined } : item
    ));
  }, [rejectDemoMutation]);

  const addLogAktivitas = useCallback((l: Omit<LogAktivitas, 'id'>) => {
    if (rejectDemoMutation()) return;
    setLogAktivitas(prev => [...prev, { ...l, id: generateId() }]);
  }, [rejectDemoMutation]);
  const updateLogAktivitas = useCallback((id: string, l: Omit<Partial<LogAktivitas>, 'id'>) => {
    if (rejectDemoMutation()) return;
    setLogAktivitas(prev => prev.map(item => item.id === id ? { ...item, ...l } : item));
  }, [rejectDemoMutation]);
  const deleteLogAktivitas = useCallback((id: string) => {
    if (rejectDemoMutation()) return;
    setLogAktivitas(prev => prev.filter(item => item.id !== id));
  }, [rejectDemoMutation]);

  const addPemupukan = useCallback((p: Omit<Pemupukan, 'id'>) => {
    if (rejectDemoMutation()) return;
    setPemupukan(prev => [...prev, { ...p, id: generateId() }]);
  }, [rejectDemoMutation]);
  const updatePemupukan = useCallback((id: string, p: Omit<Partial<Pemupukan>, 'id'>) => {
    if (rejectDemoMutation()) return;
    setPemupukan(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  }, [rejectDemoMutation]);
  const deletePemupukan = useCallback((id: string) => {
    if (rejectDemoMutation()) return;
    setPemupukan(prev => prev.filter(item => item.id !== id));
  }, [rejectDemoMutation]);

  const addKeuangan = useCallback((k: Omit<Keuangan, 'id'>) => {
    if (rejectDemoMutation()) return;
    setKeuangan(prev => [...prev, { ...k, id: generateId() }]);
  }, [rejectDemoMutation]);
  const updateKeuangan = useCallback((id: string, k: Omit<Partial<Keuangan>, 'id'>) => {
    if (rejectDemoMutation()) return;
    setKeuangan(prev => prev.map(item => item.id === id ? { ...item, ...k } : item));
  }, [rejectDemoMutation]);
  const deleteKeuangan = useCallback((id: string) => {
    if (rejectDemoMutation()) return;
    setKeuangan(prev => prev.filter(item => item.id !== id));
  }, [rejectDemoMutation]);

  const createBackup = useCallback((): string => {
    const preferences: Record<string, string> = {};
    for (const key of BACKUP_PREFERENCE_KEYS) {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) preferences[key] = value;
      } catch {
        // Operational data remains exportable when a preference cannot be read.
      }
    }
    return JSON.stringify({
      app: 'TANITA',
      schemaVersion: 3,
      exportedAt: new Date().toISOString(),
      data: { blokLahan, tanaman, logAktivitas, pemupukan, keuangan },
      preferences,
    }, null, 2);
  }, [blokLahan, tanaman, logAktivitas, pemupukan, keuangan]);

  const restoreBackup = useCallback((payload: string): RestoreResult => {
    if (IS_DEMO_MODE) {
      return {
        success: false,
        message: 'Mode demo hanya dapat dilihat. Cadangan tidak dapat dipulihkan.',
      };
    }
    try {
      const parsed: unknown = JSON.parse(payload);
      if (!isRecord(parsed) || parsed.app !== 'TANITA' || !isRecord(parsed.data)) {
        return { success: false, message: 'File bukan cadangan TANITA yang valid.' };
      }
      const schemaVersion = Number(parsed.schemaVersion);
      if (
        !Number.isInteger(schemaVersion) ||
        schemaVersion < 1 ||
        schemaVersion > 3
      ) {
        return {
          success: false,
          message: 'Versi cadangan belum didukung oleh TANITA pada perangkat ini.',
        };
      }
      const data = parsed.data;
      const normalizeStrict = <T,>(
        value: unknown,
        normalize: (item: unknown) => T | null,
      ): T[] | null => {
        if (!Array.isArray(value)) return null;
        const normalized = value
          .map(normalize)
          .filter((item): item is T => item !== null);
        return normalized.length === value.length ? normalized : null;
      };

      const nextBlocks = normalizeStrict(data.blokLahan, normalizeBlokLahan);
      const nextPlants = normalizeStrict(data.tanaman, normalizeTanaman);
      const nextLogs = normalizeStrict(data.logAktivitas, normalizeLogAktivitas);
      const nextSchedules = normalizeStrict(data.pemupukan, normalizePemupukan);
      const nextFinance = normalizeStrict(data.keuangan, normalizeKeuangan);
      if (!nextBlocks || !nextPlants || !nextLogs || !nextSchedules || !nextFinance) {
        return { success: false, message: 'Isi cadangan rusak atau memiliki struktur yang tidak didukung.' };
      }

      const hasUniqueIds = (items: { id: string }[]) =>
        new Set(items.map((item) => item.id)).size === items.length;
      if (![nextBlocks, nextPlants, nextLogs, nextSchedules, nextFinance].every(hasUniqueIds)) {
        return { success: false, message: 'Cadangan memiliki ID ganda dan tidak dipulihkan.' };
      }

      const blockIds = new Set(nextBlocks.map((item) => item.id));
      const plantIds = new Set(nextPlants.map((item) => item.id));
      const hasInvalidBlockReference = [
        ...nextPlants,
        ...nextLogs,
        ...nextSchedules,
        ...nextFinance.filter((item) => item.blokId !== 'overall'),
      ].some((item) => !blockIds.has(item.blokId));
      const hasInvalidPlantReference = nextFinance.some(
        (item) => item.tanamanId && !plantIds.has(item.tanamanId),
      );
      if (hasInvalidBlockReference || hasInvalidPlantReference) {
        return { success: false, message: 'Cadangan memiliki relasi blok atau tanaman yang tidak valid.' };
      }

      const preferences = new Map<string, string | null>();
      if (isRecord(parsed.preferences)) {
        for (const key of BACKUP_PREFERENCE_KEYS) {
          const value = parsed.preferences[key];
          if (value === undefined) continue;
          if (typeof value !== 'string') {
            return {
              success: false,
              message: `Preferensi “${key}” pada cadangan tidak valid.`,
            };
          }
          preferences.set(key, value);
        }
      }

      const savedAt = new Date().toISOString();
      const writes = new Map<string, string | null>([
        ['taniops_blokLahan', JSON.stringify(nextBlocks)],
        ['taniops_tanaman', JSON.stringify(nextPlants)],
        ['taniops_logAktivitas', JSON.stringify(nextLogs)],
        ['taniops_pemupukan', JSON.stringify(nextSchedules)],
        ['taniops_keuangan', JSON.stringify(nextFinance)],
        ['taniops_schema_version', JSON.stringify(3)],
        ['tanita_last_saved_at', savedAt],
        ...preferences,
      ]);
      const previousValues = new Map<string, string | null>();
      try {
        for (const [key, value] of writes) {
          previousValues.set(key, localStorage.getItem(key));
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        }
      } catch {
        for (const [key, previousValue] of previousValues) {
          try {
            if (previousValue === null) localStorage.removeItem(key);
            else localStorage.setItem(key, previousValue);
          } catch {
            // Continue rollback attempts for the remaining keys.
          }
        }
        window.dispatchEvent(new CustomEvent('taniops-storage-error', {
          detail: { key: 'restore' },
        }));
        return {
          success: false,
          message: 'Cadangan tidak dipulihkan karena penyimpanan browser penuh atau diblokir.',
        };
      }

      setBlokLahan(nextBlocks);
      setTanaman(nextPlants);
      setLogAktivitas(nextLogs);
      setPemupukan(nextSchedules);
      setKeuangan(nextFinance);

      window.dispatchEvent(new CustomEvent('taniops-storage-saved', {
        detail: { key: 'restore', savedAt },
      }));
      if (preferences.size > 0) {
        window.dispatchEvent(new Event('tanita-settings-updated'));
      }
      return {
        success: true,
        message: `Cadangan dipulihkan: ${nextBlocks.length} blok, ${nextPlants.length} musim tanam, dan ${nextLogs.length} jurnal.`,
      };
    } catch {
      return { success: false, message: 'File cadangan tidak dapat dibaca.' };
    }
  }, [IS_DEMO_MODE, showToast]);

  const clearAllDataWrapped = useCallback(() => {
    clearAllData();
  }, []);

  const loadDemoDataWrapped = useCallback(() => {
    loadDemoData();
  }, []);

  const value = useMemo(() => ({
    isReadOnly: IS_DEMO_MODE,
    blokLahan, tanaman, logAktivitas, pemupukan, keuangan,
    addBlokLahan, updateBlokLahan, deleteBlokLahan,
    addTanaman, updateTanaman, deleteTanaman,
    addLogAktivitas, updateLogAktivitas, deleteLogAktivitas,
    addPemupukan, updatePemupukan, deletePemupukan,
    addKeuangan, updateKeuangan, deleteKeuangan,
    clearAllData: clearAllDataWrapped, loadDemoData: loadDemoDataWrapped,
    createBackup, restoreBackup,
  }), [
    IS_DEMO_MODE,
    blokLahan, tanaman, logAktivitas, pemupukan, keuangan,
    addBlokLahan, updateBlokLahan, deleteBlokLahan,
    addTanaman, updateTanaman, deleteTanaman,
    addLogAktivitas, updateLogAktivitas, deleteLogAktivitas,
    addPemupukan, updatePemupukan, deletePemupukan,
    addKeuangan, updateKeuangan, deleteKeuangan,
    clearAllDataWrapped, loadDemoDataWrapped,
    createBackup, restoreBackup,
  ]);

  return (
    <TaniOpsContext.Provider value={value}>
      {children}
    </TaniOpsContext.Provider>
  );
}

export function useTaniOps() {
  const context = useContext(TaniOpsContext);
  if (!context) throw new Error("useTaniOps must be used within TaniOpsProvider");
  return context;
}
