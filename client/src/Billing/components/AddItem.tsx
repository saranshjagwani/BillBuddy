import React, { useState, useMemo ,useEffect} from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, Modal, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import { useItems, Item } from "../../shared/provider/ItemsContext";
import { Feather } from "@expo/vector-icons";


export type BillItem = {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (item: BillItem) => void;
  editItem?: BillItem | null;
};

export default function AddEditItem({ visible, onClose, onSave, editItem }: Props) {
  const { items } = useItems();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<BillItem | null>(
  editItem ? {
    itemId: editItem.itemId,
    itemName: editItem.itemName,
    price:editItem.price,
    quantity:editItem.quantity,
    discount:editItem.discount,
    total:editItem.total,

  } : null
);
  const [quantity, setQuantity] = useState("1");
  const [discount, setDiscount] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
  if (editItem) {
    setQuantity(String(editItem.quantity));
  }
}, [editItem]);



  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || selectedItem) return [];
    return items
      .filter((i) => i.itemName.toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchQuery, items, selectedItem]);

  const price = selectedItem ? Number(selectedItem.price) : 0;
  const qty = parseInt(quantity) ;
  const disc = parseFloat(discount) || 0;
  const total = Math.max(0, price * qty - disc);

  console.log("oh ji discount",discount)

  function handleSelect(item: BillItem) {
    setSelectedItem(item);
    setSearchQuery(item.itemName);
    setShowSuggestions(false);
  }

  function handleSave() {
    if (!selectedItem) return;
    onSave({
      itemId: selectedItem.itemId,
      itemName: selectedItem.itemName,
      price,
      quantity: qty,
      discount: disc,
      total,
    });
    handleClose();
  }

  function handleClose() {
    setSearchQuery("");
    setSelectedItem(null);
    setQuantity("1");
    setDiscount("");
    setShowSuggestions(false);
    onClose();
  }
  

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {editItem ? "Edit Item" : "Add Item"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Name Search */}
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Search item..."
                placeholderTextColor="#94A3B8"
                value={selectedItem? selectedItem.itemName : searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setSelectedItem(null);
                  setShowSuggestions(true);
                }}
                autoCorrect={false}
              />
              {selectedItem && (
                <TouchableOpacity
                  style={styles.clearSearch}
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedItem(null);
                  }}
                >
                  <Feather name="x" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestions}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.itemId}
                    style={styles.suggestionRow}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.suggestionLeft}>
                      <Text style={styles.suggestionName}>{item.itemName}</Text>
                      {item.unit && (
                        <Text style={styles.suggestionUnit}>{item.unit}</Text>
                      )}
                    </View>
                    <Text style={styles.suggestionPrice}>
                      ₹{item.sellingPrice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Price (auto-filled, read only) */}
            {selectedItem && (
              <View style={styles.priceTag}>
                <Feather name="tag" size={14} color="#1E63D5" />
                <Text style={styles.priceTagText}>
                  ₹{price} per unit
                </Text>
              </View>
            )}

            {/* Quantity + Discount Row */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Discount (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>

            {/* Save */}
            <TouchableOpacity
              style={[styles.saveBtn, !selectedItem && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!selectedItem || qty === 0}
            >
              <Text style={styles.saveBtnText}>
                {editItem ? "Update Item" : "Save Item"}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: "85%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center", marginBottom: 16,
  },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  closeBtn: {
    padding: 4, backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },

  // Fields
  fieldLabel: {
    fontSize: 12, fontWeight: "600",
    color: "#64748B", textTransform: "uppercase",
    letterSpacing: 0.6, marginBottom: 8, marginTop: 16,
  },
  input: {
    borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15,
    color: "#0F172A", backgroundColor: "#F8FAFC",
  },
  row: { flexDirection: "row", gap: 12, marginTop: 4 },
  halfField: { flex: 1 },

  // Search
  searchWrapper: { position: "relative" },
  clearSearch: {
    position: "absolute", right: 12,
    top: 0, bottom: 0, justifyContent: "center",
  },

  // Suggestions
  suggestions: {
    borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 10, marginTop: 4,
    backgroundColor: "#fff", overflow: "hidden",
  },
  suggestionRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  suggestionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  suggestionName: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  suggestionUnit: {
    fontSize: 11, color: "#1E63D5",
    backgroundColor: "#EFF6FF", paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 4, fontWeight: "600",
  },
  suggestionPrice: { fontSize: 14, fontWeight: "700", color: "#1E63D5" },

  // Price tag
  priceTag: {
    flexDirection: "row", alignItems: "center",
    gap: 6, marginTop: 10,
    backgroundColor: "#EFF6FF", paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 8, alignSelf: "flex-start",
  },
  priceTagText: { fontSize: 13, color: "#1E63D5", fontWeight: "600" },

  // Total
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 20,
    backgroundColor: "#F8FAFC", borderRadius: 12,
    padding: 16, borderWidth: 1.5, borderColor: "#E5E7EB",
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#64748B" },
  totalValue: { fontSize: 22, fontWeight: "800", color: "#1E63D5" },

  // Save
  saveBtn: {
    backgroundColor: "#1E63D5", borderRadius: 12,
    paddingVertical: 15, alignItems: "center", marginTop: 16,
  },
  saveBtnDisabled: { backgroundColor: "#CBD5E1" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});