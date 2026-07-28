import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { calculateActualFertilizerDose, calculateLuasLahan } from '../utils/calculations';
import { Select } from '../components/Select';
import { NumberInput } from '../components/NumberInput';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatLocalDate } from '../utils/localDate';

export function PemupukanView() {
  const { blokLahan, pemupukan, addPemupukan, updatePemupukan, deletePemupukan } = useTaniOps();
  const { showToast } = useToast();
  
  const initialForm = { 
    blokId: '', 
    kategori: 'Pupuk', 
    jenisPupuk: '', 
    metodeAplikasi: 'Tabur', 
    satuanDosis: 'Kilogram', 
    tujuan: '', 
    dosisPerHektar: 0, 
    literAirPerHektar: 0, 
    tanggalAplikasi: formatLocalDate(),
    intervalHari: 0, 
    catatan: '' 
  };

  const [form, setForm] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterKategori, setFilterKategori] = useState<'Semua' | 'Pupuk' | 'Pestisida'>('Semua');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddPemupukan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.blokId || !form.jenisPupuk || form.dosisPerHektar <= 0) return;
    
    if (editingId) {
      updatePemupukan(editingId, form);
      showToast('Data Rencana Perawatan berhasil diupdate', 'success');
    } else {
      addPemupukan(form);
      showToast('Data Rencana Perawatan berhasil ditambahkan', 'success');
    }
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (p: any) => {
    setForm(p);
    setEditingId(p.id);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deletePemupukan(deleteId);
      showToast('Jadwal perawatan berhasil dihapus', 'success');
      if (editingId === deleteId) {
        setForm(initialForm);
        setEditingId(null);
      }
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const filteredList = pemupukan.filter(item => {
    if (filterKategori === 'Semua') return true;
    return item.kategori === filterKategori;
  });

  const totalPupuk = pemupukan.filter(p => p.kategori === 'Pupuk').length;
  const totalPestisida = pemupukan.filter(p => p.kategori === 'Pestisida').length;

  return (
    <div className="flex flex-col min-h-full pb-16 bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#154734] selection:text-white">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden pt-6 pb-6 px-4 sm:px-6 bg-[#FEFEFA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#154734]/15 text-[#154734] border border-[#154734]/30 px-3 py-1 rounded-full">
              Formulasi Dosis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Jadwal &amp; Dosis Perawatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Kelola rencana aplikasi pupuk &amp; pestisida dengan kalkulator dosis presisi berbasis luas lahan.
          </p>
        </div>
      </div>

      {/* Surface Content */}
      <div className="bg-[#FEFEFA] text-slate-900 p-4 sm:p-6 relative z-10 flex flex-col gap-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">

      <ConfirmModal 
        isOpen={deleteConfirmOpen} 
        message="Apakah Anda yakin ingin menghapus jadwal perawatan ini?" 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteConfirmOpen(false)} 
      />

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="neo-card-small p-4 bg-surface flex items-center justify-between border-l-4 border-primary">
          <div>
            <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider block">Total Rencana</span>
            <span className="font-display font-black text-2xl text-on-surface mt-0.5 block">{pemupukan.length} Sesi</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#154734] border border-[#0A0A0A] flex items-center justify-center text-white font-black shadow-[1px_1px_0px_0px_#0A0A0A]">
            <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          </div>
        </div>

        <div className="neo-card-small p-4 bg-surface flex items-center justify-between border-l-4 border-success">
          <div>
            <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider block">Aplikasi Pupuk</span>
            <span className="font-display font-black text-2xl text-success mt-0.5 block">{totalPupuk} Jadwal</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/20 border border-black flex items-center justify-center text-success font-black">
            <span className="material-symbols-outlined text-[22px]">compost</span>
          </div>
        </div>

        <div className="neo-card-small p-4 bg-surface flex items-center justify-between border-l-4 border-danger">
          <div>
            <span className="text-xs font-bold text-on-surface-muted uppercase tracking-wider block">Aplikasi Pestisida</span>
            <span className="font-display font-black text-2xl text-danger mt-0.5 block">{totalPestisida} Jadwal</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger/20 border border-black flex items-center justify-center text-danger font-black">
            <span className="material-symbols-outlined text-[22px]">shield</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Form (Left) vs Schedule List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FORM PANEL (Left - 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="neo-card p-5 bg-surface border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h2 className="font-brutal font-black text-base uppercase tracking-wider text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-action text-[20px]">
                  {editingId ? 'edit_note' : 'add_task'}
                </span>
                {editingId ? 'Edit Rencana Perawatan' : 'Input Rencana Perawatan'}
              </h2>
              {editingId && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#154734] text-white border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                  Mode Edit
                </span>
              )}
            </div>

            <form onSubmit={handleAddPemupukan} className="flex flex-col gap-4 text-xs">
              
              {/* Section 1: Target Lahan & Kategori */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Pilih Blok Lahan <span className="text-danger">*</span>
                  </label>
                  <Select 
                    value={form.blokId} 
                    onChange={val => setForm({...form, blokId: val})} 
                    options={blokLahan.map(b => ({ value: b.id, label: `${b.nama} (${b.jumlahBedengan} Bedengan)` }))}
                    placeholder="-- Pilih Blok Lahan --"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Kategori <span className="text-danger">*</span>
                    </label>
                    <Select 
                      value={form.kategori} 
                      onChange={val => setForm({...form, kategori: val})} 
                      options={[
                        { value: 'Pupuk', label: '🌱 Pupuk' },
                        { value: 'Pestisida', label: '🛡️ Pestisida' }
                      ]}
                      placeholder="Kategori"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Metode Aplikasi <span className="text-danger">*</span>
                    </label>
                    <Select 
                      value={form.metodeAplikasi} 
                      onChange={val => setForm({...form, metodeAplikasi: val})} 
                      options={[
                        { value: 'Tabur', label: 'Tabur' },
                        { value: 'Kocor', label: 'Kocor' },
                        { value: 'Semprot', label: 'Semprot' }
                      ]}
                      placeholder="Metode"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Bahan & Tujuan */}
              <div className="flex flex-col gap-3 pt-2 border-t border-outline">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Nama Produk / Bahan <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={form.jenisPupuk} 
                    onChange={e => setForm({...form, jenisPupuk: e.target.value})} 
                    className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                    placeholder="misal: NPK 16-16-16, Urea, Abamektin..." 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Tujuan / Sasaran Aplikasi
                  </label>
                  <input 
                    type="text" 
                    value={form.tujuan} 
                    onChange={e => setForm({...form, tujuan: e.target.value})} 
                    className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                    placeholder="misal: Fase Vegetatif, Cegah Thrips & Kutu..." 
                  />
                </div>
              </div>

              {/* Section 3: Takaran Dosis & Kebutuhan Air */}
              <div className="flex flex-col gap-3 pt-2 border-t border-outline">
                <span className="font-bold text-[11px] text-on-surface-muted uppercase tracking-wider">
                  📐 Kalkulasi Dosis Standar (Per Hektar)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Air (/Hektar)
                    </label>
                    <div className="relative flex items-center">
                      <NumberInput 
                        value={form.literAirPerHektar || 0} 
                        onNumberChange={v => setForm({...form, literAirPerHektar: v})} 
                        className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000] pr-12" 
                        placeholder="400" 
                      />
                      <span className="absolute right-3 text-[11px] font-bold text-on-surface-muted pointer-events-none">Liter</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Dosis Produk (/Hektar) <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-1.5">
                      <div className="flex-1">
                        <NumberInput 
                          value={form.dosisPerHektar} 
                          onNumberChange={v => setForm({...form, dosisPerHektar: v})} 
                          className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                          placeholder="200" 
                          required 
                        />
                      </div>
                      <div className="w-[110px] shrink-0">
                        <Select 
                          value={form.satuanDosis} 
                          onChange={val => setForm({...form, satuanDosis: val})} 
                          options={[
                            { value: 'Kilogram', label: 'Kg' },
                            { value: 'Gram', label: 'Gram' },
                            { value: 'Liter', label: 'Liter' },
                            { value: 'Mililiter', label: 'mL' }
                          ]}
                          placeholder="Satuan"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Jadwal & Interval */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Tgl Aplikasi <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={form.tanggalAplikasi} 
                    onChange={e => setForm({...form, tanggalAplikasi: e.target.value})} 
                    className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1 uppercase tracking-wider">
                    Interval (Hari)
                  </label>
                  <NumberInput 
                    value={form.intervalHari} 
                    onNumberChange={v => setForm({...form, intervalHari: v})} 
                    className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                    placeholder="misal: 14" 
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-2 pt-3">
                <button 
                  type="submit" 
                  disabled={!form.blokId || !form.jenisPupuk || !form.dosisPerHektar} 
                  className="w-full bg-action text-on-action font-brutal font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {editingId ? 'save' : 'add_circle'}
                  </span>
                  {editingId ? 'UPDATE RENCANA' : 'SIMPAN RENCANA JADWAL'}
                </button>

                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setForm(initialForm); setEditingId(null); }} 
                    className="w-full bg-surface-high text-on-surface font-bold text-xs py-2.5 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-outline/20 transition cursor-pointer"
                  >
                    BATAL EDIT
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* SCHEDULE LIST PANEL (Right - 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="neo-card p-4 sm:p-5 bg-surface border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-black pb-3">
              <div>
                <h3 className="font-brutal font-black text-base uppercase tracking-wider text-on-surface">
                  Daftar Rencana &amp; Dosis Aktual
                </h3>
                <p className="text-xs text-on-surface-muted font-mono">
                  Kalkulasi otomatis kebutuhan riil per blok lahan berdasarkan luas
                </p>
              </div>

              <div className="flex items-center gap-1 bg-surface-high p-1 rounded-xl border border-outline self-stretch sm:self-auto justify-between">
                {(['Semua', 'Pupuk', 'Pestisida'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterKategori(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      filterKategori === tab
                        ? 'bg-primary text-white border border-black shadow-[1px_1px_0px_0px_#000] font-black'
                        : 'text-on-surface-muted hover:text-on-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content List / Table */}
            {filteredList.length === 0 ? (
              <EmptyState 
                icon="compost" 
                title="Belum Ada Jadwal Perawatan" 
                message="Gunakan form di sebelah kiri untuk membuat jadwal pemupukan atau penyemprotan pestisida." 
              />
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-high border-b-2 border-black text-on-surface-muted font-bold uppercase tracking-wider">
                        <th className="p-3">Jadwal &amp; Lahan</th>
                        <th className="p-3">Bahan &amp; Kategori</th>
                        <th className="p-3">Metode &amp; Tujuan</th>
                        <th className="p-3">Dosis Target (/Ha)</th>
                        <th className="p-3 text-right">Dosis Riil (Blok)</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-outline font-medium">
                      {filteredList.map(p => {
                        const blok = blokLahan.find(b => b.id === p.blokId);
                        const luas = blok ? calculateLuasLahan(blok.jumlahBedengan, blok.panjangBedengan, blok.lebarBedengan, blok.jarakAntarBedengan) : 0;
                        const dosisAktual = calculateActualFertilizerDose(p.dosisPerHektar, luas);
                        const airAktual = p.literAirPerHektar ? calculateActualFertilizerDose(p.literAirPerHektar, luas) : 0;
                        const isPestisida = p.kategori === 'Pestisida';

                        return (
                          <tr key={p.id} className="hover:bg-surface-high/60 transition">
                            {/* Tanggal & Blok */}
                            <td className="p-3 align-top">
                              <span className="font-mono font-bold text-on-surface block">
                                {p.tanggalAplikasi}
                              </span>
                              <span className="inline-block mt-1 font-bold text-[10px] bg-[#154734] text-white px-2 py-0.5 rounded border border-[#0A0A0A] shadow-[1px_1px_0px_0px_#0A0A0A]">
                                {blok?.nama || 'Lahan'}
                              </span>
                            </td>

                            {/* Bahan & Kategori */}
                            <td className="p-3 align-top">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                                  isPestisida 
                                    ? 'bg-danger/10 text-danger border-danger' 
                                    : 'bg-success/10 text-success border-success'
                                }`}>
                                  {p.kategori}
                                </span>
                              </div>
                              <span className="font-bold text-on-surface block text-xs mt-1">
                                {p.jenisPupuk}
                              </span>
                            </td>

                            {/* Metode & Tujuan */}
                            <td className="p-3 align-top">
                              <span className="font-bold text-on-surface block">
                                {p.metodeAplikasi}
                              </span>
                              <span className="text-[11px] text-on-surface-muted block truncate max-w-[140px]" title={p.tujuan}>
                                {p.tujuan || '-'}
                              </span>
                            </td>

                            {/* Dosis Target per Ha */}
                            <td className="p-3 align-top text-on-surface-muted">
                              <span className="font-bold text-on-surface block">
                                {p.dosisPerHektar} {p.satuanDosis}/Ha
                              </span>
                              {p.literAirPerHektar ? (
                                <span className="text-[10px] text-on-surface-muted block">
                                  {p.literAirPerHektar} L Air/Ha
                                </span>
                              ) : null}
                            </td>

                            {/* Dosis Aktual Blok */}
                            <td className="p-3 align-top text-right">
                              <div className="font-brutal font-black text-sm text-[#0288D1] bg-[#E1F5FE] px-2 py-1 rounded-lg border border-[#0288D1] inline-block shadow-[1px_1px_0px_0px_#0288D1]">
                                {dosisAktual.toFixed(2)} {p.satuanDosis}
                              </div>
                              {p.literAirPerHektar ? (
                                <span className="text-[10px] text-on-surface-muted block mt-1 font-bold">
                                  {airAktual.toFixed(1)} Liter Air
                                </span>
                              ) : null}
                            </td>

                            {/* Actions */}
                            <td className="p-3 align-top text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  type="button"
                                  onClick={() => handleEdit(p)} 
                                  className="p-1.5 bg-surface rounded-lg border border-black hover:bg-action hover:text-on-action transition cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                                  title="Edit Rencana"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDelete(p.id)} 
                                  className="p-1.5 bg-surface rounded-lg border border-black hover:bg-danger hover:text-white transition cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                                  title="Hapus Jadwal"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="flex flex-col gap-3 md:hidden">
                  {filteredList.map(p => {
                    const blok = blokLahan.find(b => b.id === p.blokId);
                    const luas = blok ? calculateLuasLahan(blok.jumlahBedengan, blok.panjangBedengan, blok.lebarBedengan, blok.jarakAntarBedengan) : 0;
                    const dosisAktual = calculateActualFertilizerDose(p.dosisPerHektar, luas);
                    const airAktual = p.literAirPerHektar ? calculateActualFertilizerDose(p.literAirPerHektar, luas) : 0;
                    const isPestisida = p.kategori === 'Pestisida';

                    return (
                      <div 
                        key={p.id} 
                        className="p-3.5 bg-surface-high rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col gap-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-outline pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-on-surface">
                              {p.tanggalAplikasi}
                            </span>
                            <span className="font-bold text-[10px] bg-[#154734] text-white px-2 py-0.5 rounded border border-[#0A0A0A]">
                              {blok?.nama || 'Lahan'}
                            </span>
                          </div>

                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            isPestisida 
                              ? 'bg-danger/10 text-danger border-danger' 
                              : 'bg-success/10 text-success border-success'
                          }`}>
                            {p.kategori}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-black text-sm text-on-surface block">
                              {p.jenisPupuk}
                            </span>
                            <span className="text-[11px] font-medium text-on-surface-muted block mt-0.5">
                              Metode: {p.metodeAplikasi} {p.tujuan ? `• ${p.tujuan}` : ''}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-on-surface-muted block uppercase">
                              Dosis Riil Blok
                            </span>
                            <span className="font-brutal font-black text-sm text-[#0288D1] bg-[#E1F5FE] px-2 py-0.5 rounded border border-[#0288D1] inline-block">
                              {dosisAktual.toFixed(2)} {p.satuanDosis}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline/60 text-[11px]">
                          <span className="text-on-surface-muted">
                            Target: {p.dosisPerHektar} {p.satuanDosis}/Ha {p.literAirPerHektar ? `(${airAktual.toFixed(1)}L Air)` : ''}
                          </span>

                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => handleEdit(p)} 
                              className="px-2.5 py-1 bg-surface rounded-lg border border-black font-bold hover:bg-action transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDelete(p.id)} 
                              className="px-2.5 py-1 bg-surface rounded-lg border border-black font-bold text-danger hover:bg-danger hover:text-white transition cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
