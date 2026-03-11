import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color="#888" style={styles.icon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={18} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
container: {  
flexDirection: "row",
alignItems: "center",
backgroundColor: "#fff",
borderRadius: 12,
marginHorizontal: 16,
marginBottom: 12,
paddingHorizontal: 6,
paddingVertical: 5,


shadowColor: "#000",
shadowOpacity: 0.05,
shadowRadius: 4,
elevation: 2,

},

icon: {
marginRight: 8,
},

input: {
flex: 1,
fontSize: 15,
color: "#111",
},
});
