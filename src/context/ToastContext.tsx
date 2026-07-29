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
  actionView?: string;
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
  actionView?: string;
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
      duration: 4000
    };
    
    setToasts(prev => [...prev.slice(-1), newToast]);

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
    }, 4000);
  };

  const showAgriToast = (options: AgriToastOptions) => {
    const id = options.id || generateNotificationId();
    
    // Prevent duplicate toasts with identical id
    setToasts(prev => {
      if (prev.some(t => t.id === id)) return prev;
      return [...prev.slice(-1), { ...options, id }];
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
      actionView: options.actionView,
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
      }, options.duration || 5000);
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
      
      <div className="pointer-events-none fixed bottom-20 right-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 md:bottom-5">
        {toasts.map((toast) => {
          const accent =
            toast.type === 'error'
              ? 'bg-[#A34335]'
              : toast.type === 'warning'
                ? 'bg-[#A56E24]'
                : toast.type === 'success'
                  ? 'bg-[#2D684E]'
                  : 'bg-[#718078]';

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-[#D8D5CC] bg-[#FBFAF6] p-3.5 shadow-[0_12px_28px_rgba(20,31,25,0.12)] animate-in slide-in-from-bottom-2 duration-200"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${accent}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-semibold text-[#26352D]">{toast.title}</p>
                  {toast.badgeText && (
                    <span className="rounded-md bg-[#ECEDE8] px-1.5 py-0.5 text-[10px] font-semibold text-[#68736C]">
                      {toast.badgeText}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[#5F6963] whitespace-pre-line">
                  {toast.message}
                </p>
                {toast.actionLabel && toast.onAction && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction!();
                      removeToast(toast.id!);
                    }}
                    className="mt-2 rounded-lg bg-[#24533F] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1B4031]"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id!)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#7A837D] transition hover:bg-[#EEECE6] hover:text-[#26352D]"
                aria-label="Tutup notifikasi"
              >
                <span className="material-symbols-outlined text-[17px]">close</span>
              </button>
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
