import { useState, useMemo } from "react";
import { createItem } from "../services/item.service";
import { useToast } from "../../ui/toast/useToast";
import { useAuth } from "../../shared/provider/AuthContextProvider";

export const DEFAULT_UNITS_BY_CATEGORY: Record<string, string[]> = {
  "Grocery / Kirana": ["Kg", "Gram", "Litre", "Piece", "Packet", "Box"],

  "Pharmacy / Medical Store": ["Tablet", "Capsule", "Strip", "Bottle", "Piece"],

  "General Store": ["Piece", "Pack", "Box"],

  "Clothing / Fashion": ["Piece", "Set"],

  "Electronics / Mobile Shop": ["Piece", "Box"],

  "Dairy / Bakery": ["Litre", "Piece", "Kg","Pound"],

  "Hardware Store": ["Piece", "Kg", "Metre"],

  "Beauty & Cosmetics": ["Piece", "Bottle", "Pack"],

  "Restaurant / Food Outlet": ["Plate", "Piece", "Kg"],
  Other: ["Piece", "Kg", "Gram", "Litre", "ML", "Pack", "Box"],
};

type SavePayload = {
  shopId: string;
  itemName: string;
  unit: string;
  sellingPrice: string;
  currentStock: string;
};

export default function useAddItem() {
  const { showToast } = useToast();
  const { shopData } = useAuth();

  const units = useMemo(() => {
    console.log("ShopData units ke lie", shopData);
    if (!shopData?.category) {
      console.log("Shop category not found");
      return ["Piece"];
    }

    return DEFAULT_UNITS_BY_CATEGORY[shopData.category] || ["Piece"];
  }, [shopData]);

  const shopId = shopData?.shopId || null;
  console.log("Shop ID in useAddItem:", shopId);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("Piece");
  const [sellingPrice, setSellingPrice] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!sellingPrice.trim()) {
      newErrors.sellingPrice = "Selling price is required";
    } else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) < 0) {
      newErrors.sellingPrice = "Enter a valid price";
    }

    if (currentStock.trim() && isNaN(Number(currentStock))) {
      newErrors.currentStock = "Enter a valid quantity";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    if (!shopId) {
      console.error("Shop not loaded yet");
      return;
    }

    try {
      setLoading(true);

      const payload: SavePayload = {
        shopId,
        itemName,
        unit,
        sellingPrice,
        currentStock,
      };

      console.log("Creating item:", payload);

      await createItem(payload);

      showToast("success", "Item added successfully!");

      // Clear form
      setItemName("");
      setUnit("Piece");
      setSellingPrice("");
      setCurrentStock("");
    } catch (err) {
      console.error("AddItem error:", err);
      showToast("error", "Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return {
    units,

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
