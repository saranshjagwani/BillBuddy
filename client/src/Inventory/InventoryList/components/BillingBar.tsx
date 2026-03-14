import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCart } from "../provider/CartProvider";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type AppStackParamList = {
  CartScreen: undefined;
};

type Nav = StackNavigationProp<AppStackParamList>;

export default function BillingBar() {
  const navigation = useNavigation<Nav>();
  const { cartItems  } = useCart();

  const numberOfItems=cartItems.length;

  const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
  );

  if (totalQty === 0) return null;

  return (
    <View style={styles.container}>
      {/* Left: item count + amount */}
      <View style={styles.left}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{numberOfItems}</Text>
        </View>
        <View>
          <Text style={styles.itemLabel}>
            {numberOfItems} {numberOfItems === 1 ? "item" : "items"} added
          </Text>
          <Text style={styles.amount}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Right: Go to Billing */}
      <TouchableOpacity
        style={styles.billingBtn}
        onPress={() => navigation.navigate("CartScreen")}
        activeOpacity={0.85}
      >
        <Text style={styles.billingText}>Go to Billing</Text>
        <Feather name="arrow-right" size={16} color="#FFD137" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16, left: 16, right: 16,
    backgroundColor: "#1E63D5",
    borderRadius: 16,
    marginBottom:35,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#1E63D5",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    backgroundColor: "#FFD137",
    width: 32, height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 14, fontWeight: "800",
    color: "#1449A8",
  },
  itemLabel: {
    fontSize: 12, color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  amount: {
    fontSize: 16, fontWeight: "800",
    color: "#fff",
  },
  billingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1449A8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  billingText: {
    fontSize: 14, fontWeight: "700",
    color: "#FFD137",
  },
});