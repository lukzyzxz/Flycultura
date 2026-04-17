/**
 * Lightweight client-side log of broken image URLs that fell back to a placeholder.
 * Persisted in localStorage so devs can review which assets are failing.
 */
const STORAGE_KEY = "flycultura.imageErrorLog";
const MAX_ENTRIES = 200;

export interface ImageErrorEntry {
  src: string;
  category: string;
  page: string;
  timestamp: number;
}

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

export function getImageErrorLog(): ImageErrorEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logImageError(entry: Omit<ImageErrorEntry, "timestamp">) {
  if (!isBrowser()) return;
  try {
    const current = getImageErrorLog();
    // dedupe: skip if same src logged in the last minute
    const now = Date.now();
    const recentDuplicate = current.find(
      (e) => e.src === entry.src && now - e.timestamp < 60_000,
    );
    if (recentDuplicate) return;

    const next: ImageErrorEntry[] = [{ ...entry, timestamp: now }, ...current].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}

export function clearImageErrorLog() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
