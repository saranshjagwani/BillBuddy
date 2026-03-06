import { useEffect, useState, useCallback } from "react";
import { fetchShop } from "../services/shop.services";

export default function useShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchShop();
      console.log("Fetched shop data:", data);
      setShop(data.shop);
    } catch (err) {
      console.error("Error fetching shop:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { shop, loading, refetch: fetchData };
}