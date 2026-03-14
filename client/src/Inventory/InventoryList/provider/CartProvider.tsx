import React, { createContext, useContext, useState } from "react";
import type { Item } from "../hooks/useItems";

export type CartItem = {
  itemId: string;
  name: string;
  price: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalQty: number;
  numberOfItems: (itemId: string) => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addItem(item: Item) {
    setCartItems(prev => {
      const existing = prev.find(i => i.itemId === item.itemId);
      if (existing) {
        return prev.map(i =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        itemId: item.itemId,
        name: item.itemName,
        price: item.sellingPrice,
        quantity: 1,
      }];
    });
  }

  function removeItem(itemId: string) {
    setCartItems(prev =>
      prev
        .map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  function numberOfItems(item: any) {
  return item.filter(i => i.itemId === item.itemId).length;
}


  function clearCart() {
    setCartItems([]);
  }

  const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, totalQty,numberOfItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}