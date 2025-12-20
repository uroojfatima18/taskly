// T036: Toast component for notifications
// UI-ENHANCED: Added slide-in animation, progress bar, improved styling

'use client';

import { useEffect, useState } from 'react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  duration?: number;
}

export function Toast({ toast, onDismiss, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Progress bar countdown
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 50);

    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, duration);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [toast.id, onDismiss, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const typeConfig = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      progress: 'bg-green-500',
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      text: 'text-red-800',
      progress: 'bg-red-500',
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      progress: 'bg-blue-500',
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
  };

  const config = typeConfig[toast.type];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 ${config.bg} ${config.border} shadow-lg transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 sm:translate-x-0 opacity-100 scale-100'
          : 'translate-y-4 sm:translate-y-0 sm:translate-x-full opacity-0 scale-95'
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        {config.icon}

        {/* Content */}
        <div className="flex-1 pt-0.5">
          <p className={`text-sm font-medium ${config.text}`}>{toast.message}</p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600"
          aria-label="Dismiss notification"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div
          className={`h-full ${config.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
