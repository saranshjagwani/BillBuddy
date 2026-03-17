import React, { useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import CustomerDetails, { CustomerInfo } from "../components/CustomerDetails";
import AddEditItem, { BillItem as BillItemType } from "../components/AddItem";
import BillItem from "../components/BillItem";
import BillBar from "../components/BillBar";
import EmptyBill from "../components/EmptyList";
import AddItemButton from "../components/AddItemButton";
import { generateBill } from "../services/Billing.service";

export default function BillingPage() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [billItems, setBillItems] = useState<BillItemType[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItemType | null>(null);
  const [loading,setLoading]=useState<boolean>(false);

  async function  onGenerate(){
  setLoading(true);
  try {
    const data = await generateBill(customer, billItems);
    console.log("Bill generated:", data);
    // navigate or show success
  } catch (error) {
    console.error(error);
    // show error toast
  } finally {
    setLoading(false);
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
