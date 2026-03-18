import apiClient, { ApiResponse } from './client';
import { admin } from '@/lib/config/env';

/**
 * Supplier response
 */
export interface SupplierResponse {
  id: string;
  user_id: string;
  created_by: string;
  name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Supplier create request
 */
export interface SupplierCreateRequest {
  name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
}

/**
 * Paginated suppliers response
 */
export interface SuppliersListResponse {
  total_pages: number;
  total_records: number;
  records: SupplierResponse[];
}

/**
 * Admin API endpoints
 */
export const adminApi = {
  /**
   * List all suppliers with pagination
   * GET /admin/suppliers
   */
  listSuppliers: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<ApiResponse<SuppliersListResponse>> => {
    const response = await apiClient.get<ApiResponse<SuppliersListResponse>>(
      '/suppliers',
      { params, baseURL: admin }
    );
    return response.data;
  },

  /**
   * Get supplier by ID
   * GET /admin/suppliers/:id
   */
  getSupplier: async (id: string): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.get<ApiResponse<SupplierResponse>>(
      `/suppliers/${id}`,
      { baseURL: admin }
    );
    return response.data;
  },

  /**
   * Create new supplier
   * POST /admin/suppliers
   */
  createSupplier: async (
    data: SupplierCreateRequest
  ): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.post<ApiResponse<SupplierResponse>>(
      '/suppliers',
      data,
      { baseURL: admin }
    );
    return response.data;
  },

  /**
   * Seed catalog data
   * POST /admin/system/catalog/seed
   */
  seedCatalog: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.post<ApiResponse<{ count: number }>>(
      '/system/catalog/seed',
      undefined,
      { baseURL: admin }
    );
    return response.data;
  },
};
