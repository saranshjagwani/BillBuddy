// /**
//  * useAuth Hook
//  *
//  * Purpose:
//  * Manages authentication state and determines whether the shop setup
//  * has already been completed for the logged-in user.
//  *
//  * Why this hook exists:
//  * - Centralizes Firebase auth state handling.
//  * - Prevents every screen from manually checking authentication.
//  * - Optimizes startup by using cached shop data before hitting network.
//  *
//  * What this file owns:
//  * - Listening to Firebase auth state
//  * - Fetching shop data when user logs in
//  * - Caching shop data in AsyncStorage
//  *
//  * What this file must NOT do:
//  * - Handle UI navigation
//  * - Perform business logic related to shop setup
//  */

// import { useEffect, useState, useCallback } from "react";
// import { getApp } from "@react-native-firebase/app";
// import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
// import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
// import { fetchShop } from "../../shop-setup/services/shop.services";

// const auth = getAuth(getApp());

// export default function useAuth() {
//   /**
//    * Logged-in Firebase user
//    * Null means user is logged out
//    */
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

//   /**
//    * Indicates if auth initialization is still running.
//    * Used to prevent UI from flashing incorrect screens.
//    */
//   const [initializing, setInitializing] = useState(true);

//   /**
//    * Indicates whether the shop setup process
//    * has already been completed for the user.
//    */
//   const [isShopSetupComplete, setIsShopSetupComplete] = useState(false);
//   const [checkingShop, setCheckingShop] = useState(false);

//   const refetchShop = useCallback(async () => {
//     // console.log("[useAuth] Refetching shop data...");
//     if (!user) return;

//     try {
//       const data = await fetchShop();

//       // console.log("Refetch shop:", data);

//       // console.log("Data is in ref", !!data?.shop);

//       setIsShopSetupComplete(!!data?.shop);
//     } catch (error) {
//       // console.error("Refetch failed:", error);
//       setIsShopSetupComplete(false);
//     } finally {
//       setCheckingShop(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     /**
//      * Firebase listener that triggers whenever
//      * authentication state changes (login/logout).
//      *
//      * Why we use a listener instead of manual checks:
//      * - Firebase manages token refresh internally
//      * - App always stays in sync with auth state
//      */
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       // console.log("Auth hook: authentication state changed", firebaseUser);

//       if (!firebaseUser) {
//         setUser(null);
//         setIsShopSetupComplete(false);
//         setInitializing(false);
//         return;
//       }

//       setCheckingShop(true);

//       try {
//         const data = await fetchShop();
//         setIsShopSetupComplete(!!data?.shop);
//       } catch (error) {
//         // console.error("Auth hook: failed to fetch shop", error);
//         setIsShopSetupComplete(false);
//       } finally {
//         setInitializing(false);
//         setUser(firebaseUser);
//         setCheckingShop(false);
//       }
//     });

//     /**
//      * Cleanup:
//      * Remove Firebase listener when component unmounts.
//      * Prevents memory leaks.
//      */
//     return unsubscribe;
//   }, []);

//   /**
//    * Public API of this hook
//    * Components using this hook should only rely on these values.
//    */
//   return {
//     user,
//     initializing,
//     isShopSetupComplete: Boolean(isShopSetupComplete), // ✅ force new primitive
//     checkingShop,
//     refetchShop,
//   };
// }
