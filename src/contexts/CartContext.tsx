import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { EventPackage } from "@/lib/events-data";

interface CartItem {
  package: EventPackage;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (pkg: EventPackage) => void;
  removeItem: (pkgId: string) => void;
  updateQuantity: (pkgId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((pkg: EventPackage) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.package.id === pkg.id);
      if (existing) {
        return prev.map((i) =>
          i.package.id === pkg.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { package: pkg, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((pkgId: string) => {
    setItems((prev) => prev.filter((i) => i.package.id !== pkgId));
  }, []);

  const updateQuantity = useCallback((pkgId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.package.id !== pkgId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.package.id === pkgId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.package.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
