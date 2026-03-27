import { useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import ShopNavigator from "./ShopNavigator";
import { useAuth } from "../shared/provider/AuthContextProvider";
import { useGlobalLoading } from "../shared/provider/GlobalLoadingProvider";

export default function RootNavigator() {
  const { user, initializing, isShopSetupComplete, checkingShop } = useAuth();
  const { show, hide } = useGlobalLoading();

  const isLoading = initializing || checkingShop;

  useEffect(() => {
    isLoading ? show() : hide();
  }, [isLoading]); // ← was missing checkingShop

  if (isLoading) return null;
  if (!user) return <AuthNavigator />;
  if (!isShopSetupComplete) return <ShopNavigator />;
  return <AppNavigator />;
}
