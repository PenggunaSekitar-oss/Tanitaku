import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';

const PROFILE_KEYS = {
  farmName: 'tanita_farm_name',
  managerName: 'tanita_manager_name',
} as const;

const NOTIFICATION_KEYS = {
  cropStatus: 'tanita_notify_crop_status',
  fertilizer: 'tanita_notify_fertilizer',
} as const;

type ModalConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant: 'danger' | 'primary' | 'warning' | 'success';
  icon: string;
  onConfirm: () => void;
};

type SettingsCardProps = {
  title: string;
  eyebrow: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
};

function SettingsCard({
  title,
  eyebrow,
  icon,
  children,
  className = '',
}: SettingsCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-[18px] border border-[#D8D5CC] bg-[#FBFAF6] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-[#E3E0D8] px-5 py-4 sm:px-6">
        <span className="material-symbols-outlined text-[21px] text-[#24533F]" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#80877F]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 font-display text-base font-semibold tracking-[-0.02em] text-[#19231E]">
            {title}
          </h2>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ToggleRow({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-semibold text-[#223029]">{title}</span>
        <span className="mt-1 block max-w-sm text-xs font-medium leading-relaxed text-[#6D756F]">
          {description}
        </span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-7 min-h-7 w-12 shrink-0 rounded-full border p-0.5 transition-colors ${
          checked
            ? 'border-[#24533F] bg-[#24533F]'
            : 'border-[#C9C7BF] bg-[#E5E3DC]'
        }`}
      >
        <span
          className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
        <span className="sr-only">{checked ? 'Aktif' : 'Nonaktif'}</span>
      </button>
    </div>
  );
}

export function PengaturanView() {
  const { showToast } = useToast();
  const {
    blokLahan,
    tanaman,
    logAktivitas,
    pemupukan,
    keuangan,
    clearAllData,
  } = useTaniOps();

  const [farmName, setFarmName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [notifyCropStatus, setNotifyCropStatus] = useState(true);
  const [notifyFertilizer, setNotifyFertilizer] = useState(true);
  const [savedSignature, setSavedSignature] = useState('');
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Lanjutkan',
    confirmVariant: 'primary',
    icon: 'info',
    onConfirm: () => undefined,
  });

  useEffect(() => {
    try {
      const savedFarm = localStorage.getItem(PROFILE_KEYS.farmName) ?? '';
      const savedManager = localStorage.getItem(PROFILE_KEYS.managerName) ?? '';
      const savedCropStatus = localStorage.getItem(NOTIFICATION_KEYS.cropStatus) !== 'false';
      const savedFertilizer = localStorage.getItem(NOTIFICATION_KEYS.fertilizer) !== 'false';

      setFarmName(savedFarm);
      setManagerName(savedManager);
      setNotifyCropStatus(savedCropStatus);
      setNotifyFertilizer(savedFertilizer);
      setSavedSignature(
        JSON.stringify([savedFarm, savedManager, savedCropStatus, savedFertilizer]),
      );
      localStorage.removeItem('tanita_autosave_interval');
    } catch {
      setSavedSignature(JSON.stringify(['', '', true, true]));
      showToast('Penyimpanan browser tidak tersedia pada perangkat ini.', 'error');
    }
  }, []);

  const currentSignature = JSON.stringify([
    farmName,
    managerName,
    notifyCropStatus,
    notifyFertilizer,
  ]);
  const hasUnsavedChanges = savedSignature !== '' && savedSignature !== currentSignature;

  const dataSummary = useMemo(
    () => [
      { label: 'Blok lahan', value: blokLahan.length },
      { label: 'Musim tanam', value: tanaman.length },
      { label: 'Jurnal', value: logAktivitas.length },
      { label: 'Jadwal pupuk', value: pemupukan.length },
      { label: 'Catatan biaya', value: keuangan.length },
    ],
    [blokLahan.length, tanaman.length, logAktivitas.length, pemupukan.length, keuangan.length],
  );

  const closeModal = () => {
    setModalConfig((current) => ({ ...current, isOpen: false }));
  };

  const handleSave = () => {
    try {
      const trimmedFarmName = farmName.trim();
      const trimmedManagerName = managerName.trim();
      localStorage.setItem(PROFILE_KEYS.farmName, trimmedFarmName);
      localStorage.setItem(PROFILE_KEYS.managerName, trimmedManagerName);
      localStorage.setItem(NOTIFICATION_KEYS.cropStatus, String(notifyCropStatus));
      localStorage.setItem(NOTIFICATION_KEYS.fertilizer, String(notifyFertilizer));

      setFarmName(trimmedFarmName);
      setManagerName(trimmedManagerName);
      setSavedSignature(
        JSON.stringify([
          trimmedFarmName,
          trimmedManagerName,
          notifyCropStatus,
          notifyFertilizer,
        ]),
      );
      window.dispatchEvent(new Event('tanita-settings-updated'));
      showToast('Pengaturan tersimpan di perangkat ini.', 'success');
    } catch (error) {
      console.error('Gagal menyimpan pengaturan', error);
      showToast('Pengaturan tidak dapat disimpan. Periksa izin penyimpanan browser.', 'error');
    }
  };

  const handleReset = () => {
    setModalConfig({
      isOpen: true,
      title: 'Pulihkan pengaturan',
      message:
        'Nama kebun, penanggung jawab, dan preferensi notifikasi akan dikembalikan ke nilai awal.',
      confirmText: 'Pulihkan',
      confirmVariant: 'warning',
      icon: 'restart_alt',
      onConfirm: () => {
        localStorage.removeItem(PROFILE_KEYS.farmName);
        localStorage.removeItem(PROFILE_KEYS.managerName);
        localStorage.removeItem(NOTIFICATION_KEYS.cropStatus);
        localStorage.removeItem(NOTIFICATION_KEYS.fertilizer);
        setFarmName('');
        setManagerName('');
        setNotifyCropStatus(true);
        setNotifyFertilizer(true);
        setSavedSignature(JSON.stringify(['', '', true, true]));
        window.dispatchEvent(new Event('tanita-settings-updated'));
        showToast('Pengaturan awal telah dipulihkan.', 'info');
        closeModal();
      },
    });
  };

  const handleClearAllData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus data operasional',
      message:
        'Seluruh blok lahan, musim tanam, jurnal aktivitas, jadwal pemupukan, dan catatan keuangan akan dihapus permanen dari perangkat ini. Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Hapus semua data',
      confirmVariant: 'danger',
      icon: 'delete_forever',
      onConfirm: () => {
        clearAllData();
        showToast('Data operasional telah dihapus dari perangkat ini.', 'info');
        closeModal();
      },
    });
  };

  const handleLockAccess = () => {
    setModalConfig({
      isOpen: true,
      title: 'Kunci perangkat',
      message:
        'Sesi pada browser ini akan ditutup. Kode akses perlu dimasukkan kembali untuk membuka TANITA.',
      confirmText: 'Kunci sekarang',
      confirmVariant: 'danger',
      icon: 'lock',
      onConfirm: () => {
        localStorage.removeItem('tanita_access_code_hash');
        closeModal();
        window.location.reload();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <PageHeader
        title="Pengaturan"
        subtitle="Kelola identitas kebun, notifikasi, penyimpanan lokal, dan akses pada perangkat ini."
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24533F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B4031] disabled:cursor-not-allowed disabled:bg-[#C7CAC5] disabled:text-[#727A74] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              save
            </span>
            {hasUnsavedChanges ? 'Simpan perubahan' : 'Sudah tersimpan'}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <SettingsCard
          title="Identitas kebun"
          eyebrow="Profil"
          icon="potted_plant"
          className="xl:col-span-7"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#465149]">Nama kebun</span>
              <input
                type="text"
                value={farmName}
                onChange={(event) => setFarmName(event.target.value)}
                className="w-full rounded-xl border border-[#CFCBC1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1D2822] outline-none transition placeholder:text-[#9A9F9A] focus:border-[#4D725F] focus:ring-2 focus:ring-[#24533F]/10"
                placeholder="Contoh: Kebun Bawang Merah Jeneponto"
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#465149]">
                Penanggung jawab
              </span>
              <input
                type="text"
                value={managerName}
                onChange={(event) => setManagerName(event.target.value)}
                className="w-full rounded-xl border border-[#CFCBC1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1D2822] outline-none transition placeholder:text-[#9A9F9A] focus:border-[#4D725F] focus:ring-2 focus:ring-[#24533F]/10"
                placeholder="Nama pengelola kebun"
                autoComplete="name"
              />
            </label>
          </div>
          <p className="mt-5 border-t border-[#E3E0D8] pt-4 text-xs font-medium leading-relaxed text-[#707871]">
            Identitas ini muncul pada laporan yang dibuat dari aplikasi. Data hanya disimpan
            pada browser yang sedang digunakan.
          </p>
        </SettingsCard>

        <SettingsCard
          title="Notifikasi aplikasi"
          eyebrow="Preferensi"
          icon="notifications"
          className="xl:col-span-5"
        >
          <div className="divide-y divide-[#E3E0D8]">
            <ToggleRow
              id="notify-crop-status"
              title="Perubahan status tanaman"
              description="Tampilkan pemberitahuan saat tanaman beralih ke Aktif atau Panen."
              checked={notifyCropStatus}
              onChange={setNotifyCropStatus}
            />
            <ToggleRow
              id="notify-fertilizer"
              title="Pengingat pemupukan"
              description="Ingatkan jadwal hari ini, tiga hari ke depan, atau yang baru terlewat."
              checked={notifyFertilizer}
              onChange={setNotifyFertilizer}
            />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Data pada perangkat"
          eyebrow="Penyimpanan"
          icon="database"
          className="xl:col-span-7"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5">
            {dataSummary.map((item) => (
              <div key={item.label}>
                <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#1E3228]">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-tight text-[#737B75]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 border-t border-[#E3E0D8] pt-4">
            <span className="material-symbols-outlined text-[19px] text-[#6C756F]" aria-hidden="true">
              sync_saved_locally
            </span>
            <p className="text-xs font-medium leading-relaxed text-[#69716B]">
              Perubahan disimpan langsung di penyimpanan browser. TANITA belum melakukan
              sinkronisasi akun atau pencadangan cloud.
            </p>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Akses perangkat"
          eyebrow="Keamanan"
          icon="shield_lock"
          className="xl:col-span-5"
        >
          <p className="text-sm font-medium leading-relaxed text-[#5F6962]">
            Perangkat ini sedang memiliki sesi akses aktif. Mengunci sesi tidak menghapus data
            operasional.
          </p>
          <button
            type="button"
            onClick={handleLockAccess}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#BFC4BE] bg-white px-4 py-2.5 text-sm font-semibold text-[#27352D] transition hover:border-[#86928A] hover:bg-[#F4F3EE] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              lock
            </span>
            Kunci perangkat
          </button>
        </SettingsCard>

        <section className="rounded-[18px] border border-[#D8B8B1] bg-[#FDF8F6] p-5 sm:p-6 xl:col-span-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A655B]">
                Zona berisiko
              </p>
              <h2 className="mt-1 font-display text-base font-semibold text-[#492A25]">
                Hapus seluruh data operasional
              </h2>
              <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-[#80625C]">
                Profil dan preferensi tetap tersimpan, tetapi semua catatan kebun akan dihapus
                permanen dari perangkat ini.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearAllData}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#A34335] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#87362C] sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                delete_forever
              </span>
              Hapus data
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-[#657068] underline decoration-[#AEB3AE] underline-offset-4 transition hover:text-[#26362E]"
        >
          Pulihkan pengaturan awal
        </button>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmVariant={modalConfig.confirmVariant}
        icon={modalConfig.icon}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}
