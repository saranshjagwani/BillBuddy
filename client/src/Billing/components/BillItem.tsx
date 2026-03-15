import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { BillItem as BillItemType } from "./AddItem";


type Props = {
  item: BillItemType;
  index: number;
  onEdit: (item: BillItemType) => void;
  onDelete: (itemId: string) => void;
};

export default function BillItem({ item, onEdit, onDelete }: Props) {
 
  return (
    <View style={styles.card}>
      {/* Left: name + qty × price */}
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>{item.itemName}</Text>
        <Text style={styles.meta}>
          ₹{item.price} × {item.quantity}
          {item.discount > 0 && (
            <Text style={styles.discount}>  −₹{item.discount}</Text>
          )}
        </Text>
      </View>

      {/* Right: total + actions */}
      <View style={styles.right}>
        <Text style={styles.total}>₹{item.total.toFixed(0)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(item)}
          >
            <Feather name="edit-2" size={14} color="#1E63D5" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(item.itemId)}
          >
            <Feather name="x" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    marginHorizontal: 16, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, elevation: 2,
  },
  left: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  meta: { fontSize: 13, color: "#64748B" },
  discount: { color: "#16A34A", fontWeight: "600" },

  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  total: { fontSize: 17, fontWeight: "800", color: "#0F172A", marginRight: 4 },
  actions: { flexDirection: "row", gap: 6 },
  editBtn: {
    padding: 7, backgroundColor: "#EFF6FF", borderRadius: 8,
  },
  deleteBtn: {
    padding: 7, backgroundColor: "#FEE2E2", borderRadius: 8,
  },
});