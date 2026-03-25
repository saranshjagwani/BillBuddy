import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import type { BillItem } from "./AddItem";

type Props = {
  items: BillItem[];
  onGenerate: () => void;
};

export default function BillBar({ items, onGenerate }: Props) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalDiscount = items.reduce((sum, i) => sum + i.discount, 0);
  const total = items.reduce((sum, i) => sum + i.total, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.summaryTitle}>Bill Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Subtotal: <Text style={styles.summaryBold}>₹{subtotal.toFixed(0)}</Text>
        </Text>
        <Text style={styles.summaryText}>
          Discount: <Text style={styles.summaryBold}>₹{totalDiscount.toFixed(0)}</Text>
        </Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, items.length === 0 && styles.generateBtnDisabled]}
        onPress={onGenerate}
        disabled={items.length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.generateText}>Generate Bill</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom:10,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32,
    shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  summaryTitle: {
    fontSize: 16, fontWeight: "700",
    color: "#0F172A", marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: { fontSize: 14, color: "#64748B" },
  summaryBold: { fontWeight: "600", color: "#0F172A" },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
  totalValue: { fontSize: 28, fontWeight: "800", color: "#0F172A" },
  generateBtn: {
    backgroundColor: "#1E63D5",
    borderRadius: 14, paddingVertical: 16,
    alignItems: "center",
  },
  generateBtnDisabled: { backgroundColor: "#CBD5E1" },
  generateText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
