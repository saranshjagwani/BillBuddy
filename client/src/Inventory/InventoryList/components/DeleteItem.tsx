import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { deleteItem } from "../services/itemfetch.service";
import { useToast } from "../../../ui/toast/useToast";

interface DeleteItemProps {
  itemId: string;
  shopId: string;
  itemName: string;
  onDeleted: () => void;
}

export default function DeleteItem({ itemId, shopId, itemName, onDeleted }: DeleteItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItem(itemId, shopId);
      setModalVisible(false);
      showToast("success", "Item deleted successfully");
      onDeleted();
    } catch (error: any) {
      showToast("error", error.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="trash-2" size={16} color="#EF4444" />
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Icon */}
            <View style={styles.iconBox}>
              <Feather name="trash-2" size={28} color="#EF4444" />
            </View>

            {/* Text */}
            <Text style={styles.title}>Delete Item?</Text>
            <Text style={styles.subtitle}>
              Are you sure you want to delete{" "}
              <Text style={styles.itemName}>{itemName}</Text> 
            </Text>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // The trigger button inside the list card
  deleteBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF1F2", // Softer red-white
    borderWidth: 1,
    borderColor: "#FFE4E6",
    justifyContent: 'center',
    alignItems: 'center',
  },

  // The Backdrop
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)", // Deep slate with high opacity for focus
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  // The Modal Container
  modal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // More rounded for a modern friendly feel
    padding: 32,
    alignItems: "center",
    // Premium Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  // The Danger Icon Container
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#FFF1F2", // Double ring effect
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B", // Dark Slate
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B", // Muted slate
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  itemName: {
    fontWeight: "800",
    color: "#0F172A", // Contrast highlight
  },

  btnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  // Secondary Action (Keep it subtle)
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },

  // Primary Action (Stronger visual weight)
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#EF4444", // Clean Danger Red
    alignItems: "center",
    justifyContent: 'center',
    // Slight shadow to make the red button "pop"
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
