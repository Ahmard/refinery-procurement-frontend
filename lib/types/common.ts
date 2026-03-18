/**
 * Common Types & Base Interfaces
 */

/**
 * UUID type for type-safe identifiers
 */
export type Uuid = string;

/**
 * Generic ID type (can be UUID or other string identifiers)
 */
export type Id = string;

/**
 * Decimal number as string (for precise money calculations)
 */
export type DecimalString = string;

/**
 * ISO 8601 date-time string
 */
export type DateTime = string;

/**
 * ISO 8601 date string (YYYY-MM-DD)
 */
export type DateOnly = string;

/**
 * Generic email type
 */
export type Email = string;

/**
 * Generic phone number type
 */
export type Phone = string;

/**
 * Base entity interface that all domain models extend
 */
export interface BaseEntity {
  id: Uuid;
  created_at?: DateTime;
  updated_at?: DateTime;
}

/**
 * User/Authentication related types
 */
export interface User {
  id: Uuid;
  email: Email;
  phone?: Phone;
  name?: string;
  role?: string;
  is_active?: boolean;
  created_at?: DateTime;
  updated_at?: DateTime;
}

/**
 * Supplier base interface
 */
export interface Supplier extends BaseEntity {
  name: string;
  contact_email: Email;
  contact_phone?: Phone;
  address?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
