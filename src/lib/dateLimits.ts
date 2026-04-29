// Centralized date validation limits for the whole app.
// All date inputs must fall between today and 31 Dec 2050.

export const MAX_DATE = "2050-12-31";

export function getMinDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function isValidFutureDate(value: string): boolean {
  if (!value) return false;
  const min = getMinDate();
  if (!isRealCalendarDate(value)) return false;
  return value >= min && value <= MAX_DATE;
}

/**
 * Returns true only if value is a real calendar date in YYYY-MM-DD format.
 * Rejects impossible dates like 2026-02-30, 2026-13-01, 2026-04-31, etc.
 */
export function isRealCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  // Build date in UTC and verify the parts round-trip (catches Feb 30, Apr 31, etc.)
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
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

/** Returns a precise reason why a date is invalid, or "" if valid. */
export function dateInvalidReason(value: string, locale: string): string {
  if (!value) return "";
  const min = getMinDate();
  // Detect malformed (year < 1000 or > 9999 etc.)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return locale === "pt"
      ? "Formato de data inválido."
      : "Invalid date format.";
  }
  if (!isRealCalendarDate(value)) {
    return locale === "pt"
      ? "Esta data não existe no calendário (ex.: 30/02)."
      : "This date does not exist on the calendar (e.g. Feb 30).";
  }
  if (value < min) {
    return locale === "pt"
      ? "Não é possível escolher uma data passada."
      : "You can't pick a past date.";
  }
  if (value > MAX_DATE) {
    return locale === "pt"
      ? "A data máxima permitida é 31/12/2050."
      : "The latest allowed date is 12/31/2050.";
  }
  return "";
}

export function dateHelpText(locale: string): string {
  return locale === "pt"
    ? "Datas válidas: de hoje até 31/12/2050."
    : "Valid dates: today through 12/31/2050.";
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
