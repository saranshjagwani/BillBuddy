import React from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { Item } from "../shared/provider/ItemsContext";

export type AppStackParamList = {
   AddStockPage: { item?: Item };
  AddStockScreen1: undefined;
  ShopSetupScreen: undefined;
  HomeScreen: undefined;
  InventoryListPage: undefined;
  BillingPage: undefined;
  BillHistoryPage: undefined;
  AnalyticsPage: undefined;
};

type Nav = StackNavigationProp<AppStackParamList, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView>
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />


      <View style={styles.header}>
        <Text style={styles.greeting}>Namaste 👋</Text>
        <Text style={styles.title}>BillBuddy</Text>
        <Text style={styles.subtitle}>Manage your shop inventory</Text>
      </View>

      <View style={styles.cardsContainer}>

        {/* Add Stock */}
        <TouchableOpacity
          style={[styles.card, styles.cardPrimary]}
          onPress={() => navigation.navigate("AddStockPage")}
          activeOpacity={0.85}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>＋</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Add Stock</Text>
            <Text style={styles.cardDescription}>
              Add new products or restock existing inventory
            </Text>
          </View>
          <Text style={styles.cardArrow}>→</Text>
        </TouchableOpacity>

        {/* Inventory List */}
        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={() => navigation.navigate("InventoryListPage")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, styles.cardIconDark]}>
            <Text style={[styles.cardIconText, { color: "#fff" }]}>☰</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, styles.cardTitleDark]}>
              Inventory List
            </Text>
            <Text style={[styles.cardDescription, styles.cardDescriptionDark]}>
              View and manage all your current stock
            </Text>
          </View>
          <Text style={[styles.cardArrow, styles.cardArrowDark]}>→</Text>
        </TouchableOpacity>

        {/* Billing */}
        <TouchableOpacity
          style={[styles.card, styles.cardBilling]}
          onPress={() => navigation.navigate("BillingPage")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, styles.cardIconBilling]}>
            <Text style={[styles.cardIconText, { color: "#FFD137" }]}>₹</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, styles.cardTitleDark]}>
              Billing
            </Text>
            <Text style={[styles.cardDescription, styles.cardDescriptionDark]}>
              Create bills and manage transactions
            </Text>
          </View>
          <Text style={[styles.cardArrow, styles.cardArrowDark]}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardHistory]}
          onPress={() => navigation.navigate("BillHistoryPage")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, styles.cardIconHistory]}>
            <Text style={[styles.cardIconText, { color: "#A78BFA" }]}>📋</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, styles.cardTitleDark]}>
              Bill History
            </Text>
            <Text style={[styles.cardDescription, styles.cardDescriptionDark]}>
              View, download and share past bills
            </Text>
          </View>
          <Text style={[styles.cardArrow, styles.cardArrowDark]}>→</Text>
        </TouchableOpacity>
                {/* Analytics ← NEW */}
        <TouchableOpacity
          style={[styles.card, styles.cardAnalytics]}
          onPress={() => navigation.navigate("AnalyticsPage")}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, styles.cardIconAnalytics]}>
            <Text style={[styles.cardIconText, { color: "#34D399" }]}>📊</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, styles.cardTitleDark]}>
              Analytics
            </Text>
            <Text style={[styles.cardDescription, styles.cardDescriptionDark]}>
              Today's sales, stock alerts and insights
            </Text>
          </View>
          <Text style={[styles.cardArrow, styles.cardArrowDark]}>→</Text>
        </TouchableOpacity>


      </View>



      <Text style={styles.footer}>Tap a card to get started</Text>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#0A0A0A",
    paddingHorizontal: 24, paddingTop: 60,
  },
  header: { marginBottom: 40 },
  greeting: {
    fontSize: 14, color: "#666", letterSpacing: 1,
    textTransform: "uppercase", marginBottom: 8, fontWeight: "500",
  },
  title: {
    fontSize: 38, fontWeight: "800",
    color: "#FFFFFF", letterSpacing: -1, marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: "#555", fontWeight: "400" },

  cardsContainer: { gap: 16 },
  card: {
    borderRadius: 20, padding: 24,
    flexDirection: "row", alignItems: "center", gap: 16,
  },
  cardPrimary: { backgroundColor: "#F5C518" },
  cardSecondary: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1, borderColor: "#2A2A2A",
  },
  cardBilling: {
    backgroundColor: "#0D2150",
    borderWidth: 1, borderColor: "#1E63D5",
  },
  cardHistory: {
    backgroundColor: "#13092A",
    borderWidth: 1, borderColor: "#6D28D9",
  },

  cardAnalytics: {
    backgroundColor: "#061A12",
    borderWidth: 1,
    borderColor: "#065F46",
  },
  cardIconAnalytics: { backgroundColor: "#064E3B" },

  cardIcon: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  cardIconDark: { backgroundColor: "#2A2A2A" },
  cardIconBilling: { backgroundColor: "#1E3A7A" },
  cardIconHistory: { backgroundColor: "#2E1065" },

  cardIconText: { fontSize: 22, color: "#000", fontWeight: "700" },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 18, fontWeight: "700",
    color: "#000", marginBottom: 4, letterSpacing: -0.3,
  },
  cardTitleDark: { color: "#FFF" },
  cardDescription: { fontSize: 13, color: "#333", lineHeight: 18 },
  cardDescriptionDark: { color: "#555" },
  cardArrow: { fontSize: 20, color: "#000", fontWeight: "300" },
  cardArrowDark: { color: "#444" },

  footer: {
    textAlign: "center", color: "#333",
    fontSize: 13, marginTop: 32, letterSpacing: 0.5,
  },
});
