// useupdateItem.ts
import { useState } from "react";
import { updateItem } from "../../Inventory/InventoryList/services/itemfetch.service";
import { useAuth } from "../../shared/provider/AuthContextProvider";
import { useToast } from "../../ui/toast/useToast";
import { Item } from "../../shared/provider/ItemsContext";

export default function useUpdateItem(item: Item, onSuccess: () => void) {
  const { shopData } = useAuth();
  const { showToast } = useToast();
  const shopId = shopData?.shopId || null;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 👇 pre-filled with existing item data
  const [itemName, setItemName] = useState(item.itemName);
  const [unit, setUnit] = useState(item.unit);
  const [sellingPrice, setSellingPrice] = useState(String(item.sellingPrice));
  const [currentStock, setCurrentStock] = useState(String(item.currentStock));

  function clearError(field: string) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!itemName.trim()) newErrors.itemName = "Item name is required";
    if (!sellingPrice.trim())
      newErrors.sellingPrice = "Selling price is required";
    else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) < 0)
      newErrors.sellingPrice = "Enter a valid price";
    if (currentStock.trim() && isNaN(Number(currentStock)))
      newErrors.currentStock = "Enter a valid quantity";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate() || !shopId) return;

    try {
      console.log("Items Before save ", item);
      setLoading(true);
      await updateItem(item.itemId, {
        itemName,
        unit,
        sellingPrice: Number(sellingPrice),
        currentStock: Number(currentStock),
        shopId,
      });
      showToast("success", "Item updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("updateItem error:", err);
      showToast("error", "Failed to update item.");
    } finally {
      setLoading(false);
    }
  }

  return {
    itemName,
    unit,
    sellingPrice,
    currentStock,
    setItemName,
    setUnit,
    setSellingPrice,
    setCurrentStock,
    errors,
    loading,
    clearError,
    handleSave,
  };
}
