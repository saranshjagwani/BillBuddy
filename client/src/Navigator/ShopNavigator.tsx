import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopSetup" component={ShopSetupScreen} />
    </Stack.Navigator>
  );
}
