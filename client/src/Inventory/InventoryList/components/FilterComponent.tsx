import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Modal, Pressable,
} from "react-native";
import {
  FilterState, SortOption, StockFilter,
  ExpiryFilter, DEFAULT_FILTERS,
} from "../hooks/useItemFilter";
import { useAppTheme } from "../../../shared/provider/AppThemeProvider";
import { LightColors } from "../../../shared/theme/color";
import {SECTIONS,sortOptions ,stockOptions,expiryOptions} from "../constants/FilterConstants"
import type { Section } from "../constants/FilterConstants";

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  categories: string[];
  suppliers: string[];
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  activeCount: number;
}







export default function FilterPage({
  visible, onClose, filters, categories,
  suppliers, onUpdate, onReset, activeCount,
}: Props) {
  const [activeSection, setActiveSection] = useState<Section>("sort");
  const { theme } = useAppTheme();
const c = theme.colors; // shorthand

const styles = makeStyles(c);

const sectionHasActive = (key: Section): boolean => {
            if (key === "sort") return filters.sort !== "none";
            if (key === "stock") return filters.stock !== "all";
            if (key === "expiry") return filters.expiry !== "all";
            if (key === "category") return !!filters.category;
            if (key === "supplier") return !!filters.supplier;
            return false;
          };

  const RadioRow = ({
    label, selected, onPress,
  }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity style={styles.radioRow} onPress={onPress}>
      <Text style={[styles.radioLabel, selected && styles.radioLabelActive]}>
        {label}
      </Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );

  const CheckRow = ({
    label, selected, onPress,
  }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity style={styles.radioRow} onPress={onPress}>
      <Text style={[styles.radioLabel, selected && styles.radioLabelActive]}>
        {label}
      </Text>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderRight = () => {
    switch (activeSection) {
      case "sort":
        
        return sortOptions.map((o) => (
          <RadioRow
            key={o.value}
            label={o.label}
            selected={filters.sort === o.value}
            onPress={() => onUpdate("sort", o.value)}
          />
        ));

      case "stock":
        
        return stockOptions.map((o) => (
          <RadioRow
            key={o.value}
            label={o.label}
            selected={filters.stock === o.value}
            onPress={() => onUpdate("stock", o.value)}
          />
        ));

      case "expiry":
       
        return expiryOptions.map((o) => (
          <RadioRow
            key={o.value}
            label={o.label}
            selected={filters.expiry === o.value}
            onPress={() => onUpdate("expiry", o.value)}
          />
        ));

      case "category":
        if (categories.length === 0)
          return <Text style={styles.empty}>No categories available</Text>;
        return categories.map((c) => (
          <CheckRow
            key={c}
            label={c}
            selected={filters.category === c}
            onPress={() => onUpdate("category", filters.category === c ? null : c)}
          />
        ));

      case "supplier":
        if (suppliers.length === 0)
          return <Text style={styles.empty}>No suppliers available</Text>;
        return suppliers.map((s) => (
          <CheckRow
            key={s}
            label={s}
            selected={filters.supplier === s}
            onPress={() => onUpdate("supplier", filters.supplier === s ? null : s)}
          />
        ));
    }
  };

 
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          {activeCount > 0 && (
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.body}>
          {/* Left Nav */}
          <View style={styles.leftNav}>
            {SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.navItem,
                  activeSection === s.key && styles.navItemActive,
                ]}
                onPress={() => setActiveSection(s.key)}
              >
                <Text style={[
                  styles.navText,
                  activeSection === s.key && styles.navTextActive,
                ]}>
                  {s.label}
                </Text>
                {sectionHasActive(s.key) && <View style={styles.activeDot} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Options */}
          <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
            {renderRight()}
          </ScrollView>
        </View>

        {/* Bottom Apply */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>
              Apply{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (c: typeof LightColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    marginTop: 12,
    borderBottomWidth: 1, borderBottomColor: c.border,
    backgroundColor: c.background,
  },
  backBtn: { marginRight: 12 },
  backArrow: { fontSize: 20, color: c.textPrimary },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: c.textPrimary },
  clearAll: { fontSize: 14, color: c.error, fontWeight: "600" },

  body: { flex: 1, flexDirection: "row" },

  leftNav: {
    width: 130,
    backgroundColor: c.surface,
    borderRightWidth: 1, borderRightColor: c.border,
  },
  navItem: {
    paddingVertical: 18, paddingHorizontal: 14,
    borderLeftWidth: 3, borderLeftColor: "transparent",
    flexDirection: "row", alignItems: "center",
  },
  navItemActive: {
    borderLeftColor: c.primary,
    backgroundColor: c.card,
  },
  navText: { fontSize: 13, color: c.textSecondary, flex: 1 },
  navTextActive: { color: c.primary, fontWeight: "700" },
  activeDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: c.primary,
  },

  rightPanel: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  radioRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: c.border,
  },
  radioLabel: { fontSize: 14, color: c.textPrimary, flex: 1 },
  radioLabelActive: { color: c.primary, fontWeight: "600" },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: c.border,
    alignItems: "center", justifyContent: "center",
  },
  radioSelected: { borderColor: c.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: c.primary,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: c.border,
    alignItems: "center", justifyContent: "center",
  },
  checkboxSelected: { backgroundColor: c.primary, borderColor: c.primary },
  checkmark: { color: c.textInverse, fontSize: 12, fontWeight: "700" },
  empty: { fontSize: 13, color: c.textSecondary, marginTop: 20, textAlign: "center" },

  footer: {
    padding: 16, marginBottom: 12,
    borderTopWidth: 1, borderTopColor: c.border,
    backgroundColor: c.background,
  },
  applyBtn: {
    backgroundColor: c.primary,
    borderRadius: 8, paddingVertical: 14,
    marginBottom:12,
    alignItems: "center",
  },
  applyText: { color: c.textInverse, fontSize: 16, fontWeight: "700" },
});
