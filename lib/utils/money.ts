import Decimal from 'decimal.js';

/**
 * Money Utils - Precise decimal calculations for pricing
 * 
 * CRITICAL: Always use Decimal.js for money calculations to avoid floating-point errors
 * NEVER use native number arithmetic for money values
 */

/**
 * Convert any numeric value to Decimal
 */
export function toDecimal(value: number | string | Decimal): Decimal {
  return new Decimal(value);
}

/**
 * Add two or more money values
 */
export function add(...values: (number | string | Decimal)[]): Decimal {
  let sum = new Decimal(0);
  for (const val of values) {
    sum = sum.plus(val);
  }
  return sum;
}

/**
 * Subtract one money value from another
 */
export function subtract(value1: number | string | Decimal, value2: number | string | Decimal): Decimal {
  return new Decimal(value1).minus(value2);
}

/**
 * Multiply money value by a number
 */
export function multiply(value: number | string | Decimal, multiplier: number | string | Decimal): Decimal {
  return new Decimal(value).times(multiplier);
}

/**
 * Divide money value by a number
 */
export function divide(value: number | string | Decimal, divisor: number | string | Decimal): Decimal {
  return new Decimal(value).div(divisor);
}

/**
 * Calculate line total (unit price × quantity)
 */
export function calculateLineTotal(unitPrice: number | string | Decimal, quantity: number): Decimal {
  return multiply(unitPrice, quantity);
}

/**
 * Calculate order total (sum of all line totals)
 */
export function calculateOrderTotal(lineTotals: (number | string | Decimal)[]): Decimal {
  return add(...lineTotals);
}

/**
 * Format money value to standard decimal places (2 for USD)
 */
export function formatMoney(value: number | string | Decimal, decimalPlaces: number = 2): string {
  return new Decimal(value).toFixed(decimalPlaces);
}

/**
 * Parse string money value to Decimal (handles currency symbols, commas)
 */
export function parseMoney(value: string): Decimal {
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,]/g, '').trim();
  return new Decimal(cleaned);
}

/**
 * Check if value is valid money amount (positive number)
 */
export function isValidMoney(value: number | string | Decimal): boolean {
  try {
    const decimal = new Decimal(value);
    return decimal.isFinite() && decimal.gte(0);
  } catch {
    return false;
  }
}

/**
 * Round money value to specified decimal places
 */
export function round(value: number | string | Decimal, decimalPlaces: number = 2): Decimal {
  return new Decimal(value).toDecimalPlaces(decimalPlaces);
}

/**
 * Compare two money values
 * Returns: -1 (less than), 0 (equal), 1 (greater than)
 */
export function compare(value1: number | string | Decimal, value2: number | string | Decimal): number {
  const v1 = new Decimal(value1);
  const v2 = new Decimal(value2);
  
  if (v1.lessThan(v2)) return -1;
  if (v1.greaterThan(v2)) return 1;
  return 0;
}

/**
 * Calculate percentage of a money value
 */
export function percentage(value: number | string | Decimal, percent: number): Decimal {
  return new Decimal(value).times(percent).div(100);
}

/**
 * Apply discount to money value
 */
export function applyDiscount(value: number | string | Decimal, discountPercent: number): Decimal {
  const discount = percentage(value, discountPercent);
  return subtract(value, discount);
}

/**
 * Calculate tax on money value
 */
export function applyTax(value: number | string | Decimal, taxPercent: number): Decimal {
  const tax = percentage(value, taxPercent);
  return add(value, tax);
}
