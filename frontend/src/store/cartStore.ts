import { create } from 'zustand';
import { MenuItem } from '../types';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const getInitialItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getInitialItems(),
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === item.id);
    
    let newItems: CartItem[];
    if (existingItem) {
      newItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...items, { ...item, quantity: 1 }];
    }
    
    set({ items: newItems });
    localStorage.setItem('cart', JSON.stringify(newItems));
  },
  removeItem: (itemId) => {
    const items = get().items.filter((i) => i.id !== itemId);
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    
    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
  },
  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem('cart');
  },
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

