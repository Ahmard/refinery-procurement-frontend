import { format, parseISO, isValid } from 'date-fns';
import Decimal from 'decimal.js';

/**
 * Formatters - Currency, date, and number formatting utilities
 */

/**
 * Format currency value to USD string
 */
export function formatCurrency(value: number | string | Decimal): string {
  const numValue = typeof value === 'string' || value instanceof Decimal 
    ? parseFloat(value.toString()) 
    : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format date to readable string (MMM dd, yyyy)
 */
export function formatDate(date: Date | string | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      console.warn('[formatDate] Invalid date:', date);
      return '-';
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('[formatDate] Error formatting date:', error);
    return '-';
  }
}

/**
 * Format date with time (MMM dd, yyyy HH:mm:ss)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(dateObj);
  } catch {
    return formatDate(date);
  }
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Format phone number (US format)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format status for display (convert snake_case to Title Case)
 */
export function formatStatus(status: string): string {
  return status.split('_').map(word => capitalize(word)).join(' ');
}
