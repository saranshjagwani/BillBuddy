import React, { useState ,useRef } from "react";
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from "react-native";
import CustomerDetails, { CustomerInfo } from "../components/CustomerDetails";
import AddEditItem, { BillItem as BillItemType } from "../components/AddItem";
import BillItem from "../components/BillItem";
import BillBar from "../components/Billbar";
import EmptyBill from "../components/EmptyList";
import AddItemButton from "../components/AddItemButton";

export default function BillingPage() {
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", phone: "" });
  const [billItems, setBillItems] = useState<BillItemType[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const editingItemRef = useRef<BillItemType | null>(null);

  function handleSaveItem(item: BillItemType) {
    if (editingItemRef.current) {
      setBillItems(prev => prev.map(i => i.itemId === item.itemId ? item : i));
    } else {
      const exists = billItems.find(i => i.itemId === item.itemId);
      if (exists) {
        setBillItems(prev => prev.map(i =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + item.quantity, total: i.total + item.total }
            : i
        ));
      } else {
        setBillItems(prev => [...prev, item]);
      }
    }
    editingItemRef.current = null;
  }

  function handleEdit(item: BillItemType) {
    editingItemRef.current = item;
    setShowAddItem(true);
  }

  function handleDelete(itemId: string) {
    setBillItems(prev => prev.filter(i => i.itemId !== itemId));
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
            <AddItemButton onPress={() => {
             editingItemRef.current = null;
              setShowAddItem(true);
            }} />
          </View>
        )}
      </ScrollView>

      {/* Bill Summary Bar */}
      <BillBar items={billItems} onGenerate={() => {}} />

      {/* Add/Edit Modal */}
      <AddEditItem
        visible={showAddItem}
        onClose={() => { setShowAddItem(false); editingItemRef.current = null;; }}
        onSave={handleSaveItem}
        editItem={editingItemRef.current}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: "#F0F4F8",
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  scroll: { paddingBottom: 24 },
  itemsList: { marginTop: 8 },
});