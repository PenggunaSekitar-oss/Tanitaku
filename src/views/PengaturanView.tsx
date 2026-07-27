import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useTaniOps } from '../context/TaniOpsContext';
import { NumberInput } from '../components/NumberInput';
import { AgriNotificationWidget } from '../components/AgriNotificationWidget';
import { ConfirmModal } from '../components/ConfirmModal';

interface PengaturanViewProps {
  navigate?: (view: string) => void;
}

export function PengaturanView({ navigate }: PengaturanViewProps) {
  const { showToast } = useToast();
  const { clearAllData } = useTaniOps();
  const [farmName, setFarmName] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [interval, setInterval] = useState<number>(15);

  // Modal konfirmasi state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: 'danger' | 'primary' | 'warning' | 'success';
    icon: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'YA',
    confirmVariant: 'primary',
    icon: 'info',
    onConfirm: () => {},
  });

  useEffect(() => {
    const savedFarm = localStorage.getItem('tanita_farm_name');
    if (savedFarm) setFarmName(savedFarm);
    const savedManager = localStorage.getItem('tanita_manager_name');
    if (savedManager) setManagerName(savedManager);
    const savedInterval = localStorage.getItem('tanita_autosave_interval');
    if (savedInterval) setInterval(Number(savedInterval) || 15);
  }, []);

  const handleSave = () => {
    setModalConfig({
      isOpen: true,
      title: 'Simpan Pengaturan Profil',
      message: 'Apakah Anda yakin ingin menyimpan perubahan profil kebun, nama manajer, dan preferensi interval autosave ini?',
      confirmText: 'SIMPAN SEKARANG',
      confirmVariant: 'primary',
      icon: 'save',
      onConfirm: () => {
        localStorage.setItem('tanita_farm_name', farmName);
        localStorage.setItem('tanita_manager_name', managerName);
        localStorage.setItem('tanita_autosave_interval', interval.toString());
        showToast('Pengaturan sistem berhasil disimpan', 'success');
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleReset = () => {
    setModalConfig({
      isOpen: true,
      title: 'Reset Pengaturan Profil',
      message: 'Apakah Anda yakin ingin mengembalikan profil kebun dan preferensi autosave ke setelan awal default?',
      confirmText: 'RESET SETELAN',
      confirmVariant: 'warning',
      icon: 'restart_alt',
      onConfirm: () => {
        setFarmName('');
        setManagerName('');
        setInterval(15);
        localStorage.removeItem('tanita_farm_name');
        localStorage.removeItem('tanita_manager_name');
        localStorage.removeItem('tanita_autosave_interval');
        showToast('Pengaturan dikembalikan ke default', 'info');
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearAllData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Data Operasional',
      message: 'Apakah Anda yakin ingin menghapus SELURUH data operasional (blok lahan, data tanaman, log aktivitas, jadwal pemupukan, dan analisis keuangan)?\n\nData yang dihapus tidak dapat dikembalikan.',
      confirmText: 'YA, HAPUS SEMUA DATA',
      confirmVariant: 'danger',
      icon: 'delete_forever',
      onConfirm: () => {
        clearAllData();
        showToast('Seluruh data operasional berhasil dihapus', 'info');
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleLockAccess = () => {
    setModalConfig({
      isOpen: true,
      title: 'Kunci Akses Sistem',
      message: 'Apakah Anda yakin ingin mengunci kembali akses aplikasi ini?',
      confirmText: 'KUNCI AKSES',
      confirmVariant: 'danger',
      icon: 'lock',
      onConfirm: () => {
        localStorage.removeItem('tanita_access_granted');
        localStorage.removeItem('tanita_redeem_code');
        showToast('Akses dikunci kembali. Halaman akan dimuat ulang...', 'info');
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        setTimeout(() => {
          window.location.reload();
        }, 800);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Kelola profil kebun, preferensi autosave, notifikasi presisi, dan status lisensi aplikasi."
      />

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bento Item 1: Profil Kebun */}
        <div className="p-6 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between gap-4 lg:col-span-2">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-[#0A0A0A] pb-3">
              <span className="w-8 h-8 rounded bg-[#154734] text-white font-black flex items-center justify-center border-2 border-[#0A0A0A] shrink-0">
                <span className="material-symbols-outlined text-lg">potted_plant</span>
              </span>
              <h2 className="font-display font-extrabold uppercase tracking-wider text-base text-[#0A0A0A]">
                Profil &amp; Identitas Kebun
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                  Nama Perusahaan / Kebun
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] text-lg">
                    domain
                  </span>
                  <input 
                    type="text" 
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full bg-white border-2 border-[#0A0A0A] pl-9 pr-3 py-2.5 text-xs text-[#0A0A0A] font-medium rounded focus:outline-none" 
                    placeholder="Contoh: Kebun Bawang Merah Jeneponto" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                  Penanggung Jawab / Manajer Kebun
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] text-lg">
                    person
                  </span>
                  <input 
                    type="text" 
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-white border-2 border-[#0A0A0A] pl-9 pr-3 py-2.5 text-xs text-[#0A0A0A] font-medium rounded focus:outline-none" 
                    placeholder="Nama Manajer Operasional..." 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#E6E6DC] rounded border border-[#0A0A0A] text-xs text-[#0A0A0A] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#154734]">info</span>
            <span>Identitas kebun digunakan pada cetak laporan PDF dan ringkasan aktivitas harian.</span>
          </div>
        </div>

        {/* Bento Item 2: Preferensi Operasional */}
        <div className="p-6 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b-2 border-[#0A0A0A] pb-3">
              <span className="w-8 h-8 rounded bg-[#154734] text-white font-black flex items-center justify-center border-2 border-[#0A0A0A] shrink-0">
                <span className="material-symbols-outlined text-lg">tune</span>
              </span>
              <h2 className="font-display font-extrabold uppercase tracking-wider text-base text-[#0A0A0A]">
                Preferensi Sistem
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                  Interval Autosave (Menit)
                </label>
                <NumberInput 
                  value={interval} 
                  onNumberChange={setInterval} 
                  className="w-full bg-white border-2 border-[#0A0A0A] p-2.5 text-xs text-[#0A0A0A] rounded font-mono" 
                  placeholder="15" 
                />
              </div>

              <div className="pt-2 border-t border-[#0A0A0A]/20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0A0A0A]">Autosave Otomatis</span>
                <span className="text-[10px] font-mono font-bold bg-[#154734] text-white px-2 py-0.5 rounded border border-[#0A0A0A]">
                  AKTIF ({interval} mnt)
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#5C5C5C]">
            Data jurnal, biaya, dan panen tersimpan otomatis ke penyimpanan lokal browser.
          </p>
        </div>

        {/* Bento Item 3: Notifikasi Widget Agrikultur */}
        <div className="lg:col-span-3">
          <AgriNotificationWidget navigate={navigate} />
        </div>

        {/* Bento Item 4: Status Lisensi & Kunci Akses */}
        <div className="lg:col-span-3 p-6 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#154734] text-white rounded border-2 border-[#0A0A0A] shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-[#0A0A0A] uppercase tracking-wider">
                  Status Lisensi Aplikasi
                </h3>
                <span className="text-[10px] font-black bg-[#154734] text-white px-2 py-0.5 rounded uppercase border border-[#0A0A0A]">
                  AKTIF
                </span>
              </div>
              <p className="text-xs text-[#5C5C5C] mt-0.5">
                Lisensi TANITA Terverifikasi &middot; Seluruh Modul Budidaya, Panen, dan Keuangan Terbuka Penuh.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLockAccess}
            className="px-4 py-2.5 bg-[#C43C2C] text-white font-extrabold text-xs uppercase tracking-wider rounded border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-[#a83224] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>KUNCI AKSES KEMBALI</span>
          </button>
        </div>

        {/* Bento Item 5: Action Bar */}
        <div className="lg:col-span-3 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FEFEFA] border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] rounded">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClearAllData}
              className="bg-[#C43C2C] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] px-4 py-2 text-xs font-extrabold rounded uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#a83224] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              <span>HAPUS DATA OPERASIONAL</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
            <button 
              type="button"
              onClick={handleReset} 
              className="bg-[#E6E6DC] text-[#0A0A0A] border border-[#0A0A0A] px-5 py-2 text-xs font-bold rounded hover:bg-[#d0d0c4] transition cursor-pointer"
            >
              RESET PENGATURAN
            </button>
            <button 
              type="button"
              onClick={handleSave} 
              className="bg-[#154734] text-white border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_#0A0A0A] px-6 py-2 text-xs font-extrabold rounded uppercase tracking-wider flex items-center gap-2 hover:bg-[#0e3023] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>SIMPAN PENGATURAN</span>
            </button>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmVariant={modalConfig.confirmVariant}
        icon={modalConfig.icon}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
