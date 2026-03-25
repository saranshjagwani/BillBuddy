import React from "react";
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  billNo: string;
  amount: number;
  loading: boolean;
  onWhatsApp: () => void;
  onDownload: () => void;
  onClose: () => void;
};

export default function BillSuccessModal({
  visible, billNo, amount, loading,
  onWhatsApp, onDownload, onClose,
}: Props) {
  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Success Icon */}
          <View style={styles.iconCircle}>
            <Feather name="check" size={28} color="#fff" />
          </View>

          <Text style={styles.title}>Bill Generated</Text>
          <Text style={styles.meta}>Bill No: {billNo}</Text>
          <Text style={styles.meta}>Amount: ₹{amount.toFixed(2)}</Text>
          <Text style={styles.meta}>Today, {time}</Text>

          {loading ? (
            <ActivityIndicator color="#1E63D5" style={{ marginTop: 20 }} />
          ) : (
            <>
              {/* WhatsApp */}
              <TouchableOpacity style={styles.whatsappBtn} onPress={onWhatsApp}>
                <Feather name="message-circle" size={18} color="#fff" />
                <Text style={styles.whatsappText}>Share on WhatsApp</Text>
              </TouchableOpacity>

              {/* Download */}
              <TouchableOpacity style={styles.secondaryBtn} onPress={onDownload}>
                <Feather name="download" size={18} color="#0F172A" />
                <Text style={styles.secondaryText}>Download</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Cancel */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  card: {
    backgroundColor: "#fff", borderRadius: 20,
    padding: 24, width: "85%", alignItems: "center",
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#22C55E",
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginBottom: 6 },
  meta: { fontSize: 13, color: "#64748B", marginTop: 2 },
  whatsappBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#25D366", borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24,
    width: "100%", justifyContent: "center", marginTop: 20,
  },
  whatsappText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F1F5F9", borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24,
    width: "100%", justifyContent: "center", marginTop: 10,
  },
  secondaryText: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
  cancel: { color: "#1E63D5", fontWeight: "600", fontSize: 15, marginTop: 16 },
});