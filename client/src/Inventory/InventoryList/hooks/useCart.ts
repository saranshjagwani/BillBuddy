import { useState } from "react";

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

console.log("Cart Items are in hook", cartItems);
  function addItem(item: any) {
    console.log("item is added",item);
    setCartItems(prev => {
      const existing = prev.find(i => i.itemId === item.itemId);

      if (existing) {
        return prev.map(i =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
     

      return [
        ...prev,
        {
          itemId: item.itemId,
          name: item.itemName,
          price: item.sellingPrice,
          quantity: 1
        }
      ];
    });  
  }

  function removeItem(itemId: string) {
    setCartItems(prev =>
      prev
        .map(i =>
          i.itemId === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  function numberOfItems(item: any) {
    console.log("Number Of Items Are ",item.filter(i => i.itemId === item.itemId).length);
  return item.filter(i => i.itemId === item.itemId).length;
}

  return {
    cartItems,
    addItem,
    removeItem,
    numberOfItems
  };
}