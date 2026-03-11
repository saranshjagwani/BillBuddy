import { useState, useMemo } from "react";
import { Item } from "./useItems";

export function useItemSearch(items: Item[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      item.itemName.toLowerCase().includes(q)
    );
  }, [query, items]);


  return { query, setQuery, filtered };
}