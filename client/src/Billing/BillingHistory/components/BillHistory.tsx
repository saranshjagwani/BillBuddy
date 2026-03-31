import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { fetchBills, BillRecord } from "../services/BillingHistory.service";
import { fetchShop } from "../../../shop-setup/services/shop.services";
import { generatePDF } from "../../services/pdfService";
import { shareOnWhatsApp } from "../../services/shareService";
import { undoBillApi } from "../services/BillingHistory.service";
import { useToast } from "../../../ui/toast/useToast";
import { useAuth } from "../../../shared/provider/AuthContextProvider";
import { getTodayAnalyticsApi } from "../services/BillingHistory.service";
import { ShopDetails } from "../../../shared/provider/AuthContextProvider";

// ─── BillHistoryCard ──────────────────────────────────────────────────────────

type CardProps = {
  bill: BillRecord;
};

function BillHistoryCard({ bill }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const [undoLoading, setUndoLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { showToast } = useToast();
  const { shopData } = useAuth();

  const date = new Date(bill.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(bill.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function toggleExpand() {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setExpanded((p) => !p);
  }
  const handleUndo = async () => {
    if (undoLoading) return;

    setUndoLoading(true);

    try {
      await undoBillApi(bill?.billId);
      showToast("success", "Undo Done");
    } catch (error: any) {
      // console.error("Undo error:", error);
      showToast("error", "Cannot Undo");
    } finally {
      setUndoLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloadLoading) return;
    // console.log("Download is Started");

    setDownloadLoading(true);

    try {
      // 🧾 Transform items safely
      const billItems = bill.items.map((item) => ({
        itemId: item.itemId,
        itemName: item.name,
        price: item.basePrice ?? 0,
        quantity: item.quantity ?? 0,
        discount: item.discount ?? 0,
        total: item.finalPrice ?? 0,
        unit: item.unit ?? "",
        currentStock: 0, // not needed for PDF
      }));

      // console.log("Bill Items are", billItems);

      // 📄 Generate PDF
      const path = await generatePDF(
        shopData,
        bill.billNumber,
        {
          name: bill.customerName ?? "Customer",
          phone: bill.customerPhone ?? "",
        },
        billItems,
      );

      if (!path) {
        throw new Error("PDF generation failed: no file path returned");
      }

      // ⬇️ Download immediately using fresh value (no async state issue)
      await shareOnWhatsApp(path, bill.billNumber);
    } catch (error: any) {
      // console.error("Download error:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const paymentColor =
    bill.paymentMode === "cash"
      ? { bg: "#DCFCE7", text: "#16A34A" }
      : bill.paymentMode === "upi"
        ? { bg: "#EFF6FF", text: "#1E63D5" }
        : { bg: "#FEF9C3", text: "#CA8A04" };

  return (
    <View style={[styles.card, bill.isDeleted && styles.cardDeleted]}>
      {/* ── Header Row (always visible) ── */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={toggleExpand}
        activeOpacity={0.75}
      >
        {/* Left: bill info */}
        <View style={styles.headerLeft}>
          <View style={styles.billNoRow}>
            <Text
              style={[styles.billNo, bill?.isDeleted && { color: "#94A3B8" }]}
            >
              {bill.billNumber}
            </Text>
          </View>

          <Text style={styles.customerName}>
            {bill.customerName || "Walk-in Customer"}
          </Text>
          {bill.customerPhone ? (
            <Text style={styles.customerPhone}>📞 {bill.customerPhone}</Text>
          ) : null}
          <Text style={styles.dateText}>
            {date} • {time}
          </Text>
        </View>

        {/* Right: amount + chevron */}
        <View style={styles.headerRight}>
          <Text style={[styles.amount, bill.isDeleted && { color: "#94A3B8" }]}>
            ₹{bill.totalAmount.toFixed(2)}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#94A3B8"
            style={{ marginTop: 6 }}
          />
        </View>
      </TouchableOpacity>

      {/* ── Expanded Section ── */}
      {/* ── Expanded Section ── */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colHead, { flex: 2 }]}>Item</Text>
            <Text style={styles.colHead}>Qty</Text>
            <Text style={styles.colHead}>Rate</Text>
            <Text style={styles.colHead}>Amt</Text>
          </View>

          {/* Table Rows */}
          {bill.items.map((item, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                i === bill.items.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.colVal, { flex: 2 }]} numberOfLines={1}>
                {item.itemName}
              </Text>
              <Text style={styles.colVal}>
                {item.quantity}
                {item.unit ? ` ${item.unit}` : ""}
              </Text>
              <Text style={styles.colVal}>₹{item.basePrice}</Text>
              <Text style={styles.colVal}>₹{item.finalPrice.toFixed(2)}</Text>
            </View>
          ))}

          {/* Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryVal}>₹{bill.subtotal.toFixed(2)}</Text>
            </View>

            {bill.totalDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryVal, { color: "#EF4444" }]}>
                  -₹{bill.totalDiscount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalVal}>
                ₹{bill.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons / Undone Badge */}
          {bill.isDeleted ? (
            <View style={styles.undoneBox}>
              <Feather name="rotate-ccw" size={15} color="#94A3B8" />
              <Text style={styles.undoneText}>This bill has been undone</Text>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.undoBtn}
                onPress={async () => {
                  await handleUndo();
                }}
                disabled={undoLoading}
              >
                {undoLoading ? (
                  <ActivityIndicator size="small" color="#FF7A00" />
                ) : (
                  <>
                    <Feather name="rotate-ccw" size={15} color="#FF7A00" />
                    <Text style={styles.undoText}>Undo Bill</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={handleDownload}
                disabled={downloadLoading}
              >
                {downloadLoading ? (
                  <ActivityIndicator size="small" color="#1E63D5" />
                ) : (
                  <>
                    <Feather name="share-2" size={15} color="#1E63D5" />
                    <Text style={styles.downloadText}>Share Bill</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── BillHistoryPage ──────────────────────────────────────────────────────────

export default function BillHistoryPage() {
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalBills: 0,
    totalDiscount: 0,
    totalItems: 0,
  });

  const loadAnalytics = async () => {
    try {
      const data = await getTodayAnalyticsApi();
      setAnalytics(data);
    } catch (error: any) {
      // console.error("Analytics error:", error);
    }
  };

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [{ bills: billData, hasMore: more }, shopData] = await Promise.all([
        fetchBills(),
        fetchShop(),
        loadAnalytics(),
      ]);
      setBills(billData);
      setHasMore(more);
      setShopDetails({
        shopName: shopData.shopName,
        phone: shopData.phone,
        billNo: "",
      });
    } catch (e) {
      setError("Failed to load bills. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load more on scroll end
  async function loadMore() {
    if (!hasMore || loadingMore || bills.length === 0) return;

    setLoadingMore(true);
    try {
      const lastBill = bills[bills.length - 1];
      const { bills: moreBills, hasMore: more } = await fetchBills(
        lastBill.createdAt,
      );
      setBills((prev) => [...prev, ...moreBills]); // append
      setHasMore(more);
    } catch (e) {
      // console.error("Load more error:", e);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  // ── Loading ──
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E63D5" />
          <Text style={styles.loadingText}>Loading bills...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Total of all bills ──
  const todayRevenue = bills
    .filter((b) => {
      const billDate = new Date(b.createdAt);
      const today = new Date();
      return (
        billDate.getDate() === today.getDate() &&
        billDate.getMonth() === today.getMonth() &&
        billDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Bill History</Text>
          <Text style={styles.pageSubtitle}>
            {bills.length} bills generated
          </Text>
        </View>
        <View style={styles.revenueBox}>
          <Text style={styles.revenueLabel}>Today's Total</Text>
          <Text style={styles.revenueValue}>₹{analytics.totalSales}</Text>
        </View>
      </View>

      {/* ── Error ── */}
      {error && (
        <View style={styles.errorBox}>
          <Feather name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* ── List ── */}
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          shopDetails ? (
            <BillHistoryCard bill={item} shopDetails={shopDetails} />
          ) : null
        }
        onEndReached={loadMore} // ← triggers when near bottom
        onEndReachedThreshold={0.3} // ← 30% from bottom
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1E63D5"]}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              color="#1E63D5"
              style={{ paddingVertical: 20 }}
            />
          ) : !hasMore && bills.length > 0 ? (
            <Text style={styles.endText}>All bills loaded</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Feather name="file-text" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No bills yet</Text>
            <Text style={styles.emptySubtitle}>
              Bills you generate will appear here
            </Text>
          </View>
        }
        contentContainerStyle={
          bills.length === 0
            ? { flex: 1 }
            : { paddingBottom: 32, paddingTop: 8 }
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#94A3B8", fontWeight: "500" },

  // Page Header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F0F4F8",
  },
  endText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    paddingVertical: 20,
    fontWeight: "500",
  },
  pageTitle: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  pageSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  revenueBox: {
    backgroundColor: "#1E63D5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  revenueLabel: {
    fontSize: 10,
    color: "#93C5FD",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  revenueValue: { fontSize: 16, color: "#fff", fontWeight: "800" },

  // Error
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: { fontSize: 13, color: "#EF4444", fontWeight: "500" },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  headerLeft: { flex: 1, gap: 3 },
  headerRight: { alignItems: "flex-end" },
  billNoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  billNo: { fontSize: 13, fontWeight: "700", color: "#1E63D5" },
  paymentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  paymentText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  customerName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  customerPhone: { fontSize: 12, color: "#64748B" },
  dateText: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  amount: { fontSize: 18, fontWeight: "800", color: "#0F172A" },

  // Expanded
  expandedSection: {
    borderTopWidth: 1.5,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  colHead: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  colVal: { flex: 1, fontSize: 13, color: "#0F172A" },

  // Summary
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  summaryVal: { fontSize: 13, color: "#0F172A", fontWeight: "600" },
  totalRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  totalVal: { fontSize: 16, fontWeight: "800", color: "#1E63D5" },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12, // 👈 moved here from downloadBtn
  },
  undoneBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  undoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgb(148, 163, 184)",
  },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    // 👆 marginTop removed
  },

  undoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12, // 👈 matched to downloadBtn's 12 so both are same height
    paddingHorizontal: 14,
    borderRadius: 10, // 👈 matched to downloadBtn's 10
    borderWidth: 1.5, // 👈 matched to downloadBtn's 1.5
    borderColor: "#FF7A00",
    backgroundColor: "#FFF5F5",
  },

  undoText: {
    color: "#FF7A00",
    fontSize: 14, // 👈 matched to downloadText's 14
    fontWeight: "700", // 👈 matched to downloadText's 700
  },

  downloadText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E63D5",
  },
  // Empty
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#94A3B8",
    marginTop: 8,
  },
  emptySubtitle: { fontSize: 14, color: "#CBD5E1", fontWeight: "500" },
});
