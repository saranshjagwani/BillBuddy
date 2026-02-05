import { View, Text ,Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";


export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Welcome to BillBuddy
      </Text>
    </View>
  );
}
