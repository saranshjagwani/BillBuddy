import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import ShopNavigator from "./ShopNavigator";

import useAuthState from "../auth/hooks/useAuth";
import useShop from "../shop-setup/hooks/useShop";

import { useGlobalLoading } from "../shared/provider/GlobalLoadingProvider";

export default function RootNavigator() {
  const { user, initializing } = useAuthState();
  const { shop, loading: shopLoading } = useShop();

  const { show, hide } = useGlobalLoading();

  const isAuthenticated = !!user;

  // Handle loading state
  if (initializing || shopLoading) {
    show();
    return null;
  } else {
    hide();
  }

  // Not logged in
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Logged in but shop not created
  if (!shop) {
    return <ShopNavigator />;
  }

  // Logged in and shop exists
  return <AppNavigator />;
}