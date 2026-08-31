// Shared utilities for handling prices and currencies in billing components.
// Prices in the Plan interface are strings to support "Custom" and flexible
// input, but we need robust parsing to avoid NaN, weird discounts, or broken
// UIs when data comes from APIs or user config.

/**
 * Checks if a price value represents a "custom" price (e.g. enterprise plans).
 */
export function isCustomPrice(value?: string | number | null): boolean {
  if (value == null) return true;
  const str = String(value).trim().toLowerCase();
  return (
    str === "custom" ||
    str === "" ||
    str === "contact us" ||
    str === "contact sales"
  );
}

/**
 * Safely parses a price string or number.
 * Strips non-numeric chars except . and - (for negative edge cases, though prices shouldn't be negative).
 * Assumes decimal-formatted input uses an en-US style dot separator.
 * Returns undefined for invalid or custom values.
 */
export function parsePrice(value?: string | number | null): number | undefined {
  if (value == null) return undefined;
  if (isCustomPrice(value)) return undefined;

  const cleaned = String(value).replace(/[^\d.\-]/g, "");
  const num = Number.parseFloat(cleaned);

  if (!Number.isFinite(num)) return undefined;
  // Billing prices shouldn't be negative in practice, but we keep the value for now.
  return num;
}

/**
 * Formats a numeric amount with a currency symbol or code.
 * If currency looks like an ISO code (3 letters), tries Intl.NumberFormat for proper symbol and formatting.
 * Falls back gracefully.
 */
export function formatPrice(amount: number, currency: string = "$"): string {
  if (!Number.isFinite(amount)) {
    return "--";
  }

  const trimmedCurrency = currency?.trim() || "$";

  // If it's a 3-letter code, try real currency formatting without bundling
  // currency metadata into every component that imports this utility.
  if (/^[A-Za-z]{3}$/.test(trimmedCurrency)) {
    const code = trimmedCurrency.toUpperCase();
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
      }).format(amount);
    } catch {
      // fall through to symbol fallback
    }
  }

  // Default: just prefix with whatever symbol/string was provided.
  const symbol =
    trimmedCurrency.length <= 3 ? trimmedCurrency : trimmedCurrency + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Formats a raw plan price without turning missing or invalid values into zero.
 */
export function formatBillingPrice(
  value?: string | number | null,
  currency: string = "$",
): string {
  if (isCustomPrice(value)) {
    return String(value ?? "Custom").trim() || "Custom";
  }

  const price = parsePrice(value);
  return price == null ? "Custom" : formatPrice(price, currency);
}

/**
 * Calculates a discount percentage between monthly and yearly prices.
 * Returns 0 for custom/invalid/zero cases.
 */
export function calculateDiscount(
  monthlyPrice?: string | number | null,
  yearlyPrice?: string | number | null,
): number {
  if (isCustomPrice(monthlyPrice) || isCustomPrice(yearlyPrice)) return 0;

  const monthly = parsePrice(monthlyPrice);
  const yearly = parsePrice(yearlyPrice);

  if (monthly == null || yearly == null || monthly <= 0) return 0;

  const discount = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
  return Math.max(0, Math.round(discount));
}
