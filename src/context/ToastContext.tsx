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

const getDefaultNotifs = (): AgriNotificationItem[] => {
  return [];
};

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
        return JSON.parse(saved);
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
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: AgriToastOptions = {
      id,
      title: type === 'success' ? 'Berhasil' : type === 'error' ? 'Gagal' : 'Informasi',
      message,
      type,
      category: 'umum',
      icon: type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info',
      duration: 6000
    };
    
    setToasts(prev => [...prev.slice(-3), newToast]);

    // Also push to notification drawer history
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const notifItem: AgriNotificationItem = {
      id,
      title: newToast.title,
      message: newToast.message,
      type: newToast.type,
      category: newToast.category,
      icon: newToast.icon,
      timestamp: `Hari ini, ${timeStr}`,
      read: false
    };

    setNotificationsList(prev => {
      if (prev.some(n => n.id === id)) return prev;
      return [notifItem, ...prev];
    });

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const showAgriToast = (options: AgriToastOptions) => {
    const id = options.id || (Date.now().toString() + Math.random().toString(36).substring(2, 5));
    
    // Prevent duplicate toasts with identical id
    setToasts(prev => {
      if (prev.some(t => t.id === id)) return prev;
      return [...prev.slice(-3), { ...options, id }];
    });

    // Push to notification drawer history
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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
      timestamp: `Hari ini, ${timeStr}`,
      read: false
    };

    setNotificationsList(prev => {
      if (prev.some(n => n.id === id)) return prev;
      return [notifItem, ...prev];
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
          
          let headerBg = 'bg-surface';
          let borderAccent = 'border-black';
          let badgeBg = 'bg-[#154734] text-white';

          if (isPenyiraman) {
            headerBg = 'bg-[#154734] text-white';
            borderAccent = 'border-[#154734]';
            badgeBg = 'bg-[#154734] text-white';
          } else if (isPemupukan) {
            headerBg = 'bg-[#154734] text-white';
            borderAccent = 'border-[#154734]';
            badgeBg = 'bg-[#154734] text-white';
          } else if (toast.type === 'error') {
            headerBg = 'bg-[#C43C2C] text-white';
            borderAccent = 'border-black';
          } else if (toast.type === 'warning') {
            headerBg = 'bg-[#154734] text-white';
            borderAccent = 'border-black';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-surface border-3 ${borderAccent} shadow-[5px_5px_0px_0px_#000] rounded-xl p-3.5 flex flex-col gap-2.5 animate-in slide-in-from-top-3 duration-200 transition-all relative`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-outline/40 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border border-black shadow-[1px_1px_0px_0px_#000] ${headerBg}`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {toast.icon || (isPenyiraman ? 'water_drop' : isPemupukan ? 'compost' : 'notifications')}
                    </span>
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-brutal font-black text-xs uppercase tracking-wider text-on-surface truncate">
                        {toast.title}
                      </span>
                      {toast.badgeText && (
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${badgeBg}`}>
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
                    className={`px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer flex items-center gap-1 ${
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
