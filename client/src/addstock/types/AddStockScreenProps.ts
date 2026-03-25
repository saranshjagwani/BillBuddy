import type { Item } from "../../shared/provider/ItemsContext";

export interface AddStockPayload {
  itemName: string;
  unit: string;
  sellingPrice: string;
  currentStock: string;
}

export type AddStockScreenProps = {
  onCancel?: () => void;
  item?: Item; // 👈 NEW
};
