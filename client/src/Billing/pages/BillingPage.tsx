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
import { fetchShop } from "../../shop-setup/services/shop.services";
import { ShopInfo } from "../services/pdfService";
import {getCurrentBillNumberApi} from "../../shared/services/Billingnumber.service"

export default function BillingPage() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [billItems, setBillItems] = useState<BillItemType[]>([]);
  const [billTotal,setbillTotal]=useState<number>(0);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [successModal, setSuccessModal] = useState(false);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [billNo, setBillNo] = useState("");

  const [shopDetails, setShopDetails] = useState<ShopInfo | null>(null);
  const [billNumber, setBillNumber] = useState<string>("");

const loadBillNumber = async () => {
  try {
    const number = await getCurrentBillNumberApi();
    setBillNumber(number);
  } catch (error: any) {
    console.error("Bill number error:", error);
  }
};

useEffect(() => {
  loadBillNumber();
}, []);



  const fetchShopDetails = async () => {
    try {
      const shop = await fetchShop();

      setShopDetails({
        shopName: shop.shop.shopName,
        phone: String(shop.phoneNumber || ""),
        billNo:billNumber ,
      });
    } catch (error) {
      console.error("Failed to fetch shop details:", error);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const { show, hide } = useGlobalLoading();
  const { showToast } = useToast();

  useEffect(() => {
    if (loading) {
      show();
    } else {
      hide();
    }

    return () => {
      hide();
    };
  }, [loading]);

  async function onGenerate() {
    setLoading(true);
    setPdfLoading(true);
    try {
      await generateBill(customer, billItems);
      if (!shopDetails) {
        console.warn("Shop details not loaded yet");
        return;
      }

      setPdfLoading(true);
      try {
        const path = await generatePDF(shopDetails, customer, billItems);

        setPdfPath(path);
        setBillNo(billNumber);
        setSuccessModal(true);
        setbillTotal(billItems.reduce((s, i) => s + i.total, 0));
      } catch (e) {
        console.error(e);
      } finally {
        setPdfLoading(false);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Bill Generated Succesfully");
    } finally {
      setLoading(false);
      setPdfLoading(false);
      setBillItems([]);
        setCustomer({ name: "", phone: "" });
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
        setBillItems((prev) =>
          prev.map((i) =>
            exists
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  total: i.total + item.total,
                }
              : i,
          ),
        );
      } else {
        setBillItems((prev) => [...prev, item]);
      }
    }
    setEditingItem(null);
  }

  function handleEdit(item: BillItemType) {
    setEditingItem(item);
    console.log(item);
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
