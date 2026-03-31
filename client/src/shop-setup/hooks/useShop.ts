import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchShop } from "../services/shop.services";
import { useAuth } from "../../shared/provider/AuthContextProvider";

export default function useShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadShop() {
      try {
        // 1️⃣ Load cached shop instantly
        const cached = await AsyncStorage.getItem("shop");

        if (cached) {
          setShop(JSON.parse(cached));
          setLoading(false);
        }

        // 2️⃣ Fetch latest shop from backend
        const data = await fetchShop();

        if (data.shop) {
          setShop(data.shop);

          // 3️⃣ Update cache
          await AsyncStorage.setItem("shop", JSON.stringify(data.shop));
        }
      } catch (err) {
        // console.error("Error fetching shop:", err);
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, [user]);

  return { shop, loading };
}
