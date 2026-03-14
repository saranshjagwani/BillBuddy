import React from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCart } from "../provider/CartProvider";

const Cart = () => {
  const { cartItems, addItem, removeItem, clearCart, totalQty } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Feather name="shopping-cart" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Cart is empty</Text>
          <Text style={styles.emptySub}>Add items from inventory to bill</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.headerRight}>
          <Text style={styles.itemCount}>{totalQty} items</Text>
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.itemId}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Item Info */}
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Feather name="package" size={18} color="#1E63D5" />
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price} / unit</Text>
              </View>
            </View>

            {/* Qty Controls */}
            <View style={styles.cardRight}>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => removeItem(item.itemId)}
                >
                  <Feather name="minus" size={14} color="#1E63D5" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => addItem(item as any)}
                >
                  <Feather name="plus" size={14} color="#1E63D5" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtotal}>
                ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Summary + Checkout */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Feather name="file-text" size={18} color="#fff" />
          <Text style={styles.checkoutText}>Generate Bill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" ,
   marginTop:25,
   marginBottom:35,
  },

  // Empty
  emptyState: {
    flex: 1, justifyContent: "center",
    alignItems: "center", gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginTop: 8 },
  emptySub: { fontSize: 14, color: "#94A3B8" },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16,
    paddingVertical: 14, backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemCount: { fontSize: 13, color: "#64748B" },
  clearBtn: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: "#FEE2E2", borderRadius: 6,
  },
  clearText: { fontSize: 13, color: "#DC2626", fontWeight: "600" },

  // List
  list: { padding: 16, paddingBottom: 24 },
  separator: { height: 10 },

  // Card
  card: {
    backgroundColor: "#fff", borderRadius: 12,
    padding: 14, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center", justifyContent: "center",
  },
  itemName: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
  itemPrice: { fontSize: 12, color: "#64748B", marginTop: 2 },

  cardRight: { alignItems: "flex-end", gap: 6 },
  qtyRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "#1E63D5",
    borderRadius: 8, overflow: "hidden",
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  qtyText: {
    fontSize: 14, fontWeight: "700", color: "#0F172A",
    paddingHorizontal: 10,
    borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: "#1E63D5",
  },
  subtotal: { fontSize: 14, fontWeight: "700", color: "#1E63D5" },

  // Footer
  footer: {
    backgroundColor: "#fff", padding: 16,
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: "#64748B" },
  summaryValue: { fontSize: 14, color: "#0F172A", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#1E63D5" },
  checkoutBtn: {
    backgroundColor: "#1E63D5", borderRadius: 10,
    paddingVertical: 14, marginTop: 12,
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default Cart;