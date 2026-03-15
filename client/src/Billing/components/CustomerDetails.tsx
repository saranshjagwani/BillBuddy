import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet,
} from "react-native";

export type CustomerInfo = {
  name: string;
  phone: string;
};

type Props = {
  value: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
};

export default function CustomerDetails({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer Details</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Customer Name"
          placeholderTextColor="#94A3B8"
          value={value.name}
          onChangeText={(text) => onChange({ ...value, name: text })}
          returnKeyType="next"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Phone Number"
          placeholderTextColor="#94A3B8"
          value={value.phone}
          onChangeText={(text) => onChange({ ...value, phone: text })}
          keyboardType="phone-pad"
          returnKeyType="done"
          maxLength={10}
        />
      </View>

      <Text style={styles.hint}>Leave empty if not needed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  inputHalf: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
  },
});