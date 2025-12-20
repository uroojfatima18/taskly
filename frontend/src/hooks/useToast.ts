// T037: useToast hook for toast state management

'use client';

import { useState, useCallback } from 'react';
import { ToastMessage } from '@/types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage['type'], message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastMessage = { id, type, message };

      setToasts((prev) => [...prev, newToast]);

      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast('success', message),
    [addToast]
  );

  const error = useCallback(
    (message: string) => addToast('error', message),
    [addToast]
  );

  const info = useCallback(
    (message: string) => addToast('info', message),
    [addToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    info,
    clearAll,
  };
}
