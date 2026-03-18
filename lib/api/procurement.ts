import apiClient, { ApiResponse } from './client';
import { procurement } from '@/lib/config/env';

/**
 * Purchase Order status enum
 */
export type PurchaseOrderStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'FULFILLED';

/**
 * PO filters for list/search
 */
export interface POFilters {
  status?: PurchaseOrderStatus;
  supplier_id?: string;
  created_by?: string;
  page?: number;
  page_size?: number;
}

/**
 * PO item in response
 */
export interface POItemResponse {
  id: string;
  catalog_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  snapshot_lead_time?: number;
}

/**
 * Status history entry
 */
export interface StatusHistoryEntry {
  status: PurchaseOrderStatus;
  created_at: string;
  created_by: string;
}

/**
 * Purchase Order response
 */
export interface PurchaseOrderResponse {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  items: POItemResponse[];
  total_amount: number | string;
  requestor?: string;
  cost_center?: string;
  payment_terms?: string;
  needed_by_date?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  status_history: StatusHistoryEntry[];
}

/**
 * PO create request
 */
export interface PurchaseOrderCreateRequest {
  supplier_id: string;
  requestor?: string;
  cost_center?: string;
  payment_terms?: string;
  needed_by_date?: string;
}

/**
 * PO item add request
 */
export interface PurchaseOrderItemRequest {
  item_id: string; // catalog secondary_id
  quantity: number;
}

/**
 * Paginated PO list response
 */
export interface POListResponse {
  total_pages: number;
  total_records: number;
  records: PurchaseOrderResponse[];
}

/**
 * Procurement/Purchase Order API endpoints
 */
export const procurementApi = {
  /**
   * List/search purchase orders
   * GET /procurement/purchase-orders
   */
  list: async (params: POFilters): Promise<ApiResponse<POListResponse>> => {
    const response = await apiClient.get<ApiResponse<POListResponse>>(
      '/procurement/purchase-orders',
      { params, baseURL: procurement }
    );
    return response.data;
  },

  /**
   * Create draft purchase order
   * POST /procurement/purchase-orders
   */
  createDraft: async (
    data: PurchaseOrderCreateRequest,
    idempotencyKey: string
  ): Promise<ApiResponse<PurchaseOrderResponse>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrderResponse>>(
      '/procurement/purchase-orders',
      data,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        baseURL: procurement,
      }
    );
    return response.data;
  },

  /**
   * Add item to purchase order
   * POST /procurement/purchase-orders/:id/items
   */
  addItem: async (
    orderId: string,
    item: PurchaseOrderItemRequest
  ): Promise<ApiResponse<PurchaseOrderResponse>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrderResponse>>(
      `/procurement/purchase-orders/${orderId}/items`,
      item,
      { baseURL: procurement }
    );
    return response.data;
  },

  /**
   * Submit purchase order for approval
   * POST /procurement/purchase-orders/:id/submit
   */
  submitOrder: async (orderId: string): Promise<ApiResponse<PurchaseOrderResponse>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrderResponse>>(
      `/procurement/purchase-orders/${orderId}/submit`,
      undefined,
      { baseURL: procurement }
    );
    return response.data;
  },

  /**
   * Get purchase order details
   * GET /procurement/purchase-orders/:id
   */
  getDetails: async (orderId: string): Promise<ApiResponse<PurchaseOrderResponse>> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrderResponse>>(
      `/procurement/purchase-orders/${orderId}`,
      { baseURL: procurement }
    );
    return response.data;
  },
};
