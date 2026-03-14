import {
  FilterState, SortOption, StockFilter,
  ExpiryFilter, DEFAULT_FILTERS,
} from "../hooks/useItemFilter";

export type Section = "category" | "supplier" | "stock" | "expiry" | "sort";

export const SECTIONS: { key: Section; label: string }[] = [
  { key: "sort", label: "Sort By" },
  { key: "category", label: "Category" },
  { key: "supplier", label: "Supplier" },
  { key: "stock", label: "Stock Status" },
  { key: "expiry", label: "Expiry" },
];

export const sortOptions: { label: string; value: SortOption }[] = [
          { label: "Default", value: "none" },
          { label: "Name: A → Z", value: "az" },
          { label: "Name: Z → A", value: "za" },
          { label: "Stock: Low → High", value: "stock_low_high" },
          { label: "Stock: High → Low", value: "stock_high_low" },
          { label: "Price: Low → High", value: "price_low_high" },
          { label: "Price: High → Low", value: "price_high_low" },
          { label: "Recently Added", value: "recently_added" },
        ];

        export const stockOptions: { label: string; value: StockFilter }[] = [
          { label: "All", value: "all" },
          { label: "In Stock", value: "in" },
          { label: "Low Stock (< 5)", value: "low" },
          { label: "Out of Stock", value: "out" },
        ];

        export  
         const expiryOptions: { label: string; value: ExpiryFilter }[] = [
          { label: "All", value: "all" },
          { label: "Expiring Soon (7 days)", value: "soon" },
          { label: "Expired", value: "expired" },
        ];