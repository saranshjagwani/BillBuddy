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
        <Text style={styles.itemCount}>{items.length} Items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => {
          const isLowStock = parseInt(item.currentStock) <= 5;
          return (
            <View style={styles.card}>
              <View style={styles.content}>
                <View style={styles.left}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <Text style={styles.sku}>
                    ID: {item.itemId.slice(-6).toUpperCase()}
                  </Text>
                </View>

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
                        isLowStock
                          ? styles.lowStockText
                          : styles.normalStockText,
                      ]}
                    >
                      {item.currentStock} in stock
                    </Text>
                  </View>
                </View>
              </View>

              {/* ✅ Clean Action Column */}
              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("AddStockPage", { item })}
                >
                  <Feather name="edit-3" size={18} color="#2563EB" />
                </TouchableOpacity>

                <View style={styles.stripDivider} />


              </View>
               <DeleteItem
                  itemId={item.itemId}
                  shopId={shopId}
                  itemName={item.itemName}
                  onDeleted={() => {}}
                />
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
    backgroundColor: "#F8FAFC", // Cleaner, modern off-white
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
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  itemCount: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },

  sku: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "System", // Use monospace if available
  },
  actionColumn: {
    width: 50,
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 1,
    borderLeftColor: "#F1F5F9",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 8,
  },
  actionIcon: {
    padding: 4,
  },
  iconDivider: {
    height: 1,
    width: "40%",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    // Shadow for "Floating" feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  idBadge: {
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  right: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20, // Capsule style
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  normalStockBg: { backgroundColor: "#F0FDF4" },
  lowStockBg: { backgroundColor: "#FEF2F2" },
  stockText: {
    fontSize: 11,
    fontWeight: "700",
  },
  normalStockText: { color: "#16A34A" },
  lowStockText: { color: "#DC2626" },

  /* Action Strip Styles */
  actionStrip: {
    width: 50,
    backgroundColor: "#FAFBFC",
    borderLeftWidth: 1,
    borderLeftColor: "#F1F5F9",
    justifyContent: "center",
  },
  actionButton: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  stripDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
