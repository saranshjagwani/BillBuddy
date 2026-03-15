import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import SearchBar from "../components/SearchList";
import List from "../components/List";
import FilterPage from "../components/FilterPage";
import { useItems } from "../../../shared/provider/ItemsContext";
import { useItemSearch } from "../hooks/useItemSearch";
import { useItemFilter } from "../hooks/useItemFilter";
import { Feather } from "@expo/vector-icons";

export const InventoryListPage = () => {
  const { items, loading } = useItems();
  const { query, setQuery, filtered: searched } = useItemSearch(items);
  const {
    filters, filtered, categories, suppliers,
    activeFilterCount, isFilterOpen, setIsFilterOpen,
    updateFilter, resetFilters,
  } = useItemFilter(query ? searched : items);

  return (
    <View style={styles.container}>
      {/* Search + Filter Row */}
      <View style={styles.topRow}>
        <View style={styles.searchFlex}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setIsFilterOpen(true)}
        >
          <Feather name="sliders" size={18} color={activeFilterCount > 0 ? "#2874f0" : "#555"} />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listWrapper}>
        <List items={filtered} loading={loading} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 16 , marginTop:10,},
  topRow: {
    flexDirection: "row", alignItems: "center",
    paddingRight: 16, marginTop: 8,
  },
  searchFlex: { flex: 1 },
  filterBtn: {
    padding: 10, backgroundColor: "#fffbfb",
    borderRadius: 10, marginLeft: 8,
    shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 4, elevation: 2,
  },
  badge: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: "#2874f0", borderRadius: 8,
    width: 16, height: 16, alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  listWrapper: { flex: 1 },
});