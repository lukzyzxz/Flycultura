// Persist the user's last search so it can be restored on the Home page.

export interface LastSearch {
  type: string;
  from: string;
  to: string;
  date: string;
  adults: number;
  filter?: string | null;
  savedAt: number;
}

const KEY = "flycultura_last_search";

export function saveLastSearch(s: Omit<LastSearch, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: LastSearch = { ...s, savedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event("last-search-changed"));
  } catch {
    /* ignore quota errors */
  }
}

export function getLastSearch(): LastSearch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastSearch;
  } catch {
    return null;
  }
}

export function clearLastSearch() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("last-search-changed"));
}