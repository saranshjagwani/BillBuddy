// components/StockAlertCard.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useItems } from "../../shared/provider/ItemsContext";

// ── Types ──────────────────────────────────────────────────────────────────

type AlertType = "low" | "out";

interface StockAlertCardProps {
  type: AlertType;
  onItemPress?: (itemId: string) => void;
}

// ── Config per type ────────────────────────────────────────────────────────

const CONFIG = {
  low: {
    title: " Low Stock Items",
    emptyText: " No low stock items",
    accentColor: "#EA580C",
    softBg: "#FFF7ED",
    borderColor: "#FED7AA",
    pillBg: "#FFF7ED",
    pillText: "#EA580C",
    headerBg: "#FFF7ED",
    filter: (stock: number) => stock > 0 && stock <= 5,
    label: (stock: number) => `${stock} left`,
  },
  out: {
    title: " Out of Stock",
    emptyText: "All items in stock",
    accentColor: "#DC2626",
    softBg: "#FEF2F2",
    borderColor: "#FECACA",
    pillBg: "#FEF2F2",
    pillText: "#DC2626",
    headerBg: "#FEF2F2",
    filter: (stock: number) => stock === 0,
    label: () => "Out",
  },
};

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  itemName: string;
  currentStock: number;
  sellingPrice: number;
  unit: string;
  type: AlertType;
  index: number;
  onPress?: () => void;
}

const StockRow: React.FC<RowProps> = ({
  itemName,
  currentStock,
  sellingPrice,
  unit,
  type,
  index,
  onPress,
}) => {
  const cfg = CONFIG[type];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {/* Left dot indicator */}
        <View
          style={[styles.dot, { backgroundColor: cfg.accentColor }]}
        />

        {/* Item info */}
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>
            {itemName}
          </Text>
          <Text style={styles.rowMeta}>
            {unit || "unit"} · ₹{sellingPrice}
          </Text>
        </View>

        {/* Stock pill */}
        <View style={[styles.pill, { backgroundColor: cfg.pillBg }]}>
          <Text style={[styles.pillText, { color: cfg.pillText }]}>
            {cfg.label(currentStock)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

const StockAlertCard: React.FC<StockAlertCardProps> = ({ type, onItemPress }) => {
  const { items, loading, error } = useItems();
  const cfg = CONFIG[type];

  const filtered = items
    .filter((i) => cfg.filter(i.currentStock))
    .sort((a, b) => a.currentStock - b.currentStock);

  return (
    <View
      style={[
        styles.card,
        { borderColor: cfg.borderColor },
      ]}
    >
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: cfg.accentColor }]} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: cfg.headerBg }]}>
        <Text style={[styles.headerTitle, { color: cfg.accentColor }]}>
          {cfg.title}
        </Text>
        <View style={[styles.countBadge, { backgroundColor: cfg.accentColor }]}>
          <Text style={styles.countText}>
            {loading ? "…" : filtered.length}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading && (
        <View style={styles.stateRow}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: "60%" }]} />
          <View style={[styles.skeletonLine, { width: "75%" }]} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.stateRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && filtered.length === 0 && (
        <View style={styles.stateRow}>
          <Text style={styles.emptyText}>{cfg.emptyText}</Text>
        </View>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ScrollView
          scrollEnabled={filtered.length > 5}
          style={filtered.length > 5 ? { maxHeight: 280 } : undefined}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filtered.map((item, i) => (
            <StockRow
              key={item.itemId}
              itemName={item.itemName}
              currentStock={item.currentStock}
              sellingPrice={item.sellingPrice}
              unit={item.unit}
              type={type}
              index={i}
              onPress={
                onItemPress ? () => onItemPress(item.itemId) : undefined
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default StockAlertCard;

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accentBar: {
    height: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  countBadge: {
    borderRadius: 20,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  rowMeta: {
    fontSize: 11,
    color: "#94A3B8",
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // States
  stateRow: {
    padding: 16,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
  },
  skeletonLine: {
    height: 14,
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
  },
});
