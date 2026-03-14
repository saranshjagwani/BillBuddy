import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import SearchBar from "../components/SearchList";
import List from "../components/List";
import FilterPage from "../components/FilterComponent";
import BillingBar from "../components/BillingBar";
import { useItems } from "../hooks/useItems";
import { useItemSearch } from "../hooks/useItemSearch";
import { useItemFilter } from "../hooks/useItemFilter";
import { useCart } from "../provider/CartProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type AppStackParamList = {
  AddStockPage: undefined;
  AddStockScreen1: undefined;
  ShopSetup: undefined;
  HomeScreen: undefined;
  InventoryList: undefined;
  AdditionalScreen: undefined;
  CartScreen: undefined;
};

type Nav = StackNavigationProp<AppStackParamList, "InventoryList">;

export const InventoryListPage = () => {
  const navigation = useNavigation<Nav>();

  const { items, loading } = useItems();
  const { query, setQuery, filtered: searched } = useItemSearch(items);
  const {
    filters, filtered, categories, suppliers,
    activeFilterCount, isFilterOpen, setIsFilterOpen,
    updateFilter, resetFilters,
  } = useItemFilter(query ? searched : items);

  const { cartItems} = useCart();
  const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.container}>

      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.searchFlex}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsFilterOpen(true)}
        >
          <Feather
            name="sliders"
            size={18}
            color={activeFilterCount > 0 ? "#1E63D5" : "#555"}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listWrapper}>
        <List
          items={filtered}
          loading={loading}
        />
      </View>

      <FilterPage
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        categories={categories}
        suppliers={suppliers}
        onUpdate={updateFilter}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      />
      <BillingBar />  
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 16 },
  topRow: {
    flexDirection: "row", alignItems: "center",
    paddingRight: 16, marginTop: 8,
  },
  searchFlex: { flex: 1 },
  iconBtn: {
    padding: 10, backgroundColor: "#fff",
    borderRadius: 10, marginLeft: 8,
    shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
  },
  badge: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: "#1E63D5", borderRadius: 8,
    width: 16, height: 16, alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  listWrapper: { flex: 1 },
});