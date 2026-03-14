import { useState } from "react";
import { createItem } from "../services/item.service";
import useShop from "../../shop-setup/hooks/useShop";
import { useToast } from "../../ui/toast/useToast";


export const PRODUCT_UNITS = [
  "Piece",
  "Kg",
  "Gram",
  "Litre",
  "ML",
  "Bottle",
  "Tablets",
  "Box",
  "Pack",
  "Packet",
  "Dozen",
  "Metre",
  "Foot",
  "Roll",
  "Set",
  "Pair",
  "Strip",
  "Carton",
  "Other",
];


type SavePayload = {
  shopId: string;
  itemName: string;
  unit: string;
  sellingPrice: string;
  currentStock: string;
};

export default function useAddItem() {
  const { shop } = useShop();
  const { showToast } = useToast();

  const shopId = shop?.shopId || null;
  console.log("Shop ID in useAddItem:", shopId);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState(PRODUCT_UNITS[0]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  function clearError(field: string) {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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
    setUnit(PRODUCT_UNITS[0]);
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
    PRODUCT_UNITS,

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