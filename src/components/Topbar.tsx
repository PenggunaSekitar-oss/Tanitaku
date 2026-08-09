import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { BrandLockup } from './BrandLockup';
import { SyncStatus } from './SyncStatus';
import { IS_DEMO_MODE } from '../config/runtime';

interface TopbarProps {
  onOpenSidebar: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const VIEW_LABELS: Record<string, string> = {
  dashboard: 'Ringkasan kebun',
  pemantauan: 'Lahan & tanaman',
  pemupukan: 'Jadwal perawatan',
  kocor: 'Kalkulator larutan',
  'jenis-hama': 'Referensi hama',
  'cari-bibit': 'Referensi bibit',
  'cari-pupuk': 'Referensi pupuk',
  'cari-pestisida': 'Referensi pestisida',
  'cari-penyakit': 'Identifikasi penyakit',
  keuangan: 'Keuangan',
  log: 'Jurnal aktivitas',
  pengaturan: 'Pengaturan',
};

const formatNotificationTimestamp = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const today = new Date();
  const sameDay =
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate();
  const time = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
  if (sameDay) return `Hari ini, ${time}`;

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: parsed.getFullYear() === today.getFullYear() ? undefined : 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

export function Topbar({ onOpenSidebar, currentView, onNavigate }: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  const {
    notificationsList,
    unreadCount,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
    deleteNotification
  } = useToast();

  return (
    <header className="tanita-topbar relative z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-[#D8D4C9] bg-[#F7F5EE]/95 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="md:hidden">
          <BrandLockup compact />
        </div>
        <div className="hidden min-w-0 md:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A837D]">
            Kendali operasional
          </p>
          <p className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.02em] text-[#243029]">
            {VIEW_LABELS[currentView] ?? 'TANITA'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {IS_DEMO_MODE ? (
          <span className="hidden min-h-8 items-center gap-1.5 rounded-full border border-[#C8A86B] bg-[#FFF8E8] px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#715020] sm:inline-flex">
            <span className="material-symbols-outlined text-[15px]" aria-hidden="true">lock</span>
            Hanya baca
          </span>
        ) : (
          <SyncStatus />
        )}
        {/* Notification Bell Button & Drawer Container */}
        <div className={`relative ${IS_DEMO_MODE ? 'hidden' : ''}`}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Buka pusat notifikasi"
            aria-expanded={isNotifOpen}
            className="flex min-h-[42px] min-w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#D6D2C7] bg-[#FCFBF7] p-2 text-[#59645D] transition hover:border-[#9DAA9F] hover:bg-white hover:text-[#183F33]"
            title="Pusat Notifikasi Tani"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Drawer / Panel */}
          {isNotifOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-[9998] bg-[#17211C]/25 sm:bg-transparent"
                onClick={() => setIsNotifOpen(false)}
              />

              <div
                className="fixed left-4 right-4 top-16 z-[9999] flex max-h-[calc(100vh-5rem)] flex-col gap-3 overflow-hidden rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-4 text-[#1B2721] shadow-[0_18px_50px_rgba(20,31,25,0.16)] sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px] md:w-[420px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E7EDE9] font-bold text-[#24533F]">
                      <span className="material-symbols-outlined text-lg">notifications_active</span>
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Notifikasi
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 block">
                        {unreadCount > 0 ? `${unreadCount} Notifikasi Belum Dibaca` : 'Semua Notifikasi Telah Dibaca'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="Tutup Panel"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Action Bar: Mark All Read & Clear All */}
                <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E0DED6] bg-[#F4F3EE] p-2">
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    disabled={notificationsList.length === 0 || unreadCount === 0}
                    className="flex min-h-[38px] flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#D8D5CC] bg-white px-3 py-2 text-xs font-semibold text-[#34423A] transition hover:border-[#8D9B92] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    <span>Tandai Semua Dibaca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => clearAllNotifications()}
                    disabled={notificationsList.length === 0}
                    className="flex min-h-[38px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#E2C5BE] bg-[#FBF3F1] px-3 py-2 text-xs font-semibold text-[#9A4033] transition hover:bg-[#F5E5E1] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    <span>Hapus Semua</span>
                  </button>
                </div>

                {/* Notification Items List */}
                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {notificationsList.length === 0 ? (
                    <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <span className="material-symbols-outlined text-3xl text-slate-400">notifications_off</span>
                      <span className="font-semibold text-xs text-slate-700">Tidak Ada Notifikasi</span>
                      <span className="text-[11px] text-slate-500">
                        Semua notifikasi telah dibersihkan atau belum ada pengingat baru.
                      </span>
                    </div>
                  ) : (
                    notificationsList.map((item) => {
                      return (
                        <div
                          key={item.id}
                          onClick={() => markAsRead(item.id)}
                          className={`p-3 rounded-xl border flex flex-col gap-2 transition relative cursor-pointer ${
                            !item.read
                              ? 'bg-slate-50 border-slate-200 shadow-xs'
                              : 'bg-[#FEFEFA] border-slate-100 opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-[#154734]/15 text-[#154734] shrink-0">
                                <span className="material-symbols-outlined text-[15px]">
                                  {item.icon || 'notifications'}
                                </span>
                              </span>
                              <span className="font-display font-bold text-xs text-slate-900 truncate">
                                {item.title}
                              </span>
                              {item.badgeText && (
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#154734]/15 text-[#154734] shrink-0">
                                  {item.badgeText}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {!item.read && (
                                <span className="w-2 h-2 rounded-full bg-[#154734]" title="Belum dibaca" />
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(item.id);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Hapus Notifikasi Ini"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                            {item.message}
                          </p>

                          <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-slate-500">
                            <span>{formatNotificationTimestamp(item.timestamp)}</span>

                            {item.actionLabel && (item.onAction || item.actionView) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.onAction) item.onAction();
                                  else if (item.actionView) onNavigate(item.actionView);
                                  markAsRead(item.id);
                                  setIsNotifOpen(false);
                                }}
                                className="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-[#154734] text-white hover:bg-[#154734] transition cursor-pointer min-h-[30px]"
                              >
                                {item.actionLabel}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={onOpenSidebar} aria-label="Buka menu navigasi" className="flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-lg bg-[#173F35] p-2 text-white transition hover:bg-[#0F3027] md:hidden" title="Menu Navigasi">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
