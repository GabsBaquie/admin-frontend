"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import Notification from "../components/common/Notification";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Notification
          open={!!toast}
          message={toast.message}
          severity={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};
