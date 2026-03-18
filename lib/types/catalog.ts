/**
 * Catalog Types & API Responses
 */

import type { BaseEntity, Uuid, DecimalString } from './common';

/**
 * Catalog Category Enum
 */
export enum CatalogCategory {
  PUMPS = 'PUMPS',
  VALVES = 'VALVES',
  FITTINGS = 'FITTINGS',
  TUBING = 'TUBING',
  INSTRUMENTATION = 'INSTRUMENTATION',
  ELECTRICAL = 'ELECTRICAL',
  MECHANICAL = 'MECHANICAL',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER',
}

export interface CatalogItemResponse extends BaseEntity {
  secondary_id: string;
  name: string;
  category: CatalogCategory;
  supplier_id: Uuid;
  manufacturer?: string;
  model?: string;
  price_usd: DecimalString;
  lead_time_days?: number;
  in_stock?: boolean;
  specs?: Record<string, any>;
}

/**
 * Catalog Item Detail (same as response for now, can be extended)
 */
export type CatalogItemDetail = CatalogItemResponse;

/**
 * Catalog Search Filters
 */
export interface CatalogFilters {
  search?: string;
  category?: CatalogCategory | string;
  supplier_id?: Uuid;
  in_stock?: boolean;
  min_price?: number | string;
  max_price?: number | string;
  sort_by?: 'price' | 'lead_time' | 'name' | 'supplier';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

/**
 * Catalog List Response (paginated)
 */
export interface CatalogListResponse {
  items: CatalogItemResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Compatible Items Response
 */
export interface CompatibleItemsResponse {
  compatible_items: CatalogItemResponse[];
  total: number;
}
