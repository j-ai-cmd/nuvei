"use client";

import { createContext, useCallback, useContext, useState } from "react";
import BasicToast, { type ToastType } from "@/components/smoothui/basic-toast";

type Notify = (message: string, type?: ToastType) => void;
const ToastContext = createContext<Notify>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; type: ToastType } | null>(null);
  const notify = useCallback<Notify>((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      {toast && (
        <BasicToast key={toast.id} message={toast.message} type={toast.type} duration={3500} onClose={() => setToast(null)} />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
