import { useEffect, useState, useCallback } from "react";
import { fetchShop } from "../services/itemfetch.service";

export type Item = {
  itemId: string;
  itemName: string;
  sellingPrice: number;
  currentStock: number;
};


export function useItems() {

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
     

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
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
  };
}