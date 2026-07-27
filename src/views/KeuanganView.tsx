import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { Select } from '../components/Select';
import { NumberInput } from '../components/NumberInput';
import { ConfirmModal } from '../components/ConfirmModal';
import { ReportPdfModal } from '../components/ReportPdfModal';

export function KeuanganView() {
  const { keuangan, addKeuangan, updateKeuangan, deleteKeuangan, blokLahan, tanaman } = useTaniOps();
  const { showToast } = useToast();

  // Mobile Tab State ('analisis' | 'input')
  const [activeTab, setActiveTab] = useState<'analisis' | 'input'>('analisis');

  const initialForm = { 
    blokId: 'overall', 
    komoditas: '', 
    biayaTetap: 0, 
    namaBenih: '', 
    jumlahBenih: 0, 
    satuanBenih: 'Pack', 
    hargaBenih: 0, 
    tanggalPembelianBenih: '', 
    biayaBenih: 0, 
    namaPupuk: '', 
    jumlahPupuk: 0, 
    satuanPupuk: 'Kilogram', 
    hargaPupuk: 0, 
    tanggalPembelianPupuk: '', 
    biayaPupuk: 0, 
    namaPestisida: '', 
    jumlahPestisida: 0, 
    satuanPestisida: 'Liter', 
    hargaPestisida: 0, 
    tanggalPembelianPestisida: '', 
    biayaPestisida: 0, 
    biayaLain: 0, 
    targetHasil: 0, 
    satuanHasil: 'Kilogram', 
    hargaJual: 0 
  };

  const [form, setForm] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Multi-item breakdown state for Pupuk, Pestisida, & Benih
  const [multiItemType, setMultiItemType] = useState<'pupuk' | 'pestisida' | 'benih' | null>(null);
  const [multiItems, setMultiItems] = useState<{ nama: string; jumlah: number; satuan: string; harga: number }[]>([
    { nama: '', jumlah: 1, satuan: 'Botol', harga: 0 },
    { nama: '', jumlah: 1, satuan: 'Pack', harga: 0 }
  ]);

  const openMultiItemModal = (type: 'pupuk' | 'pestisida' | 'benih') => {
    setMultiItemType(type);
    setMultiItems([
      { nama: '', jumlah: 1, satuan: type === 'pupuk' ? 'Karung' : type === 'pestisida' ? 'Botol' : 'Pack', harga: 0 },
      { nama: '', jumlah: 1, satuan: type === 'pupuk' ? 'Kg' : type === 'pestisida' ? 'Sachet' : 'Pack', harga: 0 }
    ]);
  };

  const addMultiItemRow = () => {
    const defaultSatuan = multiItemType === 'pupuk' ? 'Karung' : multiItemType === 'pestisida' ? 'Botol' : 'Pack';
    setMultiItems(prev => [...prev, { nama: '', jumlah: 1, satuan: defaultSatuan, harga: 0 }]);
  };

  const removeMultiItemRow = (idx: number) => {
    if (multiItems.length <= 1) return;
    setMultiItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateMultiItemRow = (idx: number, field: string, val: any) => {
    setMultiItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const applyMultiItems = () => {
    const validRows = multiItems.filter(r => r.nama.trim() !== '' || r.harga > 0);
    if (validRows.length === 0) {
      showToast('Masukkan minimal 1 merek atau nama produk', 'error');
      return;
    }

    const totalCost = validRows.reduce((acc, r) => acc + (r.jumlah || 0) * (r.harga || 0), 0);
    const combinedNames = validRows
      .map(r => `${r.nama || 'Produk'} (${r.jumlah || 1} ${r.satuan || 'Item'} @ ${formatCurrency(r.harga)})`)
      .join(', ');

    if (multiItemType === 'pupuk') {
      setForm((prev: any) => ({
        ...prev,
        namaPupuk: combinedNames,
        jumlahPupuk: 1,
        satuanPupuk: 'Paket Rincian',
        hargaPupuk: totalCost
      }));
    } else if (multiItemType === 'pestisida') {
      setForm((prev: any) => ({
        ...prev,
        namaPestisida: combinedNames,
        jumlahPestisida: 1,
        satuanPestisida: 'Paket Rincian',
        hargaPestisida: totalCost
      }));
    } else if (multiItemType === 'benih') {
      setForm((prev: any) => ({
        ...prev,
        namaBenih: combinedNames,
        jumlahBenih: 1,
        satuanBenih: 'Paket Rincian',
        hargaBenih: totalCost
      }));
    }

    setMultiItemType(null);
    showToast(`Rincian multi-merek ${multiItemType} berhasil dihitung & diterapkan!`, 'success');
  };

  // Set default crop if available
  useEffect(() => {
    if (tanaman.length > 0 && !form.komoditas && !editingId) {
      setForm((prev: any) => ({ ...prev, komoditas: tanaman[0].komoditas }));
    }
  }, [tanaman, form.komoditas, editingId]);

  // Live Auto Calculations for Form
  const currentBiayaBenih = (form.jumlahBenih || 0) * (form.hargaBenih || 0);
  const currentBiayaPupuk = (form.jumlahPupuk || 0) * (form.hargaPupuk || 0);
  const currentBiayaPestisida = (form.jumlahPestisida || 0) * (form.hargaPestisida || 0);
  const currentTotalBiaya = (form.biayaTetap || 0) + currentBiayaBenih + currentBiayaPupuk + currentBiayaPestisida + (form.biayaLain || 0);
  const currentEstimasiOmset = (form.targetHasil || 0) * (form.hargaJual || 0);
  const currentEstimasiLaba = currentEstimasiOmset - currentTotalBiaya;

  // Global Financial Metrics
  const totalSemuaBiaya = keuangan.reduce((acc, k) => 
    acc + (k.biayaTetap || 0) + (k.biayaBenih || 0) + (k.biayaPupuk || 0) + (k.biayaPestisida || 0) + (k.biayaLain || 0), 0
  );
  const totalSemuaPendapatan = keuangan.reduce((acc, k) => acc + (k.targetHasil || 0) * (k.hargaJual || 0), 0);
  const totalLabaBersih = totalSemuaPendapatan - totalSemuaBiaya;
  const aggregateBcRatio = totalSemuaBiaya > 0 ? (totalSemuaPendapatan / totalSemuaBiaya) : 0;
  const isOverallProfitable = totalLabaBersih >= 0;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...form,
      biayaBenih: currentBiayaBenih,
      biayaPupuk: currentBiayaPupuk,
      biayaPestisida: currentBiayaPestisida
    };

    if (editingId) {
      updateKeuangan(editingId, finalData);
      showToast('Analisis keuangan berhasil diperbarui', 'success');
    } else {
      addKeuangan(finalData);
      showToast('Analisis keuangan baru berhasil disimpan', 'success');
    }
    setForm(initialForm);
    setEditingId(null);
    setActiveTab('analisis');
  };

  const handleEdit = (k: any) => {
    setForm(k);
    setEditingId(k.id);
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteMessage("Yakin ingin menghapus data analisis keuangan ini?");
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteKeuangan(deleteId);
      showToast('Data keuangan berhasil dihapus', 'success');
      if (editingId === deleteId) {
        setForm(initialForm);
        setEditingId(null);
      }
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const formatCurrency = (val: number) => {
    if (isNaN(val)) return 'Rp 0';
    return val < 0 
      ? '-Rp ' + Math.abs(val).toLocaleString('id-ID') 
      : 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Biaya & Profitabilitas Lahan"
        subtitle="Analisis pengeluaran operasional, proyeksi omset, BEP panen, dan estimasi laba rugi."
        action={
          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#154734] hover:bg-[#0e3023] text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Unduh Laporan PDF</span>
          </button>
        }
      />

      <ReportPdfModal 
        isOpen={pdfModalOpen} 
        onClose={() => setPdfModalOpen(false)} 
      />

      <ConfirmModal 
        isOpen={deleteConfirmOpen} 
        message={deleteMessage} 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteConfirmOpen(false)} 
      />

      {/* 1. EXECUTIVE KPI SUMMARY (TOP BANNER) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Biaya */}
        <div className="p-3.5 sm:p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] sm:text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Total Modal &amp; Biaya Input</span>
            <span className="material-symbols-outlined text-[#154734] text-[20px] bg-[#E6E6DC] p-1 rounded border border-[#0A0A0A]">payments</span>
          </div>
          <div>
            <span className="font-mono font-black text-base sm:text-xl text-[#0A0A0A] block truncate">
              {formatCurrency(totalSemuaBiaya)}
            </span>
            <span className="text-[10px] text-[#5C5C5C]">Investasi Bibit, Pupuk, &amp; Pestisida</span>
          </div>
        </div>

        {/* Card 2: Est Pendapatan */}
        <div className="p-3.5 sm:p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] sm:text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Est. Omset Panen</span>
            <span className="material-symbols-outlined text-[#154734] text-[20px] bg-[#E6E6DC] p-1 rounded border border-[#0A0A0A]">trending_up</span>
          </div>
          <div>
            <span className="font-mono font-black text-base sm:text-xl text-[#154734] block truncate">
              {formatCurrency(totalSemuaPendapatan)}
            </span>
            <span className="text-[10px] text-[#5C5C5C]">Proyeksi Hasil Jual</span>
          </div>
        </div>

        {/* Card 3: Est Laba Bersih */}
        <div className="p-3.5 sm:p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] sm:text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Profit Net / Margin</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0A0A0A] ${isOverallProfitable ? 'bg-[#154734] text-white' : 'bg-[#C43C2C] text-white'}`}>
              {isOverallProfitable ? 'SURPLUS' : 'DEFISIT'}
            </span>
          </div>
          <div>
            <span className={`font-mono font-black text-base sm:text-xl block truncate ${isOverallProfitable ? 'text-[#154734]' : 'text-[#C43C2C]'}`}>
              {formatCurrency(totalLabaBersih)}
            </span>
            <span className="text-[10px] text-[#5C5C5C]">Proyeksi Keuntungan Bersih</span>
          </div>
        </div>

        {/* Card 4: B/C Ratio */}
        <div className="p-3.5 sm:p-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] sm:text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">B/C Ratio</span>
            <span className="material-symbols-outlined text-[#154734] text-[20px] bg-[#E6E6DC] p-1 rounded border border-[#0A0A0A]">calculate</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-black text-base sm:text-xl text-[#0A0A0A]">
                {aggregateBcRatio.toFixed(2)}
              </span>
              <span className={`text-[10px] font-bold ${aggregateBcRatio >= 1 ? 'text-[#154734]' : 'text-[#C43C2C]'}`}>
                {aggregateBcRatio >= 1 ? 'Sangat Layak' : 'Evaluasi Input'}
              </span>
            </div>
            <span className="text-[10px] text-[#5C5C5C]">Rasio Kelayakan Usaha</span>
          </div>
        </div>
      </div>

      {/* 2. MOBILE TAB SWITCHER */}
      <div className="flex lg:hidden bg-[#E6E6DC] p-1 rounded border-2 border-[#0A0A0A]">
        <button
          type="button"
          onClick={() => setActiveTab('analisis')}
          className={`flex-1 py-2.5 text-xs rounded transition-all flex items-center justify-center gap-2 font-bold ${
            activeTab === 'analisis' 
              ? 'bg-[#154734] text-white border border-[#0A0A0A]' 
              : 'text-[#0A0A0A] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          Ringkasan &amp; Daftar ({keuangan.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('input')}
          className={`flex-1 py-2.5 text-xs rounded transition-all flex items-center justify-center gap-2 font-bold ${
            activeTab === 'input' 
              ? 'bg-[#154734] text-white border border-[#0A0A0A]' 
              : 'text-[#0A0A0A] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {editingId ? 'edit_note' : 'add_circle'}
          </span>
          {editingId ? 'Edit Parameter' : 'Input Parameter'}
        </button>
      </div>

      {/* 3. MAIN CONTENT LAYOUT (FORM + LIST) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL FORM INPUT (5 Cols on Desktop) */}
        <div className={`lg:col-span-5 ${activeTab === 'input' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b-2 border-[#0A0A0A]">
              <h2 className="font-display font-black uppercase text-base sm:text-lg text-[#0A0A0A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#154734]">edit_square</span>
                {editingId ? 'Edit Parameter Keuangan' : 'Input Parameter Keuangan'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setForm(initialForm); setEditingId(null); }}
                  className="text-xs text-[#C43C2C] hover:underline font-bold"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleCalculate} className="flex flex-col gap-4">
              
              {/* SECTION A: KOMODITAS & LAHAN */}
              <div className="p-3 bg-[#E6E6DC]/40 rounded border border-[#0A0A0A] flex flex-col gap-3">
                <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#154734]">eco</span>
                  1. Lahan &amp; Komoditas
                </span>
                
                {tanaman.length > 0 ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5C5C] mb-1">
                      Pilih Komoditas
                    </label>
                    <Select
                      value={form.komoditas || (tanaman[0]?.komoditas || '')}
                      onChange={v => setForm({ ...form, komoditas: v })}
                      options={tanaman.map(t => ({
                        value: t.komoditas,
                        label: `${t.komoditas} ${t.varietas ? `(${t.varietas})` : ''} - ${blokLahan.find(b => b.id === t.blokId)?.nama || 'Blok Lahan'}`
                      }))}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5C5C] mb-1">
                      Nama Komoditas / Tanaman
                    </label>
                    <input
                      type="text"
                      value={form.komoditas || ''}
                      onChange={e => setForm({ ...form, komoditas: e.target.value })}
                      placeholder="Contoh: Cabai Merah Keriting"
                      className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2.5 min-h-[44px] text-xs font-medium rounded text-[#0A0A0A] focus:outline-none"
                      required
                    />
                  </div>
                )}
              </div>

              {/* SECTION B: BIAYA OPERASIONAL */}
              <div className="p-3 bg-[#E6E6DC]/40 rounded border border-[#0A0A0A] flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#154734]">receipt_long</span>
                    2. Rincian Modal &amp; Biaya Input
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0A0A0A]">
                    Total: {formatCurrency(currentTotalBiaya)}
                  </span>
                </div>

                {/* Sub: Biaya Tetap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5C5C] mb-1">
                      Biaya Tetap / Sewa (Rp)
                    </label>
                    <NumberInput 
                      value={form.biayaTetap || 0} 
                      onNumberChange={v => setForm({ ...form, biayaTetap: v })} 
                      className="w-full bg-white border border-[#0A0A0A] px-3 py-2 text-xs font-mono rounded text-[#0A0A0A] focus:outline-none min-h-[40px]" 
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C5C5C] mb-1">
                      Biaya Lainnya (Rp)
                    </label>
                    <NumberInput 
                      value={form.biayaLain || 0} 
                      onNumberChange={v => setForm({ ...form, biayaLain: v })} 
                      className="w-full bg-white border border-[#0A0A0A] px-3 py-2 text-xs font-mono rounded text-[#0A0A0A] focus:outline-none min-h-[40px]" 
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Sub: Benih */}
                <div className="p-2.5 bg-[#FEFEFA] rounded border border-[#0A0A0A] flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-[#0A0A0A]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#154734]">spa</span>
                      Investasi Benih / Bibit
                    </span>
                    <span className="font-mono text-[#0A0A0A]">{formatCurrency(currentBiayaBenih)}</span>
                  </div>
                  <input
                    type="text"
                    value={form.namaBenih || ''}
                    onChange={e => setForm({ ...form, namaBenih: e.target.value })}
                    placeholder="Nama Varietas / Benih (Contoh: Cabai Orion, Tomat Servo)"
                    className="w-full bg-[#E6E6DC]/30 border border-[#0A0A0A] px-2.5 py-1.5 text-xs rounded text-[#0A0A0A]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-[#5C5C5C] block">Jumlah</span>
                      <NumberInput
                        value={form.jumlahBenih || 0}
                        onNumberChange={v => setForm({ ...form, jumlahBenih: v })}
                        className="w-full bg-[#E6E6DC]/30 border border-[#0A0A0A] px-2 py-1 text-xs font-mono rounded text-[#0A0A0A]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5C5C5C] block">Satuan</span>
                      <Select
                        value={form.satuanBenih || 'Pack'}
                        onChange={v => setForm({ ...form, satuanBenih: v })}
                        options={[
                          { value: 'Pack', label: 'Pack' },
                          { value: 'Sachet', label: 'Sachet' },
                          { value: 'Botol', label: 'Botol' },
                          { value: 'Karung', label: 'Karung' },
                          { value: 'Kilogram', label: 'Kg' },
                          { value: 'Liter', label: 'Liter' },
                          { value: 'Paket Rincian', label: 'Paket Rincian' }
                        ]}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Harga / Satuan</span>
                      <NumberInput
                        value={form.hargaBenih || 0}
                        onNumberChange={v => setForm({ ...form, hargaBenih: v })}
                        className="w-full bg-surface-high border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-outline/40">
                    <button
                      type="button"
                      onClick={() => openMultiItemModal('benih')}
                      className="text-[11px] font-bold text-action hover:underline flex items-center gap-1 active:scale-95 transition"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      Rincikan Multi-Merek / Multi-Varietas Benih
                    </button>
                  </div>
                </div>

                {/* Sub: Pupuk */}
                <div className="p-2.5 bg-surface rounded-lg border border-outline flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-on-surface">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-action">science</span>
                      Investasi Pupuk &amp; Nutrisi
                    </span>
                    <span className="font-mono text-on-surface">{formatCurrency(currentBiayaPupuk)}</span>
                  </div>
                  <input
                    type="text"
                    value={form.namaPupuk || ''}
                    onChange={e => setForm({ ...form, namaPupuk: e.target.value })}
                    placeholder="Nama Pupuk & Nutrisi (Contoh: NPK 16-16-16, Urea, Gandasil D)"
                    className="w-full bg-surface-high border border-outline px-2.5 py-1.5 text-xs rounded text-on-surface"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Jumlah</span>
                      <NumberInput
                        value={form.jumlahPupuk || 0}
                        onNumberChange={v => setForm({ ...form, jumlahPupuk: v })}
                        className="w-full bg-surface-high border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Satuan</span>
                      <Select
                        value={form.satuanPupuk || 'Kilogram'}
                        onChange={v => setForm({ ...form, satuanPupuk: v })}
                        options={[
                          { value: 'Karung', label: 'Karung' },
                          { value: 'Kilogram', label: 'Kg' },
                          { value: 'Pack', label: 'Pack' },
                          { value: 'Sachet', label: 'Sachet' },
                          { value: 'Botol', label: 'Botol' },
                          { value: 'Liter', label: 'Liter' },
                          { value: 'Mililiter', label: 'ml' },
                          { value: 'Paket Rincian', label: 'Paket Rincian' }
                        ]}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Harga / Satuan</span>
                      <NumberInput
                        value={form.hargaPupuk || 0}
                        onNumberChange={v => setForm({ ...form, hargaPupuk: v })}
                        className="w-full bg-surface-high border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-outline/40">
                    <button
                      type="button"
                      onClick={() => openMultiItemModal('pupuk')}
                      className="text-[11px] font-bold text-action hover:underline flex items-center gap-1 active:scale-95 transition"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      Rincikan Multi-Merek (2-3 Pupuk Berbeda)
                    </button>
                  </div>
                </div>

                {/* Sub: Pestisida */}
                <div className="p-2.5 bg-surface rounded-lg border border-outline flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-on-surface">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-action">shield</span>
                      Investasi Pestisida &amp; Proteksi
                    </span>
                    <span className="font-mono text-on-surface">{formatCurrency(currentBiayaPestisida)}</span>
                  </div>
                  <input
                    type="text"
                    value={form.namaPestisida || ''}
                    onChange={e => setForm({ ...form, namaPestisida: e.target.value })}
                    placeholder="Nama Pestisida / Proteksi (Contoh: Abamektin, Imidakloprid, Mancozeb)"
                    className="w-full bg-surface-high border border-outline px-2.5 py-1.5 text-xs rounded text-on-surface"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Jumlah</span>
                      <NumberInput
                        value={form.jumlahPestisida || 0}
                        onNumberChange={v => setForm({ ...form, jumlahPestisida: v })}
                        className="w-full bg-surface-high border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Satuan</span>
                      <Select
                        value={form.satuanPestisida || 'Liter'}
                        onChange={v => setForm({ ...form, satuanPestisida: v })}
                        options={[
                          { value: 'Liter', label: 'Liter' },
                          { value: 'Mililiter', label: 'ml' },
                          { value: 'Pack', label: 'Pack' },
                          { value: 'Kilogram', label: 'Kg' },
                          { value: 'Paket Rincian', label: 'Paket Rincian' }
                        ]}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Harga / Satuan</span>
                      <NumberInput
                        value={form.hargaPestisida || 0}
                        onNumberChange={v => setForm({ ...form, hargaPestisida: v })}
                        className="w-full bg-surface-high border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-outline/40">
                    <button
                      type="button"
                      onClick={() => openMultiItemModal('pestisida')}
                      className="text-[11px] font-bold text-action hover:underline flex items-center gap-1 active:scale-95 transition"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      Rincikan Multi-Merek (2-3 Pestisida Berbeda)
                    </button>
                  </div>
                </div>

              </div>

              {/* SECTION C: HASIL PANEN & PENJUALAN */}
              <div className="p-3 bg-surface-high/60 rounded-xl border border-outline flex flex-col gap-3">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-action">inventory_2</span>
                  3. Target Panen &amp; Estimasi Jual
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-on-surface-muted mb-1">Target Hasil</label>
                    <NumberInput 
                      value={form.targetHasil || 0} 
                      onNumberChange={v => setForm({ ...form, targetHasil: v })} 
                      allowDecimals={true} 
                      className="w-full bg-surface border border-outline px-3 py-2 text-xs font-mono rounded-lg text-on-surface focus:outline-none focus:border-black min-h-[40px]" 
                      placeholder="0"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-on-surface-muted mb-1">Satuan Hasil</label>
                    <Select 
                      value={form.satuanHasil || 'Kilogram'} 
                      onChange={v => setForm({ ...form, satuanHasil: v })} 
                      options={[
                        { value: 'Kilogram', label: 'Kilogram' },
                        { value: 'Ton', label: 'Ton' },
                        { value: 'Ikat', label: 'Ikat' },
                        { value: 'Pack', label: 'Pack' },
                        { value: 'Karung', label: 'Karung' }
                      ]} 
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-on-surface-muted mb-1">Harga Jual / Satuan</label>
                    <NumberInput 
                      value={form.hargaJual || 0} 
                      onNumberChange={v => setForm({ ...form, hargaJual: v })} 
                      className="w-full bg-surface border border-outline px-3 py-2 text-xs font-mono rounded-lg text-on-surface focus:outline-none focus:border-black min-h-[40px]" 
                      placeholder="Rp 0"
                    />
                  </div>
                </div>

                {/* Live Output Banner */}
                <div className="p-3 bg-surface rounded-lg border-2 border-black flex flex-col gap-1.5 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-muted font-medium">Est. Omset Jual:</span>
                    <span className="font-mono font-bold text-success">{formatCurrency(currentEstimasiOmset)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-muted font-medium">Total Biaya Input Operasional:</span>
                    <span className="font-mono font-bold text-on-surface">{formatCurrency(currentTotalBiaya)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-outline font-bold">
                    <span className="text-on-surface">Est. Profit Bersih:</span>
                    <span className={`font-mono text-sm font-black ${currentEstimasiLaba >= 0 ? 'text-success' : 'text-amber-700'}`}>
                      {formatCurrency(currentEstimasiLaba)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  className="w-full bg-action text-on-action font-black text-sm py-3 px-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  {editingId ? 'UPDATE ANALISIS KEUANGAN' : 'SIMPAN & HITUNG ANALISIS'}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* PANEL DAFTAR & RINCIAN ANALISIS (7 Cols on Desktop) */}
        <div className={`lg:col-span-7 ${activeTab === 'analisis' ? 'block' : 'hidden lg:block'}`}>
          {keuangan.length === 0 ? (
            <EmptyState 
              icon="query_stats" 
              title="Belum Ada Analisis Keuangan" 
              message="Isi parameter komponen biaya dan target panen di panel untuk menghitung total pengeluaran, BEP, dan proyeksi laba bersih." 
            />
          ) : (
            <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b-2 border-[#0A0A0A]">
                <div>
                  <h3 className="font-display font-black uppercase text-base sm:text-lg text-[#0A0A0A] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#154734]">table_chart</span>
                    Daftar Rekapitulasi Analisis Input &amp; Keuangan ({keuangan.length})
                  </h3>
                  <p className="text-xs text-[#5C5C5C]">
                    Digabungkan rapi dalam 1 tabel. Bibit, pupuk, &amp; pestisida tercatat sebagai investasi input operasional.
                  </p>
                </div>
              </div>

              {/* Responsive Unified Table Layout */}
              <div className="overflow-x-auto -mx-1 sm:mx-0">
                <table className="w-full text-left border-collapse min-w-[620px]">
                  <thead>
                    <tr className="bg-[#E6E6DC] border-b-2 border-[#0A0A0A] text-[11px] font-extrabold text-[#0A0A0A] uppercase tracking-wider">
                      <th className="p-2.5 sm:p-3">Komoditas &amp; Target</th>
                      <th className="p-2.5 sm:p-3">Rincian Input (Bibit / Pupuk / Pestisida)</th>
                      <th className="p-2.5 sm:p-3 text-right">Biaya Input</th>
                      <th className="p-2.5 sm:p-3 text-right">Est. Omset &amp; Margin</th>
                      <th className="p-2.5 sm:p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b border-[#0A0A0A] text-xs">
                    {keuangan.map((k, idx) => {
                      const totalBiaya = (k.biayaTetap || 0) + (k.biayaBenih || 0) + (k.biayaPupuk || 0) + (k.biayaPestisida || 0) + (k.biayaLain || 0);
                      const totalOmset = (k.targetHasil || 0) * (k.hargaJual || 0);
                      const labaNet = totalOmset - totalBiaya;
                      const isProfit = labaNet >= 0;

                      return (
                        <tr key={k.id || idx} className="hover:bg-[#E6E6DC]/40 transition">
                          {/* Komoditas & Target */}
                          <td className="p-2.5 sm:p-3 align-top">
                            <span className="font-bold text-[#0A0A0A] block text-xs sm:text-sm">
                              {k.komoditas || 'Operasional Lahan'}
                            </span>
                            <span className="text-[10px] text-[#0A0A0A] bg-[#E6E6DC] px-1.5 py-0.5 rounded border border-[#0A0A0A] inline-block mt-1 font-mono font-bold">
                              Target: {k.targetHasil || 0} {k.satuanHasil || 'Kg'}
                            </span>
                          </td>

                          {/* Rincian Input */}
                          <td className="p-2.5 sm:p-3 align-top">
                            <div className="flex flex-col gap-1 text-[11px]">
                              {(k.namaBenih || k.biayaBenih > 0) && (
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#154734] shrink-0">spa</span>
                                  <span>Benih: <b>{k.namaBenih || '-'}</b> ({formatCurrency(k.biayaBenih)})</span>
                                </div>
                              )}
                              {(k.namaPupuk || k.biayaPupuk > 0) && (
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#154734] shrink-0">science</span>
                                  <span>Pupuk: <b>{k.namaPupuk || '-'}</b> ({formatCurrency(k.biayaPupuk)})</span>
                                </div>
                              )}
                              {(k.namaPestisida || k.biayaPestisida > 0) && (
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#C43C2C] shrink-0">shield</span>
                                  <span>Pestisida: <b>{k.namaPestisida || '-'}</b> ({formatCurrency(k.biayaPestisida)})</span>
                                </div>
                              )}
                              {k.biayaTetap > 0 && (
                                <div className="text-[10px] text-[#5C5C5C]">
                                  Tetap/Sewa: {formatCurrency(k.biayaTetap)}
                                </div>
                              )}
                              {k.biayaLain > 0 && (
                                <div className="text-[10px] text-[#5C5C5C]">
                                  Lainnya: {formatCurrency(k.biayaLain)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Biaya Input Operasional */}
                          <td className="p-2.5 sm:p-3 align-top text-right">
                            <span className="font-mono font-bold text-xs sm:text-sm text-[#0A0A0A] block">
                              {formatCurrency(totalBiaya)}
                            </span>
                            <span className="text-[10px] text-[#5C5C5C] block mt-0.5">
                              Modal Input Operasional
                            </span>
                          </td>

                          {/* Est Omset & Margin */}
                          <td className="p-2.5 sm:p-3 align-top text-right">
                            <span className="font-mono font-bold text-xs text-[#154734] block">
                              Omset: {formatCurrency(totalOmset)}
                            </span>
                            <span className={`font-mono font-black text-xs block mt-0.5 ${isProfit ? 'text-[#154734]' : 'text-[#C43C2C]'}`}>
                              Net: {formatCurrency(labaNet)}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#0A0A0A] inline-block mt-1 ${isProfit ? 'bg-[#154734]/20 text-[#154734]' : 'bg-[#C43C2C]/20 text-[#C43C2C]'}`}>
                              {isProfit ? 'SURPLUS' : 'DEFISIT'}
                            </span>
                          </td>

                          {/* Aksi */}
                          <td className="p-2.5 sm:p-3 align-top text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(k)}
                                className="p-1.5 bg-white hover:bg-[#154734] hover:text-white text-[#0A0A0A] border border-[#0A0A0A] rounded transition cursor-pointer"
                                title="Edit Data"
                              >
                                <span className="material-symbols-outlined text-[15px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(k.id)}
                                className="p-1.5 bg-white hover:bg-[#C43C2C] hover:text-white text-[#C43C2C] border border-[#0A0A0A] rounded transition cursor-pointer"
                                title="Hapus Data"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal Multi-Merek Multi-Item */}
      {multiItemType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="neo-card p-4 sm:p-6 bg-surface border-2 border-black max-w-lg w-full flex flex-col gap-4 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex justify-between items-center pb-2 border-b border-outline">
              <div>
                <h3 className="font-brutal font-black text-base sm:text-lg text-on-surface uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-action">inventory_2</span>
                  Rincian Multi-Merek {multiItemType.toUpperCase()}
                </h3>
                <p className="text-xs text-on-surface-muted">
                  Tambahkan beberapa merek/produk berbeda. Total biaya akan dihitung otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMultiItemType(null)}
                className="p-1 text-on-surface hover:bg-surface-high rounded"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {multiItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-surface-high/60 rounded-xl border border-outline flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                      Item Merek #{idx + 1}
                    </span>
                    {multiItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMultiItemRow(idx)}
                        className="text-danger hover:underline text-xs flex items-center gap-0.5 font-bold"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Hapus
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.nama}
                    onChange={e => updateMultiItemRow(idx, 'nama', e.target.value)}
                    placeholder={
                      multiItemType === 'pestisida'
                        ? 'Contoh: Abamektin EC / Fungisida Mancozeb / Perekat'
                        : multiItemType === 'pupuk'
                        ? 'Contoh: NPK Mutiara / Urea / Pupuk Organik Cair'
                        : 'Contoh: Benih Cabai Orion'
                    }
                    className="w-full bg-surface border border-outline px-2.5 py-1.5 text-xs rounded text-on-surface"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Jumlah</span>
                      <NumberInput
                        value={item.jumlah}
                        onNumberChange={v => updateMultiItemRow(idx, 'jumlah', v)}
                        className="w-full bg-surface border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Satuan</span>
                      <Select
                        value={item.satuan || 'Botol'}
                        onChange={v => updateMultiItemRow(idx, 'satuan', v)}
                        options={[
                          { value: 'Botol', label: 'Botol' },
                          { value: 'Pack', label: 'Pack' },
                          { value: 'Sachet', label: 'Sachet' },
                          { value: 'Karung', label: 'Karung' },
                          { value: 'Kg', label: 'Kg' },
                          { value: 'Liter', label: 'Liter' },
                          { value: 'ml', label: 'ml' }
                        ]}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-muted block">Harga / Satuan</span>
                      <NumberInput
                        value={item.harga}
                        onNumberChange={v => updateMultiItemRow(idx, 'harga', v)}
                        className="w-full bg-surface border border-outline px-2 py-1 text-xs font-mono rounded"
                      />
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-bold text-on-surface pt-1 border-t border-outline/40">
                    Subtotal: <span className="font-mono text-action">{formatCurrency((item.jumlah || 0) * (item.harga || 0))}</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMultiItemRow}
                className="py-2.5 px-3 border border-dashed border-black bg-surface hover:bg-surface-high rounded-xl text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-action">add_circle</span>
                + Tambah Item Merek Lain
              </button>
            </div>

            {/* Total Footer */}
            <div className="p-3.5 bg-action/10 rounded-xl border-2 border-action flex justify-between items-center text-xs">
              <div>
                <span className="text-on-surface-muted block text-[10px] uppercase font-bold">Total Gabungan ({multiItems.filter(r => r.nama.trim() || r.harga > 0).length} Merek)</span>
                <span className="font-mono font-black text-base sm:text-lg text-on-surface">
                  {formatCurrency(multiItems.reduce((acc, r) => acc + (r.jumlah || 0) * (r.harga || 0), 0))}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMultiItemType(null)}
                  className="px-3 py-1.5 bg-surface hover:bg-surface-high border border-black rounded text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={applyMultiItems}
                  className="px-4 py-1.5 bg-action text-on-action border-2 border-black rounded text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition"
                >
                  Terapkan Ke Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
