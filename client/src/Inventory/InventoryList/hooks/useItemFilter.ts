import { useState, useMemo } from "react";
import { Item } from "./useItems";

export type StockFilter = "all" | "low" | "in" | "out";
export type ExpiryFilter = "all" | "soon" | "expired";
export type SortOption =
  | "none"
  | "az" | "za"
  | "stock_low_high" | "stock_high_low"
  | "price_low_high" | "price_high_low"
  | "recently_added";

export interface FilterState {
  category: string | null;
  supplier: string | null;
  stock: StockFilter;
  expiry: ExpiryFilter;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  category: null,
  supplier: null,
  stock: "all",
  expiry: "all",
  sort: "none",
};

export function useItemFilter(items: Item[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const vals = items.map((i) => i.category).filter(Boolean) as string[];
    return [...new Set(vals)];
  }, [items]);

  const suppliers = useMemo(() => {
    const vals = items.map((i) => i.supplierName).filter(Boolean) as string[];
    return [...new Set(vals)];
  }, [items]);

cd   const filtered = useMemo(() => {
    let result = [...items];

    // Category
    if (filters.category) {
      result = result.filter((i) => i.category === filters.category);
    }

    // Supplier
    if (filters.supplier) {
      result = result.filter((i) => i.supplierName === filters.supplier);
    }

    // Stock
    if (filters.stock !== "all") {
      result = result.filter((item) => {
        const stock = parseInt(item.currentStock ?? "0");
        const low = parseInt(item.lowStockAlert ?? "5");
        if (filters.stock === "out") return stock === 0;
        if (filters.stock === "low") return stock > 0 && stock <= low;
        if (filters.stock === "in") return stock > 0;
        return true;
      });
    }

    // Expiry
    if (filters.expiry !== "all") {
      const now = new Date();
      const week = new Date();
      week.setDate(now.getDate() + 7);
      result = result.filter((item) => {
        if (!item.expiryDate) return false;
        const exp = new Date(item.expiryDate);
        if (filters.expiry === "expired") return exp < now;
        if (filters.expiry === "soon") return exp >= now && exp <= week;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case "az": return a.itemName.localeCompare(b.itemName);
        case "za": return b.itemName.localeCompare(a.itemName);
        case "stock_low_high": return parseInt(a.currentStock ?? "0") - parseInt(b.currentStock ?? "0");
        case "stock_high_low": return parseInt(b.currentStock ?? "0") - parseInt(a.currentStock ?? "0");
        case "price_low_high": return parseFloat(a.sellingPrice ?? "0") - parseFloat(b.sellingPrice ?? "0");
        case "price_high_low": return parseFloat(b.sellingPrice ?? "0") - parseFloat(a.sellingPrice ?? "0");
        case "recently_added":
          return (b.createdAt?._seconds ?? 0) - (a.createdAt?._seconds ?? 0);
        default: return 0;
      }
    });

    return result;
  }, [items, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.supplier) count++;
    if (filters.stock !== "all") count++;
    if (filters.expiry !== "all") count++;
    if (filters.sort !== "none") count++;
    return count;
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    filters,
    filtered,
    categories,
    suppliers,
    activeFilterCount,
    isFilterOpen,
    setIsFilterOpen,
    updateFilter,
    resetFilters,
  };
}