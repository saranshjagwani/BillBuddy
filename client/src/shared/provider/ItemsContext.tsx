import { createContext, useContext, useEffect, useState } from "react";
import { fetchShop } from "../../Inventory/InventoryList/services/itemfetch.service";

export type Item = {
  itemId: string;
  itemName: string;
  sellingPrice: number;
  quantity: number;
  unit:string;
};

type ItemsContextType = {
  items: Item[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const data = await fetchShop();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch items");
      }

      setItems(data.items || []);
    } catch (err: any) {
      console.error("Fetch items error:", err);
      setError(err.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(); // fetch only once when provider loads
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        items,
        loading,
        error,
        refresh: fetchItems,
      }}
    >
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