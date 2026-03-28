"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      border: "border-l-[#1A6B5A]",
      icon: <CheckCircle size={16} className="text-[#1A6B5A] flex-shrink-0 mt-0.5" />,
    },
    error: {
      border: "border-l-accent",
      icon: <AlertCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />,
    },
    info: {
      border: "border-l-[#6B8A82]",
      icon: <Info size={16} className="text-[#6B8A82] flex-shrink-0 mt-0.5" />,
    },
  }[toast.type];

  return (
    <div
      className={`
        flex items-start gap-3 bg-white rounded-xl px-4 py-3.5 border-l-4 min-w-[280px] max-w-[360px]
        shadow-[0_8px_32px_rgba(26,107,90,0.15)] border border-[#D6E8E3]
        transition-all duration-300
        ${config.border}
        ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
      `}
      role="alert"
      aria-live="polite"
    >
      {config.icon}
      <p className="flex-1 text-sm text-text-main leading-snug">{toast.message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Fechar notificação"
        className="text-text-muted hover:text-text-main transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Toast container ───────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-label="Notificações"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── useToast hook ─────────────────────────────────────────────────────────────

import { useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  return { toasts, toast, dismiss };
}
