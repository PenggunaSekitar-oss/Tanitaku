import { PageHeader } from '../components/PageHeader';
import React, { useEffect, useState } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { Accordion } from '../components/Accordion';
import {
  calculateHST,
  calculateLuasLahan,
  calculatePlantPopulation,
  determineFaseTanaman,
  getRecommendations,
} from '../utils/calculations';
import { Select } from '../components/Select';
import { NumberInput } from '../components/NumberInput';
import { formatLocalDate } from '../utils/localDate';
import { ConfirmModal } from '../components/ConfirmModal';
import { GrowthChart } from '../components/GrowthChart';

export function PemantauanView({ initialTab = 'blok' }: { initialTab?: 'blok' | 'tanaman' }) {
  const { isReadOnly, blokLahan, tanaman, addBlokLahan, updateBlokLahan, deleteBlokLahan, addTanaman, updateTanaman, deleteTanaman } = useTaniOps();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'blok' | 'tanaman'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  const initialFormBlok = { 
    nama: '', 
    tipeInput: 'bedengan' as 'bedengan' | 'are' | 'hektar',
    luasAre: 0,
    luasHektar: 0,
    efisiensiLahan: 80,
    jumlahBedengan: 0, 
    panjangBedengan: 0, 
    lebarBedengan: 1,
    lebarUnit: 'm' as 'm' | 'cm', 
    jarakAntarBedengan: 0.5,
    jarakUnit: 'm' as 'm' | 'cm', 
    catatan: '' 
  };
  const initialFormTanaman = {
    blokId: '',
    komoditas: '',
    varietas: '',
    tanggalTanam: '',
    metodeTanam: '',
    barisTanaman: 0,
    jarakTanam: 0,
    jarakBaris: 0,
    jumlahTanaman: 0,
    catatan: '',
  };

  const [formBlok, setFormBlok] = useState(initialFormBlok);
  const [formTanaman, setFormTanaman] = useState(initialFormTanaman);
  const [editingBlokId, setEditingBlokId] = useState<string | null>(null);
  const [editingTanamanId, setEditingTanamanId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'blok' | 'tanaman' | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [panenConfirmOpen, setPanenConfirmOpen] = useState(false);
  const [panenId, setPanenId] = useState<string | null>(null);

  const handleAddBlok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBlok.nama) return;
    
    let dataToSave: any = {
      nama: formBlok.nama,
      tipeInput: formBlok.tipeInput,
      catatan: formBlok.catatan
    };

    if (formBlok.tipeInput === 'are') {
      if (formBlok.luasAre <= 0) return;
      const grossM2 = formBlok.luasAre * 100;
      const efisiensi = formBlok.efisiensiLahan || 80;
      const efektifM2 = grossM2 * (efisiensi / 100);

      const pBedeng = formBlok.panjangBedengan > 0 ? formBlok.panjangBedengan : 10;
      const lBedeng = formBlok.lebarBedengan > 0 ? (formBlok.lebarUnit === 'cm' ? formBlok.lebarBedengan / 100 : formBlok.lebarBedengan) : 1;
      const jBedeng = formBlok.jarakAntarBedengan > 0 ? (formBlok.jarakUnit === 'cm' ? formBlok.jarakAntarBedengan / 100 : formBlok.jarakAntarBedengan) : 0.5;
      const jmlBedeng = formBlok.jumlahBedengan > 0 ? formBlok.jumlahBedengan : Math.max(1, Math.round(efektifM2 / (pBedeng * (lBedeng + jBedeng))));

      dataToSave = {
        ...dataToSave,
        luasAre: formBlok.luasAre,
        luasHektar: formBlok.luasAre / 100,
        efisiensiLahan: efisiensi,
        luasManualM2: grossM2,
        jumlahBedengan: jmlBedeng,
        panjangBedengan: pBedeng,
        lebarBedengan: lBedeng,
        jarakAntarBedengan: jBedeng
      };
    } else if (formBlok.tipeInput === 'hektar') {
      if (formBlok.luasHektar <= 0) return;
      const grossM2 = formBlok.luasHektar * 10000;
      const efisiensi = formBlok.efisiensiLahan || 80;
      const efektifM2 = grossM2 * (efisiensi / 100);

      const pBedeng = formBlok.panjangBedengan > 0 ? formBlok.panjangBedengan : 10;
      const lBedeng = formBlok.lebarBedengan > 0 ? (formBlok.lebarUnit === 'cm' ? formBlok.lebarBedengan / 100 : formBlok.lebarBedengan) : 1;
      const jBedeng = formBlok.jarakAntarBedengan > 0 ? (formBlok.jarakUnit === 'cm' ? formBlok.jarakAntarBedengan / 100 : formBlok.jarakAntarBedengan) : 0.5;
      const jmlBedeng = formBlok.jumlahBedengan > 0 ? formBlok.jumlahBedengan : Math.max(1, Math.round(efektifM2 / (pBedeng * (lBedeng + jBedeng))));

      dataToSave = {
        ...dataToSave,
        luasHektar: formBlok.luasHektar,
        luasAre: formBlok.luasHektar * 100,
        efisiensiLahan: efisiensi,
        luasManualM2: grossM2,
        jumlahBedengan: jmlBedeng,
        panjangBedengan: pBedeng,
        lebarBedengan: lBedeng,
        jarakAntarBedengan: jBedeng
      };
    } else {
      if (
        formBlok.jumlahBedengan <= 0 ||
        formBlok.panjangBedengan <= 0 ||
        formBlok.lebarBedengan <= 0
      ) return;
      const lMeter = formBlok.lebarUnit === 'cm' ? formBlok.lebarBedengan / 100 : formBlok.lebarBedengan;
      const jMeter = formBlok.jarakUnit === 'cm' ? formBlok.jarakAntarBedengan / 100 : formBlok.jarakAntarBedengan;
      const grossM2 = calculateLuasLahan(
        formBlok.jumlahBedengan,
        formBlok.panjangBedengan,
        lMeter,
        jMeter,
      );

      dataToSave = {
        ...dataToSave,
        jumlahBedengan: formBlok.jumlahBedengan,
        panjangBedengan: formBlok.panjangBedengan,
        lebarBedengan: lMeter,
        jarakAntarBedengan: jMeter,
        luasManualM2: grossM2,
        luasAre: grossM2 / 100,
        luasHektar: grossM2 / 10000,
        efisiensiLahan: 100
      };
    }

    if (editingBlokId) {
      updateBlokLahan(editingBlokId, dataToSave);
      showToast('Data Blok Lahan berhasil diupdate', 'success');
    } else {
      addBlokLahan(dataToSave);
      showToast('Data Blok Lahan berhasil disimpan', 'success');
    }
    setFormBlok(initialFormBlok);
    setEditingBlokId(null);
  };

  const handleEditBlok = (b: any) => {
    setFormBlok({
      nama: b.nama || '',
      tipeInput: b.tipeInput || 'bedengan',
      luasAre: b.luasAre || (b.luasManualM2 ? b.luasManualM2 / 100 : 0),
      luasHektar: b.luasHektar || (b.luasManualM2 ? b.luasManualM2 / 10000 : 0),
      efisiensiLahan: b.efisiensiLahan || 80,
      jumlahBedengan: b.jumlahBedengan || 0,
      panjangBedengan: b.panjangBedengan || 0,
      lebarBedengan: b.lebarBedengan || 0,
      lebarUnit: 'm',
      jarakAntarBedengan: b.jarakAntarBedengan || 0,
      jarakUnit: 'm',
      catatan: b.catatan || ''
    });
    setEditingBlokId(b.id);
  };

  const handleDeleteBlok = (id: string) => {
    setDeleteId(id);
    setDeleteType('blok');
    setDeleteMessage('Yakin ingin menghapus blok lahan ini? Tanaman, jadwal, log aktivitas, dan data keuangan yang terkait juga akan dihapus.');
    setDeleteConfirmOpen(true);
  };

  const calculatePopulasi = (
    blokId: string,
    barisTanaman: number,
    jarakTanamCm: number,
    jarakBarisCm: number,
  ) => {
    if (!blokId || barisTanaman <= 0 || jarakTanamCm <= 0) return 0;
    const blok = blokLahan.find(b => b.id === blokId);
    if (!blok) return 0;

    const jarakTanamMeter = jarakTanamCm / 100;
    const safeRowSpacingCm = jarakBarisCm > 0 ? jarakBarisCm : jarakTanamCm;

    if (blok.tipeInput === 'hektar' && blok.luasHektar && blok.luasHektar > 0) {
      const efisiensiDec = (blok.efisiensiLahan || 80) / 100;
      const luasEfektifM2 = blok.luasHektar * 10000 * efisiensiDec;
      return calculatePlantPopulation(luasEfektifM2, jarakTanamCm, safeRowSpacingCm);
    } else if (blok.tipeInput === 'are' && blok.luasAre && blok.luasAre > 0) {
      const efisiensiDec = (blok.efisiensiLahan || 80) / 100;
      const luasEfektifM2 = blok.luasAre * 100 * efisiensiDec;
      return calculatePlantPopulation(luasEfektifM2, jarakTanamCm, safeRowSpacingCm);
    }

    const pBedengan = blok.panjangBedengan || 0;
    const jmlBedengan = blok.jumlahBedengan || 0;
    if (pBedengan > 0 && jmlBedengan > 0) {
      const lubangPerBaris = Math.floor(pBedengan / jarakTanamMeter);
      const populasiPerBedengan = lubangPerBaris * barisTanaman;
      return populasiPerBedengan * jmlBedengan;
    }

    if (blok.luasManualM2 && blok.luasManualM2 > 0) {
      return calculatePlantPopulation(
        blok.luasManualM2 * 0.8,
        jarakTanamCm,
        safeRowSpacingCm,
      );
    }

    return 0;
  };

  const handleTanamanChange = (field: string, value: any) => {
    const updated = { ...formTanaman, [field]: value };
    if (['blokId', 'barisTanaman', 'jarakTanam', 'jarakBaris'].includes(field)) {
      updated.jumlahTanaman = calculatePopulasi(
        updated.blokId,
        updated.barisTanaman,
        updated.jarakTanam,
        updated.jarakBaris,
      );
    }
    setFormTanaman(updated);
  };

  const handleAddTanaman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTanaman.blokId || !formTanaman.komoditas || !formTanaman.tanggalTanam) return;
    if (formTanaman.tanggalTanam > formatLocalDate()) {
      showToast('Tanggal tanam tidak boleh berada di masa depan.', 'error');
      return;
    }
    
    if (editingTanamanId) {
      updateTanaman(editingTanamanId, formTanaman);
      showToast('Data Tanaman berhasil diupdate', 'success');
    } else {
      addTanaman(formTanaman);
      showToast('Data Tanaman berhasil disimpan', 'success');
    }
    setFormTanaman(initialFormTanaman);
    setEditingTanamanId(null);
  };

  const handleEditTanaman = (t: any) => {
    setFormTanaman(t);
    setEditingTanamanId(t.id);
  };

  const handleDeleteTanaman = (id: string) => {
    setDeleteId(id);
    setDeleteType('tanaman');
    setDeleteMessage('Yakin ingin menghapus data tanaman ini?');
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const id = deleteId;
    if (!id || !deleteType) return;

    if (deleteType === 'blok') {
      deleteBlokLahan(id);
      showToast('Data Blok Lahan berhasil dihapus', 'success');
      if (editingBlokId === id) {
        setFormBlok(initialFormBlok);
        setEditingBlokId(null);
      }
    } else {
      deleteTanaman(id);
      showToast('Data Tanaman berhasil dihapus', 'success');
      if (editingTanamanId === id) {
        setFormTanaman(initialFormTanaman);
        setEditingTanamanId(null);
      }
    }
    setDeleteConfirmOpen(false);
    setDeleteId(null);
    setDeleteType(null);
  };

  return (
    <div className="flex min-h-full flex-col gap-6 pb-16 font-sans text-[#1B2721]">
      <PageHeader
        title="Lahan & Tanaman"
        subtitle="Kelola ukuran blok, estimasi populasi, tanggal tanam, dan status operasional tanaman."
      />

      {/* Surface Content */}
      <div className="relative z-10 flex flex-col gap-6 text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          
          <div className="flex gap-3 border-b border-slate-200 pb-3">
            <ConfirmModal 
              isOpen={deleteConfirmOpen} 
              message={deleteMessage} 
              onConfirm={confirmDelete} 
              onCancel={() => setDeleteConfirmOpen(false)} 
            />
            <ConfirmModal 
              isOpen={panenConfirmOpen} 
              message="Tandai tanaman ini sudah dipanen?" 
              confirmText="TANDAI PANEN"
              onConfirm={() => {
                if (panenId) {
                  updateTanaman(panenId, { status: 'Panen' });
                  showToast('Status tanaman diubah menjadi Panen', 'success');
                  setPanenConfirmOpen(false);
                  setPanenId(null);
                }
              }} 
              onCancel={() => {
                setPanenConfirmOpen(false);
                setPanenId(null);
              }} 
            />
            <button
              onClick={() => setActiveTab('blok')}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition shadow-xs cursor-pointer ${
                activeTab === 'blok'
                  ? 'bg-[#154734] text-white shadow-[#154734]/20'
                  : 'bg-[#FEFEFA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Blok & luas lahan
            </button>
            <button
              onClick={() => setActiveTab('tanaman')}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition shadow-xs cursor-pointer ${
                activeTab === 'tanaman'
                  ? 'bg-[#154734] text-white shadow-[#154734]/20'
                  : 'bg-[#FEFEFA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tanaman ({tanaman.length})
            </button>
          </div>

          <div className="mb-6">
            <Accordion 
              title="Cara TANITA menghitung luas dan populasi (opsional)"
              icon="calculate" 
              defaultOpen={false}
            >
              <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-800 pt-1">
                <p className="font-medium text-slate-600 leading-relaxed">
                  Berikut rumus praktis untuk menghitung estimasi populasi tanaman berdasarkan luas lahan maupun jumlah bedengan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Satuan Hektar */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-extrabold text-[#154734]">
                      <span className="material-symbols-outlined text-base">square_foot</span>
                      <span>1. Satuan Hektar (10.000 m²)</span>
                    </div>
                    <div className="bg-[#154734]/10 text-[#154734] font-mono p-2 rounded text-xs font-bold border border-[#154734]/20">
                      Populasi = (Luas Ha × 10.000 × Efisiensi) ÷ (Jarak Tanam × Jarak Baris)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      <strong>Faktor Efisiensi Lahan:</strong> Jika lahan menggunakan parit/jalan perawatan, luas efektif penanaman umumnya <strong>70% – 80%</strong> (0,7 – 0,8).
                    </p>
                  </div>

                  {/* 2. Satuan Are */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-extrabold text-[#154734]">
                      <span className="material-symbols-outlined text-base">grid_on</span>
                      <span>2. Satuan Are (100 m²)</span>
                    </div>
                    <div className="bg-[#154734]/10 text-[#154734] font-mono p-2 rounded text-xs font-bold border border-[#154734]/20">
                      Populasi = (Luas Are × 100 × Efisiensi) ÷ (Jarak Tanam × Jarak Baris)
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Memudahkan estimasi cepat untuk skala lahan menengah / lokal.
                    </p>
                  </div>

                  {/* 3. Berdasarkan Bedengan */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-extrabold text-[#154734]">
                      <span className="material-symbols-outlined text-base">view_stream</span>
                      <span>3. Berdasarkan Bedengan</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-slate-700">a. Populasi per Bedengan:</span>
                      <div className="bg-[#154734]/10 text-[#154734] font-mono p-1.5 rounded text-[11px] font-bold border border-[#154734]/20">
                        (Panjang ÷ Jarak Tanam) × Baris
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 mt-1">b. Total Populasi Lahan:</span>
                      <div className="bg-[#154734]/10 text-[#154734] font-mono p-1.5 rounded text-[11px] font-bold border border-[#154734]/20">
                        Populasi/Bedengan × Total Bedengan
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh Simulasi */}
                <div className="p-3.5 bg-[#8A9A5B]/15 border border-[#8A9A5B]/50 rounded-xl flex flex-col gap-2">
                  <span className="font-extrabold text-[#060606] flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="material-symbols-outlined text-base text-[#154734]">lightbulb</span>
                    Contoh Simulasi Perhitungan:
                  </span>
                  <ul className="text-xs text-slate-800 space-y-1 list-disc pl-5 font-medium leading-relaxed">
                    <li>Bedengan panjang <strong>10 m</strong>, jarak tanam dalam baris <strong>0,5 m</strong> (10 ÷ 0,5 = 20 lubang/baris).</li>
                    <li>Dibuat <strong>2 baris</strong> per bedengan (20 × 2 = 40 tanaman/bedengan).</li>
                    <li>Jika ada <strong>25 bedengan</strong>, total populasi = <strong>40 × 25 = 1.000 tanaman</strong>.</li>
                  </ul>
                </div>
              </div>
            </Accordion>
          </div>

      {activeTab === 'blok' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="demo-mutation neo-card p-4 lg:col-span-12">
            <h2 className="font-brutal uppercase tracking-wider mb-4 text-white font-extrabold bg-[#154734] px-3 py-1 rounded neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block">{editingBlokId ? 'Edit Blok Lahan' : 'Tambah Blok Baru'}</h2>
            <form onSubmit={handleAddBlok} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-muted mb-1">Nama Blok</label>
                <input type="text" value={formBlok.nama} onChange={e => setFormBlok({...formBlok, nama: e.target.value})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: Blok Utara A" required />
              </div>

              {/* Pilihan Satuan / Metode Hitung Luas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#154734] mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span>Data apa yang paling mudah Anda isi?</span>
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#154734]/5 border-2 border-[#0A0A0A] rounded-xl shadow-[2px_2px_0px_0px_#0A0A0A]">
                  <button
                    type="button"
                    onClick={() => setFormBlok({ ...formBlok, tipeInput: 'bedengan' })}
                    className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
                      formBlok.tipeInput === 'bedengan' 
                        ? 'bg-[#154734] text-white shadow-[1px_1px_0px_0px_#0A0A0A]' 
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">view_stream</span>
                    <span>Jumlah bedengan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormBlok({ ...formBlok, tipeInput: 'are' })}
                    className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
                      formBlok.tipeInput === 'are' 
                        ? 'bg-[#154734] text-white shadow-[1px_1px_0px_0px_#0A0A0A]' 
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">grid_on</span>
                    <span>Luas dalam Are</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormBlok({ ...formBlok, tipeInput: 'hektar' })}
                    className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
                      formBlok.tipeInput === 'hektar' 
                        ? 'bg-[#154734] text-white shadow-[1px_1px_0px_0px_#0A0A0A]' 
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">square_foot</span>
                    <span>Luas dalam Ha</span>
                  </button>
                </div>
              </div>

              {/* Form Input Berdasarkan Bedengan */}
              {formBlok.tipeInput === 'bedengan' && (
                <>
                  <div className="rounded-xl border border-[#C7D3CB] bg-[#EEF3EF] p-3 text-xs font-medium leading-relaxed text-[#536159]">
                    Isi dua data utama: jumlah dan panjang bedengan. Lebar standar 1 meter dan
                    jarak 0,5 meter sudah disiapkan—ubah hanya jika ukuran kebun berbeda.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-bold text-on-surface-muted mb-1">Berapa bedengan?</label>
                      <NumberInput value={formBlok.jumlahBedengan} onNumberChange={v => setFormBlok({...formBlok, jumlahBedengan: v})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: 20" required min="1" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface-muted mb-1">Panjang satu bedengan</label>
                      <NumberInput value={formBlok.panjangBedengan} onNumberChange={v => setFormBlok({...formBlok, panjangBedengan: v})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: 10 meter" required min="1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
                        <label className="text-sm font-bold text-on-surface-muted">Lebar satu bedengan</label>
                        <div className="flex items-center gap-1 bg-surface-high border border-outline rounded px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (formBlok.lebarUnit === 'cm') {
                                setFormBlok({ ...formBlok, lebarUnit: 'm', lebarBedengan: formBlok.lebarBedengan > 0 ? formBlok.lebarBedengan / 100 : 0 });
                              }
                            }}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${formBlok.lebarUnit === 'm' ? 'bg-action text-on-action shadow-[1px_1px_0px_0px_#000]' : 'text-on-surface-muted hover:text-on-surface'}`}
                          >
                            Meter (m)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (formBlok.lebarUnit === 'm') {
                                setFormBlok({ ...formBlok, lebarUnit: 'cm', lebarBedengan: formBlok.lebarBedengan > 0 ? formBlok.lebarBedengan * 100 : 0 });
                              }
                            }}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${formBlok.lebarUnit === 'cm' ? 'bg-action text-on-action shadow-[1px_1px_0px_0px_#000]' : 'text-on-surface-muted hover:text-on-surface'}`}
                          >
                            Cm (cm)
                          </button>
                        </div>
                      </div>
                      <NumberInput value={formBlok.lebarBedengan} onNumberChange={v => setFormBlok({...formBlok, lebarBedengan: v})} allowDecimals={true} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder={formBlok.lebarUnit === 'm' ? "Contoh: 1.2" : "Contoh: 120"} required min="0.01" />
                    </div>
                    <div>
                      <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
                        <label className="text-sm font-bold text-on-surface-muted">Jarak/parit antarbedengan</label>
                        <div className="flex items-center gap-1 bg-surface-high border border-outline rounded px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (formBlok.jarakUnit === 'cm') {
                                setFormBlok({ ...formBlok, jarakUnit: 'm', jarakAntarBedengan: formBlok.jarakAntarBedengan > 0 ? formBlok.jarakAntarBedengan / 100 : 0 });
                              }
                            }}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${formBlok.jarakUnit === 'm' ? 'bg-action text-on-action shadow-[1px_1px_0px_0px_#000]' : 'text-on-surface-muted hover:text-on-surface'}`}
                          >
                            Meter (m)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (formBlok.jarakUnit === 'm') {
                                setFormBlok({ ...formBlok, jarakUnit: 'cm', jarakAntarBedengan: formBlok.jarakAntarBedengan > 0 ? formBlok.jarakAntarBedengan * 100 : 0 });
                              }
                            }}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${formBlok.jarakUnit === 'cm' ? 'bg-action text-on-action shadow-[1px_1px_0px_0px_#000]' : 'text-on-surface-muted hover:text-on-surface'}`}
                          >
                            Cm (cm)
                          </button>
                        </div>
                      </div>
                      <NumberInput value={formBlok.jarakAntarBedengan} onNumberChange={v => setFormBlok({...formBlok, jarakAntarBedengan: v})} allowDecimals={true} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder={formBlok.jarakUnit === 'm' ? "Contoh: 0.5" : "Contoh: 50"} required min="0.01" />
                    </div>
                  </div>

                  {/* Live Kalkulasi Bedengan */}
                  {formBlok.jumlahBedengan > 0 && formBlok.panjangBedengan > 0 && (
                    <div className="bg-[#154734]/10 p-3 rounded-xl border border-[#154734]/30 flex flex-col gap-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-1 font-bold text-[#154734]">
                        <span className="material-symbols-outlined text-sm">calculate</span>
                        <span>Luas yang akan dipakai pada Jadwal Perawatan</span>
                      </div>
                      {(() => {
                        const lMeter = formBlok.lebarUnit === 'cm' ? formBlok.lebarBedengan / 100 : formBlok.lebarBedengan;
                        const jMeter = formBlok.jarakUnit === 'cm' ? formBlok.jarakAntarBedengan / 100 : formBlok.jarakAntarBedengan;
                        const m2 = calculateLuasLahan(formBlok.jumlahBedengan, formBlok.panjangBedengan, lMeter, jMeter);
                        const are = m2 / 100;
                        const ha = m2 / 10000;
                        return (
                          <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
                            <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                              <span className="block text-[10px] text-slate-500 font-semibold uppercase">m²</span>
                              <span className="font-mono font-extrabold text-[#154734] text-xs sm:text-sm">{m2.toLocaleString('id-ID', { maximumFractionDigits: 1 })} m²</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Are</span>
                              <span className="font-mono font-extrabold text-[#154734] text-xs sm:text-sm">{are.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Are</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Hektar</span>
                              <span className="font-mono font-extrabold text-[#154734] text-xs sm:text-sm">{ha.toLocaleString('id-ID', { maximumFractionDigits: 3 })} Ha</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}

              {/* Form Input Berdasarkan Satuan Are */}
              {formBlok.tipeInput === 'are' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-muted mb-1">
                      Luas Lahan (Are) <span className="text-red-500">*</span>
                    </label>
                    <NumberInput 
                      value={formBlok.luasAre} 
                      onNumberChange={v => setFormBlok({ ...formBlok, luasAre: v })} 
                      allowDecimals={true}
                      className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" 
                      placeholder="Contoh: 10 (10 Are = 1.000 m²)" 
                      required 
                      min="0.01" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-on-surface-muted">
                        Faktor Efisiensi Lahan (%)
                      </label>
                      <span className="text-xs font-extrabold text-[#154734] bg-[#154734]/10 px-2 py-0.5 rounded border border-[#154734]/20">
                        {formBlok.efisiensiLahan}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="5"
                        value={formBlok.efisiensiLahan}
                        onChange={e => setFormBlok({ ...formBlok, efisiensiLahan: Number(e.target.value) })}
                        className="w-full accent-[#154734] cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      *Umumnya 70% – 80% (efektif penanaman dikurangi parit & jalan).
                    </p>
                  </div>

                  {/* Live Kalkulasi Are */}
                  {formBlok.luasAre > 0 && (
                    <div className="bg-[#154734]/10 p-3 rounded-xl border border-[#154734]/30 flex flex-col gap-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-1 font-bold text-[#154734]">
                        <span className="material-symbols-outlined text-sm">calculate</span>
                        <span>Kalkulasi Otomatis (Satuan Are):</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Luas Gross</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasAre * 100).toLocaleString('id-ID')} m²</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Efektif ({formBlok.efisiensiLahan}%)</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasAre * 100 * (formBlok.efisiensiLahan / 100)).toLocaleString('id-ID')} m²</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Hektar</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasAre / 100).toLocaleString('id-ID', { maximumFractionDigits: 3 })} Ha</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Form Input Berdasarkan Satuan Hektar */}
              {formBlok.tipeInput === 'hektar' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-muted mb-1">
                      Luas Lahan (Hektar / Ha) <span className="text-red-500">*</span>
                    </label>
                    <NumberInput 
                      value={formBlok.luasHektar} 
                      onNumberChange={v => setFormBlok({ ...formBlok, luasHektar: v })} 
                      allowDecimals={true}
                      className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" 
                      placeholder="Contoh: 1.5 (1.5 Ha = 15.000 m²)" 
                      required 
                      min="0.01" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-on-surface-muted">
                        Faktor Efisiensi Lahan (%)
                      </label>
                      <span className="text-xs font-extrabold text-[#154734] bg-[#154734]/10 px-2 py-0.5 rounded border border-[#154734]/20">
                        {formBlok.efisiensiLahan}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="5"
                        value={formBlok.efisiensiLahan}
                        onChange={e => setFormBlok({ ...formBlok, efisiensiLahan: Number(e.target.value) })}
                        className="w-full accent-[#154734] cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      *Umumnya 70% – 80% (efektif penanaman dikurangi parit & jalan).
                    </p>
                  </div>

                  {/* Live Kalkulasi Hektar */}
                  {formBlok.luasHektar > 0 && (
                    <div className="bg-[#154734]/10 p-3 rounded-xl border border-[#154734]/30 flex flex-col gap-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-1 font-bold text-[#154734]">
                        <span className="material-symbols-outlined text-sm">calculate</span>
                        <span>Kalkulasi Otomatis (Satuan Hektar):</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Luas Gross</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasHektar * 10000).toLocaleString('id-ID')} m²</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Efektif ({formBlok.efisiensiLahan}%)</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasHektar * 10000 * (formBlok.efisiensiLahan / 100)).toLocaleString('id-ID')} m²</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#154734]/20 shadow-xs">
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Are</span>
                          <span className="font-mono font-extrabold text-[#154734] text-xs">{(formBlok.luasHektar * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Are</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-on-surface-muted mb-1">Catatan Tambahan</label>
                <textarea value={formBlok.catatan} onChange={e => setFormBlok({...formBlok, catatan: e.target.value})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Deskripsi kondisi lahan..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={
                  !formBlok.nama.trim() ||
                  (formBlok.tipeInput === 'are'
                    ? formBlok.luasAre <= 0
                    : formBlok.tipeInput === 'hektar'
                      ? formBlok.luasHektar <= 0
                      : formBlok.jumlahBedengan <= 0 ||
                        formBlok.panjangBedengan <= 0 ||
                        formBlok.lebarBedengan <= 0)
                } 
                className="neo-btn neo-btn-action text-on-action w-full min-h-[56px] mt-2 disabled:opacity-50 cursor-pointer"
              >
                {editingBlokId ? 'UPDATE BLOK' : 'SIMPAN BLOK'}
              </button>
              {editingBlokId && (
                <button type="button" onClick={() => { setFormBlok(initialFormBlok); setEditingBlokId(null); }} className="bg-surface-high border border-outline text-on-surface font-bold min-h-[48px] rounded-sm hover:bg-outline/20 transition cursor-pointer">
                  BATAL EDIT
                </button>
              )}
            </form>
          </div>
          <div className="lg:col-span-12">
            {blokLahan.length === 0 ? (
              <EmptyState icon="grid_view" title="Belum Ada Blok Lahan" message="Tambahkan data blok lahan di panel kiri untuk mulai memantau area budidaya." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blokLahan.map(blok => {
                  let grossM2 = 0;
                  const efisiensi = blok.efisiensiLahan || 100;

                  if (blok.tipeInput === 'hektar' && blok.luasHektar) {
                    grossM2 = blok.luasHektar * 10000;
                  } else if (blok.tipeInput === 'are' && blok.luasAre) {
                    grossM2 = blok.luasAre * 100;
                  } else {
                    const lMeter = blok.lebarBedengan;
                    const jMeter = blok.jarakAntarBedengan;
                    grossM2 = calculateLuasLahan(blok.jumlahBedengan, blok.panjangBedengan, lMeter, jMeter, blok.luasManualM2);
                  }
                  const effectiveM2 = grossM2 * (efisiensi / 100);

                  return (
                    <div key={blok.id} className="neo-card p-4 flex flex-col gap-3 relative group">
                      <div className="demo-mutation absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity">
                        <button onClick={() => handleEditBlok(blok)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-action hover:border-action transition cursor-pointer">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDeleteBlok(blok.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition cursor-pointer">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap pr-12">
                        <h3 className="font-display font-bold text-lg text-white font-extrabold bg-[#154734] px-3 py-1 rounded neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block">{blok.nama}</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-[#154734]/30 bg-[#154734]/10 text-[#154734]">
                          {blok.tipeInput === 'hektar' ? 'Satuan Hektar' : blok.tipeInput === 'are' ? 'Satuan Are' : 'Mode Bedengan'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 border-t border-outline pt-2 text-xs sm:text-sm">
                        {blok.tipeInput === 'hektar' && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-on-surface-muted">Luas Input (Ha):</span>
                            <span className="font-mono text-on-surface font-extrabold">{blok.luasHektar} Ha (Efisiensi: {efisiensi}%)</span>
                          </div>
                        )}
                        {blok.tipeInput === 'are' && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-on-surface-muted">Luas Input (Are):</span>
                            <span className="font-mono text-on-surface font-extrabold">{blok.luasAre} Are (Efisiensi: {efisiensi}%)</span>
                          </div>
                        )}
                        {(blok.tipeInput === 'bedengan' || !blok.tipeInput) && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-on-surface-muted">Dimensi Lahan:</span>
                            <span className="font-mono text-on-surface font-bold">{new Intl.NumberFormat('id-ID').format(blok.jumlahBedengan)} bedeng × {new Intl.NumberFormat('id-ID').format(blok.panjangBedengan)}m</span>
                          </div>
                        )}

                        {/* Luas Lahan in m², Are, Hektar */}
                        <div className="bg-[#154734]/10 p-2.5 rounded-lg border border-[#154734]/20 flex flex-col gap-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#154734] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">square_foot</span>
                            Luas efektif untuk perhitungan:
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
                            <div className="bg-white/80 p-1.5 rounded border border-[#154734]/20">
                              <span className="block text-[9px] text-slate-500 font-bold uppercase">m²</span>
                              <span className="font-extrabold text-[#154734]">{effectiveM2.toLocaleString('id-ID', { maximumFractionDigits: 1 })}</span>
                            </div>
                            <div className="bg-white/80 p-1.5 rounded border border-[#154734]/20">
                              <span className="block text-[9px] text-slate-500 font-bold uppercase">Are</span>
                              <span className="font-extrabold text-[#154734]">{(effectiveM2 / 100).toLocaleString('id-ID', { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="bg-white/80 p-1.5 rounded border border-[#154734]/20">
                              <span className="block text-[9px] text-slate-500 font-bold uppercase">Hektar (Ha)</span>
                              <span className="font-extrabold text-[#154734]">{(effectiveM2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 3 })}</span>
                            </div>
                          </div>
                          {efisiensi < 100 && (
                            <span className="text-[10px] font-medium text-[#66736C]">
                              Dari luas total {grossM2.toLocaleString('id-ID', { maximumFractionDigits: 1 })} m²
                              setelah dikurangi jalan/parit ({efisiensi}% efektif).
                            </span>
                          )}
                        </div>

                        {blok.catatan && (
                          <p className="text-xs text-slate-600 italic mt-0.5">{blok.catatan}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tanaman' && (
        <div className="flex flex-col gap-6">
          <GrowthChart tanamanList={tanaman} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="demo-mutation col-span-1 neo-card p-4">
            <h2 className="font-brutal uppercase tracking-wider mb-4 text-white font-extrabold bg-[#154734] px-3 py-1 rounded neo-border-thin shadow-[2px_2px_0px_0px_#0A0A0A] inline-block">{editingTanamanId ? 'Edit Data Tanam' : 'Input Data Tanam'}</h2>
            <form onSubmit={handleAddTanaman} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Pilih Blok Lahan</label>
                  <Select 
                    value={formTanaman.blokId} 
                    onChange={val => handleTanamanChange('blokId', val)} 
                    options={blokLahan.map(b => ({ value: b.id, label: b.nama }))}
                    placeholder="-- Pilih Blok --"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Tanggal Tanam</label>
                  <input type="date" value={formTanaman.tanggalTanam} onChange={e => handleTanamanChange('tanggalTanam', e.target.value)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Komoditas</label>
                  <input type="text" value={formTanaman.komoditas} onChange={e => handleTanamanChange('komoditas', e.target.value)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Cabai, Tomat..." required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Varietas</label>
                  <input type="text" value={formTanaman.varietas} onChange={e => handleTanamanChange('varietas', e.target.value)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="TM99..." />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Metode Tanam</label>
                  <input type="text" value={formTanaman.metodeTanam} onChange={e => handleTanamanChange('metodeTanam', e.target.value)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Mulsa/Bedeng" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Jarak Tanam (cm)</label>
                  <NumberInput value={formTanaman.jarakTanam} onNumberChange={v => handleTanamanChange('jarakTanam', v)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: 50" min="1" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Jarak Antar Baris (cm)</label>
                  <NumberInput
                    value={formTanaman.jarakBaris}
                    onNumberChange={v => handleTanamanChange('jarakBaris', v)}
                    className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0"
                    placeholder="Contoh: 60"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Baris/Bedengan</label>
                  <NumberInput value={formTanaman.barisTanaman} onNumberChange={v => handleTanamanChange('barisTanaman', v)} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: 2" min="1" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-muted mb-1">Est. Populasi</label>
                  <NumberInput value={formTanaman.jumlahTanaman} onNumberChange={() => {}} disabled className="w-full bg-surface-high border border-outline focus:ring-1 focus:ring-action rounded-[12px] px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface opacity-70" placeholder="0" />
                </div>
              </div>
              <button type="submit" disabled={!formTanaman.blokId || !formTanaman.komoditas || !formTanaman.tanggalTanam || formTanaman.jumlahTanaman <= 0} className="neo-btn neo-btn-action text-on-action w-full min-h-[56px] mt-2 disabled:opacity-50">
                {editingTanamanId ? 'UPDATE TANAMAN' : 'SIMPAN TANAMAN'}
              </button>
              {editingTanamanId && (
                <button type="button" onClick={() => { setFormTanaman(initialFormTanaman); setEditingTanamanId(null); }} className="mt-2 w-full bg-surface-high border border-outline text-on-surface font-bold min-h-[56px] rounded-[16px] hover:bg-outline/20 transition">
                  BATAL EDIT
                </button>
              )}
            </form>
          </div>
          <div className={isReadOnly ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-2'}>
            {tanaman.length === 0 ? (
              <EmptyState icon="psychiatry" title="Belum Ada Tanaman" message="Tambahkan data tanam untuk mulai memantau umur dan status operasional." />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tanaman.map(t => {
                  const blok = blokLahan.find(b => b.id === t.blokId);
                  const hst = calculateHST(t.tanggalTanam);
                  const fase = determineFaseTanaman(hst);
                  const rekomendasi = getRecommendations(hst);
                  return (
                    <div key={t.id} className={`neo-card flex flex-col relative group ${t.status === 'Panen' ? 'opacity-80' : ''}`}>
                      {t.status === 'Panen' && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
                          <span className="text-danger/40 font-black text-6xl md:text-8xl transform -rotate-12 select-none border-4 md:border-8 border-danger/40 p-2 md:p-4 rounded-xl font-brutal tracking-widest uppercase">
                            PANEN
                          </span>
                        </div>
                      )}
                      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="demo-mutation absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity z-20">
                          {t.status === 'Panen' ? (
                            <>
                              <span className="bg-success text-white font-bold text-xs uppercase px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000]">Sudah Panen</span>
                              <button onClick={() => handleDeleteTanaman(t.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => {
                                setPanenId(t.id);
                                setPanenConfirmOpen(true);
                              }} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-success hover:border-success transition" title="Tandai Panen">
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              </button>
                              <button onClick={() => handleEditTanaman(t)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-action hover:border-action transition">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button onClick={() => handleDeleteTanaman(t.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </>
                          )}
                        </div>
                        <div className="pr-12">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <span className="bg-[#154734] text-white font-extrabold text-xs font-mono px-2 py-0.5 rounded border border-[#0A0A0A] shadow-[1px_1px_0px_0px_#0A0A0A] inline-block uppercase">{blok?.nama || 'Unknown Blok'}</span>
                            <span className="text-xs font-mono text-on-surface-muted">Populasi: {new Intl.NumberFormat('id-ID').format(t.jumlahTanaman)}</span>
                            <span className="text-xs font-mono text-on-surface-muted border-l border-outline pl-2">
                              {t.barisTanaman} Baris | {t.jarakTanam} × {t.jarakBaris || t.jarakTanam} cm
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-xl text-on-surface">{t.komoditas} <span className="text-on-surface-muted font-normal text-base">({t.varietas})</span></h3>
                        </div>
                        <div className="flex gap-6 border-t md:border-t-0 border-outline pt-3 md:pt-0 w-full md:w-auto">
                          <div className="flex flex-col">
                            <span className="text-xs text-on-surface-muted font-bold uppercase">Umur Tanam</span>
                            <span className="font-display font-bold text-2xl text-white bg-[#154734] px-2.5 py-0.5 rounded border border-[#0A0A0A] shadow-[1px_1px_0px_0px_#0A0A0A] inline-block">{hst} <span className="text-sm font-sans font-medium text-white/90">HST</span></span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-on-surface-muted font-bold uppercase">Kelompok umur</span>
                            <span className="font-display font-bold text-lg text-success mt-1">{fase}</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-outline px-4 py-2 bg-surface-high/50 rounded-b-[8px]">
                        <Accordion title="Checklist Verifikasi Lapangan" icon="fact_check" defaultOpen={false}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">compost</span> Pupuk</span>
                              <span className="text-sm font-sans">{rekomendasi.pupuk}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">pest_control</span> Perlindungan tanaman</span>
                              <span className="text-sm font-sans">{rekomendasi.pestisida}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">agriculture</span> Perawatan</span>
                              <span className="text-sm font-sans">{rekomendasi.perawatan}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface-muted uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bug_report</span> Potensi Hama</span>
                              <span className="text-sm font-sans">{rekomendasi.hama}</span>
                            </div>
                            <div className="flex flex-col md:col-span-2">
                              <span className="text-xs font-bold text-action uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lightbulb</span> Tips & Trik</span>
                              <span className="text-sm font-sans bg-action/10 p-2 rounded-sm border-l-2 border-action">{rekomendasi.tips}</span>
                            </div>
                          </div>
                          <p className="mt-4 border-t border-[#DEDCD4] pt-3 text-[10px] font-medium leading-relaxed text-[#707A73]">
                            Panduan ini bersifat umum berdasarkan umur catatan. Konfirmasi komoditas, varietas, kondisi lahan, label produk, dan hasil pengamatan sebelum bertindak.
                          </p>
                        </Accordion>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
