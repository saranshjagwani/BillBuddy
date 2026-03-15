import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = { onPress: () => void };

export default function AddItemButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Feather name="plus-circle" size={18} color="#1E63D5" />
      <Text style={styles.text}>Add Another Item</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    paddingVertical: 14,
    borderWidth: 1.5, borderColor: "#1E63D5",
    borderRadius: 14, borderStyle: "dashed",
    backgroundColor: "#EFF6FF",
  },
  text: { fontSize: 14, color: "#1E63D5", fontWeight: "600" },
});