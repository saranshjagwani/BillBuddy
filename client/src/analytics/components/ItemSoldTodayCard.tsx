// components/ItemsSoldTodayCard.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getTodayAnalyticsApi } from "../../Billing/BillingHistory/services/BillingHistory.service";

// ── Types ──────────────────────────────────────────────────────────────────

interface ItemSummary {
  itemName: string;
  quantity: number;
}

interface AnalyticsData {
  itemsSummary: Record<string, ItemSummary>;
  totalItems: number;
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
    seconds?: number; // fallback
    nanoseconds?: number;
  } | null;
  date?: string;
}

// ── Row ────────────────────────────────────────────────────────────────────

const ItemRow: React.FC<{
  item: ItemSummary;
  index: number;
  maxQty: number;
}> = ({ item, index, maxQty }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  const barPct = maxQty > 0 ? item.quantity / maxQty : 0;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(barAnim, {
        toValue: barPct,
        duration: 500,
        delay: delay + 100,
        useNativeDriver: false, // width animation needs this
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Rank */}
      <View style={styles.rank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>

      {/* Name + bar */}
      <View style={styles.rowMiddle}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.itemName}
        </Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Quantity */}
      <View style={styles.qtyBadge}>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <Text style={styles.qtyLabel}>sold</Text>
      </View>
    </Animated.View>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

const ItemsSoldTodayCard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getTodayAnalyticsApi();
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Parse itemsSummary map → sorted array
  const items: ItemSummary[] = data?.itemsSummary
    ? Object.values(data.itemsSummary)
        .filter((i) => i.itemName && i.itemName.trim() !== "")
        .sort((a, b) => b.quantity - a.quantity)
    : [];

  const maxQty = items.length > 0 ? items[0].quantity : 1;

  // ✅ Fix — use _seconds instead of seconds
  const updatedTime = data?.updatedAt
    ? new Date(
        (data.updatedAt._seconds ?? data.updatedAt.seconds ?? 0) * 1000,
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  console.log("Raw updatedAt from backend:", data?.updatedAt);
  console.log("Updated time for analytics:", updatedTime);

  return (
    <View style={styles.card}>
      {/* Accent bar */}
      <View style={styles.accentBar} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Items Sold Today</Text>
          {data?.date && <Text style={styles.headerDate}>{data.date}</Text>}
        </View>
        {!loading && data && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalValue}>{data.totalItems}</Text>
            <Text style={styles.totalLabel}>units</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.stateBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {!loading && !error && items.length === 0 && (
        <View style={styles.stateBox}>
          <Text style={styles.emptyText}>No items sold yet today</Text>
        </View>
      )}

      {!loading && !error && items.length > 0 && (
        <ScrollView
          scrollEnabled={items.length > 6}
          style={items.length > 6 ? { maxHeight: 320 } : undefined}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {items.map((item, i) => (
            <ItemRow
              key={`${item.itemName}-${i}`}
              item={item}
              index={i}
              maxQty={maxQty}
            />
          ))}
        </ScrollView>
      )}

      {/* Footer timestamp */}
      {updatedTime && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Updated at {updatedTime}</Text>
        </View>
      )}
    </View>
  );
};

export default ItemsSoldTodayCard;

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F4",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accentBar: {
    height: 3,
    backgroundColor: "#2563EB",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#EEF3FF",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.2,
  },
  headerDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  totalBadge: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  totalLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    gap: 12,
  },
  rank: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  rowMiddle: {
    flex: 1,
    gap: 5,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  barTrack: {
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 2,
    opacity: 0.7,
  },
  qtyBadge: {
    alignItems: "center",
    minWidth: 36,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  qtyLabel: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // States
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  stateBox: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FAFBFF",
  },
  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "right",
  },
});
