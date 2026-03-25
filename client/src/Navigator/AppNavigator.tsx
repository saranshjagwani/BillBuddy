import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import AddStockScreen1 from "../addstock/components/AddStockScreen1";
import AddStockPage from "../addstock/pages/AddStockPage";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";
import HomeScreen from "../screen/HomeScreen";
import { InventoryListPage } from "../Inventory/InventoryList/pages/InvenotryListPage";
import BillingPage from "../Billing/pages/BillingPage";
import BillHistoryPage from "../Billing/BillingHistory/components/BillHistory";


export type AppStackParamList = {
  AddStockPage: undefined;
  AddStockScreen1: undefined;
  HomeScreen:undefined;
  InventoryListPage :undefined;
  BillingPage:undefined;
  BillHistoryPage:undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>

      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      <Stack.Screen name="AddStockPage" component={AddStockPage} />
      <Stack.Screen name="InventoryListPage" component={InventoryListPage} />
      <Stack.Screen name="AddStockScreen1" component={AddStockScreen1} />
      <Stack.Screen name="BillingPage" component={BillingPage}/>
      <Stack.Screen name="BillHistoryPage" component={BillHistoryPage}/>

    </Stack.Navigator>
  );
}
