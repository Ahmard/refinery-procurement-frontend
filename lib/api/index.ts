/**
 * API Client Layer - Central Export
 * 
 * All API endpoints and client utilities are exported from here
 */

// Core client
export { apiClient } from './client';
export type { ApiResponse } from './client';

// Auth endpoints
export { authApi } from './auth';
export type { LoginRequest, LoginResponseData, UserProfile } from './auth';

// Catalog endpoints
export { catalogApi } from './catalog';
export type {
  CatalogSearchParams,
  CatalogItemResponse,
  CatalogListResponse,
} from './catalog';

// Procurement endpoints
export { procurementApi } from './procurement';
export type {
  PurchaseOrderStatus,
  POFilters,
  POItemResponse,
  StatusHistoryEntry,
  PurchaseOrderResponse,
  PurchaseOrderCreateRequest,
  PurchaseOrderItemRequest,
} from './procurement';

// Admin endpoints
export { adminApi } from './admin';
export type {
  SupplierResponse,
  SupplierCreateRequest,
  SuppliersListResponse,
} from './admin';
