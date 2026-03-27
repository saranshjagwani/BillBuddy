import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import type { Item } from "../hooks/useItems";
import DeleteItem from "./DeleteItem";
import { useAuth } from "../../../shared/provider/AuthContextProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../screen/HomeScreen";

type ItemScreen = {
  items: Item[];
  loading: boolean;
};

type Nav = StackNavigationProp<AppStackParamList, "List">;

export default function ItemsScreen({ items, loading }: ItemScreen) {
  const { shopData } = useAuth();
  const navigation = useNavigation<Nav>();
  const shopId = shopData?.shopId;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.center}>
        <Feather name="package" size={48} color="#CBD5E1" />
        <Text style={styles.emptyText}>Your inventory is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Inventory</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => {
          const isLowStock = parseInt(item.currentStock) <= 5;
          return (
            <View style={styles.card}>

              {/* Main content */}
              <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.itemName}
                </Text>
                <View style={styles.right}>
                  <Text style={styles.price}>₹{item.sellingPrice}</Text>
                  <View
                    style={[
                      styles.stockBadge,
                      isLowStock ? styles.lowStockBg : styles.normalStockBg,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockText,
                        isLowStock ? styles.lowStockText : styles.normalStockText,
                      ]}
                    >
                      {item.currentStock} in stock
                    </Text>
                  </View>
                </View>
              </View>

              {/* Edit column */}
              <View style={styles.editColumn}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate("AddStockPage", { item })}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-3" size={15} color="#2563EB" />
                </TouchableOpacity>
              </View>

              {/* Delete column */}
              <View style={styles.deleteColumn}>
                <DeleteItem
                  itemId={item.itemId}
                  shopId={shopId}
                  itemName={item.itemName}
                  onDeleted={() => {}}
                />
              </View>

            </View>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  itemCount: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },

  // Card row: content | edit | delete
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },

  // Left: item info
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginRight: 8,
  },
  right: {
    alignItems: "flex-end",
    gap: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  normalStockBg: { backgroundColor: "#F0FDF4" },
  lowStockBg: { backgroundColor: "#FEF2F2" },
  stockText: {
    fontSize: 11,
    fontWeight: "600",
  },
  normalStockText: { color: "#16A34A" },
  lowStockText: { color: "#DC2626" },

  // Edit column
  editColumn: {
    width: 48,
    borderLeftWidth: 1,
    borderLeftColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Delete column
  deleteColumn: {
    width: 48,
    borderLeftWidth: 1,
    borderLeftColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty & loading
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
