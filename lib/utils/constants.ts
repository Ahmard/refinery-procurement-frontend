/**
 * Application Constants
 * 
 * Central location for app-wide constants, enums, and default values
 */

/**
 * Purchase Order Status Enum
 */
export enum POStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
}

/**
 * Default Values
 */
export const DEFAULTS = {
  // Pagination
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Cost Center
  COST_CENTER: 'CC-1234',
  
  // Payment Terms
  PAYMENT_TERMS: 'Net 30',
  
  // Date Format
  DATE_FORMAT: 'MMM dd, yyyy',
  DATETIME_FORMAT: 'MMM dd, yyyy HH:mm:ss',
  
  // Currency
  CURRENCY: 'USD',
  DECIMAL_PLACES: 2,
  
  // Search
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  
  // Session
  SESSION_TIMEOUT_MINUTES: 30,
  TOKEN_REFRESH_THRESHOLD_SECONDS: 300, // 5 minutes before expiry
  
  // Retry
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

/**
 * API Response Codes
 */
export const API_CODES = {
  SUCCESS: '000',
  ERROR: '999',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  CONFLICT: '409',
  SERVER_ERROR: '500',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_STATE: 'auth-storage',
  UI_STATE: 'ui-storage',
  DRAFT_PO: 'draft_po_state',
  DRAFT_PO_BACKUP: 'draft_po_backup',
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CATALOG: '/catalog',
  PURCHASE_ORDERS: '/purchase-orders',
  CREATE_PO: '/purchase-orders/create',
  ADMIN: '/admin',
} as const;

/**
 * Sort Options for Catalog
 */
export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'lead_time_asc', label: 'Lead Time: Low to High' },
  { value: 'lead_time_desc', label: 'Lead Time: High to Low' },
  { value: 'supplier_asc', label: 'Supplier: A to Z' },
] as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * File Upload Limits
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/**
 * Character Limits
 */
export const CHAR_LIMITS = {
  PRODUCT_NAME_MIN: 2,
  PRODUCT_NAME_MAX: 200,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000,
  COMMENT_MIN: 1,
  COMMENT_MAX: 500,
} as const;

/**
 * Number Limits
 */
export const NUMBER_LIMITS = {
  QUANTITY_MIN: 1,
  QUANTITY_MAX: 999999,
  PRICE_MIN: 0.01,
  PRICE_MAX: 999999999.99,
} as const;
