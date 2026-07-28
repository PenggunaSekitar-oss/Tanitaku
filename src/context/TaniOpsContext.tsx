import React, { createContext, useContext, useState, ReactNode } from 'react';
import { formatLocalDate } from '../utils/localDate';
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
  jumlahTanaman: number;
  catatan: string;
  status?: 'Aktif' | 'Panen';
};
export type LogAktivitas = { id: string; tanggal: string; blokId: string; kategori: string; deskripsi: string; biaya: number; petugas: string };
export type Pemupukan = { id: string; blokId: string; kategori: string; jenisPupuk: string; metodeAplikasi: string; satuanDosis: string; tujuan: string; dosisPerHektar: number; literAirPerHektar?: number; tanggalAplikasi: string; intervalHari: number; catatan: string };
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

interface TaniOpsContextType extends State {
  addBlokLahan: (b: Omit<BlokLahan, 'id'>) => void;
  updateBlokLahan: (id: string, b: Partial<BlokLahan>) => void;
  deleteBlokLahan: (id: string) => void;
  addTanaman: (t: Omit<Tanaman, 'id'>) => void;
  updateTanaman: (id: string, t: Partial<Tanaman>) => void;
  deleteTanaman: (id: string) => void;
  addLogAktivitas: (l: Omit<LogAktivitas, 'id'>) => void;
  updateLogAktivitas: (id: string, l: Partial<LogAktivitas>) => void;
  deleteLogAktivitas: (id: string) => void;
  addPemupukan: (p: Omit<Pemupukan, 'id'>) => void;
  updatePemupukan: (id: string, p: Partial<Pemupukan>) => void;
  deletePemupukan: (id: string) => void;
  addKeuangan: (k: Omit<Keuangan, 'id'>) => void;
  updateKeuangan: (id: string, k: Partial<Keuangan>) => void;
  deleteKeuangan: (id: string) => void;
  clearAllData: () => void;
  loadDemoData: () => void;
}

const TaniOpsContext = createContext<TaniOpsContextType | undefined>(undefined);

const getRecentDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatLocalDate(d);
};

const DEFAULT_BLOK_LAHAN: BlokLahan[] = [];
const DEFAULT_TANAMAN: Tanaman[] = [];
const DEFAULT_LOG: LogAktivitas[] = [];
const DEFAULT_PEMUPUKAN: Pemupukan[] = [];
const DEFAULT_KEUANGAN: Keuangan[] = [];

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
      id: value.id as string,
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
      tanggalAplikasi: asText(value.tanggalAplikasi),
      intervalHari: asNumber(value.intervalHari),
      catatan: asText(value.catatan),
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
    const raw = safeGetArray<BlokLahan>('taniops_blokLahan', normalizeBlokLahan);
    return raw.filter((item) => !item.id.includes('demo'));
  });
  const [tanaman, setTanaman] = useState<Tanaman[]>(() => {
    const raw = safeGetArray<Tanaman>('taniops_tanaman', normalizeTanaman);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(() => {
    const raw = safeGetArray<LogAktivitas>('taniops_logAktivitas', normalizeLogAktivitas);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [pemupukan, setPemupukan] = useState<Pemupukan[]>(() => {
    const raw = safeGetArray<Pemupukan>('taniops_pemupukan', normalizePemupukan);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [keuangan, setKeuangan] = useState<Keuangan[]>(() => {
    const raw = safeGetArray<Keuangan>('taniops_keuangan', normalizeKeuangan);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });

  React.useEffect(() => {
    const handleStorageError = () => {
      showToast('Penyimpanan browser penuh atau diblokir. Perubahan terbaru mungkin belum tersimpan.', 'error');
    };
    window.addEventListener('taniops-storage-error', handleStorageError);
    return () => window.removeEventListener('taniops-storage-error', handleStorageError);
  }, [showToast]);

  const loadDemoData = () => {
    clearAllData();
  };

  const clearAllData = () => {
    safeSetItem('taniops_initialized', true);
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

  // Clean demo data on mount and mark as initialized
  React.useEffect(() => {
    safeSetItem('taniops_initialized', true);
    safeSetItem('taniops_schema_version', 2);
    safeSetItem('taniops_blokLahan', blokLahan);
    safeSetItem('taniops_tanaman', tanaman);
    safeSetItem('taniops_logAktivitas', logAktivitas);
    safeSetItem('taniops_pemupukan', pemupukan);
    safeSetItem('taniops_keuangan', keuangan);
  }, []);

  React.useEffect(() => {
    safeSetItem('taniops_blokLahan', blokLahan);
  }, [blokLahan]);

  React.useEffect(() => {
    safeSetItem('taniops_tanaman', tanaman);
  }, [tanaman]);

  React.useEffect(() => {
    safeSetItem('taniops_logAktivitas', logAktivitas);
  }, [logAktivitas]);

  React.useEffect(() => {
    safeSetItem('taniops_pemupukan', pemupukan);
  }, [pemupukan]);

  React.useEffect(() => {
    safeSetItem('taniops_keuangan', keuangan);
  }, [keuangan]);

  const generateId = () =>
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const addBlokLahan = (b: Omit<BlokLahan, 'id'>) => setBlokLahan(prev => [...prev, { ...b, id: generateId() }]);
  const updateBlokLahan = (id: string, b: Partial<BlokLahan>) => setBlokLahan(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
  const deleteBlokLahan = (id: string) => {
    setBlokLahan(prev => prev.filter(item => item.id !== id));
    setTanaman(prev => prev.filter(item => item.blokId !== id));
    setLogAktivitas(prev => prev.filter(item => item.blokId !== id));
    setPemupukan(prev => prev.filter(item => item.blokId !== id));
    setKeuangan(prev => prev.filter(item => item.blokId !== id));
  };

  const addTanaman = (t: Omit<Tanaman, 'id'>) => setTanaman(prev => [...prev, { ...t, id: generateId() }]);
  const updateTanaman = (id: string, t: Partial<Tanaman>) => setTanaman(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  const deleteTanaman = (id: string) => setTanaman(prev => prev.filter(item => item.id !== id));

  const addLogAktivitas = (l: Omit<LogAktivitas, 'id'>) => setLogAktivitas(prev => [...prev, { ...l, id: generateId() }]);
  const updateLogAktivitas = (id: string, l: Partial<LogAktivitas>) => setLogAktivitas(prev => prev.map(item => item.id === id ? { ...item, ...l } : item));
  const deleteLogAktivitas = (id: string) => setLogAktivitas(prev => prev.filter(item => item.id !== id));

  const addPemupukan = (p: Omit<Pemupukan, 'id'>) => setPemupukan(prev => [...prev, { ...p, id: generateId() }]);
  const updatePemupukan = (id: string, p: Partial<Pemupukan>) => setPemupukan(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  const deletePemupukan = (id: string) => setPemupukan(prev => prev.filter(item => item.id !== id));

  const addKeuangan = (k: Omit<Keuangan, 'id'>) => setKeuangan(prev => [...prev, { ...k, id: generateId() }]);
  const updateKeuangan = (id: string, k: Partial<Keuangan>) => setKeuangan(prev => prev.map(item => item.id === id ? { ...item, ...k } : item));
  const deleteKeuangan = (id: string) => setKeuangan(prev => prev.filter(item => item.id !== id));

  return (
    <TaniOpsContext.Provider value={{
      blokLahan, tanaman, logAktivitas, pemupukan, keuangan,
      addBlokLahan, updateBlokLahan, deleteBlokLahan,
      addTanaman, updateTanaman, deleteTanaman,
      addLogAktivitas, updateLogAktivitas, deleteLogAktivitas,
      addPemupukan, updatePemupukan, deletePemupukan,
      addKeuangan, updateKeuangan, deleteKeuangan,
      clearAllData, loadDemoData
    }}>
      {children}
    </TaniOpsContext.Provider>
  );
}

export function useTaniOps() {
  const context = useContext(TaniOpsContext);
  if (!context) throw new Error("useTaniOps must be used within TaniOpsProvider");
  return context;
}
