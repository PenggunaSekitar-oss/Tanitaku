import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  return d.toISOString().split('T')[0];
};

const DEFAULT_BLOK_LAHAN: BlokLahan[] = [];
const DEFAULT_TANAMAN: Tanaman[] = [];
const DEFAULT_LOG: LogAktivitas[] = [];
const DEFAULT_PEMUPUKAN: Pemupukan[] = [];
const DEFAULT_KEUANGAN: Keuangan[] = [];

export function TaniOpsProvider({ children }: { children: ReactNode }) {
  const safeGetItem = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const safeSetItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignore quota or security errors in sandbox environments
    }
  };

  const [blokLahan, setBlokLahan] = useState<BlokLahan[]>(() => {
    const raw = safeGetItem<BlokLahan[]>('taniops_blokLahan', []);
    return raw.filter((item) => !item.id.includes('demo'));
  });
  const [tanaman, setTanaman] = useState<Tanaman[]>(() => {
    const raw = safeGetItem<Tanaman[]>('taniops_tanaman', []);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [logAktivitas, setLogAktivitas] = useState<LogAktivitas[]>(() => {
    const raw = safeGetItem<LogAktivitas[]>('taniops_logAktivitas', []);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [pemupukan, setPemupukan] = useState<Pemupukan[]>(() => {
    const raw = safeGetItem<Pemupukan[]>('taniops_pemupukan', []);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });
  const [keuangan, setKeuangan] = useState<Keuangan[]>(() => {
    const raw = safeGetItem<Keuangan[]>('taniops_keuangan', []);
    return raw.filter((item) => !item.id.includes('demo') && !item.blokId.includes('demo'));
  });

  const loadDemoData = () => {
    clearAllData();
  };

  const clearAllData = () => {
    localStorage.setItem('taniops_initialized', 'true');
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
    localStorage.setItem('taniops_initialized', 'true');
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

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addBlokLahan = (b: Omit<BlokLahan, 'id'>) => setBlokLahan(prev => [...prev, { ...b, id: generateId() }]);
  const updateBlokLahan = (id: string, b: Partial<BlokLahan>) => setBlokLahan(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
  const deleteBlokLahan = (id: string) => setBlokLahan(prev => prev.filter(item => item.id !== id));

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
