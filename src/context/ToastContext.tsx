import React, { createContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
interface Toast {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
}

type ShowArg = string | { message: string; type?: ToastType; title?: string; position?: ToastPosition; duration?: number };

interface ToastContextValue {
  show: (arg: ShowArg) => void;
  success: (message: string, opts?: Omit<ShowArg, 'message' | 'type'>) => void;
  error: (message: string, opts?: Omit<ShowArg, 'message' | 'type'>) => void;
  info: (message: string, opts?: Omit<ShowArg, 'message' | 'type'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((arg: ShowArg) => {
    const id = Date.now() + Math.random();
    const base: Toast = {
      id,
      message: typeof arg === 'string' ? arg : arg.message,
      title: typeof arg === 'string' ? undefined : arg.title,
      type: typeof arg === 'string' ? 'info' : (arg.type || 'info'),
      position: typeof arg === 'string' ? 'top-right' : (arg.position || 'top-right'),
      duration: typeof arg === 'string' ? 3000 : (arg.duration || 3000),
    };
    setToasts((prev) => [...prev, base]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, base.duration);
  }, []);

  const success = useCallback((message: string, opts?: { title?: string; position?: ToastPosition; duration?: number }) => {
    show({ message, type: 'success', ...opts });
  }, [show]);
  const error = useCallback((message: string, opts?: { title?: string; position?: ToastPosition; duration?: number }) => {
    show({ message, type: 'error', ...opts });
  }, [show]);
  const info = useCallback((message: string, opts?: { title?: string; position?: ToastPosition; duration?: number }) => {
    show({ message, type: 'info', ...opts });
  }, [show]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ message: string; type?: ToastType; position?: ToastPosition; duration?: number; title?: string }>;
      show({ message: ce.detail.message, type: ce.detail.type, position: ce.detail.position, duration: ce.detail.duration, title: ce.detail.title });
    };
    window.addEventListener('app:toast', handler as EventListener);
    return () => window.removeEventListener('app:toast', handler as EventListener);
  }, [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      {(['top-right','top-left','bottom-right','bottom-left'] as ToastPosition[]).map(pos => {
        const posToasts = toasts.filter(t => t.position === pos);
        const positionClass =
          pos === 'top-right' ? 'top-4 right-4' :
          pos === 'top-left' ? 'top-4 left-4' :
          pos === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4';
        return (
          <div key={pos} className={`fixed ${positionClass} z-50 space-y-2`}>
            {posToasts.map((t) => (
              <div
                key={t.id}
                className={`px-4 py-3 rounded-lg shadow-lg border animate-slide-in-up ${
                  t.type === 'success'
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                    : t.type === 'error'
                    ? 'bg-red-600/20 border-red-500/40 text-red-300'
                    : 'bg-[#18282e] border-[#27353a] text-slate-200'
                }`}
              >
                {t.title && <div className="text-sm font-bold mb-1">{t.title}</div>}
                <div className="text-sm">{t.message}</div>
              </div>
            ))}
          </div>
        );
      })}
    </ToastContext.Provider>
  );
};

export default ToastContext;
