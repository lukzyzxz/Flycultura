import { useState, useCallback, useEffect } from "react";

export interface RecentItem {
  id: string;
  type: "destination" | "event" | "deal";
  name: string;
  image: string;
  price?: number;
  slug?: string;
  viewedAt: number;
}

const STORAGE_KEY = "flycultura_recently_viewed";
const MAX_ITEMS = 12;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addItem = useCallback((item: Omit<RecentItem, "viewedAt">) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));
      const next = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { items, addItem };
};
