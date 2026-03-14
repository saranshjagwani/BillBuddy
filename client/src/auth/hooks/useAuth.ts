/**
 * useAuth Hook
 *
 * Purpose:
 * Manages authentication state and determines whether the shop setup
 * has already been completed for the logged-in user.
 *
 * Why this hook exists:
 * - Centralizes Firebase auth state handling.
 * - Prevents every screen from manually checking authentication.
 * - Optimizes startup by using cached shop data before hitting network.
 *
 * What this file owns:
 * - Listening to Firebase auth state
 * - Fetching shop data when user logs in
 * - Caching shop data in AsyncStorage
 *
 * What this file must NOT do:
 * - Handle UI navigation
 * - Perform business logic related to shop setup
 */

import { useEffect, useState } from "react";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { fetchShop } from "../../shop-setup/services/shop.services";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = getAuth(getApp());

export default function useAuth() {
  /**
   * Logged-in Firebase user
   * Null means user is logged out
   */
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  /**
   * Indicates if auth initialization is still running.
   * Used to prevent UI from flashing incorrect screens.
   */
  const [initializing, setInitializing] = useState(true);

  /**
   * Indicates whether the shop setup process
   * has already been completed for the user.
   */
  const [isShopSetupComplete, setIsShopSetupComplete] = useState(false);
  const [checkingShop, setCheckingShop] = useState(false);

  useEffect(() => {
    /**
     * Firebase listener that triggers whenever
     * authentication state changes (login/logout).
     *
     * Why we use a listener instead of manual checks:
     * - Firebase manages token refresh internally
     * - App always stays in sync with auth state
     */
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsShopSetupComplete(false);
        setInitializing(false);
        return;
      }

      setCheckingShop(true);
      setUser(firebaseUser);

      try {
        const cachedShop = await AsyncStorage.getItem("shop");

        if (cachedShop) {
          setIsShopSetupComplete(true);
          setInitializing(false);
          return;
        }

        const data = await fetchShop();

        setIsShopSetupComplete(!!data);

        if (data?.shop) {
          await AsyncStorage.setItem("shop", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Auth hook: failed to fetch shop", error);
        setIsShopSetupComplete(false);
      } finally {
        setInitializing(false);
        setCheckingShop(false);
      }
    });

    /**
     * Cleanup:
     * Remove Firebase listener when component unmounts.
     * Prevents memory leaks.
     */
    return unsubscribe;
  }, []);

  /**
   * Public API of this hook
   * Components using this hook should only rely on these values.
   */
  return {
    user,
    initializing,
    isShopSetupComplete,
    checkingShop,
  };
}
