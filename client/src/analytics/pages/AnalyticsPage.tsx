// screens/AnalyticsPage.tsx
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DashboardOverview from "../components/DashboardOverview";
import ItemsSoldTodayCard from "../components/ItemSoldTodayCard"
import StockAlertCard from "../components/StockAlertCard";

const AnalyticsPage = () => {
  return (

      <ScrollView
        style={styles.scroll}

        showsVerticalScrollIndicator={false}
      >
        {/* 1. Stats overview (sales, items sold, bills, low/out counts) */}
        <DashboardOverview />
        <View style={styles.content}>

        {/* 2. Items sold today */}
        <View style={styles.section}>
          <ItemsSoldTodayCard />
        </View>

        {/* 3. Low stock */}
        <View style={styles.section}>
          <StockAlertCard type="low" />
        </View>

        {/* 4. Out of stock */}
        <View style={styles.section}>
          <StockAlertCard type="out" />
        </View>

        <View style={styles.bottomPad} />
        </View>
      </ScrollView>
  );
};

export default AnalyticsPage;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
  },
  bottomPad: {
    height: 40,
  },
});
