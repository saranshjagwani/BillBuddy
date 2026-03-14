import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import AddStockScreen1 from "../addstock/components/AddStockScreen1";
import AddStockPage from "../addstock/pages/AddStockPage";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";
import HomeScreen from "../screen/HomeScreen";
import { InventoryListPage } from "../Inventory/InventoryList/pages/InvenotryListPage";
import Cart from "../Inventory/InventoryList/components/Cart";


export type AppStackParamList = {
  AddStockPage: undefined;
  AddStockScreen1: undefined;
  ShopSetup:undefined;
  HomeScreen:undefined;
  InventoryListPage :undefined;
  CartScreen:undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>

      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      
      <Stack.Screen name="AddStockPage" component={AddStockPage} />
      <Stack.Screen name ="CartScreen" component={Cart}/>
      <Stack.Screen name="InventoryListPage" component={InventoryListPage} />
      <Stack.Screen name="AddStockScreen1" component={AddStockScreen1} />
      <Stack.Screen name="ShopSetup" component={ShopSetupScreen} />
      
    </Stack.Navigator>
  );
}