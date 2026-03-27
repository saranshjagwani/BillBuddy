import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Pressable,
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
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={15} color="#EF4444" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent={true} // ← fixes Android offset
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Pressable backdrop so tapping outside closes it */}
        <Pressable
          style={styles.overlay}
          onPress={() => !loading && setModalVisible(false)}
        >
          {/* stopPropagation so tapping modal itself doesn't close */}
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>

            <View style={styles.iconBox}>
              <Feather name="trash-2" size={28} color="#EF4444" />
            </View>

            <Text style={styles.title}>Delete Item?</Text>
            <Text style={styles.subtitle}>
              Are you sure you want to delete{" "}
              <Text style={styles.itemName}>{itemName}</Text>?
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleDelete}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Full screen backdrop
  overlay: {
    position: "absolute", // ← absolute instead of flex
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#FFF1F2",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  itemName: {
    fontWeight: "800",
    color: "#0F172A",
  },

  btnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
