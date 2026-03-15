import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = { onAdd: () => void };

export default function EmptyBill({ onAdd }: Props) {
  return (
    <View style={styles.container}>
      {/* Illustration placeholder — swap with your mic image */}
      <View style={styles.illustration}>
        <Feather name="mic" size={52} color="#93C5FD" />
        <View style={styles.illustrationRing} />
      </View>

      <Text style={styles.title}>No items added yet</Text>
      <Text style={styles.subtitle}>Use voice or add manually</Text>

      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Feather name="plus" size={16} color="#0F172A" />
        <Text style={styles.addBtnText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 16,
    marginTop: 16,
  },
  illustration: {
    width: 120, height: 120,
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  illustrationRing: {
    position: "absolute",
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#DBEAFE",
    opacity: 0.5, zIndex: -1,
  },
  title: {
    fontSize: 20, fontWeight: "700",
    color: "#0F172A", marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: "#64748B", marginBottom: 28 },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 50,
  },
  addBtnText: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
});