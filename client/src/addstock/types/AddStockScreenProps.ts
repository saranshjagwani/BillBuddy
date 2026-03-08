export interface AddStockPayload {
  itemName: string;
  unit: string;
  sellingPrice: string;
  currentStock: string;
}

export interface AddStockScreenProps {
  onSave?: (payload: AddStockPayload) => Promise<void> | void;
  onCancel?: () => void;
}
