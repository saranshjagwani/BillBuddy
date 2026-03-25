// src/ui/toast/ToastProvider.tsx

import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { ToastItem, ToastType } from "../types/types";
import Toast from "../toast/Toast";

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString(); // safer for React Native

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToastContext must be used inside ToastProvider");
  }

  return ctx;
}

const styles = StyleSheet.create({
  container: {
    zIndex:500,
    position: "absolute",
    top: 60,
    right: 16,
    left: 16,
    alignItems: "flex-end",
    gap: 8,
  },
});