import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAppTheme } from "../../shared/provider/AppThemeProvider"; 
import { useNavigation } from "@react-navigation/native";
import type { AddStockScreenProps } from "../types/AddStockScreenProps";
import  useAddItem  from "../hooks/useAddItem";
import { PRODUCT_UNITS } from "../hooks/useAddItem";




// ─── Constants ────────────────────────────────────────────────────────────────


// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddStockScreen({
  onCancel,
}: AddStockScreenProps) {
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const colors = theme.colors;

  const { itemName, unit, sellingPrice, currentStock, setItemName, setUnit, setSellingPrice, setCurrentStock, errors, loading, handleSave ,clearError } = useAddItem();

  
    // const handleSubmit = async () => {
    //   console.log("Submitting with values:", { itemName, unit, sellingPrice, currentStock });
    //   const success = await handleSave();
    //   if (success) {
    //     navigation.navigate("AdditionalScreen" as never);
    //   } else {
    //     // Optionally, you can show a toast or alert here indicating failure
    //   } 
    // };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1}}
       
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          {onCancel ? (
            <TouchableOpacity onPress={onCancel} style={styles.sideSlot}>
              <Text style={[styles.cancelText, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sideSlot} />
          )}
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Add Stock
          </Text>
          <View style={styles.sideSlot} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Item Name */}
          <View style={styles.fieldBlock}>
            <FieldLabel label="Item Name" required color={colors.textPrimary} />
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.itemName ? colors.error : colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="e.g. Pepsi 200ml, Rice, Biscuits"
              placeholderTextColor={colors.textSecondary}
              value={itemName}
              onChangeText={(v) => {
                setItemName(v);
                clearError("itemName");
              }}
              returnKeyType="next"
            />
            {errors.itemName ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.itemName}
              </Text>
            ) : null}
          </View>

          {/* Unit */}
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldRowLabel, { color: colors.textPrimary }]}>
              Unit
            </Text>
            <UnitDropdown value={unit} onSelect={setUnit} colors={colors} />
          </View>

          {/* Selling Price */}
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldRowLabel, { color: colors.textPrimary }]}>
              Selling Price
            </Text>
            <View
              style={[
                styles.priceInputWrapper,
                {
                  borderColor: errors.sellingPrice
                    ? colors.error
                    : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={[styles.rupeeSymbol, { color: colors.textSecondary }]}
              >
                ₹
              </Text>
              <TextInput
                style={[styles.priceInput, { color: colors.textPrimary }]}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={sellingPrice}
                onChangeText={(v) => {
                  setSellingPrice(v);
                  clearError("sellingPrice");
                }}
              />
              <Text style={[styles.perUnit, { color: colors.textSecondary }]}>
                per unit
              </Text>
            </View>
          </View>
          {errors.sellingPrice ? (
            <Text
              style={[
                styles.errorText,
                { color: colors.error, textAlign: "right", marginBottom: 8 },
              ]}
            >
              {errors.sellingPrice}
            </Text>
          ) : null}

          {/* Current Stock */}
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldRowLabel, { color: colors.textPrimary }]}>
              Current Stock
            </Text>
            <TextInput
              style={[
                styles.quantityInput,
                {
                  borderColor: errors.currentStock
                    ? colors.error
                    : colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Quantity"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={currentStock}
              onChangeText={(v) => {
                setCurrentStock(v);
                clearError("currentStock");
              }}
            />
          </View>
          {errors.currentStock ? (
            <Text
              style={[
                styles.errorText,
                { color: colors.error, textAlign: "right", marginBottom: 8 },
              ]}
            >
              {errors.currentStock}
            </Text>
          ) : null}

          {/* Tip Banner */}
          <View
            style={[
              styles.tipBanner,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.tipIcon}>🎙️</Text>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
                Tip:{" "}
              </Text>
              You can say, "Add 24 Pepsi bottles at ₹20".
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
            
          ]}
        >
          <TouchableOpacity
            style={[styles.saveBtn, { opacity: loading ? 0.85 : 1 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Save Item</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldLabelProps {
  label: string;
  required?: boolean;
  color: string;
}
function FieldLabel({ label, required, color }: FieldLabelProps) {
  return (
    <Text style={[styles.label, { color }]}>
      {label}
      {required && <Text style={{ color: "#DC2626" }}> *</Text>}
    </Text>
  );
}

interface UnitDropdownProps {
  value: string;
  onSelect: (v: string) => void;
  colors: ReturnType<typeof useAppTheme>["theme"]["colors"];
}
function UnitDropdown({ value, onSelect, colors }: UnitDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.unitDropdown,
          { borderColor: colors.border, backgroundColor: colors.card },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.unitDropdownText, { color: colors.textPrimary }]}>
          {value}
        </Text>
        <Text style={[styles.chevron, { color: colors.primary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Select Unit
            </Text>
            <FlatList
              data={PRODUCT_UNITS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item === value && {
                      backgroundColor: colors.primary + "18",
                    },
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          item === value ? colors.primary : colors.textPrimary,
                        fontWeight: item === value ? "600" : "400",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}


// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  sideSlot: {
    width: 60,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    borderTopWidth: 1,
  },
  fieldBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    minHeight: 48,
  },
  fieldRowLabel: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  unitDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 130,
    justifyContent: "space-between",
  },
  unitDropdownText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  chevron: {
    fontSize: 10,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    minWidth: 160,
    height: 46,
  },
  rupeeSymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    height: 44,
  },
  perUnit: {
    fontSize: 12,
    marginLeft: 4,
  },
  quantityInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    minWidth: 160,
  },
  tipBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  tipIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    
  },
  modalSheet: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    maxHeight: 380,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalItemText: {
    fontSize: 15,
  },
});