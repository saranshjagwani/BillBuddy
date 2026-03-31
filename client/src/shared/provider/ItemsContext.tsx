import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../shared/firebase/firebase.config";
import { useAuth } from "./AuthContextProvider";

export type Item = {
  itemId: string;
  itemName: string;
  sellingPrice: number;
  currentStock: number;
  quantity: number;
  unit: string;
};

type ItemsContextType = {
  items: Item[];
  loading: boolean;
  error: string | null;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const { shopData } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shopId = shopData?.shopId;

    // WHY: Prevent attaching listener before auth is ready
    if (!shopId) {
      setLoading(true); // still waiting for auth
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "item"),
      where("shopId", "==", shopId),
      where("isActive", "==", true),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedItems: Item[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // WHY: Ensure predictable shape (no silent undefined bugs)
          return {
            itemId: doc.id,
            itemName: data.itemName || "",
            sellingPrice: data.sellingPrice || 0,
            currentStock: data.currentStock || 0,
            quantity: data.quantity || 0,
            unit: data.unit || "",
          };
        });

        setItems(updatedItems);
        setLoading(false);
      },
      (err) => {
        // console.error("Items snapshot error:", err);

        // WHY: Never fail silently (constitution rule)
        setError("Failed to sync items");
        setLoading(false);
      },
    );

    // WHY: Cleanup prevents duplicate listeners & memory leaks
    return () => unsubscribe();
  }, [shopData?.shopId]);

  return (
    <ItemsContext.Provider value={{ items, loading, error }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error("useItems must be used within ItemsProvider");
  }

  return context;
};
