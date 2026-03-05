import { useEffect, useState } from "react";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import useAuthState from "../auth/hooks/useAuth";
import useShop from "../shop-setup/hooks/useShop";
import {useGlobalLoading} from "../shared//provider/GlobalLoadingProvider";
import ShopSetupScreen from "../shop-setup/pages/ShopSetup";


export default function RootNavigator() {
  const { user, initializing } = useAuthState();
  const { show, hide } = useGlobalLoading();
  const { shop, loading: shopLoading } = useShop();



  const isAuthenticated = !!user;
  

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  else if (isAuthenticated && !shop) {
    return <ShopSetupScreen />;
  }
  else {
    return <AppNavigator />;
  }
}