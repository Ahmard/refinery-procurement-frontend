/**
 * Purchase Order Types & API Responses
 */

import type { BaseEntity, Uuid, DecimalString, DateTime, DateOnly } from './common';

/**
 * Purchase Order Status Enum
 */
export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
}

/**
 * Purchase Order Item Response Schema
 */
export interface PurchaseOrderItemResponse extends BaseEntity {
  catalog_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: DecimalString;
  total_price: DecimalString;
  snapshot_lead_time?: number;
}

/**
 * Status History Entry
 */
export interface POStatusHistoryEntry {
  status: PurchaseOrderStatus;
  created_at: DateTime;
  created_by: Uuid;
}

/**
 * Purchase Order Response Schema
 */
export interface PurchaseOrderResponse extends BaseEntity {
  po_number: string;
  supplier_id: Uuid;
  supplier_name: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItemResponse[];
  total_amount: DecimalString;
  requestor?: string;
  cost_center?: string;
  payment_terms?: string;
  needed_by_date?: DateOnly;
  created_at: DateTime;
  updated_at: DateTime;
  submitted_at?: DateTime;
  status_history: POStatusHistoryEntry[];
}

/**
 * Purchase Order Create Request
 */
export interface PurchaseOrderCreateRequest {
  supplier_id: Uuid;
  requestor?: string;
  cost_center?: string;
  payment_terms?: string;
  needed_by_date?: DateOnly;
}

/**
 * Purchase Order Item Request (Add to PO)
 */
export interface PurchaseOrderItemRequest {
  item_id: string; // catalog secondary_id
  quantity: number;
}

/**
 * Purchase Order Search Request (Query Params)
 */
export interface PurchaseOrderSearchRequest {
  status?: PurchaseOrderStatus | string;
  supplier_id?: Uuid;
  created_by?: Uuid;
  page?: number;
  page_size?: number;
}

/**
 * Purchase Order List Response (paginated)
 */
export interface PurchaseOrderListResponse {
  purchase_orders: PurchaseOrderResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Draft Purchase Order (client-side state)
 */
export interface DraftPurchaseOrder {
  id?: Uuid; // Temporary ID for client-side draft
  supplier_id?: Uuid;
  supplier_name?: string;
  items: Map<string, DraftPOItem>; // Map<catalog_item_id, DraftPOItem>
  requestor?: string;
  cost_center?: string;
  payment_terms?: string;
  needed_by_date?: DateOnly;
  created_at: DateTime;
}

/**
 * Draft Purchase Order Item (client-side state)
 */
export interface DraftPOItem {
  catalog_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: DecimalString;
  total_price: DecimalString;
  lead_time_days?: number;
  specs?: Record<string, any>;
}
