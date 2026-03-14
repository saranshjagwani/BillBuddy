import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { createShop } from "../services/shop.services";
import { useAppTheme } from "../../shared/provider/AppThemeProvider"; 
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../Navigator/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../../ui/toast/useToast";

const CATEGORIES = [
  "Grocery / Kirana",
  "Pharmacy / Medical",
  "Electronics & Mobile",
  "Clothing / Fashion",
  "Beauty / Cosmetics",
  "Home & Kitchen",
  "Stationery",
  "Sports",
  "Books",
  "Toys",
  "Automotive / Spare Parts",
  "Hardware / Electrical",
  "General Store",
  "Other",
];

export default function ShopSetupScreen() {
  const { theme } = useAppTheme();
  const { showToast } = useToast();
  type Nav = StackNavigationProp<AppStackParamList, 'ShopSetup'>;
  const navigation = useNavigation<Nav>();

  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("Grocery");
  const [hasStaff, setHasStaff] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = theme.colors;

  async function handleCreateShop() {
    if (!shopName.trim()) {
      setError("Please enter your shop name");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createShop(shopName, category, hasStaff);
      console.log("Shop created successfully");
      showToast("success", "Shop created successfully !");
      navigation.navigate("AddStockPage");
    } catch (err) {
      console.log("Error creating shop:", err);
      setError("Could not create shop. Please try again.");
      showToast("error", "Failed to create shop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Set up your shop
        </Text>

        {/* Brand Name */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Brand name
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Enter your shop name"
          placeholderTextColor={colors.textSecondary}
          value={shopName}
          onChangeText={(text) => {
            setShopName(text);
            if (error) setError(null);
          }}
        />

        {/* Category */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Category
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          onPress={() => setCategoryOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
            {category}
          </Text>
          {/* Chevron Down */}
          <View style={styles.chevronWrapper}>
            <Text style={[styles.chevron, { color: colors.primary }]}>▼</Text>
          </View>
        </TouchableOpacity>

        {/* Staff Toggle */}
        <View
          style={[
            styles.toggleRow,
            { borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>
            Do you have staff?
          </Text>
          <Switch
            value={hasStaff}
            onValueChange={setHasStaff}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.card}
            ios_backgroundColor={colors.border}
          />
        </View>

        {/* Error */}
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: loading ? colors.primary : colors.primary,
              opacity: loading ? 0.8 : 1,
            },
          ]}
          onPress={handleCreateShop}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: colors.textInverse }]}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={categoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryOpen(false)}
        >
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: colors.textPrimary }]}
            >
              Select Category
            </Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item === category && {
                      backgroundColor: colors.primary + "18",
                    },
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          item === category
                            ? colors.primary
                            : colors.textPrimary,
                        fontWeight: item === category ? "600" : "400",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === category && (
                    <Text style={{ color: colors.primary, fontSize: 16 }}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 24,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dropdownText: {
    fontSize: 15,
  },
  chevronWrapper: {
    paddingLeft: 8,
  },
  chevron: {
    fontSize: 11,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 32,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  error: {
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E63D5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // Modal
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
    maxHeight: 420,
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
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalItemText: {
    fontSize: 15,
  },
});