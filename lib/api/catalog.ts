import apiClient, { ApiResponse } from './client';
import { catalog } from '@/lib/config/env';

/**
 * Catalog search query parameters
 */
export interface CatalogSearchParams {
  q?: string; // Search query
  category?: string;
  supplier_id?: string;
  in_stock?: boolean;
  page?: number;
  page_size?: number;
  sort?: string;
}

/**
 * Catalog item response (list/search)
 */
export interface CatalogItemResponse {
  id: string;
  secondary_id: string;
  name: string;
  category: string;
  supplier_id: string;
  manufacturer?: string;
  model?: string;
  price_usd: number | string;
  lead_time_days?: number;
  in_stock?: boolean;
  specs?: Record<string, any>;
}

/**
 * Paginated catalog response
 */
export interface CatalogListResponse {
  total_pages: number;
  total_records: number;
  records: CatalogItemResponse[];
}

/**
 * Catalog API endpoints
 */
export const catalogApi = {
  /**
   * Search/catalog items with filters
   * GET /catalog/items
   */
  search: async (params: CatalogSearchParams): Promise<ApiResponse<CatalogListResponse>> => {
    const response = await apiClient.get<ApiResponse<CatalogListResponse>>(
      '/catalog/items',
      { params, baseURL: catalog }
    );
    return response.data;
  },

  /**
   * Get catalog item details by ID
   * GET /catalog/items/:id
   */
  getItemDetails: async (id: string): Promise<ApiResponse<CatalogItemResponse>> => {
    const response = await apiClient.get<ApiResponse<CatalogItemResponse>>(
      `/catalog/items/${id}`,
      { baseURL: catalog }
    );
    return response.data;
  },

  /**
   * Get compatible items for a catalog item
   * GET /catalog/items/:id/compatible
   */
  getCompatibleItems: async (id: string): Promise<ApiResponse<CatalogItemResponse[]>> => {
    const response = await apiClient.get<ApiResponse<CatalogItemResponse[]>>(
      `/catalog/items/${id}/compatible`,
      { baseURL: catalog }
    );
    return response.data;
  },
};
