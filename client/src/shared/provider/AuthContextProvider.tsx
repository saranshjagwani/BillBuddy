import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { fetchShop } from "../../shop-setup/services/shop.services";

export type ShopDetails = {
  shopId: string;
  shopName: string;
  phoneNumber: string;
  category?: string;
};

// 1. Define the Global Shape
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  isShopSetupComplete: boolean;
  // This is the key: granting global access to update the status
  setIsShopSetupComplete: (value: boolean) => void;
  checkingShop: boolean;
  refetchShop: () => Promise<void>;
  shopData: ShopDetails | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const auth = getAuth(getApp());

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isShopSetupComplete, setIsShopSetupComplete] = useState(false);
  const [checkingShop, setCheckingShop] = useState(false);
  const [shopData, setShopData] = useState<ShopDetails | null>(null);

  // Function to re-verify with Database
  const refetchShop = useCallback(async () => {
    // console.log("[AuthContext] Refetching shop status...");
    if (!auth.currentUser) return;

    setCheckingShop(true);

    try {
      const data = await fetchShop();
      // console.log("Data From The Auth pr", data);
      setIsShopSetupComplete(!!data?.shop);
      setShopData({
        shopId: data?.shop?.shopId,
        shopName: data?.shop?.shopName,
        phoneNumber: data?.shop?.phoneNumber,
        category: data?.shop?.category,
      });
    } catch (error) {
      // console.error("[AuthContext] Refetch failed:", error);
    } finally {
      setCheckingShop(false);
    }
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsShopSetupComplete(false);
        setInitializing(false);
        return;
      }

      setUser(firebaseUser);
      setCheckingShop(true);
      try {
        const data = await fetchShop();
        // console.log("Data From The Auth pr", data);
        setIsShopSetupComplete(!!data?.shop);
        setShopData({
          shopId: data?.shop?.shopId,
          shopName: data?.shop?.shopName,
          phoneNumber: data?.shop?.phoneNumber,
          category: data?.shop?.category,
        });
      } finally {
        setInitializing(false);
        setCheckingShop(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        shopData,
        initializing,
        isShopSetupComplete,
        setIsShopSetupComplete,
        checkingShop,
        refetchShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
