import { PageHeader } from '../components/PageHeader';
import React, { useState } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import {
  calculateActualFertilizerDose,
  calculateApplicationAmountSummary,
  calculateEffectiveLuasLahan,
  calculatePerHectareRate,
  type ApplicationInputBasis,
} from '../utils/calculations';
import { Select } from '../components/Select';
import { NumberInput } from '../components/NumberInput';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatLocalDate, getScheduleReminderState } from '../utils/localDate';
import { GardenCalendar } from '../components/GardenCalendar';
import { HelpTip } from '../components/HelpTip';

const getDoseUnitLabel = (unit: string) => {
  if (unit === 'Kilogram') return 'kg';
  if (unit === 'Mililiter') return 'mL';
  if (unit === 'Liter') return 'L';
  return unit.toLowerCase();
};

const formatAmount = (value: number, maximumFractionDigits = 2) =>
  value.toLocaleString('id-ID', { maximumFractionDigits });

export function PemupukanView() {
  const { isReadOnly, blokLahan, pemupukan, addPemupukan, updatePemupukan, deletePemupukan } = useTaniOps();
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
    inputBasis: 'blok' as ApplicationInputBasis,
    dosisInput: 0,
    airInput: 0,
    tanggalAplikasi: formatLocalDate(),
    intervalHari: 0,
    catatan: '',
    completedDates: [] as string[],
  };

  const [form, setForm] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterKategori, setFilterKategori] = useState<'Semua' | 'Pupuk' | 'Pestisida'>('Semua');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddPemupukan = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBlock = blokLahan.find((item) => item.id === form.blokId);
    const effectiveAreaM2 = targetBlock
      ? calculateEffectiveLuasLahan(
          targetBlock.jumlahBedengan,
          targetBlock.panjangBedengan,
          targetBlock.lebarBedengan,
          targetBlock.jarakAntarBedengan,
          targetBlock.luasManualM2,
          targetBlock.efisiensiLahan,
        )
      : 0;
    const inputBasis = (form.inputBasis ?? 'blok') as ApplicationInputBasis;
    const verifiedBedCount =
      targetBlock?.tipeInput === 'bedengan' || !targetBlock?.tipeInput
        ? targetBlock?.jumlahBedengan ?? 0
        : 0;
    const dosisPerHektar = calculatePerHectareRate(
      form.dosisInput,
      inputBasis,
      effectiveAreaM2,
      verifiedBedCount,
    );
    const literAirPerHektar = calculatePerHectareRate(
      form.airInput,
      inputBasis,
      effectiveAreaM2,
      verifiedBedCount,
    );

    if (!form.blokId || !form.jenisPupuk.trim() || form.dosisInput <= 0) return;
    if (effectiveAreaM2 <= 0 || dosisPerHektar <= 0) {
      showToast('Luas efektif blok belum valid. Periksa data pada menu Lahan & Tanaman.', 'warning');
      return;
    }

    const payload = {
      ...form,
      inputBasis,
      dosisPerHektar,
      literAirPerHektar,
    };
    
    if (editingId) {
      const existing = pemupukan.find((item) => item.id === editingId);
      const scheduleChanged = existing &&
        (existing.tanggalAplikasi !== form.tanggalAplikasi ||
          existing.intervalHari !== form.intervalHari);
      updatePemupukan(editingId, {
        ...payload,
        completedDates: scheduleChanged ? [] : form.completedDates,
      });
      showToast('Data Rencana Perawatan berhasil diupdate', 'success');
    } else {
      addPemupukan(payload);
      showToast('Data Rencana Perawatan berhasil ditambahkan', 'success');
    }
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (p: any) => {
    setForm({
      ...p,
      inputBasis: p.inputBasis ?? 'hektar',
      dosisInput: p.dosisInput ?? p.dosisPerHektar,
      airInput: p.airInput ?? p.literAirPerHektar ?? 0,
    });
    setEditingId(p.id);
    window.setTimeout(() => {
      document.getElementById('form-rencana-perawatan')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
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

  const markCurrentOccurrenceComplete = (schedule: typeof pemupukan[number]) => {
    const reminder = getScheduleReminderState(
      schedule.tanggalAplikasi,
      schedule.intervalHari,
      schedule.completedDates,
    );
    if (!reminder.occurrenceDate || !['due', 'overdue'].includes(reminder.status)) {
      showToast('Belum ada jadwal yang perlu ditandai selesai.', 'info');
      return;
    }
    const occurrenceKey = formatLocalDate(reminder.occurrenceDate);
    updatePemupukan(schedule.id, {
      completedDates: [...new Set([...(schedule.completedDates ?? []), occurrenceKey])],
    });
    showToast(`Realisasi ${occurrenceKey} ditandai selesai.`, 'success');
  };

  const filteredList = pemupukan.filter(item => {
    if (filterKategori === 'Semua') return true;
    return item.kategori === filterKategori;
  });

  const totalPupuk = pemupukan.filter(p => p.kategori === 'Pupuk').length;
  const totalPestisida = pemupukan.filter(p => p.kategori === 'Pestisida').length;
  const selectedBlock = blokLahan.find((item) => item.id === form.blokId);
  const selectedAreaM2 = selectedBlock
    ? calculateEffectiveLuasLahan(
        selectedBlock.jumlahBedengan,
        selectedBlock.panjangBedengan,
        selectedBlock.lebarBedengan,
        selectedBlock.jarakAntarBedengan,
        selectedBlock.luasManualM2,
        selectedBlock.efisiensiLahan,
      )
    : 0;
  const selectedBedCount =
    selectedBlock?.tipeInput === 'bedengan' || !selectedBlock?.tipeInput
      ? selectedBlock?.jumlahBedengan ?? 0
      : 0;
  const selectedBasis = (form.inputBasis ?? 'blok') as ApplicationInputBasis;
  const previewDosePerHectare = calculatePerHectareRate(
    form.dosisInput,
    selectedBasis,
    selectedAreaM2,
    selectedBedCount,
  );
  const previewWaterPerHectare = calculatePerHectareRate(
    form.airInput,
    selectedBasis,
    selectedAreaM2,
    selectedBedCount,
  );
  const dosePreview = calculateApplicationAmountSummary(
    previewDosePerHectare,
    selectedAreaM2,
    selectedBedCount,
  );
  const waterPreview = calculateApplicationAmountSummary(
    previewWaterPerHectare,
    selectedAreaM2,
    selectedBedCount,
  );
  const doseUnitLabel = getDoseUnitLabel(form.satuanDosis);

  return (
    <div className="flex min-h-full flex-col gap-6 pb-16 font-sans text-[#1B2721]">
      <PageHeader
        title="Jadwal Perawatan"
        subtitle="Rencanakan pupuk atau pestisida memakai takaran yang biasa digunakan: untuk seluruh blok, per bedengan, atau per hektare dari label produk."
      />

      {/* Surface Content */}
      <div className="relative z-10 flex flex-col gap-6 text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

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

      <GardenCalendar
        schedules={pemupukan}
        blocks={blokLahan}
        onEdit={handleEdit}
        readOnly={isReadOnly}
      />

      {/* Main Content Grid: Form (Left) vs Schedule List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form is full-width so calculations stay readable on desktop. */}
        <div className="demo-mutation flex flex-col gap-4 lg:col-span-12">
          <div id="form-rencana-perawatan" className="neo-card scroll-mt-24 p-5 bg-surface border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
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
                    <HelpTip label="Blok lahan" text="Blok menentukan luas efektif yang dipakai untuk menghitung kebutuhan produk pada jadwal ini." />
                  </label>
                  <Select 
                    value={form.blokId} 
                    onChange={val => setForm({...form, blokId: val})} 
                    options={blokLahan.map((block) => {
                      const area = calculateEffectiveLuasLahan(
                        block.jumlahBedengan,
                        block.panjangBedengan,
                        block.lebarBedengan,
                        block.jarakAntarBedengan,
                        block.luasManualM2,
                        block.efisiensiLahan,
                      );
                      return {
                        value: block.id,
                        label: `${block.nama} · ${formatAmount(area, 1)} m² efektif`,
                      };
                    })}
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

              {/* Section 3: input using field-friendly units, normalized on save. */}
              <div className="flex flex-col gap-4 border-t border-outline pt-3">
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Takaran ini berlaku untuk apa?
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-on-surface-muted">
                    Pilih cara pencatatan yang paling sesuai dengan kebiasaan di kebun.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {([
                    {
                      value: 'blok',
                      icon: 'crop_free',
                      label: 'Seluruh blok',
                      description: 'Masukkan total bahan yang akan disiapkan.',
                    },
                    {
                      value: 'bedengan',
                      icon: 'view_stream',
                      label: 'Per bedengan',
                      description: 'TANITA mengalikan dengan jumlah bedengan.',
                    },
                    {
                      value: 'hektar',
                      icon: 'straighten',
                      label: 'Per hektare',
                      description: 'Gunakan angka acuan yang tertulis pada label.',
                    },
                  ] as const).map((basis) => {
                    const disabled = basis.value === 'bedengan' && selectedBedCount <= 0;
                    const active = selectedBasis === basis.value;
                    return (
                      <button
                        key={basis.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => setForm({ ...form, inputBasis: basis.value })}
                        className={`flex min-h-[84px] items-start gap-3 rounded-xl border p-3 text-left transition ${
                          active
                            ? 'border-[#24533F] bg-[#E7EEE9] text-[#173F35]'
                            : 'border-[#D8D5CC] bg-[#FBFAF6] text-[#4F5B54] hover:border-[#9FAEA5]'
                        }`}
                      >
                        <span className="material-symbols-outlined mt-0.5 text-[20px]" aria-hidden="true">
                          {basis.icon}
                        </span>
                        <span>
                          <strong className="block text-xs font-semibold">{basis.label}</strong>
                          <span className="mt-1 block text-[10px] font-medium leading-relaxed opacity-75">
                            {disabled ? 'Isi jumlah bedengan pada data blok terlebih dahulu.' : basis.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">
                      Takaran produk <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-2">
                      <NumberInput
                        value={form.dosisInput}
                        onNumberChange={(value) => setForm({ ...form, dosisInput: value })}
                        className="min-h-[46px] min-w-0 flex-1 rounded-xl border border-[#BFC4BE] bg-white px-3 py-2.5 text-sm font-semibold text-on-surface"
                        placeholder={selectedBasis === 'hektar' ? 'Contoh: 200' : 'Contoh: 2,5'}
                        required
                      />
                      <div className="w-[112px] shrink-0">
                        <Select
                          value={form.satuanDosis}
                          onChange={(value) => setForm({ ...form, satuanDosis: value })}
                          options={[
                            { value: 'Kilogram', label: 'kg' },
                            { value: 'Gram', label: 'gram' },
                            { value: 'Liter', label: 'liter' },
                            { value: 'Mililiter', label: 'mL' },
                          ]}
                          placeholder="Satuan"
                          required
                        />
                      </div>
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-on-surface-muted">
                      {selectedBasis === 'blok'
                        ? 'Total produk untuk satu kali aplikasi pada blok terpilih.'
                        : selectedBasis === 'bedengan'
                          ? 'Takaran produk untuk satu bedengan.'
                          : 'Takaran produk per 10.000 m² sesuai label atau rekomendasi yang tervalidasi.'}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-on-surface">
                      Volume air <span className="font-medium text-on-surface-muted">(opsional)</span>
                      <HelpTip
                        label="Volume air"
                        text="Isi volume larutan yang benar-benar akan digunakan. Untuk penyemprotan, tetap lakukan kalibrasi alat dan ikuti volume semprot pada label."
                      />
                    </label>
                    <div className="relative">
                      <NumberInput
                        value={form.airInput}
                        onNumberChange={(value) => setForm({ ...form, airInput: value })}
                        className="min-h-[46px] w-full rounded-xl border border-[#BFC4BE] bg-white px-3 py-2.5 pr-14 text-sm font-semibold text-on-surface"
                        placeholder={selectedBasis === 'hektar' ? 'Contoh: 400' : 'Contoh: 20'}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-muted">
                        liter
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-on-surface-muted">
                      {selectedBasis === 'blok'
                        ? 'Total air untuk seluruh blok.'
                        : selectedBasis === 'bedengan'
                          ? 'Volume air untuk satu bedengan.'
                          : 'Volume air per 10.000 m².'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#AFC0B6] bg-[#F0F4F1] p-4" aria-live="polite">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#63736A]">
                        Ringkasan satu kali aplikasi
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold text-[#1D3328]">
                        {selectedBlock?.nama ?? 'Pilih blok untuk melihat hasil'}
                      </h3>
                    </div>
                    {selectedBlock && (
                      <span className="rounded-lg border border-[#C6D1CA] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#536159]">
                        {formatAmount(selectedAreaM2, 1)} m² efektif
                      </span>
                    )}
                  </div>

                  {selectedBlock ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-[#D2DBD5] bg-white p-3">
                        <span className="text-[10px] font-medium text-[#6A756E]">Produk seluruh blok</span>
                        <strong className="mt-1 block font-display text-lg text-[#173F35]">
                          {formatAmount(dosePreview.totalForBlock)} {doseUnitLabel}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-[#D2DBD5] bg-white p-3">
                        <span className="text-[10px] font-medium text-[#6A756E]">Air seluruh blok</span>
                        <strong className="mt-1 block font-display text-lg text-[#173F35]">
                          {form.airInput > 0 ? `${formatAmount(waterPreview.totalForBlock, 1)} L` : 'Tidak diisi'}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-[#D2DBD5] bg-white p-3">
                        <span className="text-[10px] font-medium text-[#6A756E]">Produk per bedengan</span>
                        <strong className="mt-1 block font-display text-lg text-[#173F35]">
                          {selectedBedCount > 0
                            ? `${formatAmount(dosePreview.perBed)} ${doseUnitLabel}`
                            : 'Tidak tersedia'}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-[#D2DBD5] bg-white p-3">
                        <span className="text-[10px] font-medium text-[#6A756E]">Air per bedengan</span>
                        <strong className="mt-1 block font-display text-lg text-[#173F35]">
                          {selectedBedCount > 0 && form.airInput > 0
                            ? `${formatAmount(waterPreview.perBed, 1)} L`
                            : 'Tidak diisi'}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs font-medium text-[#66736C]">
                      Setelah blok dipilih, TANITA langsung menghitung total produk dan air yang perlu disiapkan.
                    </p>
                  )}

                  {selectedBlock && previewDosePerHectare > 0 && (
                    <p className="mt-3 text-[10px] font-medium leading-relaxed text-[#657068]">
                      Nilai normalisasi internal: {formatAmount(previewDosePerHectare)} {doseUnitLabel}/ha
                      {previewWaterPerHectare > 0
                        ? ` dan ${formatAmount(previewWaterPerHectare, 1)} L air/ha`
                        : ''}. Angka ini disimpan agar perhitungan tetap konsisten jika luas blok berubah.
                    </p>
                  )}
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
                    <HelpTip label="Interval jadwal" text="Nilai lebih dari nol membuat jadwal berulang di kalender. Isi 0 untuk satu kali aplikasi." />
                  </label>
                  <NumberInput 
                    value={form.intervalHari} 
                    onNumberChange={v => setForm({...form, intervalHari: v})} 
                    className="w-full bg-surface-high border-2 border-black px-3 py-2.5 min-h-[44px] text-xs font-bold text-on-surface rounded-lg focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_0px_#000]" 
                    placeholder="misal: 14" 
                    min="0"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-2 pt-3">
                <button 
                  type="submit" 
                  disabled={!form.blokId || !form.jenisPupuk.trim() || !form.dosisInput || selectedAreaM2 <= 0}
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

        {/* Schedule list stays below the form to avoid a cramped desktop layout. */}
        <div className="flex flex-col gap-4 lg:col-span-12">
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
                        <th className="p-3">Acuan tersimpan</th>
                        <th className="p-3 text-right">Siapkan untuk blok</th>
                        <th className="demo-mutation p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-outline font-medium">
                      {filteredList.map(p => {
                        const blok = blokLahan.find(b => b.id === p.blokId);
                        const luas = blok ? calculateEffectiveLuasLahan(blok.jumlahBedengan, blok.panjangBedengan, blok.lebarBedengan, blok.jarakAntarBedengan, blok.luasManualM2, blok.efisiensiLahan) : 0;
                        const dosisAktual = calculateActualFertilizerDose(p.dosisPerHektar, luas);
                        const airAktual = p.literAirPerHektar ? calculateActualFertilizerDose(p.literAirPerHektar, luas) : 0;
                        const isPestisida = p.kategori === 'Pestisida';
                        const reminder = getScheduleReminderState(
                          p.tanggalAplikasi,
                          p.intervalHari,
                          p.completedDates,
                        );
                        const occurrenceLabel = reminder.occurrenceDate
                          ? formatLocalDate(reminder.occurrenceDate)
                          : p.tanggalAplikasi;

                        return (
                          <tr key={p.id} className="hover:bg-surface-high/60 transition">
                            {/* Tanggal & Blok */}
                            <td className="p-3 align-top">
                              <span className="font-mono font-bold text-on-surface block">
                                {occurrenceLabel}
                              </span>
                              <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${
                                reminder.status === 'overdue'
                                  ? 'border-danger bg-danger/10 text-danger'
                                  : reminder.status === 'due'
                                    ? 'border-[#B77A34] bg-[#FFF4D8] text-[#79501F]'
                                    : 'border-[#7A9B87] bg-[#EDF4EF] text-[#24533F]'
                              }`}>
                                {reminder.status === 'overdue'
                                  ? `Terlewat ${Math.abs(reminder.diffDays ?? 0)} hari`
                                  : reminder.status === 'due'
                                    ? 'Jadwal hari ini'
                                    : reminder.status === 'completed'
                                      ? 'Selesai'
                                      : 'Mendatang'}
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

                            {/* Normalized reference */}
                            <td className="p-3 align-top text-on-surface-muted">
                              <span className="font-bold text-on-surface block">
                                {formatAmount(p.dosisPerHektar)} {getDoseUnitLabel(p.satuanDosis)}/ha
                              </span>
                              {p.literAirPerHektar ? (
                                <span className="text-[10px] text-on-surface-muted block">
                                  {formatAmount(p.literAirPerHektar, 1)} L air/ha
                                </span>
                              ) : null}
                            </td>

                            {/* What the field team actually prepares */}
                            <td className="p-3 align-top text-right">
                              <div className="inline-block rounded-lg border border-[#8DA698] bg-[#EDF4EF] px-2 py-1 text-sm font-semibold text-[#173F35]">
                                {formatAmount(dosisAktual)} {getDoseUnitLabel(p.satuanDosis)}
                              </div>
                              {p.literAirPerHektar ? (
                                <span className="text-[10px] text-on-surface-muted block mt-1 font-bold">
                                  {formatAmount(airAktual, 1)} L air
                                </span>
                              ) : null}
                              {blok &&
                                (blok.tipeInput === 'bedengan' || !blok.tipeInput) &&
                                blok.jumlahBedengan > 0 && (
                                <span className="mt-1 block text-[10px] font-medium text-on-surface-muted">
                                  ≈ {formatAmount(dosisAktual / blok.jumlahBedengan)} {getDoseUnitLabel(p.satuanDosis)}/bedengan
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="demo-mutation p-3 align-top text-center">
                              <div className="flex items-center justify-center gap-1">
                                {['due', 'overdue'].includes(reminder.status) && (
                                  <button
                                    type="button"
                                    onClick={() => markCurrentOccurrenceComplete(p)}
                                    className="p-1.5 bg-surface rounded-lg border border-black hover:bg-success hover:text-white transition cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                                    title="Tandai realisasi selesai"
                                    aria-label={`Tandai ${p.jenisPupuk} selesai`}
                                  >
                                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                                  </button>
                                )}
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
                    const luas = blok ? calculateEffectiveLuasLahan(blok.jumlahBedengan, blok.panjangBedengan, blok.lebarBedengan, blok.jarakAntarBedengan, blok.luasManualM2, blok.efisiensiLahan) : 0;
                    const dosisAktual = calculateActualFertilizerDose(p.dosisPerHektar, luas);
                    const airAktual = p.literAirPerHektar ? calculateActualFertilizerDose(p.literAirPerHektar, luas) : 0;
                    const isPestisida = p.kategori === 'Pestisida';
                    const reminder = getScheduleReminderState(
                      p.tanggalAplikasi,
                      p.intervalHari,
                      p.completedDates,
                    );
                    const occurrenceLabel = reminder.occurrenceDate
                      ? formatLocalDate(reminder.occurrenceDate)
                      : p.tanggalAplikasi;

                    return (
                      <div 
                        key={p.id} 
                        className="p-3.5 bg-surface-high rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col gap-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-outline pb-2">
                          <div className="demo-mutation flex items-center gap-2">
                            <span className="font-mono font-bold text-on-surface">
                              {occurrenceLabel}
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
                              Siapkan untuk blok
                            </span>
                            <span className="inline-block rounded border border-[#8DA698] bg-[#EDF4EF] px-2 py-0.5 text-sm font-semibold text-[#173F35]">
                              {formatAmount(dosisAktual)} {getDoseUnitLabel(p.satuanDosis)}
                            </span>
                            {p.literAirPerHektar ? (
                              <span className="mt-1 block text-[10px] font-semibold text-on-surface-muted">
                                {formatAmount(airAktual, 1)} L air
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline/60 text-[11px]">
                          <div>
                            <span className="block text-on-surface-muted">
                              Acuan: {formatAmount(p.dosisPerHektar)} {getDoseUnitLabel(p.satuanDosis)}/ha
                              {blok &&
                              (blok.tipeInput === 'bedengan' || !blok.tipeInput) &&
                              blok.jumlahBedengan > 0
                                ? ` · ≈ ${formatAmount(dosisAktual / blok.jumlahBedengan)} ${getDoseUnitLabel(p.satuanDosis)}/bedengan`
                                : ''}
                            </span>
                            <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${
                              reminder.status === 'overdue'
                                ? 'border-danger bg-danger/10 text-danger'
                                : reminder.status === 'due'
                                  ? 'border-[#B77A34] bg-[#FFF4D8] text-[#79501F]'
                                  : 'border-[#7A9B87] bg-[#EDF4EF] text-[#24533F]'
                            }`}>
                              {reminder.status === 'overdue'
                                ? `Terlewat ${Math.abs(reminder.diffDays ?? 0)} hari`
                                : reminder.status === 'due'
                                  ? 'Hari ini'
                                  : reminder.status === 'completed'
                                    ? 'Selesai'
                                    : 'Mendatang'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {['due', 'overdue'].includes(reminder.status) && (
                              <button
                                type="button"
                                onClick={() => markCurrentOccurrenceComplete(p)}
                                className="px-2.5 py-1 bg-success text-white rounded-lg border border-black font-bold transition cursor-pointer"
                              >
                                Selesai
                              </button>
                            )}
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
