import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import AddStockScreen1 from "../addstock/components/AddStockScreen1";
import AddStockPage from "../addstock/pages/AddStockPage";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";


export type AppStackParamList = {
  AddStockPage: undefined;
  AddStockScreen1: undefined;
  ShopSetup:undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="AddStockPage" component={AddStockPage} />
      <Stack.Screen name="AddStockScreen1" component={AddStockScreen1} />
      <Stack.Screen name="ShopSetup" component={ShopSetupScreen} />
      
    </Stack.Navigator>
  );
}