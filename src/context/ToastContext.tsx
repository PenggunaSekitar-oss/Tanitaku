import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AgriToastOptions {
  id?: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  category?: 'penyiraman' | 'pemupukan' | 'cuaca' | 'umum';
  icon?: string;
  badgeText?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export interface AgriNotificationItem {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  category?: 'penyiraman' | 'pemupukan' | 'cuaca' | 'umum';
  icon?: string;
  badgeText?: string;
  actionLabel?: string;
  onAction?: () => void;
  timestamp: string;
  read: boolean;
}

type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  showAgriToast: (options: AgriToastOptions) => void;
  removeToast: (id: string) => void;
  notificationsList: AgriNotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function getManagerGreeting(): string {
  try {
    const saved = localStorage.getItem('tanita_manager_name')?.trim();
    if (saved) {
      if (/^(kak|pak|bu|bapak|ibu|dr|ir)\b/i.test(saved)) {
        return `Halo, ${saved}.`;
      }
      return `Halo, Kak ${saved}.`;
    }
  } catch (e) {
    console.error(e);
  }
  return 'Halo, Kak Manager.';
}

const isNotificationItem = (value: unknown): value is AgriNotificationItem => {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.message === 'string' &&
    typeof item.timestamp === 'string' &&
    typeof item.read === 'boolean'
  );
};

const generateNotificationId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<AgriToastOptions[]>([]);
  const [notificationsList, setNotificationsList] = useState<AgriNotificationItem[]>(() => {
    try {
      if (!localStorage.getItem('tanita_notif_demo_cleared')) {
        localStorage.removeItem('tanita_notifications_history');
        localStorage.setItem('tanita_notif_demo_cleared', 'true');
        return [];
      }
      const saved = localStorage.getItem('tanita_notifications_history');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(isNotificationItem).slice(0, 100) : [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Save notifications to localStorage whenever modified
  useEffect(() => {
    try {
      // Stripping non-serializable function handlers for storage
      const serializable = notificationsList.map(({ onAction, ...rest }) => rest);
      localStorage.setItem('tanita_notifications_history', JSON.stringify(serializable));
    } catch (e) {
      console.error(e);
    }
  }, [notificationsList]);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(item => ({ ...item, read: true })));
  };

  const clearAllNotifications = () => {
    setNotificationsList([]);
  };

  const markAsRead = (id: string) => {
    setNotificationsList(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const deleteNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(item => item.id !== id));
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = generateNotificationId();
    const newToast: AgriToastOptions = {
      id,
      title:
        type === 'success'
          ? 'Berhasil'
          : type === 'error'
            ? 'Gagal'
            : type === 'warning'
              ? 'Peringatan'
              : 'Informasi',
      message,
      type,
      category: 'umum',
      icon: type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info',
      duration: 6000
    };
    
    setToasts(prev => [...prev.slice(-3), newToast]);

    // Also push to notification drawer history
    const notifItem: AgriNotificationItem = {
      id,
      title: newToast.title,
      message: newToast.message,
      type: newToast.type,
      category: newToast.category,
      icon: newToast.icon,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotificationsList(prev => {
      if (prev.some(n => n.id === id)) return prev;
      return [notifItem, ...prev].slice(0, 100);
    });

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const showAgriToast = (options: AgriToastOptions) => {
    const id = options.id || generateNotificationId();
    
    // Prevent duplicate toasts with identical id
    setToasts(prev => {
      if (prev.some(t => t.id === id)) return prev;
      return [...prev.slice(-3), { ...options, id }];
    });

    // Push to notification drawer history
    const notifItem: AgriNotificationItem = {
      id,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      category: options.category || 'umum',
      icon: options.icon,
      badgeText: options.badgeText,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotificationsList(prev => {
      if (prev.some(n => n.id === id)) return prev;
      return [notifItem, ...prev].slice(0, 100);
    });

    if (options.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, options.duration || 6000);
    }
  };

  return (
    <ToastContext.Provider value={{
      showToast,
      showAgriToast,
      removeToast,
      notificationsList,
      unreadCount,
      markAllAsRead,
      clearAllNotifications,
      markAsRead,
      deleteNotification
    }}>
      {children}
      
      {/* Container for Floating Toast Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 max-w-lg w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map((toast) => {
          const isPenyiraman = toast.category === 'penyiraman';
          const isPemupukan = toast.category === 'pemupukan';
          
          let headerBg = 'bg-[#E8EEE9] text-[#24533F]';
          let borderAccent = 'border-[#D8D5CC]';
          let badgeBg = 'bg-[#E4ECE7] text-[#24533F]';

          if (isPenyiraman) {
            headerBg = 'bg-[#E6F0EA] text-[#24533F]';
            borderAccent = 'border-[#B9CBBF]';
            badgeBg = 'bg-[#DDEAE2] text-[#24533F]';
          } else if (isPemupukan) {
            headerBg = 'bg-[#E6F0EA] text-[#24533F]';
            borderAccent = 'border-[#B9CBBF]';
            badgeBg = 'bg-[#DDEAE2] text-[#24533F]';
          } else if (toast.type === 'error') {
            headerBg = 'bg-[#F7E8E4] text-[#A34335]';
            borderAccent = 'border-[#DAB8B0]';
          } else if (toast.type === 'warning') {
            headerBg = 'bg-[#F6EDD9] text-[#885B21]';
            borderAccent = 'border-[#D9C397]';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative flex w-full flex-col gap-2.5 rounded-xl border bg-[#FBFAF6] p-3.5 shadow-[0_14px_36px_rgba(20,31,25,0.14)] animate-in slide-in-from-top-3 duration-200 ${borderAccent}`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-outline/40 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${headerBg}`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {toast.icon || (isPenyiraman ? 'water_drop' : isPemupukan ? 'compost' : 'notifications')}
                    </span>
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="truncate font-display text-xs font-semibold text-on-surface">
                        {toast.title}
                      </span>
                      {toast.badgeText && (
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${badgeBg}`}>
                          {toast.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id!)}
                  className="p-1 rounded text-on-surface-muted hover:text-on-surface hover:bg-surface-high transition shrink-0 cursor-pointer"
                  title="Tutup Notifikasi"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface leading-relaxed font-medium whitespace-pre-line">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction!();
                      removeToast(toast.id!);
                    }}
                    className={`flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      isPenyiraman 
                        ? 'bg-[#154734] text-white hover:bg-[#0e3023]' 
                        : isPemupukan 
                        ? 'bg-[#154734] text-white hover:bg-[#0e3023]' 
                        : 'bg-[#154734] text-white hover:bg-[#0e3023]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {toast.actionLabel}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
