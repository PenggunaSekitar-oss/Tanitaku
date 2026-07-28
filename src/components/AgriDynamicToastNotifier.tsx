import React, { useEffect, useRef } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast } from '../context/ToastContext';
import {
  differenceInCalendarDays,
  formatLocalDate,
  getNextScheduledDate,
} from '../utils/localDate';

interface AgriDynamicToastNotifierProps {
  navigate?: (view: string) => void;
}

export function AgriDynamicToastNotifier({ navigate }: AgriDynamicToastNotifierProps) {
  const { tanaman, pemupukan, blokLahan } = useTaniOps();
  const { showAgriToast } = useToast();

  const prevTanamanMapRef = useRef<Record<string, string>>({});
  const isInitialMountRef = useRef(true);
  const notifiedPemupukanKeysRef = useRef<Set<string>>(new Set());

  // 1. Dynamic Notification on Crop Status Change
  useEffect(() => {
    tanaman.forEach((t) => {
      const currentStatus = t.status || 'Aktif';
      const prevStatus = prevTanamanMapRef.current[t.id];

      // Skip initial mount notification, just record initial state
      if (isInitialMountRef.current) {
        prevTanamanMapRef.current[t.id] = currentStatus;
        return;
      }

      // If status changed for an existing crop
      if (prevStatus && prevStatus !== currentStatus) {
        const blok = blokLahan.find((b) => b.id === t.blokId);
        const namaBlok = blok ? blok.nama : 'Lahan Kebun';

        if (currentStatus === 'Panen') {
          showAgriToast({
            title: 'Status Tanaman: PANEN!',
            badgeText: 'PANEN BERHASIL',
            type: 'success',
            category: 'umum',
            icon: 'inventory_2',
            message: `Tanaman "${t.komoditas}" (${t.varietas}) di ${namaBlok} kini berstatus PANEN!\nSilakan lakukan pencatatan hasil & analisis biaya di menu Keuangan.`,
            duration: 8000,
            actionLabel: 'Buka Keuangan',
            onAction: () => navigate && navigate('keuangan'),
          });
        } else if (currentStatus === 'Aktif') {
          showAgriToast({
            title: 'Status Tanaman Reaktif',
            badgeText: 'AKTIF KEMBALI',
            type: 'info',
            category: 'umum',
            icon: 'eco',
            message: `Tanaman "${t.komoditas}" di ${namaBlok} diubah kembali ke status AKTIF.`,
            duration: 6000,
            actionLabel: 'Lihat Pemantauan',
            onAction: () => navigate && navigate('pemantauan'),
          });
        }
      }

      prevTanamanMapRef.current[t.id] = currentStatus;
    });

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    }
  }, [tanaman, blokLahan, showAgriToast, navigate]);

  // 2. Dynamic Reminder for Fertilization Schedules Approaching Deadline
  useEffect(() => {
    if (!pemupukan || pemupukan.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatLocalDate(today);

    pemupukan.forEach((item) => {
      if (!item.tanggalAplikasi) return;

      const appDate = getNextScheduledDate(item.tanggalAplikasi, item.intervalHari, today);
      if (!appDate) return;
      const scheduledDate = formatLocalDate(appDate);
      const diffDays = differenceInCalendarDays(appDate, today);

      const notifKey = `pnotif-${item.id}-${scheduledDate}-${diffDays}-${todayStr}`;

      if (notifiedPemupukanKeysRef.current.has(notifKey)) return;

      const blok = blokLahan.find((b) => b.id === item.blokId);
      const namaBlok = blok ? blok.nama : 'Lahan Kebun';

      // Due Today (0 days)
      if (diffDays === 0) {
        notifiedPemupukanKeysRef.current.add(notifKey);
        showAgriToast({
          id: `pemupukan-${item.id}-${scheduledDate}-0d`,
          title: 'Jadwal Pemupukan Hari Ini!',
          badgeText: 'HARI INI',
          type: 'warning',
          category: 'pemupukan',
          icon: 'compost',
          message: `Jadwal pemupukan ${item.jenisPupuk} (${item.kategori}) untuk ${namaBlok} jatuh HARI INI.\nMetode: ${item.metodeAplikasi || 'Aplikasi Lahan'}.`,
          duration: 9000,
          actionLabel: 'Buka Pemupukan',
          onAction: () => navigate && navigate('pemupukan'),
        });
      }
      // Approaching deadline (1 to 3 days away)
      else if (diffDays > 0 && diffDays <= 3) {
        notifiedPemupukanKeysRef.current.add(notifKey);
        showAgriToast({
          id: `pemupukan-${item.id}-${scheduledDate}-${diffDays}d`,
          title: 'Pengingat Jadwal Pemupukan',
          badgeText: `${diffDays} HARI LAGI`,
          type: 'info',
          category: 'pemupukan',
          icon: 'schedule',
          message: `Jadwal ${item.jenisPupuk} (${item.kategori}) di ${namaBlok} tinggal ${diffDays} hari lagi (${scheduledDate}).\nPersiapkan stok pupuk & alat kocor.`,
          duration: 8000,
          actionLabel: 'Lihat Jadwal',
          onAction: () => navigate && navigate('pemupukan'),
        });
      }
      // Overdue (passed deadline within last 7 days)
      else if (diffDays < 0 && Math.abs(diffDays) <= 7) {
        notifiedPemupukanKeysRef.current.add(notifKey);
        showAgriToast({
          id: `pemupukan-${item.id}-${scheduledDate}-overdue`,
          title: 'Jadwal Pemupukan Terlewat!',
          badgeText: `TERLEWAT ${Math.abs(diffDays)} HARI`,
          type: 'error',
          category: 'pemupukan',
          icon: 'warning',
          message: `Jadwal ${item.jenisPupuk} di ${namaBlok} terlewat ${Math.abs(diffDays)} hari (${scheduledDate}).\nSegera lakukan pemupukan agar nutrisi tanaman terjaga.`,
          duration: 9000,
          actionLabel: 'Kelola Jadwal',
          onAction: () => navigate && navigate('pemupukan'),
        });
      }
    });
  }, [pemupukan, blokLahan, showAgriToast, navigate]);

  return null;
}
