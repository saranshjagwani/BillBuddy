// src/ui/toast/Toast.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react-native";
import type { ToastItem } from "../types/types";

export default function Toast({ toast }: { toast: ToastItem }) {
  const stylesByType = {
    success: {
      container: styles.successContainer,
      text: styles.successText,
      icon: <CheckCircle size={18} color="#15803d" />,
    },
    error: {
      container: styles.errorContainer,
      text: styles.errorText,
      icon: <XCircle size={18} color="#b91c1c" />,
    },
    warning: {
      container: styles.warningContainer,
      text: styles.warningText,
      icon: <AlertTriangle size={18} color="#a16207" />,
    },
  };

  const typeStyle = stylesByType[toast.type];

  return (
    <View style={[styles.container, typeStyle.container]}>
      {typeStyle.icon}
      <Text style={[styles.text, typeStyle.text]}>
        {toast.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
  },

  successContainer: {
    backgroundColor: "#dcfce7",
  },

  successText: {
    color: "#15803d",
  },

  errorContainer: {
    backgroundColor: "#fee2e2",
  },

  errorText: {
    color: "#b91c1c",
  },

  warningContainer: {
    backgroundColor: "#fef9c3",
  },

  warningText: {
    color: "#a16207",
  },
});