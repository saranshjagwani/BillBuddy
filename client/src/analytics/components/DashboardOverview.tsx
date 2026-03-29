// DashboardOverview.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useItems } from "../../shared/provider/ItemsContext";
import { getTodayAnalyticsApi } from "../../Billing/BillingHistory/services/BillingHistory.service";

// ── Types ──────────────────────────────────────────────────────────────────

interface AnalyticsData {
  date: string;
  totalSales: number;
  totalItems: number;
  totalBills: number;
  updatedAt?: { seconds: number } | null;
}

// ── Palette ────────────────────────────────────────────────────────────────

const C = {
  bg: "#F0F4FF",
  card: "#FFFFFF",
  border: "#E2E8F4",
  blue: "#2563EB",
  blueSoft: "#EEF3FF",
  green: "#16A34A",
  greenSoft: "#F0FDF4",
  orange: "#EA580C",
  orangeSoft: "#FFF7ED",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  text: "#0F172A",
  textSub: "#64748B",
  textMuted: "#94A3B8",
  accent3: "#7C3AED",
  accent3Soft: "#F5F3FF",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

const formatTime = (ts?: { seconds: number } | null) => {
  if (!ts) return null;
  return new Date(ts.seconds * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// ── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | null;
  loading: boolean;
  accent: string;
  accentSoft: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  loading,
  accent,
  accentSoft,
  icon,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading && value !== null) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, value]);

  return (
    <View style={styles.card}>
      {/* top accent line */}
      <View style={[styles.cardAccentBar, { backgroundColor: accent }]} />

      <View style={styles.cardInner}>
        {/* icon pill */}
        <View style={[styles.iconPill, { backgroundColor: accentSoft }]}>
          <Text style={{ fontSize: 14 }}>{icon}</Text>
        </View>

        <Text style={styles.cardLabel}>{label}</Text>

        {loading ? (
          <View style={styles.skeletonValue} />
        ) : (
          <Animated.Text
            style={[styles.cardValue, { color: accent, opacity: fadeAnim }]}
          >
            {value ?? "—"}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

export const DashboardOverview = () => {
  const { items, loading: itemsLoading, error: itemsError } = useItems();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getTodayAnalyticsApi();
        if (!cancelled) setAnalytics(data);
      } catch (err: any) {
        if (!cancelled)
          setAnalyticsError(err.message || "Failed to fetch analytics");
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Low stock = currentStock <= 5, out of stock = 0
  const lowStockItems = items.filter(
    (i) => i.currentStock > 0 && i.currentStock <= 5,
  );
  const outOfStockItems = items.filter((i) => i.currentStock === 0);

  const statCards = [
    {
      label: "Today's Sales",
      value: analytics
        ? `₹ ${analytics.totalSales.toLocaleString("en-IN")}`
        : null,
      accent: C.blue,
      accentSoft: C.blueSoft,
      icon: "💰",
    },
    {
      label: "Bills Generated",
      value: analytics ? String(analytics.totalBills) : null,
      accent: C.accent3, // purple
      accentSoft: C.accent3Soft,
      icon: "🧾",
    },
    {
      label: "Items Sold Today",
      value: analytics ? String(analytics.totalItems) : null,
      accent: C.green,
      accentSoft: C.greenSoft,
      icon: "📦",
    },
    {
      label: "Out of Stock",
      value: itemsLoading ? null : String(outOfStockItems.length),
      accent: C.red,
      accentSoft: C.redSoft,
      icon: "🚫",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Analytics</Text>
        {analytics?.date && (
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {formatDate(analytics.date)}
            </Text>
          </View>
        )}
      </View>

      {/* ── 2×2 Grid ── */}
      {analyticsError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {analyticsError}</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {statCards.map((card) => (
            <View key={card.label} style={styles.gridCell}>
              <StatCard
                label={card.label}
                value={card.value}
                loading={analyticsLoading || itemsLoading}
                accent={card.accent}
                accentSoft={card.accentSoft}
                icon={card.icon}
              />
            </View>
          ))}
        </View>
      )}

      {/* ── Low Stock Detail List ──
      {!itemsLoading && lowStockItems.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>⚠️ Low Stock Items</Text>
          {lowStockItems
            .sort((a, b) => a.currentStock - b.currentStock)
            .map((item) => (
              <View key={item.itemId} style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemName} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <Text style={styles.listItemMeta}>
                    {item.unit} · ₹{item.sellingPrice}
                  </Text>
                </View>
                <View
                  style={[
                    styles.stockPill,
                    {
                      backgroundColor:
                        item.currentStock <= 2 ? C.redSoft : C.orangeSoft,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockPillText,
                      {
                        color:
                          item.currentStock <= 2 ? C.red : C.orange,
                      },
                    ]}
                  >
                    {item.currentStock} left
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}

      {/* ── Out of Stock Detail List ── }
      {!itemsLoading && outOfStockItems.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>🚫 Out of Stock</Text>
          {outOfStockItems.map((item) => (
            <View key={item.itemId} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemName} numberOfLines={1}>
                  {item.itemName}
                </Text>
                <Text style={styles.listItemMeta}>
                  {item.unit} · ₹{item.sellingPrice}
                </Text>
              </View>
              <View style={[styles.stockPill, { backgroundColor: C.redSoft }]}>
                <Text style={[styles.stockPillText, { color: C.red }]}>
                  0 left
                </Text>
              </View>
            </View>
          ))}
        </View>
      )} */}

      {/* ── Timestamp ── */}
      {/* {analytics?.updatedAt && (
        <Text style={styles.timestamp}>
          Last updated at {formatTime(analytics.updatedAt )}
        </Text>
      )} */}
    </ScrollView>
  );
};

export default DashboardOverview;

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    padding: 20,
    // paddingBottom: 40,
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  greeting: {
    fontSize: 13,
    color: C.textSub,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.5,
  },
  dateBadge: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateBadgeText: {
    fontSize: 12,
    color: C.textSub,
    fontWeight: "500",
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  gridCell: {
    width: "47.5%",
  },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAccentBar: {
    height: 3,
    width: "100%",
  },
  cardInner: {
    padding: 16,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 12,
    color: C.textSub,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  skeletonValue: {
    height: 30,
    width: 70,
    backgroundColor: C.border,
    borderRadius: 6,
    marginTop: 2,
  },

  // Error
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
    padding: 14,
  },
  errorText: {
    color: C.red,
    fontSize: 13,
  },

  // List sections
  listSection: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  listSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  listItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
    marginBottom: 2,
  },
  listItemMeta: {
    fontSize: 11,
    color: C.textMuted,
  },
  stockPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stockPillText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Timestamp
  timestamp: {
    textAlign: "center",
    fontSize: 11,
    color: C.textMuted,
    marginTop: 4,
  },
});
