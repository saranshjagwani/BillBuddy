import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import CustomerDetails, { CustomerInfo } from "../components/CustomerDetails";
import AddEditItem, { BillItem as BillItemType } from "../components/AddItem";
import BillItem from "../components/BillItem";
import BillBar from "../components/BillBar";
import EmptyBill from "../components/EmptyList";
import AddItemButton from "../components/AddItemButton";
import { generateBill } from "../services/Billing.service";
import { useGlobalLoading } from "../../shared/provider/GlobalLoadingProvider";
import { useToast } from "../../ui/toast/useToast";
import { generatePDF } from "../services/pdfService";
import { shareOnWhatsApp, downloadBill } from "../services/shareService";
import BillSuccessModal from "../components/BillSuccessModal";
import { getCurrentBillNumberApi } from "../../shared/services/Billingnumber.service";
import { ShopDetails } from "../../shared/provider/AuthContextProvider";
import { useAuth } from "../../shared/provider/AuthContextProvider";

export default function BillingPage() {
  const { shopData } = useAuth();
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [billItems, setBillItems] = useState<BillItemType[]>([]);
  const [billTotal, setbillTotal] = useState<number>(0);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [successModal, setSuccessModal] = useState(false);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [billNo, setBillNo] = useState("");

  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);

  const { show, hide } = useGlobalLoading();
  const { showToast } = useToast();

  useEffect(() => {
    setShopDetails(shopData);
  }, [shopData]);

  useEffect(() => {
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;

    if (loading || pdfLoading) {
      show();

      stopTimer = setTimeout(() => {
        hide();
      }, 6000);
    } else {
      if (startTimer) clearTimeout(startTimer);
      if (stopTimer) clearTimeout(stopTimer);
      hide();
    }

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [loading, pdfLoading]);
  async function onGenerate() {
    setLoading(true);

    try {
      // 1. Create bill (SOURCE OF TRUTH)
      const res = await generateBill(customer, billItems);

      if (!res?.billNumber) {
        throw new Error("Bill number generate nahi hua");
      }

      const newBillNo = res.billNumber;

      // 2. Validate shop
      if (!shopDetails) {
        throw new Error("Shop details missing");
      }

      // 3. Generate PDF using CORRECT billNo
      setPdfLoading(true);

      const path = await generatePDF(
        shopDetails,
        newBillNo,
        customer,
        billItems,
      );

      // 4. UI updates
      setPdfPath(path);
      setBillNo(newBillNo);
      setSuccessModal(true);
      setbillTotal(billItems.reduce((s, i) => s + i.total, 0));

      // 5. Reset state
      setBillItems([]);
      setCustomer({ name: "", phone: "" });
    } catch (error) {
      showToast("success", "Bill Generated You Can Find It In Bill History");
    } finally {
      setLoading(false);
      setPdfLoading(false);
    }
  }

  function handleSaveItem(item: BillItemType) {
    if (editingItem) {
      setBillItems((prev) =>
        prev.map((i) => (i.itemId === item.itemId ? item : i)),
      );
    } else {
      const exists = billItems.find((i) => i.itemId === item.itemId);
      if (exists) {
        showToast("warning", "Item already exists");
      } else {
        setBillItems((prev) => [...prev, item]);
      }
    }
    setEditingItem(null);
  }

  function handleEdit(item: BillItemType) {
    setEditingItem(item);
    // console.log(item);
    setShowAddItem(true);
  }

  function handleDelete(itemId: string) {
    setBillItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate Bill</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Customer Details */}
        <CustomerDetails value={customer} onChange={setCustomer} />

        {/* Items or Empty */}
        {billItems.length === 0 ? (
          <EmptyBill onAdd={() => setShowAddItem(true)} />
        ) : (
          <View style={styles.itemsList}>
            {billItems.map((item, index) => (
              <BillItem
                key={item.itemId}
                item={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <AddItemButton
              onPress={() => {
                setEditingItem(null);
                setShowAddItem(true);
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Bill Summary Bar */}
      <BillBar items={billItems} onGenerate={onGenerate} />

      {/* Add/Edit Modal */}
      <AddEditItem
        key={editingItem?.itemId ?? "new"}
        visible={showAddItem}
        onClose={() => {
          setShowAddItem(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
      <BillSuccessModal
        visible={successModal}
        billNo={billNo}
        amount={billTotal}
        loading={pdfLoading}
        onWhatsApp={() => pdfPath && shareOnWhatsApp(pdfPath, billNo)}
        onDownload={() =>
          pdfPath &&
          downloadBill(pdfPath, billNo)
            .then(() => showToast("success", "Saved The Bill In Downloads"))
            .catch(() => showToast("error", "Could not save bill"))
        }
        onClose={() => setSuccessModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F0F4F8",
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  scroll: { paddingBottom: 24 },
  itemsList: { marginTop: 8 },
});
