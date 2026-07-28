import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { Select } from '../components/Select';
import { NumberInput } from '../components/NumberInput';
import { ConfirmModal } from '../components/ConfirmModal';
import { ReportPdfModal } from '../components/ReportPdfModal';
import { createCsv } from '../utils/csv';
import { formatLocalDate } from '../utils/localDate';

const kategoriOptions = [
  { value: "Persiapan Lahan", label: "Persiapan Lahan" },
  { value: "Penanaman", label: "Penanaman" },
  { value: "Pemeliharaan", label: "Pemeliharaan (Penyiangan dll)" },
  { value: "Pemupukan", label: "Pemupukan" },
  { value: "Aplikasi Pestisida", label: "Aplikasi Pestisida" },
  { value: "Pengendalian Hama", label: "Pengendalian Hama (Lainnya)" },
  { value: "Irigasi", label: "Irigasi" },
  { value: "Panen", label: "Panen" },
  { value: "Lainnya", label: "Lainnya" }
];

export function LogAktivitasView() {
  const { blokLahan, logAktivitas, addLogAktivitas, updateLogAktivitas, deleteLogAktivitas } = useTaniOps();
  const { showToast } = useToast();
  const initialForm = { tanggal: formatLocalDate(), blokId: '', kategori: 'Persiapan Lahan', deskripsi: '', biaya: 0, petugas: '' };
  const [form, setForm] = useState(initialForm);
  const [filterKategori, setFilterKategori] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tanggal || !form.blokId || !form.deskripsi) return;
    if (form.tanggal > formatLocalDate()) {
      showToast('Tanggal aktivitas tidak boleh berada di masa depan.', 'error');
      return;
    }
    if (editingId) {
      updateLogAktivitas(editingId, form);
      showToast('Aktivitas berhasil diupdate', 'success');
    } else {
      addLogAktivitas(form);
      showToast('Aktivitas berhasil dicatat', 'success');
    }
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (l: any) => {
    setForm(l);
    setEditingId(l.id);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id); setDeleteMessage("Yakin ingin menghapus log ini?"); setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const id = deleteId;
    if (id) {
      deleteLogAktivitas(id);
      showToast('Log aktivitas berhasil dihapus', 'success');
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleExportCSV = () => {
    if (logAktivitas.length === 0) return;
    const rows = logAktivitas.map(l => {
      const b = blokLahan.find(b => b.id === l.blokId);
      return [l.tanggal, b?.nama || '', l.kategori, l.deskripsi, l.biaya, l.petugas];
    });
    const csv = createCsv(['Tanggal', 'Blok', 'Kategori', 'Deskripsi', 'Biaya', 'Petugas'], rows);
    const csvUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'log_aktivitas.csv';
    a.click();
    URL.revokeObjectURL(csvUrl);
  };

  const filteredLogs = filterKategori ? logAktivitas.filter(l => l.kategori === filterKategori) : logAktivitas;

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Jurnal Aktivitas"
        subtitle="Catat pekerjaan lapangan, petugas, dan biaya aktual untuk setiap blok."
        action={
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#154734] hover:bg-[#0e3023] text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Laporan PDF Bulanan</span>
          </button>
          <button 
            type="button"
            onClick={handleExportCSV} 
            disabled={logAktivitas.length === 0} 
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-slate-200 disabled:opacity-50 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col gap-4">
          <h2 className="font-display font-black uppercase text-base text-[#0A0A0A] border-b-2 border-[#0A0A0A] pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#154734]">history_edu</span>
            {editingId ? 'Edit Aktivitas' : 'Catat Aktivitas Baru'}
          </h2>

          <form onSubmit={handleAddLog} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Tanggal</label>
              <input 
                type="date" 
                value={form.tanggal} 
                onChange={e => setForm({...form, tanggal: e.target.value})} 
                className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded focus:outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Blok Lahan</label>
              <Select 
                value={form.blokId} 
                onChange={val => setForm({...form, blokId: val})} 
                options={blokLahan.map(b => ({ value: b.id, label: b.nama }))}
                placeholder="-- Pilih Blok --"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Kategori</label>
              <Select 
                value={form.kategori} 
                onChange={val => setForm({...form, kategori: val})} 
                options={kategoriOptions}
                placeholder="-- Pilih Kategori --"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Deskripsi</label>
              <textarea 
                value={form.deskripsi} 
                onChange={e => setForm({...form, deskripsi: e.target.value})} 
                className="w-full bg-white border-2 border-[#0A0A0A] p-3 text-xs text-[#0A0A0A] rounded focus:outline-none min-h-[80px]" 
                placeholder="Detail pekerjaan..." 
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Biaya (Rp)</label>
                <NumberInput 
                  value={form.biaya} 
                  onNumberChange={v => setForm({...form, biaya: v})} 
                  className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded focus:outline-none" 
                  placeholder="0" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Petugas</label>
                <input 
                  type="text" 
                  value={form.petugas} 
                  onChange={e => setForm({...form, petugas: e.target.value})} 
                  className="w-full bg-white border-2 border-[#0A0A0A] px-3 py-2 text-xs text-[#0A0A0A] rounded focus:outline-none" 
                  placeholder="Nama..." 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!form.tanggal || !form.blokId || !form.deskripsi} 
              className="w-full py-3 px-4 bg-[#154734] text-white font-extrabold text-xs uppercase tracking-wider rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#0e3023] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 transition cursor-pointer mt-2"
            >
              {editingId ? 'UPDATE AKTIVITAS' : 'CATAT AKTIVITAS'}
            </button>

            {editingId && (
              <button 
                type="button" 
                onClick={() => { setForm(initialForm); setEditingId(null); }} 
                className="w-full py-2 px-3 bg-[#E6E6DC] text-[#0A0A0A] font-bold text-xs rounded border border-[#0A0A0A] hover:bg-[#d0d0c4] transition cursor-pointer"
              >
                BATAL EDIT
              </button>
            )}
          </form>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          {logAktivitas.length === 0 ? (
            <EmptyState icon="history_edu" title="Belum Ada Aktivitas Tercatat" message="Gunakan form di samping untuk mulai mencatat pekerjaan harian, pemeliharaan, atau panen." />
          ) : (
            <div className="p-4 sm:p-5 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b-2 border-[#0A0A0A]">
                <h3 className="font-display font-black text-base text-[#0A0A0A] uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#154734]">list_alt</span>
                  Riwayat Aktivitas ({filteredLogs.length})
                </h3>
                <div className="w-full sm:w-56">
                  <Select 
                    value={filterKategori} 
                    onChange={val => setFilterKategori(val === 'all' ? '' : val)} 
                    options={[{ value: 'all', label: 'Semua Kategori' }, ...kategoriOptions]}
                    placeholder="Semua Kategori"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {filteredLogs.map(l => {
                  const b = blokLahan.find(b => b.id === l.blokId);
                  return (
                    <div key={l.id} className="bg-[#E6E6DC]/20 border-2 border-[#0A0A0A] p-3.5 rounded flex flex-col gap-2 relative group hover:bg-[#E6E6DC]/40 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-[#0A0A0A] bg-white px-2 py-0.5 rounded border border-[#0A0A0A]">
                            {l.tanggal}
                          </span>
                          <span className="text-[11px] font-extrabold text-white bg-[#154734] px-2 py-0.5 rounded border border-[#0A0A0A]">
                            {b?.nama || 'Blok Lahan'}
                          </span>
                          <span className="text-[11px] font-bold text-[#0A0A0A] bg-[#E6E6DC] px-2 py-0.5 rounded border border-[#0A0A0A]">
                            {l.kategori}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => handleEdit(l)} 
                            className="p-1 bg-white border border-[#0A0A0A] rounded text-[#0A0A0A] hover:bg-[#154734] hover:text-white transition cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(l.id)} 
                            className="p-1 bg-white border border-[#0A0A0A] rounded text-[#C43C2C] hover:bg-[#C43C2C] hover:text-white transition cursor-pointer"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-sans text-[#0A0A0A] leading-relaxed pt-1">
                        {l.deskripsi}
                      </p>

                      <div className="pt-2 border-t border-[#0A0A0A]/20 flex flex-wrap gap-4 text-xs font-mono text-[#5C5C5C]">
                        {l.petugas && (
                          <span><span className="font-bold text-[#0A0A0A]">PIC:</span> {l.petugas}</span>
                        )}
                        {l.biaya > 0 && (
                          <span><span className="font-bold text-[#0A0A0A]">Biaya:</span> Rp {l.biaya.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <p className="text-center text-xs text-[#5C5C5C] py-8 bg-[#E6E6DC]/20 border border-dashed border-[#0A0A0A] rounded">
                    Tidak ada log untuk filter ini.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
