import React from "react";
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Item } from "../hooks/useItems";
import { useCart } from "../provider/CartProvider";
import { useToast } from "../../../ui/toast/useToast";
import { useGlobalLoading } from "../../../shared/provider/GlobalLoadingProvider";

type ItemScreen = {
  items: Item[];
  loading: boolean;
};

export default function ItemsScreen({ items, loading }: ItemScreen) {
  const { cartItems, addItem, removeItem } = useCart();
  const {showToast} =useToast();
  const {show,hide} =useGlobalLoading();

  const getQty = (itemId: string) =>
    cartItems.find((c) => c.itemId === itemId)?.quantity ?? 0;

  if (loading) {
    show();
  }
  else {
    hide();
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.center}>
        <Feather name="package" size={48} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No items in stock</Text>
        <Text style={styles.emptySub}>Add items to your inventory first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => {
          const qty = getQty(item.itemId);
          const initstock=parseInt(item.currentStock );
          const stock = parseInt(item.currentStock )-qty;
          const isOut = stock === 0;
          const isLow = stock > 0 && stock <= 5;

          return (
            <View style={styles.card}>
              {/* Left */}
              <View style={styles.left}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.itemName}
                </Text>
                <View style={styles.metaRow}>
                  {item.unit && (
                    <Text style={styles.unit}>{item.unit}</Text>
                  )}
                  {isOut ? (
                    <Text style={styles.outStock}>Out of stock</Text>
                  ) : isLow ? (
                    <Text style={styles.lowStock}>Low · {stock} left</Text>
                  ) : (
                    <Text style={styles.inStock}>In stock · {stock}</Text>
                  )}
                </View>
              </View>

              {/* Right */}
              <View style={styles.right}>
                <Text style={styles.price}>₹{item.sellingPrice}</Text>

                {initstock<=0 ? (
                  <View style={styles.outBtn}>
                    <Text style={styles.outBtnText}>Unavailable</Text>
                  </View>
                ) : qty === 0 ? (
                  // Only + Add button when qty is 0
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addItem(item)}
                  >
                    <Feather name="plus" size={14} color="#1E63D5" />
                    <Text style={styles.addBtnText}>Add</Text>
                  </TouchableOpacity>
                ) : qty >= initstock ?(
                 <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => removeItem(item.itemId)}
                    >
                      <Feather name="minus" size={14} color="#1E63D5" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtnDisabled}
                      onPress={() => showToast("warning","You Can't Add More Items")}
                     
                    >
                      <Feather name="plus" size={14} color="#1E63D5" />
                    </TouchableOpacity>
                  </View>
                ):(
                  // Stepper when qty > 0
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => removeItem(item.itemId)}
                    >
                      <Feather name="minus" size={14} color="#1E63D5" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => addItem(item)}
                    >
                      <Feather name="plus" size={14} color="#1E63D5" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC",
    marginBottom:50,

   },
  center: {
    flex: 1, justifyContent: "center",
    alignItems: "center", gap: 8,
  },
  emptyTitle: {
    fontSize: 17, fontWeight: "700",
    color: "#0F172A", marginTop: 12,
  },
  emptySub: { fontSize: 13, color: "#94A3B8" },

  list: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },
  separator: { height: 10 },

  card: {
    backgroundColor: "#fff", borderRadius: 14,
    padding: 14, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, elevation: 2,
  },

  left: { flex: 1, marginRight: 12 },
  name: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  unit: {
    fontSize: 11, color: "#1E63D5", fontWeight: "600",
    backgroundColor: "#EFF6FF", paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 4,
  },
  inStock: { fontSize: 11, color: "#16A34A", fontWeight: "500" },
  lowStock: { fontSize: 11, color: "#F59E0B", fontWeight: "600" },
  outStock: { fontSize: 11, color: "#DC2626", fontWeight: "600" },

  right: { alignItems: "flex-end", gap: 8 },
  price: { fontSize: 16, fontWeight: "700", color: "#0F172A" },

  // Add button
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderWidth: 1.5, borderColor: "#1E63D5",
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { fontSize: 13, color: "#1E63D5", fontWeight: "700" },

  // Qty stepper
  qtyRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "#1E63D5",
    borderRadius: 8, overflow: "hidden",
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  qtyBtnDisabled : { paddingHorizontal: 10, paddingVertical: 6, opacity:0.35 },
  qtyText: {
    fontSize: 14, fontWeight: "700", color: "#0F172A",
    paddingHorizontal: 10,
    borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: "#1E63D5",
  },

  // Out of stock
  outBtn: {
    backgroundColor: "#F1F5F9", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  outBtnText: { fontSize: 12, color: "#94A3B8", fontWeight: "500" },
});