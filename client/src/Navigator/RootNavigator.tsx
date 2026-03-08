import { useEffect } from "react";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import ShopNavigator from "./ShopNavigator";

import useAuthState from "../auth/hooks/useAuth";
import { useGlobalLoading } from "../shared/provider/GlobalLoadingProvider";

export default function RootNavigator() {
  const { user, initializing, isShopSetupComplete ,checkingShop} = useAuthState();

  const { show, hide } = useGlobalLoading();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (initializing) {
      show();
    } else {
      hide();
    }
  }, [initializing]);

  /**
   * Prevent navigation rendering while auth + shop check is running.
   * This avoids screen flicker between Auth / Shop / App navigators.
   */
  if (initializing || checkingShop) {
    return null;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Logged in but shop not created
  if (!isShopSetupComplete) {
    return <ShopNavigator />;
  }

  // Logged in and shop exists
  return <AppNavigator />;
}