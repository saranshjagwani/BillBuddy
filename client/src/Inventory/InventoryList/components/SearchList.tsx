import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search items...",
}: Props) {
  return (
    <View style={[styles.container, value.length > 0 && styles.containerActive]}>
      <Feather
        name="search"
        size={16}
        color={value.length > 0 ? "#1E63D5" : "#94A3B8"}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={styles.input}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={14} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbfb",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  containerActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1E63D5",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
    paddingVertical: 0,
  },
  clearBtn: {
    backgroundColor: "#1E63D5",
    borderRadius: 20,
    padding: 3,
    marginLeft: 6,
  },
});