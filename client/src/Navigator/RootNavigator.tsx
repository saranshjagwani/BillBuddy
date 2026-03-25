import { useEffect,useState } from "react";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import ShopNavigator from "./ShopNavigator";

import {useAuth} from "../shared/provider/AuthContextProvider";
import { useGlobalLoading } from "../shared/provider/GlobalLoadingProvider";
import { fetchShop } from "../shop-setup/services/shop.services";
import type { ShopInfo } from "../Billing/services/pdfService";

export default function RootNavigator() {
  const { user, initializing, isShopSetupComplete, checkingShop } =
    useAuth();

  const { show, hide } = useGlobalLoading();

  useEffect(() => {
    if (initializing) {
      show();
    } else {
      hide();
    }
  }, [initializing]);

  if (initializing && checkingShop) return null;

  if (!user) return <AuthNavigator />;

  if (!isShopSetupComplete) return <ShopNavigator />;

  if (isShopSetupComplete && user ) {
    console.log("Shop Setup Completed");
    return <AppNavigator />;
  }

  return null;
}
