import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";

const Stack = createNativeStackNavigator();

export default function ShopNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopSetupScreen" component={ShopSetupScreen} />
    </Stack.Navigator>
  );
}
