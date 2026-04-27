// Centralized date validation limits for the whole app.
// All date inputs must fall between today and 31 Dec 2050.

export const MAX_DATE = "2050-12-31";

export function getMinDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function isValidFutureDate(value: string): boolean {
  if (!value) return false;
  const min = getMinDate();
  return value >= min && value <= MAX_DATE;
}

/** Returns the value if valid, or empty string. */
export function clampDate(value: string): string {
  if (!value) return "";
  return isValidFutureDate(value) ? value : "";
}

export function dateErrorMessage(locale: string): string {
  return locale === "pt"
    ? "Escolha uma data entre hoje e 31/12/2050."
    : "Pick a date between today and 12/31/2050.";
}

/** Sanitize a free numeric input to digits only and clamp to [min,max]. */
export function sanitizeNumber(raw: string, min: number, max: number): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // Avoid runaway long strings before parsing
  const trimmed = digits.slice(0, String(max).length + 1);
  const n = parseInt(trimmed, 10);
  if (isNaN(n)) return "";
  if (n > max) return String(max);
  // Allow user to keep typing values smaller than min — don't auto-bump.
  return String(n);
}

export function isNumberInRange(value: string, min: number, max: number): boolean {
  if (!value) return false;
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= min && n <= max;
}
