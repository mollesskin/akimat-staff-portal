"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3400);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((item) => {
          const Icon = item.type === "error" ? XCircle : item.type === "info" ? Info : CheckCircle2;
          return (
            <div key={item.id} className="flex items-start gap-3 rounded-lg border bg-card p-4 text-sm shadow-soft animate-in slide-in-from-top-2">
              <Icon className={item.type === "error" ? "mt-0.5 h-5 w-5 text-destructive" : "mt-0.5 h-5 w-5 text-primary"} />
              <div className="flex-1 font-medium">{item.message}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setToasts((items) => items.filter((toast) => toast.id !== item.id))}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
