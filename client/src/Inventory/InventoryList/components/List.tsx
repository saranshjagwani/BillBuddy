import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { Item } from "../hooks/useItems";

type ItemScreen={
  items: Item[];
  loading:boolean
}

export default function ItemsScreen({items,loading}: ItemScreen) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No items in stock</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left: Name + Type */}
            <View style={styles.left}>
              <Text style={styles.name}>{item.itemName}</Text>

            </View>

            {/* Right: Price + Stock */}
            <View style={styles.right}>
              <Text style={styles.price}>₹{item.sellingPrice}</Text>
              <Text
                style={[
                  styles.stock,
                  parseInt(item.currentStock) <= 5 && styles.lowStock,
                ]}
              >
                Qty: {item.currentStock}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  meta: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
  },
  stock: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  lowStock: {
    color: "#e53935",
    fontWeight: "600",
  },
  separator: {
    height: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});