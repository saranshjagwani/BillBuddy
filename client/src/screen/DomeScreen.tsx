import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Welcome to BillBuddy
      </Text>
    </View>
  );
}
