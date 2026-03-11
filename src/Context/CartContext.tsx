import { createContext, useContext, useState } from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  bookingDay?: string;
  description?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: any) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  updateBookingDay: (id: string, day: string) => void;
  updateDescription: (id: string, desc: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Add item
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev;
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ Increase qty
  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // ✅ Decrease qty
  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ Update booking day
  const updateBookingDay = (id: string, bookingDay: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookingDay } : item))
    );
  };

  // ✅ Update description
  const updateDescription = (id: string, description: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description } : item))
    );
  };

  // ✅ Total auto calculated
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, updateBookingDay, updateDescription, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
