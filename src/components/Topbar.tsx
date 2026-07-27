import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function Topbar({ onOpenSidebar }: any) {
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
    <header className="h-16 border-b border-slate-200/80 bg-[#FEFEFA]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-[999]">
      <div className="flex items-center gap-3">
        <img 
          src="https://res.cloudinary.com/ddc26noa/image/upload/v1784860433/5199_1_j0xnzq.png" 
          alt="TANITA Logo" 
          className="h-8 sm:h-10 w-auto object-contain shrink-0"
        />
        <div className="hidden md:flex items-center gap-1.5 bg-[#154734]/10 text-[#154734] font-bold text-xs px-3 py-1.5 rounded-xl border border-[#154734]/30 uppercase tracking-wider font-display">
          <span className="material-symbols-outlined text-[16px] text-[#154734]">eco</span>
          <span>TANAM. PANTAU. PANEN.</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Notification Bell Button & Drawer Container */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 bg-[#FEFEFA] text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-center shrink-0 min-h-[42px] min-w-[42px] shadow-xs"
            title="Pusat Notifikasi Tani"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Drawer / Panel */}
          {isNotifOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-[9998] bg-slate-900/20 backdrop-blur-xs sm:bg-transparent"
                onClick={() => setIsNotifOpen(false)}
              />

              <div
                className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px] md:w-[420px] z-[9999] bg-[#FEFEFA] text-slate-900 border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col gap-3 max-h-[calc(100vh-5rem)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#154734] text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-[#154734]/20">
                      <span className="material-symbols-outlined text-lg">notifications_active</span>
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Pusat Notifikasi Tani
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
                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    disabled={notificationsList.length === 0 || unreadCount === 0}
                    className="flex-1 py-2 px-3 bg-[#FEFEFA] text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 shadow-xs hover:bg-[#154734] hover:text-white disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                  >
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    <span>Tandai Semua Dibaca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => clearAllNotifications()}
                    disabled={notificationsList.length === 0}
                    className="py-2 px-3 bg-red-50 text-red-600 font-semibold text-xs rounded-lg border border-red-200 hover:bg-red-600 hover:text-white disabled:opacity-40 transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
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
                            <span>{item.timestamp}</span>

                            {item.actionLabel && item.onAction && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  item.onAction!();
                                  markAsRead(item.id);
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

        <button onClick={onOpenSidebar} className="p-2 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center min-h-[42px] min-w-[42px] md:hidden cursor-pointer" title="Menu Navigasi">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}

