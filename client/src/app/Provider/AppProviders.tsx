// ==========================================
// src/app/Provider/AppProviders.tsx
// ==========================================
// This file defines the AppProviders component, which wraps the entire app
// with global providers for theming, toasts, loading states, cart management, etc.
// It ensures that all child components have access to these contexts.

import { GlobalLoadingProvider } from "../../shared/provider/GlobalLoadingProvider";
import RootNavigator from "../../Navigator/RootNavigator";
import { AppThemeProvider } from "../../shared/provider/AppThemeProvider";
import { ToastProvider } from "../../ui/toast/ToastProvider";
import { CartProvider } from "../../Inventory/InventoryList/provider/CartProvider";

/**
 * @component AppProviders
 * @description Wraps the app with essential global providers.
 * This component provides context for theming, notifications, loading states,
 * and cart functionality to the entire application.
 * @returns {JSX.Element} The wrapped RootNavigator with all providers.
 */
const AppProviders = () => {
  return (
    
    <AppThemeProvider> 
      {/* TOAST PROVIDER: Manages toast notifications across the app */}
      <ToastProvider>
        {/* GLOBAL LOADING PROVIDER: Handles global loading states */}
        <GlobalLoadingProvider>
          {/* CART PROVIDER: Provides cart state and actions for inventory management */}
          <CartProvider>
            {/* ROOT NAVIGATOR: The main navigation component of the app */}
            <RootNavigator />
          </CartProvider>
        </GlobalLoadingProvider>
      </ToastProvider>
    </AppThemeProvider>
  );
};

export default AppProviders;
